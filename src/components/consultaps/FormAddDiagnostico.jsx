import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import "../../assets/styles/Form.css";
import { ENDPOINTS } from "../../api/apiEndPoints";

const FormAddDiagnostico = () => {
    const { id } = useParams(); 
    const [categorias, setCategorias] = useState([]);
    const [condiciones, setCondiciones] = useState([]);
    const [selectedCategoria, setSelectedCategoria] = useState(null);
    const [selectedCondicion, setSelectedCondicion] = useState(null);
    const [descripcion, setDescripcion] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const obtenerCategorias = async () => {
            try {
                const response = await axios.get(ENDPOINTS.CATCOND.OBTENER_TODOS);
                setCategorias(response.data.map(categoria => ({
                    value: categoria.ID_CAT_COND,
                    label: categoria.NOMBRE_CAT_COND
                })));
            } catch (error) {
                console.error("Error al obtener las categorías", error);
            }
        };

        obtenerCategorias();
    }, []);

    useEffect(() => {
        if (selectedCategoria) {
            const obtenerCondiciones = async () => {
                try {
                    const response = await axios.get(ENDPOINTS.CONDICION.OBTENER_POR_CATEGORIA(selectedCategoria.value));
                    setCondiciones(response.data.map(condicion => ({
                        value: condicion.ID_CONDICION,
                        label: condicion.NOMBRE_CONDICION
                    })));
                } catch (error) {
                    console.error("Error al obtener las condiciones", error);
                }
            };

            obtenerCondiciones();
        } else {
            setCondiciones([]); 
        }
    }, [selectedCategoria]);

    const crear = async (e) => {
        e.preventDefault();
        try {
            await axios.post(ENDPOINTS.DIAGNOSTICO.CREAR, {
                ID_CONSULTA_PS: id, 
                ID_CONDICION: selectedCondicion ? selectedCondicion.value : null,
                DESCRIPCION: descripcion
            });
            navigate(`/Consultasps/detail/${id}`);
        } catch (error) {
            console.error("Error al agregar el diagnóstico", error);
        }
    };

    return (
        <div className="form-container">
            <button className="btn-regresar" onClick={() => navigate(`/Consultasps/detail/${id}`)}>Regresar</button>

            <h1 className="title-form">Agregar Diagnóstico</h1>
            <form onSubmit={crear}>
                <div className="row">
                    <div className="col-25">
                        <label className="label-form">Categoría</label>
                    </div>
                    <div className="col-75">
                        <Select
                            value={selectedCategoria}
                            onChange={setSelectedCategoria}
                            options={categorias}
                            placeholder="Seleccionar categoría"
                            className="input-form" 
                            isClearable
                            required
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-25">
                        <label className="label-form">Condición</label>
                    </div>
                    <div className="col-75">
                        <Select
                            value={selectedCondicion}
                            onChange={setSelectedCondicion}
                            options={condiciones}
                            placeholder="Seleccionar condición"
                            className="input-form"  
                            isClearable
                            isDisabled={!selectedCategoria}  
                            required
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-25">
                        <label className="label-form">Descripción</label>
                    </div>
                    <div className="col-75">
                        <textarea
                            className="input-form"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="row">
                    <button className="button-form" type="submit">Agregar Diagnóstico</button>
                </div>
            </form>
        </div>
    );
};

export default FormAddDiagnostico;
