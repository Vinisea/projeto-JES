import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout.jsx";
import { buscarRegulamento, editarRegulamento } from "../services/regulamentoService.js";

export default function AdminRegulamento() {
  const [texto, setTexto] = useState("");
  const [editando, setEditando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    buscarRegulamento()
      .then((dados) => setTexto(dados.texto))
      .catch(() => setMensagem("Não foi possível carregar o regulamento."));
  }, []);

  async function salvar() {
    try {
      const dados = await editarRegulamento(texto);
      setTexto(dados.texto);
      setEditando(false);
      setMensagem("Regulamento atualizado.");
    } catch {
      setMensagem("Não foi possível atualizar o regulamento.");
    }
  }

  return (
    <AdminLayout
      title="Regulamento"
      description="Consulte e atualize as regras da competição."
    >
      <section className="admin-panel full-panel">
        <h2>Regulamento JES 2026</h2>
        {editando ? (
          <textarea className="regulation-text" value={texto} onChange={(event) => setTexto(event.target.value)} rows="6" />
        ) : <p className="regulation-text">{texto || "Carregando..."}</p>}
        {mensagem && <p className="form-message">{mensagem}</p>}
        {editando ? (
          <button className="panel-button" type="button" onClick={salvar}>Salvar regulamento</button>
        ) : (
          <button className="panel-button" type="button" onClick={() => setEditando(true)}>Editar regulamento</button>
        )}
      </section>
    </AdminLayout>
  );
}
