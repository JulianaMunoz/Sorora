
async function cargarNoticias() {
      const contenedor = document.getElementById("contenedorNoticias");
      contenedor.textContent = "Cargando noticias...";
      try {
        const res = await fetch("https://api-web-ii.vercel.app/noticias/lista");
        if (!res.ok) throw new Error("Error al cargar noticias");
        const noticias = await res.json();

        if (noticias.length === 0) {
          contenedor.textContent = "No hay noticias para mostrar.";
          return;
        }

        contenedor.innerHTML = noticias.map(n => `
          <div class="noticia">
            <div class="titulo">${n.titulo}</div>
            <div class="fecha">${new Date(n.fecha).toLocaleString()}</div>
            <div class="descripcion">${n.descripcion}</div>
            <div class="autor">Por: ${n.autor}</div>
          </div>
        `).join("");
      } catch (error) {
        contenedor.textContent = "Error al cargar las noticias.";
      }
    }

    cargarNoticias();

// al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  const userButton = document.getElementById("button-login");
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (usuario) {
    userButton.textContent = "Cerrar sesión";
    userButton.onclick = cerrarSesion;
  } else {
    userButton.textContent = "Iniciar sesión";
    userButton.onclick = () => window.location.href = "../Usuario/login_usuario.html";
  }
});

function cerrarSesion() {
  localStorage.removeItem("usuario"); 
  window.location.reload(); 
}

function handleUserButton() {
  window.location.href = "../Usuario/login_usuario.html";
}

/* ---------- MENU HAMBURGUESA: visibilidad condicional + toggle ---------- */

// referenciamos elementos de menú
const navbar = document.querySelector(".navbar");
const menuToggle = document.querySelector(".menu-toggle");

// definimos toggleMenu como global (para que onclick en HTML funcione)
window.toggleMenu = function () {
  if (!navbar) return;
  navbar.classList.toggle("open");
};

// Función que controla la visibilidad del icono hamburguesa según ancho
function updateMenuToggleVisibility() {
  if (!menuToggle || !navbar) return;
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  if (isMobile) {
    // quitamos estilo inline que podría haber dejado JS previo
    menuToggle.style.display = "";
  } else {
    // ocultar el icono y forzar cerrar el menú para desktop
    menuToggle.style.display = "none";
    navbar.classList.remove("open");
  }
}

// Inicializar visibilidad una vez cargue la página (y después cuando se redimensione)
window.addEventListener("load", updateMenuToggleVisibility);

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(updateMenuToggleVisibility, 120);
});

/* ---------- Seguridad: si el menuToggle fue clickado programáticamente ---------- */
if (menuToggle) {
  // Si alguien le pone display block por error desde fuera, nos aseguramos en el inicio
  updateMenuToggleVisibility();
}

/* ---------- FIN del archivo ---------- */