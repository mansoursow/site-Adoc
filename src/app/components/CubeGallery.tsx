'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function CubeGallery() {
  const cols = 16; 
  const rows = 8;
  const cubes = Array.from({ length: cols * rows });

  // --- CONFIGURATION DES IMAGES ---
  // On crée les URLs à l'intérieur du composant pour que Vite les traite correctement.
  // Note: Si l'erreur "Failed to resolve" persiste, vérifiez si vous avez besoin 
  // de deux ou trois "../" selon l'arborescence exacte créée par Figma.
  const imageSources = [
    new URL('../../assets/gallery/img1.jpg', import.meta.url).href,
    new URL('../../assets/gallery/img2.jpg', import.meta.url).href,
    new URL('../../assets/gallery/img3.jpg', import.meta.url).href,
    new URL('../../assets/gallery/img4.jpg', import.meta.url).href,
    new URL('../../assets/gallery/img5.jpg', import.meta.url).href,
    new URL('../../assets/gallery/img6.jpg', import.meta.url).href,
    new URL('../../assets/gallery/img7.jpg', import.meta.url).href,
    new URL('../../assets/gallery/img8.jpg', import.meta.url).href,
  ];

  return (
    <section className="py-20 bg-white w-full overflow-hidden">
      <div className="text-center mb-12 px-4">
        <h2 className="text-4xl md:text-5xl font-black text-[#0A2F73] mb-4 uppercase tracking-tighter">
          <span className="text-[#3F5F99]">NOTRE</span> GALERIE
        </h2>
        <div className="w-24 h-1.5 bg-[#BF0001] mx-auto"></div>
      </div>

      {/* Conteneur Full Width Panoramique */}
      <div className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center perspective-[1500px]">
        <div 
          className="grid gap-0.5 md:gap-1.5 w-full h-full px-2 md:px-10" 
          style={{ 
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
          }}
        >
          {cubes.map((_, i) => (
            <Cube 
              key={i} 
              index={i} 
              cols={cols} 
              rows={rows} 
              images={imageSources} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Cube({ index, cols, rows, images }: { index: number, cols: number, rows: number, images: string[] }) {
  const [hovered, setHovered] = useState(false);

  // Position globale dans la grille (0 à 15 pour colonnes, 0 à 7 pour lignes)
  const row = Math.floor(index / cols);
  const col = index % cols;

  // LOGIQUE POUR 8 IMAGES (2 lignes de 4 images)
  // Chaque image occupe un bloc de 4x4 cubes
  const imgColIndex = Math.floor(col / 4); // Résultat: 0, 1, 2 ou 3
  const imgRowIndex = Math.floor(row / 4); // Résultat: 0 ou 1
  const imageIndex = imgRowIndex * 4 + imgColIndex;

  // Position locale à l'intérieur d'une image (0 à 3)
  const localCol = col % 4;
  const localRow = row % 4;

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{
        rotateX: hovered ? 40 : 0,
        rotateY: hovered ? 40 : 0,
        z: hovered ? 40 : 0,
        scale: hovered ? 1.05 : 1
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative w-full h-full preserve-3d"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Face avant (Portion d'image) */}
      <div 
        className="absolute inset-0 bg-[#0A2F73] border border-white/5 overflow-hidden"
        style={{
          backgroundImage: `url('${images[imageIndex]}')`,
          backgroundSize: `400% 400%`, // Car l'image est découpée en 4x4 cubes
          backgroundPosition: `${localCol * 33.33}% ${localRow * 33.33}%`,
          backfaceVisibility: 'hidden'
        }}
      />
      
      {/* Face Haut (Épaisseur Orange) */}
      <div 
        className="absolute inset-0 bg-[#3F5F99]" 
        style={{ transform: 'rotateX(90deg) translateZ(12px)', height: '100%' }} 
      />
      
      {/* Face Droite (Épaisseur Rouge) */}
      <div 
        className="absolute inset-0 bg-[#BF0001]" 
        style={{ transform: 'rotateY(90deg) translateZ(12px)', width: '100%' }} 
      />
    </motion.div>
  );
}