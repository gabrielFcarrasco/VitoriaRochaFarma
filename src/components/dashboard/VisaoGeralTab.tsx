import { useState, useEffect } from 'react';
import type { AutorInfo } from '../../config/autorService';
import versiculosData from '../../data/versiculos.json';
import dicasData from '../../data/dicas.json';

export function VisaoGeralTab({ autorData }: { autorData: AutorInfo }) {
  const [verseIndex, setVerseIndex] = useState(Math.floor(Math.random() * versiculosData.length));
  const [tipIndex, setTipIndex] = useState(Math.floor(Math.random() * dicasData.length));

  useEffect(() => {
    const interval = setInterval(() => {
      setVerseIndex(prev => (prev + 1) % versiculosData.length);
      setTipIndex(prev => (prev + 1) % dicasData.length);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const nextVerse = () => setVerseIndex(prev => (prev + 1) % versiculosData.length);
  const nextTip = () => setTipIndex(prev => (prev + 1) % dicasData.length);

  const getSaudacao = () => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) return 'Bom dia';
    if (hora >= 12 && hora < 19) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <div className="fade-in">
      <h1 className="page-title" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.4rem)', color: 'var(--cor-roxo-escuro)', marginBottom: '0.5rem', fontWeight: '900' }}>
        {getSaudacao()}, {autorData.nome ? autorData.nome.split(' ')[0] : 'Vitória'}! ✨
      </h1>
      <p style={{ color: '#666', fontSize: 'clamp(1rem, 3vw, 1.1rem)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
        Seu ecossistema está ganhando vida. Pronta para transformar o estudo de mais pessoas hoje? <span style={{fontSize: '0.9rem', color: '#a0aec0', display: 'inline-block'}}>(Eu já sou seu fã nº 1!)</span>
      </p>

      <div className="verse-card" style={{ paddingRight: 'clamp(1.5rem, 5vw, 3rem)' }}>
        <div className="verse-bg-icon">📖</div>
        <div key={verseIndex} className="swipe-slide">
          <div className="verse-quote">"{versiculosData[verseIndex].texto}"</div>
          <div className="verse-ref">- {versiculosData[verseIndex].ref}</div>
        </div>
        <button onClick={nextVerse} className="carousel-nav-btn" style={{ color: 'white' }} title="Próximo Versículo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
      
      <h3 style={{ color: 'var(--cor-roxo-escuro)', marginBottom: '1.2rem', fontSize: '1.4rem', fontWeight: '800' }}>Desempenho da Plataforma</h3>
      <div className="responsive-grid" style={{ marginBottom: '3.5rem' }}>
        <div className="stat-card" style={{ borderLeftColor: '#3498db' }}>
          <div style={{ fontSize: '2.8rem' }}>👁️</div>
          <div><h3 style={{ fontSize: '1.6rem', margin: 0, color: 'var(--cor-roxo-escuro)' }}>1.248</h3><p style={{ margin: 0, color: '#888', fontSize: '0.95rem', fontWeight: '600' }}>Visitas na Página</p></div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: 'var(--cor-rosa)' }}>
          <div style={{ fontSize: '2.8rem' }}>🛍️</div>
          <div><h3 style={{ fontSize: '1.6rem', margin: 0, color: 'var(--cor-roxo-escuro)' }}>42</h3><p style={{ margin: 0, color: '#888', fontSize: '0.95rem', fontWeight: '600' }}>Vendas Realizadas</p></div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: 'var(--cor-lilas)' }}>
          <div style={{ fontSize: '2.8rem' }}>🔥</div>
          <div><h3 style={{ fontSize: '1.6rem', margin: 0, color: 'var(--cor-roxo-escuro)' }}>3.4%</h3><p style={{ margin: 0, color: '#888', fontSize: '0.95rem', fontWeight: '600' }}>Taxa de Conversão</p></div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#2ecc71' }}>
          <div style={{ fontSize: '2.8rem' }}>💰</div>
          <div><h3 style={{ fontSize: '1.6rem', margin: 0, color: 'var(--cor-roxo-escuro)' }}>R$ 1.974</h3><p style={{ margin: 0, color: '#888', fontSize: '0.95rem', fontWeight: '600' }}>Receita Estimada</p></div>
        </div>
      </div>

      <div className="glass-card fade-in" style={{ padding: 'clamp(1.5rem, 4vw, 2rem) clamp(3.5rem, 6vw, 4rem) clamp(1.5rem, 4vw, 2rem) clamp(1.5rem, 4vw, 2.5rem)', borderLeft: '6px solid var(--cor-rosa)', position: 'relative' }}>
        <div key={tipIndex} className="swipe-slide">
          <h3 style={{ color: 'var(--cor-roxo-escuro)', marginBottom: '0.8rem', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '800' }}>
            {dicasData[tipIndex].icone} {dicasData[tipIndex].titulo}
          </h3>
          <p style={{ color: '#555', lineHeight: '1.7', fontSize: '1rem', margin: 0 }}>
            {dicasData[tipIndex].texto}
          </p>
        </div>
        <button onClick={nextTip} className="carousel-nav-btn" style={{ background: '#f1f5f9', color: 'var(--cor-roxo-escuro)', width: '40px', height: '40px', right: '15px' }} title="Próxima Dica">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    </div>
  );
}