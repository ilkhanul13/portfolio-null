import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCloudinaryUrl } from "../../utils/cloudinaryHelpers";
import BlurTransition from '../BlurTransition';

export default function ProjectCard({ project }) {
  const images = project.images || [];

  
  const [currentIndex, setCurrentIndex] = useState(0);

  // --- Logic Slideshow (Tetap) ---
  useEffect(() => {
    if (images.length <= 1) return;
    const randomInterval = Math.floor(Math.random() * 3000) + 4000;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, randomInterval);

    return () => clearInterval(timer);
  }, [images.length]);

  const prevIndex = (currentIndex - 1 + images.length) % images.length;
  const prevImage = images[prevIndex];
  const currentImage = images[currentIndex];

  // Helper untuk mendapatkan URL gambar
  const getImageUrl = (imgId) => {
    if (!imgId) return null;
    // Tanpa crop paksa 1:1 — rasio asli dipertahankan, kartu mengikuti rasio cover
    return getCloudinaryUrl(imgId, { width: 1000, crop: 'limit', gravity: null });
  };

  const currentImageUrl = getImageUrl(currentImage);
  const prevImageUrl = getImageUrl(prevImage);

  const wrapperVariants = {
    initial: { scale: 1 },
    hover: { scale: 1 } // zoom hover dihapus
  };

  const smoothEase = [0.22, 1, 0.36, 1]; 

  const infoPanelVariants = {
    initial: { y: "101%" },
    hover: { 
      y: 0,
      transition: { 
        duration: 0.9, 
        ease: smoothEase, 
        staggerChildren: 0.08, 
        delayChildren: 0.15 
      }
    }
  };

  const textRevealVariants = {
    initial: { y: "100%" },
    hover: { 
      y: 0,
      transition: { 
        duration: 0.7, 
        ease: smoothEase 
      }
    }
  };

  const arrowRevealVariants = {
    initial: { x: "-100%", opacity: 0 }, 
    hover: { 
      x: 0,
      opacity: 1,
      transition: { 
        duration: 0.5, 
        ease: smoothEase 
      }
    }
  };

  return (
    <Link to={`/work/${project.slug}`} className="block w-full h-full text-inherit no-underline group">
      <motion.div
        className="w-full h-full flex flex-col relative"
        initial="initial"
        whileHover="hover"
        animate="initial"
      >
        <div className="w-full h-full relative overflow-hidden bg-[#111] flex-none isolate">
          
          {/* --- LAYER IMAGE DENGAN STRIPE TRANSITION --- */}
          <motion.div 
            className="absolute inset-0 w-full h-full z-10"
            variants={wrapperVariants}
            transition={{ duration: 0.7, ease: smoothEase }}
          >
            {images.length > 0 ? (
              images.length === 1 ? (
                <img 
                  src={currentImageUrl} 
                  className="w-full h-full object-cover block"
                  alt={project.client}
                  loading="eager"
                  style={{ backfaceVisibility: 'hidden' }}
                />
              ) : (
                /* Pergantian gambar dengan animasi blur */
                <BlurTransition
                  key={currentIndex} 
                  firstImageSrc={prevImageUrl}
                  secondImageSrc={currentImageUrl}
                  duration={1.2}
                  className="w-full h-full"
                />
              )
            ) : (
              <div className="absolute w-full h-full z-2 bg-[#333] flex items-center justify-center text-[#555] text-3xl font-bold">
                  {project.client?.charAt(0)}
              </div>
            )}
          </motion.div>

          {/* --- LAYER INFO CARD (BOTTOM) --- */}
          <motion.div 
            className="absolute bottom-0 left-0 w-full bg-[#d2ff00] z-30 px-6 py-5"
            variants={infoPanelVariants}
          >
            <div className="flex justify-between items-center w-full gap-4 text-black">
              
              <div className="flex flex-col gap-1 min-w-0">
                <div className="overflow-hidden">
                  <motion.h2 
                    className="text-[1.5rem] md:text-[1.75rem] leading-none font-medium m-0 truncate"
                    variants={textRevealVariants}
                  >
                    {project.client || "Project"}
                  </motion.h2>
                </div>

                <div className="overflow-hidden">
                  <motion.div 
                    className="flex items-center gap-2 text-[0.9rem] opacity-80"
                    variants={textRevealVariants}
                  >
                    <span className="truncate">{project.category}</span>
                    {project.year && (
                      <>
                        <span className="text-[0.6rem] shrink-0">•</span>
                        <span className="shrink-0 font-mono">{project.year}</span>
                      </>
                    )}
                  </motion.div>
                </div>
              </div>

              <div className="overflow-hidden shrink-0 flex items-center justify-center w-10 h-10">
                <motion.div variants={arrowRevealVariants}>
                  <svg 
                    width="32" 
                    height="32" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="w-8 h-8 md:w-10 md:h-10" 
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </motion.div>
              </div>

            </div>
          </motion.div>
          
        </div>
      </motion.div>
    </Link>
  );
}