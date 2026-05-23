import '../App.css';

export default function Dashboard() {
  return (
    <div className="page-container">
      <header className="page-header">
        <div className="page-title-row">
          <h1>Olá, Estudante! 👋</h1>
        </div>
        <p className="page-subtitle">Domingo, 12 de abril de 2026</p>
      </header>

      <section className="universal-card">
        <h2>Visão Geral</h2>
        <p style={{ color: "#64748B", margin: 0 }}>
          O conteúdo do painel principal será renderizado aqui futuramente.
        </p>
      </section>
    </div>
  );
}