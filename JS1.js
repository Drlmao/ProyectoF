// Referencias a elementos del DOM
const botonAgregar = document.getElementById("boton");
const inputNombre = document.getElementById("task-title");
const inputAsiento = document.querySelector("input[placeholder='Numero de asiento']");
const tablaAsientos = document.querySelector("table:nth-of-type(2)");

// Array para almacenar las reservaciones
let reservaciones = [];

// Función para agregar o editar una reservación
const agregarReservacion = () => {
    const nombre = inputNombre.value.trim();
    const asiento = inputAsiento.value.trim();

    if (!nombre || !asiento) {
        return alert("Por favor, completa todos los campos.");
    }

    // Verifica si el asiento ya está reservado
    const existente = reservaciones.find(r => r.asiento === asiento);

    if (existente) {
        existente.nombre = nombre; // Actualiza la reservación
    } else {
        reservaciones.push({ nombre, asiento }); // Crea una nueva
    }

    actualizarMapa();
    limpiarFormulario();
};

// Función para actualizar el mapa de asientos
const actualizarMapa = () => {
    tablaAsientos.querySelectorAll("td").forEach(td => {
        td.className = ""; // Quita cualquier clase aplicada
        td.innerHTML = td.dataset.asiento; // Restaura el contenido al número del asiento
    });

    reservaciones.forEach(({ nombre, asiento }) => {
        const td = tablaAsientos.querySelector(`td[data-asiento="${asiento}"]`);
        if (td) {
            td.className = "reservado";
            td.innerHTML = `
                <div>
                    <p>${nombre}</p>
                    <button class="editar" data-asiento="${asiento}">Editar</button>
                    <button class="eliminar" data-asiento="${asiento}">Eliminar</button>
                </div>
            `;
        }
    });
};

// Función para limpiar el formulario
const limpiarFormulario = () => {
    inputNombre.value = "";
    inputAsiento.value = "";
};

// Maneja clics en botones de la tabla
const manejarClicBoton = event => {
    const { classList, dataset } = event.target;
    const asiento = dataset.asiento;

    if (classList.contains("editar")) {
        const reserva = reservaciones.find(r => r.asiento === asiento);
        if (reserva) {
            // Llenar los campos del formulario con los datos actuales de la reserva
            inputNombre.value = reserva.nombre;
            inputAsiento.value = reserva.asiento;

            // Remover la reserva del array
            reservaciones = reservaciones.filter(r => r.asiento !== asiento);

            // Actualizar el mapa para quitar el asiento previamente reservado
            actualizarMapa();
        }
    } else if (classList.contains("eliminar")) {
        // Eliminar la reserva del array
        reservaciones = reservaciones.filter(r => r.asiento !== asiento);

        // Actualizar el mapa para reflejar los cambios
        actualizarMapa();
    }
};

// Asigna identificadores únicos a los asientos
tablaAsientos.querySelectorAll("td").forEach((td, index) => {
    td.dataset.asiento = index + 1;
});

// Event Listeners
botonAgregar.addEventListener("click", agregarReservacion);
tablaAsientos.addEventListener("click", manejarClicBoton);
