const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Habilitar CORS apenas para a origem específica
app.use(cors({ origin: ['http://127.0.0.1:5500','https://jornalmoney.com'] }));

// 🔹 Importando as rotas corretamente
const rotaGet = require('./routes/rotaGet'); // Verifique se o arquivo existe!

app.use('/rotas', rotaGet);

const PORT = process.env.PORT || 3000; // 🔹 Tornando a porta configurável via .env
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
