// Variáveis globais
let posts = []
let events = []
let galleryImages = []
let testimonials = []
let currentEditingItem = null
let currentSection = "posts"

// Inicializar painel administrativo
document.addEventListener("DOMContentLoaded", () => {
  initializeAdminPanel()
  loadAllData()
  setupEventListeners()
})

// Inicializar painel administrativo
function initializeAdminPanel() {
  // Definir data atual como padrão para novos posts e eventos
  const today = new Date().toISOString().split("T")[0]
  document.getElementById("postDate").value = today
  document.getElementById("eventDate").value = today

  // Carregar dados iniciais
  loadSampleData()
}

// Carregar dados de exemplo
function loadSampleData() {
  // Posts de exemplo
  posts = [
    {
      id: 1,
      title: "Como o projeto tem transformado vidas",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      excerpt:
        "Descubra como nosso projeto social tem impactado positivamente a vida de centenas de pessoas através do judô.",
      date: "2024-01-15",
      status: "published",
      image: "/placeholder.svg?height=200&width=400",
      author: "Admin",
    },
    {
      id: 2,
      title: "Resultados do último evento",
      content: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
      excerpt: "Confira os resultados e destaques do nosso último evento de judô realizado no centro comunitário.",
      date: "2024-01-10",
      status: "draft",
      image: "/placeholder.svg?height=200&width=400",
      author: "Admin",
    },
  ]

  // Eventos de exemplo
  events = [
    {
      id: 1,
      title: "Workshop de Desenvolvimento Pessoal",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      date: "2024-06-15",
      time: "14:00 - 17:00",
      location: "Centro Comunitário",
    },
    {
      id: 2,
      title: "Palestra Motivacional",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      date: "2024-06-22",
      time: "19:00 - 21:00",
      location: "Auditório Principal",
    },
  ]

  // Imagens da galeria de exemplo
  galleryImages = [
    {
      id: 1,
      title: "Treino de Judô - Crianças",
      description: "Aula de judô para crianças no dojo principal",
      image: "/placeholder.svg?height=250&width=400",
      uploadDate: "2024-01-15",
    },
    {
      id: 2,
      title: "Competição Regional",
      description: "Participação na competição regional de judô",
      image: "/placeholder.svg?height=250&width=400",
      uploadDate: "2024-01-10",
    },
  ]

  // Depoimentos de exemplo
  testimonials = [
    {
      id: 1,
      name: "Rodrigo da Silva",
      role: "Participante",
      text: "Uma experiência transformadora que mudou minha perspectiva.",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "Maria Santos",
      role: "Mãe de Aluno",
      text: "Meu filho desenvolveu disciplina e respeito através do judô.",
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  renderAllSections()
}

// Carregar todos os dados
function loadAllData() {
  renderAllSections()
}

// Renderizar todas as seções
function renderAllSections() {
  renderPosts()
  renderEvents()
  renderGallery()
  renderTestimonials()
}

// Configurar listeners de eventos
function setupEventListeners() {
  setupNavigation()
  setupUserDropdown()
  setupMobileMenu()
  setupPostManagement()
  setupEventManagement()
  setupGalleryManagement()
  setupTestimonialManagement()
  setupModalEvents()
  setupFileUploads()
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
  const adminUser = document.querySelector(".admin-user")
  const dropdown = document.getElementById("userDropdown")

  adminUser.addEventListener("click", (e) => {
    e.stopPropagation()
    dropdown.classList.toggle("show")
  })

  document.addEventListener("click", () => {
    dropdown.classList.remove("show")
  })
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

// Configurar gerenciamento da galeria
function setupGalleryManagement() {
  document.getElementById("uploadImageBtn").addEventListener("click", () => {
    openGalleryModal()
  })

  document.getElementById("saveGalleryImageBtn").addEventListener("click", () => {
    saveGalleryImage()
  })
}

// Configurar gerenciamento de depoimentos
function setupTestimonialManagement() {
  document.getElementById("newTestimonialBtn").addEventListener("click", () => {
    openTestimonialModal()
  })

  document.getElementById("saveTestimonialBtn").addEventListener("click", () => {
    saveTestimonial()
  })
}

// Configurar eventos dos modais
function setupModalEvents() {
  const modals = ["postModal", "eventModal", "galleryModal", "testimonialModal"]

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

// Configurar uploads de arquivos
function setupFileUploads() {
  setupImagePreview("postImageFile", "postImagePreview")
  setupImagePreview("galleryImageFile", "galleryImagePreview")
  setupImagePreview("testimonialImageFile", "testimonialImagePreview")
}

// Configurar pré-visualização de imagem
function setupImagePreview(inputId, previewId) {
  const input = document.getElementById(inputId)
  const preview = document.getElementById(previewId)

  input.addEventListener("change", (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`
      }
      reader.readAsDataURL(file)
    } else {
      preview.innerHTML = ""
    }
  })
}

// Renderizar posts
function renderPosts() {
  const tbody = document.getElementById("postsTableBody")

  if (posts.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center py-5">
          <div class="empty-state">
            <i class="fas fa-blog"></i>
            <h3>Nenhum post ainda</h3>
            <p>Crie seu primeiro post do blog para começar.</p>
          </div>
        </td>
      </tr>
    `
    return
  }

  tbody.innerHTML = posts
    .map(
      (post) => `
    <tr>
      <td>
        <div class="post-title">${post.title}</div>
      </td>
      <td>${formatDate(post.date)}</td>
      <td>
        <span class="status-badge status-${post.status === "published" ? "publicado" : "rascunho"}">
          ${post.status === "published" ? "Publicado" : "Rascunho"}
        </span>
      </td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-edit btn-sm" onclick="editPost(${post.id})">
            Editar
          </button>
          <button class="btn btn-delete btn-sm" onclick="deleteItem('post', ${post.id})">
            Excluir
          </button>
        </div>
      </td>
    </tr>
  `,
    )
    .join("")
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
      <td>${event.title}</td>
      <td>${formatDate(event.date)}</td>
      <td>${event.time}</td>
      <td>${event.location}</td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-edit btn-sm" onclick="editEvent(${event.id})">
            Editar
          </button>
          <button class="btn btn-delete btn-sm" onclick="deleteItem('event', ${event.id})">
            Excluir
          </button>
        </div>
      </td>
    </tr>
  `,
    )
    .join("")
}

// Renderizar galeria
function renderGallery() {
  const grid = document.getElementById("galleryGrid")

  if (galleryImages.length === 0) {
    grid.innerHTML = `
      <div class="col-12">
        <div class="empty-state">
          <i class="fas fa-images"></i>
          <h3>Nenhuma imagem ainda</h3>
          <p>Envie sua primeira imagem para a galeria.</p>
        </div>
      </div>
    `
    return
  }

  grid.innerHTML = galleryImages
    .map(
      (image) => `
  <div class="gallery-item fade-in">
    <img src="${image.image}" alt="${image.title}">
    <div class="gallery-item-overlay">
      <div class="gallery-item-title">${image.title}</div>
      <div class="gallery-item-actions">
        <button class="btn btn-delete btn-sm" onclick="deleteItem('gallery', ${image.id})">
          Excluir
        </button>
      </div>
    </div>
  </div>
`,
    )
    .join("")
}

// Renderizar depoimentos
function renderTestimonials() {
  const tbody = document.getElementById("testimonialsTableBody")

  if (testimonials.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center py-5">
          <div class="empty-state">
            <i class="fas fa-quote-left"></i>
            <h3>Nenhum depoimento ainda</h3>
            <p>Adicione o primeiro depoimento.</p>
          </div>
        </td>
      </tr>
    `
    return
  }

  tbody.innerHTML = testimonials
    .map(
      (testimonial) => `
    <tr>
      <td>
        <div class="testimonial-preview">
          <img src="${testimonial.image}" alt="${testimonial.name}">
          <div class="testimonial-preview-content">
            <div class="testimonial-preview-name">${testimonial.name}</div>
          </div>
        </div>
      </td>
      <td>${testimonial.role}</td>
      <td>
        <div class="testimonial-preview-text">${testimonial.text}</div>
      </td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-edit btn-sm" onclick="editTestimonial(${testimonial.id})">
            Editar
          </button>
          <button class="btn btn-delete btn-sm" onclick="deleteItem('testimonial', ${testimonial.id})">
            Excluir
          </button>
        </div>
      </td>
    </tr>
  `,
    )
    .join("")
}

// Formatar data
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("pt-BR")
}

// Funções de modal
function openPostModal(post = null) {
  const modal = new bootstrap.Modal(document.getElementById("postModal"))
  const modalTitle = document.getElementById("postModalTitle")

  if (post) {
    modalTitle.textContent = "Editar Post"
    fillPostForm(post)
    currentEditingItem = post
  } else {
    modalTitle.textContent = "Novo Post"
    resetForm("post")
    currentEditingItem = null
  }

  modal.show()
}

function openEventModal(event = null) {
  const modal = new bootstrap.Modal(document.getElementById("eventModal"))
  const modalTitle = document.getElementById("eventModalTitle")

  if (event) {
    modalTitle.textContent = "Editar Evento"
    fillEventForm(event)
    currentEditingItem = event
  } else {
    modalTitle.textContent = "Novo Evento"
    resetForm("event")
    currentEditingItem = null
  }

  modal.show()
}

function openGalleryModal() {
  const modal = new bootstrap.Modal(document.getElementById("galleryModal"))
  resetForm("gallery")
  modal.show()
}

function openTestimonialModal(testimonial = null) {
  const modal = new bootstrap.Modal(document.getElementById("testimonialModal"))
  const modalTitle = document.getElementById("testimonialModalTitle")

  if (testimonial) {
    modalTitle.textContent = "Editar Depoimento"
    fillTestimonialForm(testimonial)
    currentEditingItem = testimonial
  } else {
    modalTitle.textContent = "Novo Depoimento"
    resetForm("testimonial")
    currentEditingItem = null
  }

  modal.show()
}

// Funções para preencher formulários
function fillPostForm(post) {
  document.getElementById("postId").value = post.id
  document.getElementById("postTitle").value = post.title
  document.getElementById("postContent").value = post.content
  document.getElementById("postStatus").value = post.status
  document.getElementById("postDate").value = post.date
  document.getElementById("postExcerpt").value = post.excerpt || ""

  if (post.image) {
    document.getElementById("postImagePreview").innerHTML = `<img src="${post.image}" alt="Preview">`
  }
}

function fillEventForm(event) {
  document.getElementById("eventId").value = event.id
  document.getElementById("eventTitle").value = event.title
  document.getElementById("eventDescription").value = event.description
  document.getElementById("eventDate").value = event.date
  document.getElementById("eventTime").value = event.time
  document.getElementById("eventLocation").value = event.location
}

function fillTestimonialForm(testimonial) {
  document.getElementById("testimonialId").value = testimonial.id
  document.getElementById("testimonialName").value = testimonial.name
  document.getElementById("testimonialRole").value = testimonial.role
  document.getElementById("testimonialText").value = testimonial.text

  if (testimonial.image) {
    document.getElementById("testimonialImagePreview").innerHTML = `<img src="${testimonial.image}" alt="Preview">`
  }
}

// Funções para resetar formulários
function resetForm(type) {
  const forms = {
    post: "postForm",
    event: "eventForm",
    gallery: "galleryForm",
    testimonial: "testimonialForm",
  }

  const form = document.getElementById(forms[type])
  if (form) {
    form.reset()

    // Limpar pré-visualizações
    const previews = form.querySelectorAll(".image-preview")
    previews.forEach((preview) => (preview.innerHTML = ""))

    // Definir datas padrão
    if (type === "post" || type === "event") {
      const today = new Date().toISOString().split("T")[0]
      const dateField = document.getElementById(`${type}Date`)
      if (dateField) dateField.value = today
    }
  }

  currentEditingItem = null
}

// Funções de salvamento
function savePost() {
  const form = document.getElementById("postForm")
  if (!form.checkValidity()) {
    form.reportValidity()
    return
  }

  const fileInput = document.getElementById("postImageFile")
  let imageUrl = currentEditingItem?.image || "/placeholder.svg?height=200&width=400"

  if (fileInput.files[0]) {
    imageUrl = URL.createObjectURL(fileInput.files[0])
  }

  const postData = {
    id: document.getElementById("postId").value || Date.now(),
    title: document.getElementById("postTitle").value,
    content: document.getElementById("postContent").value,
    status: document.getElementById("postStatus").value,
    date: document.getElementById("postDate").value,
    image: imageUrl,
    excerpt: document.getElementById("postExcerpt").value,
    author: "Admin",
  }

  saveWithLoading("savePostBtn", "Salvando...", () => {
    if (currentEditingItem) {
      const index = posts.findIndex((p) => p.id == postData.id)
      if (index !== -1) posts[index] = postData
    } else {
      posts.unshift(postData)
    }

    renderPosts()
    closeModal("postModal")
    showAlert("Post salvo com sucesso!", "success")
  })
}

function saveEvent() {
  const form = document.getElementById("eventForm")
  if (!form.checkValidity()) {
    form.reportValidity()
    return
  }

  const eventData = {
    id: document.getElementById("eventId").value || Date.now(),
    title: document.getElementById("eventTitle").value,
    description: document.getElementById("eventDescription").value,
    date: document.getElementById("eventDate").value,
    time: document.getElementById("eventTime").value,
    location: document.getElementById("eventLocation").value,
  }

  saveWithLoading("saveEventBtn", "Salvando...", () => {
    if (currentEditingItem) {
      const index = events.findIndex((e) => e.id == eventData.id)
      if (index !== -1) events[index] = eventData
    } else {
      events.unshift(eventData)
    }

    renderEvents()
    closeModal("eventModal")
    showAlert("Evento salvo com sucesso!", "success")
  })
}

function saveGalleryImage() {
  const form = document.getElementById("galleryForm")
  if (!form.checkValidity()) {
    form.reportValidity()
    return
  }

  const fileInput = document.getElementById("galleryImageFile")
  if (!fileInput.files[0]) {
    showAlert("Por favor, selecione uma imagem.", "error")
    return
  }

  const imageData = {
    id: Date.now(),
    title: document.getElementById("galleryImageTitle").value,
    description: document.getElementById("galleryImageDescription").value,
    image: URL.createObjectURL(fileInput.files[0]),
    uploadDate: new Date().toISOString().split("T")[0],
  }

  saveWithLoading("saveGalleryImageBtn", "Enviando...", () => {
    galleryImages.unshift(imageData)
    renderGallery()
    closeModal("galleryModal")
    showAlert("Imagem enviada com sucesso!", "success")
  })
}

function saveTestimonial() {
  const form = document.getElementById("testimonialForm")
  if (!form.checkValidity()) {
    form.reportValidity()
    return
  }

  const fileInput = document.getElementById("testimonialImageFile")
  let imageUrl = currentEditingItem?.image || "/placeholder.svg?height=100&width=100"

  if (fileInput.files[0]) {
    imageUrl = URL.createObjectURL(fileInput.files[0])
  }

  const testimonialData = {
    id: document.getElementById("testimonialId").value || Date.now(),
    name: document.getElementById("testimonialName").value,
    role: document.getElementById("testimonialRole").value,
    text: document.getElementById("testimonialText").value,
    image: imageUrl,
  }

  saveWithLoading("saveTestimonialBtn", "Salvando...", () => {
    if (currentEditingItem) {
      const index = testimonials.findIndex((t) => t.id == testimonialData.id)
      if (index !== -1) testimonials[index] = testimonialData
    } else {
      testimonials.unshift(testimonialData)
    }

    renderTestimonials()
    closeModal("testimonialModal")
    showAlert("Depoimento salvo com sucesso!", "success")
  })
}

// Funções de edição
function editPost(postId) {
  const post = posts.find((p) => p.id == postId)
  if (post) openPostModal(post)
}

function editEvent(eventId) {
  const event = events.find((e) => e.id == eventId)
  if (event) openEventModal(event)
}

// Funções de exclusão
function deleteItem(type, id) {
  currentSection = type
  currentEditingItem = { type, id }
  const modal = new bootstrap.Modal(document.getElementById("deleteModal"))
  modal.show()
}

function confirmDelete() {
  if (!currentEditingItem) return

  const { type, id } = currentEditingItem

  saveWithLoading("confirmDeleteBtn", "Excluindo...", () => {
    switch (type) {
      case "post":
        posts = posts.filter((p) => p.id !== id)
        renderPosts()
        break
      case "event":
        events = events.filter((e) => e.id !== id)
        renderEvents()
        break
      case "gallery":
        galleryImages = galleryImages.filter((g) => g.id !== id)
        renderGallery()
        break
      case "testimonial":
        testimonials = testimonials.filter((t) => t.id !== id)
        renderTestimonials()
        break
    }

    closeModal("deleteModal")
    showAlert("Item excluído com sucesso!", "success")
    currentEditingItem = null
  })
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