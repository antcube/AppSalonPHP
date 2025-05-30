let paso = 1;
let citasGlobal = [];
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
    id: '',
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    mostrarSeccion(); // Muestra y oculta las secciones
    tabs(); // Cambia la sección cuando se presionen los tabs
    botonesPaginador(); // Agrega o quita los botones del paginador
    paginaSiguiente(); 
    paginaAnterior();

    consultarAPI(); // Consulta la API en el backend de PHP

    idCliente();
    nombreCliente(); // Añade el nombre del cliente al objeto de cita
    seleccionarFecha(); // Añade la fecha de la cita en el objeto
    seleccionarHora(); // Añade la hora de la cita en el objeto

    mostrarResumen(); // Muestra el resumen de la cita
    mostrarPanelCitasUsuario(); // Muestra u oculta las citas del usuario
    inicializarFiltroCitas(); // Inicializa el filtro de citas
}

function mostrarSeccion() {
    // Ocultar la sección que tenga la clase de mostrar
    const seccionAnterior = document.querySelector('.mostrar');
    if(seccionAnterior) {
        seccionAnterior.classList.remove('mostrar');
    }

    // Seleccionar la sección con el paso...
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add('mostrar');

    // Quita la clase de actual al tab anterior
    const tabAnterior = document.querySelector('.actual');
    if(tabAnterior) {
        tabAnterior.classList.remove('actual');
    }

    // Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');
}

function tabs() {
    // Agrega y cambia la variable de paso según el tab seleccionado
    const botones = document.querySelectorAll('.tabs button');
    botones.forEach( boton => {
        boton.addEventListener('click', function(e) {
            e.preventDefault();

            paso = parseInt( e.target.dataset.paso );
            mostrarSeccion();

            botonesPaginador(); 
        });
    });
}

function botonesPaginador() {
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');

    if(paso === 1) {
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if (paso === 3) {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');
        mostrarResumen();
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }
    mostrarSeccion();
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', function() {

        if(paso <= pasoInicial) return;
        paso--;
        
        botonesPaginador();
    })
}
function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', function() {

        if(paso >= pasoFinal) return;
        paso++;
        
        botonesPaginador();
    })
}

async function consultarAPI() {
    try {
        const url = 'http://localhost:3000/api/servicios';
        const resultado = await fetch(url);
        const servicios = await resultado.json();
        mostrarServicios(servicios);
    } catch (error) {
        console.log(error);
    }
}

function mostrarServicios(servicios) {
    servicios.forEach( servicio => {
        const { id, nombre, precio } = servicio;

        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `S/. ${precio}`;

        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;
        servicioDiv.onclick = function() {
            seleccionarServicio(servicio);
        }

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        document.querySelector('#servicios').appendChild(servicioDiv);

    });
}

function seleccionarServicio(servicio) {
    const { id } = servicio;
    const { servicios } = cita;

    // Identificar el elemento al que se le da click
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);

    // Comprobar si un servicio ya fue agregado 
    if( servicios.some( agregado => agregado.id === id ) ) {
        // Eliminarlo
        cita.servicios = servicios.filter( agregado => agregado.id !== id );
        divServicio.classList.remove('seleccionado');
    } else {
        // Agregarlo
        cita.servicios = [...servicios, servicio];
        divServicio.classList.add('seleccionado');
    }
    // console.log(cita);
}

function idCliente() {
    cita.id = document.querySelector('#id').value;
}
function nombreCliente() {
    cita.nombre = document.querySelector('#nombre').value;
}

function seleccionarFecha() {
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function(e) {

        const dia = new Date(e.target.value).getUTCDay();

        if( [6, 0].includes(dia) ) {
            e.target.value = '';
            mostrarAlerta('Fines de semana no permitidos', 'error', '.formulario');
        } else {
            cita.fecha = e.target.value;
        }  
    });
}

function seleccionarHora() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function(e) {


        const horaCita = e.target.value;
        const hora = horaCita.split(":")[0];
        if(hora < 9 || hora > 19) {
            e.target.value = '';
            mostrarAlerta('Hora No Válida', 'error', '.formulario');
        } else {
            cita.hora = e.target.value;

            // console.log(cita);
        }
    })
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {

    // Previene que se generen más de 1 alerta
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia) {
        alertaPrevia.remove();
    }

    // Scripting para crear la alerta
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);

    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    if(desaparece) {
        // Eliminar la alerta
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function mostrarResumen() {
    const resumen = document.querySelector('.contenido-resumen');

    // Limpiar el Contenido de Resumen
    while(resumen.firstChild) {
        resumen.removeChild(resumen.firstChild);
    }

    if(Object.values(cita).includes('') || cita.servicios.length === 0 ) {
        mostrarAlerta('Faltan datos de Servicios, Fecha u Hora', 'error', '.contenido-resumen', false);

        return;
    } 

    // Formatear el div de resumen
    const { nombre, fecha, hora, servicios } = cita;



    // Heading para Servicios en Resumen
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';
    resumen.appendChild(headingServicios);

    // Iterando y mostrando los servicios
    servicios.forEach(servicio => {
        const { id, precio, nombre } = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio:</span> S/. ${precio}`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio);
    });

    // Heading para Cita en Resumen
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';
    resumen.appendChild(headingCita);

    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

    // Formatear la fecha en español
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() + 2;
    const year = fechaObj.getFullYear();

    const fechaUTC = new Date( Date.UTC(year, mes, dia));
    
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}
    const fechaFormateada = fechaUTC.toLocaleDateString('es-PE', opciones);

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora} Horas`;

    // Boton para Crear una cita
    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar Cita';
    botonReservar.onclick = reservarCita;

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);

    resumen.appendChild(botonReservar);
}

async function reservarCita() {

    const { nombre, fecha, hora, servicios, id } = cita;
    
    const idServicios = servicios.map( servicio => servicio.id );
    // console.log(idServicios);

    const datos = new FormData();
    
    datos.append('fecha', fecha);
    datos.append('hora', hora );
    datos.append('usuarioId', id);
    datos.append('servicios', idServicios);
    // console.log([...datos]);

    try {
        // Petición hacia la api
        const url = 'http://localhost:3000/api/citas'
        const respuesta = await fetch(url, {
            method: 'POST',
            body: datos
        });

        const resultado = await respuesta.json();
        // console.log(resultado);
        
        if(resultado.resultado) {
            Swal.fire({
                icon: 'success',
                title: 'Cita Creada',
                text: 'Tu cita fue creada correctamente',
                button: 'OK'
            }).then( () => {
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            })
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al guardar la cita'
        }).then( () => {
            setTimeout(() => {
                window.location.reload();
            }, 500);
        })
    }
}

function mostrarPanelCitasUsuario() {
    const btnCitas = document.getElementById('btn-citas');
    const iconCitas = document.getElementById('icon-citas');
    const citasUsuario = document.getElementById('citas-usuario');
    const panel = document.getElementById('app');
    const titulo = document.querySelector('.nombre-pagina');
    const descripcion = document.querySelector('.descripcion-pagina');
    if(btnCitas && citasUsuario) {
        btnCitas.addEventListener('click', function() {
            if(!citasUsuario.classList.contains('mostrar')) {
                citasUsuario.classList.add('mostrar');
                panel.classList.add('ocultar');
                iconCitas.src = 'build/img/IconBack.svg';
                iconCitas.alt = 'Regresar';
                iconCitas.title = 'Regresar';
                titulo.textContent = 'Mis Citas';
                descripcion.classList.add('ocultar');
                consultarAPICitasUsuario();
            } else {
                citasUsuario.classList.remove('mostrar');
                panel.classList.remove('ocultar');
                iconCitas.src = 'build/img/IconCalendar.svg';
                iconCitas.alt = 'Ver Citas';
                iconCitas.title = 'Ver Citas';
                titulo.textContent = 'Crear Nueva Cita';
                descripcion.classList.remove('ocultar');
            }
        });
    }
}

async function consultarAPICitasUsuario() {
    try {
        const respuesta = await fetch('http://localhost:3000/api/citas');
        const citas = await respuesta.json();
        citasGlobal = citas;
        filtrarCitas();
    } catch (error) {
        console.log(error);
    }
}

function inicializarFiltroCitas() {
    const filtro = document.querySelector('#filtro-citas');
    filtro.addEventListener('change', function() {
        filtrarCitas();
    });
}

function filtrarCitas() {
    const filtro = document.querySelector('#filtro-citas');
    const hoy = new Date().toISOString().split('T')[0];

    let citasFiltradas = [];
    if (filtro.value === 'pendientes') {
        citasFiltradas = citasGlobal.filter(cita => cita.fecha >= hoy);
    } else if (filtro.value === 'pasadas') {
        citasFiltradas = citasGlobal.filter(cita => cita.fecha < hoy);
    } else {
        citasFiltradas = citasGlobal;
    }

    mostrarCitasUsuario(citasFiltradas);
}

function mostrarCitasUsuario(citas) {
    const citasUsuario = document.querySelector('#citas');

    // Limpiar el contenido de citas
    while(citasUsuario.firstChild) {
        citasUsuario.removeChild(citasUsuario.firstChild);
    }

    if(citas.length === 0) {
        const noCitas = document.createElement('P');
        noCitas.textContent = 'No hay citas para mostrar';
        noCitas.classList.add('text-center');
        citasUsuario.appendChild(noCitas);
        return;
    }

    // Iterar sobre las citas y mostrarlas
    citas.forEach( cita => {
        const { id, fecha, hora, servicios } = cita;

        // Card de Cita
        const citaDiv = document.createElement('DIV');
        citaDiv.classList.add('cita');
        citaDiv.dataset.idCita = id;

        // Verificar si la cita es pendiente o pasada
        const fechaCita = new Date(fecha);
        const fechaActual = new Date();
        const estado = fechaCita < fechaActual ? 'Pasada' : 'Pendiente';

        // Etiqueta de Cita
        const etiqueta = document.createElement('P');
        etiqueta.classList.add('etiqueta', estado.toLowerCase());
        etiqueta.textContent = estado;

        // Fecha
        const fechaDiv = document.createElement('DIV');
        fechaDiv.classList.add('fechaDiv');

        const fechaIcon = document.createElement('IMG');
        fechaIcon.src = 'build/img/IconDate.svg';
        fechaIcon.alt = 'Fecha de Cita';

        const fechaCitaTexto = document.createElement('P');
        fechaCitaTexto.textContent = fecha;

        const fechaCitaSpan = document.createElement('SPAN');
        fechaCitaSpan.textContent = 'Fecha: ';

        fechaCitaTexto.prepend(fechaCitaSpan);
        fechaDiv.appendChild(fechaIcon);
        fechaDiv.appendChild(fechaCitaTexto);

        // Hora
        const horaDiv = document.createElement('DIV');
        horaDiv.classList.add('horaDiv');

        const horaIcon = document.createElement('IMG');
        horaIcon.src = 'build/img/IconTime.svg';
        horaIcon.alt = 'Hora de Cita';

        const horaCitaTexto = document.createElement('P');
        horaCitaTexto.textContent = hora;

        const horaCitaSpan = document.createElement('SPAN');
        horaCitaSpan.textContent = 'Hora: ';

        horaCitaTexto.prepend(horaCitaSpan);
        horaDiv.appendChild(horaIcon);
        horaDiv.appendChild(horaCitaTexto);

        citaDiv.appendChild(etiqueta);
        citaDiv.appendChild(fechaDiv);
        citaDiv.appendChild(horaDiv);

        // Mostrar servicios
        if(servicios) {
            const serviciosDiv = document.createElement('DIV');
            serviciosDiv.classList.add('serviciosDiv');

            const serviciosTitulo = document.createElement('H4');
            serviciosTitulo.textContent = 'Servicios:';
            serviciosDiv.appendChild(serviciosTitulo);

            servicios.forEach( servicio => {
                const servicioP = document.createElement('P');
                servicioP.textContent = `${servicio.nombre} - S/. ${servicio.precio}`;
                serviciosDiv.appendChild(servicioP);
            });

            citaDiv.appendChild(serviciosDiv);
        }

        // Mostrar total
        const totalDiv = document.createElement('DIV');
        totalDiv.classList.add('totalDiv');

        const totalTitulo = document.createElement('H4');
        totalTitulo.textContent = 'Total:';

        const totalPrecio = document.createElement('P');
        const total = servicios.reduce((acc, servicio) => acc + parseFloat(servicio.precio), 0);
        totalPrecio.textContent = `S/. ${total.toFixed(2)}`;

        totalDiv.appendChild(totalTitulo);
        totalDiv.appendChild(totalPrecio);

        citaDiv.appendChild(totalDiv);

        citasUsuario.appendChild(citaDiv);
    });
}