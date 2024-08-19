import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { IonIcon } from '@ionic/react';
import { searchOutline } from 'ionicons/icons';
import { useTable, usePagination } from 'react-table';

const InstructorList = () => {
  const [instructores, setInstructores] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    obtenerTodos();
  }, []);

  const obtenerTodos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/instructor");
      setInstructores(response.data);
    } catch (error) {
      console.error("Error al obtener instructores", error);
    }
  };

  const buscarInstructor = async () => {
    try {
      const response = await axios.post("http://localhost:5000/buscarInstructor", {
        searchText: searchText.trim()
      });
      setInstructores(response.data);
    } catch (error) {
      console.error("Error al buscar instructor", error);
    }
  };

  const detectarEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      buscarInstructor();
    }
  };

  const eliminar = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/instructor/${id}`);
      obtenerTodos();
    } catch (error) {
      console.error("Error al eliminar instructor", error);
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: 'N°',
        Cell: ({ row }) => row.index + 1,
      },
      {
        Header: 'DNI',
        accessor: 'DNI_INSTRUCTOR',
      },
      {
        Header: 'Nombres',
        accessor: 'NOMBRE_INSTRUCTOR',
      },
      {
        Header: 'Apellidos',
        accessor: 'APELLIDO_INSTRUCTOR',
      },
      {
        Header: 'Área',
        accessor: 'AREA_PE.NOMBRE_AREA_PE',
        Cell: ({ value }) => value ? value.toUpperCase() : "NO ASIGNADO",
      },
      {
        Header: 'Fecha Inicio',
        accessor: 'FECHA_INICIO',
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
      },
      {
        Header: 'Fecha Fin',
        accessor: 'FECHA_FIN',
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
      },
      {
        Header: 'Estado',
        accessor: 'ESTADO',
        Cell: ({ value }) => value ? "Activo" : "Inactivo",
      },
      {
        Header: 'Acciones',
        Cell: ({ row }) => (
          <>
            <Link className="btn-edit" to={`/instructor/edit/${row.original.ID_INSTRUCTOR}`}>
              Editar
            </Link>
            <Link
              className="btn-delete"
              onClick={() => eliminar(row.original.ID_INSTRUCTOR)}
            >
              Eliminar
            </Link>
          </>
        ),
      },
    ],
    [instructores]
  );

  const data = useMemo(() => instructores, [instructores]);

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
        <h2>INSTRUCTORES</h2>

        <div className="searchInput">
          <label>
            <input
              type="text"
              placeholder="DNI, nombres o apellidos"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={detectarEnter}
            />
            <IonIcon icon={searchOutline} onClick={buscarInstructor} />
          </label>
        </div>
        <Link to="/instructor/add" className="btn">
          Agregar
        </Link>
      </div>

      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => {
            const { key: headerGroupKey, ...headerGroupRest } = headerGroup.getHeaderGroupProps();
            return (
              <tr key={headerGroupKey} {...headerGroupRest}>
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

export default InstructorList;
