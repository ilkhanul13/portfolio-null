import { useState, useEffect, useMemo } from 'react';

/**
 * Layout baris "justified" (seperti bento Griflan): setiap baris punya tinggi seragam,
 * lebar tiap item mengikuti rasio gambarnya (16:9 melebar, portrait menyempit), tanpa crop.
 *
 * columns: { base: [..], md: [..], lg: [..] } -> pola jumlah item per baris (diulang).
 *          contoh lg: [3, 2] => baris 3 item, baris 2 item, 3, 2, ...
 */
function useBreakpoint() {
  const get = () => {
    if (typeof window === 'undefined') return 'base';
    if (window.matchMedia('(min-width: 1024px)').matches) return 'lg';
    if (window.matchMedia('(min-width: 768px)').matches) return 'md';
    return 'base';
  };
  const [bp, setBp] = useState(get);
  useEffect(() => {
    const onChange = () => setBp(get());
    const mqs = [window.matchMedia('(min-width: 1024px)'), window.matchMedia('(min-width: 768px)')];
    mqs.forEach((m) => m.addEventListener('change', onChange));
    return () => mqs.forEach((m) => m.removeEventListener('change', onChange));
  }, []);
  return bp;
}

export default function JustifiedRows({
  items,
  getRatio,
  getKey,
  renderItem,
  isFeatured,
  columns = { base: [1], md: [2], lg: [3] },
  gap = 8,
  className = '',
}) {
  const bp = useBreakpoint();
  const pattern = columns[bp] || columns.base || [1];

  const rows = useMemo(() => {
    const out = [];
    let i = 0;
    let p = 0;
    while (i < items.length) {
      // item "featured" mendapat baris sendiri (lebar penuh) dan tidak memajukan pola
      if (isFeatured && isFeatured(items[i])) {
        out.push({ target: 1, items: [items[i]] });
        i += 1;
        continue;
      }
      const target = pattern[p % pattern.length];
      const chunk = [];
      while (i < items.length && chunk.length < target && !(isFeatured && isFeatured(items[i]))) {
        chunk.push(items[i]);
        i += 1;
      }
      out.push({ target, items: chunk });
      p += 1;
    }
    return out;
  }, [items, pattern, isFeatured]);

  return (
    <div className={`flex flex-col ${className}`} style={{ gap }}>
      {rows.map((row, rIdx) => {
        // baris terakhir yang tidak penuh dibatasi lebarnya agar tidak jadi raksasa
        const partial = row.items.length < row.target && rIdx === rows.length - 1;
        return (
          <div
            key={rIdx}
            className="flex"
            style={{
              gap,
              // lebar = n sel penuh + (n-1) gap, sama persis dengan sel di baris penuh
              width: partial
                ? `calc((100% - ${(row.target - 1) * gap}px) * ${row.items.length / row.target} + ${(row.items.length - 1) * gap}px)`
                : '100%',
            }}
          >
            {row.items.map((item) => {
              const r = getRatio(item);
              return (
                <div
                  key={getKey(item)}
                  className="relative min-w-0"
                  style={{ flex: `${r} 1 0%` }}
                >
                  {/* spacer penjaga rasio */}
                  <div style={{ paddingTop: `${100 / r}%` }} />
                  <div className="absolute inset-0">{renderItem(item)}</div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
