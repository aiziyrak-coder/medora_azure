"""
Send parsed vitals to Django backend and broadcast via WebSocket.
"""
import logging
from typing import Any, Dict, List, Optional, Set, Tuple
import httpx
from fastapi import WebSocket

from .config import get_backend_url, get_ingest_api_key, MonitorConfig

logger = logging.getLogger(__name__)

# WebSocket subscribers (broadcast vitals to dashboard)
_ws_subscribers: Set[WebSocket] = set()


def add_ws_subscriber(ws: WebSocket) -> None:
    _ws_subscribers.add(ws)


def remove_ws_subscriber(ws: WebSocket) -> None:
    _ws_subscribers.discard(ws)


async def broadcast_vitals(payload: Dict[str, Any]) -> None:
    import json
    dead = set()
    msg = json.dumps(payload)
    for ws in _ws_subscribers:
        try:
            await ws.send_text(msg)
        except Exception:
            dead.add(ws)
    for ws in dead:
        _ws_subscribers.discard(ws)


def _parse_monitors(data: dict) -> List[MonitorConfig]:
    """Parse monitors list from gateway-monitors response (TCP: gateway -> device)."""
    if not data.get("success") or not isinstance(data.get("monitors"), list):
        return []
    out = []
    for m in data["monitors"]:
        try:
            out.append(MonitorConfig(**m))
        except Exception:
            continue
    return out


def _parse_hl7_client_map(data: dict) -> Dict[str, str]:
    """Parse hl7_client_map: client_ip -> device_id (qurilma serverga ulanganda IP orqali aniqlash)."""
    lst = data.get("hl7_client_map")
    if not isinstance(lst, list):
        return {}
    return {str(item.get("host", "")).strip(): str(item.get("device_id", "")).strip() for item in lst if item.get("host") and item.get("device_id")}


async def fetch_gateway_monitors() -> Tuple[List[MonitorConfig], Dict[str, str], Optional[str]]:
    """
    GET /api/monitoring/gateway-monitors/.
    Returns (tcp_monitors, hl7_client_map_dict, default_device_id).
    - default_device_id: bitta qurilma bo'lsa backend beradi; IP/HL7 ID bo'lmasa shu ishlatiladi.
    """
    base = get_backend_url()
    url = f"{base}/monitoring/gateway-monitors/"
    api_key = get_ingest_api_key()
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            r = await client.get(
                url,
                headers={"X-API-Key": api_key, "Content-Type": "application/json"},
            )
            if r.status_code == 200:
                data = r.json()
                monitors = _parse_monitors(data)
                hl7_map = _parse_hl7_client_map(data)
                default_id = (data.get("default_device_id") or "").strip() or None
                return (monitors, hl7_map, default_id)
    except Exception as e:
        logger.debug("Fetch gateway monitors: %s", e)
    return ([], {}, None)


async def send_to_backend(device_id: str, payload: Dict[str, Any]) -> bool:
    """POST to Django /api/monitoring/ingest/. Returns True if success."""
    base = get_backend_url()
    url = f"{base}/monitoring/ingest/"
    api_key = get_ingest_api_key()
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            r = await client.post(
                url,
                json=payload,
                headers={"X-API-Key": api_key, "Content-Type": "application/json"},
            )
            if r.status_code in (200, 201):
                return True
            err = r.text
            try:
                body = r.json()
                err = body.get("error") or err
            except Exception:
                pass
            logger.warning("Backend ingest %s: %s — %s (qurilma topilmadi yoki bemor biriktirilmagan)", device_id, r.status_code, err)
            return False
    except Exception as e:
        logger.warning("Backend ingest failed %s: %s", device_id, e)
        return False
