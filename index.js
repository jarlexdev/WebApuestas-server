require('dotenv').config()  //variable para traer el puerto .env
const express = require('express'); //declaramos el uso de expres
const app = express(); //haciendo uso de Express

const bodyparser = require('body-parser')
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}))

//Ajustes de conexion de base de datos
require('./src/database/config')



app.set('port', process.env.PORT || 8021) //escuchamos el puerto declarado
app.listen(app.get('port'), () =>{
    console.log("Puerto en uso ->", app.get('port'))
    console.log('Ejecutando') //comprobacion de que el puerto funciona

})

//la URL para la api

app.use('/Apuestas',require('./src/routes/index'))
