/**
 * HexBackground — Ari uyali chiziqlar + ingichka elektron zarralar
 * Elektronlar hex qirralar bo'ylab yorug' chiziq sifatida yuguradi
 */
import React, { useEffect, useRef } from 'react';

interface Point    { x: number; y: number }
interface Segment  { a: Point; b: Point }
interface Electron {
    seg:    Segment;
    t:      number;   // 0‒1 progress
    speed:  number;
    hue:    number;   // HSL hue
    trailPts: Point[];
}

const ELECTRON_COUNT = 55;
const HEX_SIZE       = 42;
const TRAIL_LEN      = 26;   // kanta uzunligi (segment soni)

/* Hexagon grid segmentlari */
function buildSegments(W: number, H: number, size: number): Segment[] {
    const segs: Segment[] = [];
    const hx = size * 1.5;
    const hy = size * Math.sqrt(3);
    const cols = Math.ceil(W / hx) + 3;
    const rows = Math.ceil(H / hy) + 3;

    for (let c = -1; c < cols; c++) {
        for (let r = -1; r < rows; r++) {
            const cx = c * hx;
            const cy = r * hy + (c % 2 !== 0 ? hy / 2 : 0);
            const verts: Point[] = Array.from({ length: 6 }, (_, i) => {
                const a = (Math.PI / 3) * i - Math.PI / 6;
                return { x: cx + size * Math.cos(a), y: cy + size * Math.sin(a) };
            });
            for (let i = 0; i < 6; i++) {
                const a = verts[i], b = verts[(i + 1) % 6];
                if (a.x < b.x || (Math.abs(a.x - b.x) < 0.5 && a.y < b.y))
                    segs.push({ a, b });
            }
        }
    }
    return segs;
}

/* Nuqtaga yaqin segment uchlarini topish */
function adjacent(pt: Point, segs: Segment[]): Segment[] {
    const EPS = 1.5;
    return segs.filter(s =>
        (Math.abs(s.a.x - pt.x) < EPS && Math.abs(s.a.y - pt.y) < EPS) ||
        (Math.abs(s.b.x - pt.x) < EPS && Math.abs(s.b.y - pt.y) < EPS)
    );
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

const HexBackground: React.FC = () => {
    const ref = useRef<HTMLCanvasElement>(null);
    const raf = useRef(0);

    useEffect(() => {
        const cv  = ref.current;
        if (!cv) return;
        const ctx = cv.getContext('2d');
        if (!ctx) return;

        let W = 0, H = 0;
        let segs: Segment[] = [];
        const elecs: Electron[] = [];

        function mkElectron(t0?: number): Electron {
            const seg = segs[Math.floor(Math.random() * segs.length)];
            return {
                seg,
                t:    t0 ?? Math.random(),
                speed: 0.0055 + Math.random() * 0.009,
                hue:  160 + Math.random() * 80,   // cyan–teal–green zone
                trailPts: [],
            };
        }

        function resize() {
            W = window.innerWidth;
            H = window.innerHeight;
            cv!.width  = W;
            cv!.height = H;
            segs = buildSegments(W, H, HEX_SIZE);
            elecs.length = 0;
            for (let i = 0; i < ELECTRON_COUNT; i++) elecs.push(mkElectron());
        }

        function drawHexGrid() {
            ctx!.save();
            ctx!.strokeStyle = 'rgba(80,185,220,0.18)';
            ctx!.lineWidth   = 0.9;
            ctx!.beginPath();
            for (const s of segs) {
                ctx!.moveTo(s.a.x, s.a.y);
                ctx!.lineTo(s.b.x, s.b.y);
            }
            ctx!.stroke();

            // Junction dots
            ctx!.fillStyle = 'rgba(60,180,220,0.22)';
            const junctions = new Set<string>();
            for (const s of segs) {
                for (const p of [s.a, s.b]) {
                    const k = `${Math.round(p.x)},${Math.round(p.y)}`;
                    if (!junctions.has(k)) {
                        junctions.add(k);
                        ctx!.beginPath();
                        ctx!.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
                        ctx!.fill();
                    }
                }
            }
            ctx!.restore();
        }

        function drawElectrons() {
            for (const e of elecs) {
                const px = lerp(e.seg.a.x, e.seg.b.x, e.t);
                const py = lerp(e.seg.a.y, e.seg.b.y, e.t);

                // Keep trail
                e.trailPts.unshift({ x: px, y: py });
                if (e.trailPts.length > TRAIL_LEN) e.trailPts.length = TRAIL_LEN;

                const pts = e.trailPts;
                if (pts.length < 2) continue;

                // Draw trail as a glowing line
                for (let i = 1; i < pts.length; i++) {
                    const frac  = 1 - i / pts.length;   // 1 at head, 0 at tail
                    const alpha = frac * frac * 0.85;   // smooth fade
                    const w     = frac * 2.2;           // thinner at tail

                    ctx!.save();
                    ctx!.strokeStyle = `hsla(${e.hue},90%,65%,${alpha})`;
                    ctx!.lineWidth   = w;
                    ctx!.shadowColor = `hsla(${e.hue},90%,70%,${alpha * 0.8})`;
                    ctx!.shadowBlur  = 6;
                    ctx!.beginPath();
                    ctx!.moveTo(pts[i - 1].x, pts[i - 1].y);
                    ctx!.lineTo(pts[i].x, pts[i].y);
                    ctx!.stroke();
                    ctx!.restore();
                }

                // Head glow
                ctx!.save();
                const g = ctx!.createRadialGradient(px, py, 0, px, py, 7);
                g.addColorStop(0, `hsla(${e.hue},100%,80%,0.95)`);
                g.addColorStop(0.4, `hsla(${e.hue},90%,65%,0.6)`);
                g.addColorStop(1, `hsla(${e.hue},90%,65%,0)`);
                ctx!.fillStyle   = g;
                ctx!.shadowColor = `hsla(${e.hue},100%,80%,0.9)`;
                ctx!.shadowBlur  = 14;
                ctx!.beginPath();
                ctx!.arc(px, py, 7, 0, Math.PI * 2);
                ctx!.fill();
                ctx!.restore();

                // Tiny core dot
                ctx!.save();
                ctx!.fillStyle   = `hsla(${e.hue},100%,92%,0.95)`;
                ctx!.shadowColor = `hsla(${e.hue},100%,80%,1)`;
                ctx!.shadowBlur  = 8;
                ctx!.beginPath();
                ctx!.arc(px, py, 1.5, 0, Math.PI * 2);
                ctx!.fill();
                ctx!.restore();
            }
        }

        function tick() {
            ctx!.clearRect(0, 0, W, H);
            drawHexGrid();
            drawElectrons();

            // Update each electron
            for (let i = 0; i < elecs.length; i++) {
                const e = elecs[i];
                e.t += e.speed;

                if (e.t >= 1) {
                    // Jump to adjacent segment
                    const endPt = e.seg.b;
                    const adj = adjacent(endPt, segs);
                    if (adj.length > 0 && Math.random() > 0.08) {
                        const next = adj[Math.floor(Math.random() * adj.length)];
                        const fromA = Math.abs(next.a.x - endPt.x) < 1.5 && Math.abs(next.a.y - endPt.y) < 1.5;
                        e.seg = fromA ? next : { a: next.b, b: next.a };
                        e.t   = 0;
                    } else {
                        elecs[i] = mkElectron(0);
                    }
                }
            }

            raf.current = requestAnimationFrame(tick);
        }

        window.addEventListener('resize', resize);
        resize();
        raf.current = requestAnimationFrame(tick);
        return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(raf.current); };
    }, []);

    return (
        <canvas
            ref={ref}
            style={{
                position: 'fixed', inset: 0,
                width: '100%', height: '100%',
                zIndex: 0, pointerEvents: 'none',
            }}
            aria-hidden="true"
        />
    );
};

export default HexBackground;
