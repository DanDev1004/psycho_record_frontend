const BASE_URL = 'http://localhost:5000';

export const ENDPOINTS = {
    //PRINCIPAL
    USUARIO: {
        OBTENER_POR_ID: (id) => `${BASE_URL}/usuario/${id}`,
        OBTENER_TODOS: `${BASE_URL}/usuario`,
        CREAR: `${BASE_URL}/usuario`,
        ACTUALIZAR: (id) => `${BASE_URL}/usuario/${id}`,
        ELIMINAR: (id) => `${BASE_URL}/usuario/${id}`,
        BUSCAR: `${BASE_URL}/usuario/buscar`,
    },
    ALUMNO: {
        OBTENER_POR_ID: (id) => `${BASE_URL}/alumno/${id}`,
        OBTENER_TODOS: `${BASE_URL}/alumno`,
        CREAR: `${BASE_URL}/alumno`,
        ACTUALIZAR: (id) => `${BASE_URL}/alumno/${id}`,
        ELIMINAR: (id) => `${BASE_URL}/alumno/${id}`,
        BUSCAR: `${BASE_URL}/alumno/buscar`,
    },
    DERIVACION: {
        OBTENER_POR_ID: (id) => `${BASE_URL}/derivacion/${id}`,
        OBTENER_TODOS: `${BASE_URL}/derivacion`,
        CREAR: `${BASE_URL}/derivacion`,
        ACTUALIZAR: (id) => `${BASE_URL}/derivacion/${id}`,
        ELIMINAR: (id) => `${BASE_URL}/derivacion/${id}`,
        BUSCAR: `${BASE_URL}/derivacion/buscar`,
    },
    CONSULTAPS: {
        OBTENER_POR_ID: (id) => `${BASE_URL}/consulta/${id}`,
        OBTENER_TODOS: `${BASE_URL}/consulta`,
        CREAR: `${BASE_URL}/consulta`,
        ACTUALIZAR: (id) => `${BASE_URL}/consulta/${id}`,
        ELIMINAR: (id) => `${BASE_URL}/consulta/${id}`,
        BUSCAR: `${BASE_URL}/consulta/buscar`,
        FILTRAR_POR_FECHA: `${BASE_URL}/consulta/filtrarporfecha`,
    },


    //DIAGNOSTICO
    CATCOND: {
        OBTENER_POR_ID: (id) => `${BASE_URL}/catcond/${id}`,
        OBTENER_TODOS: `${BASE_URL}/catcond`,
        CREAR: `${BASE_URL}/catcond`,
        ACTUALIZAR: (id) => `${BASE_URL}/catcond/${id}`,
        ELIMINAR: (id) => `${BASE_URL}/catcond/${id}`,
    },
    CONDICION: {
        OBTENER_POR_ID: (id) => `${BASE_URL}/condiciones/${id}`,
        OBTENER_TODOS: `${BASE_URL}/condiciones`,
        CREAR: `${BASE_URL}/condiciones`,
        ACTUALIZAR: (id) => `${BASE_URL}/condiciones/${id}`,
        ELIMINAR: (id) => `${BASE_URL}/condiciones/${id}`,
        OBTENER_POR_CATEGORIA: (idCatCond) => `${BASE_URL}/condiciones/categoria/${idCatCond}`,
    },
    DIAGNOSTICO: {
        OBTENER_POR_ID: (id) => `${BASE_URL}/diagnostico/${id}`,
        OBTENER_TODOS: `${BASE_URL}/diagnostico`,
        CREAR: `${BASE_URL}/diagnostico`,
        ACTUALIZAR: (id) => `${BASE_URL}/diagnostico/${id}`,
        ELIMINAR: (id) => `${BASE_URL}/diagnostico/${id}`,
        OBTENER_POR_CONSULTA: (id) => `${BASE_URL}/diagnostico/consulta/${id}`,
    },


    //MANTENIMIENTO
    AREAPE: {
        OBTENER_POR_ID: (id) => `${BASE_URL}/areape/${id}`,
        OBTENER_TODOS: `${BASE_URL}/areape`,
        CREAR: `${BASE_URL}/areape`,
        ACTUALIZAR: (id) => `${BASE_URL}/areape/${id}`,
        ELIMINAR: (id) => `${BASE_URL}/areape/${id}`,
    },
    ESTADOCIVIL: {
        OBTENER_POR_ID: (id) => `${BASE_URL}/estadoCivil/${id}`,
        OBTENER_TODOS: `${BASE_URL}/estadoCivil`,
        CREAR: `${BASE_URL}/estadoCivil`,
        ACTUALIZAR: (id) => `${BASE_URL}/estadoCivil/${id}`,
        ELIMINAR: (id) => `${BASE_URL}/estadoCivil/${id}`,
    },
    RELIGION: {
        OBTENER_POR_ID: (id) => `${BASE_URL}/religion/${id}`,
        OBTENER_TODOS: `${BASE_URL}/religion`,
        CREAR: `${BASE_URL}/religion`,
        ACTUALIZAR: (id) => `${BASE_URL}/religion/${id}`,
        ELIMINAR: (id) => `${BASE_URL}/religion/${id}`,
    },
    ROL: {
        OBTENER_POR_ID: (id) => `${BASE_URL}/rol/${id}`,
        OBTENER_TODOS: `${BASE_URL}/rol`,
        CREAR: `${BASE_URL}/rol`,
        ACTUALIZAR: (id) => `${BASE_URL}/rol/${id}`,
        ELIMINAR: (id) => `${BASE_URL}/rol/${id}`,
    },
};