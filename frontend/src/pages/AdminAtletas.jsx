import { useEffect, useState } from "react";
import AdminSimplePage from "./AdminSimplePage.jsx";
import AdminForm from "../components/AdminForm.jsx";
import { criarAtleta, editarAtleta, listarAtletas, removerAtleta } from "../services/atletaService.js";

export default function AdminAtletas() {
  const [atletas, setAtletas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formulario, setFormulario] = useState(null);
  const [salvando, setSalvando] = useState(false);

  function carregar() {
    listarAtletas()
      .then((dados) => setAtletas(dados.rows || []))
      .catch(() => setError("Não foi possível carregar os atletas."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    let ativo = true;
    listarAtletas()
      .then((dados) => { if (ativo) setAtletas(dados.rows || []); })
      .catch(() => { if (ativo) setError("Não foi possível carregar os atletas."); })
      .finally(() => { if (ativo) setLoading(false); });
    return () => { ativo = false; };
  }, []);

  function adicionar() { setFormulario({ id: null, nome_aluno: "", matricula: "", turma: "", id_equipe: "" }); }
  function editar(id) {
    const atleta = atletas.find((item) => item.id_atleta === id);
    if (atleta) setFormulario({ id, nome_aluno: atleta.nome_aluno, matricula: atleta.matricula, turma: atleta.turma, id_equipe: atleta.id_equipe });
  }
  async function salvar(event) {
    event.preventDefault();
    setSalvando(true);
    const { id, ...dados } = formulario;
    try {
      const payload = { ...dados, matricula: Number(dados.matricula), id_equipe: Number(dados.id_equipe) };
      if (id) await editarAtleta(id, payload); else await criarAtleta(payload);
      setFormulario(null); carregar();
    } catch { setError("Não foi possível salvar o atleta."); }
    finally { setSalvando(false); }
  }

  async function excluir(id) {
    if (!window.confirm("Excluir este atleta?")) return;
    try { await removerAtleta(id); carregar(); }
    catch { setError("Não foi possível excluir o atleta."); }
  }

  return (
    <AdminSimplePage
      title="Atletas"
      description="Gerencie os estudantes inscritos nos jogos."
      button="+ Novo atleta"
      rows={atletas.map((atleta) => [atleta.nome_aluno, `${atleta.turma} • ${atleta.equipe?.nome_equipe || "Sem equipe"}`, atleta.id_atleta])}
      loading={loading}
      error={error}
      onAdd={adicionar}
      onEdit={editar}
      onRemove={excluir}
      children={formulario && <AdminForm title={formulario.id ? "Editar atleta" : "Novo atleta"} fields={[{ name: "nome_aluno", label: "Nome" }, { name: "matricula", label: "Matrícula", type: "number" }, { name: "turma", label: "Turma" }, { name: "id_equipe", label: "ID da equipe", type: "number" }]} values={formulario} onChange={(name, value) => setFormulario({ ...formulario, [name]: value })} onSubmit={salvar} onCancel={() => setFormulario(null)} saving={salvando} />}
    />
  );
}
