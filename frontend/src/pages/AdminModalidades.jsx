import { useEffect, useState } from "react";
import AdminForm from "../components/AdminForm.jsx";
import AdminSimplePage from "./AdminSimplePage.jsx";
import { criarModalidade, editarModalidade, listarModalidades, removerModalidade } from "../services/modalidadeService.js";

export default function AdminModalidades() {
  const [modalidades, setModalidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formulario, setFormulario] = useState(null);
  const [salvando, setSalvando] = useState(false);

  function carregar() {
    setLoading(true);
    listarModalidades().then(setModalidades).catch(() => setError("Não foi possível carregar as modalidades.")).finally(() => setLoading(false));
  }

  useEffect(() => { carregar(); }, []);
  function adicionar() { setFormulario({ id: null, nome_modalidade: "", regras: "", categoria: "Masculino" }); }
  function editar(id) {
    const modalidade = modalidades.find((item) => item.id_modalidade === id);
    if (modalidade) setFormulario({ id, nome_modalidade: modalidade.nome_modalidade, regras: modalidade.regras, categoria: modalidade.categoria });
  }
  async function salvar(event) {
    event.preventDefault();
    setSalvando(true);
    const { id, ...dados } = formulario;
    try { if (id) await editarModalidade(id, dados); else await criarModalidade(dados); setFormulario(null); carregar(); }
    catch { setError("Não foi possível salvar a modalidade."); }
    finally { setSalvando(false); }
  }
  async function excluir(id) {
    if (!window.confirm("Excluir esta modalidade?")) return;
    try { await removerModalidade(id); carregar(); } catch { setError("Não foi possível excluir a modalidade."); }
  }

  return <AdminSimplePage title="Modalidades" description="Cadastre os esportes e suas regras." button="+ Nova modalidade" rows={modalidades.map((item) => [item.nome_modalidade, item.categoria, item.id_modalidade])} loading={loading} error={error} onAdd={adicionar} onEdit={editar} onRemove={excluir} children={formulario && <AdminForm title={formulario.id ? "Editar modalidade" : "Nova modalidade"} fields={[{ name: "nome_modalidade", label: "Nome" }, { name: "categoria", label: "Categoria" }, { name: "regras", label: "Regras" }]} values={formulario} onChange={(name, value) => setFormulario({ ...formulario, [name]: value })} onSubmit={salvar} onCancel={() => setFormulario(null)} saving={salvando} />} />;
}
