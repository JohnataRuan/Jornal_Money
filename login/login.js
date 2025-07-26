import { linkBancoDeDados } from "../utils/arquivos/linkBancoDeDados.js";

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const emailInput = document.getElementById('email');
  const senhaInput = document.getElementById('senha');

  const emailError = document.createElement('span');
  const senhaError = document.createElement('span');

  emailError.classList.add('erro');
  senhaError.classList.add('erro');

  emailInput.insertAdjacentElement('afterend', emailError);
  senhaInput.insertAdjacentElement('afterend', senhaError);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    let isValid = true;
    emailError.textContent = '';
    senhaError.textContent = '';

    const emailValue = emailInput.value.trim();
    const senhaValue = senhaInput.value.trim();

    // Validações
    if (emailValue === '') {
      emailError.textContent = 'O e-mail é obrigatório.';
      isValid = false;
    } else if (!validateEmail(emailValue)) {
      emailError.textContent = 'E-mail inválido.';
      isValid = false;
    }

    if (senhaValue === '') {
      senhaError.textContent = 'A senha é obrigatória.';
      isValid = false;
    } else if (senhaValue.length < 6) {
      senhaError.textContent = 'Senha muito curta.';
      isValid = false;
    }

    if (isValid) {
      const token = await enviarLogin(emailValue, senhaValue);

      if (token) {
        localStorage.setItem('token', token); // Armazena o token
        window.location.href = '../admin/admin.html'; // Redireciona
      } else {
        senhaError.textContent = 'Email ou senha incorretos.';
      }
    }
  });

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
});


async function enviarLogin(email, senha) {
    try {
        const response = await fetch(`${linkBancoDeDados}/rotas/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.message || `Erro na requisição: ${response.status}`);
        }

        const data = await response.json();
        console.log("Login bem-sucedido:", data);
        
        // Supondo que o backend retorna um objeto com token
        return data.token;
    } catch (error) {
        console.error("Erro ao realizar login:", error);
        return null;
    }
}