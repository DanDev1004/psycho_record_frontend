import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import "../../assets/styles/Form.css";

const FormEditDerivacion = () => {
    const [usuario, setUsuario] = useState("");
    const [alumno, setAlumno] = useState("");
    const [motivo, setMotivo] = useState("");
    const [urgencia, setUrgencia] = useState(1); 
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const obtenerDerivacionPorId = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/derivacion/${id}`);
                const derivacion = response.data;

                setUsuario(`${derivacion.USUARIO.NOMBRE_USUARIO} ${derivacion.USUARIO.APELLIDO_USUARIO}`);
                setAlumno(`${derivacion.ALUMNO.NOMBRES} ${derivacion.ALUMNO.APELLIDOS}`);
                setMotivo(derivacion.MOTIVO);
                setUrgencia(derivacion.URGENCIA); 
            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg);
                }
            }
        };

        obtenerDerivacionPorId();
    }, [id]);

    const actualizarDerivacion = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:5000/derivacion/${id}`, {
                MOTIVO: motivo,
                URGENCIA: Number(urgencia),
            });
            navigate("/derivaciones");
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    return (
        <div>
            <NavLink to={"/derivaciones"}>
                <button className="btn-regresar">Regresar</button>
            </NavLink>

            <h1 className="title-form">Editar Derivación</h1>

            <div className="contenedor">
                <form onSubmit={actualizarDerivacion} className="form-container">
                    <p>{msg}</p>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Remitente:</label>
                        </div>
                        <div className="col-75">
                            <input
                                type="text"
                                className="input-form"
                                value={usuario}
                                readOnly
                                style={{ border: "none", pointerEvents: "none" }}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Alumno:</label>
                        </div>
                        <div className="col-75">
                            <input
                                type="text"
                                className="input-form"
                                value={alumno}
                                readOnly
                                style={{ border: "none", pointerEvents: "none" }}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Motivo</label>
                        </div>
                        <div className="col-75">
                            <textarea
                                className="input-form"
                                value={motivo}
                                onChange={(e) => setMotivo(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Urgencia</label>
                        </div>
                        <div className="col-75">
                            <select
                                className="input-form"
                                value={urgencia}
                                onChange={(e) => setUrgencia(e.target.value)}
                                required
                            >
                                <option value="1">Baja</option>
                                <option value="2">Media</option>
                                <option value="3">Alta</option>
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <button className="button-form" type="submit">
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormEditDerivacion;
