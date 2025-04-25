import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Registro.css";

function Registro() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    
    console.log("Datos del usuario:", { nombre, correo, usuario, contraseña });

   
    navigate("/login");
  };

  return (
    <div className="contenedor">
      <div className="imagen-container">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCVqZ6USYoOOVuZQfnOXIZyhjcI0zByB1m5rqf1t64acPmhU-LGbUvyZcl_cePadiOyxE&usqp=CAU"
          alt="logo universidad"
        />
      </div>
      <div className="formulario">
        <div className="mensaje">
          <h1>¡Regístrate en nuestra tienda!</h1>
          <h1>Crea una cuenta para explorar nuestros productos</h1>
        </div>
        <label className="label">Nombre</label>
        <input type="text" placeholder="Ingresa tu nombre" onChange={(e) => setNombre(e.target.value)} />
        <label className="label">Correo</label>
        <input type="email" placeholder="Ingresa tu correo" onChange={(e) => setCorreo(e.target.value)} />
        <label className="label">Usuario</label>
        <input type="text" placeholder="Ingresa tu usuario" onChange={(e) => setUsuario(e.target.value)} />
        <label className="label">Contraseña</label>
        <input type="password" placeholder="Ingresa tu contraseña" onChange={(e) => setContraseña(e.target.value)} />
        <button onClick={handleRegister}>Registrarme</button>        
      </div>
    </div>
  );
}

export default Registro;
