import { apiService } from './api-service.js';

// Variáveis globais
let posts = []
let events = []
let currentEditingItem = null
let currentSection = "posts"

// Inicializar painel administrativo
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Verificar se há token
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Token não encontrado');
      window.location.href = 'login.html';
      return;
    }

    console.log('Token encontrado:', token);
    
    // Verificar autenticação (comentado temporariamente)
    // await apiService.verifyToken();
    initializeAdminPanel();
    loadAllData();
    setupEventListeners();
  } catch (error) {
    console.error('Falha na autenticação:', error);
    window.location.href = 'login.html';
  }
});

// Carregar todos os dados
async function loadAllData() {
  try {
    const postsResponse = await apiService.getPosts();
    const eventsResponse = await apiService.getEvents();
    
    // Extrair dados da resposta da API
    posts = postsResponse.data;
    events = eventsResponse.data;
    
    renderAllSections();
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    showAlert('Erro ao carregar dados', 'error');
  }
}

// Inicializar painel administrativo
function initializeAdminPanel() {
  const today = new Date().toISOString().split("T")[0]
  document.getElementById("postDate").value = today
  document.getElementById("eventDate").value = today
}

// Renderizar todas as seções
function renderAllSections() {
  renderPosts()
  renderEvents()
}

// Configurar listeners de eventos
function setupEventListeners() {
  setupNavigation()
  setupUserDropdown()
  setupMobileMenu()
  setupPostManagement()
  setupEventManagement()
  setupModalEvents()

  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.btn-delete');
    if (!btn) return;
    
    const id = btn.dataset.id;
    const type = btn.dataset.type;
    
    if (btn.classList.contains('btn-delete')) {
      deleteItem(type, id);
    }
  });
}

// Configurar navegação
function setupNavigation() {
  const navItems = document.querySelectorAll(".nav-item")

  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault()

      navItems.forEach((nav) => nav.classList.remove("active"))
      item.classList.add("active")

      const section = item.dataset.section
      showSection(section)
    })
  })
}

// Mostrar seção
function showSection(sectionName) {
  document.querySelectorAll(".content-section").forEach((section) => {
    section.classList.remove("active")
  })

  const targetSection = document.getElementById(`${sectionName}-section`)
  if (targetSection) {
    targetSection.classList.add("active")
  }
}

// Configurar dropdown do usuário
function setupUserDropdown() {
  const adminUser = document.querySelector(".admin-user");
  const dropdown = document.getElementById("userDropdown");

  adminUser.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("show");
  });

  document.addEventListener("click", () => {
    dropdown.classList.remove("show");
  });

  // Adicionar logout
  document.querySelector('[href="index.html"]').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('authToken');
    window.location.href = 'index.html';
  });
}

// Configurar menu mobile
function setupMobileMenu() {
  const menuToggle = document.getElementById("menuToggle")
  const sidebar = document.getElementById("adminSidebar")

  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("show")
  })

  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 768) {
      if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
        sidebar.classList.remove("show")
      }
    }
  })
}

// Configurar gerenciamento de posts
function setupPostManagement() {
  document.getElementById("newPostBtn").addEventListener("click", () => {
    openPostModal()
  })

  document.getElementById("savePostBtn").addEventListener("click", () => {
    savePost()
  })
}

// Configurar gerenciamento de eventos
function setupEventManagement() {
  document.getElementById("newEventBtn").addEventListener("click", () => {
    openEventModal()
  })

  document.getElementById("saveEventBtn").addEventListener("click", () => {
    saveEvent()
  })
}

// Configurar eventos dos modais
function setupModalEvents() {
  const modals = ["postModal", "eventModal"]

  modals.forEach((modalId) => {
    const modal = document.getElementById(modalId)
    modal.addEventListener("hidden.bs.modal", () => {
      resetForm(modalId.replace("Modal", ""))
    })
  })

  document.getElementById("confirmDeleteBtn").addEventListener("click", () => {
    confirmDelete()
  })
}



// Renderizar posts
function renderPosts() {
  const tbody = document.getElementById("postsTableBody");

  if (posts.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" class="text-center py-5"> <!-- Ajustado de 4 para 3 colunas -->
          <div class="empty-state">
            <i class="fas fa-blog"></i>
            <h3>Nenhum post ainda</h3>
            <p>Crie seu primeiro post do blog para começar.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = posts.map(post => `
    <tr>
      <td>${post.titulo}</td>
      <td>${formatDate(post.dataPublicacao)}</td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-delete btn-sm" data-id="${post.idPost}" data-type="post">
            Excluir
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

// Renderizar eventos
function renderEvents() {
  const tbody = document.getElementById("eventsTableBody")

  if (events.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center py-5">
          <div class="empty-state">
            <i class="fas fa-calendar"></i>
            <h3>Nenhum evento ainda</h3>
            <p>Crie seu primeiro evento para começar.</p>
          </div>
        </td>
      </tr>
    `
    return
  }

  tbody.innerHTML = events
    .map(
      (event) => `
    <tr>
      <td>${event.titulo}</td>
      <td>${formatDate(event.dataInicio)}</td>
      <td>${event.local}</td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-delete btn-sm" onclick="deleteItem('event', ${event.idEvento})">
            Excluir
          </button>
        </div>
      </td>
    </tr>
  `
    )
    .join("")
}



// Formatar data
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("pt-BR")
}

// Funções de modal
function openPostModal() {
  const modal = new bootstrap.Modal(document.getElementById("postModal"))
  const modalTitle = document.getElementById("postModalTitle")

  modalTitle.textContent = "Novo Post"
  resetForm("post")
  currentEditingItem = null

  modal.show()
}

function openEventModal() {
  const modal = new bootstrap.Modal(document.getElementById("eventModal"))
  const modalTitle = document.getElementById("eventModalTitle")

  modalTitle.textContent = "Novo Evento"
  resetForm("event")
  currentEditingItem = null

  modal.show()
}



// Funções para resetar formulários
function resetForm(type) {
  const forms = {
    post: "postForm",
    event: "eventForm",
  }

  const form = document.getElementById(forms[type])
  if (form) {
    form.reset()

    if (type === "post" || type === "event") {
      const today = new Date().toISOString().split("T")[0]
      const dateField = document.getElementById(`${type}Date`)
      if (dateField) dateField.value = today
    }
  }

  currentEditingItem = null
}

// Funções de salvamento
async function savePost() {
  const form = document.getElementById("postForm");
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const postData = {
    titulo: document.getElementById("postTitle").value,
    conteudo: document.getElementById("postContent").value,
    dataPublicacao: document.getElementById("postDate").value + "T00:00:00",
  };

  try {
    saveWithLoading("savePostBtn", "Salvando...", async () => {
      await apiService.createPost(postData);
      await loadAllData();
      closeModal("postModal");
      showAlert("Post criado com sucesso!", "success");
    });
  } catch (error) {
    console.error('Erro ao salvar post:', error);
    showAlert('Erro ao salvar post', 'error');
  }
}

async function saveEvent() {
  const form = document.getElementById("eventForm");
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const eventData = {
    titulo: document.getElementById("eventTitle").value,
    descricao: document.getElementById("eventDescription").value,
    dataInicio: document.getElementById("eventDate").value + "T" + document.getElementById("eventTimeStart").value + ":00",
    dataFim: document.getElementById("eventDate").value + "T" + document.getElementById("eventTimeEnd").value + ":00",
    local: document.getElementById("eventLocation").value,
  };

  try {
    saveWithLoading("saveEventBtn", "Salvando...", async () => {
      await apiService.createEvent(eventData);
      await loadAllData();
      closeModal("eventModal");
      showAlert("Evento criado com sucesso!", "success");
    });
  } catch (error) {
    console.error('Erro ao salvar evento:', error);
    showAlert('Erro ao salvar evento', 'error');
  }
}



// Funções de exclusão
function deleteItem(type, id) {
  currentSection = type
  currentEditingItem = { type, id }
  const modal = new bootstrap.Modal(document.getElementById("deleteModal"))
  modal.show()
}

async function confirmDelete() {
  if (!currentEditingItem) return;

  const { type, id } = currentEditingItem;

  try {
    saveWithLoading("confirmDeleteBtn", "Excluindo...", async () => {
      switch (type) {
        case "post":
          await apiService.deletePost(id);
          break;
        case "event":
          await apiService.deleteEvent(id);
          break;
      }
      await loadAllData();
      closeModal("deleteModal");
      showAlert("Item excluído com sucesso!", "success");
      currentEditingItem = null;
    });
  } catch (error) {
    console.error('Erro ao excluir:', error);
    showAlert('Erro ao excluir item', 'error');
  }
}

// Funções utilitárias
function saveWithLoading(buttonId, loadingText, callback) {
  const button = document.getElementById(buttonId)
  const originalText = button.textContent

  button.innerHTML = `<span class="spinner"></span> ${loadingText}`
  button.disabled = true

  setTimeout(() => {
    callback()
    button.textContent = originalText
    button.disabled = false
  }, 1000)
}

function closeModal(modalId) {
  const modal = bootstrap.Modal.getInstance(document.getElementById(modalId))
  if (modal) modal.hide()
}

function showAlert(message, type) {
  const existingAlert = document.querySelector(".admin-alert")
  if (existingAlert) existingAlert.remove()

  const alert = document.createElement("div")
  alert.className = `admin-alert alert-${type}`
  alert.innerHTML = `
    <div class="alert-content">
      <span class="alert-icon">${type === "success" ? "✓" : type === "error" ? "⚠" : "ℹ"}</span>
      <span class="alert-message">${message}</span>
      <button class="alert-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `

  const colors = {
    success: { bg: "#d4edda", color: "#155724", border: "#c3e6cb" },
    error: { bg: "#f8d7da", color: "#721c24", border: "#f5c6cb" },
    info: { bg: "#d1ecf1", color: "#0c5460", border: "#bee5eb" },
  }

  const colorScheme = colors[type] || colors.info

  alert.style.cssText = `
    position: fixed;
    top: 90px;
    right: 20px;
    z-index: 9999;
    background: ${colorScheme.bg};
    color: ${colorScheme.color};
    border: 1px solid ${colorScheme.border};
    border-radius: 8px;
    padding: 15px 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    max-width: 400px;
    animation: slideIn 0.3s ease-out;
  `

  if (!document.querySelector("#admin-alert-styles")) {
    const style = document.createElement("style")
    style.id = "admin-alert-styles"
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      .alert-content {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .alert-close {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        margin-left: auto;
        opacity: 0.7;
      }
      .alert-close:hover {
        opacity: 1;
      }
    `
    document.head.appendChild(style)
  }

  document.body.appendChild(alert)

  setTimeout(() => {
    if (alert.parentElement) alert.remove()
  }, 5000)
}

// Lidar com redimensionamento da janela
window.addEventListener("resize", () => {
  const sidebar = document.getElementById("adminSidebar")
  if (window.innerWidth > 768) {
    sidebar.classList.remove("show")
  }
})