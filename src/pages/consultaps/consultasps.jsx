import React, { useEffect } from "react";
import Layout from "../Layout";
import ConsultasPsList from "../../components/consultaps/ConsultasPsList";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/authSlice";

const Consultasps = () => {
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
            <ConsultasPsList />
        </Layout>
    );
};

export default Consultasps;
