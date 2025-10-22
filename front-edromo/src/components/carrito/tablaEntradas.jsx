// src/components/carrito/tablaEntradas.tsx

import { TablaEntradasController } from "./TablaEntradas.controller";

/**
 * Este archivo ahora actúa como un barril, exportando el controlador
 * bajo el alias 'TablaEntradas' para mantener la compatibilidad hacia atrás.
 * Cualquier componente que importe 'TablaEntradas' ahora obtendrá el controlador completo.
 */
export const TablaEntradas = TablaEntradasController;
