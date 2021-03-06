const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('../models/Proyectos');
const bcrypt = require('bcrypt-nodejs');

const Usuarios = db.define('usuarios', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(60),
        // el campo no puede estar vacío
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Debes ingresar un correo válido'
            },
            notEmpty: {
                msg: 'Debes ingresar un correo'
            }       
        },
        unique: {
            args: true,
            msg: 'Usuario ya registrado'
        }
    },
    password: { 
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Debes ingresar una contraseña'
            }
        }
    },
    activo: {
        type: Sequelize.INTEGER,
        defaultValue: 0 
    },
    token: Sequelize.STRING,
    expiracion: Sequelize.DATE
}, {
    // Antes de que se inserte en la bd
    hooks: {
        beforeCreate(usuario) {
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
        }
    }
});

// Métodos personalizados
Usuarios.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

// Un usuario puede crear muchos proyectos
Usuarios.hasMany(Proyectos);

module.exports = Usuarios;