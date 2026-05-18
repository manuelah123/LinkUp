import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;
  if (!user) return null;

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/feed" style={styles.logo}>
          <span style={styles.logoIcon}>🪼</span>
          <span style={styles.logoText}>LinkUp</span>
        </Link>
        <div style={styles.links}>
          <Link to="/feed" style={{ ...styles.link, ...(isActive("/feed") ? styles.linkActive : {}) }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Inicio
          </Link>
          <Link to="/create" style={{ ...styles.link, ...(isActive("/create") ? styles.linkActive : {}) }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            Publicar
          </Link>
        </div>
        <div style={styles.user}>
          <div style={styles.avatar}>{user.username?.[0]?.toUpperCase() || "U"}</div>
          <span style={styles.username}>@{user.username}</span>
          <button onClick={handleLogout} style={styles.logout} title="Cerrar sesión">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
    background: "rgba(10,10,10,0.95)", backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(147,51,234,0.2)",
  },
  inner: {
    maxWidth: "900px", margin: "0 auto", padding: "0 24px", height: "62px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
  },
  logo: { display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" },
  logoIcon: { fontSize: "22px" },
  logoText: { fontSize: "21px", fontWeight: "800", color: "#d8b4fe", letterSpacing: "-0.5px" },
  links: { display: "flex", gap: "4px" },
  link: {
    display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px",
    borderRadius: "8px", color: "rgba(216,180,254,0.5)", textDecoration: "none",
    fontSize: "14px", fontWeight: "500", transition: "all 0.15s",
  },
  linkActive: { color: "#d8b4fe", background: "rgba(147,51,234,0.15)" },
  user: { display: "flex", alignItems: "center", gap: "10px" },
  avatar: {
    width: "32px", height: "32px", borderRadius: "50%",
    background: "linear-gradient(135deg, #9333ea, #7c3aed)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "13px", fontWeight: "700", color: "#fff",
  },
  username: { fontSize: "13px", color: "rgba(216,180,254,0.6)" },
  logout: {
    background: "transparent", border: "none", color: "rgba(216,180,254,0.4)",
    cursor: "pointer", padding: "6px", borderRadius: "6px",
    display: "flex", alignItems: "center",
  },
};