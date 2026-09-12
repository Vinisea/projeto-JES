import { SideBar } from "./SideBar/SideBar.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function AdminLayout({ children, title, description }) {
  const { usuario } = useAuth();
  return (
    <div className="admin-layout">
      <SideBar />
      <main className="admin-content">
        <header className="admin-header">
          <div><span className="eyebrow">PAINEL DE ARBITRAGEM</span><h1>{title}</h1><p>{description}</p></div>
          <div className="admin-user"><span className="user-avatar">{usuario?.nome?.charAt(0)?.toUpperCase() || "A"}</span><span><strong>{usuario?.nome || "Usuário"}</strong><small>{usuario?.tipo_usuario || "Arbitragem"}</small></span></div>
        </header>
        {children}
      </main>
    </div>
  );
}