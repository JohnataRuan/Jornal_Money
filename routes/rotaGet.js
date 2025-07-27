const getConnection = require("../database/connection");
const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const router = express.Router();
const verificarToken = require('../utils/validarToken');
const {
    queryEnviarDadosFormulario,
    queryGetMaterias,
    querySelecionarMateriaPorId,
    queryUpdateMateria,
    queryDeletarMateria,
    querySelecionarMateriaPorCategoria,
    querySelecionarTopico,
    querySelecionarMateriaPorTitulo,
    querySelecionarRelacionados,
    queryRealizarLogin
} = require('../utils/queries');


// LOGIN
router.post('/login', (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    const connection = getConnection();
     // Assumindo a tabela 'usuarios'

    connection.query(queryRealizarLogin, [email, senha], (err, result) => {
        if (err) {
            console.error("Erro no banco:", err);
            return res.status(500).json({ message: 'Erro interno no servidor' });
        }

        if (result.length === 0) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        const usuario = result[0];

        // Gera o token com dados básicos do usuário
       const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            process.env.DB_SECRET, // Correto
            { expiresIn: '1h' }
        );
        console.log("Token gerado:", token);
        res.status(200).json({ token });
    });
});
// 🔹 Rota para adicionar uma nova matéria
router.post('/post', verificarToken, (req, res) => {
    const { titulo, subtitulo, conteudo, imagem_url, categoria, isDestaque, nivelDestaque } = req.body;
    const dataHora = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const connection = getConnection();

    if (!titulo || !subtitulo || !conteudo || !imagem_url || !categoria || !isDestaque || !nivelDestaque) {
        return res.status(400).json({ error: "Preencha todos os campos!" });
    }

    const valores = [titulo, subtitulo, conteudo, imagem_url, categoria, isDestaque, nivelDestaque, dataHora];

    connection.query(queryEnviarDadosFormulario, valores, (erro, resultado) => {
        if (erro) {
            console.error("Erro ao inserir no banco:", erro);
            return res.status(500).json({ error: "Erro interno no servidor" });
        }

        res.status(201).json({ message: "Matéria inserida com sucesso!", id: resultado.insertId });
    });
});

// 🔹 Rota para listar todas as matérias
router.get("/todasMaterias", (req, res) => {
    const connection = getConnection();
    connection.query(queryGetMaterias, (err, result) => {
        if (err) {
            console.error("Erro ao buscar matérias:", err);
            return res.status(500).json({ error: "Erro ao buscar matérias" });
        }
        res.json(result);
    });
});

router.get("/materias/:id", (req, res) => {
    console.log("ID recebido:", req.params.id);
    const connection = getConnection();

    if (!req.params.id) {
        return res.status(400).json({ error: "ID da matéria não fornecido" });
    }

    connection.query(querySelecionarMateriaPorId, [req.params.id], (err, result) => {
        if (err) {
            console.error("Erro ao buscar matéria:", err);
            return res.status(500).json({ error: "Erro ao buscar matéria" });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "Matéria não encontrada" });
        }
        res.json(result[0]);
    });
});
// 🔹 Rota para atualizar uma matéria
router.put("/materia/:id", verificarToken, (req, res) => {
    const { titulo, subtitulo, conteudo, imagem_url, isDestaque, nivelDestaque, categoria_id } = req.body;
    const connection = getConnection();

    const destaque = (isDestaque === true || isDestaque === 'true' || isDestaque === 1 || isDestaque === '1') ? 1 : 0;
    const nivel = parseInt(nivelDestaque);
    const categoria = parseInt(categoria_id);

    if (
        titulo == null || subtitulo == null || conteudo == null || imagem_url == null ||
        nivel == null || categoria == null
    ) {
        return res.status(400).json({ error: "Preencha todos os campos!" });
    }

    connection.query(queryUpdateMateria, [
        titulo, subtitulo, conteudo, imagem_url,
        destaque, nivel, categoria, req.params.id
    ], (err, result) => {
        if (err) {
            console.error("Erro ao atualizar matéria:", err);
            return res.status(500).json({ error: "Erro ao atualizar matéria" });
        }
        res.json({ message: "Matéria atualizada com sucesso!" });
    });
});
//Selecionar por categorias
router.get("/categoriasMateria/:categoria", (req, res) => {
    const categoria_id = req.params.categoria;
    const connection = getConnection();
    console.log("Categoria recebida:", categoria_id); // Log para verificar o ID recebido

    connection.query(querySelecionarMateriaPorCategoria, [categoria_id], (err, result) => {
        if (err) {
            console.error(`Erro ao conectar-se ao banco de dados: ${err}`);
            return res.status(500).json({ error: "Erro ao buscar matérias" });
        }

        console.log("Matérias encontradas:", result.length); // Verifica quantos registros foram retornados

        if (result.length === 0) {
            return res.status(404).json({ message: "Nenhuma matéria encontrada para essa categoria" });
        }

        res.json(result);
    });
});

// 🔹 Rota para excluir uma matéria
router.delete("/materias/:id", verificarToken, (req, res) => {
    const connection = getConnection();
    connection.query(queryDeletarMateria, [req.params.id], (err, result) => {
        if (err) {
            console.error("Erro ao excluir matéria:", err);
            return res.status(500).json({ error: "Erro ao excluir matéria" });
        }
        res.json({ message: "Matéria excluída com sucesso!" });
    });
});
//Selecionar o topico
router.get('/topicos/:id', (req, res) => {
    const categoriaID = req.params.id;
    const connection = getConnection();
    if (!categoriaID) {
        return res.status(400).json({ error: "ID da matéria não fornecido" });
    }

    connection.query(querySelecionarTopico, [categoriaID], (err, result) => {
        if (err) {
            console.error("Erro ao buscar matéria:", err);
            return res.status(500).json({ error: "Erro ao buscar matéria" });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "Nenhuma matéria encontrada para essa categoria" });
        }
        res.json(result); // ⬅️ envia todas as matérias da categoria
    });
});
//Selecionar Materia individual
router.get('/materiatitulo/:id',(req,res) => {
    const tituloMateria = req.params.id;
    const connection = getConnection();
    if(!tituloMateria){
        return res.status(400).json({ error: "Titulo da matéria não fornecido" });
    }

    connection.query(querySelecionarMateriaPorTitulo, [tituloMateria], (err,result)=>{
        if (err) {
            console.error("Erro ao buscar matéria:", err);
            return res.status(500).json({ error: "Erro ao buscar matéria" });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "Nenhuma matéria encontrada para essa categoria" });
        }
        res.json(result); // ⬅️ envia todas as matérias da categoria
    })
})
//Selecionar os Relacionados na pagina da materia
router.get("/relacionados/:categoria", (req, res) => {
    const connection = getConnection();
    const categoria_id = req.params.categoria;
    console.log("Categoria recebida:", categoria_id); // Log para verificar o ID recebido

    connection.query(querySelecionarRelacionados, [categoria_id], (err, result) => {
        if (err) {
            console.error(`Erro ao conectar-se ao banco de dados: ${err}`);
            return res.status(500).json({ error: "Erro ao buscar matérias" });
        }

        console.log("Matérias encontradas:", result.length); // Verifica quantos registros foram retornados

        if (result.length === 0) {
            return res.status(404).json({ message: "Nenhuma matéria encontrada para essa categoria" });
        }

        res.json(result);
    });
});
module.exports = router;