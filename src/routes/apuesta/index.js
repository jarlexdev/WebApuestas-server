const express = require("express");
const app = express();
const bd = require("../../database/config");

app.get("/", (req, res) => {
  const sql = "SELECT * FROM Apuestas";

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
  const {idUsuario,CantidadApostada,idEstadoApuesta,idPartido, prediccionEquipoVisitante, prediccionEquipoLocal} = request.body; 

  
  const sql = "INSERT INTO Apuestas SET ?";

  bd.query(sql,{idUsuario,CantidadApostada,idEstadoApuesta,idPartido, prediccionEquipoVisitante, prediccionEquipoLocal},
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
    const sql = "DELETE FROM Apuestas WHERE idApuestas = ?"

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
    const {idUsuario,CantidadApostada,fechaApuesta,idEstadoApuesta,idPartido} = req.body;

    const sql = `UPDATE Apuestas SET idUsuario = ?, CantidadApostada = ?, idEstadoApuesta = ?, idPartido = ?  where idApuestas = ${id} `
    
    bd.query(sql, [idUsuario,CantidadApostada,idEstadoApuesta,idPartido ], 
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

app.get('/usuario/:idUsuario', (req, res) => {
  const idUsuario = req.params.idUsuario;
  const sql = `
    SELECT 
  a.*, 
  CASE 
    WHEN f.idPartido IS NOT NULL THEN f.idFinalizacion 
    ELSE NULL 
  END AS idFinalizacion,
  CASE 
    WHEN f.idPartido IS NOT NULL THEN f.marcadorVisitanteFinal 
    ELSE NULL 
  END AS marcadorVisitanteFinal,
  CASE 
    WHEN f.idPartido IS NOT NULL THEN f.marcadorLocalFinal 
    ELSE NULL 
  END AS marcadorLocalFinal
FROM 
  Apuestas a
LEFT JOIN 
  finalizacion f ON a.idPartido = f.idPartido
WHERE 
  a.idUsuario = ?;`;

  bd.query(sql, [idUsuario], (error, resultado) => {
    if (error) {
      console.log(error, "Error al obtener las apuestas del usuario");
      return res.status(500).json({
        status: false,
        mensaje: "Error interno del servidor",
      });
    }

    if (resultado.length > 0) {
      res.json({
        status: true,
        mensaje: "Apuestas del usuario obtenidas",
        data: resultado
      });
    } else {
      res.status(404).json({
        status: false,
        mensaje: "No se encontraron apuestas para este usuario",
      });
    }
  });
});





module.exports = app;