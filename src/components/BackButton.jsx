import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function BackButton({ to, label }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      aria-label={label}
      title={label}
      className="flex items-center justify-center w-11 h-11 rounded-full text-gray-300 bg-gray-800/50 hover:bg-gray-700 hover:text-white border border-gray-700/50 mb-8 transition-all shadow-sm backdrop-blur-sm"
    >
      <ArrowLeft size={20} />
    </button>
  );
}