import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { IonIcon } from '@ionic/react';
import { useSelector } from "react-redux";
import { searchOutline } from 'ionicons/icons';
import { useTable, usePagination } from 'react-table';

const UsuarioList = () => {
  const [usuarios, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      obtenerTodos();
    }
  }, [user]);

  const obtenerTodos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/usuario");
      const filteredUsers = response.data.filter(u => u.ID_USUARIO !== user?.ID_USUARIO);
      setUsers(filteredUsers); 
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const buscarUsuario = async () => {
    try {
      const response = await axios.post("http://localhost:5000/buscarUsuario", {
        searchText: searchText.trim()
      });
      const filteredUsers = response.data.filter(u => u.ID_USUARIO !== user?.ID_USUARIO);
      setUsers(filteredUsers); 
    } catch (error) {
      console.error("Error al buscar usuarios:", error);
    }
  };

  const detectarEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      buscarUsuario(); 
    }
  };

  const eliminar = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/usuario/${userId}`);
      obtenerTodos();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
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
        accessor: 'DNI_USUARIO',
      },
      {
        Header: 'NOMBRES Y APELLIDOS',
        Cell: ({ row }) => `${row.original.NOMBRE_USUARIO} ${row.original.APELLIDO_USUARIO}`,
      },
      {
        Header: 'EMAIL',
        accessor: 'EMAIL',
      },
      {
        Header: 'USERNAME',
        accessor: 'USERNAME',
      },
      {
        Header: 'ROL',
        accessor: 'ROL.NOMBRE_ROL',
      },
      {
        Header: 'ACCIONES',
        Cell: ({ row }) => (
          <>
            <Link className="btn-edit" to={`/usuario/edit/${row.original.ID_USUARIO}`}>
              Editar
            </Link>
            <Link className="btn-delete" onClick={() => eliminar(row.original.ID_USUARIO)}>
              Eliminar
            </Link>
          </>
        ),
      },
    ],
    [usuarios]
  );

  const data = useMemo(() => usuarios, [usuarios]);

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
        <h2>USUARIOS</h2>

        <div className="searchInput">
          <label>
            <input
              type="text"
              placeholder="DNI, nombres o apellidos" 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={detectarEnter}
            />
            <IonIcon icon={searchOutline} onClick={buscarUsuario}/>
          </label>
        </div>

        <Link to="/usuario/add" className="btn">
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

export default UsuarioList;
