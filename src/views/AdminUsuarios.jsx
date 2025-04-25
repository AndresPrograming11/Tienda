import { useState } from "react";
import "../style/AdminUsuarios.css"; 

function AdminUsuarios() {  
  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nombre: "Carlos Pérez",
      correo: "carlos@example.com",
      usuario: "carlos",
      rol: "admin",
      contraseña: "••••••••"
    },
    {
      id: 2,
      nombre: "Ana Gómez",
      correo: "ana@example.com",
      usuario: "ana",
      rol: "user",
      contraseña: "••••••••"
    }
  ]);

  const eliminarUsuario = (id) => {
    const confirmacion = window.confirm("¿Estás seguro de eliminar este usuario?");
    if (confirmacion) {
      setUsuarios(usuarios.filter(u => u.id !== id));
    }
  };

  const editarUsuario = (id) => {
    alert(`Aquí puedes redirigir o abrir un modal para editar al usuario con ID ${id}`);
  };

  return (
    <div className="admin-usuarios">
      <h2>Gestión de Usuarios</h2>
      <table className="usuarios-tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Contraseña</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.nombre}</td>
              <td>{usuario.correo}</td>
              <td>{usuario.usuario}</td>
              <td>{usuario.rol}</td>
              <td>{usuario.contraseña}</td>
              <td>
                <button onClick={() => editarUsuario(usuario.id)} className="btn-editar">Editar</button>
                <button onClick={() => eliminarUsuario(usuario.id)} className="btn-eliminar">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsuarios;