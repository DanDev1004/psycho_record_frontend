import React, { useEffect } from "react";
import Layout from "./Layout";
import Welcome from "../components/Welcome";
import AlumnoList from "../components/alumno/alumnoList";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/");
    }

    if (user && user.ID_ROL === 3) {
      navigate("/alumnos");
    }
  }, [isError, navigate]);

  return (
    <Layout>
      {user && user.ID_ROL === 3 ? <AlumnoList /> : <Welcome />}
    </Layout>
  );
};

export default Dashboard;
