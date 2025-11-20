
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
