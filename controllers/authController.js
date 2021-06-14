const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    // Si mi usuario y contraseña son correctos me lleva a esta url
    successRedirect: '/',
    // Si mi usuario y contraseña son incorrectos me lleva a esta url
    failureRedirect: '/iniciar-sesion', 
    failureFlash: true,
    badRequestMessage: 'Debes ingresar email y contraseña'
});

// Funcion para revisar si el usuario esta logeado
exports.usuarioAutenticado = (req,res,next) => {
    // Si el usuario esta autenticado, adelante
    if(req.isAuthenticated()){
        return next();
    }
    // Si el usuario no esta autenticado, redirigir al formulario
    return res.redirect('/iniciar-sesion');
}

// Funcion para cerrar sesion
exports.cerrarSesion = (req,res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion'); // Al cerrar sesion nos lleva al login
    });
}

// Genera un token si el usuario es válido
exports.enviarToken = async (req, res) => {
    // Verificar que el usuario existe
    const {email} = req.body;
    const usuario = await Usuarios.findOne({where: {email}});

    // Si no existe el usuario
    if(!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/reestablecer');
    }

    // Generar un token 
    usuario.token = crypto.randomBytes(20).toString('hex');
    
    // Generar la expiracion del token
    usuario.expiracion = Date.now()+3600000;

    // Guardarlos en la base de datos
    await usuario.save();

    // url reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

    // Enviar el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reestablecerPassword'
    });

    // terminar 
    req.flash('correcto', 'Se envió un mensaje a tu correo');
    res.redirect('/iniciar-sesion');

}

exports.validarToken = async (req,res) => {
    const usuario = await Usuarios.findOne({where: {
        token: req.params.token   
    }});

    // Si no encuentra el usuario
    if(!usuario){
        req.flash('error','No Válido');
        res.redirect('/reestablecer')
    }
   

    // Formulario para general el password
    res.render('resetPassword',{
        nombrePagina: 'Reestablecer contraseña'
    });
}

// cambiar la contraseña
exports.actualizarPassword = async (req,res) => {
    // Verifica el token valido y la fecha de expiracion
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    });

    // Si no hay usuario (pasó la fecha del token o el token este mal)
    if(!usuario){
        req.flash('error','No Válido');
        res.redirect('/reestablecer');
    }

    // Hashear la nueva contraseña
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

    usuario.token = null;
    usuario.expiracion = null;

    // guardamos nueva contraseña
    await usuario.save();

    req.flash('correcto', 'Tu contraseña se reestableció correctamente');
    res.redirect('/iniciar-sesion');

}   