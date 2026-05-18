# LinkUp - Mini Red Social

Aplicación web que permite a los usuarios registrarse, publicar posts, comentar y dar likes en un feed social.

## Integrantes y Roles

```
Maria paula Romero Diaz
Manuela Henao
Jeny Marcela Tobon
```
## Arquitectura

```
Frontend (React)  →  Backend (Node.js/Express)  →  Base de Datos (MySQL)
localhost:5173         localhost:3000/api              localhost:3306
```

## Requisitos

- Node.js >= 18
- npm >= 9
- MySQL 8.0

## Pasos para correr el proyecto localmente

### 1. Base de datos

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p linkup < database/seed.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edita .env con tus credenciales de MySQL
npm install
npm run dev
```

El servidor queda corriendo en `http://localhost:3000`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`

## Usuarios de prueba (seed)

| Usuario | Email | Contraseña |
|---------|-------|------------|
| ana_garcia | ana@linkup.com | password123 |
| carlos_dev | carlos@linkup.com | password123 |
| sofia_ux | sofia@linkup.com | password123 |

## Endpoints de la API

### Autenticación
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/auth/register | Registrar usuario |
| POST | /api/auth/login | Iniciar sesión |

### Posts
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/posts | Obtener todos los posts (soporta ?search=texto) |
| GET | /api/posts/:id | Obtener un post por ID |
| POST | /api/posts | Crear un post |
| PUT | /api/posts/:id | Editar un post |
| DELETE | /api/posts/:id | Eliminar un post |
| POST | /api/posts/:id/like | Dar/quitar like |

### Comentarios
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/posts/:postId/comments | Ver comentarios de un post |
| POST | /api/posts/:postId/comments | Agregar comentario |
| PUT | /api/posts/:postId/comments/:commentId | Editar comentario |
| DELETE | /api/posts/:postId/comments/:commentId | Eliminar comentario |
