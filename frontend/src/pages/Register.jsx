import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [data, setData] = useState({
    username: '',
    password: '',
    isAdmin: false,
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const registerUser = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post('http://localhost:4000/api/auth/register', { ...data, is_admin: data.isAdmin });
      navigate('/login');
      alert("Registrasi Berhasil Silahkan Lakukan Login");
    } catch (error) {
      console.error(error);
      setError('Registrasi Gagal. Coba lagi');
    }
  };

  return (
    <div className="w-full flex items-center justify-center min-h-screen bg-slate-500">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-lg">
        <h2 className="text-2xl font-bold text-center text-slate-900">Register</h2>
        {error && <p className="text-center text-red-500">{error}</p>}
        <form onSubmit={registerUser} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-900">Username</label>
            <input
              type="text"
              placeholder="Enter username..."
              value={data.username}
              onChange={(e) => setData({ ...data, username: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-900">Password</label>
            <input
              type="password"
              placeholder="Enter password..."
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={data.isAdmin}
              onChange={(e) => setData({ ...data, isAdmin: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm font-medium text-slate-900">Register as Admin</label>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-slate-700 rounded hover:bg-slate-600"
          >
            Register
          </button>
        </form>
        <p className="text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-slate-700 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
