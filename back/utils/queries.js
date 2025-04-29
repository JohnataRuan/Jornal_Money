const queryEnviarDadosFormulario = 'INSERT INTO materia (titulo, subtitulo, conteudo, imagem_url, categoria_id, data_publicacao) VALUES (?, ?, ?, ?, ?, ?)';
const queryGetMaterias = "SELECT * FROM materia";
const querySelecionarMateriaPorId = "SELECT * FROM materia WHERE id = ?";
const queryUpdateMateria = "UPDATE materia SET titulo = ?, subtitulo = ?, conteudo = ?, imagem_url = ?, categoria_id = ? WHERE id = ?";
const queryDeletarMateria = "DELETE FROM materia WHERE id = ?";
const querySelecionarMateriaPorCategoria = 'SELECT * FROM materia WHERE categoria_id = ? ORDER BY data_publicacao DESC LIMIT 4'
module.exports = {
    queryEnviarDadosFormulario,
    queryGetMaterias,
    querySelecionarMateriaPorId,
    queryUpdateMateria,
    queryDeletarMateria,
    querySelecionarMateriaPorCategoria
};
