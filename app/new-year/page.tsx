"use client"

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation"
import dog3 from "@/assets/dog3.gif";

export default function NewYear() {
  // const [_, setLocation] = useLocation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  const handleRestart = () => {
    router.push("/");
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // --- Configuration ---
    const colors = [
      "#FF6B6B", // Coral
      "#FFD93D", // Gold
      "#4D96FF", // Blue
      "#6BCB77", // Green
      "#FF9F45", // Orange
      "#F47C7C", // Light Red
    ];

    // --- Classes ---

    class Star {
      x: number;
      y: number;
      size: number;
      opacity: number;
      speed: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2;
        this.opacity = Math.random();
        this.speed = 0.01 + Math.random() * 0.02;
      }

      update() {
        this.opacity += this.speed;
        if (this.opacity > 1 || this.opacity < 0) {
          this.speed = -this.speed;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(this.opacity)})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class Balloon {
      x: number;
      y: number;
      radius: number;
      color: string;
      speed: number;
      swing: number;
      swingSpeed: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 100;
        this.radius = 15 + Math.random() * 15;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.speed = 1 + Math.random() * 2;
        this.swing = 0;
        this.swingSpeed = 0.02 + Math.random() * 0.03;
      }

      update() {
        this.y -= this.speed;
        this.swing += this.swingSpeed;
        this.x += Math.sin(this.swing) * 0.5;

        // Reset if goes off top
        if (this.y < -50) {
          this.y = height + 50;
          this.x = Math.random() * width;
        }
      }

      draw() {
        if (!ctx) return;
        // Balloon body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.radius, this.radius * 1.2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Shine
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.beginPath();
        ctx.ellipse(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.2, this.radius * 0.3, -0.5, 0, Math.PI * 2);
        ctx.fill();

        // String
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.radius * 1.15);
        ctx.quadraticCurveTo(
          this.x + Math.sin(this.swing * 2) * 5,
          this.y + this.radius * 2,
          this.x,
          this.y + this.radius * 3
        );
        ctx.stroke();
      }
    }

    class Particle {
      x: number;
      y: number;
      color: string;
      radius: number;
      velocity: { x: number; y: number };
      alpha: number;
      friction: number;
      gravity: number;

      constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = Math.random() * 3 + 1;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        this.velocity = {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed
        };
        this.alpha = 1;
        this.friction = 0.98;
        this.gravity = 0.05;
      }

      update() {
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.015;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    class Firework {
      x: number;
      y: number;
      targetY: number;
      color: string;
      velocity: { x: number; y: number };
      exploded: boolean;
      particles: Particle[];

      constructor() {
        this.x = Math.random() * (width * 0.8) + width * 0.1;
        this.y = height;
        this.targetY = Math.random() * (height * 0.5);
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.velocity = { x: 0, y: - (Math.random() * 3 + 8) }; // Initial speed
        this.exploded = false;
        this.particles = [];
      }

      update() {
        if (!this.exploded) {
          this.y += this.velocity.y;
          this.velocity.y += 0.1; // Gravity on rising rocket
          
          if (this.velocity.y >= 0 || this.y <= this.targetY) {
            this.explode();
          }
        } else {
          this.particles.forEach((p, index) => {
            p.update();
            if (p.alpha <= 0) this.particles.splice(index, 1);
          });
        }
      }

      explode() {
        this.exploded = true;
        for (let i = 0; i < 50; i++) {
          this.particles.push(new Particle(this.x, this.y, this.color));
        }
      }

      draw() {
        if (!ctx) return;
        if (!this.exploded) {
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
          ctx.fill();
          // Trail
          ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
          ctx.beginPath();
          ctx.arc(this.x, this.y + 5, 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          this.particles.forEach(p => p.draw());
        }
      }
    }

    // --- Initialization ---
    const stars: Star[] = [];
    const balloons: Balloon[] = [];
    let fireworks: Firework[] = [];

    for (let i = 0; i < 100; i++) stars.push(new Star());
    for (let i = 0; i < 15; i++) balloons.push(new Balloon());

    // --- Animation Loop ---
    let frameId: number;
    let timer = 0;

    const animate = () => {
      if (!ctx) return;
      ctx.fillStyle = "#0F172A"; // Clear with BG color
      ctx.fillRect(0, 0, width, height);

      // Draw Stars
      stars.forEach(star => {
        star.update();
        star.draw();
      });

      // Draw Balloons
      balloons.forEach(balloon => {
        balloon.update();
        balloon.draw();
      });

      // Manage Fireworks
      if (timer % 40 === 0) { // Launch new firework every ~40 frames
        fireworks.push(new Firework());
      }
      timer++;

      fireworks.forEach((fw, index) => {
        fw.update();
        fw.draw();
        if (fw.exploded && fw.particles.length === 0) {
          fireworks.splice(index, 1);
        }
      });

      frameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0F172A] flex flex-col items-center justify-center text-white">
      {/* Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Content Layer */}
      <div className="z-10 text-center space-y-8 animate-in fade-in zoom-in duration-1000 p-4">
        <h1 className="text-8xl md:text-9xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#FF6B6B] via-[#FFD93D] to-[#4D96FF] drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
          2026
        </h1>
        <p className="text-2xl md:text-3xl font-body text-[#FFD93D] tracking-widest uppercase font-bold drop-shadow-md">
          Happy New Year
        </p>
        <p className="text-xl md:text-2xl text-[#FFD93D] font-cartoon tracking-widest uppercase drop-shadow-md">
          亲爱的宝宝，2026新年快乐！希望我们可以一直开开心心，健康快乐！我们可以更爱对方，互相理解。我很期待明年我们的婚礼！宝宝我爱你！
          —臭猪
        </p>
        <div className="text-center flex justify-center">
          <img src={dog3.src} className="w-32 h-32 rounded-md" />
        </div>
        <div className="pt-12">
           <Button 
             variant="outline" 
             size="icon"
             className="rounded-full h-16 w-16 bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-md transition-all hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
             onClick={handleRestart}
           >
             <RotateCcw className="h-8 w-8" />
           </Button>
           <p className="text-sm mt-3 font-cartoon text-[#FFD93D]">重新回顾</p>
        </div>
      </div>
    </div>
  );
}
