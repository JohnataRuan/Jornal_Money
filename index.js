const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = ['http://127.0.0.1:5500', 'https://jornalmoney.com'];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      return callback(new Error('CORS não permitido'), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options('*', cors()); // resposta para todas requisições OPTIONS

// 🔹 Importando as rotas corretamente
const rotaGet = require('./routes/rotaGet'); // Verifique se o arquivo existe!

app.use('/rotas', rotaGet);

const PORT = process.env.PORT || 3000; // 🔹 Tornando a porta configurável via .env
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
