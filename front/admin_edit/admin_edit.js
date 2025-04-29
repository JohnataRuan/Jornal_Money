document.addEventListener("DOMContentLoaded", async () => {
    const selectMateria = document.getElementById("materiaSelecionada");
    const formSelecionarMateria = document.getElementById("selecionarMateriaForm");
    const formMateria = document.getElementById("materiaForm");
    const tituloInput = document.getElementById("titulo");
    const subtituloInput = document.getElementById("subtitulo");
    const conteudoInput = document.getElementById("conteudo");
    const imagemInput = document.getElementById("imagem_url");
    const categoriaSelect = document.getElementById("categoria_id");
    const btnCarregar = document.getElementById("carregarMateria");
    const btnSalvar = document.getElementById("button_editar");
    const btnExcluir = document.getElementById("button_excluir");

    // Inicializa o TinyMCE
    tinymce.init({
        selector: "#conteudo",
        setup: (editor) => {
            editor.on('change', () => {
                editor.save(); // Garante que o conteúdo seja salvo corretamente no textarea
            });
        }
    });

    // Carregar as matérias assim que o DOM estiver pronto
    await carregarMaterias();

    async function carregarMaterias() {
        const selectMateria = document.getElementById('materiaSelecionada');
        try {
            const response = await fetch("http://localhost:3000/rotas/materias"); // Endpoint correto
            const materias = await response.json();
            console.log(materias); // Verifique se os dados estão sendo retornados corretamente no console

            if (materias.length > 0) {
                // Limpa as opções do select
                selectMateria.innerHTML = '<option value="">Selecione...</option>';

                // Adiciona as novas opções ao select
                materias.forEach(materia => {
                    const option = document.createElement("option");
                    option.value = materia.id; // Ajuste conforme a estrutura da resposta
                    option.textContent = materia.titulo; // Ajuste conforme a estrutura da resposta
                    selectMateria.appendChild(option);
                });
            } else {
                console.log("Nenhuma matéria encontrada.");
            }
        } catch (error) {
            console.error("Erro ao carregar as matérias:", error);
        }
    }

    btnCarregar.addEventListener("click", async () => {
        const id = selectMateria.value;
        if (!id) {
            alert("Selecione uma matéria antes de carregar.");
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:3000/rotas/materias/${id}`);
            const materia = await response.json();
    
            console.log(materia); // Verifique a resposta aqui
    
            if (materia && materia.titulo && materia.subtitulo && materia.conteudo && materia.imagem_url && materia.categoria_id) {
                tituloInput.value = materia.titulo;
                subtituloInput.value = materia.subtitulo;
                tinymce.get("conteudo").setContent(materia.conteudo);
                imagemInput.value = materia.imagem_url;
                categoriaSelect.value = materia.categoria_id;
    
                formMateria.style.display = "block";
            } else {
                alert("Dados incompletos para a matéria.");
            }
        } catch (error) {
            console.error("Erro ao carregar matéria:", error);
        }
    });

    // Evento para salvar alterações
    btnSalvar.addEventListener("click", async (event) => {
        event.preventDefault();
        const id = selectMateria.value;
        const conteudo = tinymce.get("conteudo").getContent();

        if (!id) {
            alert("Selecione uma matéria antes de salvar.");
            return;
        }

        const materiaAtualizada = {
            titulo: tituloInput.value,
            subtitulo: subtituloInput.value,
            conteudo,
            imagem_url: imagemInput.value,
            categoria_id: categoriaSelect.value,
        };

        try {
            const response = await fetch(`http://localhost:3000/rotas/materias/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(materiaAtualizada),
            });

            if (response.ok) {
                alert("Matéria atualizada com sucesso!");
                carregarMaterias();
            } else {
                alert("Erro ao atualizar matéria.");
            }
        } catch (error) {
            console.error("Erro ao atualizar matéria:", error);
        }
    });

    // Evento para excluir matéria
    btnExcluir.addEventListener("click", async () => {
        const id = selectMateria.value;
        if (!id) {
            alert("Selecione uma matéria antes de excluir.");
            return;
        }

        if (!confirm("Tem certeza que deseja excluir esta matéria?")) return;

        try {
            const response = await fetch(`http://localhost:3000/rotas/materias/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("Matéria excluída com sucesso!");
                formMateria.reset();
                formMateria.style.display = "none";
                carregarMaterias();
            } else {
                alert("Erro ao excluir matéria.");
            }
        } catch (error) {
            console.error("Erro ao excluir matéria:", error);
        }
    });

});

const btnRedirecionar = document.getElementById("button_redirecionar");

btnRedirecionar.addEventListener('click', (event) => {
    event.preventDefault(); // Evita comportamento padrão
    console.log("Botão clicado!"); // Teste se o evento está funcionando
    window.location.href = '../admin/admin.html'; // Caminho correto
});
