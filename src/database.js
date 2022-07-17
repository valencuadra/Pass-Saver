const mysql = require("mysql2");
const { promisify } = require("util");

const { database } = require("./keys");

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
            console.error("CONECCIÓN A LA BASE DE DATOS PERDIDA");
        }
        if (err.code === "ER_CON_COUNT_ERROR") {
            console.error("SATURACIÓN DE CONECCIONES AL SERVIDOR");
        }
        if (err.code === "ECONNREFUSED") {
            console.error("CONECCIÓN A LA BASE DE DATOS NEGADA");
        }
    }

    if (connection) connection.release();
    console.log("Base de datos conectada exitosamente");
    return;
});

pool.query = promisify(pool.query);

module.exports = pool;