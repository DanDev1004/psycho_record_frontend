import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import "../../assets/styles/Form.css";

const FormEditAlumno = () => {
    const { id } = useParams();
    const [dni, setDni] = useState("");
    const [nombres, setNombres] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [sexo, setSexo] = useState("M");
    const [telefono, setTelefono] = useState("");
    const [direccionNacimiento, setDireccionNacimiento] = useState("");
    const [fechaNacimiento, setFechaNacimiento] = useState("");
    const [domicilio, setDomicilio] = useState("");
    const [turno, setTurno] = useState("M");

    const [areaPe, setAreaPe] = useState(null); 
    const [areaPeOptions, setAreaPeOptions] = useState([]);
 
    const [religion, setReligion] = useState(null);
    const [religionOptions, setReligionOptions] = useState([]);
    
    const [estadoCivil, setEstadoCivil] = useState(null);
    const [estadoCivilOptions, setEstadoCivilOptions] = useState([]);

    const [ciclo, setCiclo] = useState(null); 
    const [cicloOptions, setCicloOptions] = useState([]); 

    const [msg, setMsg] = useState("");
    const navigate = useNavigate();
    
    useEffect(() => {
        const obtenerPorId = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/alumno/${id}`);
                setDni(response.data.DNI);
                setNombres(response.data.NOMBRES);
                setApellidos(response.data.APELLIDOS);
                setSexo(response.data.SEXO);
                setTelefono(response.data.TELEFONO);
                setDireccionNacimiento(response.data.DIR_NAC);
                setTurno(response.data.TURNO);
                setDomicilio(response.data.DOMICILIO);
                setFechaNacimiento(new Date(response.data.FECH_NAC).toISOString().split("T")[0]);

                setReligion({
                    value: response.data.ID_RELIGION,
                    label: response.data.RELIGION?.NOMBRE_RELIGION,
                });

                setEstadoCivil({
                    value: response.data.ID_EC,
                    label: response.data.ESTADO_CIVIL?.NOMBRE_EC,
                });

                setAreaPe({
                    value: response.data.ID_AREA_PE,
                    label: response.data.AREA_PE?.NOMBRE_AREA_PE,
                });
                
                setCiclo({
                    value: response.data.CICLO,
                    label: convertirRomanos(response.data.CICLO),
                });
                
            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg);
                }
            }
        };

        const cargarReligiones = async () => {
            try {
                const response = await axios.get("http://localhost:5000/religion");
                const options = response.data.map((religion) => ({
                    value: religion.ID_RELIGION,
                    label: religion.NOMBRE_RELIGION,
                }));
                setReligionOptions(options);
            } catch (error) {
                console.error("Error al cargar las religiones", error);
            }
        };

        const cargarEstadosCiviles = async () => {
            try {
                const response = await axios.get("http://localhost:5000/estadoCivil");
                const options = response.data.map((estado) => ({
                    value: estado.ID_EC,
                    label: estado.NOMBRE_EC,
                }));
                setEstadoCivilOptions(options);
            } catch (error) {
                console.error("Error al cargar los estados civiles", error);
            }
        };

        const cargarAreasPe = async () => {
            try {
                const response = await axios.get("http://localhost:5000/areaPe");
                const options = response.data.map((areaPe) => ({
                    value: areaPe.ID_AREA_PE,
                    label: areaPe.NOMBRE_AREA_PE,
                }));
                setAreaPeOptions(options);
            } catch (error) {
                console.error("Error al cargar las áreas PE", error);
            }
        };

        const cargarCiclos = () => {
            const ciclos = [1, 2, 3, 4, 5, 6].map((ciclo) => ({
                value: ciclo,
                label: convertirRomanos(ciclo),
            }));
            setCicloOptions(ciclos);
        };

        obtenerPorId();
        cargarReligiones();
        cargarEstadosCiviles();
        cargarAreasPe();
        cargarCiclos(); 
    }, [id]);

    const updateAlumno = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:5000/alumno/${id}`, {
                DNI: dni,
                NOMBRES: nombres,
                APELLIDOS: apellidos,
                SEXO: sexo,
                TELEFONO: telefono,
                ID_RELIGION: religion?.value,
                ID_EC: estadoCivil?.value,
                ID_AREA_PE: areaPe?.value,
                CICLO: ciclo?.value, 
                TURNO: turno, 
                DIR_NAC: direccionNacimiento,
                FECH_NAC: fechaNacimiento,
                DOMICILIO: domicilio,
            });
            navigate("/alumnos");
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    const convertirRomanos = (num) => {
        const numerosRomanos = ['I', 'II', 'III', 'IV', 'V', 'VI'];
        return numerosRomanos[num - 1] || num;
    };

    return (
        <div>
            <NavLink to={"/alumnos"}>
                <button className="btn-regresar">Regresar</button>
            </NavLink>

            <h1 className="title-form">Actualizar Alumno</h1>

            <div className="contenedor">
                <form onSubmit={updateAlumno}>
                <p style={{color:'red'}}> {msg}</p>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">DNI</label>
                        </div>
                        <div className="col-75">
                            <input
                                className="input-form"
                                type="text"
                                value={dni || ""}
                                onChange={(e) => setDni(e.target.value)}
                                placeholder="DNI"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Nombres</label>
                        </div>
                        <div className="col-75">
                            <input
                                className="input-form"
                                type="text"
                                value={nombres || ""}
                                onChange={(e) => setNombres(e.target.value)}
                                placeholder="Nombres"
                                style={{ textTransform: 'capitalize' }}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Apellidos</label>
                        </div>
                        <div className="col-75">
                            <input
                                className="input-form"
                                type="text"
                                value={apellidos || ""}
                                onChange={(e) => setApellidos(e.target.value)}
                                placeholder="Apellidos"
                                style={{ textTransform: 'capitalize' }}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Área PE</label>
                        </div>
                        <div className="col-75">
                            <Select
                                className="input-form"
                                value={areaPe}
                                onChange={setAreaPe}
                                options={areaPeOptions}
                                placeholder="Selecciona un área PE"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Sexo</label>
                        </div>
                        <div className="col-75">
                            <select
                                className="input-form"
                                value={sexo || "M"}
                                onChange={(e) => setSexo(e.target.value)}
                            >
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Teléfono</label>
                        </div>
                        <div className="col-75">
                            <input
                                className="input-form"
                                type="text"
                                value={telefono || ""}
                                onChange={(e) => setTelefono(e.target.value)}
                                placeholder="Teléfono"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Religión</label>
                        </div>
                        <div className="col-75">
                            <Select
                                className="input-form"
                                value={religion}
                                onChange={setReligion}
                                options={religionOptions}
                                placeholder="Selecciona una religión"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Estado Civil</label>
                        </div>
                        <div className="col-75">
                            <Select
                                className="input-form"
                                value={estadoCivil}
                                onChange={setEstadoCivil}
                                options={estadoCivilOptions}
                                placeholder="Selecciona un estado civil"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Ciclo</label>
                        </div>
                        <div className="col-75">
                            <Select
                                className="input-form"
                                value={ciclo}
                                onChange={setCiclo}
                                options={cicloOptions}
                                placeholder="Selecciona un ciclo"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Turno</label>
                        </div>
                        <div className="col-75">
                            <select
                                className="input-form"
                                value={turno || "M"}
                                onChange={(e) => setTurno(e.target.value)}
                            >
                                <option value="M">Mañana</option>
                                <option value="T">Tarde</option>
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Dirección Nac.</label>
                        </div>
                        <div className="col-75">
                            <input
                                className="input-form"
                                type="text"
                                value={direccionNacimiento || ""}
                                onChange={(e) => setDireccionNacimiento(e.target.value)}
                                placeholder="Dirección de nacimiento"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Fecha Nac.</label>
                        </div>
                        <div className="col-75">
                            <input
                                className="input-form"
                                type="date"
                                value={fechaNacimiento || ""}
                                onChange={(e) => setFechaNacimiento(e.target.value)}
                                min="1970-01-01"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Domicilio</label>
                        </div>
                        <div className="col-75">
                            <input
                                className="input-form"
                                type="text"
                                value={domicilio || ""}
                                onChange={(e) => setDomicilio(e.target.value)}
                                placeholder="Domicilio"
                            />
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

export default FormEditAlumno;
