import { useState } from "react";
import Navbar from "./layout/Navbar.jsx";
import Sidebar from "./layout/Sidebar";
import { Appcontext } from "./context/Appcontext";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

import Home from "./pages/home.jsx";
import Collection from "./pages/collection/collection.jsx";
import CollectionDetail from "./pages/collection/collection_detail.jsx";
import NotFound from "./pages/404.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Logout from "./pages/logout.jsx";

function App() {
  const defaultAppdata = {
    sidebarVisible: true,
  };

  const [appdata, setAppdata] = useState(defaultAppdata);

  const location = useLocation();
  const hideNavbarAndSidebar = location.pathname === "/login" || location.pathname === "/register"

  return (
      <Appcontext.Provider value={{ appdata, setAppdata }}>
        {!hideNavbarAndSidebar && <Navbar />}
        <div className="flex">
          {!hideNavbarAndSidebar && <Sidebar />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/collection/:id" element={<CollectionDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Appcontext.Provider>
  );
}

export default App;
