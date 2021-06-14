// Taremos el servidor de express
const express = require('express');
// Importar el otro index
const routes = require('./routes');
// Leer la carpeta views
const path = require('path');
// Leer BodyParser
const bodyParser = require('body-parser');
// Importar flash
const flash = require('connect-flash');

const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
// Importar las variables
require('dotenv').config({path: 'variables.env'});


// Hellpers con algunas funciones
const helpers = require('./helpers');


// Crear la conexion a la BD
const db = require('./config/db');

// Importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(() => console.log('conectado al servidor'))
    .catch(error => console.log(error));


// Crear una aplicacion de express
const app = express();

// Donde cargar los archivos estaticos
app.use(express.static('public'));

// Habilitar pug
app.set('view engine', 'pug');

// Habilitar bodyparser para leer datos del formulario
app.use(bodyParser.urlencoded({extended: true}));

// Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

// Agregar flash massages
app.use(flash());

app.use(cookieParser());

// Mantener autenticada la sesion
app.use(session({
    secret: 'El secreto de caro',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Pasar var dump a la app (Middleware)
app.use((req,res,next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    // Si no usamos next no pasamos al siguiente middleware
    next();
});



app.use('/',routes());

// Servidor y puerto
const host = process.env.HOST || '0.0.0'; 
const port = process.env.PORT || 3000; 

app.listen(port,host, () => {
    console.log('El servidor esta funcionando');
});
// Luego vamos a package.json


