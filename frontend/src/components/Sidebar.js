import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar({ closeSidebar }) {
  return (
    <div className="sidebar">
      <h2>Menu</h2>

      <ul>
        <li><NavLink to="/" onClick={closeSidebar}>Dashboard</NavLink></li>
        <li><NavLink to="/identity" onClick={closeSidebar}>Identity Trust</NavLink></li>
        <li><NavLink to="/device" onClick={closeSidebar}>Device Trust</NavLink></li>
        <li><NavLink to="/network" onClick={closeSidebar}>Network Security</NavLink></li>
        <li><NavLink to="/cloud" onClick={closeSidebar}>Hybrid Cloud</NavLink></li>
        <li><NavLink to="/policy" onClick={closeSidebar}>Policy Engine</NavLink></li>
        <li><NavLink to="/threat" onClick={closeSidebar}>Threat Monitor</NavLink></li>
        <li><NavLink to="/trust" onClick={closeSidebar}>Trust Engine</NavLink></li>
        <li><NavLink to="/audit" onClick={closeSidebar}>Audit Logs</NavLink></li>
      </ul>
    </div>
  );
}

export default Sidebar;
