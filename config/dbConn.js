const mysql = require('mysql'),
    util = require('util');

const { db_host, db_user, db_password, db_port, db_database } = require("./creds");

const config = {
    host: db_host,
    user: db_user,
    password: db_password,
    port: db_port,
    database: db_database,
    multipleStatements: true
};

makeDb = (config) => {
    const connection = mysql.createConnection(config);
    return {
        query(sql, args) {
            return util.promisify(connection.query)
                .call(connection, sql, args);
        },
        close() {
            return util.promisify(connection.end).call(connection);
        }
    };
}

module.exports = makeDb(config);