let map;
let userMarker;
let shelterMarkers = [];

// Función para obtener los albergues del API
async function loadShelters() {
  try {
    const response = await fetch("https://api-web-ii.vercel.app/shelters", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const shelters = await response.json();
    console.log("Albergues recibidos:", shelters);
    return shelters;
  } catch (error) {
    console.error("Error al cargar los albergues:", error);
    return [];
  }
}

// Función para mostrar los albergues en el mapa
function displayShelters(shelters) {
  // Eliminar marcadores antiguos
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
          Dirección: ${shelter.address}<br>
          Capacidad: ${shelter.capacity}<br>
          Teléfono: ${shelter.phone}
        </div>
      `,
    });

    marker.addListener("click", () => info.open(map, marker));
    shelterMarkers.push(marker);
  });
}

// Inicializar mapa
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: { lat: 4.711, lng: -74.0721 }, // Bogotá
    mapTypeControl: false,
    streetViewControl: false,
  });

  // Cargar albergues
  loadShelters().then((shelters) => {
    displayShelters(shelters);
  });

  // Obtener ubicación del usuario
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userPos = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

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

// Enviar alerta al backend
async function enviarAlerta(lat, lng) {
  try {
    const body = {
        tipo: "Emergencia",
        descripcion: "Botón SOS activado desde el mapa",
        nivel: "Alto",
        latitude: lat,
        longitude: lng
    };


    const response = await fetch("https://api-web-ii.vercel.app/alerts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    const data = await response.json();
    alert("🚨 Alerta enviada con éxito.\nNotificación generada correctamente.");
    console.log("Respuesta del servidor:", data);
  } catch (err) {
    console.error("Error al enviar alerta:", err);
    alert("❌ Error al enviar la alerta. Revisa la consola.");
  }
}

// Evento para el botón SOS
document.addEventListener("DOMContentLoaded", () => {
  const sosButton = document.getElementById("sos-button");
  sosButton.addEventListener("click", async () => {
    if (!userMarker) {
      alert("No se detectó tu ubicación todavía.");
      return;
    }

    const position = userMarker.getPosition();
    await enviarAlerta(position.lat(), position.lng());
  });
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


