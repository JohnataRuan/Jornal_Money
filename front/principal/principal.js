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

document.addEventListener('DOMContentLoaded', () => selecionarMateriasPorCategoria(1));

async function selecionarMateriasPorCategoria(id_categoria) {
    try {
        const response = await fetch(`http://localhost:3000/rotas/categoriasMateria/${id_categoria}`, {
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

async function selecionarMateriaPorId(id){
    try{
        const response = await fetch(`http://localhost:3000/rotas/materias/${id}`, {
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


function transformarMateriaEmHtml(dados, id_html) {
    const container = document.getElementById(id_html); // Pegando o elemento onde as matérias serão inseridas
    if (!container) {
        console.error("Elemento HTML não encontrado!");
        return;
    }

    const conteudo_materia = document.createElement('div');
        conteudo_materia.className = 'conteudo_materia'

    for (let materia of dados) {  // Corrigindo a iteração dos dados

        const tituloMateria = materia.titulo;
        const subTituloMateria = materia.subtitulo;
        const conteudo = materia.conteudo;
        const url_imagem = materia.imagem_url;
        const categoria_id = materia.categoria_id;

        

        // Criando o bloco da matéria
        const bloco_materia = document.createElement('div');
        bloco_materia.className = 'bloco_materia';

        // Criando a imagem
        const img = document.createElement('img');
        img.src = url_imagem;
        img.alt = tituloMateria;

        // Criando a div de texto
        const texto_bloco_materia = document.createElement('div');
        texto_bloco_materia.className = 'texto_bloco_materia';

        // Criando o título
        const titulo_Materia = document.createElement('h4');
        titulo_Materia.textContent = tituloMateria;

        // Criando o parágrafo da categoria
        const categoria_Materia = document.createElement('p');

        // Atribuindo a categoria correta
        switch (categoria_id) {
            case 1:
                categoria_Materia.textContent = 'Economia';
                break;
            case 2:
                categoria_Materia.textContent = 'Política';
                break;
            case 3:
                categoria_Materia.textContent = 'Curiosidades';
                break;
            case 4:
                categoria_Materia.textContent = 'Previsões';
                break;
            default:
                categoria_Materia.textContent = 'Outros';
        }

        // Adicionando elementos dentro da div de texto
        texto_bloco_materia.appendChild(titulo_Materia);
        texto_bloco_materia.appendChild(categoria_Materia);

        // Adicionando elementos dentro do bloco da matéria
        bloco_materia.appendChild(img);
        bloco_materia.appendChild(texto_bloco_materia);

        // Adicionando o bloco da matéria ao container na página
        conteudo_materia.appendChild(bloco_materia);
    }

    container.appendChild(conteudo_materia);

}


function carregarMateriaPrincipal(dados) {
    const materiaPrincipal = document.getElementById('noticia_principal');

    const tituloMateriaPrincipal = dados.titulo;
    const subTituloMateriaPrincipal = dados.subtitulo;

    const materiaPrincipalh1 = document.createElement('h1'); // Corrigido
    materiaPrincipalh1.textContent = tituloMateriaPrincipal;

    const materiaPrincipalh3 = document.createElement('h3'); // Corrigido
    materiaPrincipalh3.textContent = subTituloMateriaPrincipal;

    materiaPrincipal.appendChild(materiaPrincipalh1);
    materiaPrincipal.appendChild(materiaPrincipalh3);
}


document.addEventListener('DOMContentLoaded', async () => {
    try {
        const dados = await selecionarMateriasPorCategoria(1); // Aguarda os dados
        transformarMateriaEmHtml(dados, 'materias_Economia'); // Chama a função com os dados reais
    } catch (error) {
        console.error("Erro ao carregar as matérias:", error);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const dados = await selecionarMateriasPorCategoria(2); // Aguarda os dados
        transformarMateriaEmHtml(dados, 'materias_Politica'); // Chama a função com os dados reais
    } catch (error) {
        console.error("Erro ao carregar as matérias:", error);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const dados = await selecionarMateriasPorCategoria(3); // Aguarda os dados
        transformarMateriaEmHtml(dados, 'materias_Curiosidades'); // Chama a função com os dados reais
    } catch (error) {
        console.error("Erro ao carregar as matérias:", error);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const dados = await selecionarMateriasPorCategoria(4); // Aguarda os dados
        transformarMateriaEmHtml(dados, 'materias_Previsões'); // Chama a função com os dados reais
    } catch (error) {
        console.error("Erro ao carregar as matérias:", error);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const dados = await selecionarMateriaPorId(1) // Aguarda os dados
        carregarMateriaPrincipal(dados);
    } catch (error) {
        console.error("Erro ao carregar as matérias:", error);
    }
});