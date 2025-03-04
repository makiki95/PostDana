document.addEventListener("DOMContentLoaded", function () {
  const dropdownBtn = document.getElementById("dropdownBtn");
  const dropdownMenu = document.getElementById("dropdownMenu");

  if (!dropdownBtn || !dropdownMenu) {
    console.error("⚠️ Error: No se encontraron los elementos del menú desplegable.");
    return;
  }

  dropdownBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    dropdownMenu.classList.toggle("active");
  });

  document.addEventListener("click", function (event) {
    if (!dropdownBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
      dropdownMenu.classList.remove("active");
    }
  });
});
