export async function obtenerOrdenes(usuarioId) {
    try {
        const response = await fetch(`http://localhost/carrito-backend/controller/OrdenController.php?usuario_id=${usuarioId}`);
        return await response.json();
    } catch (error) {
        console.error("Error al obtener órdenes:", error);
        return { success: false, data: [] };
    }
}
