import React, { useState, useEffect, useCallback } from "react"; //sirve para useState:menaje estados internos del componente , useEffect:majea el cuando el componente se monta o cambia y UseCallback Para memorizar fucniones y evitar que se redefinan innecesariamente 

import "../style/NavbarTop.css";  //Aqui importamos el css desde la ruta 
import { registrarUsuario } from "../services/registro"; //llamamos funciones que me permiten comunicarme con el backend
import { crearArticulo } from "../services/articulos";//llamamos funciones que me permiten comunicarme con el backend
import { obtenerCarrito} from "../services/carritoItem";//llamamos funciones que me permiten comunicarme con el backend
import { pagarConStripe } from "../services/pagoStripe";//llamamos funciones que me permiten comunicarme con el backend
import { actualizarCantidadCarrito, eliminarDelCarritoBD } from '../services/carritoItem';//llamamos funciones que me permiten comunicarme con el backend

function NavbarTop() {
  
  const [MenuRedespegable, setMenuRedespegable] = useState(false);//Crea un estado para controlar que el menuRespegable esta abierto o cerrado en este caso esta inicialmente cerrado(false)
  const [tiendaSeleccionada, setTiendaSeleccionada] = useState(false);//Crea un estado para controlar que el TiendaSelecccionada esta seleccionada o no en este caso esta inicialmente no hay tienda seleccionada(false)
  const [modalAbierto, setModalAbierto] = useState(false);//Crea un estado para controlar que el ModalAbierto si la venta emergente que sale esta abiierta o cerrada, en este caso true modal visible o false para cerrado
  const [tipoModal, setTipoModal] = useState("usuario");//Degine el tipo de modal que se mostrara en este caso sera usuario pero tenemos modal admin y modal carrito
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || "user");//Traemos localStrorage de login aqui traemos el item role y usuerio aqui cuando no exista un rol tomara un valor por defecto user . Esto sirve para mostrar las vistas o accesos segun el rol
  const [carritoItems, setCarritoItems] = useState([]);//Se utiliza para mantener los productos agregados en el carrito de compras en un arreglo.. donde inicialmente esta vacio 
  const [totalCarrito, setTotalCarrito] = useState(0);//Se utiliza para guardar el costo del carrito que va a inicializar en cero , serivira para mostrar cuanto va a pagar el usuario
  const userId = localStorage.getItem("userId");//Se trae userId desde login donde podemos traer el numero del usuario para aplicarlo en posteriores funciones

  // Usuario
  const [nombre, setNombre] = useState("");//Se utiliza para obtener el nombre pero se inicializa como cadena vacia sin valores
  const [correo, setCorreo] = useState("");//Se utiliza para obtener el correo pero se inicializa como cadena vacia sin valores
  const [usuario, setUsuario] = useState("");//Se utiliza para obtener el usuario pero se inicializa como cadena vacia sin valores
  const [contraseña, setContraseña] = useState("");//Se utiliza para obtener la contraseña pero se inicializa como cadena vacia sin valores
  const [mensaje, setMensaje] = useState("");//Se utiliza para obtener el mensaje pero se inicializa como cadena vacia sin valores
  const [datosRegistrados, setDatosRegistrados] = useState(null);//Se utiliza para guardar los datos del uusuario recien registrado , actualiza los valores con setDatosRegistrados y la variable es null diciendo que no tiene datos aun registrados

  // Artículo
  const [nombreArticulo, setNombreArticulo] = useState("");//Se utiliza para obtener el nombre del articulo pero se inicializa como cadena vacia sin valores
  const [precioArticulo, setPrecioArticulo] = useState("");//Se utiliza para obtener el nombre del articulo pero se inicializa como cadena vacia sin valores
  const [imagen, setImagen] = useState(null);//Se utiliza para guardar el formato de imagen ya sea jpg o png aunuque inicialmente este en null
  const [descripcion, setDescripcion] = useState("");//Se utiliza para obtener la descripcion pero se inicializa como cadena vacia sin valores
  const [categoria, setCategoria] = useState("");//Se utiliza para obtener la categoria del articulo pero se inicializa como cadena vacia sin valores
  const [glb, setGlb] = useState(null);//Guarda los modelos ,glb donde un modelo 3D del articulo usado para visualizacion 3D en la web
  const [usdz, setUsdz] = useState(null);//Guarda los modelos ,usdz donde un modelo 3D del articulo usado para visualizacion en dispositivos apple
  

useEffect(() => {// Hook de efecto que se ejecuta una sola vez al montar el componente  
  const role = localStorage.getItem("role");// Obtiene el rol del usuario almacenado en localStorage  
  if (role) setUserRole(role);// Si existe un rol, se actualiza el estado userRole
}, []);// [] indica que solo se ejecuta una vez, al montar

  useEffect(() => {
    if (userId) {
      obtenerCarrito(userId)
        .then(setCarritoItems)
        .catch(error => console.error("Error al cargar el carrito:", error));
    } else {
      setCarritoItems([]);
    }
  }, [userId]);

  const calcularTotal = useCallback((items) => {
    if (!Array.isArray(items) || items.length === 0) {
      setTotalCarrito(0);
      return;
    }
    const nuevoTotal = items.reduce((acc, item) => {
      const precio = parseFloat(item.precio) || 0;
      const cantidad = Number(item.cantidad) || 1;
      return acc + precio * cantidad;
    }, 0);
    setTotalCarrito(nuevoTotal);
  }, []);

  useEffect(() => {
    calcularTotal(carritoItems);
  }, [carritoItems, calcularTotal]);

  const toggleMenuRedespegable = () => setMenuRedespegable(!MenuRedespegable);

  const AbrirTienda = async () => {
    const carrito = await obtenerCarrito(userId);
    setCarritoItems(carrito);
    setTiendaSeleccionada(true);
  };
  
  const CerrarTienda = () => setTiendaSeleccionada(false);

  const getTitle = () => {
    if (location.pathname.includes("camisas")) return "Camisas";
    if (location.pathname.includes("pantalones")) return "Pantalones";
    if (location.pathname.includes("uniformes")) return "Uniformes";
    return "Principal productos";
  };

  const abrirModal = (tipo) => {
    setTipoModal(tipo);
    setMensaje("");
    setDatosRegistrados(null);
    setModalAbierto(true);
  };

  const manejarRegistroUsuario = async () => {
    const res = await registrarUsuario(nombre, correo, usuario, contraseña);
    setMensaje(res.message);
    if (res.success) {
      setDatosRegistrados({ nombre, correo, usuario });
      setNombre("");
      setCorreo("");
      setUsuario("");
      setContraseña("");
    }
  };

  const manejarGuardarArticulo = async () => {
    if (!nombreArticulo || !precioArticulo || !descripcion || !categoria || !imagen) {
      setMensaje("Todos los campos son obligatorios.");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombreArticulo);
    formData.append("precio", precioArticulo);
    formData.append("imagen", imagen);
    formData.append("descripcion", descripcion);
    formData.append("categoria", categoria);
    if (glb) formData.append("modeloGLB", glb);
    if (usdz) formData.append("modeloUSDZ", usdz);

    const res = await crearArticulo(formData);
    setMensaje(res.message);
    if (res.success) {
      setDatosRegistrados({
        nombre: nombreArticulo,
        precio: precioArticulo,
        descripcion,
        categoria,
        imagen: imagen.name,
        glb: glb?.name || "No adjunto",
        usdz: usdz?.name || "No adjunto"
      });
      setNombreArticulo("");
      setPrecioArticulo("");
      setImagen(null);
      setDescripcion("");
      setCategoria("");
      setGlb(null);
      setUsdz(null);
    }
  };

const aumentarCantidadCarrito = async (itemId) => {
  const updatedCarrito = carritoItems.map(item =>
    item.id === itemId ? { ...item, cantidad: (item.cantidad || 0) + 1 } : item
  );
  setCarritoItems(updatedCarrito);
  await actualizarCantidadCarrito(itemId, (carritoItems.find(i => i.id === itemId)?.cantidad || 0) + 1);
};

const disminuirCantidadCarrito = async (itemId) => {
  const item = carritoItems.find(i => i.id === itemId);
  if (item && item.cantidad > 1) {
    const updatedCarrito = carritoItems.map(i =>
      i.id === itemId ? { ...i, cantidad: i.cantidad - 1 } : i
    );
    setCarritoItems(updatedCarrito);
    await actualizarCantidadCarrito(itemId, item.cantidad - 1);
  }
};

const eliminarItem = async (itemId) => {
  const updatedCarrito = carritoItems.filter(item => item.id !== itemId);
  setCarritoItems(updatedCarrito);
  await eliminarDelCarritoBD(itemId);
};
  

const realizarPago = () => {
  if (!carritoItems?.length) {
    return alert("Tu carrito está vacío.");
  }
  
  localStorage.setItem("facturaData", JSON.stringify({
    usuario_id: userId,
    fecha: new Date().toISOString().split('T')[0],
    total: totalCarrito,
    items: carritoItems.map(({ id, articulo_id, cantidad, talla, nombre, precio }) => ({
      id, 
      articulo_id,
      producto_id: articulo_id, 
      cantidad,
      talla: talla || null,
      nombre_producto: nombre,
      precio_producto: precio,
    })),
  }));
  
  

  // Redirige al flujo de pago (Stripe u otra pasarela)
  pagarConStripe({ items: carritoItems, total: totalCarrito });
};


  // Funciones de ejemplo para agregar items (puedes eliminarlas o adaptarlas)
  const handleAgregarCamisaAzul = () => {
    const nuevoItem = {
      id: Date.now() + 1,
      nombre: 'Camisa Azul',
      precio: 20.00,
      cantidad: 1,
      talla: 'M',
      precioTotal: 20.00,
      imagen: 'https://media.falabella.com/falabellaCO/126474214_01/w=1500,h=1500,fit=pad',
    };
    setCarritoItems([...carritoItems, nuevoItem]);
  };

  const handleAgregarPantalonNegro = () => {
    const nuevoItem = {
      id: Date.now() + 2,
      nombre: 'Pantalón Negro',
      precio: 35.00,
      cantidad: 1,
      talla: 'L',
      precioTotal: 35.00,
      imagen: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTp5DFqQ3JyvuSJmSEmsCBw93bzbe4RsLFW2fkOJjKNRQuP-pFA4E7DcinQklE-eXSiOJLJDAytkxnixHllyhVH-1VYPFFaEBXTAGR8MjP3WLAvAuC2WauSXw',
    };
    setCarritoItems([...carritoItems, nuevoItem]);
  };

  const handleAgregarZapatosDeportivos = () => {
    const nuevoItem = {
      id: Date.now() + 3,
      nombre: 'Zapatos Deportivos',
      precio: 60.00,
      cantidad: 1,
      talla: '42',
      precioTotal: 60.00,
      imagen: 'https://versilia.com.co/cdn/shop/products/HOMBREADONAIAZULREF004640-3.jpg?v=1656173363&width=1200',
    };
    setCarritoItems([...carritoItems, nuevoItem]);
  };

  console.log("Estado carritoItems en NavbarTop:", carritoItems);

  return (
    <nav className="navbar-top">
      {userRole === "user" ? (
        <>
          <ul className="nav-links-top">
            <li onClick={toggleMenuRedespegable}>{getTitle()}</li>
            {/* Estos botones son solo de ejemplo para agregar al carrito */}
            <button onClick={handleAgregarCamisaAzul}>camisa azul al carrito</button>
            <button onClick={handleAgregarPantalonNegro}>pantalón negro al carrito</button>
            <button onClick={handleAgregarZapatosDeportivos}>Agregar los zapatos al carrito</button>
            <li><button onClick={AbrirTienda} className={tiendaSeleccionada ? "tienda-seleccionada" : ""}>🛒</button></li>
          </ul>
          {tiendaSeleccionada && (
            <div className="fondo-negro">
              <div className="carrito-contenedor">
                <div className="titulo-carrito">
                  <button className="cerrar-carrito" onClick={CerrarTienda}>⬅</button>
                  <h2>🛒 Tu carrito</h2>
                </div>
                <div className="carrito-lista">
                  {Array.isArray(carritoItems) && carritoItems.length > 0 ? (
                    carritoItems.map(item => (
                      <div className="carrito-item" key={item.id}>
                        {item.imagen && <img src={item.imagen} alt={item.nombre} />}
                        <div className="info-carrito">
                          <h4>{item.nombre || item.articulo_id}</h4>
                          <div className="contador">
                            <button onClick={() => aumentarCantidadCarrito(item.id)}>+</button>
                            <span>{item.cantidad || 1}</span>
                            <button onClick={() => disminuirCantidadCarrito(item.id)}>-</button>
                          </div>
                          {item.talla && <span>Talla: {item.talla}</span>}
                          <button className="borrar-btn" onClick={() => eliminarItem(item.id)}>🗑</button>
                        </div>
                        <div className="precio-carrito">
                          <span>${((parseFloat(item.precio) || 0) * (item.cantidad || 1))}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="carrito-vacio">El carrito está vacío.</p>
                  )}
                </div>
                {Array.isArray(carritoItems) && carritoItems.length > 0 && (
                  <div className="total-carrito">
                    <button onClick={realizarPago}>Pagar: ${totalCarrito}</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <ul className="nav-links-top-admin admin-panel-top">
            <li><h1>Panel de Administración</h1></li>
            {location.pathname.includes("admin") && (
              <li>
                {location.pathname.includes("usuarios") ? (
                  <button className="admin-btn" onClick={() => abrirModal("usuario")}>Agregar Usuario</button>
                ) : (
                  <button className="admin-btn" onClick={() => abrirModal("articulo")}>Agregar Artículo</button>
                )}
              </li>
            )}
          </ul>
          {modalAbierto && (
            <div className="modal-overlay">
              <div className="modal-content">
                <button className="modal-close" onClick={() => setModalAbierto(false)}>✕</button>
                <h2>Agregar {tipoModal === "usuario" ? "usuario" : "artículo"}</h2>

                {tipoModal === "usuario" ? (
                  <div className="modal-grid">
                    <div><label>Nombre</label><input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} /></div>
                    <div><label>Correo</label><input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} /></div>
                    <div><label>Usuario</label><input type="text" value={usuario} onChange={(e) => setUsuario(e.target.value)} /></div>
                    <div><label>Contraseña</label><input type="password" value={contraseña} onChange={(e) => setContraseña(e.target.value)} /></div>
                  </div>
                ) : (
                  <div className="modal-grid">
                    <div><label>Nombre</label><input type="text" value={nombreArticulo} onChange={(e) => setNombreArticulo(e.target.value)} /></div>
                    <div><label>Precio</label><input type="text" value={precioArticulo} onChange={(e) => setPrecioArticulo(e.target.value)} /></div>
                    <div><label>Imagen</label><input type="file" onChange={(e) => setImagen(e.target.files[0])} /></div>
                    <div style={{ gridColumn: "1 / 2" }}><label>Descripción</label><textarea rows="5" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} /></div>
                    <div><label>Categoría</label>
                      <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                        <option>Seleccionar categoría</option>
                        <option value="camisas">Camisas</option>
                        <option value="pantalones">Pantalones</option>
                        <option value="uniformes">Uniformes</option>
                      </select>
                    </div>
                    <div><label>Modelo 3D GLB</label><input type="file" onChange={(e) => setGlb(e.target.files[0])} /></div>
                    <div><label>Modelo 3D USDZ</label><input type="file" onChange={(e) => setUsdz(e.target.files[0])} /></div>
                  </div>
                )}
                {mensaje && <p className="mensaje">{mensaje}</p>}
                {datosRegistrados && (
                  <div className="datos-confirmacion">
                    <h4>Información guardada:</h4>
                    <pre>{JSON.stringify(datosRegistrados, null, 2)}</pre>
                  </div>
                )}
                <button
                  className="guardar-btn"
                  onClick={tipoModal === "usuario" ? manejarRegistroUsuario : manejarGuardarArticulo}
                >
                  {tipoModal === "usuario" ? "Guardar usuario" : "Guardar artículo"}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </nav>
  );
}

export default NavbarTop;