import React, { useEffect } from "react";
import Layout from "../Layout";
import FormAddDiagnostico from "../../components/consultaps/FormAddDiagnostico";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/authSlice";


const AddDiagnostico = () => {
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
            <FormAddDiagnostico />
        </Layout>
    );
};

export default AddDiagnostico;
