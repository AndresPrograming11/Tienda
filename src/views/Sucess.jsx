import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { crearFactura } from "../services/factura";

export default function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    const crearFacturaAutomatica = async () => {
      const data = localStorage.getItem("facturaData");
      if (!data) return;
  
      localStorage.removeItem("facturaData"); // ❗️ BORRAR ANTES para evitar duplicación
  
      try {
        const factura = JSON.parse(data);
        const { success, id } = await crearFactura(factura);
  
        if (success && id) {
          console.log(`✅ Factura creada con ID: ${id}`);
        } else {
          console.error("❌ Error al crear la factura.");
        }
  
      } catch (err) {
        console.error("🔥 Error al procesar factura:", err);
      } finally {
        setTimeout(() => navigate("/ordenes"), 2000);
      }
    };
  
    crearFacturaAutomatica();
  }, [navigate]);
  

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold text-green-600">✅ ¡Pago realizado con éxito!</h1>
      <p>Gracias por tu compra. Estamos generando tu factura...</p>
    </div>
  );
}

  