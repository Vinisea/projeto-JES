import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";

const menu = [
  { label: "Dashboard", to: "/admin" },
  { label: "Atletas", to: "/admin/atletas" },
  { label: "Modalidades", to: "/admin/modalidades" },
  { label: "Equipes", to: "/admin/equipes" },
  { label: "Partidas", to: "/admin/partidas" },
  { label: "Chaveamento", to: "/admin/chaveamento" },
  { label: "Regulamento", to: "/admin/regulamento" },
];

export function SideBar() {
  const { logout } = useAuth();

  return (
    <aside className="admin-sidebar">
      <Link className="admin-logo" to="/admin"><span className="brand-mark">SESI</span><span><strong>JES 2026</strong><small>Arbitragem</small></span></Link>
      <nav className="admin-menu">
        <span className="menu-caption">MENU PRINCIPAL</span>
        {menu.map((item) => <NavLink key={item.to} to={item.to} end={item.to === "/admin"} className={({ isActive }) => isActive ? "admin-menu-link active" : "admin-menu-link"}>{item.label}</NavLink>)}
      </nav>
      <div className="admin-sidebar-footer">
        <Link className="admin-exit" to="/">← Ver site público</Link>
        <button className="admin-exit" type="button" onClick={logout}>Sair do painel</button>
      </div>
    </aside>
  );
}