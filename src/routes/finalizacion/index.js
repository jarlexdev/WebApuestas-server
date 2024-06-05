const express = require("express");
const app = express();
const bd = require("../../database/config");

app.use(express.json()); // Asegúrate de poder manejar JSON en el cuerpo de las solicitudes

// Función para formatear fecha a MySQL
function formatDateToMySQL(date) {
  return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
}

// Mostrar todos los registros de la tabla finalizacion
app.get("/", (req, res) => {
  const sql = "SELECT * FROM finalizacion";

  bd.query(sql, (error, resultado) => {
    if (error) {
      console.log(error, "Error al mostrar los datos");
      res.json({
        status: false,
        mensaje: error,
        alerta: "No se pudo obtener la información",
      });
    } else {
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
  let { idPartido, fechaFinalizacion, marcadorVisitanteFinal, marcadorLocalFinal } = request.body;

  // Formatear la fecha
  fechaFinalizacion = formatDateToMySQL(fechaFinalizacion);

  const sql = "INSERT INTO finalizacion SET ?";

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
      } else {
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
  const sql = "DELETE FROM finalizacion WHERE idFinalizacion = ?";

  bd.query(sql, [id], (error, result) => {
    if (error) {
      res.json({
        status: false,
        mensaje: error,
        alerta: "No se pudo eliminar",
      });
    } else {
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
  let { idPartido, fechaFinalizacion, marcadorVisitanteFinal, marcadorLocalFinal } = req.body;

  // Formatear la fecha
  fechaFinalizacion = formatDateToMySQL(fechaFinalizacion);

  const sql = `UPDATE finalizacion SET idPartido = ?, fechaFinalizacion = ?, marcadorVisitanteFinal = ?, marcadorLocalFinal = ? WHERE idFinalizacion = ${id}`;

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
      } else {
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
