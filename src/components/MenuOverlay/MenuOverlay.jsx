import { motion } from 'framer-motion';
import { FaInstagram } from "react-icons/fa6";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { FiLinkedin, FiGithub } from "react-icons/fi";

export default function MenuOverlay({ navItems, onNavigate, isNavigating }) {

  // --- VARIANTS DENGAN LOGIKA INSTANT SWAP ---
  const blockVariants = {
    initial: { y: "-100%" }, 
    open: (i) => ({
      y: "0%", 
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.05 * i }
    }),
    closed: (i) => isNavigating ? ({
      // JIKA PINDAH PAGE: Langsung hilang (biar PageTransition ambil alih)
      opacity: 0, 
      transition: { duration: 0 } 
    }) : ({
      // JIKA CUMA CLOSE (X): Animasi naik normal
      y: "-100%", 
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.4 + (0.05 * i) }
    })
  };

  const containerVariants = {
    initial: { opacity: 0 },
    open: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
    closed: { 
      opacity: 0, 
      // Konten juga hilang instan kalau navigating
      transition: { duration: isNavigating ? 0 : 0.5 } 
    }
  };

  const textRevealVariants = {
    initial: { y: "110%" },
    open: { y: "0%", transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] } },
    closed: { y: "110%", transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] } }
  };

  const socialRevealVariants = {
    initial: { y: "150%" },
    open: { y: "0%", transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] } },
    closed: { y: "150%", transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] } }
  };

  return (
    // Z-INDEX 9998: Di bawah Header (9999) tapi setara PageTransition
    <div className="fixed top-0 left-0 w-full h-[100dvh] z-[9998] text-white touch-action-none">
      
      {/* 1. BACKGROUND BLOCKS */}
      <div className="absolute inset-0 flex w-full h-full pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={blockVariants}
            initial="initial"
            animate="open"
            exit="closed"
            // scale-x-[1.01] untuk menutup celah antar balok
            className="w-full h-full bg-[#0c0c0c] scale-x-[1.01]" 
          />
        ))}
      </div>

      {/* 2. KONTEN MENU */}
      <motion.div 
        className="relative z-10 w-full h-full px-4 md:px-10 flex flex-col"
        variants={containerVariants}
        initial="initial"
        animate="open"
        exit="closed"
      >
         <div className="w-full h-full max-w-360 mx-auto flex flex-col justify-between overflow-hidden pt-32 md:pt-40 pb-10 md:pb-12.5">
           
           {/* LINKS LIST */}
           <div className="flex flex-col md:gap-[2vh]">
             <div className="mb-4 md:mb-8 w-full">
                <div className="overflow-hidden relative pb-1"> 
                  <motion.div variants={textRevealVariants}>
                     <h3 className="text-[14px] md:text-[1.3rem] tracking-[1px] uppercase text-[#999] m-0 font-medium">Navigation</h3>
                  </motion.div>
                </div>
                <div className="overflow-hidden w-full mt-4">
                   <motion.div 
                     className="h-px bg-[#444] w-full origin-left"
                     initial={{ scaleX: 0 }}
                     animate={{ scaleX: 1, transition: { duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.5 } }} 
                     exit={{ scaleX: 0, transition: { duration: 0.5 } }}
                   />
                </div>
             </div>
             
             {navItems.map((item, index) => (
               <div key={index} className="w-full">
                 <div className="overflow-hidden block">
                   <motion.div variants={textRevealVariants} className="block">
                     <div 
                       onClick={() => onNavigate(item.href)} 
                       className="block w-full text-white cursor-pointer transition-transform duration-300 ease-out hover:text-[#d2ff00] hover:translate-x-4
                                  font-display text-[3rem] md:text-[clamp(3.5rem,6vw,6rem)] md:leading-[1.1] font-normal"
                     >
                        {item.title}
                     </div>
                   </motion.div>
                 </div>
               </div>
             ))}
           </div>

           {/* FOOTER SOCIALS */}
           <div className="mt-auto w-full">
               <div className="flex flex-col gap-4">
                  <div className="overflow-hidden">
                     <motion.span variants={textRevealVariants} className="block text-[#666] uppercase text-[14px] md:text-[1.1rem] tracking-[1px] font-medium">Socials</motion.span>
                  </div>
                  <div className="py-2 -mt-1"> 
                     <div className="overflow-hidden"> 
                        <motion.div className="flex gap-4 md:gap-6 items-center pt-1" variants={socialRevealVariants}>
                            <a 
                              href="mailto:ilkhanull@gmail.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center group">
                                <MdOutlineAlternateEmail className="text-[1.4rem] md:text-[1.8rem] text-white group-hover:text-[#d2ff00] transition-colors" />
                            </a>
                            <a 
                              href="https://www.linkedin.com/in/ilkhanul/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center group">
                                <FiLinkedin className="text-[1.4rem] md:text-[1.8rem] text-white group-hover:text-[#d2ff00] transition-colors" />
                            </a>
                            <a 
                              href="https://github.com/ilkhanul13"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center group">
                                <FiGithub className="text-[1.4rem] md:text-[1.8rem] text-white group-hover:text-[#d2ff00] transition-colors" />
                            </a>
                            <a 
                              href="https://www.instagram.com/ilkhanul_/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center group">
                                <FaInstagram className="text-[1.4rem] md:text-[1.8rem] text-white group-hover:text-[#d2ff00] transition-colors" />
                            </a>
                        </motion.div>
                     </div>
                  </div>
              </div>
           </div>
           
         </div>
      </motion.div>
    </div>
  );
}