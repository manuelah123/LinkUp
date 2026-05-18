const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { getAllPosts, getPostById, createPost, updatePost, deletePost, toggleLike } = require("../controllers/postsController");

// Todas las rutas de posts requieren estar autenticado
router.use(verifyToken);

// GET  /api/posts        → obtener todos los posts del feed
router.get("/", getAllPosts);

// GET  /api/posts/:id    → obtener un post por id
router.get("/:id", getPostById);

// POST /api/posts        → crear un nuevo post
router.post("/", createPost);

// PUT    /api/posts/:id  → editar un post (solo el dueño)
router.put("/:id", updatePost);

// DELETE /api/posts/:id  → eliminar un post (solo el dueño)
router.delete("/:id", deletePost);

// POST /api/posts/:id/like → dar/quitar like (toggle)
router.post("/:id/like", toggleLike);

module.exports = router;
