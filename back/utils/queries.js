const queryEnviarDadosFormulario = `INSERT INTO materia (titulo, subtitulo, conteudo, imagem_url, categoria_id, isDestaque, nivelDestaque, data_publicacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
const queryGetMaterias = "SELECT * FROM materia ORDER BY data_publicacao DESC";
const querySelecionarMateriaPorId = "SELECT * FROM materia WHERE id = ? ";
const queryUpdateMateria = `UPDATE materia SET titulo = ?, subtitulo = ?, conteudo = ?, imagem_url = ?, isDestaque = ?, nivelDestaque = ?, categoria_id = ? WHERE id = ?`;
const queryDeletarMateria = "DELETE FROM materia WHERE id = ?";
const querySelecionarMateriaPorCategoria = 'SELECT * FROM materia WHERE categoria_id = ? ORDER BY data_publicacao DESC'
const querySelecionarTopico = "SELECT * FROM materia WHERE categoria_id = ? ORDER BY data_publicacao";
const querySelecionarMateriaPorTitulo = 'SELECT * FROM materia WHERE titulo = ?';
const querySelecionarRelacionados = 'Select * FROM materia WHERE categoria_id = ? ORDER BY data_publicacao DESC LIMIT 3'
module.exports = {
    queryEnviarDadosFormulario,
    queryGetMaterias,
    querySelecionarMateriaPorId,
    queryUpdateMateria,
    queryDeletarMateria,
    querySelecionarMateriaPorCategoria,
    querySelecionarTopico,
    querySelecionarMateriaPorTitulo,
    querySelecionarRelacionados
};
