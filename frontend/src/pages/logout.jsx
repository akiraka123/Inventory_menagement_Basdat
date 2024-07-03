import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); // Ganti '/login' dengan rute login Anda
  };

  return (
    <div className="w-full min-h-fit p-3 bg-slate-600 text-white flex flex-col">
      <div className="flex flex-col mx-auto my-auto">
        <button onClick={handleLogout} className="px-4 py-2 font-bold">
          <h1 className="text-3xl font-semibold mx-auto text-red-700 hover:underline">TEKAN INI LOGOUT</h1>
        </button>
      </div>
    </div>
  );
};

export default Logout;
