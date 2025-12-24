const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const getConnection = require('../database/connection');
const connection = getConnection();

router.get('/materia/:slug', (req, res) => {
    const { slug } = req.params;

    const sql = `
        SELECT titulo, subtitulo, conteudo, imagem_url
        FROM materia
        WHERE slug = ?
        LIMIT 1
    `;

    connection.query(sql, [slug], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro no servidor');
        }

        if (results.length === 0) {
            return res.status(404).send('Matéria não encontrada');
        }

        const materia = results[0];

        const htmlPath = path.join(__dirname, '../views/materia.html');
        let html = fs.readFileSync(htmlPath, 'utf8');

        // 🔥 Injeta as metatags
        html = html
        .replace(/{{titulo}}/g, materia.titulo)
        .replace(/{{subtitulo}}/g, materia.subtitulo)
        .replace(/{{imagem}}/g, materia.imagem_url)
        .replace(/{{url}}/g, `https://jornalmoney.com/materia/${slug}`)
        .replace(/{{CONTEUDO_MATERIA}}/g, `
            <h1>${materia.titulo}</h1>
            <h2>${materia.subtitulo}</h2>
            <img src="${materia.imagem_url}" alt="${materia.titulo}">
            <div class="texto_materia">
                ${materia.conteudo}
            </div>
        `);

        res.send(html);
    });
});

module.exports = router;
