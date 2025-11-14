// src/pages/NotFound.tsx
import { Link } from 'react-router-dom';
import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-6">
      <h1 className="text-8xl font-extrabold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">
        Sorry, the page you are looking for does not exist 😢
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-[#EF4444] text-white text-lg rounded-lg shadow-md hover:bg-[#B91C1C] transition duration-200"
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFound;
