const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');



dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 Servir arquivos estáticos do FRONT
app.use(express.static(
  path.join(__dirname, '../Jornal_Money_FRONT')
));

const allowedOrigins = [
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'http://localhost:3000',
  'https://jornalmoney.com',
  'https://curriculo.jornalmoney.com',
  'http://curriculo.jornalmoney.com'
];

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
const materiaRoutes = require('./routes/materia.js');

app.use('/', materiaRoutes);
app.use(express.static('public'));

app.use('/rotas', rotaGet);

const PORT = process.env.PORT || 3000; // 🔹 Tornando a porta configurável via .env
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
