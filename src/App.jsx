import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'; 
import { AnimatePresence } from 'framer-motion';
import { useLenis } from 'lenis/react';

// Import data projects
import { projectsData } from './utils/projectsData'; 

import SmoothScroll from './components/SmoothScroll';
import PageTransition from './components/PageTransition';
import InitialLoader from './components/InitialLoader';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import Home from './pages/Home/Home';
import Work from './pages/Work/Work';
import ProjectDetail from './pages/ProjectDetail/ProjectDetail';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import CustomScrollbar from './components/CustomScrollbar';

function AppContent() {
  const location = useLocation();
  const lenis = useLenis();

  // State 1: Cek apakah ini load pertama (untuk menampilkan Loader fisik)
  const [isFirstLoad, setIsFirstLoad] = useState(() => {
    if (typeof window !== "undefined") {
      return !sessionStorage.getItem("hasLoaded");
    }
    return true;
  });

  // State 2: Sinyal untuk Home memulai animasi (walau loader belum unmount)
  const [canStartHomeAnim, setCanStartHomeAnim] = useState(false);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []); 

  const handleExitComplete = () => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  };

  // Handler: Dipanggil saat Loader MULAI transisi keluar (balok naik)
  const handleLoaderStartExit = () => {
    setCanStartHomeAnim(true);
  };

  // Handler: Dipanggil saat Loader SELESAI total (unmount)
  const finishLoading = () => {
    sessionStorage.setItem("hasLoaded", "true");
    setIsFirstLoad(false);
  };

  const pageKey = location.pathname; 

  const getProjectTitle = () => {
    const isProjectDetail = location.pathname.startsWith('/work/') && location.pathname.split('/').length > 2;
    if (isProjectDetail) {
      const currentSlug = location.pathname.split('/')[2]; 
      const foundProject = projectsData.find(p => p.slug === currentSlug);
      return foundProject ? foundProject.title : 'Project';
    }
    return 'Project'; 
  };

  const activeProjectTitle = getProjectTitle();

  // --- LOGIC DELAY DINAMIS ---
  // Jika First Load: 0.5s (Cepat, overlap dengan InitialLoader)
  // Jika Navigasi Biasa: 1.3s (Lambat, nunggu PageTransition block & text selesai)
  const homeDelay = isFirstLoad ? 0.3 : 0.6;

  return (
    <div className="app selection:bg-[#d2ff00] selection:text-black">
      <AnimatePresence>
        {isFirstLoad && (
          <InitialLoader 
            key="initial-loader" 
            onStartExit={handleLoaderStartExit} 
            onFinished={finishLoading} 
          />
        )}
      </AnimatePresence>

      <CustomScrollbar />

      <Header />
      
      <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
        <Routes location={location} key={pageKey}>
          <Route 
            path="/" 
            element={
              <PageTransition routeName="Home">
                {/* Kita kirim animDelay yang sudah dihitung di atas */}
                <Home 
                  isReady={!isFirstLoad || canStartHomeAnim} 
                  animDelay={homeDelay}
                />
              </PageTransition>
            } 
          />
          <Route path="/work" element={<PageTransition routeName="Work"><Work /></PageTransition>} />
          
          <Route 
            path="/work/:slug" 
            element={
              <PageTransition routeName={activeProjectTitle}>
                <ProjectDetail />
              </PageTransition>
            } 
          />
          
          <Route path="/about" element={<PageTransition routeName="About"><About /></PageTransition>} />
          <Route path="/contact" element={<PageTransition routeName="Contact"><Contact /></PageTransition>} />
        </Routes>
      </AnimatePresence>

      <Footer />
      
    </div>
  );
}

function App() {
  return (
    <SmoothScroll>
      <div style={{ position: 'relative', width: '100%', minHeight: '100vh', isolation: 'isolate' }}>
        <AppContent />
      </div>
    </SmoothScroll>
  );
}

export default App;