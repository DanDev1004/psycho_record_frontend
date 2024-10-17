import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { searchOutline } from "ionicons/icons";
import { useTable, usePagination } from 'react-table';
import { useSelector } from 'react-redux';
import {
    trashOutline,
    createOutline,
    newspaperOutline
} from "ionicons/icons";

import { ENDPOINTS } from "../../api/apiEndPoints";
import { detectarEnter } from "../../utils/utils";

const DerivacionList = () => {
    const [derivaciones, setDerivaciones] = useState([]);
    const [searchText, setSearchText] = useState("");
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        obtenerTodos();
    }, []);

    const obtenerTodos = async () => {
        try {
            const response = await axios.get(ENDPOINTS.DERIVACION.OBTENER_TODOS);
            setDerivaciones(response.data.reverse());
        } catch (error) {
            console.error("Error al obtener las derivaciones", error);
        }
    };

    const buscar = async () => {
        try {
            const response = await axios.post(ENDPOINTS.DERIVACION.BUSCAR, {
                searchText: searchText,
            });
            setDerivaciones(response.data.reverse());
        } catch (error) {
            console.error("Error al buscar derivaciones", error);
        }
    };

    const eliminar = async (id) => {
        const confirmacion = window.confirm("¿Estás seguro de eliminar esta derivación?");
        if (confirmacion) {
            try {
                await axios.delete(ENDPOINTS.DERIVACION.ELIMINAR(id));
                obtenerTodos();
            } catch (error) {
                console.error("Error al eliminar la derivación", error);
            }
        }
    };

    const columns = useMemo(
        () => {
            const cols = [
                {
                    Header: 'N°',
                    Cell: ({ row }) => derivaciones.length - row.index,
                },
                {
                    Header: 'ALUMNO',
                    accessor: 'ALUMNO',
                    Cell: ({ value }) =>
                        value ? `${value.NOMBRES} ${value.APELLIDOS}` : "No asignado",
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

                            <Link
                                className="btn-details"
                                to={`/derivacion/detail/${row.original.ID_DERIVACION}`}
                            >
                                <IonIcon icon={newspaperOutline} />
                            </Link>
                            
                            {!row.original.RECIBIDO && (
                                <Link
                                    className="btn-edit"
                                    to={`/derivacion/edit/${row.original.ID_DERIVACION}`}
                                    title="Editar"
                                >
                                    <IonIcon icon={createOutline} />
                                </Link>
                            )}

                            {row.original.RECIBIDO && (
                                <Link
                                    className="btn-gray"
                                    to={``}
                                    disabled
                                    style={{ cursor: 'default' }}
                                >
                                    <IonIcon icon={createOutline} />
                                </Link>
                            )}

                            <Link
                                className="btn-delete"
                                onClick={() => eliminar(row.original.ID_DERIVACION)}
                                title="Eliminar"
                            >
                                <IonIcon icon={trashOutline} />
                            </Link>
                        </>
                    ),
                }
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
                            onKeyDown={(e) => detectarEnter(e, buscar)}
                        />
                        <IonIcon icon={searchOutline} onClick={buscar} />
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
