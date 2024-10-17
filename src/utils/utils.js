export const formatearFecha = (dateString) => {
    const date = new Date(dateString);
    const year = date.getUTCFullYear(); 
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); 
    const day = String(date.getUTCDate()).padStart(2, '0'); 
    return `${day}-${month}-${year}`;
};

export const convertirRomanos = (num) => {
    const numerosRomanos = ['I', 'II', 'III', 'IV', 'V', 'VI'];
    return numerosRomanos[num - 1] || num;
};


export const detectarEnter = (e, accion) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        accion();
    }
};

export const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }

    return edad;
};


export  const obtenerFechaActual = () => {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, '0'); 
    const day = String(hoy.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export function formatTime_Hora_Minuto(horaCompleta) {
    return horaCompleta.split(":").slice(0, 2).join(":");
  }