"use client";

import React, { useEffect, useRef } from "react";

class Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.baseX = x;
    this.baseY = y;
    this.vx = 0;
    this.vy = 0;
  }

  draw(ctx: CanvasRenderingContext2D, color: string) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  update(mouseX: number, mouseY: number) {
    // Distance from mouse
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Radius of repulsion area
    const maxDistance = 100;
    
    if (distance < maxDistance && distance > 0) {
      const forceDirectionX = dx / distance;
      const forceDirectionY = dy / distance;
      
      // Repel strength (stronger when closer)
      const force = (maxDistance - distance) / maxDistance;
      const pushX = forceDirectionX * force * 15;
      const pushY = forceDirectionY * force * 15;
      
      this.vx -= pushX;
      this.vy -= pushY;
    }
    
    // Spring physics back to base position
    const dxBase = this.baseX - this.x;
    const dyBase = this.baseY - this.y;
    
    const springForceX = dxBase * 0.08;
    const springForceY = dyBase * 0.08;
    
    this.vx += springForceX;
    this.vy += springForceY;
    
    // Friction / damping
    this.vx *= 0.85;
    this.vy *= 0.85;
    
    this.x += this.vx;
    this.y += this.vy;
  }
}

export const InteractiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    
    // Track mouse coordinates
    const mouse = {
      x: -1000,
      y: -1000
    };

    // Calculate spacing based on screen resolution
    const spacing = 32;

    const initParticles = () => {
      particles = [];
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      canvas.width = width;
      canvas.height = height;

      // Seed particles on a grid
      for (let x = spacing / 2; x < width; x += spacing) {
        for (let y = spacing / 2; y < height; y += spacing) {
          particles.push(new Particle(x, y));
        }
      }
    };

    initParticles();

    // Mouse listeners globally on window
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    
    const handleResize = () => {
      initParticles();
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Determine theme color dynamically
      const themeAttr = document.documentElement.getAttribute("data-theme");
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches || themeAttr === "dark";
      
      let dotColor = isDark ? "rgba(255, 255, 255, 0.35)" : "rgba(0, 0, 0, 0.35)";
      if (themeAttr === "hacker") {
        dotColor = "rgba(57, 255, 20, 0.35)"; // Terminal green (#39ff14)
      }

      for (let i = 0; i < particles.length; i++) {
        particles[i].update(mouse.x, mouse.y);
        particles[i].draw(ctx, dotColor);
      }
      
      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanups
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0, // 0 ensures it sits in front of the body background but behind relative children
        pointerEvents: "none", // Allows clicks to pass through to buttons/inputs
        backgroundColor: "transparent"
      }}
    />
  );
};
