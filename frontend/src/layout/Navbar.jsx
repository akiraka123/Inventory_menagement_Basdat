import React, { useContext } from "react";
import { FaBarsStaggered } from "react-icons/fa6";
import { Appcontext } from "../context/Appcontext";
import { Link, useNavigate } from "react-router-dom";
import { IoIosLogIn, IoIosLogOut } from "react-icons/io";

const Navbar = () => {
  const { appdata, setAppdata } = useContext(Appcontext);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const user = token ? JSON.parse(atob(token.split('.')[1])) : null;
  const isAdmin = user ? user.is_admin : false;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="bg-gray-800 border-b border-b-[#888] text-white flex justify-between items-center px-4 py-3">
      <div className="flex items-center">
        <button
          onClick={() => setAppdata({ sidebarVisible: !appdata.sidebarVisible })}
          className="mr-3"
        >
          <FaBarsStaggered size={20} />
        </button>
        <Link to="/" className="flex items-center">
          <img
            src="https://placeholder.co/40x40"
            className="rounded-full"
            alt="Logo"
          />
          <span className="ml-4 text-xl font-semibold">Inventory Management</span>
        </Link>
      </div>
      <div className="flex items-center">
        {user ? (
          <>
            <span className="mr-4">{isAdmin ? 'Admin' : 'User'}</span>
            <button onClick={handleLogout} className="text-white text-xl flex items-center">
              <IoIosLogOut size={24} className="mr-2" />
              Log Out
            </button>
          </>
        ) : (
          <Link to="/login" className="text-white text-xl flex items-center">
            <IoIosLogIn size={24} className="mr-2" />
            Log In
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
