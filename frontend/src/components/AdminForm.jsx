export default function AdminForm({ title, fields, values, onChange, onSubmit, onCancel, saving }) {
  return (
    <form className="admin-form" onSubmit={onSubmit}>
      <div className="panel-heading">
        <h2>{title}</h2>
        <button className="row-action" type="button" onClick={onCancel}>Cancelar</button>
      </div>
      <div className="admin-form-grid">
        {fields.map((field) => (
          <label key={field.name}>
            {field.label}
            {field.type === "select" ? (
              <select name={field.name} value={values[field.name] ?? ""} onChange={(event) => onChange(field.name, event.target.value)} required={field.required !== false}>
                {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            ) : <input name={field.name} type={field.type || "text"} value={values[field.name] ?? ""} onChange={(event) => onChange(field.name, event.target.value)} required={field.required !== false} min={field.min} />}
          </label>
        ))}
      </div>
      <button className="panel-button" type="submit" disabled={saving}>
        {saving ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}
