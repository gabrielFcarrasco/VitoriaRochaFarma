import { useState } from 'react';
import type { ChangeEvent } from 'react';
import type { AutorInfo } from '../../config/autorService';
import { BOT_AVATARS } from '../../components/Chatbot';
import { TEXTOS_PADRAO } from './TextosHomeTab';

interface PerfilTabProps {
  autorData: AutorInfo;
  setAutorData: React.Dispatch<React.SetStateAction<AutorInfo>>;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleImageUpload: (e: ChangeEvent<HTMLInputElement>, field: 'imagemUrl' | 'logoUrl') => void;
  uploadLoading: boolean;
  isSaving: boolean;
  handleSalvarSobreMim: () => void;
  handleTextareaClick: (fieldData: { name: keyof AutorInfo, title: string, helper: string, maxLength: number }) => void;
}

export function PerfilTab({ autorData, setAutorData, handleChange, handleImageUpload, uploadLoading, isSaving, handleSalvarSobreMim, handleTextareaClick }: PerfilTabProps) {
  const [showPreview, setShowPreview] = useState(false);
  const especialidadesPadrao = ['Farmácia Clínica', 'Prescrição Farmacêutica', 'Saúde Mental & Pública'];
  const especialidadesExibidas = autorData?.especialidades?.length ? autorData.especialidades : especialidadesPadrao;

  // Usa as cores escolhidas ou o padrão
  const getVal = (key: keyof typeof TEXTOS_PADRAO) => (autorData as any)[key] !== undefined && (autorData as any)[key] !== '' ? (autorData as any)[key] : TEXTOS_PADRAO[key];

  return (
    <div className="glass-card fade-in">
      <div className="header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem', borderBottom: '2px solid #f4f6f9', paddingBottom: '2rem' }}>
        <div>
          <h2 className="page-title" style={{ color: 'var(--cor-roxo-escuro)', fontSize: 'clamp(1.6rem, 4vw, 2rem)', margin: '0 0 0.5rem 0', fontWeight: '900' }}>Identidade Visual</h2>
          <p style={{ color: '#888', margin: 0, fontSize: '1rem' }}>
            Configure como o público enxerga a sua marca. <span style={{color: 'var(--cor-rosa)', fontStyle: 'italic'}}>(A mais linda da internet ❤️)</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', width: window.innerWidth <= 768 ? '100%' : 'auto' }}>
          <button type="button" onClick={() => setShowPreview(true)} className="btn-hover" style={{ flex: 1, padding: '16px 24px', backgroundColor: '#f1f5f9', color: 'var(--cor-roxo-escuro)', borderRadius: '14px', fontWeight: '900', border: 'none', cursor: 'pointer' }}>👁️ Ver Prévia do Perfil</button>
          <button onClick={handleSalvarSobreMim} disabled={isSaving || uploadLoading} className="btn-hover" style={{ flex: 1, padding: '16px 32px', backgroundColor: 'var(--cor-rosa)', color: 'white', borderRadius: '14px', fontWeight: '900', cursor: (isSaving || uploadLoading) ? 'not-allowed' : 'pointer', border: 'none', boxShadow: '0 8px 25px rgba(200,93,161,0.3)' }}>
            {isSaving ? 'Salvando...' : '💾 Salvar Perfil'}
          </button>
        </div>
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(2rem, 5vw, 4rem)' }}>
        
        <div className="mobile-full-width" style={{ flex: '1', minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--cor-texto-escuro)', marginBottom: '1.2rem', fontWeight: '800' }}>Sua Foto de Perfil</h3>
            <div style={{ width: '200px', height: '200px', borderRadius: '50%', backgroundColor: '#f8fafc', margin: '0 auto 1.5rem', overflow: 'hidden', border: '8px solid white', boxShadow: '0 15px 35px rgba(0,0,0,0.08)', position: 'relative' }}>
              <img src={autorData.imagemUrl || "https://gabrielfscarrasco.github.io/Img/IMG-20240223-WA0075.jpg"} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: uploadLoading ? 0.5 : 1 }} />
            </div>
            <label className="btn-hover" style={{ display: 'inline-block', padding: '14px 28px', backgroundColor: 'var(--cor-lilas)', color: 'white', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', width: '100%', maxWidth: '220px', fontSize: '1rem' }}>
              {uploadLoading ? 'Enviando...' : '📸 Trocar Foto'}
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'imagemUrl')} style={{ display: 'none' }} disabled={uploadLoading} />
            </label>
          </div>

          <div style={{ padding: '2rem 1.5rem', backgroundColor: '#f8fafc', borderRadius: '20px', border: '2px dashed #e2e8f0', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--cor-texto-escuro)', marginBottom: '1.2rem', fontWeight: '800' }}>Logo do Site (Opcional)</h3>
            {autorData.logoUrl ? (
              <div style={{ marginBottom: '1.5rem' }}>
                <img src={autorData.logoUrl} alt="Logo" style={{ maxHeight: '70px', maxWidth: '100%', objectFit: 'contain' }} />
                <br/><button onClick={() => setAutorData(prev => ({...prev, logoUrl: ''}))} style={{ marginTop: '1.2rem', background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 'bold' }}>Remover Logo</button>
              </div>
            ) : (
              <div style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a0aec0', marginBottom: '1.5rem', fontSize: '0.95rem', fontWeight: '600' }}>Nenhuma logo aplicada</div>
            )}
            <label className="btn-hover" style={{ display: 'inline-block', padding: '12px 24px', backgroundColor: 'var(--cor-roxo-escuro)', color: 'white', borderRadius: '12px', cursor: 'pointer', fontWeight: '800' }}>
              ⬆️ Subir Logo
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logoUrl')} style={{ display: 'none' }} disabled={uploadLoading} />
            </label>
          </div>
        </div>

        <div className="mobile-full-width" style={{ flex: '2', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="responsive-grid">
            <div>
              <label style={{ display: 'block', fontWeight: '800', color: 'var(--cor-roxo-escuro)', marginBottom: '10px', fontSize: '1rem' }}>Nome de Exibição</label>
              <input className="modern-input" type="text" name="nome" value={autorData.nome || ''} onChange={handleChange} placeholder="Como o público vai te chamar" />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '800', color: 'var(--cor-roxo-escuro)', marginBottom: '10px', fontSize: '1rem' }}>
                @ do Instagram <span style={{ fontSize: '0.85rem', color: '#a0aec0', fontWeight: 'normal' }}>(da melhor farmacêutica)</span>
              </label>
              <input className="modern-input" type="text" name="instagramUrl" value={autorData.instagramUrl || ''} onChange={handleChange} placeholder="Ex: _umafarmaceutica" />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6px' }}>
              <label style={{ fontWeight: '800', color: 'var(--cor-roxo-escuro)', fontSize: '1rem' }}>Frase de Impacto</label>
              <button type="button" onClick={() => handleTextareaClick({ name: 'textoIntro', title: 'Frase de Impacto', helper: 'A sua vitrine. Escreva uma frase curta e poderosa que mostre como você transforma a vida ou os estudos do seu público.', maxLength: 150 })} className="btn-expand">⤢ Expandir</button>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '10px', lineHeight: '1.5' }}>A sua vitrine. Escreva uma frase curta e poderosa que mostre como você transforma a vida ou os estudos do seu público.</p>
            <textarea className="modern-input" name="textoIntro" maxLength={150} value={autorData.textoIntro || ''} onChange={handleChange} onClick={() => handleTextareaClick({ name: 'textoIntro', title: 'Frase de Impacto', helper: 'A sua vitrine...', maxLength: 150 })} rows={3} style={{ resize: 'vertical' }} />
            <div style={{ textAlign: 'right', fontSize: '0.85rem', marginTop: '8px', color: '#a0aec0', fontWeight: '700' }}>{(autorData.textoIntro?.length || 0)} / 150</div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6px' }}>
              <label style={{ fontWeight: '800', color: 'var(--cor-roxo-escuro)', fontSize: '1rem' }}>Autoridade & Formação</label>
              <button type="button" onClick={() => handleTextareaClick({ name: 'textoFormacao', title: 'Autoridade & Formação', helper: 'O seu crachá de credibilidade.', maxLength: 300 })} className="btn-expand">⤢ Expandir</button>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '10px', lineHeight: '1.5' }}>O seu crachá de credibilidade. Destaque suas especializações e conquistas.</p>
            <textarea className="modern-input" name="textoFormacao" maxLength={300} value={autorData.textoFormacao || ''} onChange={handleChange} onClick={() => handleTextareaClick({ name: 'textoFormacao', title: 'Autoridade & Formação', helper: 'O seu crachá de credibilidade.', maxLength: 300 })} rows={4} style={{ resize: 'vertical' }} />
            <div style={{ textAlign: 'right', fontSize: '0.85rem', marginTop: '8px', color: '#a0aec0', fontWeight: '700' }}>{(autorData.textoFormacao?.length || 0)} / 300</div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6px' }}>
              <label style={{ fontWeight: '800', color: 'var(--cor-roxo-escuro)', fontSize: '1rem' }}>Propósito (Lado Humano)</label>
              <button type="button" onClick={() => handleTextareaClick({ name: 'textoMissao', title: 'Propósito (Lado Humano)', helper: 'A sua essência.', maxLength: 350 })} className="btn-expand">⤢ Expandir</button>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '10px', lineHeight: '1.5' }}>A sua essência. Compartilhe o que move o seu coração, seus valores e sua missão.</p>
            <textarea className="modern-input" name="textoMissao" maxLength={350} value={autorData.textoMissao || ''} onChange={handleChange} onClick={() => handleTextareaClick({ name: 'textoMissao', title: 'Propósito (Lado Humano)', helper: 'A sua essência.', maxLength: 350 })} rows={4} style={{ resize: 'vertical' }} />
            <div style={{ textAlign: 'right', fontSize: '0.85rem', marginTop: '8px', color: '#a0aec0', fontWeight: '700' }}>{(autorData.textoMissao?.length || 0)} / 350</div>
          </div>
        </div>
      </div>

      {/* --- SEÇÃO DA INTELIGÊNCIA ARTIFICIAL --- */}
      <div className="mobile-full-width" style={{ flex: '100%', display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '3rem', paddingTop: '3rem', borderTop: '3px dashed #edf2f7' }}>
        <h3 style={{ color: 'var(--cor-roxo-escuro)', fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', margin: 0, display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '900' }}>🤖 Personalidade da IA</h3>
        
        <div className="responsive-grid">
          <div>
            <label style={{ display: 'block', fontWeight: '800', color: 'var(--cor-roxo-escuro)', marginBottom: '10px', fontSize: '1rem' }}>Nome da Assistente Virtual</label>
            <input className="modern-input" type="text" name="chatbotName" value={autorData.chatbotName || ''} onChange={handleChange} placeholder="Ex: Bia, Assistente VR, Clara..." />
          </div>
          
          <div>
            <label style={{ display: 'block', fontWeight: '800', color: 'var(--cor-roxo-escuro)', marginBottom: '16px', fontSize: '1rem' }}>
              Rosto da Assistente
            </label>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              {Object.keys(BOT_AVATARS).map((chave) => (
                <div 
                  key={chave}
                  onClick={() => setAutorData(prev => ({ ...prev, chatbotAvatar: chave }))}
                  title={chave.replace(/([A-Z])/g, ' $1').trim()}
                  style={{ 
                    width: '70px', height: '70px', borderRadius: '50%', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: autorData.chatbotAvatar === chave ? 'var(--cor-rosa)' : '#f8fafc',
                    color: autorData.chatbotAvatar === chave ? 'white' : 'var(--cor-roxo-escuro)',
                    border: autorData.chatbotAvatar === chave ? 'none' : '3px solid #edf2f7',
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    boxShadow: autorData.chatbotAvatar === chave ? '0 10px 25px rgba(200,93,161,0.4)' : 'none',
                    transform: autorData.chatbotAvatar === chave ? 'scale(1.1)' : 'scale(1)'
                  }}
                >
                  {BOT_AVATARS[chave]}
                </div>
              ))}
            </div>
            <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '14px', fontStyle: 'italic' }}>
              Clique para selecionar. Este será o ícone que aparecerá no balão de bate-papo.
            </p>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6px' }}>
            <label style={{ fontWeight: '800', color: 'var(--cor-roxo-escuro)', fontSize: '1rem' }}>Regras de Atendimento (System Prompt)</label>
            <button type="button" onClick={() => handleTextareaClick({ name: 'chatbotPrompt', title: 'Regras da IA', helper: 'Treine sua assistente! Diga como ela deve agir...', maxLength: 10000 })} className="btn-expand">⤢ Expandir</button>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '10px', lineHeight: '1.5' }}>Treine sua assistente! Diga como ela deve agir, o que deve vender e como deve falar com os alunos.</p>
          <textarea className="modern-input" name="chatbotPrompt" maxLength={10000} value={autorData.chatbotPrompt || ''} onChange={handleChange} onClick={() => handleTextareaClick({ name: 'chatbotPrompt', title: 'Regras da IA', helper: 'Treine sua assistente...', maxLength: 10000 })} rows={6} style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: '0.95rem' }} placeholder="Você é a assistente da VR FARMA. Sua missão é tirar dúvidas e ajudar os alunos..." />
        </div>
      </div>

      {/* ================= MODAL DE PRÉVIA DO PERFIL ================= */}
      {showPreview && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
          <div style={{ width: '100%', maxWidth: '1000px', height: '90vh', backgroundColor: getVal('corFundo') as string, borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: `4px solid ${getVal('corPrimaria')}`, boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
            
            <div style={{ padding: '0.8rem 1.2rem', backgroundColor: '#1e293b', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <span style={{ fontWeight: '800', fontSize: '0.95rem' }}>👁️ Pré-visualização do Perfil na Home</span>
              <button onClick={() => setShowPreview(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.3rem', cursor: 'pointer', padding: '4px 8px' }}>✖ Fechar</button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '4rem 2rem', fontFamily: getVal('fontFamily') as string, color: getVal('corTexto') as string }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '3rem', maxWidth: '1100px', margin: '0 auto' }}>
                
                <div style={{ position: 'relative' }}>
                  <div style={{ 
                    position: 'absolute', bottom: '5px', right: '2px', backgroundColor: getVal('corSecundaria') as string, color: '#ffffff', 
                    padding: '8px 18px', borderRadius: '30px', fontSize: '0.9rem', zIndex: 2, boxShadow: '0 10px 20px rgba(0,0,0,0.1)', 
                    display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' 
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    {autorData?.instagramUrl || '@_umafarmaceutica'}
                  </div>
                  <div style={{ width: '300px', height: '300px', borderRadius: '50%', backgroundColor: getVal('corTerciaria') as string, border: `8px solid ${getVal('corFundo')}`, boxShadow: '0 20px 40px rgba(0,0,0,0.08)', position: 'relative', zIndex: 1, overflow: 'hidden' }}>
                    <img src={autorData?.imagemUrl || "https://gabrielfscarrasco.github.io/Img/IMG-20240223-WA0075.jpg"} alt="Foto de Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>

                <div style={{ maxWidth: '550px', textAlign: 'left' }}>
                  <span style={{ color: getVal('corSecundaria') as string, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>
                    Por trás do método
                  </span>
                  <h2 style={{ color: getVal('corPrimaria') as string, fontSize: 'clamp(2rem, 4vw, 2.5rem)', marginBottom: '1rem', fontWeight: '900' }}>
                    Muito prazer, eu sou a {autorData?.nome ? autorData.nome.split(' ')[0] : 'Vitória'}!
                  </h2>
                  
                  <p style={{ fontSize: '1.15rem', lineHeight: '1.6', marginBottom: '1.5rem', fontWeight: '600' }}>
                    {autorData?.textoIntro || 'Minha missão é traduzir a complexidade da saúde em um aprendizado acessível, seguro e real para você.'}
                  </p>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '2rem' }}>
                    {especialidadesExibidas.map((esp, idx) => (
                      <span key={idx} style={{ backgroundColor: '#ffffff', border: '1px solid #edf2f7', color: getVal('corPrimaria') as string, padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '800' }}>
                        {esp}
                      </span>
                    ))}
                  </div>

                  <p style={{ lineHeight: '1.8', marginBottom: '1.5rem', opacity: 0.9 }}>
                    {autorData?.textoFormacao || 'Sou pós-graduada em Farmácia Clínica e Prescrição Farmacêutica, e atualmente especializanda em Saúde Pública e APS (com foco em ESF). Aqui, compartilho conteúdos 100% confiáveis e esquematizados sobre medicamentos, psicotrópicos e substâncias psicoativas.'}
                  </p>

                  <div style={{ backgroundColor: '#ffffff', borderLeft: `4px solid ${getVal('corSecundaria')}`, padding: '1.5rem', borderRadius: '0 12px 12px 0', marginTop: '2rem', boxShadow: '0 5px 15px rgba(0,0,0,0.02)' }}>
                    <p style={{ lineHeight: '1.7', fontStyle: 'italic', margin: 0, opacity: 0.9 }}>
                      "{autorData?.textoMissao || 'Além da ciência, sou cristã e apaixonada por projetos sociais. Meu maior objetivo é entregar guias que não apenas ajudem você a passar de semestre, mas que fortaleçam a sua base para um atendimento clínico de excelência.'}"
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}