import { SideBar } from "./SideBar/SideBar.jsx";

export default function AdminLayout({ children, title, description }) {
  return (
    <div className="admin-layout">
      <SideBar />
      <main className="admin-content">
        <header className="admin-header">
          <div><span className="eyebrow">PAINEL DE ARBITRAGEM</span><h1>{title}</h1><p>{description}</p></div>
          <div className="admin-user"><span className="user-avatar">A</span><span><strong>Administrador</strong><small>Arbitragem</small></span></div>
        </header>
        {children}
      </main>
    </div>
  );
}