const express = require("express");
const app = express();
const bd = require("../../database/config");

app.use(express.json()); // Asegúrate de poder manejar JSON en el cuerpo de las solicitudes

// Mostrar todos los registros de la tabla finalizacion
app.get("/", (req, res) => {
  const sql = "SELECT * FROM Finalizacion";

  bd.query(sql, (error, resultado) => {
    if (error) {
      console.log(error, "Error al mostrar los datos");
      res.json({
        status: false,
        mensaje: error,
        alerta: "No se pudo obtener la información",
      });
    }

    if (resultado) {
      res.json({
        status: true,
        mensaje: "Datos obtenidos",
        data: resultado,
      });
    }
  });
});

// Insertar un nuevo registro en la tabla finalizacion
app.post("/", (request, response) => {
  const { idPartido, fechaFinalizacion, marcadorVisitanteFinal, marcadorLocalFinal } = request.body;

  const sql = "INSERT INTO Finalizacion SET ?";

  bd.query(
    sql,
    { idPartido, fechaFinalizacion, marcadorVisitanteFinal, marcadorLocalFinal },
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
          data: resultado,
        });
      }
    }
  );
});

// Eliminar un registro de la tabla finalizacion
app.delete("/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM Finalizacion WHERE idFinalizacion = ?";

  bd.query(sql, [id], (error, result) => {
    if (error) {
      res.json({
        status: false,
        mensaje: error,
        alerta: "No se pudo eliminar",
      });
    }

    if (result) {
      res.json({
        status: true,
        mensaje: "Eliminado completamente",
        data: result,
      });
    }
  });
});

// Editar un registro de la tabla finalizacion
app.put("/:id", (req, res) => {
  const id = req.params.id;
  const { idPartido, fechaFinalizacion, marcadorVisitanteFinal, marcadorLocalFinal } = req.body;

  const sql = `UPDATE Finalizacion SET idPartido = ?, fechaFinalizacion = ?, marcadorVisitanteFinal = ?, marcadorLocalFinal = ? WHERE idFinalizacion = ${id}`;

  bd.query(
    sql,
    [idPartido, fechaFinalizacion, marcadorVisitanteFinal, marcadorLocalFinal],
    (error, result) => {
      if (error) {
        res.json({
          status: false,
          mensaje: error,
          alerta: "No se modificaron los datos",
        });
      }
      if (result) {
        res.json({
          status: true,
          mensaje: "Datos modificados",
          data: result,
        });
      }
    }
  );
});

module.exports = app;
