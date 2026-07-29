// Component library for BizFirst AI website
class ComponentManager {
  constructor() {
    this.components = new Map()
    this.init()
  }

  init() {
    this.registerComponents()
    this.initializeComponents()
  }

  registerComponents() {
    this.components.set("modal", Modal)
    this.components.set("tooltip", Tooltip)
    this.components.set("dropdown", Dropdown)
    this.components.set("tabs", Tabs)
    this.components.set("accordion", Accordion)
    this.components.set("carousel", Carousel)
  }

  initializeComponents() {
    this.components.forEach((ComponentClass, name) => {
      const elements = document.querySelectorAll(`[data-component="${name}"]`)
      elements.forEach((el) => new ComponentClass(el))
    })
  }
}

// Modal Component
class Modal {
  constructor(element) {
    this.element = element
    this.overlay = null
    this.isOpen = false
    this.init()
  }

  init() {
    this.createOverlay()
    this.bindEvents()
  }

  createOverlay() {
    this.overlay = document.createElement("div")
    this.overlay.className = "modal-overlay"
    this.overlay.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-body">
                    ${this.element.innerHTML}
                </div>
            </div>
        `
    document.body.appendChild(this.overlay)
  }

  bindEvents() {
    const triggers = document.querySelectorAll(`[data-modal-target="${this.element.id}"]`)
    const closeBtn = this.overlay.querySelector(".modal-close")

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault()
        this.open()
      })
    })

    closeBtn.addEventListener("click", () => this.close())
    this.overlay.addEventListener("click", (e) => {
      if (e.target === this.overlay) this.close()
    })

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) this.close()
    })
  }

  open() {
    this.overlay.classList.add("active")
    this.isOpen = true
    document.body.style.overflow = "hidden"
  }

  close() {
    this.overlay.classList.remove("active")
    this.isOpen = false
    document.body.style.overflow = ""
  }
}

// Tooltip Component
class Tooltip {
  constructor(element) {
    this.element = element
    this.tooltip = null
    this.init()
  }

  init() {
    this.createTooltip()
    this.bindEvents()
  }

  createTooltip() {
    this.tooltip = document.createElement("div")
    this.tooltip.className = "tooltip-popup"
    this.tooltip.textContent = this.element.dataset.tooltip
    document.body.appendChild(this.tooltip)
  }

  bindEvents() {
    this.element.addEventListener("mouseenter", (e) => this.show(e))
    this.element.addEventListener("mouseleave", () => this.hide())
    this.element.addEventListener("mousemove", (e) => this.updatePosition(e))
  }

  show(e) {
    this.tooltip.style.opacity = "1"
    this.tooltip.style.visibility = "visible"
    this.updatePosition(e)
  }

  hide() {
    this.tooltip.style.opacity = "0"
    this.tooltip.style.visibility = "hidden"
  }

  updatePosition(e) {
    const rect = this.element.getBoundingClientRect()
    this.tooltip.style.left = rect.left + rect.width / 2 - this.tooltip.offsetWidth / 2 + "px"
    this.tooltip.style.top = rect.top - this.tooltip.offsetHeight - 10 + "px"
  }
}

// Dropdown Component
class Dropdown {
  constructor(element) {
    this.element = element
    this.trigger = element.querySelector(".dropdown-trigger")
    this.menu = element.querySelector(".dropdown-menu")
    this.isOpen = false
    this.init()
  }

  init() {
    this.bindEvents()
  }

  bindEvents() {
    this.trigger.addEventListener("click", (e) => {
      e.preventDefault()
      this.toggle()
    })

    document.addEventListener("click", (e) => {
      if (!this.element.contains(e.target)) {
        this.close()
      }
    })

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.close()
      }
    })
  }

  toggle() {
    this.isOpen ? this.close() : this.open()
  }

  open() {
    this.menu.classList.add("active")
    this.trigger.classList.add("active")
    this.isOpen = true
  }

  close() {
    this.menu.classList.remove("active")
    this.trigger.classList.remove("active")
    this.isOpen = false
  }
}

// Tabs Component
class Tabs {
  constructor(element) {
    this.element = element
    this.tabs = element.querySelectorAll(".tab-trigger")
    this.panels = element.querySelectorAll(".tab-panel")
    this.activeIndex = 0
    this.init()
  }

  init() {
    this.bindEvents()
    this.setActive(0)
  }

  bindEvents() {
    this.tabs.forEach((tab, index) => {
      tab.addEventListener("click", (e) => {
        e.preventDefault()
        this.setActive(index)
      })
    })
  }

  setActive(index) {
    // Remove active class from all tabs and panels
    this.tabs.forEach((tab) => tab.classList.remove("active"))
    this.panels.forEach((panel) => panel.classList.remove("active"))

    // Add active class to selected tab and panel
    this.tabs[index].classList.add("active")
    this.panels[index].classList.add("active")

    this.activeIndex = index
  }
}

// Accordion Component
class Accordion {
  constructor(element) {
    this.element = element
    this.items = element.querySelectorAll(".accordion-item")
    this.init()
  }

  init() {
    this.bindEvents()
  }

  bindEvents() {
    this.items.forEach((item) => {
      const trigger = item.querySelector(".accordion-trigger")
      const content = item.querySelector(".accordion-content")

      trigger.addEventListener("click", () => {
        const isActive = item.classList.contains("active")

        // Close all items
        this.items.forEach((otherItem) => {
          otherItem.classList.remove("active")
          const otherContent = otherItem.querySelector(".accordion-content")
          otherContent.style.maxHeight = null
        })

        // Open clicked item if it wasn't active
        if (!isActive) {
          item.classList.add("active")
          content.style.maxHeight = content.scrollHeight + "px"
        }
      })
    })
  }
}

// Carousel Component
class Carousel {
  constructor(element) {
    this.element = element
    this.slides = element.querySelectorAll(".carousel-slide")
    this.prevBtn = element.querySelector(".carousel-prev")
    this.nextBtn = element.querySelector(".carousel-next")
    this.indicators = element.querySelectorAll(".carousel-indicator")
    this.currentIndex = 0
    this.autoPlay = element.dataset.autoplay === "true"
    this.interval = Number.parseInt(element.dataset.interval) || 5000
    this.timer = null
    this.init()
  }

  init() {
    this.bindEvents()
    this.setActive(0)
    if (this.autoPlay) this.startAutoPlay()
  }

  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener("click", () => this.prev())
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", () => this.next())
    }

    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => this.setActive(index))
    })

    // Pause on hover
    this.element.addEventListener("mouseenter", () => this.stopAutoPlay())
    this.element.addEventListener("mouseleave", () => {
      if (this.autoPlay) this.startAutoPlay()
    })
  }

  prev() {
    const newIndex = this.currentIndex === 0 ? this.slides.length - 1 : this.currentIndex - 1
    this.setActive(newIndex)
  }

  next() {
    const newIndex = this.currentIndex === this.slides.length - 1 ? 0 : this.currentIndex + 1
    this.setActive(newIndex)
  }

  setActive(index) {
    // Remove active class from all slides and indicators
    this.slides.forEach((slide) => slide.classList.remove("active"))
    this.indicators.forEach((indicator) => indicator.classList.remove("active"))

    // Add active class to selected slide and indicator
    this.slides[index].classList.add("active")
    if (this.indicators[index]) {
      this.indicators[index].classList.add("active")
    }

    this.currentIndex = index
  }

  startAutoPlay() {
    this.timer = setInterval(() => this.next(), this.interval)
  }

  stopAutoPlay() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }
}

// Form Validation Component
class FormValidator {
  constructor(form) {
    this.form = form
    this.rules = {}
    this.init()
  }

  init() {
    this.bindEvents()
  }

  bindEvents() {
    this.form.addEventListener("submit", (e) => {
      if (!this.validate()) {
        e.preventDefault()
      }
    })

    // Real-time validation
    const inputs = this.form.querySelectorAll("input, textarea, select")
    inputs.forEach((input) => {
      input.addEventListener("blur", () => this.validateField(input))
      input.addEventListener("input", () => this.clearError(input))
    })
  }

  addRule(fieldName, rule) {
    this.rules[fieldName] = rule
  }

  validate() {
    let isValid = true

    Object.keys(this.rules).forEach((fieldName) => {
      const field = this.form.querySelector(`[name="${fieldName}"]`)
      if (field && !this.validateField(field)) {
        isValid = false
      }
    })

    return isValid
  }

  validateField(field) {
    const rule = this.rules[field.name]
    if (!rule) return true

    const value = field.value.trim()
    let isValid = true
    let errorMessage = ""

    if (rule.required && !value) {
      isValid = false
      errorMessage = rule.requiredMessage || "This field is required"
    } else if (value && rule.pattern && !rule.pattern.test(value)) {
      isValid = false
      errorMessage = rule.patternMessage || "Invalid format"
    } else if (value && rule.minLength && value.length < rule.minLength) {
      isValid = false
      errorMessage = rule.minLengthMessage || `Minimum ${rule.minLength} characters required`
    }

    if (isValid) {
      this.clearError(field)
    } else {
      this.showError(field, errorMessage)
    }

    return isValid
  }

  showError(field, message) {
    field.classList.add("error")

    let errorElement = field.parentNode.querySelector(".error-message")
    if (!errorElement) {
      errorElement = document.createElement("div")
      errorElement.className = "error-message"
      field.parentNode.appendChild(errorElement)
    }

    errorElement.textContent = message
  }

  clearError(field) {
    field.classList.remove("error")
    const errorElement = field.parentNode.querySelector(".error-message")
    if (errorElement) {
      errorElement.remove()
    }
  }
}

// Initialize components when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new ComponentManager()
})

// Export components for external use
window.ComponentManager = ComponentManager
window.Modal = Modal
window.Tooltip = Tooltip
window.Dropdown = Dropdown
window.Tabs = Tabs
window.Accordion = Accordion
window.Carousel = Carousel
window.FormValidator = FormValidator
