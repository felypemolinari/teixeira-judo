import { apiService } from './api-service.js';

document.addEventListener("DOMContentLoaded", () => {
  // Inicializar funcionalidades de login
  initPasswordToggle()
  initLoginForm()
})

// Funcionalidade de alternar visibilidade da senha
function initPasswordToggle() {
  const toggleButton = document.getElementById("togglePassword")
  const passwordInput = document.getElementById("password")

  if (toggleButton && passwordInput) {
    toggleButton.addEventListener("click", function () {
      const type = passwordInput.getAttribute("type") === "password" ? "text" : "password"
      passwordInput.setAttribute("type", type)

      // Atualizar texto do botão
      this.textContent = type === "password" ? "Mostrar" : "Ocultar"
    })
  }
}

// Manipulação do formulário de login
function initLoginForm() {
  const loginForm = document.getElementById("loginForm")

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()
      handleLogin()
    })
  }
}

// Processar submissão do login
async function handleLogin() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const submitButton = document.querySelector(".btn-login");

  clearErrors();

  if (!validateForm(email, senha)) {
    return;
  }

  showLoading(submitButton);

  try {
    const response = await apiService.login(email, senha);
    // A API retorna { data: { token }, message }
    const token = response.data.token;
    localStorage.setItem('authToken', token);
    showSuccess("Login realizado com sucesso!");
    
    setTimeout(() => {
      window.location.href = "admin.html";
    }, 1500);
  } catch (error) {
    hideLoading(submitButton);
    showError(error.message || "Email ou senha incorretos. Tente novamente.");
  }
}

// Validação do formulário
function validateForm(email, password) {
  let isValid = true

  // Validação de email
  if (!email) {
    showFieldError("email", "Email é obrigatório")
    isValid = false
  } else if (!isValidEmail(email)) {
    showFieldError("email", "Email inválido")
    isValid = false
  }

  // Validação de senha
  if (!password) {
    showFieldError("password", "Senha é obrigatória")
    isValid = false
  } else if (password.length < 6) {
    showFieldError("password", "Senha deve ter pelo menos 6 caracteres")
    isValid = false
  }

  return isValid
}

// Auxiliar para validação de email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Mostrar erro em campo específico
function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId)
  field.classList.add("error")

  // Criar ou atualizar mensagem de erro
  let errorElement = field.parentNode.querySelector(".error-message")
  if (!errorElement) {
    errorElement = document.createElement("div")
    errorElement.className = "error-message"
    field.parentNode.appendChild(errorElement)
  }

  errorElement.textContent = message
  errorElement.classList.add("show")
}

// Limpar todos os erros
function clearErrors() {
  // Remover classes de erro dos inputs
  document.querySelectorAll(".form-control.error").forEach((input) => {
    input.classList.remove("error")
  })

  // Esconder mensagens de erro
  document.querySelectorAll(".error-message.show").forEach((error) => {
    error.classList.remove("show")
  })

  // Esconder mensagem de erro geral
  const generalError = document.querySelector(".error-message.general")
  if (generalError) {
    generalError.remove()
  }
}

// Mostrar mensagem de erro geral
function showError(message) {
  // Remover erro existente
  const existingError = document.querySelector(".error-message.general")
  if (existingError) {
    existingError.remove()
  }

  // Criar elemento de erro
  const errorElement = document.createElement("div")
  errorElement.className = "error-message general show"
  errorElement.textContent = message
  errorElement.style.cssText = `
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 20px;
        text-align: center;
    `

  // Inserir antes do formulário
  const form = document.getElementById("loginForm")
  form.parentNode.insertBefore(errorElement, form)
}

// Mostrar mensagem de sucesso
function showSuccess(message) {
  // Remover mensagens existentes
  const existingError = document.querySelector(".error-message.general")
  if (existingError) {
    existingError.remove()
  }

  // Criar elemento de sucesso
  const successElement = document.createElement("div")
  successElement.className = "success-message show"
  successElement.textContent = message

  // Inserir antes do formulário
  const form = document.getElementById("loginForm")
  form.parentNode.insertBefore(successElement, form)
}

// Mostrar estado de carregamento
function showLoading(button) {
  button.classList.add("loading")
  button.disabled = true
  button.textContent = "Entrando..."
}

// Esconder estado de carregamento
function hideLoading(button) {
  button.classList.remove("loading")
  button.disabled = false
  button.textContent = "Entrar"
}

// Manipular "esqueci a senha"
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("forgot-password")) {
    e.preventDefault()
    alert("Funcionalidade de recuperação de senha será implementada em breve!")
  }

  if (e.target.classList.contains("signup-link-text")) {
    e.preventDefault()
    alert("Funcionalidade de cadastro será implementada em breve!")
  }
})

// Adicionar suporte a tecla Enter
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && document.activeElement.closest(".login-card")) {
    const submitButton = document.querySelector(".btn-login")
    if (submitButton && !submitButton.disabled) {
      submitButton.click()
    }
  }
})