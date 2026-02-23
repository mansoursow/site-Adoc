'use client';

import React, { useEffect, useRef, useState, memo } from 'react';
import './LogoLoop.css';

// ✅ Importations de tous les logos partenaires
import adepme from '@/assets/logo-partener/logo-adepme.png';
import ageroute from '@/assets/logo-partener/logo-ageroute.png';
import ancim from '@/assets/logo-partener/logo-ancim.jpg';
import apix from '@/assets/logo-partener/logo-apix.jpg';
import armp from '@/assets/logo-partener/logo-armp.jpg';
import artp from '@/assets/logo-partener/logo-artp.jpg';
import bambandiayesa from '@/assets/logo-partener/logo-bambandiayesa.png';
import boa from '@/assets/logo-partener/logo-boa.jpeg';
import cedeao from '@/assets/logo-partener/logo-cedeao.png';
import creditagricole from '@/assets/logo-partener/logo-creditagricole.jpg';
import der from '@/assets/logo-partener/logo-der.svg';
import ges from '@/assets/logo-partener/logo-ges.jpg';
import giz from '@/assets/logo-partener/logo-giz.png';
import mfb from '@/assets/logo-partener/logo-mfb.png';
import plan from '@/assets/logo-partener/logo-plan.jpg';
import saar from '@/assets/logo-partener/logo-saar.jpg';
import sar from '@/assets/logo-partener/logo-sar.png';
import seneau from '@/assets/logo-partener/logo-seneau.png';
import senelec from '@/assets/logo-partener/logo-senelec.png';
import shell from '@/assets/logo-partener/logo-shell.png';
import sodagri from '@/assets/logo-partener/logo-sodagri.webp';
import sones from '@/assets/logo-partener/logo-sones.jpg';
import total from '@/assets/logo-partener/logo-total.webp';

const LogoLoop = memo(({ logos, speed = 50, logoHeight = 40, gap = 80 }: any) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef<HTMLUListElement>(null);

  const [seqWidth, setSeqWidth] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const offsetRef = useRef(0);
  const lastTimestampRef = useRef<number | null>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (seqRef.current) {
        const width = seqRef.current.getBoundingClientRect().width;
        if (width > 0) setSeqWidth(width);
      }
    };
    updateWidth();
    const timer = setTimeout(updateWidth, 500);
    window.addEventListener('resize', updateWidth);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateWidth);
    };
  }, [logos]);

  useEffect(() => {
    if (seqWidth === 0) return;
    const animate = (timestamp: number) => {
      if (!lastTimestampRef.current) lastTimestampRef.current = timestamp;
      const deltaTime = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;
      const currentSpeed = isHovered ? 0 : speed;
      offsetRef.current += currentSpeed * deltaTime;
      if (offsetRef.current >= seqWidth) offsetRef.current = 0;
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      }
      requestAnimationFrame(animate);
    };
    const raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [seqWidth, isHovered, speed]);

  return (
    <div 
      ref={containerRef} 
      className="logoloop logoloop--fade"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ '--logoloop-gap': `${gap}px`, '--logoloop-logoHeight': `${logoHeight}px` } as any}
    >
      <div className="logoloop__track" ref={trackRef}>
        {[0, 1, 2, 3].map((i) => (
          <ul key={i} className="logoloop__list" ref={i === 0 ? seqRef : null}>
            {logos.map((logo: any, idx: number) => (
              <li key={idx} className="logoloop__item">
                <img src={logo.src} alt={logo.alt} className="grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
});

const partners = [
  { src: adepme, alt: "ADEPME" },
  { src: ageroute, alt: "AGEROUTE" },
  { src: ancim, alt: "ANCIM" },
  { src: apix, alt: "APIX" },
  { src: armp, alt: "ARMP" },
  { src: artp, alt: "ARTP" },
  { src: bambandiayesa, alt: "Bambandiayesa" },
  { src: boa, alt: "BOA" },
  { src: cedeao, alt: "CEDEAO" },
  { src: creditagricole, alt: "Crédit Agricole" },
  { src: der, alt: "DER" },
  { src: ges, alt: "GES" },
  { src: giz, alt: "GIZ" },
  { src: mfb, alt: "MFB" },
  { src: plan, alt: "Plan International" },
  { src: saar, alt: "SAAR" },
  { src: sar, alt: "SAR" },
  { src: seneau, alt: "SEN'EAU" },
  { src: senelec, alt: "SENELEC" },
  { src: shell, alt: "Shell" },
  { src: sodagri, alt: "SODAGRI" },
  { src: sones, alt: "SONES" },
  { src: total, alt: "Total" },
];

export function PartnersSection() {
  return (
    <section className="py-16 bg-white border-y border-gray-100 overflow-hidden">
      <div className="container mx-auto px-4 mb-10 text-center">
        <h3 className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs">
          ILS NOUS FONT CONFIANCE
        </h3>
      </div>
      <LogoLoop logos={partners} speed={50} gap={100} logoHeight={45} />
    </section>
  );
}