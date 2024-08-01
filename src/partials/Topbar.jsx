import React from "react";
import { IonIcon } from '@ionic/react';
import {
  menuOutline,
  personCircle
} from 'ionicons/icons';

const Topbar = () => {


  return (
    <nav className="topbar">

      <div className="palanca">
        <IonIcon icon={menuOutline} />
      </div>

      <div className="titulo-label">
        Psychological Clinical
      </div>

      <div className="user-label">

        <div className="user-info">
          <p className="user-name">
            <span id="user-name"></span>
          </p>
          <p className="user-role">
            <span id="user-role"></span>
          </p>
        </div>

        <IonIcon icon={personCircle} className="user-icon" />

      </div>
    </nav>
  );
};

export default Topbar;
