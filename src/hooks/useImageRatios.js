import { useEffect, useState, useCallback } from 'react';
import { getCloudinaryUrl } from '../utils/cloudinaryHelpers';

// Cache global: publicId -> rasio (width / height). Dipakai bersama oleh Work & ProjectDetail.
const ratioCache = new Map();
const pending = new Set();

/**
 * Membaca rasio asli gambar dari Cloudinary (memuat versi kecil 200px saja),
 * jadi layout otomatis mengikuti gambar yang di-upload tanpa perlu menulis rasio manual.
 * Mengembalikan fungsi getRatio(img) -> number (fallback 1 sebelum gambar termuat).
 */
export default function useImageRatios(images) {
  const [, setVersion] = useState(0);

  useEffect(() => {
    let alive = true;
    let queued = false;
    const bump = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        if (alive) setVersion((v) => v + 1);
      });
    };

    images.forEach((img) => {
      const id = img?.publicId;
      if (!id || ratioCache.has(id)) return;
      if (pending.has(id)) {
        // sedang dimuat oleh pemanggil lain; cek lagi nanti
        const t = setInterval(() => {
          if (ratioCache.has(id)) {
            clearInterval(t);
            bump();
          }
        }, 150);
        return;
      }
      pending.add(id);
      const el = new Image();
      el.onload = () => {
        ratioCache.set(id, el.naturalWidth / el.naturalHeight || 1);
        pending.delete(id);
        bump();
      };
      el.onerror = () => {
        ratioCache.set(id, 1);
        pending.delete(id);
        bump();
      };
      el.src = getCloudinaryUrl(img, { width: 200, crop: 'limit', gravity: null, quality: '40' });
    });

    return () => {
      alive = false;
    };
  }, [images]);

  return useCallback((img) => ratioCache.get(img?.publicId) || 1, []);
}
