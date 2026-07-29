// Main JavaScript functionality
document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS
  const AOS = window.AOS // Declare AOS variable
  if (AOS) {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out-cubic",
      once: true,
      mirror: false,
      offset: 100,
    })
  }

  // Initialize all components
  initPreloader()
  initNavigation()
  initScrollAnimations()
  initSmoothScrolling()
  initSearch()
  initPartnersAndEcosystem()
  initParticleSystem()

  console.log("🚀 BizFirst AI website initialized successfully")
})

// Preloader functionality
function initPreloader() {
  const preloader = document.getElementById("preloader")

  window.addEventListener("load", () => {
    setTimeout(() => {
      preloader.style.opacity = "0"
      setTimeout(() => {
        preloader.style.display = "none"
      }, 50)
    }, 100)
  })
}

// Enhanced Navigation functionality
function initNavigation() {
  const navbar = document.querySelector(".custom-nav")
  const navLinks = document.querySelectorAll(".nav-link")

  // Navbar scroll effect with enhanced styling
  window.addEventListener(
    "scroll",
    throttle(() => {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled")
      } else {
        navbar.classList.remove("scrolled")
      }
    }, 16),
  )

  // Enhanced active nav link highlighting
  const sections = document.querySelectorAll("section[id]")
  window.addEventListener(
    "scroll",
    throttle(() => {
      let current = ""
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 200
        const sectionHeight = section.clientHeight
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          current = section.getAttribute("id")
        }
      })

      navLinks.forEach((link) => {
        link.classList.remove("active")
        if (link.getAttribute("href") === "#" + current) {
          link.classList.add("active")
        }
      })
    }, 16),
  )

  // Smooth scroll for nav links
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href")
      // Only intercept anchor links; let external/page links navigate normally
      if (!targetId || !targetId.startsWith("#")) return;
      e.preventDefault()
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }

      // Close mobile menu if open
      const navCollapse = document.querySelector(".navbar-collapse")
      if (navCollapse.classList.contains("show")) {
        navCollapse.classList.remove("show")
      }
    })
  })
}

// Enhanced scroll animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")

        // Special animations for specific elements
        if (entry.target.classList.contains("tech-card")) {
          animateCard(entry.target)
        }

        if (entry.target.classList.contains("use-case-card")) {
          animateCard(entry.target)
        }
      }
    })
  }, observerOptions)

  // Observe elements for scroll animations
  const animatedElements = document.querySelectorAll(
    ".scroll-fade, .scroll-slide-left, .scroll-slide-right, .tech-card, .use-case-card, .architecture-card, .partner-card, .ecosystem-card",
  )
  animatedElements.forEach((el) => observer.observe(el))
}

// Animate cards with stagger effect
function animateCard(card) {
  const icon = card.querySelector(".card-icon, .tech-icon")
  if (icon) {
    icon.style.transform = "scale(0) rotate(-180deg)"
    setTimeout(() => {
      icon.style.transform = "scale(1) rotate(0deg)"
    }, 200)
  }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        const offsetTop = target.offsetTop - 80
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }
    })
  })
}

 

 
// Enhanced search functionality
function initSearch() {
  window.findAgent = () => {
    const searchTerm = document.getElementById("agentSearch").value
    const button = event.target

    if (searchTerm.trim()) {
      // Add loading state
      button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Searching...'
      button.disabled = true

      showNotification("Searching for AI Agent: " + searchTerm, "info")

      // Simulate search with realistic delay
      setTimeout(() => {
        showNotification("Search completed. Results would appear here.", "success")
        button.innerHTML = '<i class="fas fa-search me-2"></i>Find'
        button.disabled = false

        // Simulate opening result
        setTimeout(() => {
          window.open(`https://${searchTerm}.BizFirstAi.com/`, "_blank")
        }, 1000)
      }, 2000)
    } else {
      showNotification("Please enter a search term", "warning")
    }
  }

  window.findVersion = () => {
    const searchTerm = document.getElementById("versionSearch").value
    const button = event.target

    if (searchTerm.trim()) {
      // Add loading state
      button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Searching...'
      button.disabled = true

      showNotification("Searching for version: " + searchTerm, "info")

      // Simulate search
      setTimeout(() => {
        showNotification("Version search completed.", "success")
        button.innerHTML = '<i class="fas fa-search me-2"></i>Find'
        button.disabled = false

        // Simulate opening result
        setTimeout(() => {
          window.open(`https://record.BizFirstAi.com/?search-url-data-entry-id=${searchTerm}`, "_blank")
        }, 1000)
      }, 2000)
    } else {
      showNotification("Please enter a record ID", "warning")
    }
  }

  // Navigation search functionality
  window.searchFromNav = () => {
    const input = document.getElementById("navSearchInput")
    const searchTerm = input.value

    if (searchTerm.trim()) {
      const normalized = operateIdMembers._normalizeIdentity(searchTerm);
      input.value = "acc://" + normalized;
      const adi = operateIdMembers._parseAdi2(normalized);
      const subPath = adi.subPath ? "/" + adi.subPath : "";
      const url = `https://${adi.name}.BizFirstAi.com${subPath}`;
      showNotification("Searching for AI Agent: " + input.value, "info")
      setTimeout(() => {
        window.open(url, "_blank")
      }, 1000)
    } else {
      showNotification("Please enter a search term", "warning")
    }
  }

  // Enter key support for nav search
  const navSearchInput = document.getElementById("navSearchInput")
  if (navSearchInput) {
    navSearchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        window.searchFromNav() // Use window.searchFromNav instead of searchFromNav()
      }
    })
  }
}

// Enhanced Partners and Ecosystem data
function initPartnersAndEcosystem() {
  const partners = [
    {
      name: "Accumulate",
      type: "CROWN PARTNER",
      subtitle: "Layer 1 Blockchain",
      url: "https://www.AccumulateNetwork.io",
      logo: "https://via.placeholder.com/100x50/007bff/ffffff?text=ACC",
      description: "Leading blockchain infrastructure for enterprise applications",
    },
    {
      name: "Operate Crypto",
      type: "Holding Organization",
      subtitle: "Strategic Partner",
      url: "https://OperateCrypto.com",
      logo: "https://via.placeholder.com/100x50/17a2b8/ffffff?text=OC",
      description: "Comprehensive crypto operations and management platform",
    },
    {
      name: "DeFi Devs",
      type: "Go-to-Market Partner",
      subtitle: "Development Team",
      url: "https://defidevs.io",
      logo: "https://via.placeholder.com/100x50/28a745/ffffff?text=DD",
      description: "Expert DeFi development and consulting services",
    },
    {
      name: "LV8RLABS",
      type: "Go-to-Market Partner",
      subtitle: "Innovation Lab",
      url: "https://www.LV8RLABS.com",
      logo: "https://via.placeholder.com/100x50/ffc107/ffffff?text=LV8R",
      description: "Cutting-edge research and development laboratory",
    },
    {
      name: "Leonard McDowell",
      type: "Go-to-Market Partner",
      subtitle: "Strategic Advisor",
      url: "https://www.leonardmcdowell.com/",
      logo: "https://via.placeholder.com/100x50/dc3545/ffffff?text=LM",
      description: "Industry expert and strategic business advisor",
    },
    {
      name: "Lighthouse",
      type: "IPFS Pinning Service",
      subtitle: "Storage Solution",
      url: "https://www.lighthouse.storage",
      logo: "https://via.placeholder.com/100x50/6f42c1/ffffff?text=LH",
      description: "Decentralized storage infrastructure for Web3 applications",
    },
  ]

  const ecosystem = [
    {
      name: "Bank On Ledger",
      url: "https://www.BankOnLedger.com",
      description: "Store your ID information and allow other people or software to discover and interact with you.",
      icon: "fas fa-university",
      category: "Identity",
    },
    {
      name: "AML Certification",
      url: "https://www.AmlOnChain.com",
      description: "Do you want to start your own AML Certification company? This is the start",
      icon: "fas fa-shield-alt",
      category: "Compliance",
    },
    {
      name: "KYC Certification",
      url: "https://www.KycOnChain.com",
      description: "Do you want to start your own KYC Certification company? This is the start",
      icon: "fas fa-user-check",
      category: "Compliance",
    },
    {
      name: "Certified Items",
      url: "https://www.CertifiedItems.com",
      description: "Interested in starting your own school? Or training organization? Issue certificates in minutes.",
      icon: "fas fa-certificate",
      category: "Education",
    },
    {
      name: "Qoboto",
      url: "https://www.Qoboto.com",
      description: "Create your website and publish it to the world.",
      icon: "fas fa-globe",
      category: "Web Development",
    },
    {
      name: "Metial",
      url: "https://www.Metial.com",
      description: "Your business needs form builder? Decentralized forms are now real.",
      icon: "fas fa-wpforms",
      category: "Forms",
    },
    {
      name: "Ledger Documents",
      url: "https://www.LedgerDocuments.com",
      description: "Your decentralized documents. Imagine google docs in decentralized world.",
      icon: "fas fa-file-alt",
      category: "Documents",
    },
    {
      name: "OnLedger IoT",
      url: "https://www.OnLedgerIoT.com",
      description: "IoT data forms and device registration forms. Fully customizable.",
      icon: "fas fa-microchip",
      category: "IoT",
    },
    {
      name: "Data Proof Labs",
      url: "https://www.DataProofLabs.com",
      description: "Place proof on blockchain and optimize the cost using powerful rollup mechanisms.",
      icon: "fas fa-database",
      category: "Blockchain",
    },
  ]

  renderPartners(partners)
  renderEcosystem(ecosystem)
}

function renderPartners(partners) {
  const container = document.getElementById("partners-grid")
  if (!container) return

  const partnerLogos = {
    Accumulate:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/accumulate_foundation-7O0YNQELwe2GPLe3dvweRjIprUyan1.png",
    "Operate Crypto":
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/operatecrypo_logo-AmwKMRMM7X60M62DodVuYOV3AgifMD.png",
    "DeFi Devs": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DefiDevs-yQKNVkB8IGaGZRVQvbiqfja759IAnc.png",
    LV8RLABS:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_lv8rlabs-iD3XT1MJKSCnSXse8Bixszbh6O5gn2.png",
    "Leonard McDowell":
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_leonardmcdowell-qQ8Pc5i3VYXHN5we0JZNX3CVTmh7Sj.png",
    Lighthouse:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lighthouse_logo-iicFYLIgjr2s0FQnjK9yYSzJ6csLTq.svg",
  }

  container.innerHTML = partners
    .map(
      (partner, index) => `
        <div class="col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="${index * 100}">
            <div class="partner-card">
                <div class="partner-header">
                    <div class="partner-logo-container">
                        <img src="${partnerLogos[partner.name] || partner.logo}" alt="${partner.name}" class="partner-logo-img">
                    </div>
                    <h5>${partner.name}</h5>
                    <span class="partner-type">${partner.type}</span>
                    ${partner.subtitle ? `<span class="partner-subtitle">${partner.subtitle}</span>` : ""}
                </div>
                <div class="partner-body">
                    <p>${partner.description}</p>
                    <a href="${partner.url}" target="_blank" class="partner-link">
                        <i class="fas fa-external-link-alt me-2"></i>
                        Visit Website
                    </a>
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

function renderEcosystem(ecosystem) {
  const container = document.getElementById("ecosystem-grid")
  if (!container) return

  container.innerHTML = ecosystem
    .map(
      (item, index) => `
        <div class="col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="${index * 100}">
            <div class="ecosystem-card">
                <div class="ecosystem-header">
                    <div class="ecosystem-icon">
                        <i class="${item.icon}"></i>
                    </div>
                    <h5>${item.name}</h5>
                    <span class="ecosystem-category">${item.category}</span>
                </div>
                <div class="ecosystem-body">
                    <p>${item.description}</p>
                    <a href="${item.url}" target="_blank">
                        <i class="fas fa-arrow-right me-2"></i>
                        Explore Platform
                    </a>
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

// Particle system for hero section
function initParticleSystem() {
  const heroSection = document.querySelector(".hero-section")
  if (!heroSection) return

  const particleContainer = document.createElement("div")
  particleContainer.className = "particle-container"
  particleContainer.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
  `

  // Create particles
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement("div")
    particle.className = "particle"
    particle.style.cssText = `
      position: absolute;
      width: 2px;
      height: 2px;
      background: rgba(0, 123, 255, 0.6);
      border-radius: 50%;
      animation: particleFloat ${10 + Math.random() * 20}s linear infinite;
      left: ${Math.random() * 100}%;
      animation-delay: ${Math.random() * 20}s;
    `
    particleContainer.appendChild(particle)
  }

  heroSection.appendChild(particleContainer)

  // Add particle animation CSS
  const style = document.createElement("style")
  style.textContent = `
    @keyframes particleFloat {
      0% {
        transform: translateY(100vh) rotate(0deg);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translateY(-100px) rotate(360deg);
        opacity: 0;
      }
    }
  `
  document.head.appendChild(style)
}

// Enhanced notification system
function showNotification(message, type = "info", duration = 4000) {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`

  const icons = {
    success: "fas fa-check-circle",
    error: "fas fa-exclamation-circle",
    warning: "fas fa-exclamation-triangle",
    info: "fas fa-info-circle",
  }

  notification.innerHTML = `
    <div class="notification-content">
      <i class="${icons[type]} me-2"></i>
      <span>${message}</span>
      <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 12px;
    padding: 1rem 1.5rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    border-left: 4px solid var(--${type === "info" ? "primary" : type === "success" ? "success" : type === "warning" ? "warning" : "danger"}-color);
    z-index: 10000;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    max-width: 400px;
    font-weight: 500;
  `

  const notificationContent = notification.querySelector(".notification-content")
  notificationContent.style.cssText = `
    display: flex;
    align-items: center;
    gap: 0.5rem;
  `

  const closeButton = notification.querySelector(".notification-close")
  closeButton.style.cssText = `
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    padding: 0;
    margin-left: auto;
    font-size: 0.9rem;
    transition: color 0.3s ease;
  `

  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Auto remove
  setTimeout(() => {
    notification.style.transform = "translateX(400px)"
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }, duration)
}

// Throttle function for performance
function throttle(func, limit) {
  let inThrottle
  return function () {
    const args = arguments

    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Enhanced error handling
window.addEventListener("error", (e) => {
  console.error("JavaScript Error:", e.error)
  showNotification("An unexpected error occurred. Please refresh the page.", "error")
})

// Performance monitoring
window.addEventListener("load", () => {
  const loadTime = performance.now()
  console.log(`🚀 Page loaded in ${Math.round(loadTime)}ms`)

  if (loadTime > 3000) {
    console.warn("⚠️ Page load time is slower than expected")
  }
})

// Export functions for global access
window.BizFirstAI = {
  showNotification,
  throttle,
}
