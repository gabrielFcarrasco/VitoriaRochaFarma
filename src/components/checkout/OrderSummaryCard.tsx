import React from 'react';

interface OrderSummaryProps {
  produtoNome: string;
  produtoDescricao: string;
  precoOriginal: string;
  precoAtual: string;
  emoji: string;
}

export function OrderSummaryCard({ produtoNome, produtoDescricao, precoOriginal, precoAtual, emoji }: OrderSummaryProps) {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '20px',
      boxShadow: '0 15px 35px rgba(0,0,0,0.06)',
      border: '1px solid #edf2f7',
      textAlign: 'left',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      <div style={{
        height: '180px',
        background: 'linear-gradient(135deg, var(--cor-lilas, #a288ab), var(--cor-roxo-escuro, #422850))',
        borderRadius: '12px',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <span style={{ fontSize: '4rem' }}>{emoji}</span>
      </div>

      <span style={{ 
        backgroundColor: 'var(--cor-rosa, #c85da1)', 
        color: 'white', 
        padding: '4px 12px', 
        borderRadius: '20px', 
        fontSize: '0.75rem', 
        fontWeight: '900', 
        width: 'fit-content',
        marginBottom: '0.8rem' 
      }}>
        ACESSO VITALÍCIO + SUPORTE
      </span>

      <h3 style={{ color: 'var(--cor-roxo-escuro, #422850)', fontSize: '1.3rem', marginBottom: '0.5rem', fontWeight: '800' }}>
        {produtoNome}
      </h3>
      
      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5', flex: 1 }}>
        {produtoDescricao}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
        <span style={{ fontSize: '0.95rem', color: '#a0aec0', textDecoration: 'line-through', fontWeight: 'bold' }}>{precoOriginal}</span>
        <span style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--cor-rosa, #c85da1)' }}>{precoAtual}</span>
      </div>

      <div style={{ fontSize: '0.8rem', color: '#888', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span>🔒 Pagamento 100% seguro e criptografado</span>
      </div>
    </div>
  );
}