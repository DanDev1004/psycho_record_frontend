import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { searchOutline } from "ionicons/icons";
import { useTable, usePagination } from 'react-table';

const FamiliarList = () => {
    const [familiares, setFamiliares] = useState([]);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        obtenerFamiliares();
    }, []);

    const obtenerFamiliares = async () => {
        try {
            const response = await axios.get("http://localhost:5000/familiar");
            setFamiliares(response.data);
        } catch (error) {
            console.error("Error al obtener los familiares", error);
        }
    };

    const buscarFamiliar = async () => {
        try {
            const response = await axios.post("http://localhost:5000/buscarFamiliar", {
                searchText: searchText,
            });
            setFamiliares(response.data);
        } catch (error) {
            console.error("Error al buscar familiares", error);
        }
    };

    const detectarEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            buscarFamiliar();
        }
    };

    const eliminarFamiliar = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/familiar/${id}`);
            obtenerFamiliares();
        } catch (error) {
            console.error("Error al eliminar el familiar", error);
        }
    };

    const columns = useMemo(
        () => [
            {
                Header: 'N°',
                Cell: ({ row }) => row.index + 1,
            },
            {
                Header: 'Nombre',
                accessor: 'REGISTRO_FAMILIAR.NOMBRE_RF',
            },
            {
                Header: 'Teléfono',
                accessor: 'REGISTRO_FAMILIAR.TELEFONO',
            },
            {
                Header: 'Parentesco',
                accessor: 'REGISTRO_FAMILIAR.PARENTESCO.NOMBRE_PARENTESCO',
            },
            {
                Header: 'Alumno',
                Cell: ({ row }) =>
                    row.original.LISTADO_AULA.ALUMNO
                        ? `${row.original.LISTADO_AULA.ALUMNO.NOMBRE_ALUMNO} ${row.original.LISTADO_AULA.ALUMNO.APELLIDO_ALUMNO}`
                        : "No asignado",
            },
            {
                Header: 'Acciones',
                Cell: ({ row }) => (
                    <>
                        <Link className="btn-edit" to={`/familiar/edit/${row.original.ID_FAMILIAR}`}>
                            Editar
                        </Link>
                        <Link
                            className="btn-delete"
                            onClick={() => eliminarFamiliar(row.original.ID_FAMILIAR)}
                        >
                            Eliminar
                        </Link>
                    </>
                ),
            },
        ],
        []
    );

    const data = useMemo(() => familiares, [familiares]);

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
                <h2>Familiares</h2>

                <div className="searchInput">
                    <label>
                        <input
                            type="text"
                            placeholder="Nombres o apellidos"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onKeyDown={detectarEnter}
                        />
                        <IonIcon icon={searchOutline} onClick={buscarFamiliar} />
                    </label>
                </div>
                <Link to="/familiar/add" className="btn">
                    Agregar
                </Link>
            </div>

            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => {
                        const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps();
                        return (
                            <tr key={key} {...restHeaderGroupProps}>
                                {headerGroup.headers.map(column => {
                                    const { key, ...restColumnProps } = column.getHeaderProps();
                                    return (
                                        <th key={key} {...restColumnProps}>
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
                        const { key, ...restRowProps } = row.getRowProps();
                        return (
                            <tr key={key} {...restRowProps}>
                                {row.cells.map(cell => {
                                    const { key, ...restCellProps } = cell.getCellProps();
                                    return (
                                        <td key={key} {...restCellProps}>
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

export default FamiliarList;
