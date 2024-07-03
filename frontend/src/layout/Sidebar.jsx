import React, { useState, useContext, useEffect } from "react";
import {
  FaLayerGroup,
  FaChevronDown,
  FaChevronUp,
  FaCircle,
  FaChartSimple,
  FaUser,
  FaCube,
} from "react-icons/fa6";
import { Appcontext } from "../context/Appcontext";
import { useNavigate, Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const isAdmin = () => {
    const token = localStorage.getItem('token');
    return token && JSON.parse(atob(token.split('.')[1])).is_admin;
  };

  const [collections, setCollections] = useState(null);
  const location = useLocation();

  const menu = [
    { title: "Home", icon: FaLayerGroup, link: "/" },
    {
      title: "Collection",
      icon: FaChartSimple,
      link: "/collection",
      subitems: collections,
    },
    // { title: "Lending", icon: FaCube, link: "/lending" },
    isAdmin() && { title: "Logout", icon: FaUser, link: "/login" },
  ].filter(Boolean);

  const [activetab, setActivetab] = useState(menu[0].title);
  const [collapse, setCollapse] = useState(null);

  const setToggler = (val) => {
    if (collapse === val) {
      setCollapse(null);
    } else {
      setCollapse(val);
    }
  };

  const { appdata, _ } = useContext(Appcontext);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('Logout berhasil');
    navigate('/login');
  };

  useEffect(() => {
    const fetchCollections = async () => {
      const response = await fetch("/api/collections");
      const json = await response.json();
      if (response.ok) {
        setCollections(json);
      }
    };
    fetchCollections();
  }, []);

  return (
    <div
      className={`${
        appdata.sidebarVisible ? "w-[280px]" : "w-[0px]"
      } min-h-screen transition-all duration-200 linear duration-900 flex-shrink-0 bg-gray-800 border-r border-r-[#888] text-white`}
    >
      <ul className="mt-2">
        {menu.map((x) => {
          if (x.subitems) {
            //render dropown sidebar item
            return (
              <li key={x.title} className={"w-full px-3 py-1 text-gray-300"}>
                <Link
                  onClick={() => {
                    !collapse && setToggler(x.title);
                  }}
                  to={x.link}
                  className={`flex px-4 py-3 group justify-between items-center hover:bg-gray-700 rounded-md ${
                    location.pathname === x.link ? "bg-gray-700" : ""
                  }`}
                >
                  <span className="left flex items-center group-hover:text-white">
                    {React.createElement(x.icon, { size: 20 })}
                    <p className="ml-4">{x.title}</p>
                  </span>
                  <span onClick={() => setToggler(x.title)} className="right">
                    {collapse === x.title ? (
                      <FaChevronUp size={14} />
                    ) : (
                      <FaChevronDown size={14} />
                    )}
                  </span>
                </Link>
                <ul
                  className={`${collapse === x.title ? "" : "hidden"}`}
                  key={x.key}
                >
                  {x.subitems.map((y) => {
                    return (
                      <li key={y.name} className="w-full py-1 text-gray-300">
                        <Link
                          to={`/collection/${y.id}`}
                          className={`flex px-4 py-3 group justify-between items-center hover:bg-gray-700 rounded-md ${
                            location.pathname === `${x.link}/${y.id}` &&
                            "bg-gray-700"
                          }`}
                        >
                          <span className="left flex items-center ml-4 group-hover:text-white">
                            {React.createElement(FaCircle, { size: 10 })}
                            <p className="ml-3">{y.name}</p>
                          </span>
                          <span className="right"></span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          } else {
            //render normal sidebar item
            return (
              <li key={x.title} className="w-full px-3 py-1 text-gray-300">
                <Link
                  to={x.link}
                  className={`flex px-4 py-3 group justify-between items-center hover:bg-gray-700 rounded-md ${
                    location.pathname === x.link ? "bg-gray-700" : ""
                  }`}
                  onClick={x.title === "Logout" ? handleLogout : null}
                >
                  <span className="left flex items-center group-hover:text-white">
                    {React.createElement(x.icon, { size: 20 })}
                    <p className="ml-4">{x.title}</p>
                  </span>
                  <span className="right"></span>
                </Link>
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
