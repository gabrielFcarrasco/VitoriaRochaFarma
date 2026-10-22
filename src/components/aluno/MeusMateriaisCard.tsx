// src/components/aluno/MeusMateriaisCard.tsx

interface MaterialProps {
  titulo: string;
  descricao: string;
  emoji: string;
  tipo: 'pdf' | 'flashcard';
  linkDownload: string;
}

export function MeusMateriaisCard({ titulo, descricao, emoji, tipo, linkDownload }: MaterialProps) {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
      border: '1px solid #edf2f7',
      textAlign: 'left',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <span style={{ fontSize: '3rem' }}>{emoji}</span>
          <span style={{ 
            backgroundColor: tipo === 'pdf' ? '#fdf2f8' : '#e0f2fe', 
            color: tipo === 'pdf' ? 'var(--cor-rosa, #c85da1)' : '#0284c7', 
            padding: '4px 12px', 
            borderRadius: '20px', 
            fontSize: '0.75rem', 
            fontWeight: '900',
            textTransform: 'uppercase'
          }}>
            {tipo === 'pdf' ? 'E-book PDF' : 'Flashcards'}
          </span>
        </div>

        <h3 style={{ color: 'var(--cor-roxo-escuro, #422850)', fontSize: '1.2rem', marginBottom: '0.6rem', fontWeight: '800' }}>
          {titulo}
        </h3>
        
        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
          {descricao}
        </p>
      </div>

      <a 
        href={linkDownload} 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          display: 'block',
          width: '100%',
          padding: '14px',
          backgroundColor: 'var(--cor-roxo-escuro, #422850)',
          color: 'white',
          textAlign: 'center',
          borderRadius: '12px',
          fontWeight: '800',
          textDecoration: 'none',
          fontSize: '0.95rem',
          boxSizing: 'border-box',
          textTransform: 'uppercase',
          marginTop: 'auto'
        }}
      >
        {tipo === 'pdf' ? '📥 Baixar E-book' : '🎯 Acessar Flashcards'}
      </a>
    </div>
  );
}