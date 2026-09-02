import { Routes, Route } from "react-router-dom";
import { NavBar } from "./components/NavBar/NavBar.jsx";
import { Footer } from "./components/Footer/Footer.jsx";
import { MainLayout } from "./components/MainLayout/MainLayout.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Modalidades from "./pages/Modalidades.jsx";
import JogosAoVivo from "./pages/JogosAoVivo.jsx";
import Ranking from "./pages/Ranking.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AdminAtletas from "./pages/AdminAtletas.jsx";
import AdminEquipes from "./pages/AdminEquipes.jsx";
import AdminPartidas from "./pages/AdminPartidas.jsx";
import AdminRegulamento from "./pages/AdminRegulamento.jsx";
import Grupos from "./pages/Grupos.jsx";
import Partidas from "./pages/Partidas.jsx";
import DashboardCompeticao from "./pages/DashboardCompeticao.jsx";

function NotFound() {
  return (
    <main className="page-shell">
      <section className="empty-page">
        <span className="eyebrow">JES 2026</span>
        <h1>Página não encontrada</h1>
        <p>O endereço que você acessou ainda não existe.</p>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <div className="app-container">
      <NavBar />

      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/modalidades" element={<Modalidades />} />
        <Route path="/ao-vivo" element={<JogosAoVivo />} />
        <Route path="/Ranking" element={<Ranking />} />
        <Route path="/grupos" element={<Grupos />} />
        <Route path="/partidas" element={<Partidas />} />
        <Route path="/dashboard/competicao" element={<DashboardCompeticao />} />
        <Route path="/login" element={<Login />} />

        <Route element={<PrivateRoute />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/atletas" element={<AdminAtletas />} />
          <Route path="/admin/equipes" element={<AdminEquipes />} />
          <Route path="/admin/partidas" element={<AdminPartidas />} />
          <Route path="/admin/regulamento" element={<AdminRegulamento />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </div>
  );
}