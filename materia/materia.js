const params = new URLSearchParams(window.location.search);
const id = params.get("id");
import { linkBancoDeDados } from '../utils/arquivos/linkBancoDeDados.js';

console.log(linkBancoDeDados);
fetch(`${linkBancoDeDados}/rotas/materiatitulo/${id}`)
  .then(response => {
    if (!response.ok) throw new Error("Erro ao buscar tópico");
    return response.json();
  })
  .then(data => {
    console.log("Matéria principal:", data);
    document.title = data[0].titulo;
    transformarMateriaEmHtml(data[0]); // Exibe a matéria principal

    // Busca matérias relacionadas pela mesma categoria
    return selecionarMateriasPorCategoria(data[0].categoria_id);
  })
  .then(materiasRelacionados => {
    console.log("Matérias relacionadas:", materiasRelacionados);
    transformarMateriaRelacionados(materiasRelacionados); // Exibe as relacionadas
  })
  .catch(err => {
    console.error("Erro geral:", err);
  });

function transformarMateriaEmHtml(materia){

    const blocoPrincipalMateria = document.querySelector('.conteudo_materia')

    const tituloMateria = document.createElement('div');
    tituloMateria.className = 'titulo_materia';

    const line = document.createElement('div');
    line.className = 'line';

    const titulo_text = document.createElement('h1');
    titulo_text.textContent = materia.titulo;

    tituloMateria.appendChild(line)
    tituloMateria.appendChild(titulo_text)

    blocoPrincipalMateria.appendChild(tituloMateria);

    const subtitulo = document.createElement('h3');
    subtitulo.textContent = materia.subtitulo;

    const imagem = document.createElement('img');
    imagem.src = materia.imagem_url;

    const conteudoMateria = document.createElement('div');
    conteudoMateria.className = 'texto_materia';

    const textoMateria = document.createElement('p');
    textoMateria.innerHTML = materia.conteudo;

    conteudoMateria.appendChild(textoMateria);

    blocoPrincipalMateria.appendChild(subtitulo);
    blocoPrincipalMateria.appendChild(imagem);
    blocoPrincipalMateria.appendChild(conteudoMateria);
}
function transformarMateriaRelacionados(dados) {
  const container = document.getElementById('conteudo_relacionados');
  console.log('transformarMateriaRelacionados recebeu:', dados);
  console.log('container encontrado:', container);

  if (!container) {
    console.error("Elemento HTML não encontrado!");
    return;
  }

  container.innerHTML = ''; // Limpa conteúdo antigo

  const conteudo_materia = document.createElement('div');
  conteudo_materia.className = 'bloco_relacionados';

  for (let materia of dados) {
    const { id,titulo, imagem_url, categoria_id } = materia;

    const bloco_materia = document.createElement('a');
    bloco_materia.className = 'bloco_materia';
    bloco_materia.href = `../materia/materia.html?id=${id}`;

    const img = document.createElement('img');
    img.src = imagem_url;
    img.alt = titulo;

    const texto_bloco_materia = document.createElement('div');
    texto_bloco_materia.className = 'texto_bloco_materia';

    const titulo_Materia = document.createElement('h4');
    titulo_Materia.textContent = titulo;

    const categoria_Materia = document.createElement('a');
    switch (categoria_id) {
      case 1:
        categoria_Materia.textContent = 'Economia';
        categoria_Materia.href = "../topico/topico.html?id=1";
        break;
      case 2:
        categoria_Materia.textContent = 'Política';
        categoria_Materia.href = "../topico/topico.html?id=2";
        break;
      case 3:
        categoria_Materia.textContent = 'Curiosidades';
        categoria_Materia.href = "../topico/topico.html?id=3";
        break;
      case 4:
        categoria_Materia.textContent = 'Previsões';
        categoria_Materia.href = "../topico/topico.html?id=4";
        break;
      default:
        categoria_Materia.textContent = 'Outros';
    }

    texto_bloco_materia.appendChild(titulo_Materia);
    texto_bloco_materia.appendChild(categoria_Materia);

    bloco_materia.appendChild(img);
    bloco_materia.appendChild(texto_bloco_materia);

    conteudo_materia.appendChild(bloco_materia);
  }

  container.appendChild(conteudo_materia);
}



async function selecionarMateriasPorCategoria(id_categoria) {
    try {
        const response = await fetch(`${linkBancoDeDados}/rotas/relacionados/${id_categoria}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Matérias recebidas:", data);
        return data;
    } catch (error) {
        console.error("Erro ao buscar matérias:", error);
    }
}

async function importarTopo() {
    try {
        // Importa o HTML
        const response = await fetch('../top/top.html');

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: Não foi possível carregar o HTML.`);
        }

        const cabecalhoHTML = await response.text();

        if (!cabecalhoHTML.trim()) {
            throw new Error("O arquivo top.html está vazio.");
        }

        document.body.insertAdjacentHTML('afterbegin', cabecalhoHTML);

        // Importa o CSS dinamicamente
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = '../top/top.css';
        document.head.appendChild(cssLink);
        console.log("CSS do topo importado!");

        // Importa o JS dinamicamente
        await new Promise(resolve => setTimeout(resolve, 100)); // Pequeno delay para garantir que o HTML foi inserido

        const { initMenu } = await import('../top/top.js');
        initMenu(); // Inicializa o menu

    } catch (error) {
        console.error('Erro ao importar o cabeçalho:', error);
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("../footer/footer.html");
        if (!response.ok) throw new Error("Erro ao carregar o footer.");

        const footerHTML = await response.text();
        document.getElementById("footer-container").innerHTML = footerHTML;

        // Aguarde um pequeno tempo para garantir a inserção do HTML antes de carregar o CSS
        await new Promise(resolve => setTimeout(resolve, 50));

        // Importar CSS dinamicamente
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = "../footer/footer.css";
        document.head.appendChild(cssLink);
        console.log("CSS do footer importado!");

    } catch (error) {
        console.error("Erro ao carregar o footer:", error);
    }
});

window.addEventListener('DOMContentLoaded', importarTopo);
