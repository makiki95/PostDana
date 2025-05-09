document.addEventListener("DOMContentLoaded", function () {
  const dropdownBtn = document.getElementById("dropdownBtn");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const printBtn = document.getElementById("openModal");
  const printModal = document.getElementById("printModal");
  const closeModalBtn = document.querySelector(".close");

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

  if (printBtn && printModal && closeModalBtn) {
    printBtn.addEventListener("click", function () {
      printModal.classList.add("active");
    });

    closeModalBtn.addEventListener("click", function () {
      printModal.classList.remove("active");
    });

    printModal.addEventListener("click", function (event) {
      if (event.target === printModal) {
        printModal.classList.remove("active");
      }
    });
  }
});
