import { linkBancoDeDados } from './utils/arquivos/linkBancoDeDados.js';

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
//Importar footer
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
        const response = await fetch(`${linkBancoDeDados}/rotas/categoriasMateria/${id_categoria}`, {
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

async function selecionarTodasMaterias(){
    try{
        const response = await fetch(`${linkBancoDeDados}/rotas/todasMaterias`, {
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

function transformarMateriaEmHtml(dados, id_html) {
    const container = document.getElementById(id_html);
    if (!container) {
        console.error("Elemento HTML não encontrado!");
        return;
    }

    const conteudo_materia = document.createElement('div');
    conteudo_materia.className = 'conteudo_materia';

    // Contadores por categoria
    const contadores = {
        1: 0, // Economia
        2: 0, // Política
        3: 0, // Curiosidades
        4: 0  // Previsões
    };

    for (let materia of dados) {
        const { id,titulo, subtitulo, conteudo, imagem_url, categoria_id, isDestaque, nivelDestaque, datapublicacao } = materia;

        if (Number(nivelDestaque) === 3 && contadores[categoria_id] < 4) {
            contadores[categoria_id]++; // incrementa contador da categoria

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
    }

    container.appendChild(conteudo_materia);
}


//Imporar a materia que servira como materia principal
function carregarMateriaPrincipal(dados) {
    const materiaPrincipal = document.getElementById('noticia_principal');

    for (let materia of dados) {
        const { id,titulo, subtitulo, conteudo, imagem_url, categoria_id, isDestaque, nivelDestaque, datapublicacao } = materia;

        if (Number(nivelDestaque) === 1 && Number(isDestaque)===1) {
            const bloco_materia = document.createElement('a')
            bloco_materia.href =  `../materia/materia.html?id=${id}`;
            
            const tituloMateriaPrincipal = titulo;
            const subTituloMateriaPrincipal = subtitulo;

            const materiaPrincipalh1 = document.createElement('h1'); // Corrigido
            materiaPrincipalh1.textContent = tituloMateriaPrincipal;

            const materiaPrincipalh3 = document.createElement('h3'); // Corrigido
            materiaPrincipalh3.textContent = subTituloMateriaPrincipal;

                bloco_materia.appendChild(materiaPrincipalh1);
                bloco_materia.appendChild(materiaPrincipalh3);
                materiaPrincipal.appendChild(bloco_materia);
        }
}
}

function carregarSubMaterias(dados) {
    const blocoManchete = document.getElementById('bloco_manchete');
    let count = 0;

    for (let materia of dados) {
        const { id,titulo, isDestaque, nivelDestaque } = materia;

        if (Number(isDestaque) === 1 && Number(nivelDestaque) === 2) {
            if (count >= 3) break; // Garante no máximo 3 matérias

            const submateria = document.createElement('a');
            submateria.href = `../materia/materia.html?id=${id}`;
            submateria.className = 'sub-materias'; // Corrigido

            const line = document.createElement('div');
            line.className = 'line';

            const tituloSubmateria = document.createElement('h4');
            tituloSubmateria.textContent = titulo;

            submateria.appendChild(line);
            submateria.appendChild(tituloSubmateria);

            blocoManchete.appendChild(submateria);

            count++;
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const categorias = [
            { id: 1, htmlId: 'materias_Economia' },
            { id: 2, htmlId: 'materias_Politica' },
            { id: 3, htmlId: 'materias_Curiosidades' },
            { id: 4, htmlId: 'materias_Previsões' }
        ];

        for (let categoria of categorias) {
            const dados = await selecionarMateriasPorCategoria(categoria.id);
            transformarMateriaEmHtml(dados, categoria.htmlId);
        }
    } catch (error) {
        console.error("Erro ao carregar as matérias:", error);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const dados = await selecionarTodasMaterias() // Aguarda os dados
        carregarMateriaPrincipal(dados);
    } catch (error) {
        console.error("Erro ao carregar as matérias:", error);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const dados = await selecionarTodasMaterias(); // Aguarda os dados
        carregarSubMaterias(dados);
    } catch (error) {
        console.error("Erro ao carregar as matérias:", error);
    }
});