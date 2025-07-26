const jwt = require ('jsonwebtoken');

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  // Token vem assim: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.DB_SECRET);
    req.usuario = decoded;
    next(); // ✅ Token válido → continua para a rota
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido ou expirado' });
  }
}

module.exports = verificarToken;