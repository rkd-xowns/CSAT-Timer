import React, { useState, useEffect, useRef } from 'react';
import { Fireworks } from '@fireworks-js/react';

// --- Custom Shape Explosion Component ---
const ShapeExplosion = ({ shape }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const particles = [];
    let rocket;

    class Particle {
      constructor(x, y, vx, vy, color) {
        this.x = x; this.y = y; this.vx = vx; this.vy = vy;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.01;
        this.color = color;
      }
      update() {
        this.x += this.vx; this.y += this.vy; this.vy += 0.02;
        this.alpha -= this.decay;
      }
      draw() {
        ctx.globalAlpha = this.alpha; ctx.fillStyle = this.color;
        ctx.beginPath(); ctx.arc(this.x, this.y, 2, 0, Math.PI * 2); ctx.fill();
      }
    }
    
    class Rocket {
        constructor(targetY) {
            this.x = width / 2;
            this.y = height;
            this.targetY = targetY;
            this.alpha = 1;
        }
        update() {
            const dy = this.targetY - this.y;
            this.y += dy * 0.08;
            if (Math.abs(dy) < 10) {
              this.alpha -= 0.1;
            }
        }
        draw() {
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const createBurst = (burstX, burstY) => {
      const pointCount = 250;
      const scale = Math.min(width, height) * 0.035;

      for (let i = 0; i < pointCount; i++) {
        const angle = (Math.PI * 2 * i) / pointCount;
        let x, y, color;

        if (shape === 'heart') {
          x = scale * 16 * Math.pow(Math.sin(angle), 3);
          y = -scale * (13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle));
          color = `hsl(${Math.random() * 30 - 15 + 360}, 100%, 80%)`;
        } else if (shape === 'clover') {
          const r = Math.sin(2 * angle) * Math.cos(2 * angle) * 20;
          x = r * Math.cos(angle) * scale * 0.5;
          y = r * Math.sin(angle) * scale * 0.5;
          color = `hsl(${Math.random() * 30 + 90}, 100%, 80%)`;
        }

        const velocity = Math.random() * 1.5 + 2;
        const vx = x / (scale * 8) * velocity;
        const vy = y / (scale * 8) * velocity;
        particles.push(new Particle(burstX, burstY, vx, vy, color));
      }
    };

    let animationFrameId;
    const animate = () => {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'; 
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';
      
      if (rocket) {
        rocket.draw();
        rocket.update();
        if (rocket.alpha <= 0) {
            createBurst(rocket.x, rocket.y);
            rocket = null;
        }
      }
      
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (p.alpha <= 0) particles.splice(i, 1);
        else { p.update(); p.draw(); }
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    
    const handleResize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', handleResize);
    
    setTimeout(() => {
        rocket = new Rocket(height / 3);
    }, 1000);

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [shape]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', position:'absolute', zIndex: 100000 }} />;
};


// --- Main Event Controller Component ---
const FireworksEvent = ({ introText = [], outroText = [], finaleType = 'flashy', onComplete }) => {
  const [currentText, setCurrentText] = useState('');
  const [showFinaleShape, setShowFinaleShape] = useState(false);
  const fireworksRef = useRef(null);

  useEffect(() => {
    const fw = fireworksRef.current;
    if (!fw) return;

    const introDuration = introText.length * 6000;
    const outroDuration = outroText.length * 6000;
    const totalDuration = 26000;
    const fireworksDuration = totalDuration;
    const highlightDuration = 30;
    const paradeEndTime = fireworksDuration - highlightDuration;

    const allTimers = [];

    // Intro Text
    if (introDuration > 0) {
      setCurrentText(introText[0]);
      for (let i = 1; i < introText.length; i++) {
        allTimers.push(setTimeout(() => setCurrentText(introText[i]), i * 6000));
      }
      allTimers.push(setTimeout(() => setCurrentText(''), introDuration));
    }

    // Fireworks Parade
    const paradeInterval = setInterval(() => {
      if (fw) fw.launch(1, { rocketsPoint: { min: 0, max: 100 } });
    }, 800);
    allTimers.push(paradeInterval);
    allTimers.push(setTimeout(() => clearInterval(paradeInterval), paradeEndTime));

    // Highlight Firework
    allTimers.push(setTimeout(() => {
      if (finaleType === 'heart' || finaleType === 'clover') {
        setShowFinaleShape(true);
      } else { // 'flashy'
        if (fw) fw.launch(10, { rocketsPoint: { min: 20, max: 80 }, particles: 250, explosion: 12, traceSpeed: 3 });
      }
    }, paradeEndTime));
    allTimers.push(setTimeout(() => setShowFinaleShape(false), paradeEndTime + highlightDuration));

    // Outro Text
    if (outroDuration > 0) {
      const outroStartTime = totalDuration - outroDuration;
      allTimers.push(setTimeout(() => setCurrentText(outroText[0]), outroStartTime));
      for (let i = 1; i < outroText.length; i++) {
        allTimers.push(setTimeout(() => setCurrentText(outroText[i]), outroStartTime + i * 6000));
      }
    }

    // End Event
    allTimers.push(setTimeout(() => {
      if (onComplete) onComplete();
    }, totalDuration));
    
    return () => allTimers.forEach(timer => { clearTimeout(timer); clearInterval(timer); });
  }, [introText, outroText, finaleType, onComplete]);

  return (
    <>
      <style>{`
        .event-text {
          position: fixed; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          font-size: clamp(2rem, 8vw, 4rem); font-weight: bold;
          color: white; text-shadow: 0 0 15px black;
          z-index: 100001; white-space: nowrap;
          animation: text-fade-in 1s ease-out;
        }
        @keyframes text-fade-in {
          from { opacity: 0; transform: translate(-50%, -40%); }
          to { opacity: 1; transform: translate(-50%, -50%); }
        }
      `}</style>
      <Fireworks
        ref={fireworksRef}
        options={{ opacity: 0.5 }}
        style={{
          top: 0, left: 0, width: '100%', height: '100%',
          position: 'fixed', background: 'rgba(0, 0, 0, 0.85)', zIndex: 9999
        }}
      />
      {showFinaleShape && <ShapeExplosion shape={finaleType} />}
      {currentText && <div className="event-text">{currentText}</div>}
    </>
  );
};

export default FireworksEvent;