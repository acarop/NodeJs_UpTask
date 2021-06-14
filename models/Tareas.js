const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('./Proyectos');

const Tareas = db.define('tareas', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    tarea: Sequelize.STRING(100),
    estado: Sequelize.INTEGER(1)
});
// belongsTo-> Relacionar una tarea con un proyecto (Un proyecto puede tener muchas tareas)
Tareas.belongsTo(Proyectos);

module.exports = Tareas;