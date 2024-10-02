import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {ENDPOINTS} from "../../api/apiEndPoints";
import { Link } from "react-router-dom";
import { IonIcon } from '@ionic/react';
import { searchOutline } from 'ionicons/icons';
import { useTable, usePagination } from 'react-table';
import { useSelector } from 'react-redux';
import { detectarEnter, convertirRomanos } from '../../utils/utils'

import {
    trashOutline,
    createOutline,
    newspaperOutline,
    heartCircleOutline,
    radioOutline
} from "ionicons/icons";

const AlumnoList = () => {
    const [All_Alumnos, setAlumnos] = useState([]);
    const [searchText, setSearchText] = useState('');
    const { user } = useSelector((state) => state.auth);
    const idRol = user?.ID_ROL;

    useEffect(() => {
        obtenerTodos();
    }, []);

    const obtenerTodos = async () => {
        try {
            const response = await axios.get(ENDPOINTS.ALUMNO.OBTENER_TODOS);
            setAlumnos(response.data.reverse());
        } catch (error) {
            console.error("Error al obtener los alumnos", error);
        }
    };

    const buscar = async () => {
        try {
            const response = await axios.post(ENDPOINTS.ALUMNO.BUSCAR, {
                searchText: searchText.trim()
            });
            setAlumnos(response.data.reverse());
        } catch (error) {
            console.error("Error al buscar alumnos", error);
        }
    };

    const eliminar = async (id) => {
        const confirmacion = window.confirm("¿Estás seguro de eliminar este alumno?");
        if (confirmacion) {
            try {
                await axios.delete(ENDPOINTS.ALUMNO.ELIMINAR(id));
                obtenerTodos();
            } catch (error) {
                console.error("Error al eliminar el alumno", error);
            }
        }
    };


    const columns = useMemo(() => [

        { Header: 'N°', Cell: ({ row }) => All_Alumnos.length - row.index },
        { Header: 'DNI', accessor: 'DNI' },

        {
            Header: 'APELLIDOS Y NOMBRES',
            Cell: ({ row }) =>
                <div style={{ textTransform: 'capitalize' }}>
                    {`${row.original.APELLIDOS} ${row.original.NOMBRES} `}
                </div>
        },

        { Header: 'PROG. ESTUDIO', accessor: 'AREA_PE.NOMBRE_AREA_PE' },

        {
            Header: 'CICLO', accessor: 'CICLO',
            Cell: ({ value }) => convertirRomanos(value)
        },
        {
            Header: 'TURNO', accessor: 'TURNO',
            Cell: ({ value }) => (value === 'M' ? "Mañana" : "Tarde") || '------------'
        },
        {
            Header: 'ACCIONES',
            Cell: ({ row }) => (
                <>
                    <Link className="btn btn-details" to={`/alumno/detail/${row.original.ID_ALUMNO}`}
                        title="Destalles">
                        <IonIcon icon={newspaperOutline} />
                    </Link>

                    {
                        (idRol === 1) ? (
                            <>
                                <Link className="btn btn-edit" to={`/alumno/edit/${row.original.ID_ALUMNO}`}
                                    title="Editar">
                                    <IonIcon icon={createOutline} />
                                </Link>
                                <Link
                                    className="btn btn-delete"
                                    onClick={() => eliminar(row.original.ID_ALUMNO)}
                                    title="Eliminar"
                                >
                                    <IonIcon icon={trashOutline} />
                                </Link>
                            </>
                        ) : (idRol === 2) ? (
                            <>
                                <Link
                                    className="btn btn-blue"
                                    to={`/alumno/generar-cita/${row.original.ID_ALUMNO}`}
                                >
                                    <IonIcon icon={heartCircleOutline} />
                                </Link>
                            </>
                        ) : (idRol === 3) ? (
                            <>
                                <Link className="btn btn-blue" to={`/alumno/derivar/${row.original.ID_ALUMNO}`}>
                                <IonIcon icon={radioOutline} />
                                </Link>
                            </>
                        ) :

                            (
                                <>
                                    <Link className="btn" to={``}>
                                        no reconocido
                                    </Link>
                                </>
                            )
                    }
                </>
            ),
        },
    ],[All_Alumnos]
    );

    const data = useMemo(() => All_Alumnos, [All_Alumnos]);


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
                <h2>ALUMNOS</h2>

                <div className="searchInput">
                    <label>
                        <input
                            type="text"
                            placeholder="DNI, nombres o apellidos"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onKeyDown={(e) => detectarEnter(e, buscar)}
                        />
                        <IonIcon icon={searchOutline} onClick={buscar} />
                    </label>
                </div>

                {
                    idRol === 1 ? (
                        <Link to="/alumno/add" className="btn">
                            Agregar
                        </Link>
                    ) : (
                        <Link to="/" style={{ opacity: '0' }}>
                        </Link>
                    )
                }
            </div>

            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => {
                        const { key, ...rest } = headerGroup.getHeaderGroupProps();
                        return (
                            <tr key={key} {...rest}>
                                {headerGroup.headers.map(column => {
                                    const { key: columnKey, ...columnRest } = column.getHeaderProps();
                                    return (
                                        <th key={columnKey} {...columnRest}>
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
                        const { key: rowKey, ...rowRest } = row.getRowProps();
                        return (
                            <tr key={rowKey} {...rowRest}>
                                {row.cells.map(cell => {
                                    const { key: cellKey, ...cellRest } = cell.getCellProps();
                                    return (
                                        <td key={cellKey} {...cellRest}>
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

export default AlumnoList;
