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
    printModal: document.getElementById("printModal"),
    manifiestoModal: document.getElementById("manifiestoModal"),
    editionButtons: document.querySelectorAll('.edition-button'),
    dropups: document.querySelectorAll('.dropup'),
    // Agregar validación de elementos
    validate() {
      // Solo valida dropdownBtn y dropdownMenu para el dropdown
      return this.dropdownBtn && this.dropdownMenu;
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

      // Cerrar al hacer click fuera o con Escape
      document.addEventListener('click', (event) => {
        if (!dropdownBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
          toggleDropdown(false);
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') toggleDropdown(false);
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

  // Inicialización de la gráfica
  google.charts.load("current", {packages:["corechart"]});
  google.charts.setOnLoadCallback(drawStatisticsChart);

  function drawStatisticsChart() {
    const chartData = [
      ['Área', 'Porcentaje', { role: 'tooltip' }],
      ['Gobierno Autonómico Actual', 32, 'Gobierno Autonómico Actual: 32%'],
      ['Gobiernos Autonómicos anteriores', 23, 'Gobiernos Autonómicos anteriores: 23%'],
      ['Gobierno Central', 18, 'Gobierno Central: 18%'],
      ['Protección Civil', 8, 'Protección Civil: 8%'],
      ['Autoridades locales', 4, 'Autoridades locales: 4%'],
      ['AEMET y CHJ', 10, 'AEMET y CHJ: 10%'],
      ['Factores naturales', 5, 'Factores naturales: 5%']
    ];

    const chartTexts = {
      'Gobierno Autonómico Actual': {
        title: 'Gobierno Autonómico Actual (Carlos Mazón): 32%',
        text: 'Retraso crítico en activación del nivel máximo de alerta (Nivel 2 de emergencia). Fallo de comunicación a la población (sistema ES-ALERT). Descoordinación evidente en los momentos más cruciales (CECOPI activado tarde y sin liderazgo claro). Negligencia al subestimar públicamente la magnitud del evento al inicio del desastre. Este alto porcentaje refleja una responsabilidad directa e inmediata, debido a su posición como máxima autoridad durante el desastre.'
      },
      'Gobiernos Autonómicos anteriores': {
        title: 'Gobiernos Autonómicos anteriores (Camps, Fabra, Puig): 23%',
        text: 'Incumplimiento reiterado del PATRICOVA (desde 2007 hasta 2023). No ejecución de infraestructuras críticas y necesarias previstas (barranco del Poyo, río Magro). Desatención sistemática ante advertencias técnicas previas al evento. Este porcentaje considerable refleja una responsabilidad histórica y estructural por una prevención deficiente acumulada durante más de una década.'
      },
      'Gobierno Central': {
        title: 'Gobierno Central (Ministerio de Defensa, UME): 18%',
        text: 'Respuesta tardía y en cantidad insuficiente de la Unidad Militar de Emergencias (UME). Fallos administrativos históricos en la ejecución de proyectos hidráulicos esenciales (encauzamientos, presas). Falta de coordinación efectiva con autoridades autonómicas en momentos clave. Refleja una responsabilidad significativa derivada de fallos en coordinación y gestión operativa inmediata y preventiva.'
      },
      'Protección Civil': {
        title: 'Protección Civil y técnicos regionales: 8%',
        text: 'Retraso claro en activar protocolos locales específicos. Errores graves en comunicación interna sobre riesgos en tiempo real. Falta de decisión y eficacia en la interpretación de datos técnicos recibidos de AEMET y CHJ. Responsabilidad moderada, pero clara, por no haber cumplido adecuadamente su papel en tiempo crítico.'
      },
      'Autoridades locales': {
        title: 'Autoridades locales (Ayuntamientos): 4%',
        text: 'Insuficiente preparación y actualización de planes locales de emergencia. Baja capacidad de respuesta inmediata con recursos propios. Dependencia absoluta y pasiva ante la gestión de autoridades superiores. Aunque menos culpables directamente, tienen una responsabilidad residual clara en la gestión inmediata y local del evento.'
      },
      'AEMET y CHJ': {
        title: 'AEMET y CHJ (prevención, Forata, radar): 10%',
        text: 'Gestión cuestionable y polémica en apertura de compuertas en la presa de Forata. Posible falta de mantenimiento preventivo adecuado en cauces y barrancos. Reparación tardía y cuestionable funcionamiento del radar meteorológico. Caudalímetros inutilizados que dificultaron la interpretación y previsión técnica inmediata. Este porcentaje se justifica por responsabilidades técnicas preventivas y operativas que contribuyeron a la magnitud del desastre.'
      },
      'Factores naturales': {
        title: 'Factores naturales (magnitud excepcional DANA): 5%',
        text: 'Fenómeno meteorológico excepcional, aunque previsible en cierto grado. Intensidad extraordinaria que complicó ligeramente la predicción exacta del evento. Este porcentaje bajo pero significativo refleja el factor natural inevitable de la catástrofe, pero claramente mitigable por una mejor gestión previa y durante el evento.'
      }
    };

    const data = google.visualization.arrayToDataTable(chartData);
    const colors = [
      '#607D8B', // Gris azulado medio para Gobierno Autonómico Actual
      '#78909C', // Gris azulado claro para Gobiernos anteriores
      '#90A4AE', // Gris más claro para Gobierno Central
      '#B0BEC5', // Gris muy claro para Protección Civil
      '#CFD8DC', // Gris clarísimo para Autoridades locales
      '#ECEFF1', // Gris casi blanco para AEMET y CHJ
      '#F5F7F8'  // Gris blanquecino para Factores naturales
    ];

    const options = {
      pieHole: 0.35,
      colors: colors,
      backgroundColor: 'none',
      legend: {
        position: 'right',
        alignment: 'center',
        textStyle: {
          color: '#333',
          fontSize: 12,
          fontFamily: 'Inter'
        }
      },
      chartArea: {
        left: '5%',
        top: '5%',
        width: '85%',
        height: '90%'
      },
      width: '100%',
      height: '100%',
      pieSliceText: 'percentage',
      pieSliceTextStyle: {
        fontSize: 14,
        color: '#ffffff', // Asegurando que el color del texto sea blanco
        fontFamily: 'Inter' // Añadiendo la fuente para consistencia
      },
      tooltip: { 
        text: 'percentage',
        textStyle: {
          fontSize: 13,
          fontFamily: 'Inter'
        }
      }
    };

    const chart = new google.visualization.PieChart(document.getElementById('statisticsChart'));
    
    // Manejador de clicks en la gráfica
    function selectHandler() {
      const selectedItem = chart.getSelection()[0];
      if (selectedItem) {
        // Obtener el nombre de la zona (no el porcentaje)
        const value = data.getValue(selectedItem.row, 0);
        const chartTextBox = document.getElementById('chartTextBox');
        const modalTitle = document.getElementById('chartModalTitle');
        const modalText = document.getElementById('chartModalText');
        
        // Actualizar los textos con los datos correspondientes
        if (chartTexts[value]) {
          modalTitle.textContent = chartTexts[value].title;
          modalText.textContent = chartTexts[value].text;
        }

        // Deseleccionar después de mostrar la información
        setTimeout(() => {
          chart.setSelection([]);
        }, 10);
      }
    }

    // Asegurarse de que el contenedor del texto esté visible
    const chartTextBox = document.getElementById('chartTextBox');
    if (chartTextBox) {
      chartTextBox.style.display = 'block';
    }

    google.visualization.events.addListener(chart, 'select', selectHandler);
    
    // Inicializar con el primer texto
    const firstKey = Object.keys(chartTexts)[0];
    if (firstKey) {
      const modalTitle = document.getElementById('chartModalTitle');
      const modalText = document.getElementById('chartModalText');
      modalTitle.textContent = chartTexts[firstKey].title;
      modalText.textContent = chartTexts[firstKey].text;
    }

    // Función para actualizar el tamaño
    const updateChartSize = () => {
      const container = document.getElementById('statisticsChart');
      const containerHeight = container.offsetHeight;
      chart.draw(data, {
        ...options,
        height: containerHeight
      });
    };

    // Dibujo inicial y eventos de resize
    updateChartSize();
    window.addEventListener('resize', updateChartSize);
  }

  // Scroll suave para los links del dropdown
  const dropdownLinks = document.querySelectorAll('.dropdown-item[data-scroll]');
  
  dropdownLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Cerrar el dropdown
        const dropdownMenu = document.querySelector('.dropdown-menu');
        dropdownMenu.classList.remove('active');
        
        // Calcular offset para compensar el header fijo
        const headerHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20; // 20px extra de margen
        
        // Scroll suave
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Destacar brevemente el artículo
        targetElement.classList.add('highlight');
        setTimeout(() => {
          targetElement.classList.remove('highlight');
        }, 2000);
      }
    });
  });

  // Scroll suave para los links del dropdown
  document.querySelectorAll('.dropdown-item').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Cerrar el dropdown
        const dropdownMenu = document.querySelector('.dropdown-menu');
        dropdownMenu.classList.remove('active');
        
        // Hacer scroll suave al elemento
        const container = document.querySelector('.volumes-grid');
        const elementLeft = targetElement.offsetLeft;
        const containerWidth = container.clientWidth;
        const elementWidth = targetElement.clientWidth;
        
        // Calcular posición para centrar el elemento
        const scrollTo = elementLeft - (containerWidth - elementWidth) / 2;
        
        container.scrollTo({
          left: scrollTo,
          behavior: 'smooth'
        });
        
        // Efecto de highlight
        targetElement.classList.add('highlight');
        setTimeout(() => {
          targetElement.classList.remove('highlight');
        }, 2000);
      }
    });
  });

  // Inicialización con manejo de errores
  const init = () => {
    try {
      if (!elements.validate()) {
        throw new Error('Faltan elementos DOM necesarios');
      }

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