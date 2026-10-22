import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { autorService } from '../config/autorService';
import type { AutorInfo } from '../config/autorService';
import { Chatbot } from '../components/Chatbot';
import { TEXTOS_PADRAO } from '../components/dashboard/TextosHomeTab';

interface AutorInfoHome extends AutorInfo, Partial<typeof TEXTOS_PADRAO> {}

export function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [autorData, setAutorData] = useState<AutorInfoHome | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Busca os dados do BD
  useEffect(() => {
    const buscarDados = async () => {
      try {
        const dados = await autorService.getAutorInfo();
        if (dados) {
          setAutorData(dados);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
      }
    };
    buscarDados();
  }, []);

  // 2. Olheiro de Rolagem
  useEffect(() => {
    if (isLoading) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [isLoading]);

  const especialidadesPadrao = ['Farmácia Clínica', 'Prescrição Farmacêutica', 'Saúde Mental & Pública'];
  const especialidadesExibidas = autorData?.especialidades?.length ? autorData.especialidades : especialidadesPadrao;

  // Função auxiliar para recuperar valor do banco ou padrão
  const val = (key: keyof typeof TEXTOS_PADRAO) => 
    autorData?.[key] !== undefined && autorData?.[key] !== '' ? autorData[key] : (TEXTOS_PADRAO as any)[key];

  // 🌟 FUNÇÃO MÁGICA: Transforma **qualquer trecho entre asteriscos** em texto destacado com a cor secundária (sem traços ou linhas)
  const renderizarTextoComDestaque = (texto: string) => {
    if (!texto) return null;
    const partes = texto.split(/(\*\*.*?\*\*)/g);
    return partes.map((parte, i) => {
      if (parte.startsWith('**') && parte.endsWith('**')) {
        const conteudo = parte.slice(2, -2);
        return <strong key={i} style={{ color: 'var(--cor-rosa)', fontWeight: '900' }}>{conteudo}</strong>;
      }
      return parte;
    });
  };

  // --- TELA DE LOADING ---
  if (isLoading) {
    return (
      <div style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
        backgroundColor: 'var(--cor-creme)', zIndex: 99999, 
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' 
      }}>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes spin-reverse { 0% { transform: rotate(360deg); } 100% { transform: rotate(0deg); } }
          @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.8; } }
        `}</style>
        <div style={{ position: 'relative', width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '4px solid rgba(200,93,161,0.15)', borderTopColor: 'var(--cor-rosa)', animation: 'spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite' }}></div>
          <div style={{ position: 'absolute', width: '65%', height: '65%', borderRadius: '50%', border: '4px solid rgba(66,40,80,0.15)', borderBottomColor: 'var(--cor-roxo-escuro)', animation: 'spin-reverse 1s cubic-bezier(0.5, 0, 0.5, 1) infinite' }}></div>
          <span style={{ fontSize: '1.8rem', animation: 'pulse 1.5s infinite' }}>💊</span>
        </div>
        <h2 style={{ 
          color: 'var(--cor-roxo-escuro)', marginTop: '2rem', fontSize: '1.1rem', 
          fontWeight: '900', letterSpacing: '3px', textTransform: 'uppercase', 
          animation: 'pulse 1.5s infinite', textAlign: 'center'
        }}>
          Preparando a dose...
        </h2>
      </div>
    );
  }

  const themeStyles = {
    '--cor-roxo-escuro': val('corPrimaria'),
    '--cor-rosa': val('corSecundaria'),
    '--cor-lilas': val('corTerciaria'),
    '--cor-creme': val('corFundo'),
    '--cor-texto-escuro': val('corTexto'),
    backgroundColor: 'var(--cor-creme)', 
    minHeight: '100vh', 
    overflowX: 'hidden',
    fontFamily: val('fontFamily') as string
  } as React.CSSProperties;

  return (
    <div style={themeStyles}>
      
      {/* 1. HEADER & NAVEGAÇÃO */}
      <header style={{ 
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '1rem clamp(1.5rem, 5vw, 5%)', backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 2px 15px rgba(0,0,0,0.05)'
      }}>
        {autorData?.logoUrl ? (
          <img src={autorData.logoUrl} alt="Logo do Site" style={{ maxHeight: '45px', objectFit: 'contain' }} />
        ) : (
          <h2 style={{ color: 'var(--cor-roxo-escuro)', margin: 0, fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', fontWeight: '900', letterSpacing: '-0.5px' }}>
            {autorData?.nome ? autorData.nome.split(' ')[0].toUpperCase() : 'VR'} FARMA
          </h2>
        )}

        <nav className="desktop-menu">
          {!autorData?.esconderBeneficios && <a href="#beneficios" style={{ color: 'var(--cor-texto-escuro)', textDecoration: 'none', fontWeight: '600' }}>O Método</a>}
          {!autorData?.esconderPublico && <a href="#publico" style={{ color: 'var(--cor-texto-escuro)', textDecoration: 'none', fontWeight: '600' }}>Para Quem É?</a>}
          {!autorData?.esconderCatalogo && <a href="#premium" style={{ color: 'var(--cor-texto-escuro)', textDecoration: 'none', fontWeight: '600' }}>Catálogo</a>}
          <Link to="/login" style={{ color: 'var(--cor-lilas)', textDecoration: 'none', fontWeight: '800' }}>Área do Aluno</Link>
        </nav>

        <button 
          className="mobile-menu-btn" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ background: 'none', border: 'none', fontSize: '1.8rem', color: 'var(--cor-roxo-escuro)', cursor: 'pointer', padding: '5px' }}
        >
          {isMenuOpen ? '✖' : '☰'}
        </button>

        <nav className={`mobile-menu ${isMenuOpen ? 'open' : ''}`} style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', padding: '1rem', display: isMenuOpen ? 'flex' : 'none', flexDirection: 'column', gap: '0.5rem', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
          {!autorData?.esconderBeneficios && <a href="#beneficios" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--cor-texto-escuro)', textDecoration: 'none', fontWeight: '600', padding: '12px 15px', borderBottom: '1px solid #edf2f7', borderRadius: '8px' }}>O Método</a>}
          {!autorData?.esconderPublico && <a href="#publico" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--cor-texto-escuro)', textDecoration: 'none', fontWeight: '600', padding: '12px 15px', borderBottom: '1px solid #edf2f7', borderRadius: '8px' }}>Para Quem É?</a>}
          {!autorData?.esconderCatalogo && <a href="#premium" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--cor-texto-escuro)', textDecoration: 'none', fontWeight: '600', padding: '12px 15px', borderBottom: '1px solid #edf2f7', borderRadius: '8px' }}>Catálogo</a>}
          <Link to="/login" style={{ color: 'var(--cor-rosa)', textDecoration: 'none', fontWeight: '800', padding: '12px 15px', backgroundColor: '#fcfafc', borderRadius: '8px', textAlign: 'center', marginTop: '10px' }}>Área do Aluno</Link>
        </nav>
      </header>

      {/* 2. HERO SECTION */}
      <section className="hero-section" style={{ 
        textAlign: 'center', padding: 'clamp(4rem, 10vw, 7rem) clamp(1rem, 5vw, 2rem)', 
        backgroundColor: val('heroBgColor') as string, color: 'var(--cor-branco)',
        borderBottomLeftRadius: 'clamp(20px, 5vw, 40px)', borderBottomRightRadius: 'clamp(20px, 5vw, 40px)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, var(--cor-lilas) 0%, transparent 70%)', opacity: 0.3, filter: 'blur(40px)' }}></div>
        
        <svg className="floating-icon icon-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.5 20.5a7 7 0 1 1-9-9l9.5-9.5a7 7 0 0 1 9 9Z"></path>
          <path d="m14 3.5 6.5 6.5"></path>
        </svg>
        <svg className="floating-icon icon-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
        <svg className="floating-icon icon-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M3 12a9 9 0 1 0 18 0 9 9 0 1 0-18 0"></path>
          <path d="M12 3v18"></path>
          <path d="M3 12h18"></path>
        </svg>
        <svg className="floating-icon icon-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="2" x2="12" y2="22"></line>
        </svg>

        <span className="reveal-on-scroll delay-1" style={{ position: 'relative', zIndex: 2, backgroundColor: 'var(--cor-rosa)', padding: '8px 20px', borderRadius: '30px', fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', display: 'inline-block', marginBottom: '1rem' }}>
          {renderizarTextoComDestaque(val('heroExtraText') as string)}
        </span>
        <h1 className="reveal-on-scroll delay-2" style={{ position: 'relative', zIndex: 2, fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', margin: '0.5rem auto 1.5rem', maxWidth: '900px', lineHeight: '1.15', fontWeight: '900' }}>
          {renderizarTextoComDestaque(val('heroTitle') as string)}
        </h1>
        <p className="reveal-on-scroll delay-3" style={{ position: 'relative', zIndex: 2, fontSize: 'clamp(1.05rem, 3vw, 1.25rem)', color: '#e0d4e5', maxWidth: '750px', margin: '0 auto 2.5rem', lineHeight: '1.6' }}>
          {renderizarTextoComDestaque(val('heroSubtitle') as string)}
        </p>
        <div className="reveal-on-scroll delay-4" style={{ position: 'relative', zIndex: 2 }}>
          <a href="#premium" className="btn-hover" style={{ 
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--cor-rosa)', color: 'var(--cor-branco)', 
            padding: '16px 32px', borderRadius: '14px', textDecoration: 'none', fontWeight: '900', fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
            boxShadow: '0 10px 25px rgba(200,93,161,0.4)', textTransform: 'uppercase', width: '100%', maxWidth: '350px'
          }}>
            {renderizarTextoComDestaque(val('heroButton') as string)}
          </a>
        </div>
      </section>

      {/* 3. BENEFÍCIOS (O MÉTODO) - Ocultável */}
      {!autorData?.esconderBeneficios && (
        <section id="beneficios" style={{ backgroundColor: val('beneficiosBgColor') as string, padding: 'clamp(4rem, 8vw, 6rem) clamp(1.5rem, 5vw, 5%)', textAlign: 'center' }}>
          <h2 className="reveal-on-scroll" style={{ color: 'var(--cor-roxo-escuro)', fontSize: 'clamp(2rem, 5vw, 2.4rem)', marginBottom: '1rem', fontWeight: '900' }}>
            {renderizarTextoComDestaque(val('beneficiosTitle') as string)}
          </h2>
          <p className="reveal-on-scroll delay-1" style={{ color: '#666', marginBottom: 'clamp(2.5rem, 6vw, 4rem)', fontSize: 'clamp(1rem, 2.5vw, 1.1rem)', maxWidth: '650px', margin: '0 auto clamp(2.5rem, 6vw, 4rem)', lineHeight: '1.6' }}>
            {renderizarTextoComDestaque(val('beneficiosSubtitle') as string)}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            
            {/* CARD 1 */}
            <div className="card-hover reveal-on-scroll delay-1" style={{ backgroundColor: 'var(--cor-branco)', padding: '2.5rem 2rem', borderRadius: '16px', borderTop: '5px solid var(--cor-rosa)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', textAlign: 'left' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>{val('beneficiosEmoji1') || '🧠'}</div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--cor-roxo-escuro)', fontWeight: '800', textAlign: 'center' }}>
                {renderizarTextoComDestaque(val('beneficiosCardTitle1') as string)}
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6', fontSize: '0.95rem' }}>
                {renderizarTextoComDestaque(val('beneficiosCardDesc1') as string)}
              </p>
            </div>
            
            {/* CARD 2 */}
            <div className="card-hover reveal-on-scroll delay-2" style={{ backgroundColor: 'var(--cor-branco)', padding: '2.5rem 2rem', borderRadius: '16px', borderTop: '5px solid var(--cor-lilas)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', textAlign: 'left' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>{val('beneficiosEmoji2') || '⚖️'}</div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--cor-roxo-escuro)', fontWeight: '800', textAlign: 'center' }}>
                {renderizarTextoComDestaque(val('beneficiosCardTitle2') as string)}
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6', fontSize: '0.95rem' }}>
                {renderizarTextoComDestaque(val('beneficiosCardDesc2') as string)}
              </p>
            </div>

            {/* CARD 3 */}
            <div className="card-hover reveal-on-scroll delay-3" style={{ backgroundColor: 'var(--cor-branco)', padding: '2.5rem 2rem', borderRadius: '16px', borderTop: '5px solid var(--cor-roxo-escuro)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', textAlign: 'left' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>{val('beneficiosEmoji3') || '📱'}</div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--cor-roxo-escuro)', fontWeight: '800', textAlign: 'center' }}>
                {renderizarTextoComDestaque(val('beneficiosCardTitle3') as string)}
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6', fontSize: '0.95rem' }}>
                {renderizarTextoComDestaque(val('beneficiosCardDesc3') as string)}
              </p>
            </div>

          </div>
        </section>
      )}

      {/* 🌟 BLOCOS EXTRAS CRIADOS NO PAINEL */}
      {((autorData?.blocosExtras as Array<any>) || []).map((bloco) => (
        <section key={bloco.id} style={{ padding: 'clamp(4rem, 8vw, 6rem) clamp(1.5rem, 5vw, 5%)', backgroundColor: 'var(--cor-branco)', textAlign: 'center', borderTop: '1px solid #edf2f7' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{bloco.emoji}</div>
          <h2 style={{ color: 'var(--cor-roxo-escuro)', fontSize: 'clamp(2rem, 5vw, 2.4rem)', marginBottom: '1rem', fontWeight: '900' }}>
            {renderizarTextoComDestaque(bloco.titulo)}
          </h2>
          <p style={{ color: '#666', fontSize: 'clamp(1rem, 2.5vw, 1.1rem)', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
            {renderizarTextoComDestaque(bloco.texto)}
          </p>
        </section>
      ))}

      {/* 3.5 PARALLAX (PÚBLICO) - Ocultável */}
      {!autorData?.esconderPublico && (
        <section id="publico" className="parallax-bg" style={{ backgroundColor: val('publicoBgColor') as string, padding: 'clamp(4rem, 8vw, 6rem) clamp(1.5rem, 5vw, 5%)', borderTop: '1px solid #edf2f7', borderBottom: '1px solid #edf2f7', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(252, 250, 252, 0.92)' }}></div>

          <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
            <h2 className="reveal-on-scroll" style={{ color: 'var(--cor-roxo-escuro)', fontSize: 'clamp(1.8rem, 5vw, 2.2rem)', marginBottom: '1.5rem', fontWeight: '900' }}>
              {renderizarTextoComDestaque(val('publicoTitle') as string)}
            </h2>
            <p className="reveal-on-scroll delay-1" style={{ color: '#666', fontSize: 'clamp(1.0rem, 2.5vw, 1.1rem)', lineHeight: '1.7', marginBottom: 'clamp(2rem, 5vw, 3rem)' }}>
              {renderizarTextoComDestaque(val('publicoSubtitle') as string)}
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
              <div className="reveal-on-scroll delay-1" style={{ backgroundColor: 'white', padding: '1.8rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                <div style={{ color: 'var(--cor-rosa)', fontWeight: '900', fontSize: '1.15rem', marginBottom: '0.5rem' }}>01. Estudantes da Saúde</div>
                <p style={{ color: '#555', lineHeight: '1.6', fontSize: '0.95rem', margin: 0 }}>Farmácia, Medicina e Enfermagem focados em dominar psicofármacos.</p>
              </div>
              
              <div className="reveal-on-scroll delay-2" style={{ backgroundColor: 'white', padding: '1.8rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                <div style={{ color: 'var(--cor-lilas)', fontWeight: '900', fontSize: '1.15rem', marginBottom: '0.5rem' }}>02. Residentes & Concurseiros</div>
                <p style={{ color: '#555', lineHeight: '1.6', fontSize: '0.95rem', margin: 0 }}>Revisões ágeis e mapas mentais para provas e concursos públicos.</p>
              </div>

              <div className="reveal-on-scroll delay-3" style={{ backgroundColor: 'white', padding: '1.8rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                <div style={{ color: 'var(--cor-roxo-escuro)', fontWeight: '900', fontSize: '1.15rem', marginBottom: '0.5rem' }}>03. Profissionais Clínicos</div>
                <p style={{ color: '#555', lineHeight: '1.6', fontSize: '0.95rem', margin: 0 }}>Suporte confiável para orientação farmacêutica e manejo em saúde mental.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. ISCA DIGITAL - Ocultável */}
      {!autorData?.esconderIsca && (
        <section id="gratuitos" style={{ padding: 'clamp(4rem, 8vw, 6rem) clamp(1.5rem, 5vw, 5%)', backgroundColor: val('iscaBgColor') as string, color: 'var(--cor-branco)', textAlign: 'center' }}>
          <h2 className="reveal-on-scroll" style={{ fontSize: 'clamp(2rem, 5vw, 2.4rem)', marginBottom: '1rem', fontWeight: '900' }}>
            {renderizarTextoComDestaque(val('iscaTitle') as string)}
          </h2>
          <p className="reveal-on-scroll delay-1" style={{ marginBottom: 'clamp(2rem, 5vw, 3rem)', fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', opacity: 0.9, maxWidth: '650px', margin: '0 auto clamp(2rem, 5vw, 3rem)', lineHeight: '1.6' }}>
            {renderizarTextoComDestaque(val('iscaSubtitle') as string)}
          </p>
          
          <div className="reveal-on-scroll delay-2" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="card-hover" style={{ backgroundColor: 'var(--cor-branco)', padding: '1.5rem', borderRadius: '16px', width: '100%', maxWidth: '350px', color: 'var(--cor-texto-escuro)', textAlign: 'left' }}>
              <div style={{ height: '160px', background: 'linear-gradient(135deg, #fdfbfd, #f4eef7)', borderRadius: '10px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #eee' }}>
                <span style={{ fontSize: '3rem', opacity: 0.8 }}>{val('iscaEmoji') || '🧠'}</span>
              </div>
              <h3 style={{ color: 'var(--cor-roxo-escuro)', marginBottom: '0.5rem', fontSize: '1.2rem', fontWeight: '800' }}>
                {renderizarTextoComDestaque(val('iscaCardTitle') as string)}
              </h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', color: '#888', lineHeight: '1.5' }}>
                {renderizarTextoComDestaque(val('iscaCardDesc') as string)}
              </p>
              <button className="btn-hover" style={{ width: '100%', padding: '14px', backgroundColor: 'transparent', color: 'var(--cor-roxo-escuro)', border: '2px solid var(--cor-roxo-escuro)', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', textTransform: 'uppercase', fontSize: '0.95rem' }}>
                {renderizarTextoComDestaque(val('iscaButtonText') as string)}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 5. VITRINE PREMIUM - Ocultável */}
      {!autorData?.esconderCatalogo && (
        <section id="premium" style={{ padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 5vw, 5%)', textAlign: 'center', backgroundColor: val('catalogoBgColor') as string }}>
          <h2 className="reveal-on-scroll" style={{ color: 'var(--cor-roxo-escuro)', fontSize: 'clamp(2rem, 6vw, 2.6rem)', marginBottom: '0.5rem', fontWeight: '900' }}>
            {renderizarTextoComDestaque(val('catalogoTitle') as string)}
          </h2>
          <p className="reveal-on-scroll delay-1" style={{ color: '#666', marginBottom: 'clamp(2.5rem, 6vw, 4rem)', fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', maxWidth: '700px', margin: '0 auto clamp(2.5rem, 6vw, 4rem)', lineHeight: '1.6' }}>
            {renderizarTextoComDestaque(val('catalogoSubtitle') as string)}
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 340px))', gap: '2rem', justifyContent: 'center' }}>
            <div className="card-hover reveal-on-scroll delay-1" style={{ backgroundColor: 'var(--cor-branco)', padding: '1.5rem', borderRadius: '20px', width: '100%', boxShadow: '0 15px 35px rgba(0,0,0,0.06)', position: 'relative', textAlign: 'left', border: '1px solid #edf2f7', display: 'flex', flexDirection: 'column' }}>
              <span style={{ position: 'absolute', top: '-12px', right: '20px', backgroundColor: 'var(--cor-rosa)', color: 'var(--cor-branco)', padding: '6px 16px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '900', boxShadow: '0 4px 10px rgba(200,93,161,0.3)' }}>
                🔥 DESTAQUE
              </span>
              <div style={{ height: '200px', background: 'linear-gradient(135deg, var(--cor-lilas), var(--cor-roxo-escuro))', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
                <span style={{ fontSize: '4rem', position: 'relative', zIndex: 1, filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.2))' }}>📘</span>
              </div>
              <h3 style={{ color: 'var(--cor-roxo-escuro)', fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '800' }}>E-book Psicofármacos na Prática</h3>
              <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1, lineHeight: '1.5' }}>Guia completo de antidepressivos, estabilizadores, antipsicóticos e manejo em saúde mental.</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.95rem', color: '#a0aec0', textDecoration: 'line-through', fontWeight: 'bold' }}>R$ 67,90</span>
                <span style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--cor-rosa)' }}>R$ 47,90</span>
              </div>
              <button className="btn-hover" style={{ width: '100%', padding: '16px', backgroundColor: 'var(--cor-roxo-escuro)', color: 'var(--cor-branco)', border: 'none', borderRadius: '14px', fontWeight: '800', fontSize: '1rem', cursor: 'pointer', textTransform: 'uppercase' }}>
                Comprar Material
              </button>
            </div>

            <div className="card-hover reveal-on-scroll delay-2" style={{ backgroundColor: 'var(--cor-branco)', padding: '1.5rem', borderRadius: '20px', width: '100%', boxShadow: '0 15px 35px rgba(0,0,0,0.06)', textAlign: 'left', border: '1px solid #edf2f7', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '200px', background: 'linear-gradient(135deg, #fdfbfd, #f4eef7)', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #edf2f7' }}>
                <span style={{ fontSize: '4rem', filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.05))' }}>🎯</span>
              </div>
              <h3 style={{ color: 'var(--cor-roxo-escuro)', fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '800' }}>Flashcards de Saúde Mental</h3>
              <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1, lineHeight: '1.5' }}>Estudo ativo comprovado pela neurociência para fixar doses, reações e mecanismos de ação.</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '1.5rem', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--cor-rosa)' }}>R$ 29,90</span>
              </div>
              <button className="btn-hover" style={{ width: '100%', padding: '16px', backgroundColor: 'var(--cor-roxo-escuro)', color: 'var(--cor-branco)', border: 'none', borderRadius: '14px', fontWeight: '800', fontSize: '1rem', cursor: 'pointer', textTransform: 'uppercase' }}>
                Comprar Material
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 6. SOBRE A AUTORA */}
      <section className="author-section" style={{ padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 5vw, 5%)', backgroundColor: '#fcfafc', borderTop: '1px solid #edf2f7' }}>
        <div className="author-container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 'clamp(3rem, 6vw, 5rem)', maxWidth: '1100px', margin: '0 auto' }}>
          
          <div className="author-image-wrapper reveal-on-scroll" style={{ position: 'relative' }}>
            <a 
              href={`https://instagram.com/${(autorData?.instagramUrl || '_umafarmaceutica').replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hover insta-btn pulse-gentle"
              style={{ 
                position: 'absolute', bottom: '5px', right: '2px', backgroundColor: 'var(--cor-rosa)', color: 'var(--cor-branco)', 
                padding: '8px 18px', borderRadius: '30px', fontSize: '0.9rem', zIndex: 2, boxShadow: '0 10px 20px rgba(200,93,161,0.4)', 
                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap', maxWidth: 'calc(100% - 30px)'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              {autorData?.instagramUrl || '@_umafarmaceutica'}
            </a>

            <div className="author-image-circle" style={{ width: 'clamp(260px, 80vw, 340px)', height: 'clamp(260px, 80vw, 340px)', borderRadius: '50%', backgroundColor: 'var(--cor-lilas)', border: '8px solid var(--cor-creme)', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', position: 'relative', zIndex: 1, overflow: 'hidden' }}>
              <img 
                src={autorData?.imagemUrl || "https://gabrielfscarrasco.github.io/Img/IMG-20240223-WA0075.jpg"} 
                alt={`Foto de ${autorData?.nome || 'Vitória Rocha'}`} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>

          <div className="author-text-wrapper reveal-on-scroll delay-1" style={{ maxWidth: '550px', textAlign: 'left' }}>
            <span style={{ color: 'var(--cor-rosa)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>
              Por trás do método
            </span>
            <h2 style={{ color: 'var(--cor-roxo-escuro)', fontSize: 'clamp(2rem, 5vw, 2.5rem)', marginBottom: '1rem', fontWeight: '900' }}>
              Muito prazer, eu sou a Vitória!
            </h2>
            
            <p style={{ color: 'var(--cor-texto-escuro)', fontSize: 'clamp(1.05rem, 3vw, 1.2rem)', lineHeight: '1.6', marginBottom: '1.5rem', fontWeight: '600' }}>
              {renderizarTextoComDestaque(autorData?.textoIntro || 'Minha missão é traduzir a complexidade da psicofarmacologia em um aprendizado acessível, seguro e clínico para você.')}
            </p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '2rem' }}>
              {especialidadesExibidas.map((especialidade, index) => (
                <span key={index} style={{ backgroundColor: 'white', border: '1px solid #edf2f7', color: 'var(--cor-roxo-escuro)', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '800', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
                  {especialidade}
                </span>
              ))}
            </div>

            <p style={{ color: '#555', lineHeight: '1.8', marginBottom: '1.5rem', fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)' }}>
              {renderizarTextoComDestaque(autorData?.textoFormacao || 'Sou pós-graduada em Farmácia Clínica e Prescrição Farmacêutica, com foco em saúde mental e psicotrópicos. Aqui, compartilho conteúdos 100% confiáveis e esquematizados sobre o SNC.')}
            </p>

            <div style={{ backgroundColor: 'white', borderLeft: '4px solid var(--cor-rosa)', padding: '1.5rem', borderRadius: '0 12px 12px 0', marginTop: '2rem', boxShadow: '0 5px 15px rgba(0,0,0,0.02)' }}>
              <p style={{ color: '#555', lineHeight: '1.7', fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)', fontStyle: 'italic', margin: 0 }}>
                "{renderizarTextoComDestaque(autorData?.textoMissao || 'Além da ciência, sou apaixonada por transformar vidas através de um atendimento clínico humanizado e seguro em saúde mental.')}"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer style={{ backgroundColor: '#392B3B', color: 'var(--cor-creme)', textAlign: 'center', padding: 'clamp(3rem, 8vw, 4rem) clamp(1.5rem, 5vw, 2rem) 2rem' }}>
        <h3 className="reveal-on-scroll" style={{ marginBottom: '0.5rem', color: 'var(--cor-creme)', fontSize: 'clamp(1.3rem, 4vw, 1.5rem)', fontWeight: '900' }}>
          {autorData?.nome ? `Dra. ${autorData.nome}` : 'Dra. Vitória Rocha'}
        </h3>
        <p className="reveal-on-scroll" style={{ fontSize: '0.95rem', color: 'var(--cor-creme)', opacity: 0.8, marginBottom: '1.5rem', fontWeight: '600', letterSpacing: '1px' }}>
          CRF: 1-114126-7
        </p>
        <p className="reveal-on-scroll" style={{ fontSize: 'clamp(0.95rem, 3vw, 1rem)', color: '#aaa', marginBottom: '3rem', maxWidth: '400px', margin: '0 auto 3rem' }}>
          Farmacologia clínica e saúde mental estruturadas para o seu sucesso.
        </p>

        <div className="reveal-on-scroll delay-1" style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '3rem' }}>
          <a 
            href={`https://instagram.com/${(autorData?.instagramUrl || '_umafarmaceutica').replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="social-footer-btn"
            aria-label="Acessar Instagram"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          
          <a 
            href="https://www.linkedin.com/in/vit%C3%B3ria-rocha-8713b3207/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-footer-btn"
            aria-label="Acessar LinkedIn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
        </div>

        <div style={{ borderTop: '1px solid #503459', paddingTop: '2rem', fontSize: '0.85rem', color: '#888' }}>
          © {new Date().getFullYear()} Todos os direitos reservados.
        </div>
      </footer>

      <Chatbot />

      <style>{`
        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s cubic-bezier(0.5, 0, 0, 1), transform 0.8s cubic-bezier(0.5, 0, 0, 1);
        }
        .reveal-on-scroll.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .delay-1 { transition-delay: 0.1s; }
        .delay-2 { transition-delay: 0.2s; }
        .delay-3 { transition-delay: 0.3s; }
        .delay-4 { transition-delay: 0.4s; }

        .pulse-gentle {
          animation: pulse-soft 2.5s infinite ease-in-out;
        }
        @keyframes pulse-soft {
          0% { transform: scale(1); box-shadow: 0 10px 20px rgba(200,93,161,0.4); }
          50% { transform: scale(1.05); box-shadow: 0 15px 30px rgba(200,93,161,0.6); }
          100% { transform: scale(1); box-shadow: 0 10px 20px rgba(200,93,161,0.4); }
        }

        .social-footer-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.08);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          cursor: pointer;
          text-decoration: none;
        }
        .social-footer-btn:hover {
          background-color: var(--cor-rosa);
          border-color: var(--cor-rosa);
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(200,93,161,0.3);
        }

        .parallax-bg {
          background-image: radial-gradient(rgba(200, 93, 161, 0.15) 2px, transparent 2px);
          background-size: 30px 30px;
          background-attachment: fixed;
          background-position: center;
        }

        .floating-icon {
          position: absolute;
          color: rgba(255, 255, 255, 0.08);
          pointer-events: none;
          z-index: 1;
        }
        
        .icon-1 { width: 120px; top: 10%; left: 5%; animation: float-rotate 25s linear infinite; }
        .icon-2 { width: 180px; top: 50%; right: -5%; animation: float-rotate-reverse 30s linear infinite; }
        .icon-3 { width: 100px; bottom: 15%; left: 15%; animation: float-rotate 20s linear infinite; }
        .icon-4 { width: 140px; top: 20%; right: 15%; animation: float-rotate-reverse 22s linear infinite; }

        @keyframes float-rotate {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(180deg); }
          100% { transform: translateY(0) rotate(360deg); }
        }
        
        @keyframes float-rotate-reverse {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(40px) rotate(-180deg); }
          100% { transform: translateY(0) rotate(-360deg); }
        }

        @media (max-width: 768px) {
          .parallax-bg {
            background-attachment: scroll;
          }
          .mobile-menu.open {
            height: 100vh;
            background-color: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(10px);
            justify-content: flex-start;
            padding-top: 2rem;
          }
          .mobile-menu a {
            font-size: 1.2rem;
            text-align: center;
            padding: 15px !important;
          }
          .author-container {
            flex-direction: column;
            text-align: center;
          }
          .author-text-wrapper {
            text-align: center !important;
          }
          .author-text-wrapper .btn-hover,
          .author-text-wrapper span.uppercase {
            margin-left: auto;
            margin-right: auto;
          }
          .insta-btn {
            bottom: 5px !important;
            right: 2px !important;
            transform: none !important;
            white-space: nowrap;
          }
        }
      `}</style>
    </div>
  );
}