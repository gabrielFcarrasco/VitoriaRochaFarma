import { useState, useRef, useEffect, ReactNode } from 'react';
import { GoogleGenAI } from '@google/genai';
import { autorService } from '../config/autorService';
import type { AutorInfo } from '../config/autorService';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

type Message = {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  isOptions?: boolean;
};

const SYSTEM_PROMPT_PADRAO = `
Você é a assistente virtual inteligente da VR FARMA, uma plataforma premium de materiais de estudo de farmacologia.
Regras de ouro:
1. Mantenha o cliente no site. Ajude-o a finalizar a compra aqui mesmo.
2. Formato: O acesso chega na hora por e-mail após a compra. Tudo é em PDF de alta qualidade.
3. Pagamento: Aceitamos Pix, Cartão em até 12x e Boleto.
4. Seja extremamente simpática e use emojis. Responda de forma concisa.
`;

// --- GALERIA DE AVATARES (SVGs Fofos) ---
export const BOT_AVATARS: Record<string, ReactNode> = {
  roboFofo: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="6" width="16" height="12" rx="4"></rect>
      <line x1="12" y1="2" x2="12" y2="6"></line>
      <circle cx="12" cy="2" r="1.5" fill="currentColor"></circle>
      <circle cx="9" cy="12" r="1.5" fill="currentColor"></circle>
      <circle cx="15" cy="12" r="1.5" fill="currentColor"></circle>
      <path d="M10 16h4"></path>
    </svg>
  ),
  pilulaFeliz: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="8" ry="8"></rect>
      <line x1="4" y1="12" x2="20" y2="12"></line>
      <circle cx="9" cy="8" r="1.5" fill="currentColor"></circle>
      <circle cx="15" cy="8" r="1.5" fill="currentColor"></circle>
      <path d="M10 16c1 1 3 1 4 0"></path>
    </svg>
  ),
  coracaoMedico: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      <path d="M12 9v5"></path>
      <path d="M9.5 11.5h5"></path>
    </svg>
  ),
  estrelaMagica: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
    </svg>
  ),
  atendente: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 11c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"></path>
      <path d="M18 21v-2a4 4 0 0 0-4-4H10a4 4 0 0 0-4 4v2"></path>
      <circle cx="18" cy="8" r="2.5" fill="currentColor"></circle>
      <path d="M22 11s-1.5 1.5-3 1.5"></path>
    </svg>
  )
};

const formatarTexto = (texto: string) => {
  const regex = /(\[.+?\]\(.+?\))|(\*\*.*?\*\*)|(\*(?!\s)[^*]+\*)/g;
  const partes = texto.split(regex);

  return partes.map((parte, index) => {
    if (!parte) return null;
    const linkMatch = parte.match(/^\[(.+?)\]\((.+?)\)$/);
    if (linkMatch) {
      return <a key={index} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cor-rosa)', textDecoration: 'underline', fontWeight: 'bold' }}>{linkMatch[1]}</a>;
    }
    if (parte.startsWith('**') && parte.endsWith('**')) return <strong key={index} style={{ fontWeight: 800 }}>{parte.slice(2, -2)}</strong>;
    if (parte.startsWith('*') && parte.endsWith('*') && parte.length > 2) return <em key={index}>{parte.slice(1, -1)}</em>;
    return <span key={index}>{parte}</span>;
  });
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [chatHistory, setChatHistory] = useState<{role: string, parts: {text: string}[]}[]>([]);
  const [autorData, setAutorData] = useState<AutorInfo | null>(null);

  useEffect(() => {
    const buscarDados = async () => {
      const dados = await autorService.getAutorInfo();
      if (dados) setAutorData(dados);
    };
    buscarDados();
  }, []);

  const botName = autorData?.chatbotName || 'Assistente IA';
  const botPrompt = autorData?.chatbotPrompt || SYSTEM_PROMPT_PADRAO;
  
  // Pega o avatar do banco ou usa o 'roboFofo' como padrão
  const AvatarAtual = BOT_AVATARS[autorData?.chatbotAvatar || 'roboFofo'];

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Carregando...', sender: 'bot' },
    { id: '2', text: 'Escolha uma opção rápida ou digite sua dúvida abaixo:', sender: 'bot', isOptions: true }
  ]);

  useEffect(() => {
    setMessages(prev => {
      const novasMensagens = [...prev];
      novasMensagens[0] = { 
        id: '1', 
        text: `Olá! Eu sou a **${botName}**, a assistente virtual da VR FARMA. 💊✨\n\nEstou aqui para tirar suas dúvidas sobre nossos materiais, formas de acesso e pagamentos. Como posso ajudar a destravar seus estudos hoje?`, 
        sender: 'bot' 
      };
      return novasMensagens;
    });
  }, [botName]);

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const callAI = async (userInput: string) => {
    if (!apiKey) return "Ops! Minha inteligência artificial está sem a chave de acesso. 🛠️";
    try {
      let memoriaDaConversa = botPrompt + "\n\n--- HISTÓRICO DA CONVERSA ---\n";
      chatHistory.forEach(msg => { memoriaDaConversa += `${msg.role === 'user' ? 'Aluno' : botName}: ${msg.parts[0].text}\n`; });
      memoriaDaConversa += `Aluno: ${userInput}\n${botName}:`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: memoriaDaConversa,
      });
      
      const responseText = response.text || "Poxa, fiquei sem palavras! Pode repetir?";
      setChatHistory(prev => [ ...prev, { role: "user", parts: [{ text: userInput }] }, { role: "model", parts: [{ text: responseText }] } ]);
      return responseText;
    } catch (error: any) {
      console.error("Erro detalhado da IA:", error?.message || error);
      return "Poxa, minha conexão falhou por um segundo. Pode repetir a pergunta? 😅";
    }
  };

  const handleSend = async (textOrInput: string) => {
    if (!textOrInput.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), text: textOrInput, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    const botResponseText = await callAI(textOrInput);
    const botMsg: Message = { id: (Date.now() + 1).toString(), text: botResponseText, sender: 'bot' };
    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  return (
    <>
      <button 
        className={`floating-chatbot-btn ${isOpen ? 'chat-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        style={{ position: 'fixed', bottom: '2rem', right: '2rem', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--cor-rosa)', color: 'white', border: 'none', cursor: 'pointer', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px rgba(200,93,161,0.4)', transition: 'transform 0.2s' }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        )}
      </button>

      {isOpen && (
        <div className="chatbot-window" style={{ position: 'fixed', bottom: '90px', right: '30px', width: '360px', height: '600px', maxHeight: 'calc(100vh - 120px)', backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 15px 40px rgba(0,0,0,0.15)', zIndex: 9998, display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #edf2f7', animation: 'slideUp 0.3s ease-out' }}>
          
          <div style={{ backgroundColor: 'var(--cor-roxo-escuro)', padding: '1.2rem', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              
              {/* O AVATAR DINÂMICO É RENDERIZADO AQUI */}
              <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'var(--cor-lilas)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                {AvatarAtual}
              </div>

              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>{botName}</h4>
                <span style={{ fontSize: '0.8rem', color: '#e0d4e5', display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', backgroundColor: '#4ade80', borderRadius: '50%', display: 'inline-block' }}></span> Online</span>
              </div>
            </div>
            
            <button className="header-close-btn" onClick={() => setIsOpen(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <div style={{ flex: 1, padding: '1.2rem', overflowY: 'auto', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                {!msg.isOptions && (
                  <div style={{ maxWidth: '85%', padding: '12px 16px', borderRadius: '18px', fontSize: '0.95rem', lineHeight: '1.5', backgroundColor: msg.sender === 'user' ? 'var(--cor-rosa)' : 'white', color: msg.sender === 'user' ? 'white' : '#333', borderBottomRightRadius: msg.sender === 'user' ? '4px' : '18px', borderBottomLeftRadius: msg.sender === 'bot' ? '4px' : '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: msg.sender === 'bot' ? '1px solid #edf2f7' : 'none', whiteSpace: 'pre-wrap' }}>
                    {formatarTexto(msg.text)}
                  </div>
                )}
                {msg.isOptions && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px', width: '100%' }}>
                    <button onClick={() => handleSend('Como recebo o acesso aos materiais?')} className="chat-option-btn">📦 Como recebo o acesso?</button>
                    <button onClick={() => handleSend('Posso imprimir os PDFs?')} className="chat-option-btn">🖨️ Posso imprimir o material?</button>
                    <button onClick={() => handleSend('Quais são as formas de pagamento?')} className="chat-option-btn">💳 Formas de pagamento</button>
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex', gap: '4px', padding: '12px 16px', backgroundColor: 'white', borderRadius: '18px', borderBottomLeftRadius: '4px', width: '65px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #edf2f7' }}>
                <span className="typing-dot" style={{ width: '8px', height: '8px', backgroundColor: '#a0aec0', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both' }}></span><span className="typing-dot" style={{ width: '8px', height: '8px', backgroundColor: '#a0aec0', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.2s' }}></span><span className="typing-dot" style={{ width: '8px', height: '8px', backgroundColor: '#a0aec0', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.4s' }}></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: '12px', backgroundColor: 'white', borderTop: '1px solid #edf2f7', display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
            <input className="chat-input-field" type="text" placeholder={`Pergunte à ${botName}...`} value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)} disabled={isTyping} />
            <button className="chat-send-btn" onClick={() => handleSend(inputValue)} disabled={isTyping || !inputValue.trim()} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, width: '45px', height: '45px', minWidth: '45px' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
            </button>
          </div>
          
          <style>{`
            @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
            @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            .chat-input-field { flex: 1; padding: 12px 16px; border-radius: 20px; border: 1px solid #edf2f7; outline: none; background-color: #f8fafc; font-size: 0.95rem; color: var(--cor-texto-escuro); transition: all 0.2s ease; }
            .chat-input-field:focus { border-color: var(--cor-lilas); background-color: white; box-shadow: 0 0 0 3px rgba(162, 102, 184, 0.1); }
            .chat-send-btn { border-radius: 50%; background-color: var(--cor-lilas); color: white; border: none; cursor: pointer; transition: all 0.2s; }
            .chat-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
            .chat-send-btn:not(:disabled):hover { background-color: var(--cor-roxo-escuro); transform: scale(1.05); }
            .chat-option-btn { background: white; border: 1px solid var(--cor-lilas); color: var(--cor-roxo-escuro); padding: 10px 14px; border-radius: 20px; font-size: 0.9rem; cursor: pointer; text-align: left; transition: all 0.2s; font-weight: 600; }
            .chat-option-btn:hover { background: var(--cor-lilas); color: white; }
            .header-close-btn { background: transparent; border: none; color: white; cursor: pointer; display: none; padding: 5px; }
            @media (max-width: 768px) {
              .chatbot-window { top: 0 !important; bottom: 0 !important; left: 0 !important; right: 0 !important; width: 100% !important; height: 100% !important; max-width: none !important; max-height: none !important; border-radius: 0 !important; z-index: 99999 !important; }
              .header-close-btn { display: block; }
              .floating-chatbot-btn.chat-open { display: none !important; }
            }
          `}</style>
        </div>
      )}
    </>
  );
}