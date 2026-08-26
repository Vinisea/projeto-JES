import AdminLayout from "../components/AdminLayout.jsx";

export default function AdminSimplePage({ title, description, button, rows }) {
  return (
    <AdminLayout title={title} description={description}>
      <section className="admin-panel full-panel">
        <div className="panel-heading">
          <h2>Lista cadastrada</h2>
          <button className="panel-button">{button}</button>
        </div>
        <div className="admin-list">
          {rows.map((row) => (
            <div className="admin-list-row" key={row[0]}>
              <strong>{row[0]}</strong>
              <span>{row[1]}</span>
              <span className="row-status">Ativo</span>
            </div>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
}
