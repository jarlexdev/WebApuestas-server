const express = require("express");
const app = express();
const bd = require("../../database/config");

app.get("/", (req, res) => {
  const sql = "SELECT * FROM Partido";

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
  const {fechaPartido, marcadorLocal, marcadorVisitante, idEquipoVisitante, idEquipoLocal } = request.body; 

  
  const sql = "INSERT INTO Partido SET ?";

  bd.query(sql,{fechaPartido, marcadorLocal, marcadorVisitante, idEquipoVisitante, idEquipoLocal},
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

app.delete("/:id", (req, res) => {
  const id = req.params.id;

  // Verificar si el partido está en la tabla finalizado
  const checkFinalizadoSql = "SELECT COUNT(*) as count FROM Finalizacion WHERE idPartido = ?";
  bd.query(checkFinalizadoSql, [id], (error, result) => {
    if (error) {
      return res.json({
        status: false,
        mensaje: error,
        alerta: "Error al verificar si el partido está finalizado",
      });
    }

    if (result[0].count > 0) {
      return res.json({
        status: false,
        mensaje: "No se puede eliminar el partido porque está finalizado",
        alerta: "Eliminación no permitida",
      });
    }

    // Eliminar apuestas asociadas
    const deleteApuestasSql = "DELETE FROM Apuestas WHERE idPartido = ?";
    bd.query(deleteApuestasSql, [id], (error, result) => {
      if (error) {
        return res.json({
          status: false,
          mensaje: error,
          alerta: "Error al eliminar apuestas asociadas",
        });
      }

      // Eliminar el partido
      const deletePartidoSql = "DELETE FROM Partido WHERE idPartido = ?";
      bd.query(deletePartidoSql, [id], (error, result) => {
        if (error) {
          return res.json({
            status: false,
            mensaje: error,
            alerta: "No se pudo eliminar el partido",
          });
        }

        res.json({
          status: true,
          mensaje: "Partido y apuestas asociadas eliminados correctamente",
          data: result,
        });
      });
    });
  });
});

module.exports = app;



//editar
app.put('/:id', (req,res) => {
    const id = req.params.id;
    const {fechaPartido, marcadorLocal, marcadorVisitante, idEquipoVisitante, idEquipoLocal} = req.body;

    const sql = `UPDATE Partido SET fechaPartido = ?, marcadorLocal = ?, marcadorVisitante = ?, idEquipoVisitante = ?, idEquipoLocal = ?  where idPartido = ${id} `
    
    bd.query(sql, [fechaPartido, marcadorLocal, marcadorVisitante, idEquipoVisitante, idEquipoLocal], 
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


app.get("/partido/:id", (req, res) => {
  const id = req.params.id;
  const sql = `
    SELECT 
      p.*, 
      el.nombreEquipoLocal,
      el.representanteEquipoLocal,
      el.fechaFundacionLocal,
      ev.nombreEquipoVisitante,
      ev.representanteEquipoVisitante,
      ev.fechaFundacionVisitante
    FROM 
      Partido p
    LEFT JOIN 
      Equipolocal el ON p.idEquipoLocal = el.idEquipoLocal
    LEFT JOIN 
      Equipovisitante ev ON p.idEquipoVisitante = ev.idEquipoVisitante
    WHERE 
      p.idPartido = ?`;

  bd.query(sql, [id], (error, resultado) => {
    if (error) {
      console.log(error, "Error al obtener los datos del partido");
      res.json({
        status: false,
        mensaje: error,
        alerta: "No se pudo obtener la información",
      });
    }

    if (resultado.length > 0) {
      res.json({
        status: true,
        mensaje: "Datos del partido obtenidos",
        data: resultado[0]
      });
    } else {
      res.status(404).json({
        status: false,
        mensaje: "No se encontró el partido",
      });
    }
  });
});

module.exports = app;