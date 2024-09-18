import React, { useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import {
  homeOutline,
  calendarClearOutline,
  mailOutline,
  peopleOutline,
  schoolOutline,
  lockClosedOutline,
} from "ionicons/icons";

import logo from "../assets/images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, reset } from "../features/authSlice";

const Sidebar = ({ isActive }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const listRefs = useRef({});

  const logout = () => {
    dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  };


  const handleMouseOver = (key) => {
    Object.keys(listRefs.current).forEach((refKey) => {
      if (listRefs.current[refKey]) {
        listRefs.current[refKey].classList.toggle("hovered", refKey === key);
      }
    });
  };
  const setRef = (key, el) => {
    if (el) {
      listRefs.current[key] = el;
    }
  };

  return (
    <aside className={`navegacion  ${isActive ? "activado" : ""}`}
      style={{ overflow: "auto", scrollbarWidth: "none" }} >

      <div>

        <ul>

          <li>
            {/*LOGO*/}
            <NavLink>
              <span className="icon">
                <img src={logo} style={{ height: "40px", marginTop: "10px" }} alt="tecnologo" />
              </span>
              <span className="title mt-1">I.E.S.T.P. "CHINCHA"</span>
            </NavLink>
          </li>

          {/*DASHBOARD*/}
          <li ref={(el) => setRef("dashboard", el)} onMouseOver={() => handleMouseOver("dashboard")}>
            <NavLink to={"/dashboard"}>
              <span className="icon">
                <IonIcon icon={homeOutline} />
              </span>
              <span className="title">Dashboard</span>
            </NavLink>
          </li>

          {/*USUARIOS*/}
          {user && user.ID_ROL === 1 && (
            <li ref={(el) => setRef("usuarios", el)} onMouseOver={() => handleMouseOver("usuarios")}>
              <NavLink to={"/usuarios"}>
                <span className="icon">
                  <IonIcon icon={peopleOutline} />
                </span>
                <span className="title">Usuarios</span>
              </NavLink>
            </li>
          )}


          {/*ALUMNOS*/}
          {user && (user.ID_ROL === 1 || user.ID_ROL === 2 || user.ID_ROL === 3) && (
            <li ref={(el) => setRef("alumnos", el)} onMouseOver={() => handleMouseOver("alumnos")}>
              <NavLink to={"/alumnos"}>
                <span className="icon">
                  <IonIcon icon={schoolOutline} />
                </span>
                <span className="title">Alumnos</span>
              </NavLink>
            </li>
          )}


          {/*DERIVACIONES*/}
          {user && (user.ID_ROL === 1 || user.ID_ROL === 3)  && (
              <li ref={(el) => setRef("derivaciones", el)} onMouseOver={() => handleMouseOver("derivaciones")}>
              <NavLink to={"/derivaciones"}>
                <span className="icon">
                  <IonIcon icon={mailOutline} />
                </span>
                <span className="title">Derivaciones</span>
              </NavLink>
            </li>
  
          )}
        

          {/*CONSULTAS */}
          {user && (user.ID_ROL === 1 || user.ID_ROL === 2 )  && (
            <li ref={(el) => setRef("consultasps", el)} onMouseOver={() => handleMouseOver("consultasps")}>
              <NavLink to={"/consultasps"}>
                <span className="icon">
                  <IonIcon icon={calendarClearOutline} />
                </span>
                <span className="title">Consultas</span>
              </NavLink>
            </li>
          )}

          <li
            ref={(el) => setRef("cerrar_sesion", el)}
            onMouseOver={() => handleMouseOver("cerrar_sesion")}
            itemType="submit"
            onClick={logout}
          >
            <NavLink>
              <span className="icon">
                <IonIcon icon={lockClosedOutline} />
              </span>
              <span className="title">cerrar sesión</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
