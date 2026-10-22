import { useNavigate } from 'react-router-dom';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  produto: {
    id: string;
    titulo: string;
    descricao: string;
    precoAtual: string;
    emoji: string;
  } | null;
}

export function CheckoutModal({ isOpen, onClose, produto }: CheckoutModalProps) {
  const navigate = useNavigate();

  if (!isOpen || !produto) return null;

  const handleIrParaCheckout = () => {
    onClose();
    // Redireciona para a página de checkout passando o ID do produto selecionado
    navigate(`/checkout?produto=${produto.id}`);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 10, 20, 0.7)',
      backdropFilter: 'blur(5px)',
      zIndex: 99999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1rem',
      animation: 'fadeIn 0.3s'
    }}>
      <div style={{
        backgroundColor: 'white',
        width: '100%',
        maxWidth: '480px',
        borderRadius: '24px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        padding: '2rem',
        textAlign: 'left',
        position: 'relative'
      }}>
        {/* Botão de Fechar */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#f8fafc',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            fontSize: '1.1rem',
            cursor: 'pointer',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}
        >
          ✕
        </button>

        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          {produto.emoji || '📘'}
        </div>

        <span style={{ 
          backgroundColor: '#fdf2f8', 
          color: 'var(--cor-rosa, #c85da1)', 
          padding: '4px 12px', 
          borderRadius: '20px', 
          fontSize: '0.75rem', 
          fontWeight: '900', 
          width: 'fit-content',
          marginBottom: '0.8rem',
          textTransform: 'uppercase'
        }}>
          Resumo do Pedido
        </span>

        <h3 style={{ color: 'var(--cor-roxo-escuro, #422850)', fontSize: '1.4rem', marginBottom: '0.5rem', fontWeight: '900' }}>
          {produto.titulo}
        </h3>
        
        <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
          {produto.descricao}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '14px 16px', backgroundColor: '#f8fafc', borderRadius: '14px', border: '1px solid #edf2f7' }}>
          <span style={{ fontSize: '0.95rem', color: '#666', fontWeight: 'bold' }}>Valor Total:</span>
          <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--cor-rosa, #c85da1)' }}>{produto.precoAtual}</span>
        </div>

        <button 
          onClick={handleIrParaCheckout}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: 'var(--cor-rosa, #c85da1)',
            color: 'white',
            border: 'none',
            borderRadius: '14px',
            fontWeight: '900',
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(200,93,161,0.3)',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          Continuar para o Pagamento ➔
        </button>
      </div>
    </div>
  );
}