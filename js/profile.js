// Función para obtener el perfil de un usuario mediante la API
async function obtenerPerfil(correo) {
  try {
    const response = await fetch(
      `https://proyecto-autodidacta-backend.onrender.com/api/profile?correo=${correo}`
    );

    if (response.ok) {
      const userData = await response.json();
      mostrarPerfil(userData);
      llenarFormularioActualizacion(userData);
    } else {
      const errorData = await response.json();
      alert(errorData.message || "Error al obtener el perfil.");
    }
  } catch (error) {
    console.error("Error al obtener el perfil:", error);
    alert("Error en la conexión con el servidor.");
  }
}

// Función para mostrar los datos del perfil en el frontend
function mostrarPerfil(userData) {
  document.getElementById("nombre").textContent =
    userData.nombre || "No disponible";
  document.getElementById("correo").textContent =
    userData.correo || "No disponible";
  document.getElementById("edad").textContent =
    userData.edad || "No disponible";
  document.getElementById("tema_preferido").textContent =
    userData.tema_preferido || "No disponible";
  document.getElementById("nivel_preferido").textContent =
    userData.nivel_preferido || "No disponible";
}

// Función para llenar el formulario de actualización con los datos actuales
function llenarFormularioActualizacion(userData) {
  document.getElementById("nombre_input").value = userData.nombre || "";
  document.getElementById("edad_input").value = userData.edad || "";
  document.getElementById("tema_preferido_input").value =
    userData.tema_preferido || "";
  document.getElementById("nivel_preferido_input").value =
    userData.nivel_preferido || "";
}

// Función para actualizar el perfil del usuario
async function actualizarPerfil() {
  const correo = localStorage.getItem("correoUsuario");

  // Obtener valores del formulario
  const nombre = document.getElementById("nombre_input").value;
  const edad = document.getElementById("edad_input").value;
  const temaPreferido = document.getElementById("tema_preferido_input").value;
  const nivelPreferido = document.getElementById("nivel_preferido_input").value;

  // Validar campos requeridos
  if (!nombre || !edad) {
    alert("Nombre y edad son campos obligatorios");
    return;
  }

  try {
    const response = await fetch(
      `https://proyecto-autodidacta-backend.onrender.com/api/profile?correo=${correo}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          edad: parseInt(edad),
          tema_preferido: temaPreferido,
          nivel_preferido: nivelPreferido,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert(data.message);
      // Ocultar formulario de actualización
      document.getElementById("updateForm").style.display = "none";
      // Volver a cargar el perfil para mostrar los datos actualizados
      obtenerPerfil(correo);
    } else {
      alert(data.message || "Error al actualizar el perfil");
    }
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    alert("Error en la conexión con el servidor.");
  }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Verificar si el correo del usuario está almacenado en localStorage
  const correoUsuario = localStorage.getItem("correoUsuario");
  if (correoUsuario) {
    obtenerPerfil(correoUsuario);
  } else {
    // Si no está logueado, redirigir al login
    window.location.href = "./login.html";
  }

  // Mostrar formulario de actualización
  document
    .getElementById("mostrar_formulario")
    .addEventListener("click", () => {
      document.getElementById("updateForm").style.display = "block";
    });

  // Botón de guardar cambios
  document
    .getElementById("actualizar_button")
    .addEventListener("click", actualizarPerfil);

  // Botón de cancelar
  document.getElementById("cancelar_button").addEventListener("click", () => {
    document.getElementById("updateForm").style.display = "none";
  });
});
