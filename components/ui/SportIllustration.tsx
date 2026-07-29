import React from 'react';

interface SportIllustrationProps {
  sportId: string;
  className?: string;
}

export function SportIllustration({ sportId, className = "" }: SportIllustrationProps) {
  // Tutte le illustrazioni sono SVG flat, vettoriali e perfettamente trasparenti
  // Utilizzano il bianco con varie opacità per un look elegante sulla card colorata

  const renderIllustration = () => {
    switch (sportId) {
      case "CALCIO":
      case "CALCETTO":
        return (
          <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="4"/>
            <path d="M50 30L65 42L59 60H41L35 42L50 30Z" fill="white" fillOpacity="0.4" stroke="white" strokeWidth="4" strokeLinejoin="round"/>
            <path d="M50 30V10" stroke="white" strokeWidth="4" strokeLinecap="round"/>
            <path d="M65 42L85 35" stroke="white" strokeWidth="4" strokeLinecap="round"/>
            <path d="M35 42L15 35" stroke="white" strokeWidth="4" strokeLinecap="round"/>
            <path d="M59 60L70 75" stroke="white" strokeWidth="4" strokeLinecap="round"/>
            <path d="M41 60L30 75" stroke="white" strokeWidth="4" strokeLinecap="round"/>
          </svg>
        );
      
      case "BASKET":
        return (
          <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="white" fillOpacity="0.25" stroke="white" strokeWidth="4"/>
            <path d="M50 5V95" stroke="white" strokeWidth="4"/>
            <path d="M5 50H95" stroke="white" strokeWidth="4"/>
            <path d="M25 10C45 30 45 70 25 90" stroke="white" strokeWidth="4" strokeLinecap="round"/>
            <path d="M75 10C55 30 55 70 75 90" stroke="white" strokeWidth="4" strokeLinecap="round"/>
          </svg>
        );

      case "TENNIS":
      case "PADEL":
        return (
          <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="white" fillOpacity="0.3" stroke="white" strokeWidth="4"/>
            <path d="M20 15C45 25 55 60 40 90" stroke="white" strokeWidth="4" strokeLinecap="round"/>
            <path d="M80 15C55 25 45 60 60 90" stroke="white" strokeWidth="4" strokeLinecap="round"/>
          </svg>
        );

      case "PALLAVOLO":
      case "BEACH_VOLLEY":
        return (
          <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="4"/>
            <path d="M10 30C40 40 70 20 80 5" stroke="white" strokeWidth="4" strokeLinecap="round"/>
            <path d="M20 90C40 60 80 50 95 60" stroke="white" strokeWidth="4" strokeLinecap="round"/>
            <path d="M5 60C30 80 60 90 85 80" stroke="white" strokeWidth="4" strokeLinecap="round"/>
          </svg>
        );

      case "RUNNING":
        return (
          <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 75H80C88 75 90 68 85 62C70 45 60 40 50 40C40 40 35 30 30 25C25 20 15 20 15 30V65C15 70 17 75 20 75Z" fill="white" fillOpacity="0.3" stroke="white" strokeWidth="4" strokeLinejoin="round"/>
            <path d="M20 75H80" stroke="white" strokeWidth="8" strokeLinecap="round"/>
            <path d="M30 40L45 55" stroke="white" strokeWidth="4" strokeLinecap="round"/>
            <path d="M40 35L55 50" stroke="white" strokeWidth="4" strokeLinecap="round"/>
          </svg>
        );

      case "YOGA":
        return (
          <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 90C50 90 20 80 10 50C0 20 30 30 50 50C70 30 100 20 90 50C80 80 50 90 50 90Z" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="4" strokeLinejoin="round"/>
            <path d="M50 90C50 90 35 70 35 45C35 20 50 10 50 10C50 10 65 20 65 45C65 70 50 90 50 90Z" fill="white" fillOpacity="0.4" stroke="white" strokeWidth="4" strokeLinejoin="round"/>
          </svg>
        );

      case "CICLISMO":
        return (
          <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="60" r="25" fill="white" fillOpacity="0.1" stroke="white" strokeWidth="4"/>
            <circle cx="80" cy="60" r="25" fill="white" fillOpacity="0.1" stroke="white" strokeWidth="4"/>
            <circle cx="55" cy="60" r="8" fill="white" fillOpacity="0.4" stroke="white" strokeWidth="4"/>
            <path d="M30 60L45 35H70" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M55 60L40 25H30" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M80 60L70 35L75 25" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );

      case "NUOTO":
        return (
          <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 40C25 20 45 20 60 40C75 60 90 60 90 40" stroke="white" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.8"/>
            <path d="M10 60C25 40 45 40 60 60C75 80 90 80 90 60" stroke="white" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.5"/>
            <path d="M10 80C25 60 45 60 60 80C75 100 90 100 90 80" stroke="white" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.2"/>
          </svg>
        );

      case "ARTI_MARZIALI":
        return (
          <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="40" width="60" height="20" rx="4" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="4"/>
            <path d="M40 40V60" stroke="white" strokeWidth="4"/>
            <path d="M60 40V60" stroke="white" strokeWidth="4"/>
            <path d="M50 60L40 90" stroke="white" strokeWidth="4" strokeLinecap="round"/>
            <path d="M50 60L60 85" stroke="white" strokeWidth="4" strokeLinecap="round"/>
          </svg>
        );

      default:
        // Una stella generica per gli sport non specificati
        return (
          <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 10L61.8 36.5H90.2L67.2 53.2L76 79.5L50 62.8L24 79.5L32.8 53.2L9.8 36.5H38.2L50 10Z" fill="white" fillOpacity="0.3" stroke="white" strokeWidth="4" strokeLinejoin="round"/>
          </svg>
        );
    }
  };

  return renderIllustration();
}
