import { useEffect, useRef } from "react";

const GLYPHS = " .·:-=+*#%@";
const ACCENT = "124, 255, 178";
const INK = "233, 231, 226";
const FPS = 30;

interface Pulse {
  x: number;
  y: number;
  born: number;
}

// Full-viewport ASCII field. Drifts on its own, brightens around the pointer,
// ripples on tap/click and shifts with scroll. Static frame under reduced motion.
const AsciiField = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: -9999, y: -9999, active: false };
    const pulses: Pulse[] = [];
    let cellW = 10;
    let cellH = 16;
    let cols = 0;
    let rows = 0;
    let frame = 0;
    let last = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const small = window.innerWidth < 640;
      cellW = small ? 9 : 10;
      cellH = small ? 14 : 16;
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${small ? 11 : 12}px "JetBrains Mono", ui-monospace, monospace`;
      ctx.textBaseline = "top";
      cols = Math.ceil(window.innerWidth / cellW);
      rows = Math.ceil(window.innerHeight / cellH);
    };

    const draw = (now: number) => {
      const t = now / 1000;
      const vh = window.innerHeight;
      const scrollY = window.scrollY;
      const phase = scrollY * 0.004;
      // Strongest behind the mast, quieter behind reading sections.
      const strength = 1 - 0.6 * Math.min(scrollY / (vh * 1.2), 1);

      while (pulses.length && t - pulses[0].born > 1.4) pulses.shift();

      ctx.clearRect(0, 0, window.innerWidth, vh);

      // Bucket cells by colour so fillStyle changes stay few.
      const buckets: [number, number, string][][] = [[], [], [], [], []];

      for (let r = 0; r < rows; r++) {
        const py = r * cellH + cellH / 2;
        for (let c = 0; c < cols; c++) {
          const px = c * cellW + cellW / 2;

          const wave =
            Math.sin(c * 0.085 + t * 0.55 + Math.sin(r * 0.07 - t * 0.3 + phase) * 1.9) *
            Math.cos(r * 0.11 - t * 0.35 + phase * 1.6 + c * 0.02);
          let v = Math.max(0, wave) ** 2.4 * 0.55 * strength;

          let lit = 0;
          if (pointer.active) {
            const d = Math.hypot(px - pointer.x, py - pointer.y);
            lit += Math.exp(-((d / 130) ** 2)) * 0.75;
          }
          for (const p of pulses) {
            const age = t - p.born;
            const d = Math.hypot(px - p.x, py - p.y);
            lit += Math.exp(-(((d - age * 420) / 26) ** 2)) * (1 - age / 1.4) * 0.9;
          }
          v += lit;

          const g = Math.min(GLYPHS.length - 1, Math.floor(v * (GLYPHS.length - 1)));
          if (g <= 0) continue;

          const bucket = lit > 0.3 ? 4 : v > 0.6 ? 3 : v > 0.4 ? 2 : v > 0.2 ? 1 : 0;
          buckets[bucket].push([c * cellW, r * cellH, GLYPHS[g]]);
        }
      }

      const styles = [`rgba(${INK},0.08)`, `rgba(${INK},0.14)`, `rgba(${INK},0.22)`, `rgba(${INK},0.32)`, `rgba(${ACCENT},0.5)`];
      buckets.forEach((cells, i) => {
        if (!cells.length) return;
        ctx.fillStyle = styles[i];
        for (const [x, y, ch] of cells) ctx.fillText(ch, x, y);
      });
    };

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (now - last < 1000 / FPS) return;
      last = now;
      draw(now);
    };

    resize();

    if (reduced) {
      draw(0);
      const onResize = () => {
        resize();
        draw(0);
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };
    const onDown = (e: PointerEvent) => {
      pulses.push({ x: e.clientX, y: e.clientY, born: performance.now() / 1000 });
      if (pulses.length > 6) pulses.shift();
    };
    const onLeave = () => {
      pointer.active = false;
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") pointer.active = false;
    };
    const onVisibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden) frame = requestAnimationFrame(loop);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} className="ascii-field" aria-hidden />;
};

export default AsciiField;
