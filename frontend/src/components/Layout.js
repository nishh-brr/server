import React from "react";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: "220px", padding: "30px" }}>
        {children}
      </div>
    </div>
  );
}

export default Layout;
