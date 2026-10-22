import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { produtoService } from '../services/produtoService';
import { OrderSummaryCard } from '../components/checkout/OrderSummaryCard';
import { PaymentForm } from '../components/checkout/PaymentForm';

export function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const produtoId = searchParams.get('produto') || 'exemplo-1';
  
  const [produto, setProduto] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const dados = await produtoService.getProdutoPorId(produtoId);
        setProduto(dados);
      } catch (error) {
        console.error("Erro ao carregar produto para o checkout:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, [produtoId]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem', color: 'var(--cor-roxo-escuro, #422850)', fontWeight: 'bold' }}>
        A carregar o ambiente de pagamento seguro...
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--cor-creme, #fcfafc)', minHeight: '100vh', padding: 'clamp(2rem, 5vw, 5rem) 1.5rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ color: 'var(--cor-roxo-escuro, #422850)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: '900', marginBottom: '0.5rem' }}>
          Finalize a sua Compra
        </h1>
        <p style={{ color: '#666', fontSize: '1rem' }}>
          Ambiente criptografado. Acesso liberado imediatamente após a confirmação.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <OrderSummaryCard 
          produtoNome={produto?.titulo}
          produtoDescricao={produto?.descricao}
          precoOriginal={produto?.precoOriginal}
          precoAtual={produto?.precoAtual}
          emoji={produto?.emoji || '📘'}
        />
        <PaymentForm produtoId={produto?.id} />
      </div>
    </div>
  );
}