import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export function AlunoLogin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLoginAluno = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você validará com Firebase Auth ou seu backend de alunos.
    // Por enquanto, salvamos uma flag de autenticação de aluno e redirecionamos:
    localStorage.setItem('alunoLogado', 'true');
    navigate('/aluno/estante');
  };

  return (
    <div style={{ 
      backgroundColor: 'var(--cor-creme, #fcfafc)', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '1.5rem' 
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '2.5rem', 
        borderRadius: '24px', 
        width: '100%', 
        maxWidth: '420px', 
        boxShadow: '0 15px 35px rgba(0,0,0,0.06)',
        border: '1px solid #edf2f7',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
        <h2 style={{ color: 'var(--cor-roxo-escuro, #422850)', fontSize: '1.6rem', fontWeight: '900', marginBottom: '0.5rem' }}>
          Área do Aluno
        </h2>
        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Entre com seu e-mail de compra para acessar seus materiais.
        </p>

        <form onSubmit={handleLoginAluno} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '800', color: 'var(--cor-roxo-escuro, #422850)', marginBottom: '8px', fontSize: '0.9rem' }}>
              E-mail de Acesso
            </label>
            <input 
              type="email" 
              required
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@exemplo.com"
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #edf2f7', outline: 'none', fontSize: '0.95rem' }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '800', color: 'var(--cor-roxo-escuro, #422850)', marginBottom: '8px', fontSize: '0.9rem' }}>
              Senha / Código de Acesso
            </label>
            <input 
              type="password" 
              required
              value={senha} 
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #edf2f7', outline: 'none', fontSize: '0.95rem' }} 
            />
          </div>

          <button 
            type="submit"
            style={{ 
              marginTop: '1rem',
              width: '100%', 
              padding: '16px', 
              backgroundColor: 'var(--cor-rosa, #c85da1)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '12px', 
              fontWeight: '900', 
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(200,93,161,0.3)',
              textTransform: 'uppercase'
            }}
          >
            Entrar na Estante
          </button>
        </form>

        <div style={{ marginTop: '2rem', borderTop: '1px solid #edf2f7', paddingTop: '1.5rem' }}>
          <Link to="/" style={{ color: '#888', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600' }}>
            ← Voltar para a Página Principal
          </Link>
        </div>
      </div>
    </div>
  );
}