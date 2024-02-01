//const express = require('express'); -->CommonJS
import express from 'express'; // --> modificar el package.json --> "type" : "module",
import userRoutes from './routes/userRoutes.js';

//crear la app
const app = express();

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