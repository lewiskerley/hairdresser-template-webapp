import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteConfig } from '../context/SiteConfigContext';
import { galleryByType, imgUrl } from '../config/gallery';
import AnimatedSection from './ui/AnimatedSection';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function Gallery() {
  const { config, theme } = useSiteConfig();
  const images = galleryByType[config.type] || galleryByType.barber;
  const isHair = config.type === 'hairdresser';
  const [lightbox, setLightbox] = useState(null);

  return (
    <section id="gallery" className="py-24 px-5 sm:px-8" style={{ backgroundColor: theme.bg }}>
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <p
            className="text-xs tracking-[0.3em] uppercase mb-3"
            style={{ color: theme.accent, fontFamily: theme.fontBody }}
          >
            Our Work
          </p>
          <h2
            className="font-heading font-bold"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              color: theme.text,
              letterSpacing: isHair ? '0.02em' : '0.06em',
            }}
          >
            The Gallery
          </h2>
          <div className="mt-4 mx-auto w-12 h-0.5" style={{ backgroundColor: theme.accent }} />
        </AnimatedSection>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {images.map((img, i) => (
            <motion.div
              key={img.id}
              variants={itemVariants}
              className={`relative overflow-hidden rounded-lg cursor-pointer group ${
                i === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
              style={{ aspectRatio: i === 0 ? '1.2 / 1' : '1 / 1' }}
              onClick={() => setLightbox(img)}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.25 }}
            >
              <img
                src={imgUrl(img.id, i === 0 ? 1200 : 800)}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = `https://picsum.photos/seed/${img.id}/800/800`;
                }}
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }}
              >
                <span className="text-white text-xs tracking-widest uppercase" style={{ fontFamily: theme.fontBody }}>
                  {img.alt}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.92)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.img
              src={imgUrl(lightbox.id, 1400)}
              alt={lightbox.alt}
              className="max-w-full max-h-[90vh] rounded-lg object-contain"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute top-5 right-6 text-white/60 hover:text-white text-3xl leading-none"
              onClick={() => setLightbox(null)}
            >
              &times;
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
