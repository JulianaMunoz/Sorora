
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


/*----------------DASHBOARD---------------*/

// ------- Helper: colores para los charts -------
const CHART_COLORS = [
  '#A366FF','#FF6B6B','#FFD166','#06D6A0','#118AB2','#FF9F1C','#845EC2','#00C9A7','#FF6F91'
];

// ------- Función para crear un pie chart (Chart.js) -------
function crearPieChart(ctx, labels, values, title) {
  // destruir chart previo si existe
  if (ctx._chartInstance) {
    ctx._chartInstance.destroy();
  }

  const bg = labels.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);

  ctx._chartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: bg,
        hoverOffset: 8,
      }]
    },
    options: {
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 12, padding: 12 } },
        title: { display: false, text: title }
      },
      maintainAspectRatio: false,
      responsive: true
    }
  });

  return ctx._chartInstance;
}

// ------- Nueva cargarMetricas que dibuja charts -------
async function cargarMetricas() {
  const contenedor = document.getElementById("metricas");
  const resumen = document.getElementById("metricas-resumen");
  const listaUltimos = document.getElementById("listaUltimos");
  const chartPorTipoEl = document.getElementById("chartPorTipo");
  const chartPorEstadoEl = document.getElementById("chartPorEstado");

  if (contenedor) contenedor.innerHTML = "Cargando métricas...";
  if (resumen) resumen.textContent = "Cargando métricas...";
  if (listaUltimos) listaUltimos.innerHTML = "";

  try {
    const res = await fetch("https://api-web-ii.vercel.app/reportes/metricas");
    const data = await res.json();

    if (!res.ok) {
      if (contenedor) contenedor.innerHTML = `<p style="color:red;">Error: ${data.detail || 'Error'}</p>`;
      return;
    }

    // Resumen superior
    if (resumen) {
      resumen.innerHTML = `<strong>Total de reportes:</strong> ${data.total_reportes ?? 0}`;
    }

    // Preparar datos por tipo (para el pie)
    const porTipo = Array.isArray(data.por_tipo) ? data.por_tipo : [];
    const labelsTipo = porTipo.map(t => t._id ?? 'Desconocido');
    const valoresTipo = porTipo.map(t => t.cantidad ?? 0);

    // Preparar datos por estado
    const porEstado = Array.isArray(data.por_estado) ? data.por_estado : [];
    const labelsEstado = porEstado.map(e => e._id ?? 'Desconocido');
    const valoresEstado = porEstado.map(e => e.cantidad ?? 0);

    // Mostrar listados simples en el contenedor (texto)
    if (contenedor) {
      contenedor.innerHTML = `
        <div><strong>Por tipo:</strong></div>
        <ul>
          ${porTipo.map(t => `<li>${t._id}: <b>${t.cantidad}</b></li>`).join('')}
        </ul>
        <div style="margin-top:8px;"><strong>Por estado:</strong></div>
        <ul>
          ${porEstado.map(e => `<li>${e._id}: <b>${e.cantidad}</b></li>`).join('')}
        </ul>
      `;
    }

    // Render charts (Chart.js must be loaded)
    if (typeof Chart === 'undefined') {
      // intenta cargar Chart.js dinámicamente si no está presente
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }

    // crear pie charts con tamaño controlado
    if (chartPorTipoEl) {
      // darle altura razonable
      crearPieChart(chartPorTipoEl.getContext('2d'), labelsTipo, valoresTipo, 'Por tipo');
    }

    if (chartPorEstadoEl) {
      crearPieChart(chartPorEstadoEl.getContext('2d'), labelsEstado, valoresEstado, 'Por estado');
    }

    // ultimos reportes
    if (Array.isArray(data.ultimos_reportes) && listaUltimos) {
      listaUltimos.innerHTML = data.ultimos_reportes.slice(0,8).map(r => `
        <li>
          <strong>${r.tipo}</strong> — ${r.descripcion ? (r.descripcion.length>80 ? r.descripcion.slice(0,80)+'…' : r.descripcion) : ''}
          <br><small>${new Date(r.fecha).toLocaleString()}</small>
        </li>
      `).join('');
    }

  } catch (error) {
    if (contenedor) contenedor.innerHTML = "<p style='color:red;'>Error de conexión con el servidor.</p>";
    console.error("Error cargarMetricas:", error);
  }
}

// Llamar
cargarMetricas();
