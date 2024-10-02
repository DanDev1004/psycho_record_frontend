import React, { useEffect } from "react";
import Layout from "../Layout";
import { useDispatch, useSelector } from "react-redux";
import DetailsAlumno from "../../components/alumno/DetailsAlumno";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/authSlice";

const PageDetailsAlumno = () => {
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
        if (user && (user.ID_ROL !== 1 && user.ID_ROL !== 2 && user.ID_ROL !== 3)) {
            navigate("/dashboard");
        }
    }, [isError, user, navigate]);
    return (
        <Layout>
            <DetailsAlumno />
        </Layout>
    );
};

export default PageDetailsAlumno;
