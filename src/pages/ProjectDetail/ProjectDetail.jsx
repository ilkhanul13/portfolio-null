import { useState, useEffect } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; 
import { useLenis } from 'lenis/react'; 
import { projectsData } from '../../utils/projectsData'; 
import { getProjectImage } from '../../utils/cloudinaryHelpers'; 
import PageTransition from '../../components/PageTransition';
import StaggeredButton from '../../components/StaggeredButton';
import BlurTransition from '../../components/BlurTransition';
import JustifiedRows from '../../components/JustifiedRows';
import useImageRatios from '../../hooks/useImageRatios';

// --- VARIANTS CONFIGURATION ---
const headerSequenceVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.8, 
      staggerChildren: 0.1, 
    }
  }
};

const bodySequenceVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 1.4, 
      staggerChildren: 0, 
    }
  }
};

const maskRevealVariants = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } }
};

const fadeUpVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
};

const MaskedReveal = ({ children, className = "" }) => {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div variants={maskRevealVariants}>
        {children}
      </motion.div>
    </div>
  );
};

// --- KOMPONEN UTAMA ---
export default function ProjectDetail() {
  const { slug } = useParams();
  const project = projectsData.find((p) => p.slug === slug);
  const lenis = useLenis();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [slug, lenis]);

  if (!project) return <div className="min-h-screen" />;

  return (
    <PageTransition routeName="ProjectDetail"> 
      <style>
        {`
          .custom-loader {
            height: 2px;
            width: 120px;
            --c: no-repeat linear-gradient(#ffffff 0 0);
            /* Background track menggunakan putih transparan tipis */
            background: var(--c), var(--c), rgba(255, 255, 255, 0.1);
            background-size: 60% 100%;
            animation: l16 2s infinite cubic-bezier(0.4, 0, 0.2, 1);
          }

          @keyframes l16 {
            /* Start jauh di kiri agar tidak terlihat di awal */
            0%   { background-position: -200% 0, -200% 0; }
            /* Gerakan maju */
            66%  { background-position: 300% 0, -200% 0; }
            /* Finish jauh di kanan agar tail benar-benar keluar dari container */
            100% { background-position: 300% 0, 300% 0; }
          }
        `}
      </style>
      <div className="w-full px-5 md:px-10 pt-22 md:pt-38 pb-12 md:pb-32 box-border min-h-[80vh] bg-black">
        <div className="w-full max-w-360 mx-auto">
          <ProjectContent key={slug} project={project} />
        </div>
      </div>
    </PageTransition>
  );
}

// --- KOMPONEN KONTEN ---
function ProjectContent({ project }) {
  const navigate = useNavigate();
  const currentIndex = projectsData.findIndex((p) => p.slug === project.slug);

  const [selectedImage, setSelectedImage] = useState(null);
  const [prevImage, setPrevImage] = useState(null);
  const [isChanging, setIsChanging] = useState(false); 
  const [isImageLoading, setIsImageLoading] = useState(false); 

  const imageList = project.images || [];
  const getImageRatio = useImageRatios(imageList);
  const activeImage = selectedImage || (imageList.length > 0 ? imageList[0] : null);
  const getUrl = (img) => img ? getProjectImage(img, 'large') : '';

  const handleThumbnailClick = (imgObj) => {
    if (imgObj !== activeImage && !isChanging) {
      setIsChanging(true);
      setPrevImage(activeImage);
      
      const img = new Image();
      img.src = getUrl(imgObj);

      if (img.complete) {
        setSelectedImage(imgObj);
        setIsImageLoading(false);
        setTimeout(() => setIsChanging(false), 50);
      } else {
        setIsImageLoading(true);
        img.onload = () => {
          setSelectedImage(imgObj);
          setTimeout(() => setIsChanging(false), 50);
        };
      }
    }
  };

  const handleProjectNav = (direction) => {
    const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= 0 && nextIndex < projectsData.length) {
      navigate(`/work/${projectsData[nextIndex].slug}`);
    }
  };

  return (
    <div className="w-full">
      {/* FASE 1: HEADER */}
      <motion.div 
        className="mb-0"
        variants={headerSequenceVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="mb-6 flex justify-center lg:justify-start">
            <h1 className="text-[clamp(2.5rem,6vw,6rem)] leading-[1.1] text-white text-center lg:text-start overflow-hidden">
                <MaskedReveal>{project.title}</MaskedReveal>
            </h1>
        </div>
        
        <div className="flex flex-row flex-wrap gap-y-2 gap-x-6 md:gap-12 text-[1rem] text-white/60 justify-center lg:justify-start">
          <div className="flex items-center gap-3">
            <motion.span variants={fadeUpVariants} className="shrink-0 w-1 h-1 bg-white/50"></motion.span>
            <MaskedReveal className="text-white/60">Client <span className="text-[#d2ff00]">{project.client}</span></MaskedReveal>
          </div>
          <div className="flex items-center gap-3">
            <motion.span variants={fadeUpVariants} className="shrink-0 w-1 h-1 bg-white/50"></motion.span>
            <MaskedReveal className="text-white/60">Category <span className="text-[#d2ff00]">{project.category}</span></MaskedReveal>
          </div>
          <div className="flex items-center gap-3">
            <motion.span variants={fadeUpVariants} className="shrink-0 w-1 h-1 bg-white/50"></motion.span>
            <MaskedReveal className="text-white/60">Year <span className="font-mono text-[#d2ff00]">{project.year}</span></MaskedReveal>
          </div>
        </div>
      </motion.div>

      {/* FASE 2: BODY */}
      <motion.div
        variants={bodySequenceVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          variants={fadeUpVariants}
          className="w-full h-[1px] bg-white/20 mt-8 mb-12 md:mt-10 md:mb-16"
        />

        <div className="w-full mb-12 md:mb-16 grid grid-cols-1 lg:grid-cols-[1.1fr_2fr_0.4fr] gap-8 md:gap-12 items-start">
          
          {/* COL 1: Thumbnails */}
          <div className="w-full flex flex-col order-2 lg:order-1 self-stretch justify-between">
            <motion.div variants={fadeUpVariants}>
              <JustifiedRows
                items={imageList}
                getKey={(imgObj) => imgObj.publicId}
                getRatio={getImageRatio}
                gap={8}
                columns={{ base: [3], md: [4], lg: [3] }}
                renderItem={(imgObj) => {
                  const isActive = activeImage === imgObj;
                  return (
                    <div
                      className="group w-full h-full bg-[#1a1a1a] cursor-pointer relative overflow-hidden z-10"
                      onClick={() => handleThumbnailClick(imgObj)}
                    >
                      <img src={getProjectImage(imgObj, 'tiny')} alt="thumb" style={{ imageRendering: 'pixelated' }} className="absolute inset-0 w-full h-full object-cover z-0" />
                      <img src={getProjectImage(imgObj, 'medium')} alt="thumb clear" className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                    </div>
                  );
                }}
              />
            </motion.div>

            <motion.div variants={fadeUpVariants} className="flex flex-row gap-2 mt-12 lg:mt-auto pt-6 justify-center lg:justify-start">
              <StaggeredButton 
                onClick={() => handleProjectNav('prev')} 
                disabled={currentIndex <= 0} 
                enableHoverBg 
                className={`inline-flex items-center justify-center w-full py-1.5 
                  border border-white/20 text-white text-[0.9rem] font-medium 
                  transition-opacity ${currentIndex <= 0 ? 'opacity-10 pointer-events-none' : 'opacity-100'}`}>Prev</StaggeredButton>
              <StaggeredButton 
                onClick={() => handleProjectNav('next')} 
                disabled={currentIndex >= projectsData.length - 1} 
                enableHoverBg 
                className={`inline-flex items-center justify-center w-full py-1.5 
                border border-white/20 text-white text-[0.9rem] font-medium 
                transition-opacity ${currentIndex >= projectsData.length - 1 ? 'opacity-10 pointer-events-none' : 'opacity-100'}`}>Next</StaggeredButton>
            </motion.div>
          </div>

          {/* COL 2: Preview Area with Refined Loader */}
          <motion.div variants={fadeUpVariants} className="w-full relative order-1 lg:order-2">
            {/* Rasio kotak mengikuti gambar aktif (tanpa min-height paksa yang memotong gambar di mobile) */}
            <div
              className="relative w-full bg-[#1a1a1a] shadow-2xl overflow-hidden"
              style={{ aspectRatio: activeImage ? getImageRatio(activeImage) : 4 / 3 }}
            >
              
              <AnimatePresence>
                {isImageLoading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-[4px]"
                  >
                    <div className="custom-loader"></div>
                  </motion.div>
                )}
              </AnimatePresence>

              {activeImage && (
                <>
                  <img 
                    key={`ratio-${activeImage.publicId}`} 
                    src={getUrl(activeImage)} 
                    className="absolute inset-0 w-full h-full opacity-0 pointer-events-none" 
                    onLoad={() => setIsImageLoading(false)} 
                  />
                  <div className="absolute inset-0">
                    <BlurTransition
                      key={`blur-${activeImage.publicId}`} 
                      firstImageSrc={getUrl(prevImage) || getUrl(activeImage)}
                      secondImageSrc={getUrl(activeImage)}
                      duration={1.2}
                      className="w-full h-full"
                    />
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* COL 3: Links */}
          <motion.div variants={fadeUpVariants} className="text-center lg:text-right top-8 pb-8 lg:pb-0 order-3 lg:order-3">
            <div className="mb-6 flex justify-center lg:justify-end">
                <h3 className="text-[0.9rem] uppercase tracking-[0.05em] text-white/50 font-medium">Links</h3>
            </div>
            <div className="flex flex-row lg:flex-col flex-wrap gap-4 lg:gap-3 justify-center items-center lg:justify-end lg:items-end">
              {project.links.map((link, index) => (
                <StaggeredButton 
                  key={index} href={link.url} 
                  enableHoverBg={true}
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center justify-center w-36 py-1.5 border border-[#333] text-white text-[0.9rem]"
                  >
                  {link.label}
                </StaggeredButton>
              ))}
            </div>
          </motion.div>
        </div>

        {/* BOTTOM INFO */}
        <motion.div variants={fadeUpVariants} className="grid grid-cols-1 lg:grid-cols-[2fr_1.2fr] gap-8 lg:gap-8 pt-0 border-t border-white/20 pt-8">
          <div className="text-center lg:text-left ">
            <div className="mb-4 flex justify-center lg:justify-start">
               <h3 className="text-[0.9rem] uppercase tracking-[0.1em] text-white/50 overflow-hidden">
                  <MaskedReveal>Description</MaskedReveal>
               </h3>
            </div>
            <MaskedReveal>
              {/* description boleh string atau array paragraf; antar paragraf diberi jarak */}
              <div className="flex flex-col gap-4 md:gap-5">
                {(Array.isArray(project.description)
                  ? project.description
                  : String(project.description || '').split(/\n+/)
                ).map((para, idx) => (
                  <p key={idx} className="text-[1rem] md:text-[1.1rem] leading-[1.6] text-white font-light tracking-wide">
                    {para}
                  </p>
                ))}
              </div>
            </MaskedReveal>
          </div>

          <motion.div variants={fadeUpVariants} className="text-center lg:text-right">
            <div className="mb-4 flex justify-center lg:justify-end">
                <h3 className="text-[0.8rem] uppercase tracking-[0.1em] text-white/50 overflow-hidden">
                  <MaskedReveal>Tools</MaskedReveal>
                </h3>
            </div>
            <div className="flex flex-row flex-wrap lg:flex-col gap-x-6 gap-y-3 justify-center lg:items-end">
              {project.tools.map((tool, index) => (
                <div key={index} className="flex items-center gap-3 lg:flex-row-reverse">
                  <span className="shrink-0 w-1 h-1 bg-white/50"></span>
                  <span className="text-[1rem] md:text-[1rem] text-white leading-none font-light tracking-wide">
                    {tool.app}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}