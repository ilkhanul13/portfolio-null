import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Tambahkan AnimatePresence
import PageTransition from '../../components/PageTransition';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import StaggeredButton from '../../components/StaggeredButton';
import useImageRatios from '../../hooks/useImageRatios';
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

// Load pertama menunggu page transition (0.8s); saat ganti filter langsung muncul
const getContainerVariants = (hasFiltered) => ({
  initial: { opacity: 1 },
  animate: {
    opacity: 1,
    transition: {
      delayChildren: hasFiltered ? 0.05 : 0.8,
      staggerChildren: hasFiltered ? 0.06 : 0.1,
    },
  },
});

// Grid: kartu 16:9 = 2 kolom dengan rasio ASLI 16:9 (tidak dipotong).
// Kartu "kotak" = 1 kolom dengan TINGGI SAMA dengan kartu 16:9 (jadi semua baris rata);
// lebarnya 1 kolom sehingga gambarnya sedikit di-crop di sisi kiri/kanan.
// Mobile (1 kolom): kotak tetap 1:1 dan lebar tetap 16:9.
const GAP = 11;

const gridStyles = `
  .work-wrap { container-type: inline-size; }
  .work-grid { --g: ${GAP}px; display: grid; gap: var(--g); grid-template-columns: 1fr; grid-auto-flow: dense; }
  .work-item { position: relative; overflow: hidden; }
  .work-item--sq { aspect-ratio: 1 / 1; }
  .work-item--wide, .work-item--wide-r { aspect-ratio: 16 / 9; }
  @media (min-width: 768px) {
    /* tinggi baris = tinggi kartu 16:9 yang lebarnya penuh (2 kolom) */
    .work-grid { grid-template-columns: repeat(2, 1fr); grid-auto-rows: calc(100cqw * 9 / 16); }
    .work-item--sq, .work-item--wide, .work-item--wide-r { aspect-ratio: auto; }
    .work-item--wide, .work-item--wide-r { grid-column: span 2; }
  }
  @media (min-width: 1024px) {
    .work-grid { grid-template-columns: repeat(3, 1fr); grid-auto-rows: calc((2 * ((100cqw - 2 * var(--g)) / 3) + var(--g)) * 9 / 16); }
    .work-item--wide { grid-column: 1 / span 2; }
    .work-item--wide-r { grid-column: 2 / span 2; }
  }
`;

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
  const [hasFiltered, setHasFiltered] = useState(false);
  const handleFilter = (cat) => {
    if (cat === activeCategory) return;
    setHasFiltered(true);
    setActiveCategory(cat);
  };

  const categories = useMemo(() => {
    const uniqueCategories = ["All", ...new Set(projectsData.map((item) => item.category))];
    return uniqueCategories;
  }, []);

const filteredProjects = useMemo(() => {
  return activeCategory === "All" 
    ? projectsData 
    : projectsData.filter((project) => project.category.trim() === activeCategory.trim());
}, [activeCategory]); // Gunakan useMemo agar tidak re-render berat

  // Rasio tiap kartu mengikuti gambar cover (gambar pertama) dari Cloudinary
  const coverImages = useMemo(
    () => projectsData.map((p) => p.images?.[0]).filter(Boolean),
    []
  );
  const getImageRatio = useImageRatios(coverImages);
  // Hanya cover yang benar-benar landscape ~16:9 (>= 1.6) jadi kartu lebar; selain itu kotak 1:1
  const isWide = (project) =>
    project.images?.[0] ? getImageRatio(project.images[0]) >= 1.6 : false;

  let wideCount = 0;

  return (
    <PageTransition routeName="Work">
      <style>{gridStyles}</style>
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
                    onClick={() => handleFilter(cat)}
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
          {/* Hanya 2 ukuran: kotak 1:1 (1 kolom) dan lebar 16:9 (2 kolom) -> kotak 1:1 selalu sama besar */}
          <div className="work-wrap mb-32">
            <motion.div
              key={activeCategory}
              variants={getContainerVariants(hasFiltered)}
              initial="initial"
              animate="animate"
              className="work-grid"
            >
              {filteredProjects.map((project) => {
                // Kartu lebar bergantian: ke-1 di kiri, ke-2 di kanan, ke-3 di kiri, dst (desktop)
                let cls = 'work-item--sq';
                if (isWide(project)) {
                  cls = wideCount % 2 === 0 ? 'work-item--wide' : 'work-item--wide-r';
                  wideCount += 1;
                }
                return (
                  <motion.div
                    key={project.id}
                    variants={cardVariants}
                    className={`work-item ${cls}`}
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}