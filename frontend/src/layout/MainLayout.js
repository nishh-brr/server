import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../App.css";

function MainLayout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Topbar */}
      <div className="topbar">
        <button className="menu-btn" onClick={() => setIsOpen(true)}>
          ☰
        </button>
        <h2>Zero Trust Dashboard</h2>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="overlay" onClick={() => setIsOpen(false)}></div>
      )}

      {/* Sidebar */}
      <div className={`sidebar-container ${isOpen ? "show" : ""}`}>
        <Sidebar closeSidebar={() => setIsOpen(false)} />
      </div>

      {/* Page Content */}
      <div className="main-content">
        <Outlet />
      </div>
    </>
  );
}

export default MainLayout;
