import AdminSimplePage from "./AdminSimplePage.jsx";
export default function AdminAtletas() {
  return (
    <AdminSimplePage
      title="Atletas"
      description="Gerencie os estudantes inscritos nos jogos."
      button="+ Novo atleta"
      rows={[
        ["Vinicius Fernandes", "3º D • Voleibol"],
        ["Pedro Lima", "9º B • Fut7"],
        ["Mariana Costa", "2º EM A • Queimado"],
      ]}
    />
  );
}
