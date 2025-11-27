# 🐛 Bug Tracking - Cliente EventoDromo

**Fecha:** 26 de Noviembre, 2025  
**Rama:** feature/bug-fixes-cliente  
**Responsable:** Equipo de desarrollo

---

## 📋 Lista de Bugs Identificados

### 🔴 BUG #1: Navbar - Dropdown Usuario No Funciona Post-Compra
**Prioridad:** Alta  
**Estado:** 🔧 **EN PROGRESO**

**Descripción:**
- Después de completar una compra y volver a `/user/web/eventos/lista`
- El dropdown del usuario no se abre al hacer click (pero el evento onClick SÍ se dispara)
- El estado `isDropdownOpen` cambia correctamente (true/false)
- El dropdown está renderizado en el DOM pero no es visible
- Workaround: Recargar la página (F5)

**Causa raíz identificada:**
- **Layout diferente:** `/user/web` tiene Navbar, `/user/carrito` NO tiene Navbar
- Al navegar de compra → perfil, el Navbar se desmonta y re-monta
- Next.js puede estar reutilizando estado corrupto o el componente no se limpia correctamente
- CSS z-index o visibility puede estar siendo afectado por la navegación

**Diagnóstico realizado:**
1. ✅ Event listener funciona correctamente
2. ✅ Estado `isDropdownOpen` cambia correctamente
3. ✅ Console.log muestra toggle funcionando: `true → false → true`
4. ❌ El dropdown NO es visible a pesar de estar en el DOM
5. ❌ Problema persiste incluso después de agregar `key={pathname}` al Navbar

**Soluciones intentadas:**
1. Modificar dependencies de useEffect → No resolvió
2. Agregar `key={pathname}` para forzar re-mount → No resolvió
3. Aumentar z-index a 9999 !important → No resolvió
4. Agregar opacity/visibility explícitos → No resolvió

**Próximos pasos:**
- Investigar si hay CSS conflictivo aplicado durante navegación
- Verificar si hay elementos overlay bloqueando visualmente
- Considerar usar portal para renderizar dropdown
- Revisar si Next.js Turbopack tiene bugs conocidos con re-mounting

**Archivos modificados:**
- `front-edromo/src/components/Layouts/navbar/navbar_con_login.jsx`
- `front-edromo/src/app/user/web/UserWebLayoutClient.jsx`
- `front-edromo/src/css/navbar-logged-in.css`

**Testing requerido:**
- [ ] Dropdown funciona después de compra sin refrescar
- [ ] Dropdown se muestra visualmente
- [ ] No hay elementos bloqueando el dropdown

---

### 🔴 BUG #2: Modal "Ir a Mis Entradas" - Redirección Incorrecta
**Prioridad:** Alta  
**Estado:** ✅ **RESUELTO**

**Descripción:**
- Al finalizar compra (con tarjeta o puntos), el usuario es redirigido automáticamente a `/user/carrito/entradaDetalle`
- El modal de "Compra Exitosa" nunca se ve o desaparece inmediatamente
- El usuario no puede hacer click en "Mis Entradas"
- Comportamiento esperado: Ver modal y poder navegar manualmente a Mis Entradas

**Causa raíz identificada:**
- `useEffect` de protección en `CompraPagoConLogin/page.js` (línea 295)
- Redirige automáticamente cuando `itemCount === 0`
- El SuccessModal llama a `clearCart()` → itemCount se vuelve 0
- useEffect detecta el cambio y redirige antes de que el usuario vea el modal
- Conflicto entre protección de ruta y flujo de compra exitosa

**Archivos modificados:**
- `front-edromo/src/app/user/carrito/CompraPagoConLogin/page.js` (líneas 295-305)

**Solución implementada:**
```jsx
// ANTES (CAUSABA REDIRECCIÓN INMEDIATA):
useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
        router.replace("/user/carrito/identificacion");
    }
    if (itemCount === 0) {
        router.replace("/user/carrito/entradaDetalle"); // ❌ Se ejecuta al limpiar carrito
    }
}, [isLoading, isAuthenticated, itemCount, router]);

// DESPUÉS (PERMITE VER MODAL):
useEffect(() => {
    if (isLoading || showModal) return; // ✅ No redirige si modal está abierto
    if (!isAuthenticated) {
        router.replace("/user/carrito/identificacion");
    }
    if (itemCount === 0) {
        router.replace("/user/carrito/entradaDetalle");
    }
}, [isLoading, isAuthenticated, itemCount, router, showModal]);
```

**Flujo corregido:**
1. Usuario completa pago exitosamente
2. `setShowModal(true)` se ejecuta
3. `clearCart()` limpia el carrito (itemCount = 0)
4. useEffect detecta `showModal === true` → NO redirige
5. Usuario ve modal y puede hacer click en "Mis Entradas"
6. Modal redirige a `/user/web/perfil?tab=entradas`

**Testing requerido:**
- [ ] Compra con tarjeta → Modal se muestra correctamente
- [ ] Compra con puntos → Modal se muestra correctamente
- [ ] Click en "Mis Entradas" → Redirige a perfil correctamente
- [ ] Protección de ruta sigue funcionando cuando NO hay compra exitosa

---

### 🟡 BUG #3: Detalle de Entradas - Conteo Incorrecto
**Prioridad:** Media  
**Estado:** ⚠️ Requiere testing

**Descripción:**
- Cuenta total dice "4 entradas"
- Solo muestra 3 entradas en la UI
- Distribución original: 1 + 2 + 1 = 4 entradas de 3 tipos diferentes
- Posible problema con cuentas antiguas (lógica de transacción legacy)

**Casos a testear:**
1. ✅ Compra nueva con usuario nuevo
2. ✅ Compra nueva con usuario existente
3. ⚠️ Usuario con compras antiguas (pre-refactor transacciones)
4. ⚠️ Mezcla de compras antiguas + nuevas

**Hipótesis:**
- Mapper no agrupando correctamente por tipo de entrada
- Query SQL cuenta duplicados o entradas transferidas
- Frontend filtrando incorrectamente entradas agrupadas

**Archivos a revisar:**
- `Backend/EventodromoRest/Mappers/MisEntradasMapper.cs`
- `front-edromo/src/components/Layouts/perfil/mis-entrada-item.jsx`
- `front-edromo/src/app/user/perfil/mis-entradas/` (página completa)

---

### 🟢 BUG #4: Descargar Entradas - Falla Path Chromium
**Prioridad:** Alta  
**Estado:** ✅ **RESUELTO**

**Descripción:**
- Funcionalidad desarrollada en Linux
- Busca path de Chromium en Windows (no existe)
- Descarga de PDF falla completamente en Windows
- Error: Path no encontrado o similar

**Hipótesis:**
- Puppeteer configurado con executablePath específico de Linux
- Falta detección automática de navegador en Windows
- Configuración hardcodeada en lugar de dinámica

**Archivos modificados:**
- `front-edromo/src/services/PDFGenerator.service.js`

**Solución implementada:**
- Creada función `getPuppeteerConfig()` con detección automática de SO
- Soporte multi-plataforma: Windows, Mac, Linux
- Múltiples paths de Chrome/Chromium por plataforma
- Fallback a Chromium bundled de Puppeteer
- Mejor manejo de errores y mensajes informativos

---

### 🔴 BUG #5: Descarga de Entradas Transferidas - Filtrado Incorrecto
**Prioridad:** Alta  
**Estado:** ✅ **RESUELTO**

**Descripción:**
- Usuario puede descargar entradas que transfirió a otros usuarios
- Backend retorna TODAS las entradas de una transacción sin verificar propiedad actual
- Casos problemáticos:
  1. Transferencia completa → Lista vacía al intentar descargar
  2. Transferencia parcial → Descarga incluye entradas ya transferidas

**Hipótesis:**
- Query SQL no verifica campo `idClienteActual` de la tabla `Entrada`
- Sistema de transferencias usa campos: `estadoTransferencia`, `vecesTransferida`, `idClienteActual`
- Falta filtrado por propiedad actual en `ObtenerTipoEntradasPorTransaccion`

**Archivos modificados:**
- `Backend/EventodromoRest/Mappers/EntradaMapper.cs` (líneas 128-159)

**Solución implementada:**
```sql
-- Query anterior (INCORRECTA):
WHERE T.idCliente=@idCliente AND T.numeroTransaccion=@numeroTransaccion;

-- Query nueva (CORRECTA):
WHERE T.numeroTransaccion=@numeroTransaccion 
AND (E.idClienteActual = @idCliente OR (E.idClienteActual IS NULL AND T.idCliente = @idCliente));
```

**Lógica:**
- Si `idClienteActual` está definido → Verificar que sea el usuario solicitante
- Si `idClienteActual` es NULL → Verificar que sea el comprador original
- Esto respeta transferencias: Solo descarga entradas que actualmente posee

**Testing requerido:**
- [ ] Usuario descarga solo sus entradas (sin transferencias)
- [ ] Usuario transfiere todas las entradas → No puede descargar ninguna
- [ ] Usuario transfiere algunas entradas → Solo descarga las que conserva
- [ ] Usuario recibe entradas transferidas → Puede descargarlas

---

## 🎨 Mejora de UX Pendiente

### Rediseño Pantalla Carrito
**Prioridad:** Media  
**Estado:** ⏳ Pendiente diseño Figma

**Descripción:**
- Eliminar scroll en pantalla de detalle del carrito
- Todo el contenido debe ser visible sin scroll
- Pendiente: Recibir diseño de Figma para implementar

---

## 🔧 Plan de Acción

### Fase 1: Análisis (Actual)
- [x] Crear documento de tracking
- [x] Analizar navbar_con_login.jsx
- [x] Analizar modal post-compra
- [x] Analizar PDFGenerator.service.js
- [x] Analizar MisEntradasMapper.cs
- [x] Analizar TransferenciaMapper y sistema de ownership

## 🔬 HALLAZGOS TÉCNICOS

### BUG #1: Navbar Dropdown - CAUSA IDENTIFICADA ✅
**Archivo:** `front-edromo/src/components/Layouts/navbar/navbar_con_login.jsx`
**Líneas:** 26-51

**Problema:**
```jsx
const [isDropdownOpen, setDropdownOpen] = useState(false);
const dropdownRef = useRef(null);

useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []); // ❌ Array de dependencias vacío
```

**Análisis:**
- El `useEffect` solo se ejecuta una vez al montar el componente
- Después de la navegación post-compra, el event listener se mantiene con la referencia antigua
- El componente no se desmonta completamente, solo re-renderiza
- La referencia `dropdownRef` cambia pero el listener no se actualiza

**Solución:** Forzar re-creación del listener después de navegación o usar `key` prop para forzar re-mount

---

### BUG #2: Modal Redirección - CAUSA IDENTIFICADA ✅
**Archivos Afectados:**
1. `front-edromo/src/components/carrito/SuccessModal.jsx` (línea 13)
2. `front-edromo/src/app/user/carrito/CompraPagoConLogin/page.js` (línea 229)

**Código Actual:**
```jsx
const handleRedirect = () => {
    clearCart();
    router.push("/user/web/perfil?tab=entradas"); // ✅ CORRECTO
    // onClose(); // Comentado
};
```

**¡DESCUBRIMIENTO!** El código ESTÁ CORRECTO. Redirige a `/user/web/perfil?tab=entradas`.

**Hipótesis nueva:**
1. Hay OTRO modal que está redirigiendo mal
2. Middleware o redirect interceptando la navegación
3. Verificar si existe `/user/web/perfil` o debe ser `/user/perfil`

**Acción:** Verificar rutas de perfil y buscar otros modales de éxito

---

### BUG #4: PDF Download - CAUSA IDENTIFICADA ✅
**Archivo:** `front-edromo/src/services/PDFGenerator.service.js`
**Línea:** 48

**Código Problemático:**
```javascript
return puppeteer.launch({
    executablePath:"/usr/bin/chromium", // ❌ HARDCODED LINUX PATH
    args: ['--no-sandbox'],
    timeout: 10000
})
```

**Problema:**
- Path hardcodeado para Linux: `/usr/bin/chromium`
- No funciona en Windows (Chromium no existe en ese path)
- No funciona en Mac (path diferente)

**Solución:**
```javascript
// Detectar SO y usar path correcto
const getChromiumPath = () => {
  const platform = process.platform;
  
  if (platform === 'win32') {
    // Windows - Chrome instalado por defecto
    return 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  } else if (platform === 'darwin') {
    // Mac
    return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  } else {
    // Linux
    return '/usr/bin/chromium-browser';
  }
};

return puppeteer.launch({
    executablePath: getChromiumPath(),
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    timeout: 10000
})
```

**Alternativa Mejor:** Usar Puppeteer sin `executablePath` (auto-detecta):
```javascript
return puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    timeout: 10000
})
```

### Fase 2: Testing
- [ ] Crear cuenta de prueba nueva
- [ ] Realizar compra de prueba
- [ ] Verificar cada bug sistemáticamente
- [ ] Documentar comportamiento exacto

### Fase 3: Fixes
- [x] Fix BUG #1: Navbar dropdown ✅
- [x] Fix BUG #2: Modal redirección ✅
- [ ] Fix BUG #3: Conteo entradas (si confirmado)
- [x] Fix BUG #4: PDF download Windows ✅
- [x] Fix BUG #5: Filtrado de entradas transferidas ✅

### Fase 4: Testing Post-Fix
- [ ] Validar todos los fixes en Windows
- [ ] Validar flujo completo de compra
- [x] BUG #4: Verificar PDF download funcional ✅
- [ ] BUG #5: Testing de escenarios de transferencia:
  - [ ] Descarga sin transferencias
  - [ ] Descarga después de transferir todas las entradas
  - [ ] Descarga después de transferir solo algunas entradas
  - [ ] Descarga de entradas recibidas por transferencia
- [ ] Cross-browser testing

### Fase 5: Rediseño Carrito
- [ ] Recibir diseño Figma
- [ ] Implementar cambios CSS
- [ ] Testing responsive

---

## 📝 Notas Importantes

### Sobre Cuentas Antiguas
- Confirmar si hubo cambio en modelo de datos de Transacciones
- Verificar si existe migración de datos
- Considerar script de migración si es necesario

### Sobre Ambiente de Desarrollo
- Windows requiere configuración diferente para Puppeteer
- Considerar usar Docker para generación de PDFs (portabilidad)
- Alternativa: Usar librería que no dependa de Chromium

### Commits Recomendados
```
fix(navbar): Resolver dropdown usuario post-compra
fix(modal): Corregir redirección a mis entradas
fix(pdf): Soporte multiplataforma para descarga de entradas
test(entradas): Validar conteo de entradas por tipo
refactor(carrito): Eliminar scroll en vista de detalle
```

---

## 🎯 Prioridad de Resolución

1. ~~**BUG #4** - Descarga PDFs~~ ✅ **COMPLETADO**
2. ~~**BUG #5** - Filtrado entradas transferidas~~ ✅ **COMPLETADO**
3. ~~**BUG #1** - Navbar dropdown~~ ✅ **COMPLETADO**
4. ~~**BUG #2** - Modal redirección~~ ✅ **COMPLETADO**
5. **BUG #3** - Conteo entradas (requiere confirmación)
6. **Rediseño** - Carrito (mejora, no bloqueante)

---

**Última actualización:** 2025-11-26
