import { useState, useEffect, useRef } from 'react';

/**
 * Transisi pergantian gambar bergaya blur:
 * gambar lama makin kabur + memudar, gambar baru muncul dari kabur menjadi tajam
 * (hanya blur + fade, tanpa zoom).
 *
 * Memakai CSS transition biasa (bukan library animasi) supaya perilakunya sama di semua halaman.
 * Dipakai sebagai pengganti StripeTransition / LiquidTransition (props sengaja dibuat mirip).
 */
const BLUR = 'blur(28px)';
const CLEAR = 'blur(0px)';
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export default function BlurTransition({
  firstImageSrc,
  secondImageSrc,
  duration = 1.2,
  className = '',
  imgClassName = '',
}) {
  const [ready, setReady] = useState(false);
  const rootRef = useRef(null);

  // Preload gambar baru supaya animasi tidak mulai sebelum gambar siap.
  // (Parent memberi `key` per gambar, jadi komponen selalu mulai dengan ready = false.)
  useEffect(() => {
    const img = new Image();
    const start = () => {
      // paksa browser menghitung gaya awal (kabur/transparan) dulu, baru ubah ke gaya akhir -> transisi berjalan
      if (rootRef.current) void rootRef.current.offsetWidth;
      setReady(true);
    };
    img.onload = start;
    img.onerror = start;
    img.src = secondImageSrc;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [secondImageSrc]);

  const transition = `opacity ${duration}s ${EASE}, filter ${duration}s ${EASE}`;

  return (
    <div ref={rootRef} className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Gambar lama: kabur lalu hilang (tidak dirender jika sama dengan gambar baru) */}
      {firstImageSrc && firstImageSrc !== secondImageSrc && (
        <div
          className={`absolute inset-0 bg-cover bg-center ${imgClassName}`}
          style={{
            backgroundImage: `url(${firstImageSrc})`,
            opacity: ready ? 0 : 1,
            filter: ready ? BLUR : CLEAR,
            transition,
          }}
        />
      )}

      {/* Gambar baru: dari kabur menjadi tajam */}
      <div
        className={`absolute inset-0 bg-cover bg-center ${imgClassName}`}
        style={{
          backgroundImage: `url(${secondImageSrc})`,
          opacity: ready ? 1 : 0,
          filter: ready ? CLEAR : BLUR,
          transition,
        }}
      />
    </div>
  );
}
