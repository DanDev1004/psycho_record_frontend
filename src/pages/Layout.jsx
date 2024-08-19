import React, { useState } from "react";
import Topbar from "../partials/Topbar";
import Sidebar from "../partials/Sidebar";

const Layout = ({ children }) => {
  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    setIsActive((prevState) => !prevState);
  };

  return (
    <React.Fragment>
      <Sidebar isActive={isActive} />
      <main className={`principal ${isActive ? "activado" : ""}`}>
        <Topbar onToggle={handleToggle} />
        <div className="details">{children}</div>
      </main>
    </React.Fragment>
  );
};

export default Layout;