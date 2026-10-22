import { MeusMateriaisCard } from '../components/aluno/MeusMateriaisCard';

export function AlunoPage() {
  // Exemplo de materiais liberados para o aluno logado (futuramente puxado do banco pós-pagamento)
  const materiaisLiberados = [
    {
      id: '1',
      titulo: 'E-book Psicofármacos na Prática',
      descricao: 'Guia completo de antidepressivos, estabilizadores, antipsicóticos e manejo seguro.',
      emoji: '📘',
      tipo: 'pdf' as const,
      linkDownload: '#'
    },
    {
      id: '2',
      titulo: 'Flashcards de Saúde Mental',
      descricao: 'Estudo ativo comprovado pela neurociência para fixar doses e vias sinápticas.',
      emoji: '🎯',
      tipo: 'flashcard' as const,
      linkDownload: '#'
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--cor-creme, #fcfafc)', minHeight: '100vh', padding: 'clamp(2rem, 5vw, 4rem) 1.5rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto 3rem auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ color: 'var(--cor-rosa, #c85da1)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Área de Membros</span>
          <h1 style={{ color: 'var(--cor-roxo-escuro, #422850)', fontSize: 'clamp(1.8rem, 4vw, 2.3rem)', fontWeight: '900', margin: '4px 0 0 0' }}>
            Bem-vindo(a) à sua Estante! 🧠
          </h1>
        </div>
        <a href="/" style={{ color: 'var(--cor-roxo-escuro, #422850)', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.95rem' }}>
          ← Voltar para o Site
        </a>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h3 style={{ color: 'var(--cor-roxo-escuro, #422850)', fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: '800' }}>
          📚 Seus Materiais Liberados
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {materiaisLiberados.map((item) => (
            <MeusMateriaisCard 
              key={item.id}
              titulo={item.titulo}
              descricao={item.descricao}
              emoji={item.emoji}
              tipo={item.tipo}
              linkDownload={item.linkDownload}
            />
          ))}
        </div>
      </div>
    </div>
  );
}