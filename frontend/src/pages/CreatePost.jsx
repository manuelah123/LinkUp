import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postsAPI } from "../services/api";
import Navbar from "../components/Navbar";

export default function CreatePost() {
  const [form, setForm] = useState({ content: "", image_url: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.content.trim()) { setError("El contenido no puede estar vacío."); return; }
    setLoading(true);
    try {
      await postsAPI.create({
        content: form.content.trim(),
        ...(form.image_url.trim() ? { image_url: form.image_url.trim() } : {}),
      });
      navigate("/feed");
    } catch (err) {
      setError(err.message || "Error al publicar.");
    } finally {
      setLoading(false);
    }
  };

  const charsLeft = 500 - form.content.length;

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.glow} />
        <div style={styles.container}>
          <div style={styles.header}>
            <button onClick={() => navigate("/feed")} style={styles.backBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
            </button>
            <h1 style={styles.title}>Nueva publicación</h1>
          </div>

          <div style={styles.card}>
            {error && <div style={styles.errorBox}>⚠ {error}</div>}

            <form onSubmit={handleSubmit} style={styles.form}>
              <label style={styles.label}>
                <span style={styles.labelRow}>
                  ¿Qué quieres compartir?
                  <span style={{ color: charsLeft < 50 ? "#f87171" : "rgba(202,169,243,0.35)", fontSize: "12px" }}>
                    {charsLeft}
                  </span>
                </span>
                <textarea
                  name="content" value={form.content}
                  onChange={handleChange}
                  placeholder="Escribe algo interesante..."
                  maxLength={500} rows={5} style={styles.textarea}
                />
              </label>

              <label style={styles.label}>
                <span>Imagen (URL opcional)</span>
                <div style={styles.imageInputRow}>
                  <input
                    type="url" name="image_url" value={form.image_url}
                    onChange={(e) => { handleChange(e); setPreview(false); }}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    style={styles.input}
                  />
                  {form.image_url.trim() && (
                    <button type="button" style={styles.previewToggle} onClick={() => setPreview((v) => !v)}>
                      {preview ? "Ocultar" : "Ver"}
                    </button>
                  )}
                </div>
              </label>

              {preview && form.image_url && (
                <div style={styles.previewWrapper}>
                  <img
                    src={form.image_url} alt="Preview" style={styles.previewImg}
                    onError={(e) => { e.target.style.display = "none"; setError("No se pudo cargar la imagen."); }}
                  />
                </div>
              )}

              <div style={styles.actions}>
                <button type="button" onClick={() => navigate("/feed")} style={styles.cancelBtn}>
                  Cancelar
                </button>
                <button type="submit" style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
                  {loading ? <span style={styles.spinner} /> : (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                      Publicar
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh", background: "#0E155E",
    paddingTop: "82px", paddingBottom: "60px",
    position: "relative", overflow: "hidden",
  },
  glow: {
    position: "absolute", width: "600px", height: "600px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(179,122,212,0.08) 0%, transparent 70%)",
    top: "0", right: "-100px", pointerEvents: "none",
  },
  container: {
    maxWidth: "600px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1,
  },
  header: { display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" },
  backBtn: {
    background: "rgba(202,169,243,0.08)", border: "1px solid rgba(202,169,243,0.15)",
    borderRadius: "10px", padding: "8px", color: "rgba(202,169,243,0.7)",
    cursor: "pointer", display: "flex", alignItems: "center",
  },
  title: { fontSize: "24px", fontWeight: "800", color: "#CAA9F3", letterSpacing: "-0.5px" },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(202,169,243,0.12)",
    borderRadius: "20px", padding: "28px",
    backdropFilter: "blur(12px)",
  },
  errorBox: {
    background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)",
    borderRadius: "10px", padding: "12px 14px",
    color: "#f87171", fontSize: "13px", marginBottom: "20px",
  },
  form: { display: "flex", flexDirection: "column", gap: "18px" },
  label: {
    display: "flex", flexDirection: "column", gap: "7px",
    fontSize: "13px", fontWeight: "500", color: "rgba(202,169,243,0.7)",
  },
  labelRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  textarea: {
    background: "rgba(202,169,243,0.06)", border: "1px solid rgba(202,169,243,0.15)",
    borderRadius: "12px", padding: "14px", color: "#fff",
    fontSize: "15px", lineHeight: "1.6", outline: "none",
    resize: "vertical", minHeight: "130px", fontFamily: "inherit",
  },
  imageInputRow: { display: "flex", gap: "8px" },
  input: {
    flex: 1, background: "rgba(202,169,243,0.06)",
    border: "1px solid rgba(202,169,243,0.15)",
    borderRadius: "10px", padding: "11px 14px",
    color: "#fff", fontSize: "14px", outline: "none",
  },
  previewToggle: {
    background: "rgba(202,169,243,0.1)", border: "1px solid rgba(202,169,243,0.2)",
    borderRadius: "10px", padding: "11px 14px", color: "#CAA9F3",
    fontSize: "13px", cursor: "pointer", whiteSpace: "nowrap",
  },
  previewWrapper: { borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(202,169,243,0.1)" },
  previewImg: { width: "100%", maxHeight: "320px", objectFit: "cover", display: "block" },
  actions: { display: "flex", gap: "10px", justifyContent: "flex-end", paddingTop: "6px" },
  cancelBtn: {
    background: "transparent", border: "1px solid rgba(202,169,243,0.15)",
    borderRadius: "10px", padding: "11px 20px",
    color: "rgba(202,169,243,0.5)", fontSize: "14px", cursor: "pointer",
  },
  submitBtn: {
    background: "linear-gradient(135deg, #B37AD4, #7997E6)",
    border: "none", borderRadius: "10px", padding: "11px 22px",
    color: "#fff", fontSize: "14px", fontWeight: "700",
    cursor: "pointer", display: "flex", alignItems: "center", gap: "7px",
  },
  spinner: {
    width: "16px", height: "16px",
    border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff",
    borderRadius: "50%", animation: "spin 0.8s linear infinite",
  },
};
