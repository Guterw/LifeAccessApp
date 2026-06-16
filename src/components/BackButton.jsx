import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function BackButton({ to, label }) {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate(to)} 
      className="flex items-center text-gray-300 bg-gray-800/50 hover:bg-gray-700 py-2.5 px-4 rounded-xl border border-gray-700/50 mb-8 transition-all shadow-sm backdrop-blur-sm w-fit"
    >
      <ArrowLeft size={18} className="mr-2" />
      <span className="font-semibold text-sm">{label}</span>
    </button>
  );
}