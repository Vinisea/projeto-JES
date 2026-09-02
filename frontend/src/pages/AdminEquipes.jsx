import AdminSimplePage from "./AdminSimplePage.jsx";
export default function AdminEquipes() {
  return (
    <AdminSimplePage
      title="Equipes"
      description="Organize as equipes e turmas participantes."
      button="+ Nova equipe"
      rows={[
        ["3º B", "Espanha • 150 pts"],
        ["3º A", "Espanha • 100 pts"],
        ["3º C", "Espanha • 70 pts"],
      ]}
    />
  );
}
