const queryEnviarDadosFormulario = `INSERT INTO materia (titulo, subtitulo, conteudo, imagem_url, categoria_id, isDestaque, nivelDestaque, data_publicacao, slug) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
const queryGetMaterias = "SELECT * FROM materia ORDER BY data_publicacao DESC";
const querySelecionarMateriaPorId = "SELECT * FROM materia WHERE id = ?";
const queryUpdateMateria = `UPDATE materia SET titulo = ?, subtitulo = ?, conteudo = ?, imagem_url = ?, isDestaque = ?, nivelDestaque = ?, categoria_id = ?, slug = ? WHERE id = ?`
const queryDeletarMateria = "DELETE FROM materia WHERE id = ?";
const querySelecionarMateriaPorCategoria = 'SELECT * FROM materia WHERE categoria_id = ? ORDER BY data_publicacao DESC'
const querySelecionarTopico = "SELECT * FROM materia WHERE categoria_id = ? ORDER BY data_publicacao";
const querySelecionarMateriaPorTitulo = "SELECT * FROM materia WHERE id = ?";
const querySelecionarRelacionados = 'Select * FROM materia WHERE categoria_id = ? ORDER BY data_publicacao DESC LIMIT 3'
const queryRealizarLogin = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';
const querySelecionarMateriaPrincipal = 'SELECT * FROM materia WHERE nivelDestaque = 1 and isDestaque = 1 ORDER BY data_publicacao DESC LIMIT 1';
const querySelecionarMateriaSecundarias = 'SELECT * FROM materia WHERE nivelDestaque = 2 and isDestaque = 1 ORDER BY data_publicacao DESC LIMIT 3';
const querySelecionarMateriaPrincipalTopicos = 'SELECT * FROM materia WHERE categoria_id = ? and nivelDestaque = 1  ORDER BY data_publicacao DESC LIMIT 1';
const querySelecionarMateriaSecundariaTopicos = 'SELECT * FROM materia WHERE categoria_id = ? and nivelDestaque = 2  ORDER BY data_publicacao DESC LIMIT 2';
const querySlug = 'SELECT COUNT(*) AS count FROM materia WHERE slug = ?';
const queryVerificarSlug = 'SELECT slug FROM materia WHERE id = ?';
const querySelecioPeloCategoriaID = 'SELECT * FROM materia WHERE categoria_id = ?';
const querySelecionarMateriaPorSlug = 'SELECT * FROM materia WHERE slug = ?';

module.exports = {
    queryEnviarDadosFormulario,
    queryGetMaterias,
    querySelecionarMateriaPorId,
    queryUpdateMateria,
    queryDeletarMateria,
    querySelecionarMateriaPorCategoria,
    querySelecionarTopico,
    querySelecionarMateriaPorTitulo,
    querySelecionarRelacionados,
    queryRealizarLogin,
    querySelecionarMateriaPrincipal,
    querySelecionarMateriaPrincipalTopicos,
    querySelecionarMateriaSecundarias,
    querySelecionarMateriaSecundariaTopicos,
    querySlug,
    queryVerificarSlug,
    querySelecioPeloCategoriaID,
    querySelecionarMateriaPorSlug
};
