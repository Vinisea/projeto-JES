import { Link, NavLink } from "react-router-dom";

const links = [
  { label: "Inicio", to: "/" },
  { label: "Modalidades", to: "/modalidades" },
  { label: "Jogos", to: "/ao-vivo" },
  { label: "Classificação", to: "/classificacao" },
];

export function NavBar() {
  return (
    <header className="topbar">
      <Link className="brand" to="/">
        <span className="brand-mark">SESI</span>
        <span className="brand-copy">
          <strong>JES 2026</strong>
          <small>Jogos Internos</small>
        </span>
      </Link>

      <nav className="main-nav" aria-label="Navegação principal">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <span className="nav-dot" aria-hidden="true" />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <Link className="admin-link" to="/login">
        <span aria-hidden="true">◌</span>
        Arbitragem
      </Link>
    </header>
  );
}

