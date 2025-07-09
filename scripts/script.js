import { apiService } from './api-service.js';

// Quando o conteúdo DOM estiver carregado
document.addEventListener("DOMContentLoaded", async () => {
  // Inicializar funcionalidades básicas
  initSmoothScrolling()
  initNavbarScroll()
  initCarousel()
  initGalleryHover()
  
  // Fazer login automático e carregar dados
  await autoLoginAndLoadData()
})

// Rolagem suave para links de navegação
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        const offsetTop = target.offsetTop - 70 // Considerar navbar fixa
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }
    })
  })
}

// Mudança de fundo da navbar ao rolar
function initNavbarScroll() {
  const navbar = document.querySelector(".navbar")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.style.backgroundColor = "rgba(255, 255, 255, 0.95)"
      navbar.style.backdropFilter = "blur(10px)"
    } else {
      navbar.style.backgroundColor = "white"
      navbar.style.backdropFilter = "none"
    }
  })
}



async function autoLoginAndLoadData() {
  try {
    console.log('Fazendo login automático...');
    
    // Fazer login com credenciais fixas
    const loginResponse = await apiService.login('masteradmin@gmail.com', '123456');
    
    if (loginResponse.data && loginResponse.data.token) {
      // Salvar token no localStorage
      localStorage.setItem('authToken', loginResponse.data.token);
      console.log('Login realizado com sucesso! Token salvo.');
      
      // Carregar dados após login
      await loadBlogPosts();
      await loadEvents();
    } else {
      console.error('Resposta de login inválida:', loginResponse);
    }
  } catch (error) {
    console.error('Erro no login automático:', error);
    // Tentar carregar dados sem autenticação (endpoints públicos)
    await loadBlogPosts();
    await loadEvents();
  }
}

async function loadBlogPosts() {
  try {
    const response = await apiService.getPosts();
    // A API retorna { data, message }
    const posts = response.data;
    renderBlogPosts(posts);
  } catch (error) {
    console.error('Erro ao carregar posts:', error);
  }
}

async function loadEvents() {
  try {
    const response = await apiService.getEvents();
    // A API retorna { data, message }
    const events = response.data;
    renderEvents(events);
  } catch (error) {
    console.error('Erro ao carregar eventos:', error);
  }
}

function renderBlogPosts(posts) {
  const blogContainer = document.querySelector('#blog .row');
  if (!blogContainer) return;
  
  blogContainer.innerHTML = posts.map(post => `
    <div class="col-lg-4 mb-4">
      <div class="blog-card">
        <img src="${post.image || 'assets/teixeira-judo-logo.png'}" alt="${post.titulo}" class="blog-img">
        <div class="blog-content">
          <h4>${post.titulo}</h4>
          <p>${post.conteudo ? post.conteudo.substring(0, 100) + '...' : ''}</p>
          <a href="#" class="read-more" data-id="${post.idPost}">Ler mais</a>
        </div>
      </div>
    </div>
  `).join('');

  // Adiciona event listeners
  document.querySelectorAll('.read-more').forEach(link => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      const postId = link.getAttribute('data-id');
      const post = posts.find(p => p.idPost == postId);
      if (post) openBlogPostModal(post);
    });
  });
}

function renderEvents(events) {
  const agendaContainer = document.querySelector('#agenda .row');
  if (!agendaContainer) return;
  
  agendaContainer.innerHTML = events.map(event => {
    const eventDate = new Date(event.dataInicio);
    return `
      <div class="col-lg-6 mb-4">
        <div class="agenda-card d-flex">
          <div class="agenda-date">
            <span class="day">${eventDate.getDate()}</span>
            <span class="month">${eventDate.toLocaleString('pt-BR', { month: 'short' }).toUpperCase()}</span>
          </div>
          <div class="agenda-content flex-grow-1">
            <h4>${event.titulo}</h4>
            <p>${event.descricao}</p>
            <div class="agenda-details">
              <span>${event.local}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Validação de email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Mostrar mensagens de alerta
function showAlert(message, type) {
  // Remover alertas existentes
  const existingAlert = document.querySelector(".custom-alert")
  if (existingAlert) {
    existingAlert.remove()
  }

  // Criar elemento de alerta
  const alert = document.createElement("div")
  alert.className = `custom-alert alert-${type}`
  alert.innerHTML = `
        <div class="alert-content">
            <span class="alert-icon">${type === "success" ? "✓" : "⚠"}</span>
            <span class="alert-message">${message}</span>
            <button class="alert-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `

  // Adicionar estilos
  alert.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        background: ${type === "success" ? "#d4edda" : "#f8d7da"};
        color: ${type === "success" ? "#155724" : "#721c24"};
        border: 1px solid ${type === "success" ? "#c3e6cb" : "#f5c6cb"};
        border-radius: 8px;
        padding: 15px 20px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `

  // Adicionar estilos de animação
  if (!document.querySelector("#alert-styles")) {
    const style = document.createElement("style")
    style.id = "alert-styles"
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
                font-size: 20px;
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

  // Remover automaticamente após 5 segundos
  setTimeout(() => {
    if (alert.parentElement) {
      alert.remove()
    }
  }, 5000)
}

// Inicializar carrossel
function initCarousel() {
  const carousel = document.querySelector("#testimonialsCarousel")
  if (carousel) {
    const myCarousel = new bootstrap.Carousel(carousel, {
      interval: 5000,
      wrap: true,
      pause: "hover",
    })
  }
}

// Efeitos de hover na galeria
function initGalleryHover() {
  const galleryImages = document.querySelectorAll(".gallery-img")

  galleryImages.forEach((img) => {
    img.addEventListener("click", function () {
      openImageModal(this.src, this.alt)
    })
  })
}

// Abrir imagem em modal
function openImageModal(src, alt) {
  // Criar modal se não existir
  let modal = document.getElementById("imageModal")
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "imageModal";
    modal.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-content">
          <img id="modalImage" src="/placeholder.svg" alt="">
          <button class="modal-close">×</button>
        </div>
      </div>
    `;

    // Adicionar estilos do modal
    modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: none;
        `

    // Adicionar CSS do modal
    if (!document.querySelector("#modal-styles")) {
      const style = document.createElement("style")
      style.id = "modal-styles"
      style.textContent = `
                .modal-overlay {
                    background: rgba(0,0,0,0.9);
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                .modal-content {
                    position: relative;
                    max-width: 90%;
                    max-height: 90%;
                }
                #modalImage {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                    border-radius: 8px;
                }
                .modal-close {
                    position: absolute;
                    top: -40px;
                    right: 0;
                    background: white;
                    border: none;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    font-size: 18px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            `
      document.head.appendChild(style)
    }

    document.body.appendChild(modal);

    // Adicionar event listeners programaticamente
    modal.querySelector('.modal-close').addEventListener('click', closeImageModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeImageModal);
    modal.querySelector('.modal-content').addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }

  // Definir imagem e mostrar modal
  document.getElementById("modalImage").src = src
  document.getElementById("modalImage").alt = alt
  modal.style.display = "block"
  document.body.style.overflow = "hidden"
}

// Fechar modal de imagem
function closeImageModal() {
  const modal = document.getElementById("imageModal")
  if (modal) {
    modal.style.display = "none"
    document.body.style.overflow = "auto"
  }
}

// Animações de rolagem
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observar elementos para animação
  document.querySelectorAll(".about-card, .blog-card, .partner-card").forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })
}

// Inicializar animações de rolagem quando a página carregar
window.addEventListener("load", initScrollAnimations)

// Função utilitária para lidar com navegação responsiva
function handleResponsiveNav() {
  const navbarToggler = document.querySelector(".navbar-toggler")
  const navbarCollapse = document.querySelector(".navbar-collapse")

  if (navbarToggler && navbarCollapse) {
    // Fechar menu mobile ao clicar em um link
    document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        if (navbarCollapse.classList.contains("show")) {
          navbarToggler.click()
        }
      })
    })
  }
}

// Inicializar navegação responsiva
handleResponsiveNav()

// Lidar com redimensionamento da janela
window.addEventListener("resize", () => {
  // Fechar menu mobile ao redimensionar
  const navbarCollapse = document.querySelector(".navbar-collapse")
  if (navbarCollapse && navbarCollapse.classList.contains("show")) {
    navbarCollapse.classList.remove("show")
  }
})

// Lidar especificamente com o link de acesso restrito
document.addEventListener("click", (e) => {
  if (e.target.textContent === "Acesso Restrito" || e.target.href?.includes("login.html")) {
    // Permitir navegação normal para a página de login
    return true
  }
})

// Garantir que o link de login funcione corretamente
function handleLoginLink() {
  const loginLinks = document.querySelectorAll('a[href="login.html"]')
  loginLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      // Não prevenir o comportamento padrão - permitir navegação normal
      window.location.href = "login.html"
    })
  })
}

// Inicializar manipulação do link de login
handleLoginLink()

// Manipular links "ler mais" do blog
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("read-more")) {
    e.preventDefault()

    // Encontrar o card do blog
    const blogCard = e.target.closest(".blog-card")
    if (blogCard) {
      const postTitle = blogCard.querySelector("h4").textContent

      // Encontrar os dados do post
      const post = blogPosts.find((p) => p.title === postTitle)
      if (post) {
        openBlogPostModal(post)
      }
    }
  }
})

// Abrir modal de post do blog
function openBlogPostModal(post) {
  document.getElementById("blogPostModalTitle").textContent = post.titulo;
  document.getElementById("blogPostDate").textContent = formatBlogDate(post.dataPublicacao);
  document.getElementById("blogPostAuthor").textContent = post.usuario ? post.usuario.nome : "Admin";
  document.getElementById("blogPostImage").src = post.image || 'assets/teixeira-judo-logo.png';
  document.getElementById("blogPostImage").alt = post.titulo;
  document.getElementById("blogPostContent").innerHTML = post.conteudo;

  const modal = new bootstrap.Modal(document.getElementById("blogPostModal"));
  modal.show();
}

// Formatar data para o blog
function formatBlogDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}