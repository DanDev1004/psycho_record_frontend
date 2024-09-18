import React, { useEffect } from "react";
import Layout from "../Layout";
import { useDispatch, useSelector } from "react-redux";
import DetailsConsultaPs from "../../components/consultaps/DetailsConsultasps";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/authSlice";

const PageDetailsConsultaPs = () => {
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
            <DetailsConsultaPs />
        </Layout>
    );
};

export default PageDetailsConsultaPs;
