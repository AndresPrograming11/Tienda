import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Importamos Link
import "../style/login.css";

function Login({ autentificar, setRole }) {
  const [Usuario, setUsuario] = useState("");
  const [Contraseña, setContraseña] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (Usuario === "admin" && Contraseña === "admin123") {
      autentificar(true);
      setRole("admin");
      localStorage.setItem("isAuth", "true");
      localStorage.setItem("role", "admin");
      navigate("/admin");
    } else if (Usuario === "user" && Contraseña === "user123") {
      autentificar(true);
      setRole("user");
      localStorage.setItem("isAuth", "true");
      localStorage.setItem("role", "user");
      navigate("/");
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="contenedor">
      <div className="imagen-container">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCVqZ6USYoOOVuZQfnOXIZyhjcI0zByB1m5rqf1t64acPmhU-LGbUvyZcl_cePadiOyxE&usqp=CAU" alt="logo universidad" />
      </div>
      <div className="formulario">
        <div className="mensaje">
          <h1>¡Bienvenido a nuestra tienda! </h1>
          <h1>Accede para conocer nuestros productos</h1>
        </div>
        <label className="label">Usuario</label>
        <input type="text" placeholder="Usuario" onChange={(e) => setUsuario(e.target.value)} />
        <label className="label">Contraseña</label>
        <input type="password" placeholder="Contraseña" onChange={(e) => setContraseña(e.target.value)} />
        <button onClick={handleLogin}>Ingresar</button>
        <div className="informacion">
          <h1>¿No tienes cuenta? <Link to="/registro">Registrarme</Link></h1>
          <h1>¿Has olvidado tu contraseña? <Link to="/restablecerpass">Restablecer</Link></h1>
        </div>
      </div>
    </div>
  );
}

export default Login;
