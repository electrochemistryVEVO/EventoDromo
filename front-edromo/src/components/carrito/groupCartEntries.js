export const groupCartEntriesByTier = (cartItems = []) => {
  const groups = [];

  cartItems.forEach((item) => {
    if (!item) return;

    const cartItemId = item.cartItemId ?? item.id ?? null;
    const eventName = item?.eventoInfo?.nombre || "Evento no disponible";
    const imageUrl = item?.eventoInfo?.imagenUrl || "/images/placeholder.png";
    const fecha = item?.funcionInfo?.fecha || "Fecha no disponible";
    const hora = item?.funcionInfo?.hora || "";

    const entradas = Array.isArray(item?.entradas) ? item.entradas : [];

    const groupedByTier = new Map();

    entradas.forEach((entrada) => {
      if (!entrada) return;

      const tipoEntradaId =
        entrada.tipoEntradaId ??
        entrada.idTipoEntrada ??
        entrada.tipoEntrada?.id ??
        entrada.id ??
        null;

      const tierKey = `${tipoEntradaId ?? entrada?.nombre ?? "entrada"}`;

      if (!groupedByTier.has(tierKey)) {
        groupedByTier.set(tierKey, {
          rowId: `${cartItemId}-${tierKey}`,
          cartItemId,
          tipoEntradaId,
          tierName: entrada?.nombre || entrada?.tipoEntradaNombre || "Entrada",
          eventName,
          imageUrl,
          fecha,
          hora,
          entryRecords: [],
        });
      }

      const group = groupedByTier.get(tierKey);

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

      for (let i = 0; i < cantidad; i += 1) {
        group.entryRecords.push({
          entradaId,
          tipoEntradaId,
          unitPrice,
        });
      }
    });

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
      });
    });
  });

  return groups;
};
