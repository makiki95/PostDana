document.addEventListener("DOMContentLoaded", () => {
  // Constantes de configuración
  const CONFIG = {
    ANIMATION_DURATION: 2000,
    CLASSES: {
      ACTIVE: 'active',
      LOADING: 'loading'
    }
  };

  // DOM Elements con validación
  const elements = {
    dropdownBtn: document.getElementById("dropdownBtn"),
    dropdownMenu: document.getElementById("dropdownMenu"),
    printBtn: document.getElementById("printButton"),
    manifiestoBtn: document.getElementById("manifestoButton"),
    dropups: document.querySelectorAll('.dropup'),
    // Agregar validación de elementos
    validate() {
      return Object.entries(this)
        .filter(([key, value]) => key !== 'validate')
        .every(([key, element]) => element !== null);
    }
  };

  // Modal handler mejorado
  const modalHandler = {
    handleModal: (modal, isOpen) => {
      if (!modal) return;
      modal.style.display = isOpen ? "block" : "none";
      // Manejar el foco para accesibilidad
      if (isOpen) {
        modal.setAttribute('aria-hidden', 'false');
        modal.focus();
      } else {
        modal.setAttribute('aria-hidden', 'true');
      }
    },

    initModalListeners: (btn, modal) => {
      if (!btn || !modal) return;

      // Agregar manejo de teclado
      const handleKeydown = (e) => {
        if (e.key === 'Escape') modalHandler.handleModal(modal, false);
      };

      btn.addEventListener("click", () => modalHandler.handleModal(modal, true));
      modal.addEventListener('keydown', handleKeydown);
      
      const closeBtn = modal.querySelector(".close");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => modalHandler.handleModal(modal, false));
      }

      window.addEventListener("click", (e) => {
        if (e.target === modal) modalHandler.handleModal(modal, false);
      });
    }
  };

  // Dropdown handler mejorado
  const dropdownHandler = {
    init: () => {
      const { dropdownBtn, dropdownMenu } = elements;
      if (!dropdownBtn || !dropdownMenu) return;

      const toggleDropdown = (show) => {
        dropdownMenu.classList.toggle(CONFIG.CLASSES.ACTIVE, show);
        dropdownBtn.setAttribute('aria-expanded', show);
      };

      dropdownBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        const isExpanded = dropdownBtn.getAttribute('aria-expanded') === 'true';
        toggleDropdown(!isExpanded);
      });

      // Cerrar con Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') toggleDropdown(false);
      });

      document.addEventListener("click", (event) => {
        if (!dropdownBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
          toggleDropdown(false);
        }
      });
    }
  };

  // Edition buttons handler mejorado
  const editionButtonHandler = {
    init: () => {
      elements.editionButtons?.forEach(button => {
        const href = button.getAttribute('href');
        if (href && href !== '#') {
          button.addEventListener('click', editionButtonHandler.handleClick);
        }
      });
    },

    handleClick: function(e) {
      if (this.getAttribute('download')) {
        this.classList.add(CONFIG.CLASSES.LOADING);
        // Agregar feedback visual
        this.setAttribute('aria-busy', 'true');
        
        setTimeout(() => {
          this.classList.remove(CONFIG.CLASSES.LOADING);
          this.setAttribute('aria-busy', 'false');
        }, CONFIG.ANIMATION_DURATION);
      }
    }
  };

  // Dropup handler mejorado
  const dropupHandler = {
    init: () => {
      const dropups = document.querySelectorAll('.dropup');
      if (!dropups.length) return;

      dropups.forEach(dropup => {
        const button = dropup.querySelector('.modal-button');
        const content = dropup.querySelector('.dropup-content');
        
        if (!button || !content) return;

        button.addEventListener('click', (e) => {
          e.stopPropagation();
          // Cerrar todos los otros dropups primero
          dropups.forEach(otherDropup => {
            if (otherDropup !== dropup) {
              otherDropup.querySelector('.dropup-content')?.classList.remove('active');
            }
          });
          // Toggle el actual
          content.classList.toggle('active');
        });
      });

      // Cerrar al presionar Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          dropups.forEach(dropup => {
            dropup.querySelector('.dropup-content')?.classList.remove('active');
          });
        }
      });

      // Cerrar al hacer click fuera
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropup')) {
          dropups.forEach(dropup => {
            dropup.querySelector('.dropup-content')?.classList.remove('active');
          });
        }
      });
    }
  };

  // Inicialización con manejo de errores
  const init = () => {
    try {
      if (!elements.validate()) {
        throw new Error('Faltan elementos DOM necesarios');
      }

      modalHandler.initModalListeners(elements.printBtn, elements.printModal);
      modalHandler.initModalListeners(elements.manifiestoBtn, elements.manifiestoModal);
      dropdownHandler.init();
      editionButtonHandler.init();
      dropupHandler.init();
    } catch (error) {
      console.error('Error en la inicialización:', error);
    }
  };

  init();
});

// Gestión de cookies
function initCookieBanner() {
  const cookieBanner = document.getElementById('cookieBanner');
  const acceptAllBtn = document.getElementById('acceptAllCookies');
  const acceptSelectedBtn = document.getElementById('acceptSelectedCookies');
  const rejectBtn = document.getElementById('rejectCookies');
  const analyticsCb = document.getElementById('analyticsCookies');
  const marketingCb = document.getElementById('marketingCookies');

  function saveCookiePreferences(preferences) {
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    cookieBanner.classList.remove('show');
    
    // Activar/desactivar servicios según preferencias
    if (preferences.analytics) {
      // Activar Google Analytics, etc.
    }
    if (preferences.marketing) {
      // Activar píxeles de marketing, etc.
    }
  }

  if (!localStorage.getItem('cookiePreferences')) {
    setTimeout(() => cookieBanner.classList.add('show'), 1000);
  }

  acceptAllBtn.addEventListener('click', () => {
    saveCookiePreferences({
      necessary: true,
      analytics: true,
      marketing: true
    });
  });

  acceptSelectedBtn.addEventListener('click', () => {
    saveCookiePreferences({
      necessary: true,
      analytics: analyticsCb.checked,
      marketing: marketingCb.checked
    });
  });

  rejectBtn.addEventListener('click', () => {
    saveCookiePreferences({
      necessary: true,
      analytics: false,
      marketing: false
    });
  });
}

// Inicializar el banner de cookies cuando se carga la página
document.addEventListener('DOMContentLoaded', initCookieBanner);