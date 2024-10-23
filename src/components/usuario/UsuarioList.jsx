import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { IonIcon } from '@ionic/react';
import { useSelector } from "react-redux";
import { searchOutline } from 'ionicons/icons';
import { useTable, usePagination } from 'react-table';
import {
  trashOutline,
  createOutline
} from "ionicons/icons";

import { ENDPOINTS } from "../../api/apiEndPoints";
import { detectarEnter } from "../../utils/utils";

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
      const response = await axios.get(ENDPOINTS.USUARIO.OBTENER_TODOS);
      const filtrarUsuarios = response.data.filter(u => u.ID_USUARIO !== user?.ID_USUARIO).reverse();
      setUsers(filtrarUsuarios); 
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const buscar = async () => {
    try {
      const response = await axios.post(ENDPOINTS.USUARIO.BUSCAR, {
        searchText: searchText.trim()
      });
      const filtrarUsuarios = response.data.filter(u => u.ID_USUARIO !== user?.ID_USUARIO);
      setUsers(filtrarUsuarios.reverse()); 
    } catch (error) {
      console.error("Error al buscar usuarios:", error);
    }
  };

  const eliminar = async (id) => { 
    const confirmacion = window.confirm("¿Estás seguro de eliminar este usuario?");

    if(confirmacion){
      try {
        await axios.delete(ENDPOINTS.USUARIO.ELIMINAR(id));
        obtenerTodos();
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
      }
    }
  };

  const obtenerGeneroTexto = (genero) => {
    switch(genero) {
      case 1: return "Masculino";
      case 2: return "Femenino";
      default: return "No especificado";
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: 'N°',
        Cell: ({ row }) => usuarios.length - row.index,
      },
      {
        Header: 'DNI',
        accessor: 'DNI_USUARIO',
      },
      {
        Header: 'NOMBRES Y APELLIDOS',
        Cell: ({ row }) => 
          <div style={{textTransform:'uppercase'}}>
            {`${row.original.APELLIDO_USUARIO} ${row.original.NOMBRE_USUARIO} `}
          </div>
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
        Header: 'TELÉFONO',
        accessor: 'TELEFONO',
      },
      {
        Header: 'GÉNERO',
        accessor: 'GENERO',
        Cell: ({ value }) => obtenerGeneroTexto(value), 
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
              <IonIcon icon={createOutline} />
            </Link>
            <Link className="btn-delete" onClick={() => eliminar(row.original.ID_USUARIO)}>
              <IonIcon icon={trashOutline} />
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
              onKeyDown={(e) => detectarEnter(e,buscar)}
            />
            <IonIcon icon={searchOutline} onClick={buscar}/>
          </label>
        </div>

        <Link to="/usuario/add" className="btn">
          Agregar
        </Link>
      </div>

      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>
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

export default UsuarioList;
