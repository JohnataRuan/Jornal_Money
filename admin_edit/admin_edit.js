
import { linkBancoDeDados } from '../utils/arquivos/linkBancoDeDados.js';
import { fetchComAuth } from '../utils/arquivos/validarToken.js';
document.addEventListener("DOMContentLoaded", async () => {
    
    const selectMateria = document.getElementById("materiaSelecionada");
    const formSelecionarMateria = document.getElementById("selecionarMateriaForm");
    const formMateria = document.getElementById("materiaForm");
    const tituloInput = document.getElementById("titulo");
    const subtituloInput = document.getElementById("subtitulo");
    const conteudoInput = document.getElementById("conteudo");
    const imagemInput = document.getElementById("imagem_url");
    const categoriaSelect = document.getElementById("categoria_id");
    const isDestaque = document.getElementById('isDestaque');
    const nivelDestaque = document.getElementById('nivelDestaque');
    const btnCarregar = document.getElementById("carregarMateria");
    const btnSalvar = document.getElementById("button_editar");
    const btnExcluir = document.getElementById("button_excluir");
    const btnRedirecionar = document.getElementById("button_redirecionar");

    // TinyMCE
    tinymce.init({
        selector: "#conteudo",
        setup: (editor) => {
            editor.on('change', () => {
                editor.save();
            });
        }
    });

    // Carrega as matérias
    await carregarMaterias();

    async function carregarMaterias() {
        try {
            const response = await fetch(`${linkBancoDeDados}/rotas/todasMaterias`);
            const materias = await response.json();
            console.log(materias);

            selectMateria.innerHTML = '<option value="">Selecione...</option>';

            materias.forEach(materia => {
                const option = document.createElement("option");
                option.value = materia.id;
                option.textContent = materia.titulo;
                selectMateria.appendChild(option);
            });
        } catch (error) {
            console.error("Erro ao carregar as matérias:", error);
        }
    }

    // Botão CARREGAR
    btnCarregar.addEventListener("click", async () => {

        const id = selectMateria.value;
        if (!id) return alert("Selecione uma matéria antes de carregar.");

        try {
            const response = await fetch(`${linkBancoDeDados}/rotas/materias/${id}`);
            const materia = await response.json();
            console.log(materia);

            if (!materia) return alert("Matéria não encontrada.");

            tituloInput.value = materia.titulo || "";
            subtituloInput.value = materia.subtitulo || "";
            tinymce.get("conteudo").setContent(materia.conteudo || "");
            imagemInput.value = materia.imagem_url || "";
            categoriaSelect.value = materia.categoria_id || "";
            isDestaque.checked = !!materia.isDestaque;
            nivelDestaque.value = materia.nivelDestaque || "";

            formMateria.style.display = "block";
        } catch (error) {
            console.error("Erro ao carregar matéria:", error);
        }
    });
//Salvar materia editada
   btnSalvar.addEventListener("click", async (event) => {
  event.preventDefault();

  const id = selectMateria.value;
  if (!id) return alert("Selecione uma matéria antes de salvar.");

  const conteudo = tinymce.get("conteudo").getContent();
  const materiaAtualizada = {
    titulo: tituloInput.value,
    subtitulo: subtituloInput.value,
    conteudo,
    imagem_url: imagemInput.value,
    isDestaque: isDestaque.checked,
    nivelDestaque: nivelDestaque.value,
    categoria_id: categoriaSelect.value
  };

  console.log(materiaAtualizada);

  try {
    const response = await fetchComAuth(`${linkBancoDeDados}/rotas/materia/${id}`, {
      method: "PUT",
      body: JSON.stringify(materiaAtualizada),
    });

    alert("Matéria atualizada com sucesso!");
    await carregarMaterias();
  } catch (error) {
    console.error("Erro ao atualizar matéria:", error);
    alert("Erro ao atualizar matéria.");
  }
});

    // Botão EXCLUIR
    btnExcluir.addEventListener("click", async () => {
    const id = selectMateria.value;
    if (!id) return alert("Selecione uma matéria antes de excluir.");
    if (!confirm("Tem certeza que deseja excluir esta matéria?")) return;

    try {
        const response = await fetchComAuth(`${linkBancoDeDados}/rotas/materias/${id}`, {
            method: "DELETE"
        });

        alert("Matéria excluída com sucesso!");
        formMateria.reset();
        tinymce.get("conteudo").setContent("");
        formMateria.style.display = "none";
        await carregarMaterias();

    } catch (error) {
        console.error("Erro ao excluir matéria:", error);
        alert("Erro ao excluir matéria.");
    }
});
    // Botão REDIRECIONAR
    btnRedirecionar.addEventListener('click', (event) => {
        event.preventDefault();
        console.log("Botão clicado!");
        window.location.href = '../admin/admin.html';
    });
});
