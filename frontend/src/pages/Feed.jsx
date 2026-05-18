import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { postsAPI } from "../services/api";
import PostCard from "../components/PostCard";
import Navbar from "../components/Navbar";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await postsAPI.getAll();  // ← llama a la API real
      setPosts(data);
    } catch (err) {
      if (err.message.includes("401") || err.message.includes("Unauthorized")) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError("No se pudo cargar el feed. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (postId) => setPosts((prev) => prev.filter((p) => p.id !== postId));

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.glow} />
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>Feed</h1>
            <button onClick={() => navigate("/create")} style={styles.newBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Nueva publicación
            </button>
          </div>

          {loading && (
            <div style={styles.stateWrapper}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={styles.skeleton}>
                  <div style={{ ...styles.skeletonLine, width: "30%", height: "14px" }} />
                  <div style={{ ...styles.skeletonLine, width: "100%", height: "14px", marginTop: "16px" }} />
                  <div style={{ ...styles.skeletonLine, width: "75%", height: "14px", marginTop: "8px" }} />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div style={styles.errorBox}>
              <p style={{ color: "#f87171", marginBottom: "12px", fontSize: "14px" }}>{error}</p>
              <button onClick={loadPosts} style={styles.retryBtn}>Reintentar</button>
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div style={styles.emptyState}>
              <span style={styles.emptyIcon}>🪼</span>
              <h3 style={styles.emptyTitle}>El feed está vacío</h3>
              <p style={styles.emptyText}>¡Sé el primero en publicar algo!</p>
              <button onClick={() => navigate("/create")} style={styles.newBtn}>Crear publicación</button>
            </div>
          )}

          {!loading && !error && posts.length > 0 && (
            <div style={styles.postList}>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const styles = {
  page: {
    minHeight: "100dvh", background: "#0a0a0a",
    paddingTop: "82px", paddingBottom: "60px",
    position: "relative", overflow: "hidden",
  },
  glow: {
    position: "absolute", width: "700px", height: "700px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(147,51,234,0.08) 0%, transparent 70%)",
    top: "10%", left: "50%", transform: "translateX(-50%)", pointerEvents: "none",
  },
  container: { maxWidth: "680px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" },
  title: { fontSize: "26px", fontWeight: "800", color: "#d8b4fe", letterSpacing: "-0.5px" },
  newBtn: {
    display: "flex", alignItems: "center", gap: "7px",
    background: "linear-gradient(135deg, #9333ea, #7c3aed)",
    border: "none", borderRadius: "10px", padding: "10px 18px",
    color: "#fff", fontSize: "13px", fontWeight: "700", cursor: "pointer",
  },
  stateWrapper: { display: "flex", flexDirection: "column", gap: "14px" },
  skeleton: {
    background: "rgba(147,51,234,0.04)", border: "1px solid rgba(147,51,234,0.1)",
    borderRadius: "16px", padding: "20px",
  },
  skeletonLine: { background: "rgba(147,51,234,0.08)", borderRadius: "6px" },
  errorBox: {
    background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)",
    borderRadius: "14px", padding: "28px", textAlign: "center",
  },
  retryBtn: {
    background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.3)",
    borderRadius: "8px", padding: "8px 20px", color: "#f87171", cursor: "pointer", fontSize: "13px",
  },
  emptyState: {
    textAlign: "center", padding: "80px 24px",
    display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
  },
  emptyIcon: { fontSize: "48px", marginBottom: "8px" },
  emptyTitle: { fontSize: "18px", fontWeight: "700", color: "#d8b4fe" },
  emptyText: { fontSize: "14px", color: "rgba(216,180,254,0.4)", marginBottom: "16px" },
  postList: { display: "flex", flexDirection: "column", gap: "14px" },
};
