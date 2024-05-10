// MySQL DB connection ---------------- 
const { Sequelize } = require('sequelize');
const mysql = require('mysql2');
const fs = require('fs');

const db_table = process.env.DB_TABLE;

const db_user = process.env.DB_USER //para mudar para mysql azure, descomentar
//const db_user = process.env.DB_LOCAL_USER; //para mudar para local, descomentar

const db_pass = process.env.DB_SECRET; //para mudar para mysql azure, descomentar
//const db_pass = process.env.DB_LOCAL_SECRET; //para mudar para local, descomentar

const cert_path = process.env.GV_DB_PATH; // for development
/// const cert_path = process.env.DB_CERT_PATH; // for production

const host = process.env.DB_HOST //para mudar para mysql azure, descomentar
//const host = process.env.DB_LOCAL_HOST //para mudar para local, descomentar

// Test Connection
mysql.createConnection(
    {
        host: host,
        user: db_user,
        password: db_pass,
        database: db_table,
        port: 3306,
        ssl: { ca: fs.readFileSync(cert_path) } // comentar esta linha se for usado a base de dados local.
    });

// Connect to MySQL DB
const connectionSQL = new Sequelize(db_table, db_user, db_pass, {
    host: host,
    dialect: 'mysql',
    dialectOptions: {
        ssl: { ca: fs.readFileSync(cert_path) } // comentar esta linha se for usado a base de dados local.
    },
    logging: console.log
});

console.log('MySQL Connection created on ' + host);

module.exports = connectionSQL;