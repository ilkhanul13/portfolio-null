import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Konfigurasi Animasi
const DURATION = 0.2;
const STAGGER = 0.015;

// Kita bungkus Link dengan motion agar bisa menerima properti animasi (whileHover, dll)
const MotionLink = motion.create(Link);

export default function StaggeredButton({ 
  children, 
  href, 
  className = "", 
  onClick, 
  type = "button", 
  disabled = false,
  enableHoverBg = true,
  isActive = false,        // true: latar hover tetap terisi (mis. filter yang sedang dipilih)
  hoverBgClass = "bg-[#d2ff00]",
  hoverTextClass = "group-hover:text-black",
  // Props lain seperti target="_blank" akan masuk ke ...props
  ...props 
}) {
  
  // LOGIKA PINTAR: Menentukan jenis elemen
  const isInternal = href && href.startsWith('/');
  const isExternal = href && /^(https?:|mailto:|tel:)/.test(href);

  // 1. Default component adalah motion.button
  let Component = motion.button;
  let elementProps = { type, disabled, onClick, ...props };

  // 2. Jika Internal Link (/contact), ubah jadi MotionLink
  if (isInternal) {
    Component = MotionLink;
    elementProps = { to: href, onClick, ...props }; // Link pakai 'to', bukan 'href'
  } 
  // 3. Jika External Link (Instagram, dll), ubah jadi motion.a
  else if (isExternal) {
    Component = motion.a;
    elementProps = { href, onClick, ...props };
  }

  return (
    <Component
      initial="initial"
      whileHover={disabled ? "" : "hovered"}
      {...elementProps}
      className={`
        group 
        relative appearance-none box-border font-inherit no-underline 
        overflow-hidden inline-block
        ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer opacity-100'}
        ${className}
      `}
    >
      {/* BACKGROUND ANIMASI */}
      {enableHoverBg && (
        <span 
          className={`
            absolute inset-0 
            ${isActive ? 'translate-y-0' : 'translate-y-[105%] group-hover:translate-y-0'}
            transition-transform 
            duration-500 
            ease-in-out
            ${hoverBgClass}
          `} 
        />
      )}

      {/* CONTAINER TEXT */}
      <div className={`
        relative z-10 
        overflow-hidden flex items-center justify-center 
        w-full h-full leading-[1.2] py-0.5
        transition-colors duration-300 
        ${enableHoverBg ? hoverTextClass : ''}
      `}>
        
        <div>
           <WordAnimation>{children}</WordAnimation>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
           <WordAnimation isHoverLayer>{children}</WordAnimation>
        </div>

      </div>
    </Component>
  );
}

const WordAnimation = ({ children, isHoverLayer = false }) => {
  // Pastikan children diubah jadi string aman
  const text = typeof children === 'string' ? children : String(children);

  return (
    <span className="block">
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          variants={{
            initial: { y: isHoverLayer ? '125%' : 0 },
            hovered: { y: isHoverLayer ? 0 : '-125%' },
          }}
          transition={{
            duration: DURATION,
            ease: 'easeInOut',
            delay: STAGGER * i,
          }}
          className="inline-block whitespace-pre"
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};