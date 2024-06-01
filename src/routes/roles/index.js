const express = require("express");
const app = express();
const bd = require("../../database/config");

//consultando roles
app.get("/", (req, res) => {
  //agregamos la consulta
  const sql = "SELECT * FROM Roles";
  //ponemos en ejecucion la consulta
  bd.query(sql, (error, resultado) => {
    if (error) {
      console.log(error, "Error al mostrar los datos");
      //retornamos el error como JSON
      res.json({
        status: false,
        mensaje: error,
        alerta: "No se pudo  obtener la información",
      });
    }

    if (resultado) {
      //Retornamos el resultado como JSON
      res.json({
        status: true,
        mensaje: "Datos obtenidos",
        data: resultado
      });
    }
  });
});



//agregar
app.post("/", (request, response) => {
  const { tipoRol } = request.body; //hacemos uso del request body para escribir en el  cuerpo de la peticion
  //creamos una variable que contendra la consulta a realizar
  const sql = "INSERT INTO Roles SET ?";

  bd.query(sql,{tipoRol}, //usamos en { }  para pasar las variables del request.body
    (error, resultado) => {
      if (error) {
        response.json({
          status: false,
          mensaje: error,
          alerta: "Error al insertar",
        });
      }
      if (resultado) {
        response.json({
          status: true,
          mensaje: "Rol agregado correctamente",
          data: resultado
        });
      }
    }
  );
});

app.delete('/:id', (req, res) =>{
    const id =  req.params.id;
    const sql = "DELETE FROM Roles WHERE idRol = ?"

    bd.query(sql, [id], (error, result) =>{
        if(error){
            res.json({
                status: false,
                mensaje: error,
                alerta:"No se pudo eliminar el rol"
            })
        }

        if(result){
            res.json({
                status:true,
                mensaje:"Rol eliminado completamente",
                data: result
            })
        }

    })

})


//editar
app.put('/:id', (req,res) => {
    const id = req.params.id;
    const {tipoRol} = req.body;

    const sql = `UPDATE Roles SET tipoRol = ?  where idRol = ${id} `
    
    bd.query(sql, [tipoRol], 
        (error, result) =>{
            if(error){
                res.json({
                    status: false,
                    mensaje: error,
                    alerta: "No se modificaron los datos"
                })
            }
            if(result){
                res.json({
                    status: true,
                    mensaje: "Datos modificados",
                    data: result
                })
            }

        })


})

module.exports = app;