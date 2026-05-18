import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.email || !form.password) { setError("Completa todos los campos."); return; }
    setLoading(true);
    try {
      const { token, user } = await authAPI.login(form);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/feed");
    } catch (err) {
      setError(err.message || "Credenciales inválidas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.glowTop} />
      <div style={styles.glowBottom} />
      <div style={styles.card}>
        <div style={styles.brand}>
          <span style={styles.brandIcon}>🪼</span>
          <span style={styles.brandName}>LinkUp</span>
        </div>
        <h1 style={styles.title}>Bienvenido de nuevo</h1>
        <p style={styles.subtitle}>Inicia sesión para continuar</p>
        {error && <div style={styles.errorBox}>⚠ {error}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Correo electrónico</label>
            <input type="text" inputMode="email" name="email" value={form.email}
              onChange={handleChange} placeholder="tu@email.com"
              style={styles.input} autoComplete="email" />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Contraseña</label>
            <input type="password" name="password" value={form.password}
              onChange={handleChange} placeholder="••••••••"
              style={styles.input} autoComplete="current-password" />
          </div>
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? <span style={styles.spinner} /> : "Iniciar sesión"}
          </button>
        </form>
        <p style={styles.footer}>
          ¿No tienes cuenta?{" "}
          <Link to="/register" style={styles.footerLink}>Regístrate</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center",
    background: "#0a0a0a", padding: "24px", position: "relative", overflow: "hidden",
  },
  glowTop: {
    position: "absolute", width: "500px", height: "500px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(147,51,234,0.15) 0%, transparent 70%)",
    top: "-100px", left: "-100px", pointerEvents: "none",
  },
  glowBottom: {
    position: "absolute", width: "400px", height: "400px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)",
    bottom: "-80px", right: "-80px", pointerEvents: "none",
  },
  card: {
    width: "100%", maxWidth: "400px", background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(147,51,234,0.25)", borderRadius: "22px", padding: "40px",
    position: "relative", zIndex: 1, backdropFilter: "blur(12px)",
  },
  brand: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "28px" },
  brandIcon: { fontSize: "26px" },
  brandName: { fontSize: "24px", fontWeight: "800", color: "#d8b4fe", letterSpacing: "-0.5px" },
  title: { fontSize: "24px", fontWeight: "700", color: "#fff", margin: "0 0 6px", letterSpacing: "-0.4px" },
  subtitle: { fontSize: "14px", color: "rgba(216,180,254,0.5)", margin: "0 0 28px" },
  errorBox: {
    background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)",
    borderRadius: "10px", padding: "12px 14px", color: "#f87171", fontSize: "13px", marginBottom: "20px",
  },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", fontWeight: "500", color: "rgba(216,180,254,0.7)" },
  input: {
    background: "rgba(147,51,234,0.07)", border: "1px solid rgba(147,51,234,0.25)",
    borderRadius: "10px", padding: "11px 14px", color: "#fff", fontSize: "14px",
    outline: "none", width: "100%", boxSizing: "border-box",
  },
  btn: {
    marginTop: "8px", background: "linear-gradient(135deg, #9333ea, #7c3aed)",
    border: "none", borderRadius: "10px", padding: "13px", color: "#fff",
    fontSize: "14px", fontWeight: "700", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    width: "100%", boxSizing: "border-box",
  },
  spinner: {
    width: "18px", height: "18px", border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite",
  },
  footer: { textAlign: "center", marginTop: "24px", fontSize: "13px", color: "rgba(216,180,254,0.4)" },
  footerLink: { color: "#d8b4fe", textDecoration: "none", fontWeight: "600" },
};