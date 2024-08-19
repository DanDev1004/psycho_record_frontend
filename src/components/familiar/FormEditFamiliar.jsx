import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import "../../assets/styles/Form.css"; 
const FormEditFamiliar = () => {
    const [nombre, setNombre] = useState("");
    const [telefono, setTelefono] = useState("");
    const [parentesco, setParentesco] = useState("");
    const [parentescoOptions, setParentescoOptions] = useState([]);
    const [idRegistroFamiliar, setIdRegistroFamiliar] = useState("");
    const [listadoAula, setListadoAula] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const getFamiliarById = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/familiar/${id}`);
                const familiar = response.data;
                setIdRegistroFamiliar(familiar.ID_RF);
                setListadoAula(familiar.ID_LISTADO_AULA);
                
                const registroResponse = await axios.get(`http://localhost:5000/registrofamiliar/${familiar.ID_RF}`);
                const registroFamiliar = registroResponse.data;
                setNombre(registroFamiliar.NOMBRE_RF);
                setTelefono(registroFamiliar.TELEFONO);
                setParentesco(registroFamiliar.ID_PARENTESCO);

            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg);
                }
            }
        };

        const cargarParentescos = async () => {
            try {
                const response = await axios.get("http://localhost:5000/parentesco");
                setParentescoOptions(response.data);
            } catch (error) {
                console.error("Error al cargar los parentescos", error);
            }
        };

        getFamiliarById();
        cargarParentescos();
    }, [id]);

    const updateFamiliar = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:5000/registrofamiliar/${idRegistroFamiliar}`, {
                NOMBRE_RF: nombre,
                TELEFONO: telefono,
                ID_PARENTESCO: Number(parentesco),
            });

            await axios.patch(`http://localhost:5000/familiar/${id}`, {
                ID_RF: idRegistroFamiliar,
                ID_LISTADO_AULA: Number(listadoAula),
            });

            navigate("/familiar");
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    return (
        <div>
            <NavLink to={"/familiar"}>
                <button className="btn-regresar">Regresar</button>
            </NavLink>

            <h1 className="title-form">Familiares</h1>
            <h2 className="subtitle-form">Actualizar Familiar</h2>

            <div className="contenedor">
                <form onSubmit={updateFamiliar}>
                    <p className="msg">{msg}</p>

                    <h3 className="subtitle-form">Registro Familiar</h3>
                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Nombre</label>
                        </div>
                        <div className="col-75">
                            <input
                                type="text"
                                className="input-form"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Teléfono</label>
                        </div>
                        <div className="col-75">
                            <input
                                type="text"
                                className="input-form"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Parentesco</label>
                        </div>
                        <div className="col-75">
                            <select
                                className="input-form"
                                value={parentesco}
                                onChange={(e) => setParentesco(e.target.value)}
                                required
                            >
                                <option value="">Selecciona un parentesco</option>
                                {parentescoOptions.map((p) => (
                                    <option key={p.ID_PARENTESCO} value={p.ID_PARENTESCO}>
                                        {p.NOMBRE_PARENTESCO}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <button className="button-form" type="submit">
                            Actualizar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormEditFamiliar;
