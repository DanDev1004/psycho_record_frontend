import React, { useEffect } from "react";
import DerivacionList from "../../components/derivacion/derivacionList";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout";
import { getMe } from "../../features/authSlice";

const Derivaciones = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/");
    }
  }, [isError, navigate]);
  return (
    <Layout>
      <DerivacionList />
    </Layout>
  );
};

export default Derivaciones;
