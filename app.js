/* ============================
   app.js — Reemplazar completo
   ============================ */

let map;
let userMarker;
let shelterMarkers = [];

/* ---------- API: cargar albergues ---------- */
async function loadShelters() {
  try {
    const response = await fetch("https://api-web-ii.vercel.app/shelters", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const shelters = await response.json();
    console.log("Albergues recibidos:", shelters);
    return shelters;
  } catch (error) {
    console.error("Error al cargar los albergues:", error);
    return [];
  }
}

/* ---------- Mostrar albergues en el mapa ---------- */
function displayShelters(shelters) {
  shelterMarkers.forEach((m) => m.setMap(null));
  shelterMarkers = [];

  shelters.forEach((shelter) => {
    if (!shelter.latitude || !shelter.longitude) return;

    const marker = new google.maps.Marker({
      position: {
        lat: parseFloat(shelter.latitude),
        lng: parseFloat(shelter.longitude),
      },
      map: map,
      title: shelter.name,
      icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    });

    const info = new google.maps.InfoWindow({
      content: `
        <div style="font-size:14px;">
          <strong>${shelter.name}</strong><br>
          Dirección: ${shelter.address || 'No especificada'}<br>
          Capacidad: ${shelter.capacity || 'N/A'}<br>
          Teléfono: ${shelter.phone || 'N/A'}
        </div>
      `,
    });

    marker.addListener("click", () => info.open(map, marker));
    shelterMarkers.push(marker);
  });
}

/* ---------- Inicializar mapa (llamado por la API de Google Maps) ---------- */
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: { lat: 4.711, lng: -74.0721 }, // Bogotá
    mapTypeControl: false,
    streetViewControl: false,
  });

  loadShelters().then((shelters) => displayShelters(shelters));

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };

        userMarker = new google.maps.Marker({
          position: userPos,
          map: map,
          title: "Tu ubicación",
          icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        });

        map.setCenter(userPos);
      },
      () => console.error("No se pudo obtener la ubicación del usuario.")
    );
  }
}

/* ---------- Enviar alerta al backend ---------- */
async function enviarAlerta(lat, lng) {
  try {
    const body = {
      tipo: "Emergencia",
      descripcion: "Botón SOS activado desde el mapa",
      nivel: "Alto",
      latitude: lat,
      longitude: lng,
    };

    const response = await fetch("https://api-web-ii.vercel.app/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error(`Error HTTP ${response.status}`);

    const data = await response.json();
    alert("🚨 Alerta enviada con éxito.\nNotificación generada correctamente.");
    console.log("Respuesta del servidor:", data);
  } catch (err) {
    console.error("Error al enviar alerta:", err);
    alert("❌ Error al enviar la alerta. Revisa la consola.");
  }
}

/* ---------- Manejo DOMContentLoaded: SOS y usuario ---------- */
document.addEventListener("DOMContentLoaded", () => {
  // SOS button
  const sosButton = document.getElementById("sos-button");
  if (sosButton) {
    sosButton.addEventListener("click", async () => {
      if (!userMarker) {
        alert("No se detectó tu ubicación todavía.");
        return;
      }
      const position = userMarker.getPosition();
      await enviarAlerta(position.lat(), position.lng());
    });
  }

  // Botón usuario (estado: iniciar / cerrar sesión)
  const userButton = document.getElementById("button-login");
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (userButton) {
    if (usuario) {
      userButton.textContent = "Cerrar sesión";
      userButton.onclick = cerrarSesion;
    } else {
      userButton.textContent = "Iniciar sesión";
      // Nota: el HTML ya llama handleUserButton() con onclick, así que esto es redundante pero seguro
      userButton.onclick = () => window.location.href = "../Usuario/login_usuario.html"; 
    }
  }
});

/* ---------- Funciones de sesión ---------- */
function cerrarSesion() {
  localStorage.removeItem("usuario");
  window.location.reload();
}

/* ---------- handleUserButton global (llamado desde el HTML) ---------- */
function handleUserButton() {
  // Si quieres comportamiento más complejo (modal, menú, etc.) edítalo aquí.
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (usuario) {
    // ejemplo: mostrar info o cerrar sesión
    if (confirm("¿Quieres cerrar sesión?")) cerrarSesion();
  } else {
    window.location.href = "../Usuario/login_usuario.html";
  }
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
