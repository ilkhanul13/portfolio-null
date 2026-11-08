import { useRef, useEffect } from 'react';
import gsap from 'gsap';

const RADIUS = 60;

const XRayText = ({ children, className, overlayClassName }) => {
  const containerRef = useRef(null);
  const outlineRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const outline = outlineRef.current;
    if (!container || !outline) return;

    // Posisi kursor terakhir (viewport). null = kursor di luar window.
    let pointer = null;
    let isActive = false;

    // Dilacak di level window supaya tetap jalan walau ada elemen lain
    // (mis. baris project yang menumpuk) menutupi teks ini.
    const update = () => {
      if (!pointer) return;
      const rect = container.getBoundingClientRect();
      const x = pointer.x - rect.left;
      const y = pointer.y - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;

      if (inside) {
        isActive = true;
        gsap.to(outline, {
          clipPath: `circle(${RADIUS}px at ${x}px ${y}px)`,
          duration: 0.2,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        container.style.cursor = 'crosshair';
      } else if (isActive) {
        deactivate();
      }
    };

    const deactivate = () => {
      isActive = false;
      container.style.cursor = '';
      gsap.to(outline, {
        clipPath: 'circle(0px at 50% 50%)',
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    const handleMove = (e) => {
      pointer = { x: e.clientX, y: e.clientY };
      update();
    };

    const handleLeaveWindow = () => {
      pointer = null;
      if (isActive) deactivate();
    };

    // Saat scroll/sticky, teks bergerak tanpa kursor bergerak -> hitung ulang.
    const handleScroll = () => update();

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleLeaveWindow);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('scroll', handleScroll);
      document.documentElement.removeEventListener('mouseleave', handleLeaveWindow);
      gsap.killTweensOf(outline);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative inline-block isolate"
    >
      {/* LAYER 1: BASE TEXT (SOLID WHITE) */}
      <div className={`${className} text-white`}>
        {children}
      </div>

      {/* LAYER 2: OVERLAY TEXT (BLACK FILL + OUTLINE) */}
      <div
        ref={outlineRef}
        className={`absolute inset-0 z-10 pointer-events-none will-change-[clip-path] ${className} ${overlayClassName || ''}`}
        aria-hidden="true"
        style={{
          clipPath: 'circle(0px at 50% 50%)',
          color: 'black', // Warna FILL harus sama dengan Background Website (Hitam)
          WebkitTextStroke: '1.5px #d2ff00',
          textStroke: '1.5px #d2ff00',
          paintOrder: 'stroke fill',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default XRayText;
