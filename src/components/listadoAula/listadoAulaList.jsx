import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { searchOutline } from "ionicons/icons";
import { useTable, usePagination } from 'react-table';

const ListadoAulaList = () => {
    const [listadosAula, setListadosAula] = useState([]);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        obtenerTodos();
    }, []);

    const obtenerTodos = async () => {
        try {
            const response = await axios.get("http://localhost:5000/listadoaula");
            setListadosAula(response.data);
        } catch (error) {
            console.error("Error al obtener los listados de aula", error);
        }
    };

    const buscarListadoAula = async () => {
        try {
            const response = await axios.post("http://localhost:5000/buscarListadoAula", {
                searchText: searchText,
            });
            setListadosAula(response.data);
        } catch (error) {
            console.error("Error al buscar listados de aula", error);
        }
    };

    const detectarEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            buscarListadoAula();
        }
    };

    const eliminar = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/listadoaula/${id}`);
            obtenerTodos();
        } catch (error) {
            console.error("Error al eliminar el listado de aula", error);
        }
    };

    const columns = useMemo(
        () => [
            {
                Header: 'N°',
                Cell: ({ row }) => row.index + 1,
            },
            {
                Header: 'Alumno',
                Cell: ({ row }) =>
                    `${row.original.ALUMNO?.NOMBRE_ALUMNO || ""} ${row.original.ALUMNO?.APELLIDO_ALUMNO || ""}`,
            },
            {
                Header: 'Tutor',
                Cell: ({ row }) =>
                    `${row.original.TUTOR?.INSTRUCTOR?.NOMBRE_INSTRUCTOR || ""} ${row.original.TUTOR?.INSTRUCTOR?.APELLIDO_INSTRUCTOR || ""}`,
            },
            {
                Header: 'Área',
                Cell: ({ row }) =>
                    row.original.TUTOR?.INSTRUCTOR?.AREA_PE?.NOMBRE_AREA_PE || "NO ASIGNADO",
            },
            {
                Header: 'Aula/Área',
                Cell: ({ row }) =>
                    row.original.TUTOR?.AULA
                        ? `${row.original.TUTOR.AULA.ANIO || ""} - ${row.original.TUTOR.AULA.PERIODO || ""} (${row.original.TUTOR.AULA.CICLO || ""}) ${row.original.TUTOR.AULA.AREA_PE?.NOMBRE_AREA_PE || ""}`
                        : "Empleabilidad",
            },
            {
                Header: 'Acciones',
                Cell: ({ row }) => (
                    <Link
                        className="btn-delete"
                        onClick={() => eliminar(row.original.ID_LISTADO_AULA)}
                    >
                        Eliminar
                    </Link>
                ),
            },
        ],
        []
    );

    const data = useMemo(() => listadosAula, [listadosAula]);

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
                <h2>Listados de Aula</h2>

                <div className="searchInput">
                    <label>
                        <input
                            type="text"
                            placeholder="Nombres o apellidos"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onKeyDown={detectarEnter}
                        />
                        <IonIcon icon={searchOutline} onClick={buscarListadoAula} />
                    </label>
                </div>
                <Link to="/listadoAula/add" className="btn">
                    Agregar
                </Link>
            </div>

            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => {
                        const { key, ...restHeaderGroup } = headerGroup.getHeaderGroupProps();
                        return (
                            <tr key={key} {...restHeaderGroup}>
                                {headerGroup.headers.map(column => {
                                    const { key, ...restColumn } = column.getHeaderProps();
                                    return (
                                        <th key={key} {...restColumn}>
                                            {column.render('Header')}
                                        </th>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map(row => {
                        prepareRow(row);
                        const { key, ...restRow } = row.getRowProps();
                        return (
                            <tr key={key} {...restRow}>
                                {row.cells.map(cell => {
                                    const { key, ...restCell } = cell.getCellProps();
                                    return (
                                        <td key={key} {...restCell}>
                                            {cell.render('Cell')}
                                        </td>
                                    );
                                })}
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

export default ListadoAulaList;
