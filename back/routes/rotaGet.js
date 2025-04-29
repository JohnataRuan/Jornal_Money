const connection = require("../database/connection");
const express = require('express');
const router = express.Router();

const {
    queryEnviarDadosFormulario,
    queryGetMaterias,
    querySelecionarMateriaPorId,
    queryUpdateMateria,
    queryDeletarMateria,
    querySelecionarMateriaPorCategoria
} = require('../utils/queries');

// 🔹 Rota para adicionar uma nova matéria
router.post('/post', (req, res) => {
    const { titulo, subtitulo, conteudo, imagem_url, categoria } = req.body;
    const dataHora = new Date().toISOString().slice(0, 19).replace('T', ' ');

    if (!titulo || !subtitulo || !conteudo || !imagem_url || !categoria) {
        return res.status(400).json({ error: "Preencha todos os campos!" });
    }

    const valores = [titulo, subtitulo, conteudo, imagem_url, categoria, dataHora];

    connection.query(queryEnviarDadosFormulario, valores, (erro, resultado) => {
        if (erro) {
            console.error("Erro ao inserir no banco:", erro);
            return res.status(500).json({ error: "Erro interno no servidor" });
        }

        res.status(201).json({ message: "Matéria inserida com sucesso!", id: resultado.insertId });
    });
});

// 🔹 Rota para listar todas as matérias
router.get("/materias", (req, res) => {
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
router.put("/materias/:id", (req, res) => {
    const { titulo, subtitulo, conteudo, imagem_url, categoria_id } = req.body;

    if (!titulo || !subtitulo || !conteudo || !imagem_url || !categoria_id) {
        return res.status(400).json({ error: "Preencha todos os campos!" });
    }

    connection.query(queryUpdateMateria, [titulo, subtitulo, conteudo, imagem_url, categoria_id, req.params.id], (err, result) => {
        if (err) {
            console.error("Erro ao atualizar matéria:", err);
            return res.status(500).json({ error: "Erro ao atualizar matéria" });
        }
        res.json({ message: "Matéria atualizada com sucesso!" });
    });
});

router.get("/categoriasMateria/:categoria", (req, res) => {
    const categoria_id = req.params.categoria;
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
router.delete("/materias/:id", (req, res) => {
    connection.query(queryDeletarMateria, [req.params.id], (err, result) => {
        if (err) {
            console.error("Erro ao excluir matéria:", err);
            return res.status(500).json({ error: "Erro ao excluir matéria" });
        }
        res.json({ message: "Matéria excluída com sucesso!" });
    });
});

module.exports = router;
