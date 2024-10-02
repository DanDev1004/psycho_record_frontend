import React from "react";
import { IonIcon } from "@ionic/react";
import { menuOutline, personCircle } from "ionicons/icons";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Topbar = ({ onToggle }) => {
  const { user } = useSelector((state) => state.auth);
  const { currentTitle } = useSelector((state)=>state.title);

  if (!user) {
    return null; 
  }

  return (
    <nav className="topbar">
      <div className="palanca" onClick={onToggle}>
        <IonIcon icon={menuOutline} />
      </div>

      <div className="titulo-label">{currentTitle}</div>

      <Link to={`/usuario/edit/${user.ID_USUARIO}`} className="user-label">
        <div className="user-info">
          <p className="user-name">
            {user.USERNAME || "----------"}
          </p>
          <p className="user-role">
            {user.ROL?.NOMBRE_ROL || "----------"}
          </p>
        </div>
        <IonIcon icon={personCircle} className="user-icon" />
      </Link>
    </nav>
  );
};

export default Topbar;
