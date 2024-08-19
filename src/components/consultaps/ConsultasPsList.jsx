import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { searchOutline } from "ionicons/icons";
import { useTable, usePagination } from 'react-table';

const ConsultasPsList = () => {
    const [consultas, setConsultas] = useState([]);
    const [searchText, setSearchText] = useState("");

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
            const response = await axios.post("http://localhost:5000/buscarConsulta", {
                searchText: searchText,
            });
            setConsultas(response.data);
        } catch (error) {
            console.error("Error al buscar consultas", error);
        }
    };

    const detectarEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            buscarConsulta();
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
                    value ? `${value.NOMBRE_USUARIO} ${value.APELLIDO_USUARIO}` : "No asignado",
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
                accessor: 'LISTADO_AULA.ALUMNO',
                Cell: ({ value }) =>
                    value ? `${value.NOMBRE_ALUMNO} ${value.APELLIDO_ALUMNO} (DNI: ${value.DNI_ALUMNO})` : "No asignado",
            },
            {
                Header: 'Familiar',
                accessor: 'FAMILIAR',
                Cell: ({ value }) =>
                    value ? value.REGISTRO_FAMILIAR?.NOMBRE_RF : "----------",
            },
            {
                Header: 'Tutor',
                accessor: 'DERIVACION.USUARIO',
                Cell: ({ value }) =>
                    value ? `${value.NOMBRE_USUARIO} ${value.APELLIDO_USUARIO}` : "----------",
            },
            {
                Header: 'Fech. Att.',
                accessor: 'FECHA_ATENCION',
                Cell: ({ value }) => value ? new Date(value).toLocaleDateString() : "Fecha no disponible",
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
        <div className="recentTable">
            <div className="TableHeader">
                <h2>Consultas</h2>

                <div className="searchInput">
                    <label>
                        <input
                            type="text"
                            placeholder="Buscar aquí"
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
    );
};

export default ConsultasPsList;
