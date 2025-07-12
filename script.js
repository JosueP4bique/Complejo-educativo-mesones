document.addEventListener('DOMContentLoaded', () => {
    const botonesAcceder = document.querySelectorAll('.acceder-btn');
    const formularioSubida = document.getElementById('formulario-subida');
    const cancelarSubidaBtn = document.getElementById('cancelar-subida');
    const uploadForm = document.getElementById('upload-form');
    const anoSeleccionadoTitulo = document.getElementById('ano-seleccionado-titulo');
    const archivoInput = document.getElementById('archivo');

    const registroForm = document.getElementById('registro-form');
    const mensajeNoRegistrado = document.querySelector('.mensaje-no-registrado');
    const seccionArchivosSubidos = document.getElementById('archivos-subidos');
    const listaArchivosUl = document.getElementById('lista-archivos');
    const anoArchivosTitulo = document.getElementById('ano-archivos-titulo');

    // Simulación de estado de autenticación y almacenamiento de archivos
    let usuarioRegistrado = null; // Podría ser un objeto con datos del usuario
    let archivosPorAno = {
        primero: [],
        segundo: [],
        tercero: [],
        cuarto: [],
        quinto: [],
        enfermeria: []
    };
    let anoActualParaSubida = '';

    // --- MANEJO DE VISIBILIDAD DEL FORMULARIO DE SUBIDA ---
    botonesAcceder.forEach(boton => {
        boton.addEventListener('click', () => {
            // Simulación de restricción de acceso
            if (!usuarioRegistrado) {
                mostrarMensajeNoRegistrado();
                formularioSubida.style.display = 'none';
                seccionArchivosSubidos.style.display = 'none';
                return;
            }
            mensajeNoRegistrado.style.display = 'none';

            anoActualParaSubida = boton.dataset.ano;
            const nombreAno = boton.closest('.ano').querySelector('h3').textContent;
            anoSeleccionadoTitulo.textContent = nombreAno;
            formularioSubida.style.display = 'block';
            uploadForm.reset(); // Limpiar el formulario
            actualizarListaArchivos(anoActualParaSubida);
            seccionArchivosSubidos.style.display = 'block';
        });
    });

    cancelarSubidaBtn.addEventListener('click', () => {
        formularioSubida.style.display = 'none';
        seccionArchivosSubidos.style.display = 'none';
        uploadForm.reset();
    });

    // --- MANEJO DE SUBIDA DE ARCHIVOS ---
    uploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!usuarioRegistrado) {
            alert("Debes estar registrado para subir archivos.");
            return;
        }

        const descripcion = document.getElementById('descripcion').value;
        const fecha = document.getElementById('fecha').value;
        const archivo = archivoInput.files[0];

        if (archivo && archivo.type === "application/pdf") {
            const nuevoArchivo = {
                id: Date.now(), // ID único para el archivo
                nombre: archivo.name,
                descripcion: descripcion,
                fecha: fecha,
                subidoPor: usuarioRegistrado.email // Guardar quién subió el archivo
            };

            archivosPorAno[anoActualParaSubida].push(nuevoArchivo);
            alert(`Archivo "${archivo.name}" subido para ${anoSeleccionadoTitulo.textContent}.`);
            uploadForm.reset();
            formularioSubida.style.display = 'none'; // Ocultar después de subir
            actualizarListaArchivos(anoActualParaSubida); // Actualizar la lista visible
        } else {
            alert("Por favor, selecciona un archivo PDF.");
            archivoInput.value = ''; // Limpiar el input de archivo
        }
    });

    function actualizarListaArchivos(ano) {
        listaArchivosUl.innerHTML = ''; // Limpiar lista actual
        anoArchivosTitulo.textContent = document.getElementById(ano).querySelector('h3').textContent;

        if (archivosPorAno[ano] && archivosPorAno[ano].length > 0) {
            archivosPorAno[ano].forEach(archivo => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${archivo.nombre} - ${archivo.descripcion} (${archivo.fecha})</span>
                `;
                // Solo mostrar botón de eliminar si el usuario actual subió el archivo
                if (usuarioRegistrado && archivo.subidoPor === usuarioRegistrado.email) {
                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = 'Eliminar';
                    deleteBtn.classList.add('delete-btn');
                    deleteBtn.onclick = () => eliminarArchivo(ano, archivo.id);
                    li.appendChild(deleteBtn);
                }
                listaArchivosUl.appendChild(li);
            });
        } else {
            listaArchivosUl.innerHTML = '<li>No hay archivos subidos para este año.</li>';
        }
        seccionArchivosSubidos.style.display = 'block';
    }

    function eliminarArchivo(ano, archivoId) {
        if (!usuarioRegistrado) return; // Seguridad adicional

        // Filtrar el archivo a eliminar
        archivosPorAno[ano] = archivosPorAno[ano].filter(archivo => {
            // Solo permitir eliminar si el ID coincide Y el usuario es el que lo subió
            return !(archivo.id === archivoId && archivo.subidoPor === usuarioRegistrado.email);
        });

        actualizarListaArchivos(ano);
        alert("Archivo eliminado.");
    }


    // --- MANEJO DE REGISTRO (SIMULADO) ---
    registroForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = document.getElementById('reg-nombre').value;
        const email = document.getElementById('reg-email').value;
        // const password = document.getElementById('reg-password').value; // No se usa en esta simulación

        if (nombre && email) {
            usuarioRegistrado = { nombre, email }; // Simular registro exitoso
            alert(`Usuario ${nombre} registrado con éxito.`);
            registroForm.reset();
            registroForm.style.display = 'none'; // Ocultar formulario de registro
            document.querySelector('.registro-seccion p').textContent = `Bienvenido, ${nombre}! Ya puedes acceder a los formularios.`;
            mensajeNoRegistrado.style.display = 'none';

            // Opcional: Ocultar el mensaje "Debes registrarte..." y el formulario
            const pRegistro = document.querySelector('.registro-seccion > p');
            if(pRegistro) pRegistro.style.display = 'none';


        } else {
            alert("Por favor, completa todos los campos del registro.");
        }
    });

    function mostrarMensajeNoRegistrado() {
        mensajeNoRegistrado.style.display = 'block';
        // Opcional: hacer scroll hacia el mensaje si está fuera de vista
        // mensajeNoRegistrado.scrollIntoView({ behavior: 'smooth' });
    }


    // --- BARRA DE BÚSQUEDA (SIMULADA) ---
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (!searchTerm) {
            alert("Por favor, ingresa un término de búsqueda.");
            return;
        }
        if(!usuarioRegistrado){
            mostrarMensajeNoRegistrado();
            return;
        }

        alert(`Búsqueda simulada para: "${searchTerm}".\nEn una implementación real, esto filtraría los archivos mostrados o buscaría en una base de datos.`);
        // Aquí iría la lógica para buscar en `archivosPorAno` y mostrar resultados.
        // Por simplicidad, solo mostramos una alerta.
        // Para una búsqueda real, se necesitaría:
        // 1. Iterar sobre todos los archivos en `archivosPorAno`.
        // 2. Comparar `searchTerm` con nombre, descripción, etc. del archivo.
        // 3. Mostrar los resultados (podría ser en una nueva sección o filtrando la `listaArchivosUl`).
    });

    // Estado inicial: si no hay usuario, mostrar mensaje de no registrado al intentar acceder a algo protegido.
    // Esto ya se maneja en los event listeners de los botones "Acceder".
    // Podríamos ocultar el formulario de registro si el usuario ya está "logueado" (recargando la página se pierde el estado simulado)
    // if (usuarioRegistrado) {
    //     registroForm.style.display = 'none';
    //     document.querySelector('.registro-seccion p').textContent = `Bienvenido de nuevo, ${usuarioRegistrado.nombre}!`;
    // }

    // --- MODERACIÓN CON IA (Conceptual) ---
    // Esta funcionalidad sería del lado del servidor.
    // Al subir un archivo, el servidor podría enviarlo a un servicio de IA
    // para análisis (ej. contenido inapropiado, plagio, etc.).
    // El frontend no implementaría directamente la IA.
    console.log("Sistema de moderación con IA (conceptual) activo en backend.");

});
