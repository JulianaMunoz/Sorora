document.getElementById("formReporte").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    tipo: document.getElementById("tipo").value,
    descripcion: document.getElementById("descripcion").value,
    ubicacion: document.getElementById("ubicacion").value,
    reportado_por: document.getElementById("reportado_por").value
  };

  try {
    const res = await fetch("https://api-web-ii.vercel.app/reportes/registrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const json = await res.json();
    const resultado = document.getElementById("resultado");

    if (res.ok) {
      resultado.style.color = "green";
      resultado.textContent = json.mensaje;
      e.target.reset();
    } else {
      resultado.style.color = "red";
      resultado.textContent = `Error: ${json.detail || "No se pudo registrar el reporte"}`;
    }

  } catch (error) {
    document.getElementById("resultado").textContent = "Error de conexión con el servidor.";
  }
});

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