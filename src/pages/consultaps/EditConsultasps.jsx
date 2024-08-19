import React, { useEffect } from "react";
import Layout from "../Layout";
import FormEditConsultasPs from "../../components/consultaps/FormEditConsultasps";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/authSlice";

const EditConsultasps = () => {
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
        if (user && user.ID_ROL !== 1) {
            navigate("/dashboard");
        }
    }, [isError, user, navigate]);
    return (
        <Layout>
            <FormEditConsultasPs />
        </Layout>
    );
};

export default EditConsultasps;
