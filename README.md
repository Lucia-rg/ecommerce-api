# 🎵 E-commerce Onda Sonar - API

## 📋 Descripción
API en construcción para un e-commerce. Esta API permite gestionar productos, carritos de compra y ofrece vistas en tiempo real con WebSockets.

## 🚀 Características
- ✅ Gestión de productos (CRUD completo)
- ✅ Carritos de compra  
- ✅ Vistas en tiempo real con Socket.io
- ✅ Handlebars para templates
- ✅ Persistencia en archivos JSON

## 🌐 Endpoints de la API
### 📦 Productos
| Método | Endpoint | Descripción | Body Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/products` | Listar todos los productos | ❌ |
| `GET` | `/api/products/:pid` | Obtener producto por ID | ❌ |
| `POST` | `/api/products` | Crear nuevo producto | ✅ |
| `PUT` | `/api/products/:pid` | Actualizar producto | ✅ |
| `DELETE` | `/api/products/:pid` | Eliminar producto | ❌ |

### 🛒 Carritos
| Método | Endpoint | Descripción | Body Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/carts` | Crear nuevo carrito | ❌ |
| `GET` | `/api/carts/:cid` | Obtener carrito por ID | ❌ |
| `POST` | `/api/carts/:cid/product/:pid` | Agregar producto al carrito | ❌ |

### 👀 Vistas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/home` | Vista home con productos |
| `GET` | `/realtimeproducts` | Vista de productos en tiempo real |
| `GET` | `/api` | Documentación de la API |

### 1. Home (`/home`)
- Lista todos los productos disponibles
- Filtros por categoría dinámicos  
- Vista de cards con información completa

### 2. Real Time Products (`/realtimeproducts`)
- Creación y eliminación de productos en tiempo real
- Formulario completo para agregar productos
- Tabla dinámica con lista de productos  
- Estado de conexión WebSocket en tiempo real
- Actualización automática sin recargar página
