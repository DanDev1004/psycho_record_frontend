import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { IonIcon } from '@ionic/react';
import { searchOutline } from 'ionicons/icons';
import { useTable, usePagination } from 'react-table';
import { useSelector } from 'react-redux';

const AlumnoList = () => {
    const [alumnos, setAlumnos] = useState([]);
    const [searchText, setSearchText] = useState('');
    const { user } = useSelector((state) => state.auth);
    const idRol = user?.ID_ROL;

    useEffect(() => {
        obtenerTodos();
    }, []);

    const obtenerTodos = async () => {
        try {
            const response = await axios.get("http://localhost:5000/alumno");
            setAlumnos(response.data);
        } catch (error) {
            console.error("Error al obtener los alumnos", error);
        }
    };

    const buscarAlumno = async () => {
        try {
            const response = await axios.post("http://localhost:5000/alumno/buscar", {
                searchText: searchText.trim()
            });
            setAlumnos(response.data);
        } catch (error) {
            console.error("Error al buscar alumnos", error);
        }
    };

    const detectarEnter = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            buscarAlumno();
        }
    };

    const eliminar = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/alumno/${id}`);
            obtenerTodos();
        } catch (error) {
            console.error("Error al eliminar el alumno", error);
        }
    };

    const convertirRomanos = (num) => {
        const numerosRomanos = ['I', 'II', 'III', 'IV', 'V', 'VI'];
        return numerosRomanos[num - 1] || num;
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

    const columns = useMemo(
        () => [
            {
                Header: 'N°',
                Cell: ({ row }) => row.index + 1,
            },
            {
                Header: 'DNI',
                accessor: 'DNI',
            },
            {
                Header: 'NOMBRES',
                accessor: 'NOMBRES',
            },
            {
                Header: 'APELLIDOS',
                accessor: 'APELLIDOS',
            },
            {
                Header: 'PROG. ESTUDIO',
                accessor: 'AREA_PE.NOMBRE_AREA_PE',
            },
            {
                Header: 'CICLO',
                accessor: 'CICLO',
                Cell: ({ value }) => convertirRomanos(value)
            },
            {
                Header: 'SEXO',
                accessor: 'SEXO',
                Cell: ({ value }) => (value === 'M' ? 'Masculino' : 'Femenino'),
            },
            {
                Header: 'TELÉFONO',
                accessor: 'TELEFONO',
                Cell: ({ value }) => value || '------------',
            },
            {
                Header: 'RELIGIÓN',
                accessor: 'RELIGION.NOMBRE_RELIGION',
                Cell: ({ value }) => value || '------------',
            },
            {
                Header: 'E. CIVIL',
                accessor: 'ESTADO_CIVIL.NOMBRE_EC',
                Cell: ({ value }) => value || '------------',
            },
            {
                Header: 'DIR. NAC.',
                accessor: 'DIR_NAC',
                Cell: ({ value }) => value || '------------',
            },
            {
                Header: 'NAC.',
                accessor: 'FECH_NAC',
                Cell: ({ value }) => (value ? new Date(value).toLocaleDateString() : '------------'),
            },
            {
                Header: 'EDAD',
                accessor: 'EDAD',
                Cell: ({ row }) => (row.original.FECH_NAC ? calcularEdad(row.original.FECH_NAC) : '------------'),
            },
            {
                Header: 'DOMICILIO',
                accessor: 'DOMICILIO',
                Cell: ({ value }) => value || '------------',
            },
            {
                Header: 'ACCIONES',
                Cell: ({ row }) => (
                    <>
                        {
                            (idRol === 1) ? (
                                <>
                                    <Link className="btn btn-edit" to={`/alumno/edit/${row.original.ID_ALUMNO}`}>
                                        Editar
                                    </Link>
                                    <Link
                                        className="btn btn-delete"
                                        onClick={() => eliminar(row.original.ID_ALUMNO)}
                                    >
                                        Eliminar
                                    </Link>
                                </>
                            ) : (idRol === 2) ? (
                                <>
                                    <Link
                                        className="btn btn-details"
                                        to={`/alumno/generar-cita/${row.original.ID_ALUMNO}`}
                                    >
                                        generar cita
                                    </Link>
                                </>
                            ) : (idRol === 3) ? (
                                <>
                                    <Link className="btn btn-details" to={`/alumno/derivar/${row.original.ID_ALUMNO}`}>
                                        Derivar
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
        ],
        [alumnos]
    );

    const data = useMemo(() => alumnos, [alumnos]);

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
                            onKeyDown={detectarEnter}
                        />
                        <IonIcon icon={searchOutline} onClick={buscarAlumno} />
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
