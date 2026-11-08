import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // <--- JANGAN LUPA IMPORT INI
import { getCloudinaryUrl } from "../utils/cloudinaryHelpers"; 
import StaggeredButton from './StaggeredButton';
import VariableProximity from './VariableProximity';
import BlurTransition from './BlurTransition';

// Tambahkan prop 'animDelay' disini
export default function HomeProjectRow({ project, index = 0 }) {
  const containerRef = useRef(null);
  const images = project.images || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  // --- LOGIC TIMER SLIDESHOW (Tetap sama) ---
  useEffect(() => {
    if (images.length <= 1) return;
    const randomInterval = Math.floor(Math.random() * 2000) + 5000;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, randomInterval);
    return () => clearInterval(timer);
  }, [images.length]);

  const prevIndex = (currentIndex - 1 + images.length) % images.length;
  const currentImage = images[currentIndex];
  const prevImage = images[prevIndex];

  const getImageUrl = (imgId) => {
    if (!imgId) return null;
    return getCloudinaryUrl(imgId, { width: 600, height: 600, crop: 'fill' });
  };

  const currentImageUrl = getImageUrl(currentImage);
  const prevImageUrl = getImageUrl(prevImage);
  const standardImageClasses = "absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500";

  return (
    // 1. CONTAINER LUAR: MENGATUR STICKY (Tanpa Animation Transform)
    <motion.div 
      className="sticky top-[110px] md:top-[120px] lg:top-[180px] w-full border-t border-white/20 bg-black overflow-hidden group pt-4"
      style={{ 
        position: 'sticky', // Pastikan explisit
        zIndex: index + 20, 
        backgroundColor: 'black',
        // Hapus transform translate3d jika membuat sticky glitch, tapi biasanya aman untuk stacking context
        boxShadow: '0 -10px 40px rgba(0,0,0,0.8), 0 0 0 1px black',
      }}
      initial={{ y: "100%", opacity: 0 }} // Mulai dari bawah
      animate={{ y: "0%", opacity: 1 }}   // Ke posisi normal
      transition={{ 
        duration: 1.2, 
        delay: 2.2, // Menggunakan delay dinamis dari parent
        ease: [0.22, 1, 0.36, 1] 
      }}
    >
      {/* 2. INNER WRAPPER: MENGATUR ANIMASI PRESENCE */}
      <div
        className="w-full h-full"
      >
          <Link to={`/work/${project.slug}`} className="block w-full h-full">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-full items-start pt-4 pb-8">
            
              {/* KOLOM 1: Index Number */}
              <div className="md:col-span-1 flex flex-col justify-start items-start">
                <StaggeredButton enableHoverBg={false} className="font-mono text-white text-xl font-medium">
                  {String(index + 1).padStart(2, '0')}
                </StaggeredButton>
              </div>

              {/* KOLOM 2: Title & Details */}
              <div ref={containerRef} className="md:col-span-6 flex flex-col gap-8 justify-start items-start">
                <VariableProximity
                  label={project.title}
                  className="text-white text-[clamp(2rem,4vw,4rem)] leading-[0.9] tracking-normal"
                  fromFontVariationSettings="'wght' 500, 'opsz' 40"
                  toFontVariationSettings="'wght' 100, 'opsz' 40"
                  containerRef={containerRef}
                  radius={150}
                  falloff="linear"
                />
                <div className="flex flex-col gap-3 text-white/60 text-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-1.25 h-1.25 rounded-none bg-white/40 shrink-0" />
                    <p className="leading-none">{project.client}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-1.25 h-1.25 rounded-none bg-white/40 shrink-0" />
                    <p className="leading-none">{project.category}</p>
                  </div>
                </div>
              </div>

              {/* KOLOM 3: Staggered Stripe Image Transition */}
              <div className="md:col-span-5 w-full flex justify-end">
                <div 
                    className="relative w-full lg:w-auto lg:h-87.5 aspect-square overflow-hidden bg-[#111] isolate"
                    style={{
                      transform: 'translateZ(0)',
                      backfaceVisibility: 'hidden',
                      outline: '1px solid black'
                    }}
                  >
                    {images.length > 0 ? (
                      images.length === 1 ? (
                          <img 
                            src={currentImageUrl} 
                            className={standardImageClasses}
                            alt=""
                            loading="eager"
                            style={{ backfaceVisibility: 'hidden' }}
                          />
                      ) : (
                        <BlurTransition
                          key={currentIndex} 
                          firstImageSrc={prevImageUrl}
                          secondImageSrc={currentImageUrl}
                          duration={1.2}
                          /* grayscale -> warna saat hover dipasang di pembungkus (bukan di lapisan yang dianimasikan blur) */
                          className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                      )
                    ) : (
                      <div className="w-full h-full bg-black" />
                    )}
                </div>
              </div>

            </div>
          </Link>
      </div>
    </motion.div>
  );
}