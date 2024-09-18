import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { searchOutline } from "ionicons/icons";
import { useTable, usePagination } from 'react-table';
import { useSelector } from 'react-redux'; // Importar useSelector

const DerivacionList = () => {
    const [derivaciones, setDerivaciones] = useState([]);
    const [searchText, setSearchText] = useState("");
    const { user } = useSelector((state) => state.auth); // Obtener información del usuario

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
            const response = await axios.post("http://localhost:5000/derivacion/buscar", {
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
        () => {
            const cols = [
                {
                    Header: 'N°',
                    Cell: ({ row }) => row.index + 1,
                },
                {
                    Header: 'ALUMNO',
                    accessor: 'ALUMNO',
                    Cell: ({ value }) =>
                        value ? `${value.NOMBRES} ${value.APELLIDOS}` : "No asignado",
                },
                {
                    Header: 'MOTIVO',
                    accessor: 'MOTIVO',
                },
                {
                    Header: () => (
                        <div style={{ marginRight: '10px' }}>
                            URGENCIA
                        </div>
                    ),
                    accessor: 'URGENCIA',
                    Cell: ({ value }) =>
                        value === 1
                            ? "Baja"
                            : value === 2
                                ? "Media"
                                : value === 3
                                    ? "Alta"
                                    : "Desconocida",
                },
                {
                    Header: 'ESTADO',
                    accessor: 'RECIBIDO',
                    Cell: ({ value }) => (value ? "RECIBIDO" : "EN ESPERA"),
                },
                {
                    Header: 'ACCIONES',
                    Cell: ({ row }) => (
                        <>
                            {row.original.RECIBIDO ? (
                                <Link
                                    className="btn-details"
                                    to={`/derivacion/detail/${row.original.ID_DERIVACION}`}
                                >
                                    Detalles
                                </Link>

                            ) : (
                                    <Link
                                        className="btn-edit"
                                        to={`/derivacion/edit/${row.original.ID_DERIVACION}`}
                                    >
                                        Editar
                                    </Link>
                                   
                            )}
                             <Link
                                        className="btn-delete"
                                        onClick={() => eliminarDerivacion(row.original.ID_DERIVACION)}
                                    >
                                        Eliminar
                                    </Link>
                        </>
                    ),
                },
            ];

            if (user?.ID_ROL !== 3) {
                cols.splice(1, 0, {
                    Header: 'REMITENTE',
                    accessor: 'USUARIO',
                    Cell: ({ value }) =>
                        value ? `${value.NOMBRE_USUARIO} ${value.APELLIDO_USUARIO}` : "No asignado",
                });
            }

            return cols;
        },
        [derivaciones, user] 
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
                            placeholder="Buscar alumno por nombre o apellidos"
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
