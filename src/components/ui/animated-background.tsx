
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

    // Health & wellness product objects
    const objects: Array<{
      x: number;
      y: number;
      z: number;
      rotX: number;
      rotY: number;
      rotZ: number;
      size: number;
      type: 'medicine_bottle' | 'vitamin_jar' | 'protein_powder' | 'fitness_tracker' | 'soap' | 'sunscreen' | 'medical_device' | 'supplement_box';
      color: string;
      speed: number;
      label?: string;
    }> = [];

    // Initialize health product objects
    for (let i = 0; i < 20; i++) {
      const types = ['medicine_bottle', 'vitamin_jar', 'protein_powder', 'fitness_tracker', 'soap', 'sunscreen', 'medical_device', 'supplement_box'] as const;
      const colors = [
        'hsl(213, 94%, 68%)', // Blue
        'hsl(262, 83%, 58%)', // Purple
        'hsl(173, 58%, 39%)', // Teal
        'hsl(43, 89%, 70%)',  // Yellow
        'hsl(120, 60%, 50%)', // Green
        'hsl(0, 70%, 60%)',   // Red
        'hsl(280, 60%, 60%)', // Magenta
        'hsl(30, 80%, 60%)'   // Orange
      ];
      
      objects.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 500 + 100,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        size: Math.random() * 60 + 30,
        type: types[Math.floor(Math.random() * types.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 0.015 + 0.003
      });
    }

    let animationId: number;
    let time = 0;

    const drawHealthProduct = (obj: typeof objects[0], x: number, y: number, size: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(obj.rotZ);

      // Set up gradient for 3D effect
      const objGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
      objGradient.addColorStop(0, obj.color);
      objGradient.addColorStop(1, obj.color.replace(/\d+%/, '25%'));

      ctx.fillStyle = objGradient;
      ctx.globalAlpha = 0.7;

      switch (obj.type) {
        case 'medicine_bottle':
          // Draw bottle shape
          ctx.fillRect(-size/4, -size/2, size/2, size);
          // Bottle cap
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.fillRect(-size/3, -size/2 - size/6, size/1.5, size/6);
          // Label
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fillRect(-size/5, -size/4, size/2.5, size/3);
          break;

        case 'vitamin_jar':
          // Draw cylindrical jar
          ctx.beginPath();
          ctx.ellipse(0, size/3, size/2, size/6, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillRect(-size/2, -size/3, size, size/1.5);
          // Lid
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.beginPath();
          ctx.ellipse(0, -size/3, size/2, size/8, 0, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'protein_powder':
          // Large container
          ctx.fillRect(-size/2.5, -size/2, size/1.25, size);
          // Scoop handle visible
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.fillRect(size/4, -size/3, size/8, size/2);
          // Label
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fillRect(-size/3, -size/6, size/1.5, size/4);
          break;

        case 'fitness_tracker':
          // Watch face
          ctx.beginPath();
          ctx.arc(0, 0, size/3, 0, Math.PI * 2);
          ctx.fill();
          // Screen
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.fillRect(-size/6, -size/12, size/3, size/6);
          // Band segments
          ctx.fillStyle = obj.color;
          for (let i = 0; i < 3; i++) {
            ctx.fillRect(-size/8, size/3 + i * size/8, size/4, size/12);
            ctx.fillRect(-size/8, -size/3 - i * size/8, size/4, size/12);
          }
          break;

        case 'soap':
          // Soap bar
          ctx.beginPath();
          ctx.roundRect(-size/3, -size/4, size/1.5, size/2, size/8);
          ctx.fill();
          // Soap bubbles effect
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * size/2 - size/4, Math.random() * size/2 - size/4, size/20, 0, Math.PI * 2);
            ctx.fill();
          }
          break;

        case 'sunscreen':
          // Tube shape
          ctx.fillRect(-size/5, -size/2, size/2.5, size);
          // Cap
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.fillRect(-size/4, -size/2 - size/8, size/2, size/8);
          // Sun symbol on label
          ctx.fillStyle = 'rgba(255, 200, 0, 0.8)';
          ctx.beginPath();
          ctx.arc(0, 0, size/8, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'medical_device':
          // Stethoscope-like device
          ctx.strokeStyle = obj.color;
          ctx.lineWidth = size/15;
          ctx.beginPath();
          ctx.arc(0, 0, size/3, 0, Math.PI);
          ctx.stroke();
          // Ear pieces
          ctx.beginPath();
          ctx.arc(-size/3, -size/6, size/12, 0, Math.PI * 2);
          ctx.arc(size/3, -size/6, size/12, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'supplement_box':
          // Box shape
          ctx.fillRect(-size/2, -size/3, size, size/1.5);
          // Box flaps
          ctx.fillStyle = obj.color.replace(/\d+%/, '40%');
          ctx.fillRect(-size/2, -size/3, size, size/8);
          // Plus symbol for health
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fillRect(-size/12, -size/6, size/6, size/3);
          ctx.fillRect(-size/4, -size/12, size/2, size/6);
          break;
      }

      ctx.restore();
    };

    const animate = () => {
      time += 0.008;
      
      // Clear canvas with darker gradient background for better button visibility
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'hsl(213, 94%, 8%)');   // Darker blue
      gradient.addColorStop(0.3, 'hsl(262, 83%, 12%)'); // Darker purple
      gradient.addColorStop(0.7, 'hsl(173, 58%, 10%)'); // Darker teal
      gradient.addColorStop(1, 'hsl(213, 94%, 8%)');    // Darker blue
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw health product objects
      objects.forEach((obj, index) => {
        // Update rotation
        obj.rotX += obj.speed;
        obj.rotY += obj.speed * 1.1;
        obj.rotZ += obj.speed * 0.7;

        // Update position with gentle floating motion
        obj.y += Math.sin(time + index) * 0.4;
        obj.x += Math.cos(time * 0.4 + index) * 0.2;

        // Wrap around screen
        if (obj.x > canvas.width + 100) obj.x = -100;
        if (obj.x < -100) obj.x = canvas.width + 100;
        if (obj.y > canvas.height + 100) obj.y = -100;
        if (obj.y < -100) obj.y = canvas.height + 100;

        // Calculate 3D projection
        const perspective = 1000;
        const scale = perspective / (perspective + obj.z);
        const x = obj.x * scale;
        const y = obj.y * scale;
        const size = obj.size * scale;

        // Only draw if object is reasonably sized and visible
        if (size > 10) {
          drawHealthProduct(obj, x, y, size);
        }
      });

      // Add subtle floating particles for ambiance
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      for (let i = 0; i < 30; i++) {
        const particleX = (Math.sin(time * 0.5 + i) * 200 + canvas.width/2 + i * 30) % canvas.width;
        const particleY = (Math.cos(time * 0.3 + i) * 100 + canvas.height/2 + i * 25) % canvas.height;
        const particleSize = Math.sin(time + i) * 1.5 + 2;
        
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
