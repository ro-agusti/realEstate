//const express = require('express'); -->CommonJS
import express from 'express'; // --> modificar el package.json --> "type" : "module",
import userRoutes from './routes/userRoutes.js';
import db from './config/db.js';

//crear la app
const app = express();

//habilitar lectura de datos de formulario
app.use(express.urlencoded({extended:true}))

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
app.use('/auth', userRoutes);

//Definir un puerto
const port = 3000;
app.listen(port, ()=> [
    console.log(`Server is working in port number ${port}`)
]);