import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { searchOutline } from "ionicons/icons";
import { useTable, usePagination } from 'react-table';

const TutorList = () => {
    const [tutors, setTutors] = useState([]);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        obtenerTodos();
    }, []);

    const obtenerTodos = async () => {
        try {
            const response = await axios.get("http://localhost:5000/tutor");
            setTutors(response.data);
        } catch (error) {
            console.error("Error al obtener los tutores", error);
        }
    };

    const buscarTutor = async () => {
        try {
            const response = await axios.post("http://localhost:5000/buscarTutor", {
                searchText: searchText.trim()
            });
            setTutors(response.data);
        } catch (error) {
            console.error("Error al buscar tutores", error);
        }
    };

    const detectarEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            buscarTutor();
        }
    };

    const eliminar = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/tutor/${id}`);
            obtenerTodos();
        } catch (error) {
            console.error("Error al eliminar el tutor", error);
        }
    };

    const convertirRomanos = (num) => {
        const numerosRomanos = ['I', 'II', 'III', 'IV', 'V', 'VI'];
        return numerosRomanos[num - 1] || num;
    };

    const columns = useMemo(
        () => [
            {
                Header: 'N°',
                Cell: ({ row }) => row.index + 1,
            },
            {
                Header: 'DNI',
                accessor: 'INSTRUCTOR.DNI_INSTRUCTOR',
            },
            {
                Header: 'Nombres y Apellidos',
                Cell: ({ row }) =>
                    `${row.original.INSTRUCTOR.NOMBRE_INSTRUCTOR} ${row.original.INSTRUCTOR.APELLIDO_INSTRUCTOR}`,
            },
            {
                Header: 'Aula',
                Cell: ({ row }) =>
                    row.original.AULA
                        ? `${row.original.AULA.ANIO} - ${row.original.AULA.PERIODO} ciclo: ${convertirRomanos(row.original.AULA.CICLO)} ${row.original.AULA?.AREA_PE?.NOMBRE_AREA_PE}`
                        : "NO ASIGNADO",
            },
            {
                Header: 'Área',
                accessor: 'INSTRUCTOR.AREA_PE.NOMBRE_AREA_PE',
                Cell: ({ value }) => value || "NO ASIGNADO",
            },
            {
                Header: 'Acciones',
                Cell: ({ row }) => (
                    <>
                        <Link className="btn-edit" to={`/tutor/edit/${row.original.ID_TUTOR}`}>
                            Editar
                        </Link>
                        <Link
                            className="btn-delete"
                            onClick={() => eliminar(row.original.ID_TUTOR)}
                        >
                            Eliminar
                        </Link>
                    </>
                ),
            },
        ],
        [tutors]
    );

    const data = useMemo(() => tutors, [tutors]);

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
                <h2>TUTORES</h2>

                <div className="searchInput">
                    <label>
                        <input
                            type="text"
                            placeholder="DNI, nombres o apellidos"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onKeyDown={detectarEnter}
                        />
                        <IonIcon icon={searchOutline} onClick={buscarTutor} />
                    </label>
                </div>
                <Link to="/tutor/add" className="btn">
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

export default TutorList;
