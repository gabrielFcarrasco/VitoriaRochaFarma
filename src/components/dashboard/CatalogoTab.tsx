export function CatalogoTab({ setIsProdutoModalOpen }: { setIsProdutoModalOpen: (val: boolean) => void }) {
  return (
    <div className="fade-in">
      <div className="header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
        <div>
          <h2 className="page-title" style={{ color: 'var(--cor-roxo-escuro)', fontSize: 'clamp(1.8rem, 5vw, 2.2rem)', margin: 0, fontWeight: '900' }}>Catálogo de Materiais</h2>
          <p style={{ color: '#888', margin: '5px 0 0 0', fontSize: '1rem' }}>Gerencie seus e-books e flashcards interativos.</p>
        </div>
        <button onClick={() => setIsProdutoModalOpen(true)} className="btn-hover btn-mobile-full" style={{ backgroundColor: 'var(--cor-rosa)', color: 'white', border: 'none', padding: '16px 32px', borderRadius: '14px', fontWeight: '900', fontSize: '1.05rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 8px 25px rgba(200,93,161,0.3)' }}>
          <span style={{ fontSize: '1.5rem', lineHeight: 0 }}>+</span> Adicionar Produto
        </button>
      </div>
      
      <div className="glass-card" style={{ textAlign: 'center', padding: 'clamp(3rem, 8vw, 6rem) clamp(1rem, 4vw, 2rem)', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'linear-gradient(to bottom, #ffffff, #fdfbfd)' }}>
        <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '50%', marginBottom: '1.5rem', boxShadow: 'inset 0 4px 15px rgba(0,0,0,0.03)' }}>
          <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="var(--cor-roxo-escuro)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
        </div>
        
        <h3 style={{ color: 'var(--cor-roxo-escuro)', fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', margin: '0 0 0.8rem 0', fontWeight: '800' }}>Sua estante virtual está vazia!</h3>
        <p style={{ color: '#666', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 3rem auto', lineHeight: '1.6' }}>
          O conhecimento que você tem pode salvar a prova (e o semestre) de alguém. Cadastre seu primeiro material agora mesmo.
        </p>
        
        <div className="responsive-grid" style={{ width: '100%', maxWidth: '800px' }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #edf2f7', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 8px 20px rgba(0,0,0,0.03)' }}>
            <span style={{ fontSize: '2.5rem' }}>📄</span>
            <div style={{ textAlign: 'left' }}><strong style={{ color: 'var(--cor-roxo-escuro)', display: 'block', fontSize: '1.1rem', marginBottom: '4px' }}>E-books</strong><span style={{ fontSize: '0.9rem', color: '#888'}}>Guias e Manuais PDF</span></div>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #edf2f7', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 8px 20px rgba(0,0,0,0.03)' }}>
            <span style={{ fontSize: '2.5rem' }}>🎯</span>
            <div style={{ textAlign: 'left' }}><strong style={{ color: 'var(--cor-roxo-escuro)', display: 'block', fontSize: '1.1rem', marginBottom: '4px' }}>Flashcards</strong><span style={{ fontSize: '0.9rem', color: '#888' }}>Com imagens interativas</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}