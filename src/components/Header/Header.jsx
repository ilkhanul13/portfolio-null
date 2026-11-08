import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion';

import MenuOverlay from '../../components/MenuOverlay/MenuOverlay';
import StaggeredButton from '../StaggeredButton';

const navItems = [
  { title: "Home", href: "/" },
  { title: "Work", href: "/work" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" }
];

export default function Header() {
  const [isActive, setIsActive] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // STATE BARU: Mendeteksi apakah sedang proses pindah halaman
  const [isNavigating, setIsNavigating] = useState(false);
  
  const { scrollY } = useScroll();
  const location = useLocation();
  const navigate = useNavigate();

  // --- DETEKSI MOBILE & SCROLL ---
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) setIsCompact(true);
    else setIsCompact(false);
  });

  const showCompactMenu = isCompact || isActive || isMobile;

  // --- FUNGSI NAVIGASI INSTANT ---
  const handleNavigation = (path) => {
    if (location.pathname === path) {
      setIsActive(false);
      return;
    }

    // 1. Beritahu sistem kita sedang navigasi (agar animasi exit jadi instan)
    setIsNavigating(true);

    // 2. Langsung Pindah Halaman (Tanpa Delay)
    // PageTransition di halaman baru akan langsung me-render balok hitam menutup layar.
    navigate(path);

    // 3. Matikan Menu Overlay
    setIsActive(false);

    // 4. Reset status navigating setelah transisi aman (misal 1 detik)
    setTimeout(() => {
      setIsNavigating(false);
    }, 1000); 
  };

  return (
    <>
      <motion.header 
        layoutScroll={false}
        className="fixed top-0 left-0 w-full z-[9999] pt-6 md:pt-9 px-4 md:px-10 bg-transparent text-white mix-blend-difference will-change-transform"
      >
        <div className="w-full max-w-360 mx-auto flex justify-between items-center pb-5 md:pb-9 relative">
          
          {/* LOGO */}
          {/* <div className="flex items-center z-10">
            <div onClick={() => handleNavigation('/')} className="cursor-pointer flex text-[#d2ff00] text-[16px] md:text-[18px] font-bold tracking-widest">
              NULL
            </div>
          </div> */}
          <div className="flex items-center z-10">
            <div
              onClick={() => handleNavigation('/')}
              className="cursor-pointer bg-[#d2ff00] px-4 py-2 text-black font-extrabold not-visited:tracking-widest"
            >
              NULL
            </div>
          </div>

          {/* NAVIGASI KANAN */}
          <div className="flex items-center justify-end overflow-hidden py-2 -my-2">
            {/* mode="wait": item lama keluar dulu, baru yang baru masuk (tidak menumpuk) */}
            <AnimatePresence mode="wait" initial="initial">
              {!showCompactMenu ? (
                <motion.nav 
                  key="full-nav"
                  className="hidden md:flex gap-6 lg:gap-10 items-center"
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
                  style={{ pointerEvents: 'auto' }}
                >
                  {navItems.map((item, index) => {
                    const isExactMatch = location.pathname === item.href;
                    const isWorkActive = item.title.toLowerCase() === 'work' && (location.pathname.includes('/project') || location.pathname.startsWith('/work/'));
                    const isLinkActive = isExactMatch || isWorkActive;

                    return (
                      <div 
                        key={index} 
                        onClick={() => handleNavigation(item.href)}
                        className="group relative z-20 text-[16px] font-normal capitalize flex flex-col items-center cursor-pointer"
                      >
                        <StaggeredButton
                          enableHoverBg={false}
                          className={`transition-colors duration-300 hover:text-[#d2ff00] ${isLinkActive ? "text-[#d2ff00]" : "text-white"}`}
                        >
                          {item.title}
                        </StaggeredButton>
                        <div className={`w-[0px] h-[0px] bg-[#d2ff00] absolute -bottom-2.5 transition-transform duration-300 ease-in-out group-hover:scale-100 ${isLinkActive ? "scale-100" : "scale-0"}`}></div>
                      </div>
                    );
                  })}
                </motion.nav>
              ) : (
                <motion.div 
                  key="compact-menu"
                  className="flex items-center gap-4 cursor-pointer group relative z-20"
                  onClick={() => setIsActive(!isActive)}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 50, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
                >
                  <StaggeredButton
                    enableHoverBg={false} 
                    className="text-[14px] font-medium tracking-wide uppercase text-white group-hover:text-[#d2ff00] transition-colors duration-300 hidden md:block">
                      {isActive ? "CLOSE" : "MENU"}
                  </StaggeredButton>
                  <div className="relative w-5 h-[10px] flex flex-col justify-between items-end">
                      <span className={`block w-full h-[2px] bg-white group-hover:bg-[#d2ff00] transition-all duration-300 origin-center ${isActive ? "rotate-45 translate-y-[4.5px]" : ""}`}></span>
                      <span className={`block w-full h-[2px] bg-white group-hover:bg-[#d2ff00] transition-all duration-300 origin-center ${isActive ? "-rotate-45 -translate-y-[4.5px]" : ""}`}></span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
        </div>
      </motion.header>

      {/* OVERLAY MENU */}
      <AnimatePresence mode="wait">
        {isActive && (
          <MenuOverlay 
            navItems={navItems} 
            onNavigate={handleNavigation} 
            closeMenu={() => setIsActive(false)} 
            // PASS PROP INI KE OVERLAY
            isNavigating={isNavigating}
          />
        )}
      </AnimatePresence>
    </>
  );
}