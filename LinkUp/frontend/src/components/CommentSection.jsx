import { useState, useEffect } from "react";
import { commentsAPI } from "../services/api";

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await commentsAPI.getByPost(postId);
        setComments(data);
      } catch {
        setError("No se pudieron cargar los comentarios.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      const newComment = await commentsAPI.create(postId, { content: text.trim() });
      setComments((prev) => [...prev, newComment]);
      setText("");
    } catch {
      setError("Error al enviar el comentario.");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await commentsAPI.delete(postId, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch {
      setError("Error al eliminar.");
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
    <div style={styles.wrapper}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputRow}>
          <div style={styles.miniAvatar}>{currentUser?.username?.[0]?.toUpperCase() || "U"}</div>
          <input value={text} onChange={(e) => setText(e.target.value)}
            placeholder="Escribe un comentario..." style={styles.input} maxLength={500} />
          <button type="submit"
            style={{ ...styles.sendBtn, opacity: sending || !text.trim() ? 0.4 : 1 }}
            disabled={sending || !text.trim()}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </form>

      {error && <p style={styles.errorMsg}>{error}</p>}

      {loading ? (
        <p style={styles.mutedMsg}>Cargando comentarios...</p>
      ) : comments.length === 0 ? (
        <p style={styles.mutedMsg}>Sin comentarios aún. ¡Sé el primero!</p>
      ) : (
        <ul style={styles.list}>
          {comments.map((c) => (
            <li key={c.id} style={styles.comment}>
              <div style={styles.miniAvatar}>{c.username?.[0]?.toUpperCase() || "U"}</div>
              <div style={styles.commentBody}>
                <div style={styles.commentHeader}>
                  <span style={styles.commentUser}>@{c.username}</span>
                  <span style={styles.commentTime}>{timeAgo(c.created_at)}</span>
                </div>
                <p style={styles.commentText}>{c.content}</p>
              </div>
              {currentUser?.id === c.user_id && (
                <button onClick={() => handleDelete(c.id)} style={styles.delBtn}>×</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  wrapper: { marginTop: "14px", paddingTop: "14px", borderTop: "1px solid rgba(147,51,234,0.1)" },
  form: { marginBottom: "12px" },
  inputRow: { display: "flex", gap: "8px", alignItems: "center" },
  miniAvatar: {
    width: "28px", height: "28px", borderRadius: "50%",
    background: "linear-gradient(135deg, #9333ea, #7c3aed)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "11px", fontWeight: "700", color: "#fff", flexShrink: 0,
  },
  input: {
    flex: 1, background: "rgba(147,51,234,0.07)", border: "1px solid rgba(147,51,234,0.2)",
    borderRadius: "8px", padding: "8px 12px", color: "#fff", fontSize: "13px", outline: "none",
  },
  sendBtn: {
    background: "rgba(147,51,234,0.15)", border: "1px solid rgba(147,51,234,0.3)",
    borderRadius: "8px", color: "#d8b4fe", cursor: "pointer", padding: "8px 10px",
    display: "flex", alignItems: "center",
  },
  errorMsg: { color: "#f87171", fontSize: "12px", marginBottom: "8px" },
  mutedMsg: { color: "rgba(216,180,254,0.35)", fontSize: "13px", padding: "8px 0", fontStyle: "italic" },
  list: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" },
  comment: { display: "flex", gap: "8px", alignItems: "flex-start" },
  commentBody: { flex: 1 },
  commentHeader: { display: "flex", gap: "8px", alignItems: "center", marginBottom: "2px" },
  commentUser: { fontSize: "12px", fontWeight: "600", color: "#d8b4fe" },
  commentTime: { fontSize: "11px", color: "rgba(216,180,254,0.3)" },
  commentText: { fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: "1.5" },
  delBtn: {
    background: "transparent", border: "none",
    color: "rgba(216,180,254,0.25)", fontSize: "18px", cursor: "pointer", padding: "0 4px",
  },
}; 