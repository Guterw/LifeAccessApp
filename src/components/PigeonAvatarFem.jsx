// src/components/PigeonAvatarFem.jsx
import React from 'react';

export default function PigeonAvatarFem({ className = "w-12 h-12", accessory = "none" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      
      {/* ========================================= */}
      {/* ANIMAÇÕES CSS INJETADAS */}
      {/* ========================================= */}
      <style>
        {`
          @keyframes swingLeftFem { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(15deg); } }
          @keyframes swingRightFem { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(10deg); } }
          .leg-swing-fem-1 { transform-origin: 38px 60px; animation: swingLeftFem 3s ease-in-out infinite; }
          .leg-swing-fem-2 { transform-origin: 52px 60px; animation: swingRightFem 2.5s ease-in-out infinite 0.5s; }
        `}
      </style>

      {/* ========================================= */}
      {/* ACESSÓRIOS DE FUNDO (Ocultos por padrão na Intro) */}
      {/* ========================================= */}
      {/* (Mantido vazio para expansão futura se necessário) */}

      {/* ========================================= */}
      {/* BASE DO POMBO GEOMÉTRICO (PATRICIA) */}
      {/* ========================================= */}
      
      {/* PERNAS (Laranjas) */}
      <g fill="#ea580c">
        {/* Usando animação sutil sempre para dar vida */}
        <g className="leg-swing-fem-1">
          <rect x="36" y="60" width="4.5" height="22" rx="2" />
          <rect x="36" y="78" width="10" height="4.5" rx="2" />
        </g>
        <g className="leg-swing-fem-2">
          <rect x="50" y="60" width="4.5" height="22" rx="2" />
          <rect x="50" y="78" width="10" height="4.5" rx="2" />
        </g>
      </g>

      {/* CORPO BASE (Cinza) */}
      <path 
        d="M 18 60 C 15 65, 20 66, 25 66 L 55 66 C 62 66, 64 62, 63 55 L 59 32 C 58 28, 54 28, 51 30 C 35 38, 20 45, 18 60 Z" 
        fill="#475569" stroke="#cbd5e1" strokeWidth="2.5" strokeLinejoin="round" 
      />

      {/* ========================================= */}
      {/* CARACTERÍSTICAS FEMININAS SOLICITADAS */}
      {/* ========================================= */}

      {/* 1. SAIA ROSA GEOMÉTRICA */}
      <path 
        d="M 25 55 L 56 55 L 61 68 L 20 68 Z" 
        fill="#ec4899" stroke="#be185d" strokeWidth="1.5" strokeLinejoin="round" 
      />
      {/* Detalhe de dobra na saia */}
      <line x1="40" y1="55" x2="38" y2="68" stroke="#be185d" strokeWidth="1" opacity="0.5" />
      <line x1="48" y1="55" x2="50" y2="68" stroke="#be185d" strokeWidth="1" opacity="0.5" />


      {/* DETALHE NEON NO PESCOÇO (Mantido a identidade visual do app) */}
      <path d="M 44 40 L 59 36" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" />
      <path d="M 37 48 L 61 43" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" opacity="0.8" />


      {/* CABEÇA (Cinza) */}
      <path 
        d="M 52 30 L 54 14 C 55 8, 60 8, 65 10 L 75 16 C 78 18, 78 22, 74 25 L 52 30 Z" 
        fill="#334155" stroke="#cbd5e1" strokeWidth="2.5" strokeLinejoin="round" 
      />

      {/* BICO (Laranja) */}
      <path 
        d="M 72 18 L 90 23 C 93 24, 93 27, 88 28 L 70 25 Z" 
        fill="#f97316" stroke="#ea580c" strokeWidth="1.5" strokeLinejoin="round" 
      />

      {/* OLHO COM CÍLIOS SUTIS */}
      <>
        <path d="M 60 16 Q 63 14 66 16" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Três pequenos cílios geométricos */}
        <line x1="66" y1="16" x2="69" y2="14" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />
        <line x1="65" y1="15" x2="67" y2="12" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />
        <line x1="64" y1="14.5" x2="65" y2="11" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />
        
        <circle cx="63" cy="18.5" r="2.5" fill="#38bdf8" />
      </>

      {/* 2. CABELOS DOURADOS GEOMÉTRICOS */}
      <g fill="#fbbf24" stroke="#d97706" strokeWidth="1" strokeLinejoin="round">
        {/* Topete/Franja */}
        <path d="M 54 14 L 60 6 L 70 10 L 65 10 Z" />
        {/* Mecha Lateral Traseira */}
        <path d="M 54 14 L 48 18 L 50 26 L 52 24 Z" />
        {/* Mecha cobrindo parte da nuca */}
        <path d="M 75 16 L 78 22 L 74 28 L 70 25 Z" />
      </g>

    </svg>
  );
}