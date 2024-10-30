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
import Tabla from "../partials/Tabla";

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

    if (confirmacion) {
      try {
        await axios.delete(ENDPOINTS.USUARIO.ELIMINAR(id));
        obtenerTodos();
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
      }
    }
  };

  const obtenerGeneroTexto = (genero) => {
    switch (genero) {
      case 1: return "Masculino";
      case 2: return "Femenino";
      default: return "No especificado";
    }
  };

  const activarUsuario = async (id) => {
    const confirmacion = window.confirm("¿Estás seguro de activar este usuario?");

    if (confirmacion) {
      try {
        await axios.patch(ENDPOINTS.USUARIO.ACTIVAR(id));
        obtenerTodos();
      } catch (error) {
        console.error("Error al activar usuario:", error);
      }
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
          <div style={{ textTransform: 'uppercase' }}>
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
            {row.original.ESTADO ? (
              <>
                <Link className="btn-edit" to={`/usuario/edit/${row.original.ID_USUARIO}`}>
                  <IonIcon icon={createOutline} />
                </Link>

                <Link className="btn-delete" onClick={() => eliminar(row.original.ID_USUARIO)}>
                  <IonIcon icon={trashOutline} />
                </Link>
              </>
            ) : (
              <Link
                className="btn-details"
                onClick={() => activarUsuario(row.original.ID_USUARIO)}
              >
                Activar
              </Link>
            )

            }

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
    <div className="tabla">
      <div className="TableHeader">
        <h2>USUARIOS</h2>

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


        <div>
          <Link to="/usuario/add" className="btn">
            Agregar
          </Link>
        </div>
      </div>

      <Tabla
        getTableProps={getTableProps}
        getTableBodyProps={getTableBodyProps}
        headerGroups={headerGroups}
        page={page}
        prepareRow={prepareRow}
        pageIndex={pageIndex}
        pageOptions={pageOptions}
        previousPage={previousPage}
        nextPage={nextPage}
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
      />

    </div>
  );
};

export default UsuarioList;
