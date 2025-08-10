// Importa ou cria a função para gerar slug (mesma usada no frontend)
function gerarSlug(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// Função para garantir slug único (exemplo adaptado da sua função de POST)
function verificarSlugUnico(connection, slugBase, contador = 0) {
  return new Promise((resolve, reject) => {
    let slugParaVerificar = contador === 0 ? slugBase : `${slugBase}-${contador}`;
    const query = 'SELECT COUNT(*) AS count FROM materia WHERE slug = ?';
    connection.query(query, [slugParaVerificar], (erro, resultados) => {
      if (erro) return reject(erro);
      if (resultados[0].count > 0) {
        resolve(verificarSlugUnico(connection, slugBase, contador + 1));
      } else {
        resolve(slugParaVerificar);
      }
    });
  });
}

module.exports = {gerarSlug,verificarSlugUnico};