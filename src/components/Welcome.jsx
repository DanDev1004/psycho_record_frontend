import React from "react";
import { useSelector } from "react-redux";

const Welcome = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div>
      <h1 className="title">Dashboard</h1>
      <h2>
        Bienvenido <strong>{user && user.NOMBRE_USUARIO}</strong>
      </h2>
      <br />
        <p>Esta es una sección en desarrollo para la implementación de graficos estadisticos cuyos datos serán analizados con librerias de python, gracias por su atención:D</p>
    </div>
  );
};

export default Welcome;
