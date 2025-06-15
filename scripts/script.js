// Quando o conteúdo DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar todas as funcionalidades
  initSmoothScrolling()
  initNavbarScroll()
  initContactForm()
  initCarousel()
  initGalleryHover()
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

// Manipulação do formulário de contato
function initContactForm() {
  const contactForm = document.getElementById("contactForm")

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault()

      // Obter dados do formulário
      const formData = new FormData(this)
      const name = formData.get("name") || document.getElementById("name").value
      const email = formData.get("email") || document.getElementById("email").value
      const message = formData.get("message") || document.getElementById("message").value

      // Validação básica
      if (!name || !email || !message) {
        showAlert("Por favor, preencha todos os campos.", "error")
        return
      }

      if (!isValidEmail(email)) {
        showAlert("Por favor, insira um email válido.", "error")
        return
      }

      // Simular envio do formulário
      showAlert("Mensagem enviada com sucesso! Entraremos em contato em breve.", "success")
      this.reset()
    })
  }
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
    modal = document.createElement("div")
    modal.id = "imageModal"
    modal.innerHTML = `
            <div class="modal-overlay" onclick="closeImageModal()">
                <div class="modal-content" onclick="event.stopPropagation()">
                    <img id="modalImage" src="/placeholder.svg" alt="">
                    <button class="modal-close" onclick="closeImageModal()">×</button>
                </div>
            </div>
        `

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

    document.body.appendChild(modal)
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

// Dados dos posts do blog
const blogPosts = [
  {
    id: 1,
    title: "Como o projeto tem transformado vidas",
    content: `
      <p>O projeto Teixeira Judô tem sido uma força transformadora em nossa comunidade, impactando positivamente a vida de centenas de pessoas através da prática do judô e valores fundamentais como disciplina, respeito e perseverança.</p>
      
      <h4>O Impacto na Comunidade</h4>
      <p>Desde o início do projeto, temos observado mudanças significativas na vida dos participantes. Crianças que antes tinham dificuldades de concentração na escola agora demonstram maior foco e disciplina em suas atividades acadêmicas.</p>
      
      <p>Os valores do judô - como respeito ao próximo, humildade e perseverança - têm se refletido não apenas no tatame, mas também no dia a dia dos nossos alunos, criando um efeito positivo que se estende às suas famílias e à comunidade como um todo.</p>
      
      <h5>Resultados Mensuráveis</h5>
      <p>Nos últimos dois anos, registramos:</p>
      <ul>
        <li>Melhoria de 85% no rendimento escolar dos participantes</li>
        <li>Redução de 70% em casos de indisciplina</li>
        <li>Aumento da autoestima em 90% dos alunos</li>
        <li>Fortalecimento dos laços familiares em 80% dos casos</li>
      </ul>
      
      <p>Estes números refletem o poder transformador do esporte quando aliado a uma metodologia pedagógica sólida e ao comprometimento de toda a equipe envolvida no projeto.</p>
      
      <h4>Histórias de Sucesso</h4>
      <p>Entre as muitas histórias inspiradoras, destacamos a de João, de 12 anos, que chegou ao projeto com sérios problemas de comportamento e hoje é um dos nossos principais exemplos de disciplina e liderança entre os colegas.</p>
      
      <p>Maria, mãe de uma de nossas alunas, relata: "Minha filha era muito tímida e tinha baixa autoestima. Depois que começou no judô, ela se tornou mais confiante e até passou a ajudar outros colegas na escola."</p>
      
      <p>Acreditamos que o judô pode ser uma ferramenta poderosa de transformação social, e continuaremos trabalhando para levar seus benefícios a cada vez mais pessoas em nossa comunidade.</p>
    `,
    excerpt:
      "Descubra como nosso projeto social tem impactado positivamente a vida de centenas de pessoas através do judô.",
    date: "2024-01-15",
    author: "Admin",
    image: "/placeholder.svg?height=400&width=800",
  },
  {
    id: 2,
    title: "Resultados do último evento",
    content: `
      <p>O último evento realizado pelo projeto Teixeira Judô foi um grande sucesso, reunindo mais de 200 participantes entre atletas, familiares e membros da comunidade em uma celebração do esporte e dos valores que defendemos.</p>
      
      <h4>Competições e Demonstrações</h4>
      <p>O evento contou com competições em diferentes categorias, desde iniciantes até faixas mais avançadas, proporcionando a todos os participantes a oportunidade de demonstrar suas habilidades e o progresso alcançado durante os treinamentos.</p>
      
      <p>As demonstrações técnicas foram um dos pontos altos do evento, mostrando a evolução dos alunos e a qualidade do ensino oferecido pelo projeto. Familiares e visitantes puderam acompanhar de perto o trabalho desenvolvido ao longo dos meses.</p>
      
      <h5>Premiações e Reconhecimentos</h5>
      <p>Além das medalhas tradicionais por colocação, criamos categorias especiais para reconhecer valores como:</p>
      <ul>
        <li>Maior evolução técnica</li>
        <li>Melhor espírito esportivo</li>
        <li>Dedicação aos estudos</li>
        <li>Liderança e cooperação</li>
      </ul>
      
      <h4>Atividades Paralelas</h4>
      <p>O evento não se limitou às competições. Organizamos também:</p>
      <ul>
        <li>Oficinas de primeiros socorros</li>
        <li>Palestras sobre nutrição esportiva</li>
        <li>Atividades recreativas para as famílias</li>
        <li>Exposição fotográfica do projeto</li>
      </ul>
      
      <p>Essas atividades complementares reforçaram o caráter educativo e comunitário do nosso projeto, envolvendo toda a família no processo de desenvolvimento dos jovens atletas.</p>
      
      <h4>Depoimentos dos Participantes</h4>
      <p><em>"Foi emocionante ver meu filho competindo e demonstrando tudo que aprendeu. O projeto realmente mudou nossa família para melhor."</em> - Ana Paula, mãe de participante.</p>
      
      <p><em>"Nunca imaginei que conseguiria chegar até aqui. O judô me ensinou que posso superar qualquer obstáculo."</em> - Carlos, 14 anos, faixa laranja.</p>
      
      <p>O sucesso deste evento nos motiva a continuar organizando atividades que fortaleçam os laços da comunidade e proporcionem novas oportunidades de crescimento para nossos alunos.</p>
    `,
    excerpt: "Confira os resultados e destaques do nosso último evento de judô realizado no centro comunitário.",
    date: "2024-01-10",
    author: "Admin",
    image: "/placeholder.svg?height=400&width=800",
  },
  {
    id: 3,
    title: "Novos parceiros se juntam ao projeto",
    content: `
      <p>Estamos muito felizes em anunciar que novos parceiros se juntaram ao projeto Teixeira Judô, fortalecendo ainda mais nossa capacidade de impactar positivamente a vida de crianças e jovens em nossa comunidade.</p>
      
      <h4>Parcerias Estratégicas</h4>
      <p>As novas parcerias incluem empresas locais, organizações não-governamentais e instituições educacionais que compartilham nossa visão de transformação social através do esporte.</p>
      
      <p>Cada parceiro traz contribuições únicas para o projeto, desde apoio financeiro até expertise técnica e recursos materiais que nos permitirão expandir nosso alcance e melhorar a qualidade dos serviços oferecidos.</p>
      
      <h5>Benefícios das Parcerias</h5>
      <p>Com o apoio dos novos parceiros, poderemos:</p>
      <ul>
        <li>Ampliar o número de vagas disponíveis</li>
        <li>Melhorar a infraestrutura do dojo</li>
        <li>Oferecer equipamentos de melhor qualidade</li>
        <li>Implementar novos programas educacionais</li>
        <li>Realizar mais eventos comunitários</li>
      </ul>
      
      <h4>Compromisso com a Transparência</h4>
      <p>Mantemos nosso compromisso com a transparência na gestão dos recursos recebidos. Todos os parceiros têm acesso a relatórios detalhados sobre o uso dos recursos e o impacto gerado pelo projeto.</p>
      
      <p>Acreditamos que a prestação de contas é fundamental para manter a confiança de nossos apoiadores e garantir a sustentabilidade do projeto a longo prazo.</p>
      
      <h4>Reconhecimento da Comunidade</h4>
      <p>O crescimento do número de parceiros reflete o reconhecimento da comunidade sobre a importância e efetividade do nosso trabalho. É gratificante ver que nossa missão ressoa com tantas pessoas e organizações.</p>
      
      <p>Este apoio nos dá ainda mais motivação para continuar trabalhando com dedicação e excelência, sempre buscando formas de melhorar e inovar em nossa abordagem pedagógica.</p>
      
      <h4>Como Você Pode Participar</h4>
      <p>Se você ou sua organização têm interesse em apoiar o projeto Teixeira Judô, entre em contato conosco. Existem diversas formas de contribuir:</p>
      <ul>
        <li>Patrocínio financeiro</li>
        <li>Doação de equipamentos</li>
        <li>Voluntariado especializado</li>
        <li>Divulgação do projeto</li>
        <li>Parcerias institucionais</li>
      </ul>
      
      <p>Juntos, podemos fazer a diferença na vida de ainda mais crianças e jovens, construindo um futuro melhor para nossa comunidade através dos valores e ensinamentos do judô.</p>
    `,
    excerpt: "Estamos felizes em anunciar novos parceiros que irão fortalecer ainda mais nosso projeto social.",
    date: "2024-01-05",
    author: "Admin",
    image: "/placeholder.svg?height=400&width=800",
  },
]

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
  // Atualizar conteúdo do modal
  document.getElementById("blogPostModalTitle").textContent = post.title
  document.getElementById("blogPostDate").textContent = formatBlogDate(post.date)
  document.getElementById("blogPostAuthor").textContent = post.author
  document.getElementById("blogPostImage").src = post.image
  document.getElementById("blogPostImage").alt = post.title
  document.getElementById("blogPostContent").innerHTML = post.content

  // Mostrar modal
  const modal = new bootstrap.Modal(document.getElementById("blogPostModal"))
  modal.show()
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