import { NavLink, Link } from "react-router-dom";

const menu = [
  { label: "Dashboard", to: "/admin" },
  { label: "Atletas", to: "/admin/atletas" },
  { label: "Equipes", to: "/admin/equipes" },
  { label: "Partidas", to: "/admin/partidas" },
  { label: "Regulamento", to: "/admin/regulamento" },
];

export function SideBar() {
  return (
    <aside className="admin-sidebar">
      <Link className="admin-logo" to="/admin"><span className="brand-mark">SESI</span><span><strong>JES 2026</strong><small>Arbitragem</small></span></Link>
      <nav className="admin-menu">
        <span className="menu-caption">MENU PRINCIPAL</span>
        {menu.map((item) => <NavLink key={item.to} to={item.to} end={item.to === "/admin"} className={({ isActive }) => isActive ? "admin-menu-link active" : "admin-menu-link"}>{item.label}</NavLink>)}
      </nav>
      <Link className="admin-exit" to="/">← Ver site público</Link>
    </aside>
  );
}