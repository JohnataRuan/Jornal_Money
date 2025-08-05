tinymce.init({
  selector: 'textarea',
  plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount',
  toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
});

import { linkBancoDeDados } from '../utils/arquivos/linkBancoDeDados.js';
import { fetchComAuth } from '../utils/arquivos/validarToken.js';

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById('materiaForm').addEventListener('submit', function(event) {
      event.preventDefault(); // Impede a atualização da página
      capturarDados();
  });
});

function capturarDados() {
  const titulo = document.getElementById('titulo').value.trim();
  const subtitulo = document.getElementById('subtitulo').value.trim();
  const conteudo = document.getElementById('conteudo').value.trim();
  const imagem_url = document.getElementById('imagem_url').value.trim();
  const categoria_id = document.getElementById('categoria_id').value; 
  const isDestaque = document.getElementById('isDestaque').value;
  const nivelDestaque = document.getElementById('nivelDestaque').value;
  console.log(categoria_id);
  if (!titulo || !subtitulo || !conteudo || !imagem_url || !categoria_id) {
      alert("Preencha todos os campos!");
      return;
  }

  const dataHoraAtual = new Date().toISOString(); // Formata a data corretamente

  const dados = {
      titulo,
      subtitulo,
      conteudo,
      imagem_url,
      categoria_id,
      isDestaque,
      nivelDestaque,
      dataHora: dataHoraAtual
  };

  enviarDados(dados);
}

async function enviarDados(dados) {
  try {
    const resultado = await fetchComAuth(`${linkBancoDeDados}/rotas/post`, {
      method: 'POST',
      body: JSON.stringify(dados),
    });

    console.log("Resposta do servidor:", resultado);
    alert("Matéria adicionada com sucesso!");
    document.getElementById("materiaForm").reset(); // Limpa os campos após o envio
  } catch (erro) {
    console.error('Erro ao enviar os dados:', erro);
    alert("Erro ao enviar os dados. Verifique o console.");
  }
}



  export async function verGet() {
    try {
        console.log('Iniciando requisição para o backend...');
        const response = await fetch(`${linkBancoDeDados}/rotas/get`);
        
        console.log('Resposta recebida:', response);
        
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Dados recebidos no frontend:', data);
        return data;
    } catch (error) {
        console.error('Erro ao buscar os dados:', error);
    }
}




document.getElementById("button_redirecionar").addEventListener('click', (event) => {
    event.preventDefault(); // Evita comportamento padrão
    console.log("Botão clicado!"); // Teste se o evento está funcionando
    window.location.href = '../admin_edit/admin_edit.html'; // Caminho correto
});