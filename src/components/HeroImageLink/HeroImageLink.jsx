import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Gambar hero yang bisa diklik (-> `to`).
 * Animasi masuk (lebar/margin + zoom) dikontrol lewat variants dari parent.
 */
export default function HeroImageLink({
  to,
  src,
  alt = '',
  label,
  wrapperVariants,   // variants animasi masuk (lebar/margin)
  imageVariants,     // variants animasi masuk (zoom di dalam)
  imageClassName = '',
}) {
  return (
    <Link
      to={to}
      aria-label={label || alt || 'Open page'}
      className="flex shrink-0 items-center justify-center cursor-pointer"
    >
      <motion.div
        className="relative flex items-center justify-center overflow-hidden shrink-0"
        variants={wrapperVariants}
      >
        <motion.img
          src={src}
          alt={alt}
          variants={imageVariants}
          draggable={false}
          className={imageClassName}
        />
      </motion.div>
    </Link>
  );
}
