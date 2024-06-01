const express = require("express");
const app = express();
const cors = require('cors');
const pool = require('../database/config.js'); 

app.get('/',(re,res)=>{
  res.send("Hola mundo ")
})
app.get("/", (req, res) => {
    res.json({
      nombre: "Rodrigo Fernandez",
      correo: "rodrigo.fernandez@gmail.com",
      telefono: "70636535",
    });

  })

.use(cors()) 
.use("/roles", require("./roles/index.js"))
.use("/users", require("./usuarios/index.js"))
.use("/estado", require("./estados/index.js"))
.use("/visitante", require("./visitante/index.js"))
.use("/local", require("./local/index.js"))
.use("/partido", require("./partido/index.js"))
.use("/apuesta", require("./apuesta/index.js"))
.use("/finalizacion", require("./finalizacion/index.js"))
  
//.use('/Persona', require('./Personas/index'))



module.exports = app;