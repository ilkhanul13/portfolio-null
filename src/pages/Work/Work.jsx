import { useState, useMemo } from 'react'; // Tambahkan useState dan useMemo
import { motion, AnimatePresence } from 'framer-motion'; // Tambahkan AnimatePresence
import PageTransition from '../../components/PageTransition';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import RevealWrapper from '../../components/RevealWrapper';
import StaggeredButton from '../../components/StaggeredButton';
import { projectsData } from '../../utils/projectsData';

const textRevealVariants = {
  initial: { y: "110%" },
  animate: {
    y: "0%",
    transition: {
      duration: 1,
      delay: 0.6,
      ease: [0.76, 0, 0.24, 1],
    },
  },
};

// 2. Variasi Container untuk Button (Stagger Effect)
const filterContainerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.8,
    },
  },
};

const filterButtonVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] }
  }
};

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      delayChildren: 0.8,
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  initial: { y: 50, opacity: 0, scale: 0.95 },
  animate: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.8, 
      ease: [0.76, 0, 0.24, 1] 
    }
  }
};

export default function Work() {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    const uniqueCategories = ["All", ...new Set(projectsData.map((item) => item.category))];
    return uniqueCategories;
  }, []);

const filteredProjects = useMemo(() => {
  return activeCategory === "All" 
    ? projectsData 
    : projectsData.filter((project) => project.category.trim() === activeCategory.trim());
}, [activeCategory]); // Gunakan useMemo agar tidak re-render berat

  const getSizeClass = (size) => {
    if (size === 'large') {
      return "col-span-1 row-span-1 md:col-span-2 md:row-span-2 lg:col-span-4 lg:row-span-4";
    }
    if (size === 'medium') {
      return "col-span-1 row-span-1 md:col-span-1 md:row-span-1 lg:col-span-2 lg:row-span-2";
    }
    return "col-span-1 row-span-1";                      
  };


  return (
    <PageTransition routeName="Work">
      <div className="w-full px-5 md:px-10 pt-22 md:pt-38 pb-12 md:pb-32 box-border bg-black">
        <div className="w-full max-w-360 mx-auto">
          <div className="mb-12 overflow-hidden w-full">
            <motion.h1 
              variants={textRevealVariants}
              initial="initial"
              animate="animate"
              className="text-[clamp(2.5rem,6vw,6rem)] leading-[1.1] text-white font-medium origin-bottom-left"
            >
              Selected Work
            </motion.h1>
          </div>

          {/* --- BAGIAN FILTER BUTTONS --- */}
          <motion.div 
            variants={filterContainerVariants}
            initial="initial"
            animate="animate"
            className="flex flex-wrap gap-3 mb-12 items-center justify-center md:justify-start"
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat;

              return (
                <motion.div key={cat} variants={filterButtonVariants}>
                  <StaggeredButton
                    onClick={() => setActiveCategory(cat)}
                    isActive={isActive}
                    className={`
                      px-5 py-2 text-sm md:text-base font-medium
                      border border-white/20 transition-colors duration-300
                      ${isActive ? 'text-black' : 'text-white/60'}
                    `}
                  >
                    {cat}
                  </StaggeredButton>
                </motion.div>
              );
            })}
          </motion.div>

          {/* --- BAGIAN GRID PROJECT --- */}
          <RevealWrapper>
            <motion.div 
              variants={containerVariants}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-2.75 auto-rows-auto grid-flow-dense mb-32"
            >
              {filteredProjects.map((project) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }} // Animasi saat kartu hilang
                  transition={{ duration: 0.4 }}
                  key={project.id} 
                  variants={cardVariants}
                  className={`w-full relative aspect-square overflow-hidden reveal-child ${getSizeClass(project.size)}`}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>
          </RevealWrapper>

        </div>
      </div>
    </PageTransition>
  );
}