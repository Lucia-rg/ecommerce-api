# 🎵 E-commerce Onda Sonar - API

## 📋 Descripción
API en construcción para un e-commerce. Esta API permite gestionar productos, carritos de compra y ofrece vistas en tiempo real con WebSockets.

## 🚀 Características
- ✅ Gestión completa de productos (CRUD completo)
- ✅ Carritos de compra con persistencia
- ✅ Vistas en tiempo real con Socket.io
- ✅ Templates con Handlebars
- ✅ Base de datos MongoDB con Mongoose
- ✅ Filtros y paginación avanzada
- ✅ Interfaz de usuario responsive
- ✅ Gestión de carritos por usuario


## Conexión a MongoDB Atlas

```bash
mongodb+srv://<db_username>:<db_password>@clusterondasonar.wk1ddvt.mongodb.net/?retryWrites=true&w=majority&appName=ClusterOndaSonar
```

### Variables de Entorno
```env
MONGODB_URI=mongodb+srv://<db_username>:<db_password>@clusterondasonar.wk1ddvt.mongodb.net/?retryWrites=true&w=majority&appName=ClusterOndaSonar
DB_NAME=ecommerce_onda_sonar
```

## 🌐 Endpoints de la API
### 📦 Productos
| Método | Endpoint | Descripción | Body Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/products` | Listar productos con paginación | ❌ |
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
| `PUT` | `/api/carts/:cid/products/:pid` | Actualizar cantidad de producto | ✅ |
| `DELETE` | `/api/carts/:cid/products/:pid` | Eliminar producto del carrito | ❌ |
| `PUT` | `/api/carts/:cid` | Actualizar todos los productos | ✅ |
| `DELETE` | `/api/carts/:cid` | Vaciar carrito | ❌ |

### 👀 Vistas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/` | Redirección a productos |
| `GET` | `/home` | Vista home con productos destacados |
| `GET` | `/products` | Catálogo completo de productos |
| `GET` | `/products/:pid` | Detalle de producto individual |
| `GET` | `/carts/:cid` | Detalle del carrito de compras |
| `GET` | `/realtimeproducts` | Vista de productos en tiempo real |
| `GET` | `/api` | Documentación de la API |

## 🎨 Vistas y Funcionalidades

### 1. Home (`/home`)
- **Productos destacados** en grid responsive
- **Navegación rápida** a todas las secciones

### 2. Catálogo de Productos (`/products`)
- **Filtros avanzados**: por categoría, estado y precio
- **Paginación** con navegación intuitiva
- **Ordenamiento** por precio (ascendente/descendente)
- **Cards informativas** con imágenes, precios y stock
- **Botones de acción**: Ver detalles y Agregar al carrito
- **Búsqueda visual** con filtros en tiempo real

### 3. Detalle de Producto (`/products/:pid`)
- **Vista completa** con todas las especificaciones
- **Galería de imágenes** con miniaturas
- **Información detallada**: precio, stock, categoría, código
- **Botón de agregar al carrito** con validación de stock
- **Navegación breadcrumb** para mejor UX

### 4. Carrito de Compras (`/carts/:cid`)
- **Resumen visual** de todos los productos
- **Cálculo automático** de subtotal y total
- **Botón para vaciar carrito** completo
- **Integración** con localStorage para persistencia

### 5. Real Time Products (`/realtimeproducts`)
- **Creación y eliminación** de productos en tiempo real
- **Formulario completo** para agregar productos
- **Tabla dinámica** con lista de productos actualizada (10 productos)
- **Estado de conexión WebSocket** en tiempo real
- **Actualización automática** sin recargar página

## 🎯 Funcionalidades de Carrito

### Gestión Automática
- **Creación automática** de carrito al primer uso
- **Persistencia** en localStorage del navegador
- **Validación de stock** antes de agregar productos
- **Notificaciones** de éxito/error en operaciones

## 🔧 Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MongoDB** - Base de datos
- **Mongoose** - ODM para MongoDB
- **Socket.io** - Comunicación en tiempo real

### Frontend
- **Handlebars** - Motor de templates
- **Bootstrap 5** - Framework CSS
- **FontAwesome** - Iconografía
- **JavaScript ES6+** - Interactividad