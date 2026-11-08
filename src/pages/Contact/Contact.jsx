import { useRef, useState } from 'react';
import { motion } from 'framer-motion'; // 1. Import Framer Motion
import emailjs from '@emailjs/browser';
import PageTransition from '../../components/PageTransition';
import StaggeredButton from '../../components/StaggeredButton';

// --- 1. VARIANTS CONFIGURATION ---

// Container Utama: Mengatur Timing (Stagger)
const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.8, // Muncul setelah Page Transition selesai
      staggerChildren: 0.1, // Jeda antar elemen
    }
  }
};

// Animasi Masked Reveal (Untuk Teks)
const maskRevealVariants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { 
      duration: 1, 
      ease: [0.22, 1, 0.36, 1] 
    }
  }
};

// Animasi Fade Up (Untuk Input Fields & Button agar border tidak terpotong)
const itemFadeVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { 
      duration: 0.8, 
      ease: [0.22, 1, 0.36, 1] 
    }
  }
};

// --- 2. COMPONENT HELPER: MASKED REVEAL ---
const MaskedReveal = ({ children, className = "" }) => {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div variants={maskRevealVariants}>
        {children}
      </motion.div>
    </div>
  );
};

export default function Contact() {
  const form = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    emailjs
      .sendForm(serviceId, templateId, form.current, publicKey)
      .then(
        (result) => {
          console.log('SUCCESS!', result.text);
          alert("Message delivered! I'll reply to you shortly.");
          e.target.reset();
          setIsLoading(false);
        },
        (error) => {
          console.log('FAILED...', error.text);
          alert('Message sending failed. Please retry or contact via direct email or whatsApp.');
          setIsLoading(false);
        }
      );
  };

  return (
    <PageTransition routeName="Contact">
      <div className="w-full min-h-screen bg-black pt-22 md:pt-38 pb-32 px-5 md:px-10 box-border">
        
        {/* WRAPPER ANIMASI UTAMA */}
        <motion.div 
          className="w-full max-w-360 mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        > 
          
          {/* HEADER (Masked Reveal) */}
          <div className="mb-15 md:mb-20 text-center md:text-start">
            <h1 className="text-[clamp(2.5rem,6vw,6rem)] leading-[1.1] mb-12 text-white max-w-360 mx-auto w-full">
              <MaskedReveal>Let&apos;s start a projects</MaskedReveal>
              <MaskedReveal>together</MaskedReveal>
            </h1>      
          </div>

          {/* CONTENT WRAPPER */}
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-15 md:gap-20 mt-15 md:mt-20 relative">
              
              {/* --- FORM AREA --- */}
              <form ref={form} onSubmit={sendEmail} className="w-full mb-16 md:mb-32">
                  
                  {/* Input Group: Name */}
                  <div className="mb-7.5 md:mb-12.5">
                      <div className="mb-3.75">
                         <MaskedReveal>
                            <label htmlFor="name" className="block text-[0.85rem] md:text-[1rem] text-[#666] uppercase font-medium">
                              Your name
                            </label>
                         </MaskedReveal>
                      </div>
                      
                      {/* Input Field (Fade Up) */}
                      <motion.div variants={itemFadeVariants} className="border-b border-[#444] pb-2.5 transition-colors duration-300 focus-within:border-white">
                        <input 
                          type="text" 
                          id="name" 
                          name="user_name" 
                          placeholder="John Doe *" 
                          required 
                          className="w-full bg-transparent border-none text-white text-[1.1rem] md:text-[1.5rem] outline-none font-inherit p-0 placeholder-[#333] placeholder-opacity-100"
                        />
                      </motion.div>
                  </div>
                  
                  {/* Input Group: Email */}
                  <div className="mb-7.5 md:mb-12.5">
                      <div className="mb-3.75">
                        <MaskedReveal>
                          <label htmlFor="email" className="block text-[0.85rem] md:text-[1rem] text-[#666] uppercase font-medium">
                            Your email
                          </label>
                        </MaskedReveal>
                      </div>

                      <motion.div variants={itemFadeVariants} className="border-b border-[#444] pb-2.5 transition-colors duration-300 focus-within:border-white">
                        <input 
                          type="email" 
                          id="email" 
                          name="user_email" 
                          placeholder="john@doe.com *" 
                          required 
                          className="w-full bg-transparent border-none text-white text-[1.1rem] md:text-[1.5rem] outline-none font-inherit p-0 placeholder-[#333] placeholder-opacity-100"
                        />
                      </motion.div>
                  </div>

                  {/* Input Group: Message */}
                  <div className="mb-7.5 md:mb-12.5">
                      <div className="mb-3.75">
                        <MaskedReveal>
                          <label htmlFor="message" className="block text-[0.85rem] md:text-[1rem] text-[#666] uppercase font-medium">
                            Your message
                          </label>
                        </MaskedReveal>
                      </div>

                      <motion.div variants={itemFadeVariants} className="border-b border-[#444] pb-2.5 transition-colors duration-300 focus-within:border-white">
                        <textarea 
                          id="message" 
                          name="message" 
                          rows="4" 
                          placeholder="Hello, I need..." 
                          required
                          className="w-full bg-transparent border-none text-white text-[1.1rem] md:text-[1.5rem] outline-none font-inherit p-0 resize-y placeholder-[#333] placeholder-opacity-100"
                        ></textarea>
                      </motion.div>
                  </div>

                  {/* Submit Button (Fade Up) */}
                  <motion.div variants={itemFadeVariants}>
                    <StaggeredButton 
                      type="submit" 
                      disabled={isLoading}
                      enableHoverBg={!isLoading} 
                      hoverBgClass="bg-black" 
                      hoverTextClass="group-hover:text-white"
                      className={`
                        w-full md:w-full inline-flex items-center justify-center 
                        px-8 py-4 border border-[#333]
                        text-[1.2rem] font-medium transition-all duration-300
                        
                        ${isLoading 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-[#d2ff00] text-black' 
                        }
                      `}
                    >
                      {isLoading ? 'Sending...' : 'Send Message'}
                    </StaggeredButton>
                  </motion.div>
              </form>

              {/* --- SIDEBAR DETAILS --- */}
              <div className="flex flex-col gap-1.25 md:mt-5">
                  
                  {/* Contact Info */}
                  <div className="mb-8 md:mb-0 text-center md:text-start">
                    <MaskedReveal className="mb-3.75">
                      <h3 className="text-[#666] uppercase text-[1rem] tracking-[0.05em] text-center md:text-start">Contact Details</h3>
                    </MaskedReveal>
                    
                    <MaskedReveal className="mb-2.5">
                       <StaggeredButton
                         href="mailto:ilkhanull@gmail.com"
                         enableHoverBg={false}
                         className="text-[1.2rem] text-white hover:text-[#d2ff00] transition-colors duration-300"
                       >
                         ilkhanull@gmail.com
                       </StaggeredButton>
                    </MaskedReveal>
                    <MaskedReveal className="mb-2.5">
                       <StaggeredButton
                         href="https://wa.me/6281323233129"
                         target="_blank"
                         rel="noopener noreferrer"
                         enableHoverBg={false}
                         className="font-mono text-[1.2rem] text-white hover:text-[#d2ff00] transition-colors duration-300"
                       >
                         +62-81323233129
                       </StaggeredButton>
                    </MaskedReveal>
                  </div>
                  
                  {/* Socials */}
                  <div className="mt-0 md:mt-8">
                    <MaskedReveal className="mb-3.75">
                       <h3 className="text-[#666] uppercase text-[1rem] tracking-[0.05em] text-center md:text-start">Socials</h3>
                    </MaskedReveal>
                      
                      {/* Social Buttons Wrapper (Fade Up) */}
                      <motion.div 
                        variants={itemFadeVariants}
                        className="flex flex-row lg:flex-col flex-wrap justify-center items-center md:justify-start md:items-start gap-2"
                      > 

                        <StaggeredButton 
                          href="https://www.linkedin.com/in/ilkhanul/" 
                          enableHoverBg={true}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="
                            inline-flex items-center justify-center 
                            w-36 py-1.5
                            text-[1.2rem] text-white no-underline 
                            border border-[#333]
                            transition-colors duration-300
                          "
                        >
                          Linkedin
                        </StaggeredButton>

                        <StaggeredButton 
                          href="https://github.com/ilkhanul13" 
                          enableHoverBg={true}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="
                            inline-flex items-center justify-center 
                            w-36 py-1.5
                            text-[1.2rem] text-white no-underline 
                            border border-[#333]
                            transition-colors duration-30
                          "
                        >
                          Github
                        </StaggeredButton>

                        <StaggeredButton 
                          href="https://www.instagram.com/ilkhanul_/" 
                          enableHoverBg={true}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="
                            inline-flex items-center justify-center 
                            w-36 py-1.5
                            text-[1.2rem] text-white no-underline 
                            border border-[#333]
                            transition-colors duration-300
                          "
                        >
                          Instagram
                        </StaggeredButton>

                      </motion.div>
                  </div>
              </div>

          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}