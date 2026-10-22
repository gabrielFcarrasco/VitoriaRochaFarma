import { useState } from 'react';
import type { ChangeEvent } from 'react';
import type { AutorInfo } from '../../config/autorService';

export const TEXTOS_PADRAO = {
  corPrimaria: '#422850',   
  corSecundaria: '#c85da1', 
  corTerciaria: '#a288ab',  
  corFundo: '#fcfafc',      
  corTexto: '#2d3748',      

  heroExtraText: 'O universo da psicofarmacologia descomplicado',
  heroTitle: 'Domine a **Psicofarmacologia** e a **Saúde Mental** com clareza e segurança clínica.',
  heroSubtitle: 'Traduza mecanismos de ação complexos de **psicotrópicos e substâncias psicoativas** em mapas mentais, flashcards e resumos visuais de alto impacto.',
  heroButton: 'Explorar Materiais Clínicos',
  heroBgColor: '#422850', 
  
  beneficiosTitle: 'Por que o nosso método destrava o estudo de psicofármacos?',
  beneficiosSubtitle: 'Filtramos bulas e tratados densos para entregar um ecossistema focado na prática clínica, farmacocinética e manejo de reações adversas.',
  beneficiosBgColor: '#fcfafc',
  
  beneficiosEmoji1: '🧠',
  beneficiosCardTitle1: 'Neurotransmissores & Vias',
  beneficiosCardDesc1: 'Compreenda as vias sinápticas e receptores com clareza clínica e sem decoreba.',

  beneficiosEmoji2: '⚖️',
  beneficiosCardTitle2: 'Segurança Terapêutica',
  beneficiosCardDesc2: 'Foco em interações medicamentosas, perfis de reações adversas e condutas seguras.',

  beneficiosEmoji3: '📱',
  beneficiosCardTitle3: 'Praticidade Clínica',
  beneficiosCardDesc3: 'Material direto ao ponto para consultas rápidas na rotina de estudos ou atendimentos.',

  publicoTitle: 'Para quem este conteúdo foi desenvolvido?',
  publicoSubtitle: 'Com rigor técnico para profissionais e estudantes que lidam diretamente com a saúde mental e prescrição:',
  publicoBgColor: 'transparent',

  iscaTitle: 'Teste a nossa didática em Saúde Mental',
  iscaSubtitle: 'Baixe um guia prático gratuito sobre classes de psicofármacos e comprove a qualidade visual do conteúdo.',
  iscaCardTitle: 'Guia Prático: Psicotrópicos (PDF)',
  iscaCardDesc: 'Esquemas visuais rápidos sobre os principais antidepressivos, ansiolíticos e estabilizadores.',
  iscaButtonText: 'Baixar Material Grátis',
  iscaBgColor: '#a288ab',
  iscaEmoji: '🧠',

  catalogoTitle: 'Catálogo Especializado em Farmacologia Clínica',
  catalogoSubtitle: 'Ferramentas de estudo ativo focadas em psicofármacos, interações medicamentosas e conduta terapêutica.',
  catalogoBgColor: '#ffffff',

  fontFamily: 'Inter, sans-serif',

  esconderBeneficios: false,
  esconderPublico: false,
  esconderIsca: false,
  esconderCatalogo: false,
  blocosExtras: [] as Array<{ id: string, titulo: string, texto: string, emoji: string }>
};

const PALETA_BASE = ['#422850', '#c85da1', '#a288ab', '#fcfafc', '#2d3748', '#0f172a', '#3498db', '#10b981', '#f59e0b', '#ffffff', 'transparent'];

// Componente inteligente com seletor flutuante de cor nos asteriscos
function BlocoTextoEditavelInterativo({ label, name, value, onChange, rows = 2 }: {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  rows?: number;
}) {
  const [coresDestaquesPersonalizadas, setCoresDestaquesPersonalizadas] = useState<Record<string, string>>({});
  const [ativoMenuCorIndex, setAtivoMenuCorIndex] = useState<string | null>(null);

  const coresOpcoes = ['#000000', '#FFFFFF', '#c85da1', '#422850', '#3498db', '#10b981', '#f59e0b', '#e74c3c', '#9b59b6', '#e67e22'];

  if (!value) value = '';
  const partes = value.split(/(\*\*.*?\*\*)/g);

  const mudarCorTrecho = (trecho: string, novaCor: string) => {
    setCoresDestaquesPersonalizadas(prev => ({ ...prev, [trecho]: novaCor }));
    setAtivoMenuCorIndex(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ display: 'block', fontWeight: '800', marginBottom: '2px', fontSize: '0.9rem', color: 'var(--cor-roxo-escuro)' }}>
        {label}
      </label>
      
      <textarea 
        className="modern-input" 
        name={name} 
        value={value} 
        onChange={onChange} 
        rows={rows} 
        style={{ width: '100%', resize: 'vertical' }} 
      />

      <div style={{ padding: '10px 14px', backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #edf2f7', fontSize: '0.9rem' }}>
        <span style={{ color: '#888', display: 'block', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '4px' }}>
          ✨ Clique na palavra destacada (**exemplo**) para escolher a cor dela na hora:
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
          {partes.map((parte, i) => {
            if (parte.startsWith('**') && parte.endsWith('**')) {
              const conteudo = parte.slice(2, -2);
              const chaveUnica = `${i}-${conteudo}`;
              const corAplicada = coresDestaquesPersonalizadas[conteudo] || '#c85da1';
              const isOpen = ativoMenuCorIndex === chaveUnica;

              return (
                <span key={i} style={{ display: 'inline-block', position: 'relative', margin: '0 2px' }}>
                  <span style={{ color: '#cbd5e1', fontWeight: '400', userSelect: 'none' }}>**</span>
                  <strong 
                    onClick={() => setAtivoMenuCorIndex(isOpen ? null : chaveUnica)}
                    style={{ 
                      color: corAplicada, 
                      fontWeight: '900', 
                      cursor: 'pointer',
                      padding: '0 3px',
                      backgroundColor: 'rgba(200,93,161,0.08)',
                      borderRadius: '4px',
                      borderBottom: `2px dashed ${corAplicada}`
                    }}
                    title="Clique para escolher outra cor!"
                  >
                    {conteudo}
                  </strong>
                  <span style={{ color: '#cbd5e1', fontWeight: '400', userSelect: 'none' }}>**</span>

                  {isOpen && (
                    <div 
                      style={{
                        position: 'absolute', bottom: '130%', left: '50%', transform: 'translateX(-50%)',
                        backgroundColor: '#ffffff', padding: '10px', borderRadius: '12px',
                        boxShadow: '0 15px 30px rgba(0,0,0,0.25)', display: 'flex', gap: '8px',
                        flexWrap: 'wrap', width: '180px', zIndex: 99999, border: '1px solid #edf2f7'
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div style={{ width: '100%', fontSize: '0.7rem', fontWeight: 'bold', color: '#666', textAlign: 'center', marginBottom: '2px' }}>
                        Cores (Preto, Branco + 8):
                      </div>
                      {coresOpcoes.map((corHex, idx) => (
                        <div
                          key={idx}
                          onClick={() => mudarCorTrecho(conteudo, corHex)}
                          style={{
                            width: '26px', height: '26px', borderRadius: '50%', backgroundColor: corHex,
                            cursor: 'pointer', border: corHex === '#FFFFFF' ? '1px solid #ccc' : '2px solid white',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
                          }}
                        />
                      ))}
                    </div>
                  )}
                </span>
              );
            }
            return <span key={i}>{parte}</span>;
          })}
        </div>
      </div>
    </div>
  );
}

interface TextosHomeTabProps {
  autorData: AutorInfo & Partial<typeof TEXTOS_PADRAO>;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  isSaving: boolean;
  handleSalvarSobreMim: () => void;
}

export function TextosHomeTab({ autorData, handleChange, isSaving, handleSalvarSobreMim }: TextosHomeTabProps) {
  const [showPreview, setShowPreview] = useState(false);
  const getVal = (key: keyof typeof TEXTOS_PADRAO) => autorData[key] !== undefined && autorData[key] !== '' ? autorData[key] : (TEXTOS_PADRAO as any)[key];

  const renderizarTextoComDestaquePreview = (texto: string) => {
    if (!texto) return null;
    const partes = texto.split(/(\*\*.*?\*\*)/g);
    return partes.map((parte, i) => {
      if (parte.startsWith('**') && parte.endsWith('**')) {
        const conteudo = parte.slice(2, -2);
        return <strong key={i} style={{ color: getVal('corSecundaria') as string, fontWeight: '900' }}>{conteudo}</strong>;
      }
      return parte;
    });
  };

  const ColorPicker = ({ label, name, hint }: { label: string, name: keyof typeof TEXTOS_PADRAO, hint?: string }) => {
    const currentValue = getVal(name) as string;
    return (
      <div style={{ marginBottom: '1.2rem', backgroundColor: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid #edf2f7' }}>
        <label style={{ display: 'block', fontWeight: '800', color: 'var(--cor-roxo-escuro)', marginBottom: '6px', fontSize: '0.9rem' }}>{label}</label>
        {hint && <p style={{ fontSize: '0.75rem', color: '#888', marginTop: 0, marginBottom: '8px' }}>💡 {hint}</p>}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {PALETA_BASE.map((cor, idx) => (
            <div key={idx} onClick={() => handleChange({ target: { name, value: cor } } as any)} style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: cor === 'transparent' ? '#f0f0f0' : cor, cursor: 'pointer', border: currentValue === cor ? '3px solid #333' : '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {cor === 'transparent' && <span style={{fontSize: '10px', color: '#999'}}>T</span>}
            </div>
          ))}
          <input type="color" name={name} value={currentValue === 'transparent' ? '#ffffff' : currentValue} onChange={handleChange} style={{ width: '32px', height: '32px', padding: 0, border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
          <input type="text" name={name} value={currentValue} onChange={handleChange} className="modern-input" style={{ width: '95px', padding: '4px 8px', height: '32px', fontSize: '0.85rem', fontFamily: 'monospace' }} placeholder="#HEX" />
        </div>
      </div>
    );
  };

  const toggleVisibilidade = (campo: string) => {
    const atual = Boolean(autorData[campo as keyof typeof TEXTOS_PADRAO]);
    handleChange({ target: { name: campo, value: (!atual).toString() } } as any);
  };

  const adicionarNovoBloco = () => {
    const blocosAtuais = (autorData.blocosExtras as Array<any>) || [];
    const novoBloco = {
      id: Date.now().toString(),
      titulo: 'Novo Bloco Personalizado',
      texto: 'Escreva aqui o conteúdo incrível do seu novo bloco de destaque.',
      emoji: '⭐'
    };
    handleChange({ target: { name: 'blocosExtras', value: [...blocosAtuais, novoBloco] } } as any);
  };

  const removerBloco = (index: number) => {
    const blocosAtuais = [...((autorData.blocosExtras as Array<any>) || [])];
    blocosAtuais.splice(index, 1);
    handleChange({ target: { name: 'blocosExtras', value: blocosAtuais } } as any);
  };

  return (
    <div className="glass-card fade-in" style={{ position: 'relative', width: '100%', boxSizing: 'border-box' }}>
      
      <div className="header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #f4f6f9', paddingBottom: '1.5rem' }}>
        <div>
          <h2 className="page-title" style={{ color: 'var(--cor-roxo-escuro)', fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', margin: '0 0 0.4rem 0', fontWeight: '900' }}>Cores, Textos & Blocos da Home</h2>
          <p style={{ color: '#888', margin: 0, fontSize: '0.9rem' }}>Personalize textos, escolha cores de destaque, oculte seções ou adicione novos blocos personalizados.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', width: '100%', flexWrap: 'wrap' }}>
          <button type="button" onClick={() => setShowPreview(true)} className="btn-hover" style={{ flex: 1, minWidth: '130px', padding: '12px 16px', backgroundColor: '#f1f5f9', color: 'var(--cor-roxo-escuro)', borderRadius: '12px', fontWeight: '900', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>👁️ Ver Prévia</button>
          <button type="button" onClick={handleSalvarSobreMim} disabled={isSaving} className="btn-hover" style={{ flex: 1, minWidth: '130px', padding: '12px 16px', backgroundColor: 'var(--cor-rosa)', color: 'white', borderRadius: '12px', fontWeight: '900', border: 'none', cursor: isSaving ? 'not-allowed' : 'pointer', boxShadow: '0 8px 20px rgba(200,93,161,0.3)', fontSize: '0.9rem' }}>
            {isSaving ? 'A guardar...' : '💾 Publicar'}
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem' }}>
        <h3 style={{ color: 'var(--cor-roxo-escuro)', fontSize: '1.1rem', marginBottom: '1rem', fontWeight: '900' }}>
          🎛️ Controle de Seções e Criação de Conteúdo
        </h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <button type="button" onClick={() => toggleVisibilidade('esconderBeneficios')} style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: autorData.esconderBeneficios ? '#fee2e2' : '#f0fdf4', color: autorData.esconderBeneficios ? '#991b1b' : '#166534', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}>
            {autorData.esconderBeneficios ? '👁️ Exibir Seção "O Método"' : '🙈 Ocultar Seção "O Método"'}
          </button>
          <button type="button" onClick={() => toggleVisibilidade('esconderPublico')} style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: autorData.esconderPublico ? '#fee2e2' : '#f0fdf4', color: autorData.esconderPublico ? '#991b1b' : '#166534', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}>
            {autorData.esconderPublico ? '👁️ Exibir Seção "Para Quem É"' : '🙈 Ocultar Seção "Para Quem É"'}
          </button>
          <button type="button" onClick={() => toggleVisibilidade('esconderIsca')} style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: autorData.esconderIsca ? '#fee2e2' : '#f0fdf4', color: autorData.esconderIsca ? '#991b1b' : '#166534', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}>
            {autorData.esconderIsca ? '👁️ Exibir Seção "Guia Grátis"' : '🙈 Ocultar Seção "Guia Grátis"'}
          </button>
          <button type="button" onClick={() => toggleVisibilidade('esconderCatalogo')} style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: autorData.esconderCatalogo ? '#fee2e2' : '#f0fdf4', color: autorData.esconderCatalogo ? '#991b1b' : '#166534', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}>
            {autorData.esconderCatalogo ? '👁️ Exibir Seção "Catálogo"' : '🙈 Ocultar Seção "Catálogo"'}
          </button>
        </div>

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontWeight: '800', color: 'var(--cor-roxo-escuro)', fontSize: '0.95rem' }}>✨ Meus Blocos Extras Criados</span>
            <button type="button" onClick={adicionarNovoBloco} className="btn-hover" style={{ padding: '8px 16px', backgroundColor: 'var(--cor-rosa)', color: 'white', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>
              ➕ Criar Novo Bloco na Home
            </button>
          </div>

          {((autorData.blocosExtras as Array<any>) || []).map((bloco, index) => (
            <div key={bloco.id} style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input type="text" value={bloco.emoji} onChange={(e) => {
                  const blocos = [...(autorData.blocosExtras as Array<any>)];
                  blocos[index].emoji = e.target.value;
                  handleChange({ target: { name: 'blocosExtras', value: blocos } } as any);
                }} style={{ width: '50px', textAlign: 'center', fontSize: '1.2rem' }} className="modern-input" title="Emoji" />
                
                <input type="text" value={bloco.titulo} onChange={(e) => {
                  const blocos = [...(autorData.blocosExtras as Array<any>)];
                  blocos[index].titulo = e.target.value;
                  handleChange({ target: { name: 'blocosExtras', value: blocos } } as any);
                }} style={{ flex: 1, fontWeight: 'bold' }} className="modern-input" placeholder="Título do Bloco" />

                <button type="button" onClick={() => removerBloco(index)} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer' }}>🗑️ Excluir</button>
              </div>
              <textarea value={bloco.texto} onChange={(e) => {
                const blocos = [...(autorData.blocosExtras as Array<any>)];
                blocos[index].texto = e.target.value;
                handleChange({ target: { name: 'blocosExtras', value: blocos } } as any);
              }} rows={2} className="modern-input" placeholder="Conteúdo do bloco..." style={{ resize: 'vertical' }} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ backgroundColor: '#fcfafc', padding: '1.2rem', borderRadius: '16px', border: '1px solid #edf2f7' }}>
          <h3 style={{ color: 'var(--cor-roxo-escuro)', fontSize: '1.1rem', marginBottom: '1.2rem' }}>🎨 Identidade Visual (Cores & Fonte)</h3>
          <div className="responsive-grid">
            <ColorPicker label="Cor Primária" name="corPrimaria" />
            <ColorPicker label="Cor Secundária (Destaques)" name="corSecundaria" />
            <ColorPicker label="Cor Terciária" name="corTerciaria" />
            <ColorPicker label="Cor de Fundo do Site" name="corFundo" />
          </div>
          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'block', fontWeight: '800', color: 'var(--cor-roxo-escuro)', marginBottom: '8px', fontSize: '0.9rem' }}>Tipo de Letra (Fonte)</label>
            <select className="modern-input" name="fontFamily" value={getVal('fontFamily')} onChange={handleChange} style={{ width: '100%', maxWidth: '350px', fontFamily: getVal('fontFamily') as string }}>
              <option value="Inter, sans-serif">Inter (Moderna e Limpa)</option>
              <option value="'Poppins', sans-serif">Poppins (Arredondada e Amigável)</option>
              <option value="'Playfair Display', serif">Playfair Display (Elegante e Clássica)</option>
            </select>
          </div>
        </div>

        <div style={{ backgroundColor: '#fcfafc', padding: '1.2rem', borderRadius: '16px', border: '1px solid #edf2f7', borderLeft: `5px solid ${getVal('heroBgColor')}` }}>
          <h3 style={{ color: 'var(--cor-roxo-escuro)', fontSize: '1.1rem', marginBottom: '1.2rem' }}>🚀 Topo (Hero Section)</h3>
          <ColorPicker label="Cor de Fundo do Topo" name="heroBgColor" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div><label style={{ display: 'block', fontWeight: '800', marginBottom: '6px', fontSize: '0.9rem' }}>Legenda de Destaque</label><input type="text" className="modern-input" name="heroExtraText" value={getVal('heroExtraText')} onChange={handleChange} style={{ width: '100%' }} /></div>
            <BlocoTextoEditavelInterativo label="Título Principal" name="heroTitle" value={getVal('heroTitle') as string} onChange={handleChange} rows={2} />
            <BlocoTextoEditavelInterativo label="Subtítulo / Descrição" name="heroSubtitle" value={getVal('heroSubtitle') as string} onChange={handleChange} rows={3} />
            <div><label style={{ display: 'block', fontWeight: '800', marginBottom: '6px', fontSize: '0.9rem' }}>Texto do Botão</label><input type="text" className="modern-input" name="heroButton" value={getVal('heroButton')} onChange={handleChange} style={{ width: '100%' }} /></div>
          </div>
        </div>

        {/* SECÇÃO O MÉTODO & CARDS EDITÁVEIS */}
        <div style={{ backgroundColor: '#fcfafc', padding: '1.2rem', borderRadius: '16px', border: '1px solid #edf2f7' }}>
          <h3 style={{ color: 'var(--cor-roxo-escuro)', fontSize: '1.1rem', marginBottom: '1.2rem' }}>✨ Secção O Método & Cards</h3>
          <ColorPicker label="Cor de Fundo" name="beneficiosBgColor" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div><label style={{ display: 'block', fontWeight: '800', marginBottom: '6px', fontSize: '0.9rem' }}>Título da Secção</label><input type="text" className="modern-input" name="beneficiosTitle" value={getVal('beneficiosTitle')} onChange={handleChange} style={{ width: '100%' }} /></div>
            <BlocoTextoEditavelInterativo label="Subtítulo da Secção" name="beneficiosSubtitle" value={getVal('beneficiosSubtitle') as string} onChange={handleChange} rows={2} />
            
            {/* CARD 1 */}
            <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '0.5rem' }}>
              <h4 style={{ color: 'var(--cor-roxo-escuro)', fontSize: '0.95rem', marginBottom: '8px' }}>Card 1</h4>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                <div style={{ width: '80px' }}><label style={{ fontWeight: '800', fontSize: '0.8rem' }}>Emoji</label><input type="text" className="modern-input" name="beneficiosEmoji1" value={getVal('beneficiosEmoji1')} onChange={handleChange} /></div>
                <div style={{ flex: 1 }}><label style={{ fontWeight: '800', fontSize: '0.8rem' }}>Título do Card 1</label><input type="text" className="modern-input" name="beneficiosCardTitle1" value={getVal('beneficiosCardTitle1')} onChange={handleChange} /></div>
              </div>
              <BlocoTextoEditavelInterativo label="Texto do Card 1" name="beneficiosCardDesc1" value={getVal('beneficiosCardDesc1') as string} onChange={handleChange} rows={2} />
            </div>

            {/* CARD 2 */}
            <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ color: 'var(--cor-roxo-escuro)', fontSize: '0.95rem', marginBottom: '8px' }}>Card 2</h4>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                <div style={{ width: '80px' }}><label style={{ fontWeight: '800', fontSize: '0.8rem' }}>Emoji</label><input type="text" className="modern-input" name="beneficiosEmoji2" value={getVal('beneficiosEmoji2')} onChange={handleChange} /></div>
                <div style={{ flex: 1 }}><label style={{ fontWeight: '800', fontSize: '0.8rem' }}>Título do Card 2</label><input type="text" className="modern-input" name="beneficiosCardTitle2" value={getVal('beneficiosCardTitle2')} onChange={handleChange} /></div>
              </div>
              <BlocoTextoEditavelInterativo label="Texto do Card 2" name="beneficiosCardDesc2" value={getVal('beneficiosCardDesc2') as string} onChange={handleChange} rows={2} />
            </div>

            {/* CARD 3 */}
            <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ color: 'var(--cor-roxo-escuro)', fontSize: '0.95rem', marginBottom: '8px' }}>Card 3</h4>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                <div style={{ width: '80px' }}><label style={{ fontWeight: '800', fontSize: '0.8rem' }}>Emoji</label><input type="text" className="modern-input" name="beneficiosEmoji3" value={getVal('beneficiosEmoji3')} onChange={handleChange} /></div>
                <div style={{ flex: 1 }}><label style={{ fontWeight: '800', fontSize: '0.8rem' }}>Título do Card 3</label><input type="text" className="modern-input" name="beneficiosCardTitle3" value={getVal('beneficiosCardTitle3')} onChange={handleChange} /></div>
              </div>
              <BlocoTextoEditavelInterativo label="Texto do Card 3" name="beneficiosCardDesc3" value={getVal('beneficiosCardDesc3') as string} onChange={handleChange} rows={2} />
            </div>

          </div>
        </div>

        <div className="responsive-grid">
          <div style={{ backgroundColor: '#fcfafc', padding: '1.2rem', borderRadius: '16px', border: '1px solid #edf2f7' }}>
            <h3 style={{ color: 'var(--cor-roxo-escuro)', fontSize: '1.1rem', marginBottom: '1.2rem' }}>👥 Secção "Para Quem É?"</h3>
            <ColorPicker label="Cor de Fundo" name="publicoBgColor" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div><label style={{ display: 'block', fontWeight: '800', marginBottom: '6px', fontSize: '0.9rem' }}>Título</label><input type="text" className="modern-input" name="publicoTitle" value={getVal('publicoTitle')} onChange={handleChange} style={{ width: '100%' }} /></div>
              <BlocoTextoEditavelInterativo label="Subtítulo" name="publicoSubtitle" value={getVal('publicoSubtitle') as string} onChange={handleChange} rows={2} />
            </div>
          </div>

          <div style={{ backgroundColor: '#fcfafc', padding: '1.2rem', borderRadius: '16px', border: '1px solid #edf2f7' }}>
            <h3 style={{ color: 'var(--cor-roxo-escuro)', fontSize: '1.1rem', marginBottom: '1.2rem' }}>📚 Secção Catálogo</h3>
            <ColorPicker label="Cor de Fundo" name="catalogoBgColor" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div><label style={{ display: 'block', fontWeight: '800', marginBottom: '6px', fontSize: '0.9rem' }}>Título</label><input type="text" className="modern-input" name="catalogoTitle" value={getVal('catalogoTitle')} onChange={handleChange} style={{ width: '100%' }} /></div>
              <BlocoTextoEditavelInterativo label="Subtítulo" name="catalogoSubtitle" value={getVal('catalogoSubtitle') as string} onChange={handleChange} rows={2} />
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#fcfafc', padding: '1.2rem', borderRadius: '16px', border: '1px solid #edf2f7', borderLeft: `5px solid ${getVal('iscaBgColor')}` }}>
          <h3 style={{ color: 'var(--cor-roxo-escuro)', fontSize: '1.1rem', marginBottom: '1.2rem' }}>🎁 Secção "Guia Grátis" & Emoji</h3>
          <ColorPicker label="Cor de Fundo da Secção" name="iscaBgColor" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div><label style={{ display: 'block', fontWeight: '800', marginBottom: '6px', fontSize: '0.9rem' }}>Título Principal</label><input type="text" className="modern-input" name="iscaTitle" value={getVal('iscaTitle')} onChange={handleChange} style={{ width: '100%' }} /></div>
            <BlocoTextoEditavelInterativo label="Subtítulo / Descrição" name="iscaSubtitle" value={getVal('iscaSubtitle') as string} onChange={handleChange} rows={2} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}><label style={{ fontWeight: '800', fontSize: '0.85rem' }}>Emoji do Card</label><input type="text" className="modern-input" name="iscaEmoji" value={getVal('iscaEmoji')} onChange={handleChange} /></div>
              <div style={{ flex: 3 }}><label style={{ fontWeight: '800', fontSize: '0.85rem' }}>Título do Card (PDF)</label><input type="text" className="modern-input" name="iscaCardTitle" value={getVal('iscaCardTitle')} onChange={handleChange} /></div>
            </div>
            <BlocoTextoEditavelInterativo label="Descrição do Card" name="iscaCardDesc" value={getVal('iscaCardDesc') as string} onChange={handleChange} rows={2} />
            <div><label style={{ display: 'block', fontWeight: '800', marginBottom: '6px', fontSize: '0.9rem' }}>Texto do Botão do Card</label><input type="text" className="modern-input" name="iscaButtonText" value={getVal('iscaButtonText')} onChange={handleChange} style={{ width: '100%' }} /></div>
          </div>
        </div>
      </div>

      {/* ================= MODAL DE PRÉ-VISUALIZAÇÃO COMPLETO ================= */}
      {showPreview && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
          <div style={{ width: '100%', maxWidth: '1100px', height: '90vh', backgroundColor: getVal('corFundo') as string, borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: `3px solid ${getVal('corPrimaria')}`, boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
            
            <div style={{ padding: '0.8rem 1.2rem', backgroundColor: '#1e293b', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <span style={{ fontWeight: '800', fontSize: '0.95rem' }}>👁️ Pré-visualização Completa da Home</span>
              <button onClick={() => setShowPreview(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.3rem', cursor: 'pointer', padding: '4px 8px' }}>✖ Fechar</button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', fontFamily: getVal('fontFamily') as string, color: getVal('corTexto') as string }}>
              
              {/* 1. HERO SECTION */}
              <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: getVal('heroBgColor') as string, color: '#ffffff', position: 'relative' }}>
                <span style={{ position: 'relative', zIndex: 2, backgroundColor: getVal('corSecundaria') as string, padding: '8px 20px', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', display: 'inline-block', marginBottom: '1rem' }}>
                  {renderizarTextoComDestaquePreview(getVal('heroExtraText') as string)}
                </span>
                <h1 style={{ position: 'relative', zIndex: '2', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', margin: '0.5rem auto 1.5rem', maxWidth: '800px', fontWeight: '900', lineHeight: 1.2 }}>
                  {renderizarTextoComDestaquePreview(getVal('heroTitle') as string)}
                </h1>
                <p style={{ position: 'relative', zIndex: 2, fontSize: '1rem', opacity: 0.9, maxWidth: '650px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
                  {renderizarTextoComDestaquePreview(getVal('heroSubtitle') as string)}
                </p>
                <div style={{ position: 'relative', zIndex: 2, display: 'inline-block', backgroundColor: getVal('corSecundaria') as string, color: '#ffffff', padding: '14px 28px', borderRadius: '12px', fontWeight: '900', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                  {renderizarTextoComDestaquePreview(getVal('heroButton') as string)}
                </div>
              </div>

              {/* 2. BENEFÍCIOS */}
              {!autorData.esconderBeneficios && (
                <div style={{ backgroundColor: getVal('beneficiosBgColor') as string, padding: '4rem 2rem', textAlign: 'center' }}>
                  <h2 style={{ color: getVal('corPrimaria') as string, fontSize: '2rem', marginBottom: '1rem', fontWeight: '900' }}>
                    {renderizarTextoComDestaquePreview(getVal('beneficiosTitle') as string)}
                  </h2>
                  <p style={{ opacity: 0.8, maxWidth: '650px', margin: '0 auto 2.5rem', fontSize: '1rem', lineHeight: 1.6 }}>
                    {renderizarTextoComDestaquePreview(getVal('beneficiosSubtitle') as string)}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', textAlign: 'left', maxWidth: '900px', margin: '0 auto' }}>
                    
                    {/* CARD 1 PREVIEW */}
                    <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '12px', borderTop: `4px solid ${getVal('corSecundaria')}`, boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{getVal('beneficiosEmoji1') || '🧠'}</div>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: getVal('corPrimaria') as string, fontWeight: '800' }}>{renderizarTextoComDestaquePreview(getVal('beneficiosCardTitle1') as string)}</h3>
                      <p style={{ color: '#666', fontSize: '0.85rem', lineHeight: '1.5' }}>{renderizarTextoComDestaquePreview(getVal('beneficiosCardDesc1') as string)}</p>
                    </div>

                    {/* CARD 2 PREVIEW */}
                    <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '12px', borderTop: `4px solid ${getVal('corTerciaria')}`, boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{getVal('beneficiosEmoji2') || '⚖️'}</div>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: getVal('corPrimaria') as string, fontWeight: '800' }}>{renderizarTextoComDestaquePreview(getVal('beneficiosCardTitle2') as string)}</h3>
                      <p style={{ color: '#666', fontSize: '0.85rem', lineHeight: '1.5' }}>{renderizarTextoComDestaquePreview(getVal('beneficiosCardDesc2') as string)}</p>
                    </div>

                    {/* CARD 3 PREVIEW */}
                    <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '12px', borderTop: `4px solid ${getVal('corPrimaria')}`, boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{getVal('beneficiosEmoji3') || '📱'}</div>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: getVal('corPrimaria') as string, fontWeight: '800' }}>{renderizarTextoComDestaquePreview(getVal('beneficiosCardTitle3') as string)}</h3>
                      <p style={{ color: '#666', fontSize: '0.85rem', lineHeight: '1.5' }}>{renderizarTextoComDestaquePreview(getVal('beneficiosCardDesc3') as string)}</p>
                    </div>

                  </div>
                </div>
              )}

              {/* BLOCOS EXTRAS NA PRÉVIA */}
              {((autorData.blocosExtras as Array<any>) || []).map((bloco) => (
                <div key={bloco.id} style={{ padding: '3rem 2rem', backgroundColor: '#ffffff', textAlign: 'center', borderTop: '1px solid #edf2f7' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{bloco.emoji}</div>
                  <h3 style={{ color: getVal('corPrimaria') as string, fontSize: '1.8rem', fontWeight: '900', marginBottom: '1rem' }}>{renderizarTextoComDestaquePreview(bloco.titulo)}</h3>
                  <p style={{ maxWidth: '650px', margin: '0 auto', color: '#666', lineHeight: '1.6' }}>{renderizarTextoComDestaquePreview(bloco.texto)}</p>
                </div>
              ))}

              {/* 3. PÚBLICO ALVO */}
              {!autorData.esconderPublico && (
                <div style={{ backgroundColor: getVal('publicoBgColor') as string, padding: '4rem 2rem', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                  <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <h2 style={{ color: getVal('corPrimaria') as string, fontSize: '2rem', marginBottom: '1rem', fontWeight: '900' }}>
                      {renderizarTextoComDestaquePreview(getVal('publicoTitle') as string)}
                    </h2>
                    <p style={{ opacity: 0.8, maxWidth: '650px', margin: '0 auto 2.5rem', fontSize: '1rem', lineHeight: 1.6 }}>
                      {renderizarTextoComDestaquePreview(getVal('publicoSubtitle') as string)}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
                      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                        <div style={{ color: getVal('corSecundaria') as string, fontWeight: '900', fontSize: '1rem', marginBottom: '0.4rem' }}>01. Estudantes da Saúde</div>
                        <p style={{ color: '#555', fontSize: '0.85rem', margin: 0 }}>Farmácia, Medicina e Enfermagem focados em psicofármacos.</p>
                      </div>
                      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                        <div style={{ color: getVal('corTerciaria') as string, fontWeight: '900', fontSize: '1rem', marginBottom: '0.4rem' }}>02. Residentes & Concurseiros</div>
                        <p style={{ color: '#555', fontSize: '0.85rem', margin: 0 }}>Revisões dinâmicas para provas e concursos públicos.</p>
                      </div>
                      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                        <div style={{ color: getVal('corPrimaria') as string, fontWeight: '900', fontSize: '1rem', marginBottom: '0.4rem' }}>03. Profissionais Clínicos</div>
                        <p style={{ color: '#555', fontSize: '0.85rem', margin: 0 }}>Suporte para orientação farmacêutica e manejo em saúde mental.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. ISCA DIGITAL */}
              {!autorData.esconderIsca && (
                <div style={{ padding: '4rem 2rem', backgroundColor: getVal('iscaBgColor') as string, color: '#ffffff', textAlign: 'center' }}>
                  <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: '900' }}>{renderizarTextoComDestaquePreview(getVal('iscaTitle') as string)}</h2>
                  <p style={{ marginBottom: '2rem', fontSize: '1rem', opacity: 0.9, maxWidth: '650px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
                    {renderizarTextoComDestaquePreview(getVal('iscaSubtitle') as string)}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '14px', width: '100%', maxWidth: '320px', color: getVal('corTexto') as string, textAlign: 'left', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                      <div style={{ height: '140px', backgroundColor: '#f4eef7', borderRadius: '8px', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '2.5rem' }}>{getVal('iscaEmoji') || '🧠'}</span>
                      </div>
                      <h3 style={{ color: getVal('corPrimaria') as string, marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: '800' }}>{renderizarTextoComDestaquePreview(getVal('iscaCardTitle') as string)}</h3>
                      <p style={{ fontSize: '0.85rem', marginBottom: '1.2rem', opacity: 0.7, lineHeight: 1.4 }}>{renderizarTextoComDestaquePreview(getVal('iscaCardDesc') as string)}</p>
                      <div style={{ width: '100%', padding: '12px', backgroundColor: 'transparent', color: getVal('corPrimaria') as string, border: `2px solid ${getVal('corPrimaria')}`, borderRadius: '10px', fontWeight: '800', textAlign: 'center', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                        {renderizarTextoComDestaquePreview(getVal('iscaButtonText') as string)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. CATÁLOGO */}
              {!autorData.esconderCatalogo && (
                <div style={{ backgroundColor: getVal('catalogoBgColor') as string, padding: '4rem 2rem', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                  <h2 style={{ color: getVal('corPrimaria') as string, fontSize: '2rem', marginBottom: '0.5rem', fontWeight: '900' }}>
                    {renderizarTextoComDestaquePreview(getVal('catalogoTitle') as string)}
                  </h2>
                  <p style={{ opacity: 0.8, maxWidth: '650px', margin: '0 auto 2rem', fontSize: '1rem', lineHeight: 1.6 }}>
                    {renderizarTextoComDestaquePreview(getVal('catalogoSubtitle') as string)}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '16px', width: '280px', textAlign: 'left', border: '1px solid #edf2f7', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                      <div style={{ height: '120px', background: `linear-gradient(135deg, ${getVal('corTerciaria')}, ${getVal('corPrimaria')})`, borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '2.5rem' }}>📘</span>
                      </div>
                      <h4 style={{ color: getVal('corPrimaria') as string, marginBottom: '0.3rem', fontWeight: '800' }}>E-book Psicofármacos na Prática</h4>
                      <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem' }}>Guia completo de antidepressivos, estabilizadores e antipsicóticos.</p>
                      <span style={{ fontWeight: '900', color: getVal('corSecundaria') as string }}>R$ 47,90</span>
                    </div>
                    <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '16px', width: '280px', textAlign: 'left', border: '1px solid #edf2f7', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                      <div style={{ height: '120px', backgroundColor: '#f4eef7', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '2.5rem' }}>🎯</span>
                      </div>
                      <h4 style={{ color: getVal('corPrimaria') as string, marginBottom: '0.3rem', fontWeight: '800' }}>Flashcards de Saúde Mental</h4>
                      <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem' }}>Estudo ativo para fixar doses, reações e mecanismos de ação.</p>
                      <span style={{ fontWeight: '900', color: getVal('corSecundaria') as string }}>R$ 29,90</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. RODAPÉ */}
              <div style={{ backgroundColor: '#392B3B', color: '#fcfafc', textAlign: 'center', padding: '3rem 1rem 1.5rem' }}>
                <h3 style={{ color: '#fcfafc', fontSize: '1.2rem', fontWeight: '900', marginBottom: '0.3rem' }}>Dra. Vitória Rocha</h3>
                <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '1rem' }}>CRF: 1-114126-7</p>
                <p style={{ fontSize: '0.80rem', color: '#aaa' }}>© {new Date().getFullYear()} Todos os direitos reservados.</p>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}