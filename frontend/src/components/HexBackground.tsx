/**
 * HexBackground — Animatsion ari uyali + elektron zarrachalar foni
 * Canvas asosida: hexagon grid + glow elektronlar hexagon qirralarida harakat qiladi
 */
import React, { useEffect, useRef } from 'react';

interface Point { x: number; y: number; }
interface Segment { a: Point; b: Point; }
interface Electron {
    seg: Segment;
    t: number;      // 0–1 progress along segment
    speed: number;
    trail: number;  // trail length (0–1)
    color: string;
    size: number;
    trailPoints: { x: number; y: number; alpha: number }[];
}

const COLORS = [
    'rgba(56,189,248,',   // sky-400
    'rgba(34,211,238,',   // cyan-400
    'rgba(52,211,153,',   // emerald-400
    'rgba(99,179,237,',   // blue-300
    'rgba(167,243,208,',  // green-200
    'rgba(147,197,253,',  // blue-200
];

function getHexSegments(W: number, H: number, size: number): Segment[] {
    const segments: Segment[] = [];
    const w = size * 2;
    const h = Math.sqrt(3) * size;
    const cols = Math.ceil(W / (w * 0.75)) + 2;
    const rows = Math.ceil(H / h) + 2;

    for (let col = -1; col < cols; col++) {
        for (let row = -1; row < rows; row++) {
            const cx = col * w * 0.75;
            const cy = row * h + (col % 2 === 0 ? 0 : h / 2);
            // 6 vertices of the hexagon
            const pts: Point[] = [];
            for (let i = 0; i < 6; i++) {
                const angle = Math.PI / 180 * (60 * i - 30);
                pts.push({ x: cx + size * Math.cos(angle), y: cy + size * Math.sin(angle) });
            }
            // 6 edges — only add each edge once to avoid duplicates
            for (let i = 0; i < 6; i++) {
                const a = pts[i];
                const b = pts[(i + 1) % 6];
                // Simple dedup: only push edges where a.x <= b.x or (a.x===b.x && a.y<b.y)
                if (a.x < b.x || (Math.abs(a.x - b.x) < 0.1 && a.y < b.y)) {
                    segments.push({ a, b });
                }
            }
        }
    }
    return segments;
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

const HexBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let W = 0, H = 0;
        const HEX_SIZE = 36;
        let segments: Segment[] = [];
        const electrons: Electron[] = [];
        const ELECTRON_COUNT = 40;

        function resize() {
            W = window.innerWidth;
            H = window.innerHeight;
            canvas!.width  = W;
            canvas!.height = H;
            segments = getHexSegments(W, H, HEX_SIZE);
            // Repopulate electrons on resize
            electrons.length = 0;
            for (let i = 0; i < ELECTRON_COUNT; i++) {
                spawnElectron(true);
            }
        }

        function spawnElectron(immediate = false) {
            if (segments.length === 0) return;
            const seg = segments[Math.floor(Math.random() * segments.length)];
            const colorBase = COLORS[Math.floor(Math.random() * COLORS.length)];
            electrons.push({
                seg,
                t: immediate ? Math.random() : 0,
                speed: 0.003 + Math.random() * 0.006,
                trail: 0.18 + Math.random() * 0.22,
                color: colorBase,
                size: 1.5 + Math.random() * 2,
                trailPoints: [],
            });
        }

        function drawGrid() {
            ctx!.save();
            ctx!.strokeStyle = 'rgba(100,190,230,0.09)';
            ctx!.lineWidth = 0.8;
            for (const seg of segments) {
                ctx!.beginPath();
                ctx!.moveTo(seg.a.x, seg.a.y);
                ctx!.lineTo(seg.b.x, seg.b.y);
                ctx!.stroke();
            }
            ctx!.restore();
        }

        function drawElectrons() {
            for (const e of electrons) {
                const x = lerp(e.seg.a.x, e.seg.b.x, e.t);
                const y = lerp(e.seg.a.y, e.seg.b.y, e.t);

                // Add current pos to trail
                e.trailPoints.unshift({ x, y, alpha: 1 });
                const maxTrail = Math.floor(e.trail * 40) + 5;
                if (e.trailPoints.length > maxTrail) e.trailPoints.length = maxTrail;

                // Draw trail
                for (let i = 1; i < e.trailPoints.length; i++) {
                    const frac = 1 - i / e.trailPoints.length;
                    ctx!.beginPath();
                    ctx!.arc(
                        e.trailPoints[i].x,
                        e.trailPoints[i].y,
                        e.size * frac * 0.7,
                        0, Math.PI * 2
                    );
                    ctx!.fillStyle = e.color + (frac * 0.55) + ')';
                    ctx!.fill();
                }

                // Draw electron glow
                const grd = ctx!.createRadialGradient(x, y, 0, x, y, e.size * 5);
                grd.addColorStop(0, e.color + '0.95)');
                grd.addColorStop(0.4, e.color + '0.5)');
                grd.addColorStop(1, e.color + '0)');
                ctx!.beginPath();
                ctx!.arc(x, y, e.size * 5, 0, Math.PI * 2);
                ctx!.fillStyle = grd;
                ctx!.fill();

                // Core dot
                ctx!.beginPath();
                ctx!.arc(x, y, e.size, 0, Math.PI * 2);
                ctx!.fillStyle = e.color + '1)';
                ctx!.shadowColor = e.color + '0.9)';
                ctx!.shadowBlur = 10;
                ctx!.fill();
                ctx!.shadowBlur = 0;
            }
        }

        function tick() {
            ctx!.clearRect(0, 0, W, H);

            drawGrid();
            drawElectrons();

            // Update electrons
            for (let i = electrons.length - 1; i >= 0; i--) {
                const e = electrons[i];
                e.t += e.speed;
                if (e.t >= 1) {
                    // Electron reached end of segment → jump to a connected or random segment
                    const endPt = e.seg.b;
                    // Find adjacent segments sharing this endpoint
                    const adjacent = segments.filter(s =>
                        (Math.abs(s.a.x - endPt.x) < 1 && Math.abs(s.a.y - endPt.y) < 1) ||
                        (Math.abs(s.b.x - endPt.x) < 1 && Math.abs(s.b.y - endPt.y) < 1)
                    );
                    if (adjacent.length > 0 && Math.random() > 0.1) {
                        const next = adjacent[Math.floor(Math.random() * adjacent.length)];
                        // Orient so we start from endPt
                        const startFromA = Math.abs(next.a.x - endPt.x) < 1 && Math.abs(next.a.y - endPt.y) < 1;
                        e.seg = startFromA ? next : { a: next.b, b: next.a };
                        e.t = 0;
                        e.trailPoints = [];
                    } else {
                        // Respawn elsewhere
                        electrons.splice(i, 1);
                        spawnElectron(false);
                    }
                }
            }

            // Maintain electron count
            while (electrons.length < ELECTRON_COUNT) spawnElectron(false);

            animRef.current = requestAnimationFrame(tick);
        }

        window.addEventListener('resize', resize);
        resize();
        animRef.current = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                inset: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none',
            }}
            aria-hidden="true"
        />
    );
};

export default HexBackground;
