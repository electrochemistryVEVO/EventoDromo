# Sistema de Notificaciones Toast

Este directorio contiene el sistema de notificaciones reutilizable de la aplicación, construido sobre `react-hot-toast`.

## 📁 Estructura

```
Notifications/
├── ToastProvider.jsx    # Componente proveedor (usar en layout)
├── toast.js            # API de utilidades (funciones helper)
└── README.md           # Esta documentación
```

## 🚀 Instalación

### 1. Agregar el Provider al Layout

Editar `src/app/layout.js` para incluir el `ToastProvider`:

```jsx
import ToastProvider from '@/components/Notifications/ToastProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
        <ToastProvider />  {/* Agregar aquí */}
      </body>
    </html>
  );
}
```

### 2. Importar las funciones en tus componentes/contexts

```javascript
import { showSuccess, showError, showWarning, showInfo } from '@/components/Notifications/toast';
```

## 📖 Uso

### Notificaciones Básicas

```javascript
// Éxito
showSuccess('¡Operación exitosa!');

// Error
showError('Ocurrió un error al procesar la solicitud');

// Advertencia
showWarning('Esta acción es irreversible');

// Información
showInfo('Tienes 3 mensajes nuevos');
```

### Personalizar Duración

```javascript
showSuccess('Mensaje rápido', { duration: 2000 }); // 2 segundos
showError('Error importante', { duration: 8000 }); // 8 segundos
```

### Loading Toast

```javascript
const loadingToast = showLoading('Guardando cambios...');

try {
  await saveData();
  dismissToast(loadingToast);
  showSuccess('¡Cambios guardados!');
} catch (error) {
  dismissToast(loadingToast);
  showError('Error al guardar');
}
```

### Toast con Promesa (Recomendado para async)

```javascript
await showPromise(
  fetchData(),
  {
    loading: 'Cargando datos...',
    success: '¡Datos cargados exitosamente!',
    error: 'Error al cargar los datos',
  }
);
```

## 🎨 Ejemplos de Implementación

### En un Context (CartContext)

```javascript
import { showSuccess, showError } from '@/components/Notifications/toast';

const CartContext = () => {
  const addToCart = async (item) => {
    try {
      const response = await api.post('/carrito', item);
      
      if (response.data.rejectedItems?.length > 0) {
        const nombres = response.data.rejectedItems.map(i => i.nombre).join(', ');
        showError(`Sin stock disponible: ${nombres}`, { duration: 6000 });
      } else {
        showSuccess('¡Producto agregado al carrito!');
      }
    } catch (error) {
      showError('Error al agregar al carrito');
    }
  };
};
```

### En un Controller

```javascript
import { showSuccess, showError } from '@/components/Notifications/toast';

export const onSubmit = async (data) => {
  try {
    await api.put('/configuracion', data);
    showSuccess('¡Configuración actualizada exitosamente!');
  } catch (error) {
    showError('Error al actualizar la configuración');
  }
};
```

### En un Page Component

```javascript
import { showSuccess, showPromise } from '@/components/Notifications/toast';

const AdminPage = () => {
  const handleSave = async () => {
    await showPromise(
      saveConfiguration(formData),
      {
        loading: 'Guardando configuración...',
        success: '¡Configuración guardada exitosamente!',
        error: 'Error al guardar la configuración',
      }
    );
  };
};
```

## ⚙️ Configuración

La configuración por defecto está en `ToastProvider.jsx`:

- **Posición**: `top-right`
- **Duración por defecto**: 4 segundos (6 segundos para errores)
- **Estilos**: Bordes redondeados, sombras, colores semánticos
- **Iconos**: Incluidos automáticamente por tipo

Para cambiar la configuración global, edita `ToastProvider.jsx`.

## 🎯 Cuándo Usar Toast vs Mensajes Inline

### ✅ Usar Toast Para:
- Acciones del usuario (guardar, eliminar, actualizar)
- Errores de operaciones asíncronas
- Confirmaciones de acciones completadas
- Notificaciones que no bloquean la UI

### ❌ NO Usar Toast Para:
- Validaciones de formularios → Usar mensajes inline cerca del input
- Errores de validación en tiempo real → Mostrar bajo el campo
- Mensajes críticos que requieren atención → Usar modales

## 📝 Beneficios de este Diseño

1. **Desacoplamiento**: Podemos cambiar de librería sin tocar el código
2. **Consistencia**: Todos los toasts tienen el mismo look & feel
3. **Mantenibilidad**: Un solo lugar para configurar estilos
4. **Reutilización**: Importa y usa en cualquier parte de la app
5. **Type Safety**: JSDoc proporciona autocompletado en VS Code

## 🔧 Funciones Disponibles

| Función | Descripción | Duración por defecto |
|---------|-------------|---------------------|
| `showSuccess()` | Notificación de éxito | 4 segundos |
| `showError()` | Notificación de error | 6 segundos |
| `showWarning()` | Advertencia | 5 segundos |
| `showInfo()` | Información | 4 segundos |
| `showLoading()` | Loading infinito | Hasta dismiss manual |
| `showPromise()` | Auto loading → success/error | Variable |
| `dismissToast(id)` | Cierra un toast específico | - |
| `dismissAllToasts()` | Cierra todos los toasts | - |

## 🌐 Soporte

- Compatible con Next.js 13+ (App Router)
- Funciona en Server y Client Components
- Soporta TypeScript (con JSDoc)
- Responsive y accesible
