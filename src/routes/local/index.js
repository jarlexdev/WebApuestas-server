const express = require("express");
const app = express();
const bd = require("../../database/config");

app.get("/", (req, res) => {
  const sql = "SELECT * FROM EquipoLocal";

  bd.query(sql, (error, resultado) => {
    if (error) {
      console.log(error, "Error al mostrar los datos");
      res.json({
        status: false,
        mensaje: error,
        alerta: "No se pudo  obtener la información",
      });
    }

    if (resultado) {
      res.json({
        status: true,
        mensaje: "Datos obtenidos",
        data: resultado
      });
    }
  });
});

app.post("/", (request, response) => {
  const { nombreEquipoLocal, representanteEquipoLocal } = request.body; 

  
  const sql = "INSERT INTO EquipoLocal SET ?";

  bd.query(sql,{nombreEquipoLocal, representanteEquipoLocal},
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
          mensaje: "Agregado correctamente",
          data: resultado
        });
      }
    }
  );
});

app.delete('/:id', (req, res) =>{
    const id =  req.params.id;
    const sql = "DELETE FROM EquipoLocal WHERE idEquipoLocal = ?"

    bd.query(sql, [id], (error, result) =>{
        if(error){
            res.json({
                status: false,
                mensaje: error,
                alerta:"No se pudo eliminar"
            })
        }

        if(result){
            res.json({
                status:true,
                mensaje:"Eliminado completamente",
                data: result
            })
        }

    })

})


//editar
app.put('/:id', (req,res) => {
    const id = req.params.id;
    const {nombreEquipoLocal, representanteEquipoLocal} = req.body;

    const sql = `UPDATE EquipoLocal SET nombreEquipoLocal = ?, representanteEquipoLocal = ? where idEquipoLocal = ${id} `
    
    bd.query(sql, [nombreEquipoLocal, representanteEquipoLocal], 
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