// src/pages/NotFound.tsx
import { Link } from 'react-router-dom';
import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-6">
      <h1 className="text-8xl font-extrabold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">
        La página que buscas no existe 😢
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-[#00723F] text-white text-lg rounded-lg shadow-md hover:bg-[#005f32] transition duration-200"
      >
        Volver al inicio
      </Link>
    </div>
  );
};

export default NotFound;
