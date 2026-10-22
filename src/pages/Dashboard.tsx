import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import { autorService } from '../config/autorService';
import type { AutorInfo } from '../config/autorService';
import { useCloudinaryUpload } from '../hooks/useCloudinaryUpload';

// Importando os novos componentes
import { Sidebar } from '../components/dashboard/Sidebar';
import { Topbar } from '../components/dashboard/Topbar';
import { VisaoGeralTab } from '../components/dashboard/VisaoGeralTab';
import { CatalogoTab } from '../components/dashboard/CatalogoTab';
import { PerfilTab } from '../components/dashboard/PerfilTab';
import { TextosHomeTab } from '../components/dashboard/TextosHomeTab';


// --- TIPAGENS PARA OS PRODUTOS E HOTSPOTS ---
type HotspotStyle = 'target' | 'dot' | 'number';
type Hotspot = { id: string; x: number; y: number; title: string; description: string; style: HotspotStyle; color: string };
type ProdImage = { id: string; file?: File; previewUrl: string; hotspots: Hotspot[] };

export function Dashboard() {
  const navigate = useNavigate();
  const { uploadImage, loading: uploadLoading } = useCloudinaryUpload();

  const [activeTab, setActiveTab] = useState<'visao-geral' | 'materiais' | 'textos-home' | 'sobre'>('visao-geral');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  

  // Modo Foco (Tela Cheia para Textos do Perfil)
  const [expandedField, setExpandedField] = useState<{ name: keyof AutorInfo, title: string, helper: string, maxLength: number } | null>(null);

  // --- CONTROLES DO MODAL DE PRODUTO WIZARD ---
  const [isProdutoModalOpen, setIsProdutoModalOpen] = useState(false);
  const [produtoStep, setProdutoStep] = useState(1);
  const [isGratuito, setIsGratuito] = useState(false);

  // Listas Dinâmicas (Matérias e Formatos)
  const [materias, setMaterias] = useState(['Farmacologia Clínica', 'Sistema Nervoso', 'Saúde Mental', 'Legislação']);
  const [formatos, setFormatos] = useState(['E-book (PDF)', 'Flashcards / Psicocards', 'Resumo / Mapa Mental']);
  const [showNovaMateria, setShowNovaMateria] = useState(false);
  const [novaMateriaText, setNovaMateriaText] = useState('');
  const [showNovoFormato, setShowNovoFormato] = useState(false);
  const [novoFormatoText, setNovoFormatoText] = useState('');
  
  // Imagens e Hotspots do Produto
  const [prodImages, setProdImages] = useState<ProdImage[]>([]);
  const [activeHotspotInput, setActiveHotspotInput] = useState<{ imageId: string, hotspotId: string } | null>(null);

  // Estúdio de Edição em Tela Cheia
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [markerStyle, setMarkerStyle] = useState<HotspotStyle>('target');
  const [markerColor, setMarkerColor] = useState<string>('#c85da1'); // Rosa padrão
  const [coresDisponiveis, setCoresDisponiveis] = useState<string[]>(['#c85da1', '#422850', '#3498db', '#2ecc71', '#f1c40f', '#e74c3c', '#ffffff', '#000000']);

  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({ show: false, message: '', type: 'success' });
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message, type }), 4000);
  };

  const [isSaving, setIsSaving] = useState(false);
  const [autorData, setAutorData] = useState<AutorInfo>({
    nome: '', idade: '', especialidades: [], textoIntro: '', textoFormacao: '', textoMissao: '',
    imagemUrl: 'https://gabrielfscarrasco.github.io/Img/IMG-20240223-WA0075.jpg', instagramUrl: '', logoUrl: '',
    chatbotName: '', chatbotPrompt: '', chatbotAvatar: 'roboFofo'
  });

  useEffect(() => {
    const carregarDados = async () => { const dadosSalvos = await autorService.getAutorInfo(); if (dadosSalvos) setAutorData(dadosSalvos); };
    carregarDados();
  }, []);

  const handleLogout = async () => { try { await signOut(auth); navigate('/login'); } catch (error) { showToast("Erro ao sair.", "error"); } };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setAutorData(prev => ({ ...prev, [e.target.name]: e.target.value })); };
  const handleTextareaClick = (fieldData: { name: keyof AutorInfo, title: string, helper: string, maxLength: number }) => { if (window.innerWidth <= 768) setExpandedField(fieldData); };
  
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>, field: 'imagemUrl' | 'logoUrl') => {
    if (e.target.files && e.target.files[0]) {
      showToast(`Enviando ${field === 'logoUrl' ? 'logo' : 'a sua foto'} para a nuvem...`, "info");
      const urlCloudinary = await uploadImage(e.target.files[0]);
      
      if (urlCloudinary) { 
        setAutorData(prev => ({ ...prev, [field]: urlCloudinary })); 
        if (field === 'imagemUrl') showToast("Foto carregada! Salve para aplicar.", "success");
        else showToast("Logo enviada com sucesso! Salve para aplicar.", "success");
      } 
      else { showToast("Ocorreu um erro no envio.", "error"); }
    }
  };
  
  const handleSalvarSobreMim = async () => {
    setIsSaving(true); const sucesso = await autorService.salvarAutorInfo(autorData); setIsSaving(false);
    if (sucesso) showToast('Tudo salvo perfeitamente! 🤍', 'success'); 
    else showToast('Erro de conexão.', 'error');
  };

  const handleAddMateria = () => { if (novaMateriaText.trim()) { setMaterias(prev => [...prev, novaMateriaText.trim()]); setShowNovaMateria(false); setNovaMateriaText(''); } };
  const handleAddFormato = () => { if (novoFormatoText.trim()) { setFormatos(prev => [...prev, novoFormatoText.trim()]); setShowNovoFormato(false); setNovoFormatoText(''); } };
  const handleColorPreview = (e: React.ChangeEvent<HTMLInputElement>) => setMarkerColor(e.target.value);
  const handleColorSave = () => { setCoresDisponiveis(prev => { if (!prev.includes(markerColor)) return [...prev, markerColor]; return prev; }); };

  const handleAddProductImages = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => ({ id: Date.now().toString() + Math.random().toString(), file, previewUrl: URL.createObjectURL(file), hotspots: [] }));
      setProdImages(prev => [...prev, ...newImages]);
    }
  };
  
  const removeProductImage = (id: string) => setProdImages(prev => prev.filter(img => img.id !== id));
  const handleImageClickForHotspot = (e: React.MouseEvent<HTMLDivElement>, imageId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const newHotspot: Hotspot = { id: Date.now().toString(), x, y, title: '', description: '', style: markerStyle, color: markerColor };
    
    setProdImages(prev => prev.map(img => img.id === imageId ? { ...img, hotspots: [...img.hotspots, newHotspot] } : img));
    setActiveHotspotInput({ imageId, hotspotId: newHotspot.id });
  };

  const updateHotspotData = (field: 'title' | 'description', value: string) => {
    if (!activeHotspotInput) return;
    setProdImages(prev => prev.map(img => {
      if (img.id === activeHotspotInput.imageId) {
        return { ...img, hotspots: img.hotspots.map(hs => hs.id === activeHotspotInput.hotspotId ? { ...hs, [field]: value } : hs) };
      }
      return img;
    }));
  };

  const removeHotspot = (imageId: string, hotspotId: string, e: React.MouseEvent) => {
    e.stopPropagation(); setProdImages(prev => prev.map(img => img.id === imageId ? { ...img, hotspots: img.hotspots.filter(hs => hs.id !== hotspotId) } : img));
  };

  const toastColors = { success: '#4CAF50', error: '#e74c3c', info: '#3498db' };

  return (
    <div className="dashboard-container">
      
      <style>{`
        * { box-sizing: border-box; }
        .dashboard-container { display: flex; min-height: 100vh; background-color: #f4f6f9; font-family: 'Inter', system-ui, sans-serif; overflow-x: hidden; width: 100%; }
        
        /* SIDEBAR COMPLETA */
        .sidebar { width: 260px; background-color: var(--cor-roxo-escuro); color: white; display: flex; flex-direction: column; position: fixed; top: 0; bottom: 0; left: 0; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); z-index: 10000; box-shadow: 4px 0 15px rgba(0,0,0,0.1); }
        .sidebar-header { padding: clamp(1.5rem, 3vw, 2rem) 1.5rem; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .sidebar-menu { flex: 1; padding: 1.5rem 1rem; display: flex; flex-direction: column; gap: 0.5rem; overflow-y: auto; }
        .menu-item { padding: 14px 16px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 12px; font-weight: 600; color: rgba(255,255,255,0.7); transition: all 0.2s ease; border: none; background: transparent; text-align: left; font-size: 1rem; }
        .menu-item:hover { background-color: rgba(255,255,255,0.05); color: white; transform: translateX(4px); }
        .menu-item.active { background-color: var(--cor-rosa); color: white; box-shadow: 0 4px 15px rgba(200,93,161,0.4); }
        
        /* CONTEÚDO PRINCIPAL */
        .main-content { flex: 1; margin-left: 260px; display: flex; flex-direction: column; transition: margin-left 0.3s ease; min-height: 100vh; width: calc(100% - 260px); }
        
        /* TOPBAR COM EFEITO BLUR */
        .topbar { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); padding: 1rem clamp(1rem, 3vw, 2rem); display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 15px rgba(0,0,0,0.03); position: sticky; top: 0; z-index: 90; border-bottom: 1px solid #edf2f7; }
        .hamburger-btn { display: none; background: #f8fafc; border: 1px solid #edf2f7; width: 45px; height: 45px; border-radius: 10px; font-size: 1.2rem; cursor: pointer; color: var(--cor-roxo-escuro); align-items: center; justify-content: center; transition: 0.2s; }
        .hamburger-btn:active { background: #e2e8f0; }

        /* ÁREA DE CONTEÚDO RESPONSIVA */
        .content-area { padding: clamp(1.2rem, 4vw, 2.5rem); flex: 1; max-width: 1200px; margin: 0 auto; width: 100%; }
        .glass-card { background: white; border-radius: 24px; padding: clamp(1.5rem, 4vw, 2.5rem); box-shadow: 0 10px 40px rgba(0,0,0,0.03); border: 1px solid #f1f5f9; }
        
        /* INPUTS MODERNOS (TOUCH FRIENDLY) */
        .modern-input { width: 100%; padding: 16px; border-radius: 14px; border: 2px solid #edf2f7; background-color: #fcfafc; font-size: 1rem; color: #2d3748; transition: all 0.3s ease; outline: none; font-family: inherit; line-height: 1.6; }
        .modern-input:focus { border-color: var(--cor-lilas); background-color: white; box-shadow: 0 0 0 4px rgba(162, 136, 171, 0.1); }
        select.modern-input { appearance: none; background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e"); background-repeat: no-repeat; background-position: right 1rem center; background-size: 1em; }

        /* GRID FLUIDO SEGURO */
        .responsive-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 1.5rem; }

        /* ANIMAÇÕES */
        .swipe-slide { animation: swipeLeft 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        @keyframes swipeLeft { 0% { transform: translateX(30px); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
        .fade-in { animation: fadeIn 0.4s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        
        .carousel-nav-btn { background: rgba(255,255,255,0.2); border: none; color: inherit; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; position: absolute; right: 15px; top: 50%; transform: translateY(-50%); z-index: 10; }
        .carousel-nav-btn:hover { background: rgba(255,255,255,0.4); transform: translateY(-50%) scale(1.1); }
        
        .btn-expand { background: #f1f5f9; border: none; color: var(--cor-roxo-escuro); padding: 6px 12px; border-radius: 8px; font-size: 0.85rem; font-weight: bold; cursor: pointer; transition: 0.2s; }
        .btn-expand:hover { background: #e2e8f0; }

        /* WIZARD MODAL MELHORADO */
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 10, 20, 0.7); backdrop-filter: blur(5px); z-index: 9999; display: flex; justify-content: center; align-items: center; padding: clamp(1rem, 3vw, 2rem); animation: fadeIn 0.3s; }
        .modal-content { background: white; width: 100%; max-width: 750px; border-radius: 24px; box-shadow: 0 25px 50px rgba(0,0,0,0.25); overflow: hidden; display: flex; flex-direction: column; max-height: 90vh; }
        .step-indicator { display: flex; justify-content: space-between; position: relative; margin-bottom: 2rem; padding: 0 10%; }
        .step-indicator::before { content: ''; position: absolute; top: 50%; left: 10%; right: 10%; height: 4px; background: #edf2f7; z-index: 1; transform: translateY(-50%); border-radius: 4px; }
        .step-dot { width: 40px; height: 40px; border-radius: 50%; background: white; border: 4px solid #edf2f7; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #a0aec0; z-index: 2; transition: all 0.3s; font-size: 1.1rem; }
        .step-dot.active { border-color: var(--cor-rosa); background: var(--cor-rosa); color: white; box-shadow: 0 0 0 6px rgba(200,93,161,0.15); }
        .step-dot.completed { border-color: var(--cor-lilas); background: var(--cor-lilas); color: white; }

        /* ESTÚDIO DE EDIÇÃO (CANVAS) */
        .fullscreen-studio { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: #e2e8f0; z-index: 99999; display: flex; flex-direction: column; }
        .studio-toolbar { background: white; padding: 1rem clamp(1rem, 3vw, 2rem); display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 20px rgba(0,0,0,0.08); z-index: 10; gap: 1rem; }
        .studio-canvas { flex: 1; overflow: auto; padding: clamp(1rem, 4vw, 3rem); display: flex; justify-content: center; align-items: flex-start; }
        
        .hotspot-wrapper { position: relative; display: inline-block; cursor: crosshair; box-shadow: 0 15px 50px rgba(0,0,0,0.2); border-radius: 12px; }
        .hotspot-img { display: block; max-width: 100%; height: auto; border-radius: 12px; }
        .hotspot-marker { position: absolute; transform: translate(-50%, -50%); cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10; transition: transform 0.2s; }
        .hotspot-marker:hover { transform: translate(-50%, -50%) scale(1.2); z-index: 20; }
        .hotspot-pulse { position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 50%; animation: pulse 1.5s infinite; z-index: -1; }
        @keyframes pulse { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(2.5); opacity: 0; } }
        
        .hotspot-tooltip { position: absolute; bottom: 50px; left: 50%; transform: translateX(-50%); background: white; padding: 18px; border-radius: 16px; width: clamp(220px, 60vw, 280px); pointer-events: none; opacity: 0; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 20px 40px rgba(0,0,0,0.25); border: 1px solid #edf2f7; text-align: left; z-index: 30; }
        .hotspot-marker:hover .hotspot-tooltip { opacity: 1; bottom: 55px; pointer-events: auto; }
        .hotspot-tooltip::after { content: ''; position: absolute; top: 100%; left: 50%; margin-left: -8px; border-width: 8px; border-style: solid; border-color: white transparent transparent transparent; }

        .style-btn { padding: 10px 18px; border-radius: 10px; border: 2px solid #edf2f7; background: white; cursor: pointer; font-weight: bold; color: #555; transition: 0.2s; white-space: nowrap; }
        .style-btn.active { border-color: var(--cor-rosa); color: var(--cor-rosa); background: #fff0f7; }
        .color-btn { width: 36px; height: 36px; border-radius: 50%; border: 3px solid white; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.15); transition: 0.2s; flex-shrink: 0; }
        .color-btn.active { transform: scale(1.15); outline: 3px solid var(--cor-roxo-escuro); }
        .color-picker-btn { width: 40px; height: 40px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; transition: 0.2s; position: relative; overflow: hidden; flex-shrink: 0; }

        /* O SEGREDO DO MOBILE FIRST E RESPONSIVIDADE MAXIMIZADA */
        @media (max-width: 768px) {
          .sidebar { transform: translateX(-100%); }
          .sidebar.open { transform: translateX(0); }
          .main-content { margin-left: 0; width: 100vw; }
          .hamburger-btn { display: flex; }
          
          /* Modais estilo "Bottom Sheet" (Sobe do rodapé) */
          .modal-overlay { align-items: flex-end; padding: 0; }
          .modal-content { max-height: 90vh; border-radius: 28px 28px 0 0; }
          .modal-content.mini-sheet { border-radius: 28px 28px 0 0; width: 100%; max-width: 100%; padding-bottom: calc(2rem + env(safe-area-inset-bottom)); }
          
          /* Estúdio de Edição: Toolbar Horizontal Scroll */
          .studio-toolbar { flex-direction: row; overflow-x: auto; overflow-y: hidden; flex-wrap: nowrap; padding: 1rem; border-bottom: 1px solid #edf2f7; -webkit-overflow-scrolling: touch; }
          .studio-toolbar::-webkit-scrollbar { display: none; }
          .studio-toolbar > div { flex-shrink: 0; }
          .studio-canvas { padding: 1rem; align-items: center; }

          /* Botões e Inputs encorpados para o dedo */
          .btn-mobile-full { width: 100%; justify-content: center; margin-top: 1rem; padding: 16px !important; }
          textarea.modern-input { min-height: 140px; }
          
          /* Ajuste do cabeçalho do Modal no mobile */
          .step-indicator { padding: 0 5%; }
        }

        .overlay { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 10, 20, 0.5); backdrop-filter: blur(3px); z-index: 9999; }
        .overlay.open { display: block; animation: fadeIn 0.3s; }
      `}</style>

      {/* TOAST NOTIFICATION */}
      {toast.show && (
        <div className="toast-enter" style={{ position: 'fixed', top: '24px', left: '50%', zIndex: 999999, backgroundColor: toastColors[toast.type], color: 'white', padding: '14px 28px', borderRadius: '50px', fontWeight: 'bold', boxShadow: '0 15px 35px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '12px', whiteSpace: 'nowrap' }}>
          {toast.type === 'success' ? '✨' : toast.type === 'error' ? '⚠️' : '⏳'} {toast.message}
        </div>
      )}

      {/* ================= ESTÚDIO DE EDIÇÃO FULLSCREEN ================= */}
      {editingImageId && (
        <div className="fullscreen-studio fade-in">
          <div className="studio-toolbar">
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: '150px' }}>
              <h3 style={{ margin: 0, color: 'var(--cor-roxo-escuro)', fontSize: '1.2rem', whiteSpace: 'nowrap' }}>🎨 Estúdio</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#888', whiteSpace: 'nowrap' }}>Toque para marcar</p>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className={`style-btn ${markerStyle === 'target' ? 'active' : ''}`} onClick={() => setMarkerStyle('target')}>🎯 Alvo</button>
                <button className={`style-btn ${markerStyle === 'dot' ? 'active' : ''}`} onClick={() => setMarkerStyle('dot')}>🟢 Lisa</button>
                <button className={`style-btn ${markerStyle === 'number' ? 'active' : ''}`} onClick={() => setMarkerStyle('number')}>🔢 Num.</button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '1.5rem', borderLeft: '2px solid #eee' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {coresDisponiveis.slice(0, 5).map(cor => (
                    <button key={cor} className={`color-btn ${markerColor === cor ? 'active' : ''}`} style={{ backgroundColor: cor }} onClick={() => setMarkerColor(cor)} />
                  ))}
                </div>
                <label className="color-picker-btn" style={{ backgroundColor: markerColor, cursor: 'pointer' }}>
                  <span style={{ mixBlendMode: 'difference', color: 'white', fontSize: '1.5rem', fontWeight: '300', paddingBottom: '2px' }}>+</span>
                  <input type="color" value={markerColor} onChange={handleColorPreview} onBlur={handleColorSave} style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%' }} />
                </label>
              </div>
            </div>
            <button onClick={() => setEditingImageId(null)} className="btn-hover" style={{ padding: '12px 24px', backgroundColor: 'var(--cor-rosa)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}>💾 Salvar Imagem</button>
          </div>

          <div className="studio-canvas">
            {prodImages.filter(img => img.id === editingImageId).map(img => (
              <div key={img.id} className="hotspot-wrapper" onClick={(e) => handleImageClickForHotspot(e, img.id)}>
                <img src={img.previewUrl} alt="Estúdio" className="hotspot-img" />
                {img.hotspots.map((hs, index) => (
                  <div key={hs.id} className="hotspot-marker" style={{ left: `${hs.x}%`, top: `${hs.y}%`, width: hs.style === 'target' ? '34px' : '28px', height: hs.style === 'target' ? '34px' : '28px' }}>
                    {hs.style === 'target' && (
                      <><div className="hotspot-pulse" style={{ backgroundColor: hs.color }}></div><svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={hs.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0px 3px 6px rgba(0,0,0,0.4))' }}><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg></>
                    )}
                    {hs.style === 'dot' && (
                      <><div className="hotspot-pulse" style={{ backgroundColor: hs.color }}></div><div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: hs.color, border: '3px solid white', boxShadow: '0 3px 8px rgba(0,0,0,0.3)' }}></div></>
                    )}
                    {hs.style === 'number' && (
                      <><div className="hotspot-pulse" style={{ backgroundColor: hs.color }}></div><div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: hs.color, border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 8px rgba(0,0,0,0.3)' }}><span style={{ color: hs.color === '#ffffff' ? '#000' : 'white', fontWeight: '900', fontSize: '14px' }}>{index + 1}</span></div></>
                    )}
                    <div className="hotspot-tooltip">
                      <div style={{ fontWeight: '900', color: 'var(--cor-roxo-escuro)', fontSize: '1.05rem', marginBottom: '8px', borderBottom: '1px solid #edf2f7', paddingBottom: '6px' }}>{hs.title || 'Sem título'}</div>
                      <div style={{ fontSize: '0.95rem', color: '#555', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{hs.description || 'Nenhuma explicação adicionada.'}</div>
                    </div>
                    <button onClick={(e) => removeHotspot(img.id, hs.id, e)} style={{ position: 'absolute', top: '-12px', right: '-12px', background: 'white', border: 'none', borderRadius: '50%', width: '26px', height: '26px', fontSize: '14px', color: '#e74c3c', cursor: 'pointer', boxShadow: '0 3px 8px rgba(0,0,0,0.3)', zIndex: 40 }}>✖</button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODAL DE PRODUTO WIZARD ================= */}
      {!editingImageId && isProdutoModalOpen && (
        <div className="modal-overlay" onClick={() => setIsProdutoModalOpen(false)}>
          <div className="modal-content slide-up" onClick={e => e.stopPropagation()}>
            <div style={{ padding: '1.5rem clamp(1.5rem, 4vw, 2rem)', backgroundColor: 'var(--cor-roxo-escuro)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: 'clamp(1.1rem, 3vw, 1.25rem)' }}>Cadastrar Novo Material</h2>
              <button onClick={() => { setIsProdutoModalOpen(false); setProdutoStep(1); setProdImages([]); }} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer', opacity: 0.8 }}>✖</button>
            </div>

            <div style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem)', overflowY: 'auto', flex: 1 }}>
              <div className="step-indicator">
                <div className={`step-dot ${produtoStep >= 1 ? (produtoStep === 1 ? 'active' : 'completed') : ''}`}>1</div>
                <div className={`step-dot ${produtoStep >= 2 ? (produtoStep === 2 ? 'active' : 'completed') : ''}`}>2</div>
                <div className={`step-dot ${produtoStep >= 3 ? (produtoStep === 3 ? 'active' : 'completed') : ''}`}>3</div>
              </div>

              {produtoStep === 1 && (
                <div className="fade-in">
                  <h3 style={{ color: 'var(--cor-roxo-escuro)', marginBottom: '1.5rem', fontSize: '1.4rem' }}>O que você está criando?</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 'bold', color: 'var(--cor-roxo-escuro)', marginBottom: '10px' }}>Nome do Material</label>
                      <input type="text" className="modern-input" placeholder="Ex: Guia Prático de Antibióticos" />
                    </div>

                    <div className="responsive-grid">
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '10px' }}>
                          <label style={{ fontWeight: 'bold', color: 'var(--cor-roxo-escuro)' }}>Matéria</label>
                          <button onClick={() => setShowNovaMateria(!showNovaMateria)} style={{ background: 'none', border: 'none', color: 'var(--cor-rosa)', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}>{showNovaMateria ? 'Cancelar' : '+ Nova'}</button>
                        </div>
                        {showNovaMateria ? (
                          <div className="fade-in" style={{ display: 'flex', gap: '8px' }}>
                            <input type="text" className="modern-input" placeholder="Ex: Pediatria" value={novaMateriaText} onChange={(e) => setNovaMateriaText(e.target.value)} autoFocus />
                            <button onClick={handleAddMateria} style={{ backgroundColor: 'var(--cor-lilas)', color: 'white', border: 'none', borderRadius: '12px', padding: '0 20px', fontWeight: 'bold', cursor: 'pointer' }}>OK</button>
                          </div>
                        ) : (
                          <select className="modern-input">
                            <option value="">Selecione...</option>
                            {materias.map((mat, idx) => <option key={idx} value={mat}>{mat}</option>)}
                          </select>
                        )}
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '10px' }}>
                          <label style={{ fontWeight: 'bold', color: 'var(--cor-roxo-escuro)' }}>Formato</label>
                          <button onClick={() => setShowNovoFormato(!showNovoFormato)} style={{ background: 'none', border: 'none', color: 'var(--cor-rosa)', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}>{showNovoFormato ? 'Cancelar' : '+ Novo'}</button>
                        </div>
                        {showNovoFormato ? (
                          <div className="fade-in" style={{ display: 'flex', gap: '8px' }}>
                            <input type="text" className="modern-input" placeholder="Ex: Tabela Excel" value={novoFormatoText} onChange={(e) => setNovoFormatoText(e.target.value)} autoFocus />
                            <button onClick={handleAddFormato} style={{ backgroundColor: 'var(--cor-lilas)', color: 'white', border: 'none', borderRadius: '12px', padding: '0 20px', fontWeight: 'bold', cursor: 'pointer' }}>OK</button>
                          </div>
                        ) : (
                          <select className="modern-input">
                            <option value="">Selecione...</option>
                            {formatos.map((form, idx) => <option key={idx} value={form}>{form}</option>)}
                          </select>
                        )}
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 'bold', color: 'var(--cor-roxo-escuro)', marginBottom: '10px' }}>Descrição Curta</label>
                      <textarea className="modern-input" rows={3} placeholder="Neste material você vai aprender..." style={{ resize: 'vertical' }}></textarea>
                    </div>
                  </div>
                </div>
              )}

              {produtoStep === 2 && (
                <div className="fade-in">
                  <h3 style={{ color: 'var(--cor-roxo-escuro)', marginBottom: '0.5rem', fontSize: '1.4rem' }}>A Vitrine Interativa</h3>
                  <p style={{ color: '#888', marginBottom: '1.5rem', lineHeight: '1.6' }}>Suba as fotos. Para criar materiais de "estudo ativo", edite as imagens adicionando marcadores explicativos!</p>
                  
                  <label className="btn-hover" style={{ display: 'block', padding: '2rem', border: '2px dashed var(--cor-lilas)', borderRadius: '20px', backgroundColor: '#fdfbfd', textAlign: 'center', cursor: 'pointer', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📸</div>
                    <h4 style={{ color: 'var(--cor-roxo-escuro)', margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>Toque para Subir Imagens</h4>
                    <input type="file" multiple accept="image/*" onChange={handleAddProductImages} style={{ display: 'none' }} />
                  </label>

                  {prodImages.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
                      {prodImages.map((img, index) => (
                        <div key={img.id} style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '16px', border: '1px solid #edf2f7', position: 'relative' }}>
                          <button onClick={() => removeProductImage(img.id)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.95)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', color: '#e74c3c', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}>✖</button>
                          <div style={{ height: '160px', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px', backgroundImage: `url(${img.previewUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                          <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', fontWeight: 'bold', color: '#555', textAlign: 'center' }}>Imagem {index + 1} ({img.hotspots.length} pontos)</p>
                          <button onClick={() => setEditingImageId(img.id)} className="btn-hover" style={{ width: '100%', padding: '12px', backgroundColor: 'var(--cor-lilas)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.95rem' }}>🎯 Adicionar Pontos</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {produtoStep === 3 && (
                <div className="fade-in">
                  <h3 style={{ color: 'var(--cor-roxo-escuro)', marginBottom: '0.5rem', fontSize: '1.4rem' }}>Preço e Arquivo Final</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem', backgroundColor: '#fcfafc', borderRadius: '16px', border: '2px solid #edf2f7' }}>
                      <input type="checkbox" id="toggle-gratis" checked={isGratuito} onChange={(e) => setIsGratuito(e.target.checked)} style={{ width: '24px', height: '24px', accentColor: 'var(--cor-rosa)' }} />
                      <label htmlFor="toggle-gratis" style={{ fontWeight: 'bold', color: 'var(--cor-texto-escuro)', cursor: 'pointer', flex: 1, fontSize: '1.05rem' }}>Material 100% Gratuito</label>
                    </div>
                    {!isGratuito && (
                      <div className="fade-in">
                        <label style={{ display: 'block', fontWeight: 'bold', color: 'var(--cor-roxo-escuro)', marginBottom: '10px' }}>Preço (R$)</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#a0aec0' }}>R$</span><input type="number" className="modern-input" placeholder="47,90" style={{ maxWidth: '180px', fontSize: '1.2rem', fontWeight: 'bold' }} /></div>
                      </div>
                    )}
                    <div>
                      <label style={{ display: 'block', fontWeight: 'bold', color: 'var(--cor-roxo-escuro)', marginBottom: '10px' }}>Arquivo PDF (Para os Alunos)</label>
                      <div style={{ padding: '1.5rem', border: '2px dashed #edf2f7', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div><p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#555' }}>Nenhum arquivo enviado</p></div>
                        <button className="btn-hover btn-mobile-full" style={{ padding: '12px 24px', backgroundColor: 'var(--cor-lilas)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Subir PDF 📎</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: '1.5rem clamp(1.5rem, 4vw, 2.5rem)', borderTop: '1px solid #edf2f7', backgroundColor: '#fcfafc', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
              <button onClick={() => setProdutoStep(prev => Math.max(1, prev - 1))} style={{ visibility: produtoStep === 1 ? 'hidden' : 'visible', padding: '14px 20px', backgroundColor: 'transparent', color: '#666', border: '2px solid #ddd', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>⬅️ Voltar</button>
              {produtoStep < 3 ? (
                <button onClick={() => setProdutoStep(prev => Math.min(3, prev + 1))} className="btn-hover" style={{ padding: '14px 32px', backgroundColor: 'var(--cor-roxo-escuro)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', flex: window.innerWidth <= 768 ? 1 : 'none' }}>Próximo Passo ➡️</button>
              ) : (
                <button onClick={() => { setIsProdutoModalOpen(false); showToast("Salvo!", "success"); }} className="btn-hover" style={{ padding: '14px 32px', backgroundColor: 'var(--cor-rosa)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', flex: window.innerWidth <= 768 ? 1 : 'none' }}>🚀 Publicar</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MINI-MODAL PARA DIGITAR TÍTULO E DESCRIÇÃO DO PONTO ================= */}
      {activeHotspotInput && (
        <div className="modal-overlay" style={{ zIndex: 9999999 }} onClick={() => setActiveHotspotInput(null)}>
          <div className="modal-content mini-sheet slide-up" style={{ maxWidth: '480px', padding: '2.5rem 2rem' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: 'var(--cor-roxo-escuro)', marginBottom: '0.5rem', fontSize: '1.4rem' }}>Detalhes do Marcador</h3>
            <p style={{ color: '#888', fontSize: '0.95rem', marginBottom: '2rem' }}>O estilo e a cor já foram salvos.</p>
            
            <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 'bold', color: 'var(--cor-roxo-escuro)', marginBottom: '8px', fontSize: '0.95rem' }}>Título (Ex: Córtex, Lei 8080...)</label>
              <input autoFocus type="text" className="modern-input" placeholder="Título curto..." value={prodImages.find(img => img.id === activeHotspotInput.imageId)?.hotspots.find(hs => hs.id === activeHotspotInput.hotspotId)?.title || ''} onChange={(e) => updateHotspotData('title', e.target.value)} />
            </div>

            <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontWeight: 'bold', color: 'var(--cor-roxo-escuro)', marginBottom: '8px', fontSize: '0.95rem' }}>Explicação para o Aluno</label>
              <textarea className="modern-input" rows={4} placeholder="Escreva o resumo aqui..." value={prodImages.find(img => img.id === activeHotspotInput.imageId)?.hotspots.find(hs => hs.id === activeHotspotInput.hotspotId)?.description || ''} onChange={(e) => updateHotspotData('description', e.target.value)} style={{ resize: 'vertical' }} />
            </div>
            
            <button onClick={() => setActiveHotspotInput(null)} className="btn-hover" style={{ padding: '16px 24px', backgroundColor: 'var(--cor-rosa)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', width: '100%', cursor: 'pointer', boxShadow: '0 5px 15px rgba(200,93,161,0.3)' }}>✅ Salvar Ponto</button>
          </div>
        </div>
      )}

      {/* ================= MODAL MODO FOCO (TEXTOS DO PERFIL) ================= */}
      {expandedField && (
        <div className="slide-up" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'white', zIndex: 99999, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fcfafc' }}>
            <div><h2 style={{ margin: 0, color: 'var(--cor-roxo-escuro)', fontSize: '1.3rem' }}>{expandedField.title}</h2><p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '0.9rem' }}>{expandedField.helper}</p></div>
            <button onClick={() => setExpandedField(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#888', cursor: 'pointer', padding: '10px' }}>✖</button>
          </div>
          <textarea autoFocus value={autorData[expandedField.name] as string || ''} onChange={handleChange} name={expandedField.name} maxLength={expandedField.maxLength} placeholder="Comece a digitar aqui..." style={{ flex: 1, padding: '1.5rem', fontSize: '1.15rem', border: 'none', outline: 'none', resize: 'none', lineHeight: '1.7', color: 'var(--cor-texto-escuro)', fontFamily: 'inherit' }} />
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fcfafc', paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
            <span style={{ color: (autorData[expandedField.name]?.length || 0) >= expandedField.maxLength ? '#e74c3c' : '#a0aec0', fontWeight: 'bold' }}>{(autorData[expandedField.name]?.length || 0)} / {expandedField.maxLength}</span>
            <button onClick={() => setExpandedField(null)} className="btn-hover" style={{ backgroundColor: 'var(--cor-rosa)', color: 'white', padding: '14px 28px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Concluído</button>
          </div>
        </div>
      )}

      {/* COMPONENTES EXTRAÍDOS */}
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} activeTab={activeTab} setActiveTab={setActiveTab} autorData={autorData} handleLogout={handleLogout} />

      <main className="main-content">
        <Topbar setIsSidebarOpen={setIsSidebarOpen} autorData={autorData} />

        <div className="content-area">
          {activeTab === 'visao-geral' && <VisaoGeralTab autorData={autorData} />}
          {activeTab === 'materiais' && <CatalogoTab setIsProdutoModalOpen={setIsProdutoModalOpen} />}
          {activeTab === 'sobre' && <PerfilTab autorData={autorData} setAutorData={setAutorData} handleChange={handleChange} handleImageUpload={handleImageUpload} uploadLoading={uploadLoading} isSaving={isSaving} handleSalvarSobreMim={handleSalvarSobreMim} handleTextareaClick={handleTextareaClick} />}
          {activeTab === 'textos-home' && <TextosHomeTab autorData={autorData} handleChange={handleChange} isSaving={isSaving} handleSalvarSobreMim={handleSalvarSobreMim} />}
        </div>
      </main>
    </div>
  );
}