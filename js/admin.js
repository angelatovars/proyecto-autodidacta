document.addEventListener("DOMContentLoaded", async () => {
  // Verificar si el usuario es admin al cargar la página
  const correo = localStorage.getItem("correoUsuario");

  if (!correo) {
    window.location.href = "login.html";
    return;
  }

  try {
    // Verificar permisos de admin
    const adminResponse = await fetch(
      `https://proyecto-autodidacta-backend.onrender.com/api/auth/verificar-admin?correo=${correo}`
    );

    if (!adminResponse.ok) {
      window.location.href = "index.html";
      return;
    }

    // Cargar estadísticas generales
    const estadisticasResponse = await fetch(
      "https://proyecto-autodidacta-backend.onrender.com/api/admin/estadisticas"
    );
    const estadisticas = await estadisticasResponse.json();

    // Mostrar estadísticas de usuarios
    document.querySelector("#total-usuarios").textContent =
      estadisticas.totalUsuarios;
    document.querySelector("#usuarios-activos").textContent =
      estadisticas.usuariosActivos;
    document.querySelector("#nuevos-usuarios").textContent =
      estadisticas.nuevosUsuarios;

    // Cargar todos los usuarios
    const usuariosResponse = await fetch(
      "https://proyecto-autodidacta-backend.onrender.com/api/admin/usuarios"
    );
    const usuarios = await usuariosResponse.json();

    // Poblar tabla de usuarios
    const tablaRanking = document.querySelector("#ranking-body");
    tablaRanking.innerHTML = ""; // Limpiar tabla antes de agregar datos

    usuarios.forEach((usuario, index) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
                <td>${index + 1}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.correo}</td>
                <td>${usuario.edad || "N/A"}</td>
                <td>${
                  usuario.fecha_registro
                    ? new Date(usuario.fecha_registro).toLocaleDateString()
                    : "N/A"
                }</td>
                <td>${usuario.is_admin ? "Sí" : "No"}</td>
                <td>${usuario.nivel_preferido || "N/A"}</td>
                <td>${usuario.tema_preferido || "N/A"}</td>
                <td>${
                  usuario.ultima_actividad
                    ? new Date(usuario.ultima_actividad).toLocaleDateString()
                    : "N/A"
                }</td>
            `;
      tablaRanking.appendChild(fila);
    });
  } catch (error) {
    console.error("Error al cargar el dashboard:", error);
    alert("No se pudieron cargar los datos del dashboard");
    window.location.href = "index.html";
  }
});

// Modificar el login para mantener la lógica de verificación de admin
document.querySelector("#loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const correo = document.querySelector("#correo").value;
  const contraseña = document.querySelector("#contraseña").value;

  try {
    // Primero autenticar el usuario
    const loginResponse = await fetch(
      "https://proyecto-autodidacta-backend.onrender.com/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo, contraseña }),
      }
    );

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();

      // Verificar si es administrador
      const adminResponse = await fetch(
        `https://proyecto-autodidacta-backend.onrender.com/api/auth/verificar-admin?correo=${correo}`,
        {
          method: "GET",
        }
      );

      if (adminResponse.ok) {
        // Si es admin, guardar correo y redirigir al dashboard
        localStorage.setItem("correoUsuario", correo);
        window.location.href = "admin-dashboard.html";
      } else {
        alert("No tienes permisos de administrador");
      }
    } else {
      const errorData = await loginResponse.json();
      alert(errorData.message);
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    alert("Hubo un problema al realizar la solicitud");
  }
});
