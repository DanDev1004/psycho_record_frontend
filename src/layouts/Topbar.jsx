import React, { useState } from "react";
import { IonIcon } from "@ionic/react";
import { menuOutline, personCircle } from "ionicons/icons";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, reset } from "../features/authSlice";
import "../assets/styles/menu_perfil.css";

const Topbar = ({ onToggle }) => {
  const { user } = useSelector((state) => state.auth);
  const { currentTitle } = useSelector((state) => state.title);
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!user) {
    return null; 
  }

  const handleUserIconClick = () => {
    setShowMenu(!showMenu);
  };

  const handleLogout = () => {
    dispatch(LogOut());
    dispatch(reset());
    navigate("/"); 
  };

  return (
    <nav className="topbar">
      <div className="palanca" onClick={onToggle}>
        <IonIcon icon={menuOutline} />
      </div>

      <div className="titulo-label">{currentTitle}</div>

      <div className="user-menu-container">
        <div className="user-label">
          <Link to={`/usuario/edit/${user.ID_USUARIO}`}>
            <div className="user-info">
              <p className="user-name">
                {user.USERNAME || "----------"}
              </p>
              <p className="user-role">
                {user.ROL?.NOMBRE_ROL || "----------"}
              </p>
            </div>
          </Link>

          <div className="user-icon-container" onClick={handleUserIconClick}>
            <IonIcon icon={personCircle} className="user-icon" />
          </div>
        </div>

        {/* Menú desplegable para cerrar sesión */}
        {showMenu && (
          <div className="dropdown-menu">
            <button onClick={handleLogout} className="logout-button">
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Topbar;
