import React, { useEffect } from "react";
import Layout from "../Layout";
import { useDispatch, useSelector } from "react-redux";
import DetailsDerivacion from "../../components/derivacion/DetailsDerivacion";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/authSlice";

const PageDetailsDerivacion = () => {
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
        if (user && (user.ID_ROL !== 1 && user.ID_ROL !== 3)) {
            navigate("/dashboard");
        }
    }, [isError, user, navigate]);
    return (
        <Layout>
            <DetailsDerivacion />
        </Layout>
    );
};

export default PageDetailsDerivacion;
