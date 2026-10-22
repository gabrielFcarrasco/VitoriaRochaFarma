import { useState } from 'react';

interface PaymentFormProps {
  produtoId?: string;
}

export function PaymentForm({ produtoId }: PaymentFormProps) {
  const [metodoPagamento, setMetodoPagamento] = useState<'pix' | 'cartao'>('pix');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ nome: '', email: '', cpf: '', cartao: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulação de integração com Gateway (Mercado Pago / InfinitePay) para o produtoId
    setTimeout(() => {
      alert(`Processando pagamento via ${metodoPagamento.toUpperCase()} para o produto [ID: ${produtoId}] e e-mail: ${formData.email}`);
      setLoading(false);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 15px 35px rgba(0,0,0,0.06)', border: '1px solid #edf2f7' }}>
      <h3 style={{ color: 'var(--cor-roxo-escuro, #422850)', fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: '800' }}>
        📋 Dados de Identificação & Pagamento
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '4px', color: '#4a5568' }}>Nome Completo</label>
          <input type="text" name="nome" required placeholder="Seu nome completo" value={formData.nome} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '4px', color: '#4a5568' }}>E-mail (para envio do acesso)</label>
          <input type="email" name="email" required placeholder="seu.email@exemplo.com" value={formData.email} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '4px', color: '#4a5568' }}>CPF / CNPJ</label>
          <input type="text" name="cpf" required placeholder="000.000.000-00" value={formData.cpf} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
        </div>
      </div>

      {/* Seleção de Método de Pagamento */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button 
          type="button" 
          onClick={() => setMetodoPagamento('pix')} 
          style={{ flex: 1, padding: '12px', borderRadius: '10px', border: metodoPagamento === 'pix' ? '2px solid var(--cor-rosa, #c85da1)' : '1px solid #cbd5e1', backgroundColor: metodoPagamento === 'pix' ? '#fdf2f8' : 'white', fontWeight: 'bold', cursor: 'pointer', color: 'var(--cor-roxo-escuro, #422850)' }}
        >
          ⚡ PIX (Aprovação Imediata)
        </button>
        <button 
          type="button" 
          onClick={() => setMetodoPagamento('cartao')} 
          style={{ flex: 1, padding: '12px', borderRadius: '10px', border: metodoPagamento === 'cartao' ? '2px solid var(--cor-rosa, #c85da1)' : '1px solid #cbd5e1', backgroundColor: metodoPagamento === 'cartao' ? '#fdf2f8' : 'white', fontWeight: 'bold', cursor: 'pointer', color: 'var(--cor-roxo-escuro, #422850)' }}
        >
          💳 Cartão de Crédito
        </button>
      </div>

      {metodoPagamento === 'cartao' && (
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '4px', color: '#4a5568' }}>Número do Cartão</label>
          <input type="text" name="cartao" placeholder="4000 0000 0000 0000" value={formData.cartao} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
        </div>
      )}

      <button 
        type="submit" 
        disabled={loading}
        style={{ 
          width: '100%', 
          padding: '16px', 
          backgroundColor: 'var(--cor-rosa, #c85da1)', 
          color: 'white', 
          border: 'none', 
          borderRadius: '12px', 
          fontWeight: '900', 
          fontSize: '1rem', 
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: '0 10px 20px rgba(200,93,161,0.3)',
          textTransform: 'uppercase'
        }}
      >
        {loading ? 'A processar pagamento...' : 'Finalizar Compra com Segurança'}
      </button>
    </form>
  );
}