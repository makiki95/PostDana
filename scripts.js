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
    validate() {
      return this.dropdownBtn && this.dropdownMenu && this.printBtn && this.manifiestoBtn;
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

        const toggleDropup = (e) => {
          e.stopPropagation();
          
          // Cerrar otros dropups primero
          dropups.forEach(otherDropup => {
            if (otherDropup !== dropup) {
              const otherContent = otherDropup.querySelector('.dropup-content');
              if (otherContent?.classList.contains('active')) {
                otherContent.classList.remove('active');
              }
            }
          });

          // Toggle el actual con una pequeña animación
          if (!content.classList.contains('active')) {
            content.style.display = 'block';
            requestAnimationFrame(() => {
              content.classList.add('active');
            });
          } else {
            content.classList.remove('active');
          }
        };

        button.addEventListener('click', toggleDropup);
      });

      // Cerrar al hacer click fuera
      document.addEventListener('click', (e) => {
        const isClickInside = e.target.closest('.dropup');
        if (!isClickInside) {
          dropups.forEach(dropup => {
            const content = dropup.querySelector('.dropup-content');
            if (content?.classList.contains('active')) {
              content.classList.remove('active');
            }
          });
        }
      });

      // Cerrar con Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          dropups.forEach(dropup => {
            const content = dropup.querySelector('.dropup-content');
            if (content?.classList.contains('active')) {
              content.classList.remove('active');
            }
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
      ['Gobierno Autonómico Actual', 25, 'Gobierno Autonómico Actual: 25%'],
      ['Gobierno Central', 24, 'Gobierno Central: 24%'],
      ['Gobiernos Autonómicos anteriores', 17, 'Gobiernos Autonómicos anteriores: 17%'],
      ['AEMET y CHJ', 14, 'AEMET y CHJ: 14%'],
      ['Autoridades locales', 12, 'Autoridades locales: 12%'],
      ['Protección Civil', 8, 'Protección Civil: 8%']
    ];

    const chartTexts = {
      'Gobierno Autonómico Actual': {
        title: 'Gobierno Autonómico Actual (Carlos Mazón): 25%',
        text: '<p>⚠ Retraso crítico en activación del nivel máximo de alerta (Nivel 3).</p><br><p>⚠ Grave fallo en la comunicación de emergencias (ES-ALERT).</p><br><p>⚠ Descoordinación en momentos cruciales (CECOPI activado tarde, liderazgo difuso).</p><br><p>⚠ Subestimación pública inicial de la gravedad del desastre.</p><br><p>⚠ Continuación de su agenda durante el desastre, con el objetivo de colocar a personal a dedo en el canal de À Punt.</p>'
      },
      'Gobierno Central': {
        title: 'Gobierno Central (Presidencia, Ministerio del Interior, Ministerio de Defensa, Ministerio para la Transición Ecológica y UME): 24%',
        text: '<p>⚠ No se declaró el Nivel 3 de emergencia ni el estado de alarma pese a la gravedad de la tragedia. Pedro Sánchez regresó de la India el 30 de octubre, aunque ya el 29 había desaparecidos por la riada y se retrasó en la actuación inmediata (Art. 23 de la ley 17/2015).</p><br><p>⚠ El Ministerio de Defensa se retrasó en la movilización de la UME y el Ejército (Ante el argumento de "el ejército solo servía para limpiar, daba igual si venía pronto o tarde": Aquí murieron personas en burbujas de aire o bajo vehículos, además, se necesitaba control en las calles y distribución de recursos básicos, como agua potable).</p><br><p>⚠ Rechazo de ayuda internacional, como la ofrecida por Francia, entre otros, por decisión del Ministerio del Interior.</p><br><p>⚠ Prioridad de la ejecutiva central ajena al desastre, como el nombramiento a dedo de consejeros de RTVE.</p><br><p>⚠ Lentitud en la entrega de ayudas directas y negativa a indemnizar justamente a agricultores por expropiaciones.</p><br><p>⚠ Inversión en campañas políticas y redes sociales en lugar de ayuda directa desde el primer día.</p>'
      },
      'Gobiernos Autonómicos anteriores': {
        title: 'Gobiernos Autonómicos anteriores (Camps, Fabra, Puig): 17%',
        text: '<p>⚠ Incumplimiento reiterado del PATRICOVA desde 2007 hasta 2023.</p><br><p>⚠ No ejecución sistemática de infraestructuras críticas previstas (Barranco del Poyo, Río Magro, protección industrial y urbana).</p><br><p>⚠ Desatención constante a advertencias técnicas previas.</p>'
      },
      'AEMET y CHJ': {
        title: 'AEMET y CHJ (gestión técnica y preventiva): 14%',
        text: '<p>⚠ Polémica gestión operativa en la apertura de compuertas de Forata al 100%, agravando inundaciones locales.</p><br><p>⚠ Insuficiente mantenimiento preventivo en cauces y barrancos (vegetación acumulada).</p><br><p>⚠ Problemas previos y sospechosos en la reparación y operación del radar meteorológico.</p><br><p>⚠ Caudalímetros inutilizados o mal gestionados que dificultaron previsiones técnicas.</p>'
      },
      'Autoridades locales': {
        title: 'Autoridades locales (Ayuntamientos): 12%',
        text: '<p>⚠ Preparación insuficiente y planes de emergencia obsoletos.</p><br><p>⚠ Limitada respuesta inmediata y proactiva con recursos locales.</p><br><p>⚠ Dependencia pasiva excesiva respecto a niveles administrativos superiores.</p><br><p>⚠ Falta crítica de comunicación entre municipios cercanos, como en el caso evidente de Torrent y Paiporta, donde las alertas no fueron transmitidas eficazmente. En Torrent, padres recibieron notificaciones para recoger a sus hijos del colegio a las 12:30, lo que levanta sospechas sobre por qué esta información no llegó a Paiporta a tiempo para actuar eficazmente.</p><br><p>⚠ Episodios de tensión y mala gestión post-DANA en plenos municipales específicos.</p>'
      },
      'Protección Civil': {
        title: 'Protección Civil y Técnicos Regionales: 8%',
        text: '<p>⚠ Retraso evidente en activar protocolos específicos.</p><br><p>⚠ Graves errores en comunicación interna del riesgo en tiempo real.</p><br><p>⚠ Falta de decisión y agilidad en la interpretación de datos técnicos (AEMET y CHJ).</p>'
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
        const modalTitle = document.getElementById('chartModalTitle');
        const modalText = document.getElementById('chartModalText');
        
        // Actualizar los textos con los datos correspondientes
        if (chartTexts[value]) {
          modalTitle.innerHTML = chartTexts[value].title;
          modalText.innerHTML = chartTexts[value].text;
        }

        // Deseleccionar después de mostrar la información
        setTimeout(() => {
          chart.setSelection([]);
        }, 10);
      }
    }

    // Agregar el listener para los clicks
    google.visualization.events.addListener(chart, 'select', selectHandler);

    // Dibujar la gráfica inicial
    chart.draw(data, options);
    
    // Inicializar con el primer texto
    const firstKey = Object.keys(chartTexts)[0];
    if (firstKey) {
      const modalTitle = document.getElementById('chartModalTitle');
      const modalText = document.getElementById('chartModalText');
      modalTitle.innerHTML = chartTexts[firstKey].title;
      modalText.innerHTML = chartTexts[firstKey].text;
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

  // Fix dropup functionality for manifesto and print buttons
  const dropups = document.querySelectorAll('.dropup');
  dropups.forEach(dropup => {
    const button = dropup.querySelector('.modal-button');
    const content = dropup.querySelector('.dropup-content');

    if (button && content) {
      button.addEventListener('click', (e) => {
        e.stopPropagation();

        // Close other dropups
        dropups.forEach(otherDropup => {
          const otherContent = otherDropup.querySelector('.dropup-content');
          if (otherContent !== content) {
            otherContent.classList.remove('active');
          }
        });

        // Toggle current dropup
        content.classList.toggle('active');
      });
    }
  });

  // Close dropups when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropup')) {
      dropups.forEach(dropup => {
        const content = dropup.querySelector('.dropup-content');
        content.classList.remove('active');
      });
    }
  });

  // Close dropups with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropups.forEach(dropup => {
        const content = dropup.querySelector('.dropup-content');
        content.classList.remove('active');
      });
    }
  });

  // Función mejorada para manejar cookies
  function handleCookieConsent() {
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptAllBtn = document.getElementById('acceptAllCookies');
    const acceptSelectedBtn = document.getElementById('acceptSelectedCookies');
    const rejectBtn = document.getElementById('rejectCookies');
    const analyticsCb = document.getElementById('analyticsCookies');
    const marketingCb = document.getElementById('marketingCookies');

    // Verificar si ya hay preferencias guardadas
    const cookiePreferences = localStorage.getItem('cookiePreferences');
    
    if (!cookiePreferences) {
      setTimeout(() => {
        cookieBanner.classList.add('show');
      }, 1000);
    }

    function saveCookiePreferences(preferences) {
      localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
      cookieBanner.classList.remove('show');
      
      setTimeout(() => {
        cookieBanner.style.display = 'none';
      }, 300);
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

  // Inicializar el manejo de cookies cuando el DOM esté listo
  document.addEventListener('DOMContentLoaded', handleCookieConsent);
});

// Inicializar el banner de cookies cuando se carga la página
document.addEventListener('DOMContentLoaded', initCookieBanner);