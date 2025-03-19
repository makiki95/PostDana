document.addEventListener("DOMContentLoaded", function () {
  const dropdownBtn = document.getElementById("dropdownBtn");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const printBtn = document.getElementById("openModal");
  const printModal = document.getElementById("printModal");
  const closeModalBtn = document.querySelector(".close");

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
    printBtn.addEventListener("click", function () {
      printModal.style.display = "block";
    });

    closeModalBtn.addEventListener("click", function () {
      printModal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
      if (event.target === printModal) {
        printModal.style.display = "none";
      }
    });

    // Close modal with ESC key
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && printModal.style.display === "block") {
        printModal.style.display = "none";
      }
    });
  }
});