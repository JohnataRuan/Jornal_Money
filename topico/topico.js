
import { linkBancoDeDados } from '../utils/arquivos/linkBancoDeDados.js';
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch(`${linkBancoDeDados}/rotas/topicos/${id}`) // Correto
  .then(response => {
    if (!response.ok) throw new Error("Erro ao buscar tópico");
    return response.json();
  })
  .then(data => {
    console.log(data)
    console.log(id)
    if(id==1){
        document.getElementById('tituloTopico').textContent = 'Economia'
        document.title = `Jornal Money - Economia`
    }if(id==2){
        document.getElementById('tituloTopico').textContent = 'Politica'
        document.title = `Jornal Money - Politica`
    }if(id==3){
        document.getElementById('tituloTopico').textContent = 'Curiosidades'
        document.title = `Jornal Money - Curiosidades`
    }if(id==4){
        document.getElementById('tituloTopico').textContent = 'Previsões'
        document.title = `Jornal Money - Previsões`
    }
    criarMateriaComuns(data)
  })
  .catch(err => {
    console.error(err);
  });

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const dadosMateriaPrincipal = await selecionarMateriaPrincipal(id) // Aguarda os dados
        criarMateriaPrincipal(dadosMateriaPrincipal);
        const dadosMateriaSecunaria = await selecionarMateriaSecundarias(id) // Aguarda os dados
        criarMateriaSecundarias(dadosMateriaSecunaria);
    } catch (error) {
        console.error("Erro ao carregar as matérias:", error);
    }
});



function criarMateriaPrincipal(data){
    console.log('DATA:',data)
      const blocoMateriaPrincipal = document.getElementById('materia_principal');
     
        for(let materia of data){
            if(materia.nivelDestaque === 1){
                 const bloco_materia = document.createElement('a');
                bloco_materia.className = 'bloco_materia';
                bloco_materia.href = `../materia/materia.html?id=${materia.id}`;
                const img = document.createElement('img');
                img.src = materia.imagem_url;

                const texto_bloco_topico = document.createElement('div');
                texto_bloco_topico.className = 'texto_bloco_topico';

                const tituloMateriaPrincipal = document.createElement('h4');
                tituloMateriaPrincipal.textContent = materia.titulo;

                const categoria_Materia = document.createElement('a');
            switch (materia.categoria_id){
                case 1: categoria_Materia.textContent = 'Economia';
                categoria_Materia.href = "../topico/topico.html?id=1";
                break;
                case 2: categoria_Materia.textContent = 'Política';
                categoria_Materia.href = "../topico/topico.html?id=2";
                break;
                case 3: categoria_Materia.textContent = 'Curiosidades';
                categoria_Materia.href = "../topico/topico.html?id=3";
                break;
                case 4: categoria_Materia.textContent = 'Previsões';
                categoria_Materia.href = "../topico/topico.html?id=4";
                break;
                default: categoria_Materia.textContent = 'Outros';
            }

            texto_bloco_topico.appendChild(tituloMateriaPrincipal);
            texto_bloco_topico.appendChild(categoria_Materia);

            const line = document.createElement('div');
            line.className = 'line_bottom';

            bloco_materia.appendChild(img);
            bloco_materia.appendChild(texto_bloco_topico);
            bloco_materia.appendChild(line);

            blocoMateriaPrincipal.appendChild(bloco_materia);
            }
        }
}

function criarMateriaSecundarias(data) {
    const bloco_principal = document.querySelector('.bloco_topico_principal');
    
    for (const materia of data) {
        const blocoMateriaSecundaria = document.createElement('a');
        blocoMateriaSecundaria.href = `../materia/materia.html?id=${materia.id}`;
        blocoMateriaSecundaria.className = 'materia_secundaria';

        const img = document.createElement('img');
        img.src = materia.imagem_url;

        const texto_bloco_topico = document.createElement('div');
        texto_bloco_topico.className = 'texto_bloco_topico';

        const tituloMateriaPrincipal = document.createElement('h4');
        tituloMateriaPrincipal.textContent = materia.titulo;

        const categoria_Materia = document.createElement('a');
        switch (materia.categoria_id) {
                case 1: categoria_Materia.textContent = 'Economia';
                categoria_Materia.href = "../topico/topico.html?id=1";
                break;
                case 2: categoria_Materia.textContent = 'Política';
                categoria_Materia.href = "../topico/topico.html?id=2";
                break;
                case 3: categoria_Materia.textContent = 'Curiosidades';
                categoria_Materia.href = "../topico/topico.html?id=3";
                break;
                case 4: categoria_Materia.textContent = 'Previsões';
                categoria_Materia.href = "../topico/topico.html?id=4";
                break;
                default: categoria_Materia.textContent = 'Outros';
            }

        texto_bloco_topico.appendChild(tituloMateriaPrincipal);
        texto_bloco_topico.appendChild(categoria_Materia);

        const line = document.createElement('div');
        line.className = 'line_bottom';

        blocoMateriaSecundaria.appendChild(img);
        blocoMateriaSecundaria.appendChild(texto_bloco_topico);
        blocoMateriaSecundaria.appendChild(line);

        bloco_principal.appendChild(blocoMateriaSecundaria);
    }
}

function criarMateriaComuns(data) {
  const containerPrincipal = document.querySelector('.conteudo_topico');
  if (!containerPrincipal) {
    console.warn("Elemento '.conteudo_topico' não encontrado.");
    return;
  }

  const materiasComuns = data.filter(m => m.nivelDestaque === 3);

  if (materiasComuns.length === 0) {
    console.warn("Nenhuma matéria com nivelDestaque === 0 encontrada.");
    return;
  }

  for (let i = 0; i < materiasComuns.length; i += 4) {
    const grupoDeQuatro = materiasComuns.slice(i, i + 4);

    const conteudo_materia = document.createElement('div');
    conteudo_materia.className = 'conteudo_materia';

    for (const materia of grupoDeQuatro) {
      const bloco_materia = document.createElement('a');
      bloco_materia.href = `../materia/materia.html?id=${materia.id}`;
      bloco_materia.className = 'bloco_materia';

      const img = document.createElement('img');
      img.src = materia.imagem_url;

      const texto_bloco_materia = document.createElement('div');
      texto_bloco_materia.className = 'texto_bloco_materia';

      const titulo = document.createElement('h4');
      titulo.textContent = materia.titulo;

      const categoria = document.createElement('a');
      switch (materia.categoria_id) {
                case 1: categoria.textContent = 'Economia';
                categoria.href = "../topico/topico.html?id=1";
                break;
                case 2: categoria.textContent = 'Política';
                categoria.href = "../topico/topico.html?id=2";
                break;
                case 3: categoria.textContent = 'Curiosidades';
                categoria.href = "../topico/topico.html?id=3";
                break;
                case 4: categoria.textContent = 'Previsões';
                categoria.href = "../topico/topico.html?id=4";
                break;
                default: categoria.textContent = 'Outros';
            }

      texto_bloco_materia.appendChild(titulo);
      texto_bloco_materia.appendChild(categoria);
      bloco_materia.appendChild(img);
      bloco_materia.appendChild(texto_bloco_materia);
      conteudo_materia.appendChild(bloco_materia);
    }

    containerPrincipal.appendChild(conteudo_materia); // ✅ adiciona no final do conteúdo
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

async function selecionarMateriaPrincipal(id_categoria){
    try{
        const response = await fetch(`${linkBancoDeDados}/rotas/materiaPrincipalTopico/${id_categoria}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
    }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Erro ao buscar matérias:", error);
    }
}
async function selecionarMateriaSecundarias(id_categoria){
    try{
        const response = await fetch(`${linkBancoDeDados}/rotas/materiaSecundariaTopico/${id_categoria}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
    }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erro ao buscar matérias:", error);
    }
}