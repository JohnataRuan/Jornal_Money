require('dotenv').config();
const mysql = require('mysql');

let connection;

function handleDisconnect() {
    connection = mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    connection.connect(err => {
        if (err) {
            console.error('Erro ao conectar no banco:', err);
            setTimeout(handleDisconnect, 2000);
        } else {
            console.log('Banco de Dados Conectado com sucesso!');
        }
    });

    connection.on('error', err => {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('Reconectando ao banco...');
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();

// ✅ AGORA SIM: exporta uma FUNÇÃO
function getConnection() {
    return connection;
}

module.exports = getConnection;
