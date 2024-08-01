import React, { useEffect } from "react";
import Topbar from "../partials/Topbar";
import Sidebar from "../partials/Sidebar";

const Layout = ({ children }) => {
  useEffect(() => {
    const list = document.querySelectorAll('.navegacion li');
    const toggle = document.querySelector('.palanca');
    const navigation = document.querySelector('.navegacion');
    const main = document.querySelector('.principal');

    const activeLink = function () {
      list.forEach((item) => {
        item.classList.remove('hovered');
      });
      this.classList.add('hovered');
    };

    list.forEach((item) => item.addEventListener('mouseover', activeLink));

    if (toggle && navigation && main) {
      toggle.onclick = function () {
        navigation.classList.toggle('activado');
        main.classList.toggle('activado');
      };
    } else {
      console.error("NO se renderizaron los elementos");
    }

    return () => {
      list.forEach((item) => item.removeEventListener('mouseover', activeLink));
      if (toggle) toggle.onclick = null;
    };
    
  }, []);

  return (
    <React.Fragment>
      <div className="contenedor">
        <Sidebar />
      </div>
      <main className="principal">
        <Topbar />
        <div className="details">
          {children}
        </div>
      </main>
    </React.Fragment>
  );
};

export default Layout;
