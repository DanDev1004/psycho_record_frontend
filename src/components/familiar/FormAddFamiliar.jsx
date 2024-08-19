import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { NavLink, useNavigate } from "react-router-dom";
import "../../assets/styles/Form.css";

const FormAddFamiliar = () => {
    const [nombre, setNombre] = useState("");
    const [telefono, setTelefono] = useState("");
    const [parentesco, setParentesco] = useState("");
    const [parentescoOptions, setParentescoOptions] = useState([]);
    const [isRegistroFamiliarAgregado, setIsRegistroFamiliarAgregado] = useState(false);
    const [idRegistroFamiliar, setIdRegistroFamiliar] = useState(null);
    const [registroFamiliarOptions, setRegistroFamiliarOptions] = useState([]);
    const [listadoAulaOptions, setListadoAulaOptions] = useState([]);
    const [listadoAula, setListadoAula] = useState(null);
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    const cargarRegistroFamiliar = async () => {
        try {
            const response = await axios.get("http://localhost:5000/registrofamiliar");
            setRegistroFamiliarOptions(response.data);  
        } catch (error) {
            console.error("Error al cargar registros familiares", error);
        }
    };

    useEffect(() => {
        const cargarParentescos = async () => {
            try {
                const response = await axios.get("http://localhost:5000/parentesco");
                setParentescoOptions(response.data);
            } catch (error) {
                console.error("Error al cargar los parentescos", error);
            }
        };

        const cargarListadoAulas = async () => {
            try {
                const response = await axios.get("http://localhost:5000/listadoaula");
                const options = response.data
                    .filter(listado => listado.TUTOR && listado.TUTOR.INSTRUCTOR.ID_AREA_PE)
                    .map(listado => ({
                        value: listado.ID_LISTADO_AULA,
                        label: `${listado.ALUMNO.NOMBRE_ALUMNO} ${listado.ALUMNO.APELLIDO_ALUMNO} - ${listado.ALUMNO.AULA.AREA_PE.NOMBRE_AREA_PE}`
                    }));
                setListadoAulaOptions(options);
            } catch (error) {
                console.error("Error al cargar los listados de aula", error);
            }
        };

        cargarParentescos();
        cargarListadoAulas();
        cargarRegistroFamiliar();  
    }, []);

    const agregarRegistroFamiliar = async (e) => {
        e.preventDefault();

        try {
            const registroResponse = await axios.post(
                "http://localhost:5000/registrofamiliar",
                {
                    NOMBRE_RF: nombre,
                    TELEFONO: telefono,
                    ID_PARENTESCO: Number(parentesco),
                }
            );

            setIdRegistroFamiliar(registroResponse.data.ID_RF);
            setIsRegistroFamiliarAgregado(true);
            cargarRegistroFamiliar();
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    const saveFamiliar = async (e) => {
        e.preventDefault();

        try {
            await axios.post("http://localhost:5000/familiar", {
                ID_RF: idRegistroFamiliar,
                ID_LISTADO_AULA: listadoAula.value,
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
    
            <div className="contenedor">
                <div className="form-container">
                    <form onSubmit={agregarRegistroFamiliar}>
                        <p>{msg}</p>
    
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
                                    disabled={isRegistroFamiliarAgregado}
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
                                    disabled={isRegistroFamiliarAgregado}
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
                                    disabled={isRegistroFamiliarAgregado}
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
    
                        {!isRegistroFamiliarAgregado && (
                            <div className="row">
                                <button className="button-form" type="submit">
                                    Agregar Registro Familiar
                                </button>
                            </div>
                        )}
                    </form>
    
                    {isRegistroFamiliarAgregado && (
                        <form onSubmit={saveFamiliar}>
    
                            <div className="row">
                                <div className="col-25">
                                    <label className="label-form">Registro Familiar</label>
                                </div>
                                <div className="col-75">
                                    <select
                                        className="input-form"
                                        value={idRegistroFamiliar}
                                        onChange={(e) => setIdRegistroFamiliar(e.target.value)}
                                        required
                                    >
                                        <option value="">Selecciona un registro familiar</option>
                                        {registroFamiliarOptions.slice(-1).map((registro) => (
                                            <option
                                                key={registro.ID_RF}
                                                value={registro.ID_RF}
                                            >
                                                {registro.NOMBRE_RF}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
    
                            <div className="row">
                                <div className="col-25">
                                    <label className="label-form">Alumno</label>
                                </div>
                                <div className="col-75">
                                    <Select
                                        className="input-form"
                                        value={listadoAula}
                                        onChange={setListadoAula}
                                        options={listadoAulaOptions}
                                        placeholder="Selecciona un alumno"
                                        required
                                    />
                                </div>
                            </div>
    
                            <div className="row">
                                <button className="button-form" type="submit">
                                    Guardar
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FormAddFamiliar;
