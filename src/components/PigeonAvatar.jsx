// src/components/PigeonAvatar.jsx
import React from 'react';

export default function PigeonAvatar({ className = "w-12 h-12", accessory = "none" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      
      {/* ========================================= */}
      {/* ANIMAÇÕES CSS INJETADAS */}
      {/* ========================================= */}
      <style>
        {`
          @keyframes swingLeft { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(20deg); } }
          @keyframes swingRight { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(15deg); } }
          .leg-swing-1 { transform-origin: 38px 60px; animation: swingLeft 3s ease-in-out infinite; }
          .leg-swing-2 { transform-origin: 52px 60px; animation: swingRight 2.5s ease-in-out infinite 0.5s; }
        `}
      </style>

      {/* ========================================= */}
      {/* ACESSÓRIOS DE FUNDO (Atrás do Pombo) */}
      {/* ========================================= */}
      {accessory === 'teacher' && (
        <g transform="translate(5, 5)">
          <rect x="0" y="0" width="85" height="70" fill="#334155" stroke="#78350f" strokeWidth="4" rx="2" />
          <path d="M 10 15 Q 25 5 40 15 T 70 15" stroke="#f8fafc" strokeWidth="2" fill="none" opacity="0.3" strokeDasharray="5 3" />
          <path d="M 10 25 L 45 25" stroke="#f8fafc" strokeWidth="1.5" strokeDasharray="3 3" fill="none" opacity="0.3" />
          <text x="50" y="30" fill="#f8fafc" opacity="0.4" fontSize="10" fontFamily="monospace" fontWeight="bold">E=mc²</text>
        </g>
      )}

      {/* ========================================= */}
      {/* BASE DO POMBO GEOMÉTRICO */}
      {/* ========================================= */}
      <g fill="#ea580c">
        <g className={accessory === 'reading' ? 'leg-swing-1' : ''}>
          <rect x="36" y="60" width="4.5" height="22" rx="2" />
          <rect x="36" y="78" width="10" height="4.5" rx="2" />
        </g>
        <g className={accessory === 'reading' ? 'leg-swing-2' : ''}>
          <rect x="50" y="60" width="4.5" height="22" rx="2" />
          <rect x="50" y="78" width="10" height="4.5" rx="2" />
        </g>
      </g>

      {/* CORPO BASE */}
      <path 
        d="M 18 60 C 15 65, 20 66, 25 66 L 55 66 C 62 66, 64 62, 63 55 L 59 32 C 58 28, 54 28, 51 30 C 35 38, 20 45, 18 60 Z" 
        fill="#475569" stroke="#cbd5e1" strokeWidth="2.5" strokeLinejoin="round" 
      />

      {/* Roupas do Corpo (Skins) */}
      {accessory === 'teacher' && (
        <g>
          <path d="M 18 60 C 15 65, 20 66, 25 66 L 55 66 C 62 66, 64 62, 63 55 L 59 32 C 58 28, 54 28, 51 30 C 35 38, 20 45, 18 60 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 51 30 L 40 45 L 45 66" stroke="#cbd5e1" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 51 30 L 35 48" stroke="#cbd5e1" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <rect x="46" y="48" width="8" height="10" rx="1" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="48" y1="44" x2="48" y2="52" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="51" y1="45" x2="51" y2="52" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      )}

      {accessory === 'barista' && (
        <g>
          <path d="M 28 48 C 30 65, 55 66, 55 66 C 62 66, 64 62, 63 55 L 61 42 C 55 45, 35 45, 28 48 Z" fill="#15803d" stroke="#166534" strokeWidth="2" strokeLinejoin="round" />
          <line x1="51" y1="30" x2="60" y2="43" stroke="#15803d" strokeWidth="2.5" />
          <path d="M 45 52 L 55 50 L 53 58 L 44 60 Z" fill="#166534" />
        </g>
      )}

      {accessory === 'officer' && (
        <g>
          <path d="M 18 60 C 15 65, 20 66, 25 66 L 55 66 C 62 66, 64 62, 63 55 L 59 32 C 58 28, 54 28, 51 30 C 35 38, 20 45, 18 60 Z" fill="#1e3a8a" stroke="#1e40af" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 51 30 L 45 42 L 59 36" fill="#bfdbfe" />
          <polygon points="48,40 52,40 50,55" fill="#0f172a" />
          <polygon points="56,42 60,40 62,44 58,48 54,46" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
        </g>
      )}

      {/* NOVO: Uniforme de Concierge / Cobrador / Hotel */}
      {accessory === 'receptionist' && (
        <g>
          {/* Terno Vermelho Escuro (Vinho) */}
          <path d="M 18 60 C 15 65, 20 66, 25 66 L 55 66 C 62 66, 64 62, 63 55 L 59 32 C 58 28, 54 28, 51 30 C 35 38, 20 45, 18 60 Z" fill="#7f1d1d" stroke="#450a0a" strokeWidth="2" strokeLinejoin="round" />
          {/* Camisa Branca interna */}
          <path d="M 51 30 L 42 45 L 59 36 Z" fill="#f8fafc" />
          {/* Gravata Borboleta Preta */}
          <polygon points="48,39 44,36 44,42" fill="#0f172a" />
          <polygon points="48,39 52,36 52,42" fill="#0f172a" />
          <circle cx="48" cy="39" r="1.5" fill="#1e293b" />
          {/* Botões Dourados da Farda */}
          <circle cx="44" cy="48" r="1.5" fill="#fbbf24" />
          <circle cx="41" cy="56" r="1.5" fill="#fbbf24" />
        </g>
      )}

      {accessory === 'manager' && (
        <g>
          <path d="M 18 60 C 15 65, 20 66, 25 66 L 55 66 C 62 66, 64 62, 63 55 L 59 32 C 58 28, 54 28, 51 30 C 35 38, 20 45, 18 60 Z" fill="#334155" stroke="#1e293b" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 51 30 L 42 45 L 59 36 Z" fill="#f8fafc" />
          <polygon points="47,40 51,38 52,58 48,55" fill="#dc2626" />
        </g>
      )}
      
      {/* DETALHE NEON NO PESCOÇO 
          (Corrigido: Adicionei o 'receptionist' na lista que ESCONDE as linhas) */}
      {!['teacher', 'barista', 'officer', 'manager', 'receptionist'].includes(accessory) && (
        <>
          <path d="M 44 40 L 59 36" stroke="#4ade80" strokeWidth="4" strokeLinecap="round" />
          <path d="M 37 48 L 61 43" stroke="#a855f7" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
        </>
      )}

      {/* CABEÇA */}
      <path 
        d="M 52 30 L 54 14 C 55 8, 60 8, 65 10 L 75 16 C 78 18, 78 22, 74 25 L 52 30 Z" 
        fill="#334155" stroke="#cbd5e1" strokeWidth="2.5" strokeLinejoin="round" 
      />

      {/* BICO */}
      <path 
        d="M 72 18 L 90 23 C 93 24, 93 27, 88 28 L 70 25 Z" 
        fill="#f97316" stroke="#ea580c" strokeWidth="1.5" strokeLinejoin="round" 
      />

      {/* OLHO PADRÃO */}
      {accessory !== 'reading' && accessory !== 'teacher' && (
        <>
          <path d="M 60 16 Q 63 14 66 16" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <circle cx="63" cy="18.5" r="2.5" fill="#38bdf8" />
        </>
      )}

      {/* ========================================= */}
      {/* ACESSÓRIOS DINÂMICOS DE FRENTE (Cabeça e Mãos) */}
      {/* ========================================= */}

      {/* NOVO: CHAPÉU DE HOTEL/MENSAGEIRO (Pillbox Hat) */}
      {accessory === 'receptionist' && (
        <g transform="translate(56, 1) rotate(12)">
          {/* Corpo do Chapéu cilíndrico */}
          <path d="M -4 10 L -2 0 L 12 -2 L 14 8 Z" fill="#7f1d1d" stroke="#450a0a" strokeWidth="1.5" strokeLinejoin="round" />
          {/* Faixa dourada no chapéu */}
          <line x1="-3" y1="7" x2="13" y2="5" stroke="#fbbf24" strokeWidth="2" />
          {/* Botão no topo */}
          <circle cx="5" cy="-1" r="1.5" fill="#fbbf24" />
        </g>
      )}

      {/* CHAPÉU DE POLICIAL/OFICIAL */}
      {accessory === 'officer' && (
        <g transform="translate(52, 2) rotate(10)">
          <path d="M -2 12 Q 10 5 28 12" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M 0 10 L 4 -2 L 22 -2 L 26 10 Z" fill="#1e3a8a" stroke="#1e40af" strokeWidth="1.5" />
          <polygon points="13,2 16,6 10,6" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
        </g>
      )}

      {/* BANDEJA DE BARISTA */}
      {accessory === 'barista' && (
        <g transform="translate(62, 40) rotate(-5)">
          <rect x="0" y="16" width="28" height="2.5" rx="1" fill="#94a3b8" />
          <g transform="translate(6, -2)">
            <polygon points="0,0 12,0 10,18 2,18" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
            <rect x="-2" y="-2" width="16" height="4" fill="#94a3b8" rx="1" />
            <polygon points="1,8 11,8 10.5,14 1.5,14" fill="#15803d" />
          </g>
        </g>
      )}

      {/* PRANCHETA DE GERENTE */}
      {accessory === 'manager' && (
        <g transform="translate(65, 35) rotate(-15)">
          <rect x="0" y="0" width="18" height="24" rx="2" fill="#b45309" stroke="#78350f" strokeWidth="1" />
          <rect x="2" y="4" width="14" height="18" fill="#f8fafc" />
          <rect x="6" y="-2" width="6" height="4" rx="1" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
          <line x1="4" y1="8" x2="6" y2="8" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="8" y1="8" x2="14" y2="8" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />
          <line x1="4" y1="12" x2="6" y2="12" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="8" y1="12" x2="14" y2="12" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />
        </g>
      )}

      {/* Acessório: PROFESSOR (Giz e Óculos) */}
      {accessory === 'teacher' && (
        <>
          <g>
            <rect x="58" y="14" width="6" height="8" rx="0.5" fill="#f8fafc" fillOpacity="0.8" stroke="#94a3b8" strokeWidth="1.5" />
            <circle cx="61.5" cy="18" r="1.5" fill="#38bdf8" />
            <line x1="64" y1="17.5" x2="69" y2="18.5" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            <rect x="69" y="15" width="7" height="9" rx="0.5" fill="#f8fafc" fillOpacity="0.8" stroke="#94a3b8" strokeWidth="1.5" />
            <circle cx="73" cy="19.5" r="2" fill="#38bdf8" />
          </g>
          <rect x="75" y="45" width="14" height="4" rx="1" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" transform="rotate(-15 75 45)" />
        </>
      )}

      {/* Acessório: Lendo um Livro */}
      {accessory === 'reading' && (
        <>
          <g>
            <circle cx="61" cy="18" r="4.5" fill="#f8fafc" fillOpacity="0.7" stroke="#94a3b8" strokeWidth="1.5" />
            <circle cx="62" cy="18" r="1.5" fill="#38bdf8" />
            <line x1="65" y1="17.5" x2="68" y2="17.5" stroke="#94a3b8" strokeWidth="2" />
            <circle cx="72" cy="18" r="4.5" fill="#f8fafc" fillOpacity="0.7" stroke="#94a3b8" strokeWidth="1.5" />
            <circle cx="72" cy="18" r="1.5" fill="#38bdf8" />
          </g>
          <g transform="translate(72, 45) rotate(-10)">
            <path d="M 0 2 L -14 -6 L -14 5 L 0 13 Z" fill="#4d7c5f" stroke="#2d4a39" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M 0 2 L 15 -2 L 15 9 L 0 13 Z" fill="#4d7c5f" stroke="#2d4a39" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M 0 0 L -13 -7 L -13 3 L 0 10 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M 0 0 L 14 -3 L 14 7 L 0 10 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" strokeLinejoin="round" />
            <line x1="0" y1="0" x2="0" y2="10" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="-11" y1="-3" x2="-3" y2="1" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />
            <line x1="-11" y1="0" x2="-3" y2="4" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />
            <line x1="3" y1="0" x2="11" y2="-1.5" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />
            <line x1="3" y1="3" x2="11" y2="1.5" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />
          </g>
        </>
      )}

      {/* Acessório: Copo de Café simples */}
      {accessory === 'coffee' && (
        <g transform="translate(60, 42) rotate(8)">
          <polygon points="0,0 12,0 10,20 2,20" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
          <rect x="-2" y="-2" width="16" height="4" fill="#94a3b8" rx="1" />
          <polygon points="1,8 11,8 10.5,14 1.5,14" fill="#10b981" />
        </g>
      )}

      {/* Acessório: Boina Peaky Blinders */}
      {accessory === 'flatcap' && (
        <g transform="translate(52, 4) rotate(10)">
          <polygon points="0,10 10,-2 22,-2 32,10" fill="#0f172a" />
          <path d="M -2 10 L 36 10" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
          <rect x="14" y="-4" width="4" height="2" fill="#1e293b" />
        </g>
      )}

      {/* Acessório: Chapéu de Leprechaun e Cerveja */}
      {accessory === 'irish' && (
        <>
          <g transform="translate(56, -6) rotate(12)">
            <polygon points="4,15 4,0 16,0 16,15" fill="#15803d" />
            <rect x="0" y="15" width="20" height="3" fill="#166534" rx="1" />
            <rect x="4" y="10" width="12" height="3" fill="#000000" />
            <rect x="8" y="9" width="4" height="5" fill="none" stroke="#eab308" strokeWidth="1.5" />
          </g>
          <g transform="translate(62, 45)">
            <polygon points="0,2 12,2 10,20 2,20" fill="#eab308" />
            <path d="M-2 2 Q 6 -2 14 2 Z" fill="#f8fafc" />
          </g>
        </>
      )}

    </svg>
  );
}