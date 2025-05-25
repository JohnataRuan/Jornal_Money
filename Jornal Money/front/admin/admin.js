tinymce.init({
  selector: 'textarea',
  plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount',
  toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
});


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
  const categoria = document.getElementById('categoria_id').value; // Corrigido ID
  const isDestaque = document.getElementById('isDestaque').value;
  const nivelDestaque = document.getElementById('nivelDestaque').value;

  if (!titulo || !subtitulo || !conteudo || !imagem_url || !categoria) {
      alert("Preencha todos os campos!");
      return;
  }

  const dataHoraAtual = new Date().toISOString(); // Formata a data corretamente

  const dados = {
      titulo,
      subtitulo,
      conteudo,
      imagem_url,
      categoria,
      isDestaque,
      nivelDestaque,
      dataHora: dataHoraAtual
  };

  enviarDados(dados);
}

async function enviarDados(dados) {
  try {
      const response = await fetch('http://localhost:3000/rotas/post', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(dados)
      });

      if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
      }

      const resultado = await response.json();
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
        const response = await fetch('http://localhost:3000/rotas/get');
        
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


const btnRedirecionar = document.getElementById("button_redirecionar");

btnRedirecionar.addEventListener('click', (event) => {
    event.preventDefault(); // Evita comportamento padrão
    console.log("Botão clicado!"); // Teste se o evento está funcionando
    window.location.href = '../admin_edit/admin_edit.html'; // Caminho correto
});