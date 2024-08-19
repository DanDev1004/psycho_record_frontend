import React, { useEffect } from "react";
import Layout from "../Layout";
import FormAddDerivacion from "../../components/derivacion/FormAddDerivacion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/authSlice";

const AddDerivacion = () => {
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

  }, [isError, user, navigate]);
  return (
    <Layout>
      <FormAddDerivacion />
    </Layout>
  );
};

export default AddDerivacion;
