const db = require("../db");

// ─── GET /api/posts/:postId/comments ─────────────────────────────────────────
async function getCommentsByPost(req, res) {
  try {
    const { postId } = req.params;

    const [comments] = await db.query(
      `SELECT c.id, c.user_id, u.username, c.content, c.created_at, c.updated_at
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.post_id = ?
       ORDER BY c.created_at ASC`,
      [postId]
    );

    res.json(comments);
  } catch (err) {
    console.error("Error en getCommentsByPost:", err.message);
    res.status(500).json({ message: "Error al obtener comentarios" });
  }
}

// ─── POST /api/posts/:postId/comments ────────────────────────────────────────
async function createComment(req, res) {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "El comentario no puede estar vacío" });
    }
    if (content.length > 500) {
      return res.status(400).json({ message: "El comentario no puede superar 500 caracteres" });
    }

    const [postRows] = await db.query("SELECT id FROM posts WHERE id = ?", [postId]);
    if (!postRows[0]) return res.status(404).json({ message: "Publicación no encontrada" });

    const [result] = await db.query(
      "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)",
      [postId, userId, content.trim()]
    );

    const [rows] = await db.query(
      `SELECT c.id, c.user_id, u.username, c.content, c.created_at, c.updated_at
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.id = ?`,
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error en createComment:", err.message);
    res.status(500).json({ message: "Error al crear el comentario" });
  }
}

// ─── PUT /api/posts/:postId/comments/:commentId ───────────────────────────────
async function updateComment(req, res) {
  try {
    const { postId, commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "El comentario no puede estar vacío" });
    }
    if (content.length > 500) {
      return res.status(400).json({ message: "El comentario no puede superar 500 caracteres" });
    }

    const [rows] = await db.query(
      "SELECT user_id FROM comments WHERE id = ? AND post_id = ?",
      [commentId, postId]
    );
    const comment = rows[0];

    if (!comment) return res.status(404).json({ message: "Comentario no encontrado" });
    if (comment.user_id !== userId) return res.status(403).json({ message: "No tienes permiso para editar este comentario" });

    await db.query("UPDATE comments SET content = ? WHERE id = ?", [content.trim(), commentId]);

    const [updated] = await db.query(
      `SELECT c.id, c.user_id, u.username, c.content, c.created_at, c.updated_at
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.id = ?`,
      [commentId]
    );

    res.json(updated[0]);
  } catch (err) {
    console.error("Error en updateComment:", err.message);
    res.status(500).json({ message: "Error al editar el comentario" });
  }
}

// ─── DELETE /api/posts/:postId/comments/:commentId ───────────────────────────
async function deleteComment(req, res) {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.id;

    const [rows] = await db.query(
      "SELECT user_id FROM comments WHERE id = ? AND post_id = ?",
      [commentId, postId]
    );
    const comment = rows[0];

    if (!comment) return res.status(404).json({ message: "Comentario no encontrado" });
    if (comment.user_id !== userId) return res.status(403).json({ message: "No tienes permiso para eliminar este comentario" });

    await db.query("DELETE FROM comments WHERE id = ?", [commentId]);

    res.json({ message: "Comentario eliminado correctamente" });
  } catch (err) {
    console.error("Error en deleteComment:", err.message);
    res.status(500).json({ message: "Error al eliminar el comentario" });
  }
}

module.exports = { getCommentsByPost, createComment, updateComment, deleteComment };
