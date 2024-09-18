import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { searchOutline } from "ionicons/icons";
import { useTable, usePagination } from 'react-table';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ConsultasPsList = () => {
    const [consultas, setConsultas] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");

    useEffect(() => {
        obtenerConsultas();
    }, []);

    const obtenerConsultas = async () => {
        try {
            const response = await axios.get("http://localhost:5000/consulta");
            setConsultas(response.data);
        } catch (error) {
            console.error("Error al obtener las consultas", error);
        }
    };

    const buscarConsulta = async () => {
        try {
            const response = await axios.post("http://localhost:5000/consulta/buscar", {
                searchText: searchText,
            });
            setConsultas(response.data);
        } catch (error) {
            console.error("Error al buscar consultas", error);
        }
    };


    const eliminarConsulta = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/consulta/${id}`);
            obtenerConsultas();
        } catch (error) {
            console.error("Error al eliminar la consulta", error);
        }
    };

    /*HELPERS */
    const formatearFecha = (fecha) => {
        const fechaObjeto = new Date(fecha);
        const dia = String(fechaObjeto.getUTCDate()).padStart(2, '0');
        const mes = String(fechaObjeto.getUTCMonth() + 1).padStart(2, '0');
        const anio = fechaObjeto.getUTCFullYear();

        return `${dia}/${mes}/${anio}`;
    };

    const detectarEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            buscarConsulta();
        }
    };

    const calcularEdad = (fechaNacimiento) => {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();

        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    };

    const convertirRomanos = (num) => {
        const numerosRomanos = ['I', 'II', 'III', 'IV', 'V', 'VI'];
        return numerosRomanos[num - 1] || num;
    };


    const generarPDF = async () => {
        if (!selectedMonth) {
            alert("Selecciona un mes y año");
            return;
        }
    
        const [anio, mes] = selectedMonth.split("-");
    
        try {
            const response = await axios.post("http://localhost:5000/consulta/filtrarporfecha", {
                mes: parseInt(mes),
                anio: parseInt(anio)
            });
    
            console.log(response.data)
            const consultasFiltradas = response.data.filter(consulta => consulta.ASISTENCIA === 2);
    
            // documento PDF en modo horizontal
            const doc = new jsPDF('landscape');
    
            // nombre del mes en español
            const mesTexto = new Date(anio, mes - 1).toLocaleString('es-ES', { month: 'long' });
    
            doc.text(`REGISTRO DE ATENCIÓN EN EL SERVICIO DE PSICOLOGÍA EN EL MES DE ${mesTexto.toUpperCase()} - ${anio}`, 10, 10);
    
            const tableColumn = [
                "N°", 
                "APELLIDOS Y NOMBRES", 
                "EDAD", 
                "PROGRAMA DE ESTUDIOS", 
                "SEMESTRE", 
                "PROBLEMA ACTUAL", 
                "TTO", 
                "FECHA Y HORARIO"
            ];
    
            // Generando las filas de la tabla
            const tableRows = consultasFiltradas.map((consulta, index) => {
                const alumno = consulta.ALUMNO;
                const edad = calcularEdad(alumno.FECH_NAC);  
                const cicloRomano = convertirRomanos(alumno.CICLO);
                const fechaAtencion = new Date(consulta.FECHA_ATENCION).toLocaleDateString();
                const horario = `${consulta.HORA_INICIO} - ${consulta.HORA_FIN}`;
    
                return [
                    index + 1,  
                    `${alumno.APELLIDOS}, ${alumno.NOMBRES}`, 
                    edad,  
                    alumno.AREA_PE?.NOMBRE_AREA_PE || "No disponible", 
                    cicloRomano,  
                    consulta.PROBLEMA || "No disponible",  
                    consulta.RECOMENDACION || "No disponible", 
                    `${fechaAtencion} (${horario})`  
                ];
            });
    
            // Agregando la tabla al PDF
            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: 20,
                theme: "striped"
            });
    
            doc.save(`Registro_Atencion_Psicologia_${mesTexto}_${anio}.pdf`);
        } catch (error) {
            console.error("Error al generar el PDF", error);
        }
    };
    
    



    const columns = useMemo(
        () => [
            {
                Header: 'N°',
                Cell: ({ row }) => row.index + 1,
            },
            {
                Header: 'Usuario',
                accessor: 'USUARIO',
                Cell: ({ value }) =>
                    value ? `${value.NOMBRE_USUARIO} ${value.APELLIDO_USUARIO}` : "------------",
            },
            {
                Header: 'Tipo Derivación',
                accessor: 'TIPO_DERIVACION',
                Cell: ({ value }) =>
                    value === 1 ? "Autónomo" :
                        value === 2 ? "Pariente" :
                            "Tutor",
            },
            {
                Header: 'Alumno (DNI)',
                accessor: 'ALUMNO',
                Cell: ({ value }) =>
                    value ? `${value.NOMBRES} ${value.APELLIDOS} (DNI: ${value.DNI})` : "------------",
            },
            {
                Header: 'Tutor',
                accessor: 'DERIVACION.USUARIO',
                Cell: ({ value }) =>
                    value ? `${value.NOMBRE_USUARIO} ${value.APELLIDO_USUARIO}` : "------------",
            },
            {
                Header: 'Familiar',
                accessor: 'FAMILIAR',
                Cell: ({ value }) =>
                    value ? value : "------------",
            },
            {
                Header: 'Fecha Atención',
                accessor: 'FECHA_ATENCION',
                Cell: ({ value }) => value ? formatearFecha(value) : "Fecha no disponible",
            },
            {
                Header: 'HORARIO',
                accessor: row => `${row.HORA_INICIO || "-----------"} - ${row.HORA_FIN || "-----------"}`,
                Cell: ({ value }) => value,
            },
            {
                Header: 'Asistencia',
                accessor: 'ASISTENCIA',
                Cell: ({ value }) =>
                    value === 1 ? "Pendiente" :
                        value === 2 ? "Asistido" :
                            "No asistido",
            },
            {
                Header: 'Acciones',
                Cell: ({ row }) => (
                    <>
                        <Link className="btn-details" to={`/Consultasps/detail/${row.original.ID_CONSULTA_PS}`}>
                            Detalles
                        </Link>
                        <Link className="btn-edit" to={`/Consultasps/edit/${row.original.ID_CONSULTA_PS}`}>
                            Editar
                        </Link>
                        <Link className="btn-delete" onClick={() => eliminarConsulta(row.original.ID_CONSULTA_PS)}>
                            Eliminar
                        </Link>
                    </>
                ),
            },
        ],
        []
    );

    const data = useMemo(() => consultas, [consultas]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        nextPage,
        previousPage,
        state: { pageIndex },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0 },
        },
        usePagination
    );

    return (
        <>
            <div className="recentTable">
                <div className="TableHeader">
                    <h2>Consultas Psicológicas</h2>

                    <div className="searchInput">
                        <label>
                            <input
                                type="text"
                                placeholder="Buscar alumno por dni, nombres o apellidos"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onKeyDown={detectarEnter}
                            />
                            <IonIcon icon={searchOutline} onClick={buscarConsulta} />
                        </label>
                    </div>
                    <Link to="/Consultasps/add" className="btn">
                        Agregar
                    </Link>
                </div>

                <table {...getTableProps()}>
                    <thead>
                        {headerGroups.map((headerGroup, headerIndex) => (
                            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id || headerIndex}>
                                {headerGroup.headers.map((column, columnIndex) => (
                                    <th {...column.getHeaderProps()} key={column.id || columnIndex}>
                                        {column.render('Header')}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.map((row, rowIndex) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()} key={row.id || rowIndex}>
                                    {row.cells.map((cell, cellIndex) => (
                                        <td {...cell.getCellProps()} key={cell.column.id || cellIndex}>
                                            {cell.render('Cell')}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <div className="pagination">
                    <span>
                        Página{' '}
                        <strong>
                            {pageIndex + 1} de {pageOptions.length}
                        </strong>{' '}
                    </span>
                    <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                        {'<'}
                    </button>{' '}
                    <button onClick={() => nextPage()} disabled={!canNextPage}>
                        {'>'}
                    </button>
                </div>
            </div>

            <div className="reporte-pdf">
                <button className="btn-pdf" onClick={generarPDF}>
                    Generar PDF
                </button>

                <input
                    type="month"
                    className="input-mes-pdf"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                />

            </div>
        </>
    );
};

export default ConsultasPsList;
