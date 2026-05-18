# LinkUp – Backend (Node.js / Express)

API REST para la mini red social LinkUp.

## Requisitos

- Node.js >= 18
- npm >= 9

## Instalación

```bash
cd backend
npm install
```

Copia el archivo de variables de entorno y edítalo:

```bash
cp .env.example .env
# Edita .env con tu JWT_SECRET y las credenciales de BD que te pase el DBA
```

## Correr en desarrollo

```bash
npm run dev
```

El servidor corre en `http://localhost:3000`

## Endpoints

### Auth
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registrar usuario → `{ token, user }` |
| POST | `/api/auth/login` | Iniciar sesión → `{ token, user }` |

### Posts (requieren `Authorization: Bearer <token>`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/posts` | Obtener todos los posts del feed |
| GET | `/api/posts/:id` | Obtener un post por id |
| POST | `/api/posts` | Crear un post |
| DELETE | `/api/posts/:id` | Eliminar un post (solo el dueño) |
| POST | `/api/posts/:id/like` | Dar/quitar like (toggle) |

### Comentarios (requieren `Authorization: Bearer <token>`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/posts/:postId/comments` | Ver comentarios de un post |
| POST | `/api/posts/:postId/comments` | Agregar un comentario |
| DELETE | `/api/posts/:postId/comments/:commentId` | Eliminar un comentario (solo el dueño) |

## Estructura de carpetas

```
backend/
├── src/
│   ├── index.js                  # Punto de entrada, app Express
│   ├── db.js                     # Conexión a BD (configura el DBA)
│   ├── middleware/
│   │   └── verifyToken.js        # Middleware JWT
│   ├── routes/
│   │   ├── auth.js
│   │   ├── posts.js
│   │   └── comments.js
│   └── controllers/
│       ├── authController.js
│       ├── postsController.js
│       └── commentsController.js
├── .env.example
└── package.json
```
