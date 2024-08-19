import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { searchOutline } from "ionicons/icons";
import { useTable, usePagination } from 'react-table';

const DerivacionList = () => {
    const [derivaciones, setDerivaciones] = useState([]);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        obtenerDerivaciones();
    }, []);

    const obtenerDerivaciones = async () => {
        try {
            const response = await axios.get("http://localhost:5000/derivacion");
            setDerivaciones(response.data);
        } catch (error) {
            console.error("Error al obtener las derivaciones", error);
        }
    };

    const buscarDerivacion = async () => {
        try {
            const response = await axios.post("http://localhost:5000/buscarDerivacion", {
                searchText: searchText,
            });
            setDerivaciones(response.data);
        } catch (error) {
            console.error("Error al buscar derivaciones", error);
        }
    };

    const detectarEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            buscarDerivacion();
        }
    };

    const eliminarDerivacion = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/derivacion/${id}`);
            obtenerDerivaciones();
        } catch (error) {
            console.error("Error al eliminar la derivación", error);
        }
    };

    const columns = useMemo(
        () => [
            {
                Header: 'N°',
                Cell: ({ row }) => row.index + 1,
            },
            {
                Header: 'Remitente',
                accessor: 'USUARIO',
                Cell: ({ value }) =>
                    value ? `${value.NOMBRE_USUARIO} ${value.APELLIDO_USUARIO}` : "No asignado",
            },
            {
                Header: 'Alumno',
                accessor: 'LISTADO_AULA.ALUMNO',
                Cell: ({ value }) =>
                    value ? `${value.NOMBRE_ALUMNO} ${value.APELLIDO_ALUMNO}` : "No asignado",
            },
            {
                Header: 'Fecha Derivación',
                accessor: 'createdAt',
                Cell: ({ value }) => value ? new Date(value).toLocaleDateString() : "Fecha no disponible",
            },
            {
                Header: 'Motivo',
                accessor: 'MOTIVO',
            },
            {
                Header: 'Severidad',
                accessor: 'SEVERIDAD',
                Cell: ({ value }) =>
                    value === 1
                        ? "Baja"
                        : value === 2
                            ? "Media"
                            : value === 3
                                ? "Alta"
                                : "Severidad desconocida",
            },
            {
                Header: 'Estado',
                accessor: 'ESTADO',
                Cell: ({ value }) => (value ? "Aprobado" : "Pendiente"),
            },
            {
                Header: 'Acciones',
                Cell: ({ row }) => (
                    <>
                        <Link
                            className="btn-edit"
                            to={`/derivacion/edit/${row.original.ID_DERIVACION}`}
                            disabled={row.original.ESTADO}
                            style={{ pointerEvents: row.original.ESTADO ? 'none' : 'auto', background: row.original.ESTADO ? '#ddcfa6' : '' }}
                        >
                            Editar
                        </Link>
                        <Link
                            className="btn-delete"
                            onClick={() => eliminarDerivacion(row.original.ID_DERIVACION)}
                        >
                            Eliminar
                        </Link>
                    </>
                ),
            },
        ],
        []
    );

    const data = useMemo(() => derivaciones, [derivaciones]);

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
                <h2>Derivaciones</h2>

                <div className="searchInput">
                    <label>
                        <input
                            type="text"
                            placeholder="Nombres o apellidos"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onKeyDown={detectarEnter}
                        />
                        <IonIcon icon={searchOutline} onClick={buscarDerivacion} />
                    </label>
                </div>
                <Link to="/derivacion/add" className="btn">
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

export default DerivacionList;
