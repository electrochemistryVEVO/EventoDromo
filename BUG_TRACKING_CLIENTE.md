# 🐛 Bug Tracking - Cliente EventoDromo

**Fecha:** 26 de Noviembre, 2025  
**Rama:** feature/bug-fixes-cliente  
**Responsable:** Equipo de desarrollo

---

## 📋 Lista de Bugs Identificados

### 🔴 BUG #1: Navbar - Dropdown Usuario No Funciona Post-Compra
**Prioridad:** Alta  
**Estado:** 🔍 En análisis

**Descripción:**
- Después de completar una compra y ser redirigido a `/eventos/lista`
- El dropdown del usuario no responde al click
- Opciones afectadas: Mis Entradas, Mis Datos, Mis Puntos, Cambiar Contraseña, Cerrar Sesión
- Workaround temporal: Recargar la página (F5)

**Hipótesis:**
- Posible problema con estado de React no sincronizado
- Event listeners no re-adjuntados después de navegación
- Componente navbar no re-renderizando correctamente

**Archivos a revisar:**
- `front-edromo/src/components/Layouts/navbar/navbar_cliente.jsx`
- Flujo de redirección post-compra
- Context providers (UserContext, CartContext)

---

### 🔴 BUG #2: Modal "Ir a Mis Entradas" - Redirección Incorrecta
**Prioridad:** Alta  
**Estado:** 🔍 En análisis

**Descripción:**
- Al finalizar compra, aparece modal para ir a "Mis Entradas"
- Click en el botón redirige a `/carrito` en lugar de `/user/perfil/mis-entradas`
- Comportamiento esperado: Ir directamente a ver las entradas compradas

**Hipótesis:**
- URL hardcodeada incorrectamente en el modal
- Router.push con ruta equivocada
- Conflicto con limpieza del carrito

**Archivos a revivar:**
- Modal de confirmación post-compra
- `front-edromo/src/components/carrito/` (buscar modal de éxito)
- Flujo de checkout completo

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
- [ ] Analizar MisEntradasMapper.cs

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
- [ ] Fix BUG #1: Navbar dropdown
- [ ] Fix BUG #2: Modal redirección
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
3. **BUG #2** - Modal redirección (pendiente confirmación UX crítica)
4. **BUG #1** - Navbar dropdown (workaround existe)
5. **BUG #3** - Conteo entradas (requiere confirmación)
6. **Rediseño** - Carrito (mejora, no bloqueante)

---

**Última actualización:** 2025-11-26
