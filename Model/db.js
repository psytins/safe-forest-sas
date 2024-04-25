// MySQL DB connection - (only used when a request to use the database is open)---------------- 
const { Sequelize } = require('sequelize');

const db_table = 'safeforest';
const db_user = 'root';
const db_pass = 'password'; // for the future the pwd can't be here

const host = '127.0.0.1';

// Connect to MySQL DB
const connectionSQL = new Sequelize(db_table, db_user, db_pass, {
    dialect: 'mysql',
    host: host,
});

console.log('MySQL Connection created on ' + host);

module.exports = connectionSQL;