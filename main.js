// main.js
const headerContainer = document.getElementById('header');
const footerContainer = document.getElementById('footer');

// Cargar el header inmediatamente
fetch('header.html')
  .then(response => response.text())
  .then(data => {
    headerContainer.innerHTML = data;
  });

// Función para cargar el footer con carga diferida
function loadFooter() {
  fetch('footer.html')
    .then(response => response.text())
    .then(data => {
      footerContainer.innerHTML = data;
    });
}

// Observar el scroll de la página y cargar el footer cuando sea necesario
const intersectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && entry.target === footerContainer) {
      loadFooter();
      intersectionObserver.unobserve(entry.target);
    }
  });
});

intersectionObserver.observe(footerContainer);