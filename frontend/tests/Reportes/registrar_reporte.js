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
