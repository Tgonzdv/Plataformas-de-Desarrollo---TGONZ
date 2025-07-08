# PizzaYa Backend - API REST

Backend de la aplicación PizzaYa implementando API REST con autenticación JWT.

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm o yarn

### Pasos de instalación

1. **Navegar al directorio del backend**:
   ```bash
   cd backend
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   El archivo `.env` ya está configurado con valores por defecto. Puedes modificarlo si es necesario:
   ```
   JWT_SECRET=tu_clave_secreta_super_segura_aqui_2024
   PORT=5000
   NODE_ENV=development
   ```

4. **Iniciar el servidor**:
   ```bash
   # Modo desarrollo (con nodemon)
   npm run dev
   
   # Modo producción
   npm start
   ```

5. **Verificar que funciona**:
   Abre tu navegador en `http://localhost:5000/api/health`

## 📁 Estructura del Proyecto

```
backend/
├── data/           # Archivos JSON que simulan la base de datos
├── middleware/     # Middlewares de autenticación y autorización
├── models/         # Modelos de datos
├── routes/         # Rutas de la API
├── .env           # Variables de entorno
├── package.json   # Dependencias del proyecto
└── server.js      # Archivo principal del servidor
```

## 🔐 Autenticación

La API utiliza JWT (JSON Web Tokens) para la autenticación:

1. **Login**: POST `/api/auth/login`
2. **Registro**: POST `/api/auth/register`
3. **Verificar token**: POST `/api/auth/verify`

### Headers de autorización
Para endpoints protegidos, incluir el header:
```
Authorization: Bearer <your-jwt-token>
```

## 📋 Endpoints de la API

### Autenticación (Públicos)
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/verify` - Verificar token

### Pizzas (Protegidos)
- `GET /api/pizzas` - Obtener todas las pizzas
- `GET /api/pizzas/:id` - Obtener pizza por ID
- `POST /api/pizzas` - Crear pizza (solo admin)
- `PUT /api/pizzas/:id` - Actualizar pizza (solo admin)
- `DELETE /api/pizzas/:id` - Eliminar pizza (solo admin)

### Carrito (Protegidos)
- `GET /api/cart` - Obtener carrito del usuario
- `POST /api/cart/add` - Agregar item al carrito
- `PUT /api/cart/item/:itemId` - Actualizar cantidad
- `DELETE /api/cart/item/:itemId` - Eliminar item
- `DELETE /api/cart` - Limpiar carrito

### Favoritos (Protegidos)
- `GET /api/favorites` - Obtener favoritos
- `POST /api/favorites/:pizzaId` - Agregar a favoritos
- `DELETE /api/favorites/:pizzaId` - Eliminar de favoritos
- `DELETE /api/favorites` - Limpiar favoritos

### Pedidos (Protegidos)
- `GET /api/orders` - Obtener pedidos
- `GET /api/orders/:id` - Obtener pedido específico
- `POST /api/orders` - Crear pedido desde carrito
- `PUT /api/orders/:id/status` - Actualizar estado (solo admin)
- `DELETE /api/orders/:id` - Cancelar pedido
- `GET /api/orders/stats/dashboard` - Estadísticas (solo admin)

### Usuarios (Protegidos)
- `GET /api/users` - Obtener usuarios (solo admin)
- `GET /api/users/:id` - Obtener usuario específico
- `POST /api/users` - Crear usuario (solo admin)
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario (solo admin)
- `PUT /api/users/:id/password` - Cambiar contraseña

## 👥 Usuarios de Prueba

El sistema viene con dos usuarios preconfigurados:

### Usuario Administrador
- **Usuario**: `admin`
- **Contraseña**: `admin123`
- **Rol**: `admin`

### Usuario Cliente
- **Usuario**: `jorge`
- **Contraseña**: `cliente123`
- **Rol**: `user`

## 🔒 Niveles de Autorización

1. **Público**: Endpoints de autenticación
2. **Usuario autenticado**: Acceso a sus propios recursos
3. **Administrador**: Acceso completo a todos los recursos

## 🧪 Testing

Puedes probar la API usando herramientas como:
- Postman
- Insomnia
- curl
- Thunder Client (VSCode)

### Ejemplo de login con curl:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

## 🔧 Configuración Adicional

### Cambiar Puerto
Modifica la variable `PORT` en el archivo `.env`

### Cambiar Secreto JWT
Modifica la variable `JWT_SECRET` en el archivo `.env` (usar una clave segura en producción)

### Datos Iniciales
Los datos se almacenan en archivos JSON en la carpeta `data/`. Puedes modificarlos para cambiar los datos iniciales.

## 🚨 Notas Importantes

- Este backend simula una base de datos usando archivos JSON
- En producción, se recomienda usar una base de datos real (MongoDB, PostgreSQL, etc.)
- Las contraseñas en desarrollo se validan directamente, en producción usar bcrypt
- Mantener el secreto JWT seguro y no exponerlo en el código

## 🐛 Troubleshooting

### Error de puerto en uso
```bash
Error: listen EADDRINUSE: address already in use :::5000
```
Cambiar el puerto en `.env` o cerrar el proceso que usa el puerto 5000.

### Error de CORS
Si el frontend no puede conectarse, verificar que la URL del frontend esté en la configuración de CORS en `server.js`.

### Error de JWT
Verificar que el secreto JWT sea el mismo en `.env` y que el token no haya expirado (24h por defecto).
