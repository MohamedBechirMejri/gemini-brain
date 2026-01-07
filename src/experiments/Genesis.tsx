import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hue: number;
  size: number;
}

export const Genesis = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      const count = Math.floor((canvas.width * canvas.height) / 10000); // Density based
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        hue: Math.random() * 360,
        size: Math.random() * 2 + 1,
      }));
    };

    const animate = () => {
      if (!canvas || !ctx) return;

      // Fade trail
      ctx.fillStyle = "rgba(15, 15, 15, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      particles.forEach(p => {
        // Physics
        p.x += p.vx;
        p.y += p.vy;

        // Interaction
        if (mouse) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            const force = (200 - dist) / 200;
            p.vx += (dx / dist) * force * 0.1;
            p.vy += (dy / dist) * force * 0.1;
            p.hue += 2;
          }
        }

        // Friction and Bounds
        p.vx *= 0.99;
        p.vy *= 0.99;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${p.hue}, 70%, 60%)`;
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", e => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    });

    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", background: "#0f0f0f" }}
    />
  );
};
