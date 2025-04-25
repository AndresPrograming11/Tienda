import { Link, useLocation } from "react-router-dom";
import "../style/NavbarTop.css";
import { useState } from "react";

function NavbarTop() {
  const location = useLocation();
  const [MenuRedespegable, setMenuRedespegable] = useState(false);
  const [tiendaSeleccionada, setTiendaSeleccionada] = useState(false);

  const toggleMenuRedespegable = () => setMenuRedespegable(!MenuRedespegable);
  const AbrirTienda = () => setTiendaSeleccionada(true);
  const CerrarTienda = () => setTiendaSeleccionada(false);

  const getTitle = () => {
    if (location.pathname.includes("camisas")) return "Camisas";
    if (location.pathname.includes("pantalones")) return "Pantalones";
    if (location.pathname.includes("uniformes")) return "Uniformes";
    return "Principal productos";
  };

  return (
    <nav className="navbar-top">
      <ul className="nav-links-top">
        <li onClick={toggleMenuRedespegable}>{getTitle()}</li>
        {MenuRedespegable && location.pathname.includes("uniformes") && (
          <ul className="MenuRedespegable-list">
            <li><Link to="/medicina">Medicina</Link></li>
            <li><Link to="/odontologia">Odontología</Link></li>
            <li><Link to="/fisioterapia">Fisioterapia</Link></li>
          </ul>
        )}
        <li>
          <button
            onClick={AbrirTienda}
            className={tiendaSeleccionada ? "tienda-seleccionada" : ""}
          >
            🛒
          </button>
        </li>
        <li><Link to="/services">👤</Link></li>
        <li><Link to="/opciones"><button>///</button></Link></li>
      </ul>

      {tiendaSeleccionada && (
        <div className="fondo-negro">
          <div className="carrito-contenedor">            
            <div className="titulo-carrito">
              <button className="cerrar-carrito" onClick={CerrarTienda}>⬅</button>
              <h2>🛒 Tu carrito</h2>
            </div>
          
            <div className="carrito-item">
              <img src="https://http2.mlstatic.com/D_NQ_NP_696638-MCO75131653897_032024-O.webp"alt="Producto"/>
              <div className="info-carrito">
                <h4>Nombre de prenda</h4>
                <button className="talla-btn">M</button>
                <div className="contador">
                  <button>+</button>
                  <span>1</span>
                  <button>-</button>                  
                </div>
                <button className="borrar-btn">🗑</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavbarTop;
