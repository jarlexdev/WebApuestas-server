const express = require("express");
const session = require("express-session");
const app = express();
const bd = require("../../database/config");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'e29df4c1d8db2b4bb394c40fec1c72b407865edb9e4a0de93efcf19a514ec1de7bd1aec959d8a9e4ece7d999cb3c105d9d410449d5e2e0882cbe596171d4ad19',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

app.post("/login", (req, res) => {
  const { userName, clave } = req.body;

  const sql = "SELECT * FROM Usuarios WHERE userName = ? AND clave = ?";
  bd.query(sql, [userName, clave], (error, resultado) => {
    if (error) {
      console.log(error, "Error al buscar el usuario");
      return res.status(500).json({
        status: false,
        mensaje: "Error interno del servidor",
      });
    }

    if (resultado.length > 0) {
      // Las credenciales son correctas
      req.session.user = resultado[0];
      res.json({
        status: true,
        mensaje: "Inicio de sesión exitoso",
        user: resultado[0]
      });
    } else {
      // Las credenciales son incorrectas
      res.status(401).json({
        status: false,
        mensaje: "Credenciales inválidas",
      });
    }
  });
});


app.get("/", (req, res) => {
  const sql = "SELECT * FROM Usuarios";

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
  const { nombreUsuario, apellidoUsuario, dui, email, userName, clave, idRol } = request.body; 

  
  const sql = "INSERT INTO Usuarios SET ?";

  bd.query(sql,{nombreUsuario, apellidoUsuario, dui, email, userName, clave , idRol},
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
    const sql = "DELETE FROM Usuarios WHERE idUsuario = ?"

    bd.query(sql, [id], (error, result) =>{
        if(error){
            res.json({
                status: false,
                mensaje: error,
                alerta:"No se pudo eliminar el usuario"
            })
        }

        if(result){
            res.json({
                status:true,
                mensaje:"Usuario eliminado completamente",
                data: result
            })
        }

    })

})


//editar
app.put('/:id', (req,res) => {
    const id = req.params.id;
    const {nombreUsuario, apellidoUsuario, dui, email, userName, clave, idRol} = req.body;

    const sql = `UPDATE Usuarios SET nombreUsuario = ?, apellidoUsuario = ?, dui = ?, email = ?, userName = ?, clave = MD5(?), idRol = ? where idUsuario = ${id} `
    
    bd.query(sql, [nombreUsuario, apellidoUsuario, dui, email, userName, clave, idRol], 
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

app.get('/usuario/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM Usuarios WHERE idUsuario = ?";

    bd.query(sql, [id], (error, result) => {
        if (error) {
            res.json({
                status: false,
                mensaje: error,
                alerta: "No se pudo obtener el usuario"
            });
        }

        if (result.length > 0) {
            res.json({
                status: true,
                mensaje: "Usuario encontrado",
                data: result[0]
            });
        } else {
            res.json({
                status: false,
                mensaje: "Usuario no encontrado"
            });
        }
    });
});


module.exports = app;