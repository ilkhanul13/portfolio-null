import React, { useState } from 'react';
import { FaChevronDown } from "react-icons/fa6"; 
import { TbPdf } from "react-icons/tb";
import { RiDownloadLine } from "react-icons/ri";
import { HiMiniViewfinderCircle } from "react-icons/hi2";
import { AdobeIllustratorIcon, AdobeIPhotoshopIcon, AffinityIcon, CanvaIcon, ExcelIcon, FigmaIcon, WordIcon } from './SkillIcons';

const ICON_MAP = {
  'adobe_illustrator': AdobeIllustratorIcon,
  'adobe_photoshop': AdobeIPhotoshopIcon,
  'figma': FigmaIcon,
  'affinity': AffinityIcon,
  'canva': CanvaIcon,
  'ms_word': WordIcon,
  'ms_excel': ExcelIcon,
};

const ResumeAccordion = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handlePreview = (url) => { if (!url) return; window.open(url, '_blank'); };

  const handleDownload = async (url, filename) => {
    if (!url) return;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filename || 'document.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download error:", error);
      window.open(url, '_blank');
    }
  };

  return (
    <div className="flex flex-col mt-5 md:mt-10 lg:mt-10 w-full max-w-360 mx-auto text-white">
      {data.map((section, index) => {
        const isActive = activeIndex === index;
        return (
          <div 
            key={index} 
            className={`w-full bg-black border-none border-[#333] transition-colors duration-300 first:border-t-0 hover:bg-[#080808] reveal-child ${isActive ? 'bg-black!' : ''}`}
          >
            {/* HEADER (Clickable) */}
            <div 
              className="flex justify-between items-center py-8 md:py-12 cursor-pointer group" 
              onClick={() => toggleAccordion(index)}
            >
              <div className="flex items-center">
                <h2 className="text-[clamp(2rem,4vw,4rem)] font-normal m-0 text-white leading-none">{section.title}</h2>
              </div>
              <div className="pr-2 md:pr-4">
                <FaChevronDown 
                  className={`text-[1.2rem] md:text-[1.5rem] text-[#666] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-white ${isActive ? 'rotate-180 text-white' : 'rotate-0'}`} 
                />
              </div>
            </div>

            {/* CONTENT WRAPPER (Expandable) */}
            <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isActive ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <div className={`overflow-hidden transition-all duration-500 ease-out ${isActive ? 'opacity-100 translate-y-0 pb-12' : 'opacity-0 translate-y-5'}`}>
                
                {/* 1.EXPERIENCE */}
                {section.title === 'Experience' && section.items.map((item, i) => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-5 py-8 border-t border-[#222]">
                    <div className="flex flex-col items-start">
                      <div className="text-[1.1rem] text-white flex flex-col">
                        <span className="font-mono">{item.year}</span>
                        {item.timeline && <span className="font-mono text-[1.1rem] text-[#888]">{item.timeline}</span>}
                      </div>
                      {item.category && (
                        <div className="text-[0.8rem] text-black uppercase font-bold bg-[#d2ff00] w-25 py-1 mt-2 md:mt-3 inline-flex items-center justify-center">
                          {item.category}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-[1.5rem] font-medium text-white m-0 mb-2">{item.role}</h4>
                      <a 
                        href={item.link} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative inline-block text-[1.1rem] text-[#aaa] transition-colors duration-300 hover:text-[#d2ff00] mb-4"
                      >
                        <span>{item.company}</span>
                        <span 
                          className="absolute bottom-0 left-0 h-[1px] w-full origin-right scale-x-0 
                          bg-[#d2ff00] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] 
                            group-hover:origin-left group-hover:scale-x-100" />
                      </a>
                      
                      {item.description && (
                        <div className="flex flex-col gap-2">
                          {item.description.map((desc, idx) => (
                            <p key={idx} className="text-[1rem] text-[#888] leading-1.6 m-0">
                              {desc}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* 2.EDUCATION */}
                {section.title === 'Education' && section.items.map((item, i) => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-5 py-8 border-t border-[#222]">
                    <div className="flex flex-col items-start">
                      <div className="text-[1.1rem] text-white">
                        <span className="font-mono">{item.year}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[1.5rem] font-medium text-white m-0 mb-2">{item.role}</h4>
                      <a 
                        href={item.link} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative inline-block text-[1.1rem] text-[#aaa] transition-colors duration-300 hover:text-[#d2ff00]"
                      >
                        <span>{item.university}</span>
                        <span 
                          className="absolute bottom-0 left-0 h-[1px] w-full origin-right scale-x-0 
                          bg-[#d2ff00] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] 
                            group-hover:origin-left group-hover:scale-x-100" />
                      </a>
                    </div>
                  </div>
                ))}

                {/* --- TIPE FILES (Certificates) --- */}
                {section.type === 'files' && section.items.map((item, i) => (
                  <div key={i} className="flex flex-col md:flex-row items-start md:items-center p-6 bg-[#111] border border-[#333] mt-4 hover:bg-[#222] transition-colors gap-4 md:gap-0">
                    <div className="flex items-center w-full md:w-auto grow">
                      <div className="w-12.5 h-12.5 bg-[#d2ff00] flex items-center justify-center mr-6 shrink-0">
                        <TbPdf size={30} color="#222" />
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-[1.1rem] text-white m-0">{item.role}</h4>
                        <span className="text-[0.8rem] text-[#888]">{item.company} • <span className="font-mono">{item.year}</span></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto mt-3 md:mt-0">
                      <button 
                        onClick={() => handlePreview(item.fileUrl)} 
                        className="
                          cursor-pointer group relative overflow-hidden 
                          flex-1 md:flex-none inline-flex items-center justify-center 
                          h-11 px-6 border border-[#333] bg-transparent text-[#eee] 
                          transition-all duration-300
                        "
                      >
                        {/* Layer Background Animasi */}
                        <span className="absolute inset-0 bg-[#d2ff00] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.80,0,0.43,1)]"></span>
                        
                        {/* Content (Icon & Text) - Dibungkus agar di atas background */}
                        <div className="relative z-10 flex items-center gap-2 group-hover:text-black transition-colors duration-300">
                          <HiMiniViewfinderCircle size={20} className="transition-transform group-hover:scale-110"/>
                          <span className="font-medium text-sm tracking-wide">View</span>
                        </div>
                      </button>

                      {/* Button Download */}
                      <button 
                        onClick={() => handleDownload(item.fileUrl, `${item.role}.pdf`)} 
                        className="
                          cursor-pointer group relative overflow-hidden 
                          flex-none inline-flex items-center justify-center 
                          h-11 w-11 border border-[#333] bg-transparent text-[#eee] 
                          transition-all duration-300
                        "
                      >
                        {/* Layer Background Animasi */}
                        <span className="absolute inset-0 bg-[#d2ff00] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.80,0,0.43,1)]"></span>
                        
                        {/* Content (Icon) */}
                        <span className="relative z-10 group-hover:text-black transition-colors duration-300">
                          <RiDownloadLine size={20} />
                        </span>
                      </button>
                    </div>
                  </div>
                ))}

                {/* --- TIPE SKILLS (UPDATED) --- */}
                {section.type === 'skills' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {section.items.map((item, i) => (
                      <div 
                        key={i} 
                        // Layout Flexrow, padding disesuaikan agar rapi
                        className="flex flex-row items-center justify-between p-4 pl-4 pr-4 md:p-4 md:pl-4 md:pr-4 bg-[#111] border border-[#333] hover:bg-[#222] transition-colors group"
                      >
                          
                        {/* GROUP KIRI: Icon & Text Info */}
                        <div className="flex items-center min-w-0 mr-3"> {/* min-w-0 agar text bisa truncate kalau kepanjangan */}
                          
                          {/* Icon Wrapper */}
                          <div className="w-13 h-13 bg-white flex items-center justify-center mr-4 shrink-0 p-2.5 overflow-hidden">
                              {/* Cek tipe datanya: String (URL) atau Element (SVG code) */}
                              {ICON_MAP[item.icon] ? (
                                  // Jika ketemu key-nya di Map (misal "adobe_illustrator"), render SVG
                                  ICON_MAP[item.icon]
                              ) : (
                                  // Jika tidak ketemu, anggap itu URL gambar biasa
                                  <img src={item.icon} alt={item.Technology} className="w-full h-full object-contain" />
                              )}
                          </div>

                          {/* Text Wrapper */}
                          <div className="flex flex-col overflow-hidden">
                              <h4 className="text-[1rem] md:text-[1.1rem] text-white m-0 truncate">{item.Technology}</h4>
                              <span className="text-[0.8rem] text-[#888] truncate">{item.type}</span>
                          </div>
                        </div>

                        {/* GROUP KANAN: Rating Badge (Style mirip tombol action) */}
                        <div className="flex-none">
                          <a
                            className="
                              group relative overflow-hidden
                              inline-flex items-center justify-center 
                              h-10 px-5 md:h-11 md:px-6 
                              text-black text-xs md:text-sm font-medium tracking-wide
                              whitespace-nowrap bg-[#d2ff00]
                            "
                          >
                            {/* 1. Layer Animasi Background */}
                            <span 
                              className="
                                absolute inset-0 
                                bg-white 
                                translate-y-full group-hover:translate-y-0 
                                transition-transform duration-500 ease-[cubic-bezier(0.80,0,0.43,1)]
                              "
                            ></span>

                            {/* 2. Text (Harus relative & z-10 agar di atas background) */}
                            <span className="relative z-10 group-hover:text-black transition-colors duration-300">
                              {item.rating}
                            </span>
                          </a>
                        </div>
                          
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ResumeAccordion;