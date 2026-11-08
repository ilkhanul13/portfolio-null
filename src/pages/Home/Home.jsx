import { useRef, useLayoutEffect, useMemo } from 'react';
import { motion } from 'framer-motion'; 
import gsap from 'gsap';
import PageTransition from '../../components/PageTransition';
import InfiniteMarquee from '../../components/InfiniteMarquee/InfiniteMarquee';
import HomeProjectRow from '../../components/HomeProjectRow';
import StaggeredButton from '../../components/StaggeredButton';
import StaggeredLoopText from '../../components/StaggeredLoopText';
import VariableProximity from '../../components/VariableProximity';
import { projectsData } from '../../utils/projectsData'; 
import XRayText from '../../components/XRayText/XRayText';
import HeroImageLink from '../../components/HeroImageLink/HeroImageLink';

// Variant standard yang tidak butuh delay dinamis tetap di luar
const standardRevealVariants = {
  initial: { y: "110%" },
  animate: {
    y: "0%",
    transition: { 
      duration: 1.2, 
      ease: [0.22, 1, 0.36, 1] 
    }
  }
};

// --- MASKED REVEAL COMPONENT ---
const MaskedReveal = ({ children, className = "", customVariants = null, initial, animate }) => {
  const motionProps = {};
  if (initial) motionProps.initial = initial;
  if (animate) motionProps.animate = animate;

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div 
        variants={customVariants || standardRevealVariants}
        {...motionProps}
      >
        {children}
      </motion.div>
    </div>
  );
};

// --- HOME COMPONENT ---
// Menerima prop animDelay (default 0.5 jika tidak dikirim)
export default function Home({ isReady = true, animDelay = 0.4 }) {
  const containerRef = useRef(null);
  const descRef = useRef(null);

  const HERO_IMAGE_URL = "https://res.cloudinary.com/dfovmrebt/image/upload/v1769190120/3-2_xntppx.png"; 
  const recentProjects = projectsData.slice(0, 4);
  const MAIN_TEXT_SIZE = "font-display text-[clamp(2.5rem,10vw,120px)] text-white";

  // --- 1. SETUP TIMING DINAMIS ---
  // Kita gunakan useMemo agar timing hanya dihitung ulang jika animDelay berubah
  const timing = useMemo(() => {
    return {
      BASE: animDelay,
      LATE: animDelay + 1.8,    
      PROJECT: animDelay + 1.8  
    };
  }, [animDelay]);

  // --- 2. VARIANTS DINAMIS (Pindah ke dalam component) ---
  
  const containerVariants = {
    initial: { opacity: 1 },
    animate: {
      opacity: 1,
      transition: {
        delayChildren: timing.BASE, // Menggunakan delay dinamis
        staggerChildren: 0.15, 
      }
    }
  };

  const lateRevealVariants = {
    initial: { y: "110%" },
    animate: {
      y: "0%",
      transition: { 
        duration: 1.2, 
        ease: [0.22, 1, 0.36, 1],
        delay: timing.LATE // Menggunakan delay dinamis
      }
    }
  };

  // Tinggi gambar = tinggi huruf kapital Bricolage (~0.68em, sudah termasuk overshoot).
  // Lebar 1.7em (rasio ~2.5:1) -> lebih panjang.
  // Dianimasikan em -> em (satuan sama) supaya interpolasi murni, tanpa mengukur "auto"
  // di tengah animasi (penyebab getaran).
  const imageRevealVariants = {
    initial: { width: "0em", marginLeft: "0rem", marginRight: "0rem", opacity: 0 },
    animate: {
      width: "1.7em",
      marginLeft: "0.5rem",
      marginRight: "0.5rem",
      opacity: 1,
      transition: { 
        duration: 1.4, 
        ease: [0.22, 1, 0.36, 1], 
        delay: timing.LATE, // Menggunakan delay dinamis
        restDelta: 0.001 
      }
    }
  };

  // Zoom-out halus di dalam wrapper (transform saja, tidak memicu reflow)
  const imageInnerVariants = {
    initial: { scale: 1.25 },
    animate: {
      scale: 1,
      transition: { 
        duration: 1.6, 
        ease: [0.22, 1, 0.36, 1], 
        delay: timing.LATE 
      }
    }
  };

  const titleRevealVariants = {
    initial: { y: "110%" },
    animate: {
      y: "0%",
      transition: { 
        duration: 1.2, 
        ease: [0.22, 1, 0.36, 1],
        delay: timing.PROJECT // Menggunakan delay dinamis
      }
    }
  };

  // --- 3. GSAP DENGAN TIMING DINAMIS ---
  useLayoutEffect(() => {
    if (!isReady) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      const marqueeItems = descRef.current.querySelectorAll('.marquee-group');
      if (marqueeItems.length > 0) {
        tl.from(marqueeItems, { 
          y: "100%",        
          opacity: 0, 
          duration: 1.5,
          stagger: 0.1 
        }, timing.LATE); // Start time dinamis
      }

    }, containerRef);
    
    return () => ctx.revert();
  }, [isReady, timing]); // Tambahkan timing ke dependency array

  return (
    <PageTransition routeName="Home">
        <section ref={containerRef} className="w-full px-5 md:px-10 flex flex-col items-center justify-center bg-black text-white pb-5 pt-22 md:pt-38">
            {/* WRAPPER HERO */}
            <motion.div 
              className="w-full max-w-360 flex flex-col items-center gap-2 md:gap-4"
              variants={containerVariants} // Variants dinamis
              initial="initial"
              animate={isReady ? "animate" : "initial"}
            >
              
              <div className="flex flex-col items-center w-full text-center text-white">
                
                {/* A. Welcome Text */}
                <div className="flex flex-wrap items-center justify-center gap-2 text-[1rem] md:text-[1.5rem] font-normal uppercase tracking-widest leading-tight mb-4 md:mb-6 text-gray-300 overflow-hidden">
                    <MaskedReveal customVariants={lateRevealVariants}> 
                       <div className="flex flex-wrap justify-center gap-2">
                         <span className="text-gray-300">Welcome to my</span>
                         <StaggeredLoopText 
                           className="text-[#d2ff00] font-bold"
                           words={["visual playground", "creative space", "digital portfolio"]} 
                         />
                       </div>
                    </MaskedReveal>
                </div>
                
                {/* B. HELLO, I AM */}
                <MaskedReveal className="mb-2 md:mb-4">
                    <VariableProximity 
                        label="Hello, I am "
                        className={`${MAIN_TEXT_SIZE} font-bold leading-none uppercase`}
                        fromFontVariationSettings="'wght' 900, 'opsz' 40"
                        toFontVariationSettings="'wght' 100, 'opsz' 40"
                        containerRef={containerRef}
                        radius={150}
                        falloff="linear"
                    />
                </MaskedReveal>

                {/* C. NAMA & GAMBAR */}
                <div className={`
                    flex flex-wrap items-center justify-center 
                    gap-x-0 gap-y-0 
                    leading-none uppercase ${MAIN_TEXT_SIZE}
                `}>
                  
                  {/* NAMA DEPAN */}
                  <MaskedReveal>
                    <VariableProximity 
                        label="Ilkhanul"
                        className="font-bold tracking-normal text-white"
                        fromFontVariationSettings="'wght' 100, 'opsz' 40"
                        toFontVariationSettings="'wght' 900, 'opsz' 40"
                        containerRef={containerRef}
                        radius={150}
                        falloff="linear"
                    />
                  </MaskedReveal>

                  {/* GAMBAR TENGAH */}
                  <HeroImageLink
                    to="/about"
                    src={HERO_IMAGE_URL}
                    alt="Portrait of Ilkhanul Khalik"
                    label="Go to About page"
                    wrapperVariants={imageRevealVariants}
                    imageVariants={imageInnerVariants}
                    imageClassName="h-[0.68em] w-[1.7em] max-w-none object-cover shrink-0"
                  />

                  {/* NAMA BELAKANG */}
                  <MaskedReveal>
                    <VariableProximity 
                        label="Khalik"
                        className="font-bold tracking-normal text-white"
                        fromFontVariationSettings="'wght' 100, 'opsz' 40"
                        toFontVariationSettings="'wght' 900, 'opsz' 40"
                        containerRef={containerRef}
                        radius={150}
                        falloff="linear"
                    />
                  </MaskedReveal>
                </div>

              </div>

              {/* === ROLE === */}
              <div className="flex flex-col items-center w-full text-center">
                <div className="flex flex-col leading-none gap-2 md:gap-4 w-full text-white">
                    <MaskedReveal className="w-full">
                        <VariableProximity 
                            label="Graphic Designer" 
                            className={`${MAIN_TEXT_SIZE} uppercase font-bold tracking-normal cursor-default text-white opacity-90`} 
                            fromFontVariationSettings="'wght' 900, 'opsz' 40" 
                            toFontVariationSettings="'wght' 100, 'opsz' 40" 
                            containerRef={containerRef} 
                            radius={150} 
                            falloff="linear"
                        />
                    </MaskedReveal>
                    <MaskedReveal className="w-full">
                        <VariableProximity 
                            label="Tech Enthusiast" 
                            className={`${MAIN_TEXT_SIZE} uppercase font-bold tracking-normal cursor-default text-white opacity-90`} 
                            fromFontVariationSettings="'wght' 900, 'opsz' 40" 
                            toFontVariationSettings="'wght' 100, 'opsz' 40" 
                            containerRef={containerRef} 
                            radius={150} 
                            falloff="linear"
                        />
                    </MaskedReveal>
                    <MaskedReveal className="w-full">
                        <VariableProximity 
                            label="Freelance" 
                            className={`${MAIN_TEXT_SIZE} uppercase font-bold tracking-normal cursor-default text-white opacity-90`} 
                            fromFontVariationSettings="'wght' 100, 'opsz' 40" 
                            toFontVariationSettings="'wght' 900, 'opsz' 40" 
                            containerRef={containerRef} 
                            radius={150} 
                            falloff="linear"
                        />
                    </MaskedReveal>
                </div>
              </div>

            </motion.div>
        </section>

        {/* Section Marquee */}
        <section className="bg-black w-full flex justify-center items-center py-0 relative z-20 pt-8 md:pt-16">
          <div ref={descRef} className="w-full max-w-360 py-4 overflow-hidden">
            <InfiniteMarquee speed={1}>
              {[1, 2, 3].map((_, i) => (
                  <div key={i} style={{ display: 'contents' }}>
                    <div className="marquee-group inline-flex items-center">
                      <span className="font-display text-white text-[clamp(1rem,2.5vw,3rem)] font-light leading-[1.1] whitespace-nowrap inline-block">
                        Where Design Meets Technology
                      </span>
                      <span className="w-15 h-0.5 bg-current mx-8 md:mx-20 rounded-xs"></span>
                    </div>

                    <div className="marquee-group inline-flex items-center">
                      <span className="font-display text-white text-[clamp(1rem,2.5vw,3rem)] font-light leading-[1.1] whitespace-nowrap inline-block">
                        Est 2026
                      </span>
                      <span className="w-15 h-0.5 bg-current mx-8 md:mx-20 rounded-xs"></span>
                    </div>

                    <div className="marquee-group inline-flex items-center">
                      <span className="font-display text-white text-[clamp(1rem,2.5vw,3rem)] font-light leading-[1.1] whitespace-nowrap inline-block">
                        Creative Worker
                      </span>
                      <span className="w-15 h-0.5 bg-current mx-8 md:mx-20 rounded-xs"></span>
                    </div>
                  </div>
              ))}
            </InfiniteMarquee>
          </div>
        </section>
        
        {/* --- SECTION PROJECT ROW FIXED --- */}
        <section className="bg-black w-full h-auto pt-25 md:pt-45 lg:pt-55 px-5 md:px-10 relative z-10">
          
          <div className="w-full max-w-360 mx-auto flex flex-col items-left">
            <div className="relative w-full text-center"> 
              
              <MaskedReveal 
                className="sticky top-25 md:top-30 lg:top-21 z-10 mix-blend-difference mb-7 md:mb-7 lg:mb-7"
                customVariants={titleRevealVariants} // Variants dinamis
                initial="initial"
                animate={isReady ? "animate" : "initial"} 
              >
                <XRayText className="font-display text-white text-[clamp(2.5rem,10vw,120px)] font-bold tracking-[1px] leading-none">
                  Recent Work
                </XRayText>
              </MaskedReveal>

              <div className="w-full max-w-360 relative z-20 pb-10 mt-0 md:mt-14 lg:mt-10"> 
                {recentProjects.map((project, index) => (
                  <div 
                    key={project.id} 
                    className="sticky top-[170px] md:top-[250px] lg:top-[240px]"
                  >
                    <HomeProjectRow 
                      project={project} 
                      index={index} 
                      animDelay={timing.PROJECT + (index * 0.15)} // Timing dinamis
                    />
                  </div>
                ))}
              </div>
            </div> 

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ 
                duration: 1,
                delay: timing.PROJECT + (recentProjects.length * 0.15), // Timing dinamis
                ease: [0.22, 1, 0.36, 1] 
              }}
              className="text-center mt-24 mb-10 relative z-30"
            >
              <StaggeredButton 
                href="/work" 
                hoverBgClass="bg-black" 
                hoverTextClass="group-hover:text-white"
                className="bg-[#d2ff00] text-black w-full md:w-auto inline-flex items-center justify-center px-8 py-4 mb-12 md:mb-33
                  border border-[#333] text-[1rem] font-medium transition-all duration-300"
              >
                View All Projects
              </StaggeredButton>
            </motion.div>
          </div>
        </section>

    </PageTransition>
  );
}