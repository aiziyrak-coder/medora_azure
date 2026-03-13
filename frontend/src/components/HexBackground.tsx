/**
 * HexBackground — Haqiqiy ari uyali (honeycomb) + random yo'nalishli elektron zarrachalar
 */
import React, { useEffect, useRef } from 'react';

const HEX_R      = 38;       // hexagon radius (px)
const EL_COUNT   = 48;       // elektron soni
const TRAIL      = 28;       // trail uzunligi

interface Vec2 { x: number; y: number }
interface Electron {
    x: number; y: number;
    vx: number; vy: number;
    hue: number;
    size: number;
    trail: Vec2[];
    pulse: number;   // pulsing phase
}

/* Hexagon vertex points (flat-top) */
function hexPts(cx: number, cy: number, r: number): Vec2[] {
    return Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 180) * (60 * i);
        return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
    });
}

function mkElectron(W: number, H: number): Electron {
    const speed = 0.6 + Math.random() * 1.2;
    const angle = Math.random() * Math.PI * 2;
    return {
        x:     Math.random() * W,
        y:     Math.random() * H,
        vx:    Math.cos(angle) * speed,
        vy:    Math.sin(angle) * speed,
        hue:   155 + Math.random() * 85,
        size:  2 + Math.random() * 2.5,
        trail: [],
        pulse: Math.random() * Math.PI * 2,
    };
}

const HexBackground: React.FC = () => {
    const ref = useRef<HTMLCanvasElement>(null);
    const raf = useRef(0);

    useEffect(() => {
        const cv  = ref.current;
        if (!cv) return;
        const ctx = cv.getContext('2d');
        if (!ctx) return;

        let W = 0, H = 0, frame = 0;
        const els: Electron[] = [];

        function resize() {
            W = window.innerWidth;
            H = window.innerHeight;
            cv!.width  = W;
            cv!.height = H;
            els.length = 0;
            for (let i = 0; i < EL_COUNT; i++) els.push(mkElectron(W, H));
        }

        /* ─── Draw honeycomb grid ─── */
        function drawHoneycomb() {
            const w = HEX_R * Math.sqrt(3);    // hex width (flat-top)
            const h = HEX_R * 2;               // hex height

            const cols = Math.ceil(W / w) + 2;
            const rows = Math.ceil(H / (h * 0.75)) + 3;

            ctx!.save();

            // Slight pulse based on frame
            const pulse = 0.04 + Math.sin(frame * 0.008) * 0.02;

            for (let row = -1; row < rows; row++) {
                for (let col = -1; col < cols; col++) {
                    const cx = col * w + (row % 2 === 0 ? 0 : w / 2);
                    const cy = row * h * 0.75;
                    const pts = hexPts(cx, cy, HEX_R);

                    // Subtle alternating fill
                    const alt = (row + col) % 3;
                    const fillAlpha = alt === 0 ? pulse * 0.6 : alt === 1 ? pulse * 0.4 : pulse * 0.2;

                    ctx!.beginPath();
                    ctx!.moveTo(pts[0].x, pts[0].y);
                    for (let i = 1; i < 6; i++) ctx!.lineTo(pts[i].x, pts[i].y);
                    ctx!.closePath();

                    // Fill — very subtle tinted
                    const fillH = 185 + alt * 15;
                    ctx!.fillStyle = `hsla(${fillH},60%,65%,${fillAlpha})`;
                    ctx!.fill();

                    // Stroke — hex edges
                    ctx!.strokeStyle = `rgba(56,189,220,0.2)`;
                    ctx!.lineWidth   = 1;
                    ctx!.stroke();
                }
            }

            ctx!.restore();
        }

        /* ─── Draw electrons ─── */
        function drawElectrons() {
            for (const e of els) {
                const pts = e.trail;
                if (pts.length < 2) continue;

                // Trail line
                ctx!.save();
                ctx!.lineCap  = 'round';
                ctx!.lineJoin = 'round';

                for (let i = 1; i < pts.length; i++) {
                    const frac = 1 - i / pts.length;
                    ctx!.beginPath();
                    ctx!.moveTo(pts[i - 1].x, pts[i - 1].y);
                    ctx!.lineTo(pts[i].x, pts[i].y);
                    ctx!.strokeStyle = `hsla(${e.hue},90%,65%,${frac * frac * 0.8})`;
                    ctx!.lineWidth   = frac * e.size * 1.2;
                    ctx!.shadowColor = `hsla(${e.hue},90%,70%,${frac * 0.5})`;
                    ctx!.shadowBlur  = 6;
                    ctx!.stroke();
                }
                ctx!.restore();

                // Glow halo
                ctx!.save();
                const glow = ctx!.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.size * 6);
                glow.addColorStop(0, `hsla(${e.hue},100%,80%,0.9)`);
                glow.addColorStop(0.5, `hsla(${e.hue},90%,65%,0.4)`);
                glow.addColorStop(1, `hsla(${e.hue},90%,65%,0)`);
                ctx!.fillStyle   = glow;
                ctx!.shadowColor = `hsla(${e.hue},100%,75%,0.8)`;
                ctx!.shadowBlur  = 18;
                ctx!.beginPath();
                ctx!.arc(e.x, e.y, e.size * 6, 0, Math.PI * 2);
                ctx!.fill();
                ctx!.restore();

                // Core
                ctx!.save();
                const bright = Math.sin(e.pulse) * 0.5 + 0.5;
                ctx!.fillStyle   = `hsla(${e.hue},100%,${85 + bright * 15}%,0.95)`;
                ctx!.shadowColor = `hsla(${e.hue},100%,80%,1)`;
                ctx!.shadowBlur  = 12;
                ctx!.beginPath();
                ctx!.arc(e.x, e.y, e.size, 0, Math.PI * 2);
                ctx!.fill();
                ctx!.restore();
            }
        }

        /* ─── Update electrons ─── */
        function updateElectrons() {
            for (const e of els) {
                e.pulse += 0.08;

                // Random direction nudge
                if (Math.random() < 0.02) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = Math.hypot(e.vx, e.vy);
                    e.vx = e.vx * 0.7 + Math.cos(angle) * speed * 0.3;
                    e.vy = e.vy * 0.7 + Math.sin(angle) * speed * 0.3;
                }

                // Gentle hexagon center attraction (makes them follow honeycomb vaguely)
                if (Math.random() < 0.015) {
                    const w = HEX_R * Math.sqrt(3);
                    const h = HEX_R * 2;
                    const col = Math.round(e.x / w);
                    const row = Math.round(e.y / (h * 0.75));
                    const cx  = col * w + (row % 2 === 0 ? 0 : w / 2);
                    const cy  = row * h * 0.75;
                    const dx  = cx - e.x, dy = cy - e.y;
                    const dist= Math.hypot(dx, dy) || 1;
                    e.vx += (dx / dist) * 0.3;
                    e.vy += (dy / dist) * 0.3;
                }

                // Speed cap
                const spd = Math.hypot(e.vx, e.vy);
                if (spd > 2.2) { e.vx = e.vx / spd * 2.2; e.vy = e.vy / spd * 2.2; }
                if (spd < 0.5) {
                    const a = Math.random() * Math.PI * 2;
                    e.vx = Math.cos(a) * 0.8; e.vy = Math.sin(a) * 0.8;
                }

                e.x += e.vx; e.y += e.vy;

                // Bounce off edges
                if (e.x < 0)     { e.x = 0;  e.vx =  Math.abs(e.vx); }
                if (e.x > W)     { e.x = W;  e.vx = -Math.abs(e.vx); }
                if (e.y < 0)     { e.y = 0;  e.vy =  Math.abs(e.vy); }
                if (e.y > H)     { e.y = H;  e.vy = -Math.abs(e.vy); }

                // Trail
                e.trail.unshift({ x: e.x, y: e.y });
                if (e.trail.length > TRAIL) e.trail.length = TRAIL;
            }
        }

        /* ─── Animation loop ─── */
        function tick() {
            frame++;
            ctx!.clearRect(0, 0, W, H);

            drawHoneycomb();
            drawElectrons();
            updateElectrons();

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
