'use client';

import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    
    // Respect user preferences for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Using the 'muted' gray color from the site's palette (#63666F)
    const RGB_COLOR = '99, 102, 111';

    // Particle class for generating and animating individual stars/dots
    class Particle {
      x: number;
      y: number;
      size: number;
      baseOpacity: number;
      opacity: number;
      speedY: number;
      speedX: number;
      twinkleSpeed: number;
      twinklePhase: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 1.5 + 1; // 1px to 2.5px for subtle depth
        this.baseOpacity = Math.random() * 0.4 + 0.15; // 0.15 to 0.55 opacity
        this.opacity = this.baseOpacity;
        
        // Very slow drifting: creates a subtle, non-distracting ambient effect
        this.speedY = (Math.random() - 0.5) * 0.2;
        this.speedX = (Math.random() - 0.5) * 0.15;
        
        // Subtle twinkling parameters (opacity pulsing)
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
        this.twinklePhase = Math.random() * Math.PI * 2;
      }

      update(width: number, height: number, isStatic: boolean) {
        if (!isStatic) {
          // Move particle slowly
          this.y += this.speedY;
          this.x += this.speedX;

          // Wrap around edges for an infinite, seamless loop
          if (this.y < 0) this.y = height;
          if (this.y > height) this.y = 0;
          if (this.x < 0) this.x = width;
          if (this.x > width) this.x = 0;

          // Calculate current opacity with sine wave for smooth twinkling
          this.twinklePhase += this.twinkleSpeed;
          this.opacity = this.baseOpacity + Math.sin(this.twinklePhase) * 0.1;
          
          if (this.opacity < 0) this.opacity = 0;
          if (this.opacity > 1) this.opacity = 1;
        }
      }

      draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fillStyle = `rgba(${RGB_COLOR}, ${this.opacity})`;
        context.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      // Adjust particle count based on screen size for performance (less on mobile)
      const particleCount = window.innerWidth < 768 ? 60 : 150;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const render = () => {
      // Clear the canvas for the next frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connecting lines between particles
      const maxDistance = 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            // Lines fade out as distance increases
            const lineOpacity = (1 - distance / maxDistance) * 0.15;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${RGB_COLOR}, ${lineOpacity})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Update and draw each particle
      particles.forEach((particle) => {
        particle.update(canvas.width, canvas.height, prefersReducedMotion);
        particle.draw(ctx);
      });

      // Continue the loop if motion is allowed
      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Initial render / start animation loop
    render();

    // Cleanup to prevent memory leaks when component unmounts
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[-1] pointer-events-none"
      aria-hidden="true"
    />
  );
}
