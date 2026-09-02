import AdminSimplePage from "./AdminSimplePage.jsx";
export default function AdminPartidas() {
  return (
    <AdminSimplePage
      title="Partidas"
      description="Cadastre confrontos e atualize placares."
      button="+ Nova partida"
      rows={[
        ["3º D x 2º A", "Voleibol • 09:00"],
        ["2º EM A x 1º EM B", "Fut7 • 10:30"],
        ["3º A x 3º B", "Queimado • 13:30"],
      ]}
    />
  );
}
