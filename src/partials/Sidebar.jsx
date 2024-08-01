import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IonIcon } from '@ionic/react';
import {
  homeOutline,
  calendarClearOutline,
  mailOutline,
  peopleOutline,
  schoolOutline,
  readerOutline,
  cogOutline,
  lockClosedOutline
} from 'ionicons/icons';

import logo from "../assets/images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, reset } from "../features/authSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const logout = () => {
    dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  };

  return (
    <aside className="navegacion">

      <ul >

        <li>
          <NavLink>
            <span class="icon">
              <img src={logo}
                style={{ height: '40px', marginTop: '10px' }}
                alt="tecnologo" />
            </span>
            <span class="title mt-1">I.E.S.T.P. "CHINCHA"</span>
          </NavLink>
        </li>

        <li>
          <NavLink to={"/dashboard"}>
            <span className="icon">
              <IonIcon icon={homeOutline} />
            </span>
            <span className="title">Dashboard</span>
          </NavLink>

        </li>

        {user && user.ID_ROL === 1 && (
          <li>
            <NavLink to={"/usuarios"}>
              <span className="icon">
                <IonIcon icon={peopleOutline} />
              </span>
              <span className="title">Usuarios</span>
            </NavLink>
          </li>
        )}

        {user && user.ID_ROL === 1 && (
          <li>
            <NavLink to={"/consultas"}>
              <span className="icon">
                <IonIcon icon={calendarClearOutline} />
              </span>
              <span className="title">Consultas(falta)</span>
            </NavLink>
          </li>
        )}

        {user && user.ID_ROL === 1 && (
          <li>
            <NavLink to={"/alumnos"}>
              <span className="icon">
                <IonIcon icon={schoolOutline} />
              </span>
              <span className="title">Alumnos(falta)</span>
            </NavLink>
          </li>
        )}

        <li>
          <NavLink to={"/derivaciones"}>
            <span className="icon">
              <IonIcon icon={mailOutline} />
            </span>
            <span className="title">Derivaciones</span>
          </NavLink>
        </li>

        {user && user.ID_ROL === 1 && (
          <li>
            <NavLink to={"/alumnos"}>
              <span className="icon">
                <IonIcon icon={readerOutline} />
              </span>
              <span className="title">Reporte(falta)</span>
            </NavLink>
          </li>
        )}

        <li>
          <NavLink to={"/configuracion"}>
            <span className="icon">
              <IonIcon icon={cogOutline} />
            </span>
            <span className="title">Configuracion(falta)</span>
          </NavLink>
        </li>

        <li itemType="submit" onClick={logout}>
          <a>
          <span className="icon">
            <IonIcon icon={lockClosedOutline} />
          </span>
          <span className="title">cerrar sesión</span>
          </a>
        </li>
      </ul>

    </aside>
  );
};

export default Sidebar;
