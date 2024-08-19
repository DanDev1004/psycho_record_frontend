import React from "react";
import { useSelector } from "react-redux";

const Welcome = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div>
      <h1 className="title">Dashboard</h1>
      <h2>
        Bienvenido <strong>{user && user.NOMBRE_USUARIO} {user && user.APELLIDO_USUARIO}</strong>
      </h2>
    </div>
  );
};

export default Welcome;
