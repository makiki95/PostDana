document.addEventListener("DOMContentLoaded", function () {
  // Cache DOM elements
  const dropdownBtn = document.getElementById("dropdownBtn");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const printBtn = document.getElementById("openModal");
  const printModal = document.getElementById("printModal");
  const closeModalBtn = document.querySelector(".close");
  const manifiestoBtn = document.getElementById("manifiestoBtn");
  const manifiestoModal = document.getElementById("manifiestoModal");
  const manifiestoClose = manifiestoModal.querySelector(".close");
  
  // Prevent default only for modal and dropdown buttons
  const preventDefaultFor = (element, callback) => {
    if (element) {
      element.addEventListener("click", (e) => {
        e.preventDefault();
        callback(e);
      });
    }
  };

  // Dropdown functionality
  if (dropdownBtn && dropdownMenu) {
    dropdownBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      dropdownMenu.classList.toggle("active");
    });

    document.addEventListener("click", function (event) {
      if (!dropdownBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.classList.remove("active");
      }
    });
  }

  // Modal functionality
  if (printBtn && printModal && closeModalBtn) {
    printBtn.addEventListener("click", function() {
      printModal.style.display = "block";
    });

    closeModalBtn.addEventListener("click", function() {
      printModal.style.display = "none";
    });

    window.addEventListener("click", function(event) {
      if (event.target === printModal) {
        printModal.style.display = "none";
      }
    });

    document.addEventListener("keydown", function(event) {
      if (event.key === "Escape" && printModal.style.display === "block") {
        printModal.style.display = "none";
      }
    });
  }

  // Manifiesto modal functionality
  if (manifiestoBtn && manifiestoModal && manifiestoClose) {
    manifiestoBtn.onclick = function() {
      manifiestoModal.style.display = "block";
    }

    manifiestoClose.onclick = function() {
      manifiestoModal.style.display = "none";
    }

    window.addEventListener('click', function(event) {
      if (event.target == manifiestoModal) {
        manifiestoModal.style.display = "none";
      }
    });
  }

  // Ensure links work correctly
  document.querySelectorAll('.edition-button').forEach(button => {
    if (button.getAttribute('href') && button.getAttribute('href') !== '#') {
      button.addEventListener('click', function(e) {
        // Don't prevent default for valid links
        if (this.getAttribute('download')) {
          // For download links, we might want to show a loading state
          this.classList.add('loading');
          setTimeout(() => {
            this.classList.remove('loading');
          }, 2000);
        }
      });
    }
  });
});