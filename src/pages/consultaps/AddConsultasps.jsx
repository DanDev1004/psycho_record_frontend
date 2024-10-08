import React, { useEffect } from "react";
import Layout from "../Layout";
import FormAddConsultasPs from "../../components/consultaps/FormAddConsultasps";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/authSlice";

const AddConsultasps = () => {
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
    if (user && (user.ID_ROL !== 1 && user.ID_ROL !== 2)) {
      navigate("/dashboard");
    }
  }, [isError, user, navigate]);
  return (
    <Layout>
      <FormAddConsultasPs />
    </Layout>
  );
};

export default AddConsultasps;
