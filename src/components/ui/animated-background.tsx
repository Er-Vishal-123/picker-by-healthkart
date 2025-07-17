
import { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 3D objects for warehouse theme
    const objects: Array<{
      x: number;
      y: number;
      z: number;
      rotX: number;
      rotY: number;
      rotZ: number;
      size: number;
      type: 'box' | 'cylinder' | 'sphere';
      color: string;
      speed: number;
    }> = [];

    // Initialize objects
    for (let i = 0; i < 15; i++) {
      objects.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 500 + 100,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        size: Math.random() * 80 + 40,
        type: ['box', 'cylinder', 'sphere'][Math.floor(Math.random() * 3)] as 'box' | 'cylinder' | 'sphere',
        color: ['hsl(213, 94%, 68%)', 'hsl(262, 83%, 58%)', 'hsl(173, 58%, 39%)', 'hsl(43, 89%, 70%)'][Math.floor(Math.random() * 4)],
        speed: Math.random() * 0.02 + 0.005
      });
    }

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.01;
      
      // Clear canvas with gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'hsl(213, 94%, 15%)');
      gradient.addColorStop(0.5, 'hsl(262, 83%, 20%)');
      gradient.addColorStop(1, 'hsl(173, 58%, 15%)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw objects
      objects.forEach((obj, index) => {
        // Update rotation
        obj.rotX += obj.speed;
        obj.rotY += obj.speed * 1.2;
        obj.rotZ += obj.speed * 0.8;

        // Update position with floating motion
        obj.y += Math.sin(time + index) * 0.5;
        obj.x += Math.cos(time * 0.5 + index) * 0.3;

        // Wrap around screen
        if (obj.x > canvas.width + 100) obj.x = -100;
        if (obj.x < -100) obj.x = canvas.width + 100;
        if (obj.y > canvas.height + 100) obj.y = -100;
        if (obj.y < -100) obj.y = canvas.height + 100;

        // Calculate 3D projection
        const perspective = 800;
        const scale = perspective / (perspective + obj.z);
        const x = obj.x * scale;
        const y = obj.y * scale;
        const size = obj.size * scale;

        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);

        // Set up gradient for 3D effect
        const objGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
        objGradient.addColorStop(0, obj.color);
        objGradient.addColorStop(1, obj.color.replace('68%)', '30%)').replace('58%)', '25%)').replace('39%)', '20%)').replace('70%)', '35%)'));

        ctx.fillStyle = objGradient;
        ctx.globalAlpha = 0.8;

        // Draw different shapes based on type
        if (obj.type === 'box') {
          ctx.rotate(obj.rotZ);
          ctx.fillRect(-size/2, -size/2, size, size);
          
          // Add wireframe effect
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 2;
          ctx.strokeRect(-size/2, -size/2, size, size);
        } else if (obj.type === 'cylinder') {
          ctx.rotate(obj.rotY);
          ctx.beginPath();
          ctx.ellipse(0, 0, size/2, size/3, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Add highlight
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else {
          // Sphere
          ctx.beginPath();
          ctx.arc(0, 0, size/2, 0, Math.PI * 2);
          ctx.fill();
          
          // Add shine effect
          const shineGradient = ctx.createRadialGradient(-size/4, -size/4, 0, 0, 0, size/2);
          shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
          shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = shineGradient;
          ctx.fill();
        }

        ctx.restore();
      });

      // Add floating particles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      for (let i = 0; i < 50; i++) {
        const particleX = (Math.sin(time + i) * 100 + canvas.width/2 + i * 20) % canvas.width;
        const particleY = (Math.cos(time * 0.8 + i) * 50 + canvas.height/2 + i * 15) % canvas.height;
        const particleSize = Math.sin(time + i) * 2 + 3;
        
        ctx.beginPath();
        ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
};

export default AnimatedBackground;
