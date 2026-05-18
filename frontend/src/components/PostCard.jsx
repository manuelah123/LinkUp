import { useState } from "react";
import { postsAPI } from "../services/api";
import CommentSection from "./CommentSection";

export default function PostCard({ post, onDelete }) {
  const [liked, setLiked] = useState(post.liked_by_user || false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [showComments, setShowComments] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const isOwner = currentUser?.id === post.user_id;

  const handleLike = async () => {
    if (loadingLike) return;
    setLoadingLike(true);
    try {
      await postsAPI.like(post.id);
      setLiked((prev) => !prev);
      setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (err) {
      console.error("Error al dar like:", err.message);
    } finally {
      setLoadingLike(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Eliminar esta publicación?")) return;
    try {
      await postsAPI.delete(post.id);
      onDelete(post.id);
    } catch (err) {
      console.error("Error al eliminar:", err.message);
    }
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "ahora";
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  };

  return (
    <article style={styles.card}>
      <div style={styles.header}>
        <div style={styles.authorRow}>
          <div style={styles.avatar}>{post.username?.[0]?.toUpperCase() || "U"}</div>
          <div>
            <span style={styles.username}>@{post.username}</span>
            <span style={styles.time}>{timeAgo(post.created_at)}</span>
          </div>
        </div>
        {isOwner && (
          <button onClick={handleDelete} style={styles.deleteBtn} title="Eliminar">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14H6L5 6"/>
              <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
            </svg>
          </button>
        )}
      </div>

      <p style={styles.content}>{post.content}</p>

      {post.image_url && (
        <div style={styles.imageWrapper}>
          <img src={post.image_url} alt="Post" style={styles.image}
            onError={(e) => (e.target.style.display = "none")} />
        </div>
      )}

      <div style={styles.actions}>
        <button onClick={handleLike}
          style={{ ...styles.actionBtn, ...(liked ? styles.likedBtn : {}) }}
          disabled={loadingLike}>
          <svg width="16" height="16" viewBox="0 0 24 24"
            fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
          <span>{likesCount}</span>
        </button>
        <button onClick={() => setShowComments((v) => !v)}
          style={{ ...styles.actionBtn, ...(showComments ? styles.activeBtn : {}) }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
          <span>{post.comments_count || 0}</span>
        </button>
      </div>

      {showComments && <CommentSection postId={post.id} />}
    </article>
  );
}

const styles = {
  card: {
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(147,51,234,0.15)",
    borderRadius: "16px", padding: "20px",
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" },
  authorRow: { display: "flex", alignItems: "center", gap: "10px" },
  avatar: {
    width: "38px", height: "38px", borderRadius: "50%",
    background: "linear-gradient(135deg, #9333ea, #7c3aed)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "14px", fontWeight: "700", color: "#fff", flexShrink: 0,
  },
  username: { display: "block", fontSize: "14px", fontWeight: "600", color: "#d8b4fe" },
  time: { display: "block", fontSize: "12px", color: "rgba(216,180,254,0.4)", marginTop: "1px" },
  deleteBtn: {
    background: "transparent", border: "none", color: "rgba(216,180,254,0.3)",
    cursor: "pointer", padding: "6px", borderRadius: "6px", display: "flex", alignItems: "center",
  },
  content: { color: "rgba(255,255,255,0.88)", fontSize: "15px", lineHeight: "1.65", marginBottom: "14px" },
  imageWrapper: {
    borderRadius: "12px", overflow: "hidden", marginBottom: "14px",
    border: "1px solid rgba(147,51,234,0.15)",
  },
  image: { width: "100%", maxHeight: "400px", objectFit: "cover", display: "block" },
  actions: {
    display: "flex", gap: "8px", paddingTop: "12px",
    borderTop: "1px solid rgba(147,51,234,0.1)",
  },
  actionBtn: {
    display: "flex", alignItems: "center", gap: "6px", padding: "6px 14px",
    borderRadius: "8px", background: "transparent", border: "1px solid rgba(147,51,234,0.15)",
    color: "rgba(216,180,254,0.45)", fontSize: "13px", cursor: "pointer",
  },
  likedBtn: { color: "#c084fc", borderColor: "rgba(192,132,252,0.35)", background: "rgba(192,132,252,0.08)" },
  activeBtn: { color: "#d8b4fe", borderColor: "rgba(216,180,254,0.3)", background: "rgba(147,51,234,0.1)" },
};