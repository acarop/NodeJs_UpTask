const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

// Referencia al modelo donde vamos a autenticar
const Usuarios = require('../models/Usuarios');

// Local strategy - Login con credenciales propios (usuarios y password) 
passport.use(
    new localStrategy(
        // por default passport espera un usuario y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email,password,done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email,
                        activo: 1
                    }
                });
                // Usuario correcto y password incorrecto
                if(!usuario.verificarPassword(password)){
                    return done(null,false,{
                        message: 'Contraseña incorrecta'
                    });
                }
                // Email existe y password correcta
                return done(null,usuario);
            } catch (error) {
                // El usuario no existe
                return done(null,false,{
                    message: 'El email no está registrado'
                });
            }
        }
    )
);

// Serializar el usuario
passport.serializeUser((usuario,callback) => {
    callback(null,usuario);
});

// Deserializar el usuario
passport.deserializeUser((usuario,callback) => {
    callback(null,usuario);
});

// Exportar
module.exports = passport;