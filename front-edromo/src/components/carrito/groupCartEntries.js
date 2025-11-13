export const groupCartEntriesByTier = (cartItems = []) => {
  const groups = [];
  const usedRowIds = new Set();

  cartItems.forEach((item, itemIndex) => {
    if (!item || !item.cartItemId){
      console.warn("Item de carrito inválido o sin cartItemId, omitiendo:", item);
      return;
    }

    const cartItemId = item.cartItemId;
    const eventName = item?.eventoInfo?.nombre || "Evento no disponible";
    const imageUrl = item?.eventoInfo?.imagenUrl || "/images/placeholder.png";
    const fecha = item?.funcionInfo?.fecha || "Fecha no disponible";
    const hora = item?.funcionInfo?.hora || "";

    const entradas = Array.isArray(item?.entradas) ? item.entradas : [];

    // ✅ CORRECCIÓN: Agrupar por evento + función + tipo de entrada
    const groupedByTier = new Map();

    entradas.forEach((entrada) => {
      if (!entrada) return;

      const tipoEntradaId =
        entrada.tipoEntradaId ??
        entrada.idTipoEntrada ??
        entrada.tipoEntrada?.id ??
        entrada.id ??
        null;

      if (!tipoEntradaId) return;

      // ✅ CLAVE DE AGRUPACIÓN: evento + función + tipo de entrada
      // Esto agrupará entradas del mismo tipo en el mismo evento/función
      const tierKey = `${cartItemId}-${tipoEntradaId}`;

      if (!groupedByTier.has(tierKey)) {
        // ✅ GENERAR ROWID ÚNICO PERO CONSISTENTE PARA EL GRUPO
        const rowId = tierKey; // Usamos la misma clave para agrupación
        
        // Solo añadir sufijo si ya existe (muy raro)
        let finalRowId = rowId;
        let counter = 1;
        while (usedRowIds.has(finalRowId)) {
          finalRowId = `${rowId}-${counter}`;
          counter++;
        }
        usedRowIds.add(finalRowId);

        groupedByTier.set(tierKey, {
          rowId: finalRowId,
          cartItemId,
          tipoEntradaId,
          tierName: entrada?.nombre || entrada?.tipoEntradaNombre || "Entrada",
          eventName,
          imageUrl,
          fecha,
          hora,
          entryRecords: [],
          limiteCompra: Number(entrada.limiteCompra ?? 0),
        });
      }

      const group = groupedByTier.get(tierKey);
      
      if (Number(entrada.limiteCompra ?? 0) > group.limiteCompra) {
          group.limiteCompra = Number(entrada.limiteCompra ?? 0);
      }

      const cantidad = Math.max(
        1,
        Number(
          entrada.cantidad ??
            entrada.quantity ??
            entrada.cantidadTotal ??
            entrada.numeroEntradas ??
            1,
        ) || 1,
      );

      const unitPrice = Number(
        entrada.precioUnitario ??
          entrada.precio ??
          entrada.precioPorUnidad ??
          (typeof entrada.precioTotal === "number" && cantidad
            ? entrada.precioTotal / cantidad
            : 0),
      );

      const entradaId =
        entrada.entradaId ??
        entrada.idEntrada ??
        entrada.id ??
        entrada.idCarritoDetalle ??
        entrada.carritoDetalleId ??
        null;

      // ✅ ACUMULAR la cantidad en lugar de crear registros separados
      for (let i = 0; i < cantidad; i += 1) {
        group.entryRecords.push({
          entradaId,
          tipoEntradaId,
          unitPrice,
          // ID único para operaciones individuales
          uniqueEntryId: entradaId 
            ? `${entradaId}-${i}`
            : `${cartItemId}-${tipoEntradaId}-${i}`,
          limiteCompra: Number(entrada.limiteCompra ?? 0),
        });
      }
    });

    // Procesar los grupos formados
    groupedByTier.forEach((group) => {
      const totalPrice = group.entryRecords.reduce(
        (acc, record) => acc + Number(record.unitPrice || 0),
        0,
      );

      groups.push({
        ...group,
        quantity: group.entryRecords.length,
        totalPrice,
        entryIds: group.entryRecords
          .map((record) => record.entradaId)
          .filter((id) => id != null),
        uniqueEntryIds: group.entryRecords.map(record => record.uniqueEntryId)
      });
    });
  });

  // ✅ DEBUG MEJORADO
  console.log('🔍 groupCartEntriesByTier - Resultado:', {
    inputCartItems: cartItems.length,
    outputGroups: groups.length,
    groups: groups.map(g => ({
      rowId: g.rowId,
      eventName: g.eventName,
      tierName: g.tierName,
      quantity: g.quantity,
      totalPrice: g.totalPrice,
      limiteCompra: g.limiteCompra,
    }))
  });

  return groups;
};