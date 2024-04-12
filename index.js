//const express = require('express'); -->CommonJS
import express from 'express'; // --> modificar el package.json --> "type" : "module",
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import propertiesRoutes from './routes/propertiesRoutes.js';
import appRoutes from './routes/appRoutes.js';
import apiRoutes from './routes/apiRoutes.js'
import db from './config/db.js';


//crear la app
const app = express();

//habilitar lectura de datos de formulario
app.use(express.urlencoded({extended:true}))

//habilitar cookie-parser
app.use( cookieParser() );

//habilitar CSRF
app.use( csrf({cookie:true}));

//conection to database
try{
    await db.authenticate();
    
    //crea tabla
    db.sync();

    console.log('correct conection with database');
} catch (error) {
    console.log(error);
}

//habilitar pug
app.set('view engine', 'pug')
app.set('views', './views')

//Carpeta publica (archivos estaticos --> CSS)
app.use( express.static('public'))

//routing
app.use('/', appRoutes);
app.use('/auth', userRoutes);
app.use('/', propertiesRoutes);
app.use('/api', apiRoutes)

//validate 
app.use('*', (req, res) => {
    res.redirect('/404')
} )

//Definir un puerto
const port = process.env.PORT || 3000;
app.listen(port, ()=> [
    console.log(`Server is working in port number ${port}`)
]);