const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { getCommentsByPost, createComment, updateComment, deleteComment } = require("../controllers/commentsController");

// Todas las rutas de comentarios requieren autenticación
router.use(verifyToken);

// GET    /api/posts/:postId/comments              → ver comentarios de un post
router.get("/:postId/comments", getCommentsByPost);

// POST   /api/posts/:postId/comments              → agregar un comentario
router.post("/:postId/comments", createComment);

// PUT    /api/posts/:postId/comments/:commentId   → editar un comentario (solo el dueño)
router.put("/:postId/comments/:commentId", updateComment);

// DELETE /api/posts/:postId/comments/:commentId   → eliminar un comentario (solo el dueño)
router.delete("/:postId/comments/:commentId", deleteComment);

module.exports = router;
