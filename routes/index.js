// Express route
// Taremos el servidor de express
const express = require('express');
const router = express.Router();

// Importar express-validator
const {body} = require('express-validator');

// Importar el controlador
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');


module.exports = function(){
    // Ruta para el home
    router.get('/', 
        authController.usuarioAutenticado, 
        proyectosController.proyectosHome
    );
    router.get('/nuevo-proyecto', 
        authController.usuarioAutenticado, 
        proyectosController.formularioProyecto
    );
    
    // Crear proyecto
    router.post('/nuevo-proyecto', 
        authController.usuarioAutenticado, 
        body('nombre').not().isEmpty().trim().escape(), 
        proyectosController.nuevoProyecto
    );
    // Listar proyecto
    router.get('/proyectos/:url', 
        authController.usuarioAutenticado, 
        proyectosController.proyectoPorUrl
    );
    // Actualizar el proyecto
    router.get('/proyectos/editar/:id', 
        authController.usuarioAutenticado, 
        proyectosController.formularioEditar
    );
    router.post('/nuevo-proyecto/:id', 
        authController.usuarioAutenticado, 
        body('nombre').not().isEmpty().trim().escape(), 
        proyectosController.actualizarProyecto
    );
    // Eliminar proyecto
    router.delete('/proyectos/:url',
        authController.usuarioAutenticado, 
        proyectosController.eliminarProyecto
    );

    // Tareas
    router.post('/proyectos/:url',
        authController.usuarioAutenticado, 
        tareasController.agregarTarea
    );
    // Actualizar tarea
    // patch solo cambia una parte del objeto mientras que update reescribe totalmemnte el registro
    router.patch('/tareas/:id', 
        authController.usuarioAutenticado, 
        tareasController.cambiarEstadoTarea
    );
    // Eliminar tarea
    router.delete('/tareas/:id', 
        authController.usuarioAutenticado, 
        tareasController.eliminarTarea
    );

    // Crear nueva cuenta
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCuenta);
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta);

    // Iniciar sesion
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    // Cerrar sesion
    router.get('/cerrar-sesion', authController.cerrarSesion);

    // Reestablecer contraseña
    router.get('/reestablecer', usuariosController.formReestablecerPassword);
    router.post('/reestablecer', authController.enviarToken);
    router.get('/reestablecer/:token' , authController.validarToken);
    router.post('/reestablecer/:token', authController.actualizarPassword);

    return router;
}

