// Animation controller
class AnimationController {
  constructor() {
    this.animations = new Map()
    this.init()
  }

  init() {
    this.setupScrollAnimations()
    this.setupHoverAnimations()
    this.setupLoadAnimations()
  }

  setupScrollAnimations() {
    const scrollElements = document.querySelectorAll("[data-scroll-animation]")

    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const animationType = entry.target.dataset.scrollAnimation
            this.triggerAnimation(entry.target, animationType)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    scrollElements.forEach((el) => scrollObserver.observe(el))
  }

  setupHoverAnimations() {
    const hoverElements = document.querySelectorAll("[data-hover-animation]")

    hoverElements.forEach((el) => {
      const animationType = el.dataset.hoverAnimation

      el.addEventListener("mouseenter", () => {
        this.triggerAnimation(el, animationType)
      })

      el.addEventListener("mouseleave", () => {
        this.resetAnimation(el, animationType)
      })
    })
  }

  setupLoadAnimations() {
    window.addEventListener("load", () => {
      const loadElements = document.querySelectorAll("[data-load-animation]")

      loadElements.forEach((el, index) => {
        setTimeout(() => {
          const animationType = el.dataset.loadAnimation
          this.triggerAnimation(el, animationType)
        }, index * 100)
      })
    })
  }

  triggerAnimation(element, type) {
    switch (type) {
      case "fadeInUp":
        element.style.opacity = "0"
        element.style.transform = "translateY(30px)"
        element.style.transition = "all 0.8s ease"
        setTimeout(() => {
          element.style.opacity = "1"
          element.style.transform = "translateY(0)"
        }, 50)
        break

      case "fadeInLeft":
        element.style.opacity = "0"
        element.style.transform = "translateX(-30px)"
        element.style.transition = "all 0.8s ease"
        setTimeout(() => {
          element.style.opacity = "1"
          element.style.transform = "translateX(0)"
        }, 50)
        break

      case "fadeInRight":
        element.style.opacity = "0"
        element.style.transform = "translateX(30px)"
        element.style.transition = "all 0.8s ease"
        setTimeout(() => {
          element.style.opacity = "1"
          element.style.transform = "translateX(0)"
        }, 50)
        break

      case "scaleIn":
        element.style.opacity = "0"
        element.style.transform = "scale(0.8)"
        element.style.transition = "all 0.6s ease"
        setTimeout(() => {
          element.style.opacity = "1"
          element.style.transform = "scale(1)"
        }, 50)
        break

      case "rotateIn":
        element.style.opacity = "0"
        element.style.transform = "rotate(-180deg)"
        element.style.transition = "all 0.8s ease"
        setTimeout(() => {
          element.style.opacity = "1"
          element.style.transform = "rotate(0deg)"
        }, 50)
        break

      case "bounce":
        element.style.animation = "bounce 0.6s ease"
        break

      case "pulse":
        element.style.animation = "pulse 0.6s ease"
        break

      case "shake":
        element.style.animation = "shake 0.6s ease"
        break
    }
  }

  resetAnimation(element, type) {
    element.style.animation = ""
    element.style.transform = ""
  }
}

// Counter animation
function animateCounter(element, target, duration = 2000) {
  let start = 0
  const increment = target / (duration / 16)

  const timer = setInterval(() => {
    start += increment
    if (start >= target) {
      element.textContent = target.toLocaleString()
      clearInterval(timer)
    } else {
      element.textContent = Math.floor(start).toLocaleString()
    }
  }, 16)
}

// Throttle function declaration
function throttle(func, limit) {
  let lastFunc
  let lastRan
  return (...args) => {
    if (!lastRan) {
      func(...args)
      lastRan = Date.now()
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(
        () => {
          if (Date.now() - lastRan >= limit) {
            func(...args)
            lastRan = Date.now()
          }
        },
        limit - (Date.now() - lastRan),
      )
    }
  }
}

// Parallax scrolling effect
function initParallax() {
  const parallaxElements = document.querySelectorAll("[data-parallax]")

  window.addEventListener(
    "scroll",
    throttle(() => {
      const scrollTop = window.pageYOffset

      parallaxElements.forEach((el) => {
        const speed = el.dataset.parallax || 0.5
        const yPos = -(scrollTop * speed)
        el.style.transform = `translateY(${yPos}px)`
      })
    }, 16),
  )
}

// Typing animation
function typeWriter(element, text, speed = 100) {
  let i = 0
  element.innerHTML = ""

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i)
      i++
      setTimeout(type, speed)
    }
  }

  type()
}

// Morphing shapes animation
function initMorphingShapes() {
  const shapes = document.querySelectorAll(".morphing-shape")

  shapes.forEach((shape) => {
    setInterval(() => {
      const randomScale = 0.8 + Math.random() * 0.4
      const randomRotate = Math.random() * 360

      shape.style.transform = `scale(${randomScale}) rotate(${randomRotate}deg)`
    }, 3000)
  })
}

// Particle system
class ParticleSystem {
  constructor(container, options = {}) {
    this.container = container
    this.particles = []
    this.options = {
      count: options.count || 50,
      speed: options.speed || 1,
      size: options.size || 2,
      color: options.color || "rgba(255, 255, 255, 0.5)",
      ...options,
    }

    this.init()
  }

  init() {
    this.createParticles()
    this.animate()
  }

  createParticles() {
    for (let i = 0; i < this.options.count; i++) {
      const particle = document.createElement("div")
      particle.className = "particle"
      particle.style.cssText = `
                position: absolute;
                width: ${this.options.size}px;
                height: ${this.options.size}px;
                background: ${this.options.color};
                border-radius: 50%;
                pointer-events: none;
            `

      this.container.appendChild(particle)

      this.particles.push({
        element: particle,
        x: Math.random() * this.container.offsetWidth,
        y: Math.random() * this.container.offsetHeight,
        vx: (Math.random() - 0.5) * this.options.speed,
        vy: (Math.random() - 0.5) * this.options.speed,
      })
    }
  }

  animate() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx
      particle.y += particle.vy

      // Bounce off edges
      if (particle.x <= 0 || particle.x >= this.container.offsetWidth) {
        particle.vx *= -1
      }
      if (particle.y <= 0 || particle.y >= this.container.offsetHeight) {
        particle.vy *= -1
      }

      particle.element.style.left = particle.x + "px"
      particle.element.style.top = particle.y + "px"
    })

    requestAnimationFrame(() => this.animate())
  }
}

// Initialize animations when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new AnimationController()
  initParallax()
  initMorphingShapes()

  // Initialize particle system for hero section
  const heroSection = document.querySelector(".hero-section")
  if (heroSection) {
    new ParticleSystem(heroSection, {
      count: 30,
      speed: 0.5,
      size: 3,
      color: "rgba(0, 123, 255, 0.3)",
    })
  }
})

// Export for use in other modules
window.AnimationController = AnimationController
window.ParticleSystem = ParticleSystem
window.animateCounter = animateCounter
window.typeWriter = typeWriter
