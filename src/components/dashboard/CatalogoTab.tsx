import { useState, useEffect } from 'react';
import { autorService } from '../../config/autorService';
import type { Produto } from '../../config/autorService';

interface CatalogoTabProps {
  setIsProdutoModalOpen: (val: boolean) => void;
  produtos: Produto[];
  setProdutos: React.Dispatch<React.SetStateAction<Produto[]>>;
}

export function CatalogoTab({ setIsProdutoModalOpen }: CatalogoTabProps) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  // Busca os produtos reais salvos no banco ao carregar a aba
  useEffect(() => {
    async function carregarCatalogo() {
      try {
        const lista = await autorService.getProdutos();
        setProdutos(lista);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarCatalogo();
  }, []);

  const handleDeletar = async (id?: string) => {
    if (!id) return;
    if (confirm("Tem certeza que deseja remover este material do catálogo?")) {
      const sucesso = await autorService.deletarProduto(id);
      if (sucesso) {
        setProdutos(prev => prev.filter(p => p.id !== id));
      }
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--cor-roxo-escuro, #422850)', fontWeight: 'bold' }}>
        A carregar os seus materiais...
      </div>
    );
  }

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
      
      {produtos.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: 'clamp(3rem, 8vw, 6rem) clamp(1rem, 4vw, 2rem)', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'linear-gradient(to bottom, #ffffff, #fdfbfd)' }}>
          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '50%', marginBottom: '1.5rem', boxShadow: 'inset 0 4px 15px rgba(0,0,0,0.03)' }}>
            <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="var(--cor-roxo-escuro)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>
          
          <h3 style={{ color: 'var(--cor-roxo-escuro)', fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', margin: '0 0 0.8rem 0', fontWeight: '800' }}>Sua estante virtual está vazia![cite: 9]</h3>
          <p style={{ color: '#666', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 3rem auto', lineHeight: '1.6' }}>
            O conhecimento que você tem pode salvar a prova (e o semestre) de alguém. Cadastre seu primeiro material agora mesmo.[cite: 9]
          </p>
          
          <div className="responsive-grid" style={{ width: '100%', maxWidth: '800px' }}>
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #edf2f7', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 8px 20px rgba(0,0,0,0.03)' }}>
              <span style={{ fontSize: '2.5rem' }}>📄</span>
              <div style={{ textAlign: 'left' }}><strong style={{ color: 'var(--cor-roxo-escuro)', display: 'block', fontSize: '1.1rem', marginBottom: '4px' }}>E-books</strong><span style={{ fontSize: '0.9rem', color: '#888'}}>Guias e Manuais PDF[cite: 9]</span></div>
            </div>
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #edf2f7', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 8px 20px rgba(0,0,0,0.03)' }}>
              <span style={{ fontSize: '2.5rem' }}>🎯</span>
              <div style={{ textAlign: 'left' }}><strong style={{ color: 'var(--cor-roxo-escuro)', display: 'block', fontSize: '1.1rem', marginBottom: '4px' }}>Flashcards</strong><span style={{ fontSize: '0.9rem', color: '#888' }}>Com imagens interativas[cite: 9]</span></div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {produtos.map((prod) => (
            <div key={prod.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #edf2f7', position: 'relative', display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <button 
                onClick={() => handleDeletar(prod.id)}
                style={{ position: 'absolute', top: '15px', right: '15px', background: '#fee2e2', border: 'none', borderRadius: '50%', width: '32px', height: '32px', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Excluir produto"
              >
                🗑️
              </button>

              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{prod.emoji || '📘'}</div>
              <h3 style={{ color: 'var(--cor-roxo-escuro)', fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: '800' }}>{prod.titulo}</h3>
              <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1, lineHeight: '1.5' }}>{prod.descricao}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.85rem', color: '#888', fontWeight: 'bold' }}>Valor:</span>
                <span style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--cor-rosa)' }}>{prod.precoAtual}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}