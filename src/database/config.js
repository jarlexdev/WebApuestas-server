const mysql = require('mysql');
const {promisify} = require('util');

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PSW,
    database: process.env.DB,
    multipleStatements: true
})


pool.getConnection((err, connection)=>{
    if(err){
        console.log(err);
    }
    if(connection){
        connection.release();
        console.log("Conectado a la Base de datos")
        return;
    }
})

pool.query = promisify(pool.query);

module.exports = pool;