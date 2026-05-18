import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

function Field({ name, label, type = "text", inputMode, placeholder, autoComplete, form, errors, onChange }) {
  return (
    <div style={styles.fieldGroup}>
      <label style={styles.label}>{label}</label>
      <input
        type={type} inputMode={inputMode} name={name} value={form[name]}
        onChange={onChange} placeholder={placeholder}
        style={{ ...styles.input, ...(errors[name] ? styles.inputError : {}) }}
        autoComplete={autoComplete}
      />
      {errors[name] && <span style={styles.fieldError}>{errors[name]}</span>}
    </div>
  );
}

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.username.trim()) errs.username = "El nombre de usuario es obligatorio.";
    else if (form.username.length < 3) errs.username = "Mínimo 3 caracteres.";
    if (!form.email.trim()) errs.email = "El correo es obligatorio.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Correo no válido.";
    if (!form.password) errs.password = "La contraseña es obligatoria.";
    else if (form.password.length < 6) errs.password = "Mínimo 6 caracteres.";
    if (form.confirm !== form.password) errs.confirm = "Las contraseñas no coinciden.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      const { token, user } = await authAPI.register({
        username: form.username, email: form.email, password: form.password,
      });
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/feed");
    } catch (err) {
      setApiError(err.message || "Error al registrarse.");
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
        <h1 style={styles.title}>Crea tu cuenta</h1>
        <p style={styles.subtitle}>Únete a la comunidad</p>
        {apiError && <div style={styles.errorBox}>⚠ {apiError}</div>}
        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          <Field name="username" label="Nombre de usuario" placeholder="tu_usuario" autoComplete="username"
            form={form} errors={errors} onChange={handleChange} />
          <Field name="email" label="Correo electrónico" inputMode="email" placeholder="tu@email.com" autoComplete="email"
            form={form} errors={errors} onChange={handleChange} />
          <Field name="password" label="Contraseña" type="password" placeholder="Mínimo 6 caracteres" autoComplete="new-password"
            form={form} errors={errors} onChange={handleChange} />
          <Field name="confirm" label="Confirmar contraseña" type="password" placeholder="Repite tu contraseña" autoComplete="new-password"
            form={form} errors={errors} onChange={handleChange} />
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? <span style={styles.spinner} /> : "Crear cuenta"}
          </button>
        </form>
        <p style={styles.footer}>
          ¿Ya tienes cuenta?{" "}
          <Link to="/" style={styles.footerLink}>Inicia sesión</Link>
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
    background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
    top: "-100px", right: "-100px", pointerEvents: "none",
  },
  glowBottom: {
    position: "absolute", width: "400px", height: "400px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(147,51,234,0.08) 0%, transparent 70%)",
    bottom: "-80px", left: "-80px", pointerEvents: "none",
  },
  card: {
    width: "100%", maxWidth: "420px", background: "rgba(255,255,255,0.04)",
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
  form: { display: "flex", flexDirection: "column", gap: "14px" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "5px" },
  label: { fontSize: "13px", fontWeight: "500", color: "rgba(216,180,254,0.7)" },
  input: {
    background: "rgba(147,51,234,0.07)", border: "1px solid rgba(147,51,234,0.25)",
    borderRadius: "10px", padding: "11px 14px", color: "#fff", fontSize: "14px",
    outline: "none", width: "100%", boxSizing: "border-box",
  },
  inputError: { borderColor: "rgba(248,113,113,0.4)" },
  fieldError: { color: "#f87171", fontSize: "12px" },
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