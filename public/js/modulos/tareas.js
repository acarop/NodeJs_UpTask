import axios from "axios";
import Swal from 'sweetalert2';
import {actualizarAvance} from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if(tareas){

    tareas.addEventListener('click', e => {
        if(e.target.classList.contains('fa-check-circle')){
            const icono = e.target;
            const tareaId = icono.parentElement.parentElement.dataset.tarea;

            // req hacia /tareas/:id
            const url = `${location.origin}/tareas/${tareaId}`;

            axios.patch(url,{tareaId})
                .then(function(respuesta){
                    if(respuesta.status === 200){
                        icono.classList.toggle('completo');
                        actualizarAvance();
                    }
                });
        }
        if(e.target.classList.contains('fa-trash')){
            const tareaHTML = e.target.parentElement.parentElement,
                  tareaId = tareaHTML.dataset.tarea;

                  Swal.fire({
                    title: 'Deseas borrar esta tarea?',
                    text: "Una tarea eliminada no se puede recuperar!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, borrar!',
                    cancelButtonText: 'No, Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        const url = `${location.origin}/tareas/${tareaId}`;
                        // Enviar el delete por medio de axios (delete requiere params)
                        axios.delete(url, {params: {tareaId}})
                            .then(function(respuesta){
                                if(respuesta.status === 200)
                                // Eliminar nodo
                                tareaHTML.parentElement.removeChild(tareaHTML);

                                // Alerta
                                Swal.fire(
                                    'Tarea Eliminada',
                                    respuesta.data,
                                    'success'
                                )
                                actualizarAvance();
                            });

                        
                    }
               });

            
        }
    })
}

export default tareas;