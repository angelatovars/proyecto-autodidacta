document.querySelector("#loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const correo = document.querySelector("#correo").value;
  const contraseña = document.querySelector("#contraseña").value;

  try {
    const response = await fetch(
      "https://proyecto-autodidacta-backend.onrender.com/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo, contraseña }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      alert(data.message); // Muestra el mensaje de éxito

      // Guardar el correo en localStorage
      localStorage.setItem("correoUsuario", correo);

      // Redirigir a la página de perfil
      window.location.href = "../index.html"; // Cambia esto a la página de perfil
    } else {
      const errorData = await response.json();
      alert(errorData.message); // Muestra el mensaje de error
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    alert("Hubo un problema al realizar la solicitud.");
  }
});
