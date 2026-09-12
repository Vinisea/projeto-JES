import AdminLayout from "../components/AdminLayout.jsx";

export default function AdminSimplePage({ title, description, button, rows, loading, error, onAdd, onEdit, onRemove, renderRowActions, children }) {
  return (
    <AdminLayout title={title} description={description}>
      {children}
      <section className="admin-panel full-panel">
        <div className="panel-heading">
          <h2>Lista cadastrada</h2>
          {button && <button className="panel-button" type="button" onClick={onAdd}>{button}</button>}
        </div>
        <div className="admin-list">
          {loading && <div className="empty-state">Carregando dados...</div>}
          {error && <div className="empty-state">{error}</div>}
          {!loading && !error && rows.map((row) => (
            <div className="admin-list-row" key={row[0]}>
              <strong>{row[0]}</strong>
              <span>{row[1]}</span>
              <span className="row-status">Ativo</span>
              {onEdit && <button type="button" className="row-action" onClick={() => onEdit(row[2])}>Editar</button>}
              {onRemove && <button type="button" className="row-action" onClick={() => onRemove(row[2])}>Excluir</button>}
              {renderRowActions?.(row[2])}
            </div>
          ))}
          {!loading && !error && !rows.length && <div className="empty-state">Nenhum registro encontrado.</div>}
        </div>
      </section>
    </AdminLayout>
  );
}
