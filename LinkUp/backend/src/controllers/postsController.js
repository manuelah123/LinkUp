const db = require("../db");

const POST_SELECT = `
  SELECT
    p.id,
    p.user_id,
    u.username,
    p.content,
    p.image_url,
    p.created_at,
    p.updated_at,
    COUNT(DISTINCT l.id)  AS likes_count,
    COUNT(DISTINCT c.id)  AS comments_count,
    MAX(l.user_id = ?)    AS liked_by_user
  FROM posts p
  JOIN users u ON u.id = p.user_id
  LEFT JOIN likes    l ON l.post_id = p.id
  LEFT JOIN comments c ON c.post_id = p.id
`;

// ─── GET /api/posts?search=texto ─────────────────────────────────────────────
async function getAllPosts(req, res) {
  try {
    const userId = req.user.id;
    const search = req.query.search ? `%${req.query.search}%` : null;

    let query = POST_SELECT;
    let params = [userId];

    if (search) {
      query += " WHERE p.content LIKE ?";
      params.push(search);
    }

    query += " GROUP BY p.id ORDER BY p.created_at DESC";

    const [posts] = await db.query(query, params);

    const result = posts.map((p) => ({ ...p, liked_by_user: Boolean(p.liked_by_user) }));
    res.json(result);
  } catch (err) {
    console.error("Error en getAllPosts:", err.message);
    res.status(500).json({ message: "Error al obtener publicaciones" });
  }
}

// ─── GET /api/posts/:id ──────────────────────────────────────────────────────
async function getPostById(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [rows] = await db.query(
      POST_SELECT + " WHERE p.id = ? GROUP BY p.id",
      [userId, id]
    );
    const post = rows[0];

    if (!post) return res.status(404).json({ message: "Publicación no encontrada" });

    res.json({ ...post, liked_by_user: Boolean(post.liked_by_user) });
  } catch (err) {
    console.error("Error en getPostById:", err.message);
    res.status(500).json({ message: "Error al obtener la publicación" });
  }
}

// ─── POST /api/posts ─────────────────────────────────────────────────────────
async function createPost(req, res) {
  try {
    const { content, image_url } = req.body;
    const userId = req.user.id;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "El contenido no puede estar vacío" });
    }
    if (content.length > 500) {
      return res.status(400).json({ message: "El contenido no puede superar 500 caracteres" });
    }

    const [result] = await db.query(
      "INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)",
      [userId, content.trim(), image_url || null]
    );

    const [rows] = await db.query(
      POST_SELECT + " WHERE p.id = ? GROUP BY p.id",
      [userId, result.insertId]
    );

    res.status(201).json({ ...rows[0], liked_by_user: false });
  } catch (err) {
    console.error("Error en createPost:", err.message);
    res.status(500).json({ message: "Error al crear la publicación" });
  }
}

// ─── PUT /api/posts/:id ───────────────────────────────────────────────────────
async function updatePost(req, res) {
  try {
    const { id } = req.params;
    const { content, image_url } = req.body;
    const userId = req.user.id;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "El contenido no puede estar vacío" });
    }
    if (content.length > 500) {
      return res.status(400).json({ message: "El contenido no puede superar 500 caracteres" });
    }

    const [rows] = await db.query("SELECT user_id FROM posts WHERE id = ?", [id]);
    const post = rows[0];

    if (!post) return res.status(404).json({ message: "Publicación no encontrada" });
    if (post.user_id !== userId) return res.status(403).json({ message: "No tienes permiso para editar esta publicación" });

    await db.query(
      "UPDATE posts SET content = ?, image_url = ? WHERE id = ?",
      [content.trim(), image_url !== undefined ? image_url : null, id]
    );

    const [updated] = await db.query(
      POST_SELECT + " WHERE p.id = ? GROUP BY p.id",
      [userId, id]
    );

    res.json({ ...updated[0], liked_by_user: Boolean(updated[0].liked_by_user) });
  } catch (err) {
    console.error("Error en updatePost:", err.message);
    res.status(500).json({ message: "Error al editar la publicación" });
  }
}

// ─── DELETE /api/posts/:id ───────────────────────────────────────────────────
async function deletePost(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [rows] = await db.query("SELECT user_id FROM posts WHERE id = ?", [id]);
    const post = rows[0];

    if (!post) return res.status(404).json({ message: "Publicación no encontrada" });
    if (post.user_id !== userId) return res.status(403).json({ message: "No tienes permiso para eliminar esta publicación" });

    await db.query("DELETE FROM posts WHERE id = ?", [id]);

    res.json({ message: "Publicación eliminada correctamente" });
  } catch (err) {
    console.error("Error en deletePost:", err.message);
    res.status(500).json({ message: "Error al eliminar la publicación" });
  }
}

// ─── POST /api/posts/:id/like ─────────────────────────────────────────────────
async function toggleLike(req, res) {
  try {
    const { id: postId } = req.params;
    const userId = req.user.id;

    const [postRows] = await db.query("SELECT id FROM posts WHERE id = ?", [postId]);
    if (!postRows[0]) return res.status(404).json({ message: "Publicación no encontrada" });

    const [likeRows] = await db.query(
      "SELECT id FROM likes WHERE post_id = ? AND user_id = ?",
      [postId, userId]
    );

    let liked;
    if (likeRows[0]) {
      await db.query("DELETE FROM likes WHERE id = ?", [likeRows[0].id]);
      liked = false;
    } else {
      await db.query("INSERT INTO likes (post_id, user_id) VALUES (?, ?)", [postId, userId]);
      liked = true;
    }

    const [countRows] = await db.query(
      "SELECT COUNT(*) AS likes_count FROM likes WHERE post_id = ?",
      [postId]
    );

    res.json({ liked, likes_count: countRows[0].likes_count });
  } catch (err) {
    console.error("Error en toggleLike:", err.message);
    res.status(500).json({ message: "Error al procesar el like" });
  }
}

module.exports = { getAllPosts, getPostById, createPost, updatePost, deletePost, toggleLike };
