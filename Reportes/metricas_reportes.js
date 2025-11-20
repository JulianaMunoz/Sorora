async function cargarMetricas() {
  const contenedor = document.getElementById("metricas");
  contenedor.innerHTML = "Cargando métricas...";

  try {
    const res = await fetch("https://api-web-ii.vercel.app/reportes/metricas");
    const data = await res.json();

    if (!res.ok) {
      contenedor.innerHTML = `<p style="color:red;">Error: ${data.detail}</p>`;
      return;
    }

    let html = `
      <p><strong>Total de reportes:</strong> ${data.total_reportes}</p>
      <div class="section-title">Por tipo:</div>
      <ul>
        ${data.por_tipo.map(t => `<li>${t._id}: <b>${t.cantidad}</b></li>`).join("")}
      </ul>

      <div class="section-title">Por estado:</div>
      <ul>
        ${data.por_estado.map(e => `<li>${e._id}: <b>${e.cantidad}</b></li>`).join("")}
      </ul>

      <div class="section-title">Últimos reportes:</div>
      <ul>
        ${data.ultimos_reportes.map(r => `
          <li>
            <b>${r.tipo}</b> - ${r.descripcion}<br>
            <small>Fecha: ${new Date(r.fecha).toLocaleString()}</small>
          </li>
        `).join("")}
      </ul>
    `;

    contenedor.innerHTML = html;

  } catch (error) {
    contenedor.innerHTML = "<p style='color:red;'>Error de conexión con el servidor.</p>";
  }
}

cargarMetricas();

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
