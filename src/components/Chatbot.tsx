import { useState, useRef, useEffect } from 'react';
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

// --- TRADUTOR UNIVERSAL DA IA (MARKDOWN) ---
const formatarTexto = (texto: string) => {
  // Regex inteligente que captura Links, Negritos e Itálicos (ignorando os asteriscos de listas)
  const regex = /(\[.+?\]\(.+?\))|(\*\*.*?\*\*)|(\*(?!\s)[^*]+\*)/g;
  const partes = texto.split(regex);

  return partes.map((parte, index) => {
    if (!parte) return null;

    // 1. Traduz Links: [Texto do Link](https://link.com)
    const linkMatch = parte.match(/^\[(.+?)\]\((.+?)\)$/);
    if (linkMatch) {
      return (
        <a key={index} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cor-rosa)', textDecoration: 'underline', fontWeight: 'bold' }}>
          {linkMatch[1]}
        </a>
      );
    }

    // 2. Traduz Negrito: **texto**
    if (parte.startsWith('**') && parte.endsWith('**')) {
      return <strong key={index} style={{ fontWeight: 800 }}>{parte.slice(2, -2)}</strong>;
    }

    // 3. Traduz Itálico: *texto*
    if (parte.startsWith('*') && parte.endsWith('*') && parte.length > 2) {
      return <em key={index}>{parte.slice(1, -1)}</em>;
    }

    // 4. Texto Normal e Quebras de Linha (O CSS whiteSpace pre-wrap resolve as listas \n)
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
      if (dados) {
        setAutorData(dados);
      }
    };
    buscarDados();
  }, []);

  const botName = autorData?.chatbotName || 'Assistente IA';
  const botPrompt = autorData?.chatbotPrompt || SYSTEM_PROMPT_PADRAO;

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
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const callAI = async (userInput: string) => {
    if (!apiKey) {
      console.error("ERRO: A chave da API não foi encontrada no .env!");
      return "Ops! Minha inteligência artificial está sem a chave de acesso. 🛠️";
    }

    try {
      let memoriaDaConversa = botPrompt + "\n\n--- HISTÓRICO DA CONVERSA ---\n";
      
      chatHistory.forEach(msg => {
        memoriaDaConversa += `${msg.role === 'user' ? 'Aluno' : botName}: ${msg.parts[0].text}\n`;
      });
      
      memoriaDaConversa += `Aluno: ${userInput}\n${botName}:`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: memoriaDaConversa,
      });
      
      const responseText = response.text || "Poxa, fiquei sem palavras! Pode repetir?";
      
      setChatHistory(prev => [
        ...prev, 
        { role: "user", parts: [{ text: userInput }] },
        { role: "model", parts: [{ text: responseText }] }
      ]);

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
        style={{
          position: 'fixed', bottom: '2rem', right: '2rem', width: '60px', height: '60px',
          borderRadius: '50%', backgroundColor: 'var(--cor-rosa)', color: 'white',
          border: 'none', cursor: 'pointer', zIndex: 10000, display: 'flex', 
          alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 10px 25px rgba(200,93,161,0.4)', transition: 'transform 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="chatbot-window" style={{
          position: 'fixed', bottom: '6rem', right: '2rem', width: '380px', height: '550px', maxWidth: 'calc(100vw - 2rem)',
          backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
          zIndex: 9998, display: 'flex', flexDirection: 'column', overflow: 'hidden',
          border: '1px solid #edf2f7', animation: 'slideUp 0.3s ease-out'
        }}>
          
          <div style={{ backgroundColor: 'var(--cor-roxo-escuro)', padding: '1.2rem', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'var(--cor-lilas)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>🤖</div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>{botName}</h4>
                <span style={{ fontSize: '0.8rem', color: '#e0d4e5', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', backgroundColor: '#4ade80', borderRadius: '50%', display: 'inline-block' }}></span> Online
                </span>
              </div>
            </div>
            
            <button className="header-close-btn" onClick={() => setIsOpen(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div style={{ flex: 1, padding: '1.2rem', overflowY: 'auto', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                
                {!msg.isOptions && (
                  <div style={{
                    maxWidth: '85%', padding: '12px 16px', borderRadius: '18px', fontSize: '0.95rem', lineHeight: '1.5',
                    backgroundColor: msg.sender === 'user' ? 'var(--cor-rosa)' : 'white',
                    color: msg.sender === 'user' ? 'white' : '#333',
                    borderBottomRightRadius: msg.sender === 'user' ? '4px' : '18px',
                    borderBottomLeftRadius: msg.sender === 'bot' ? '4px' : '18px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: msg.sender === 'bot' ? '1px solid #edf2f7' : 'none',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {/* A MÁGICA ACONTECE AQUI: Chamamos o tradutor */}
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
                <span className="typing-dot" style={{ width: '8px', height: '8px', backgroundColor: '#a0aec0', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both' }}></span>
                <span className="typing-dot" style={{ width: '8px', height: '8px', backgroundColor: '#a0aec0', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.2s' }}></span>
                <span className="typing-dot" style={{ width: '8px', height: '8px', backgroundColor: '#a0aec0', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.4s' }}></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: '12px', backgroundColor: 'white', borderTop: '1px solid #edf2f7', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input 
              className="chat-input-field"
              type="text" 
              placeholder={`Pergunte à ${botName}...`} 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
              disabled={isTyping}
            />
            <button 
              className="chat-send-btn"
              onClick={() => handleSend(inputValue)}
              disabled={isTyping || !inputValue.trim()}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, width: '45px', height: '45px', minWidth: '45px' }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
              </svg>
            </button>
          </div>
          
          <style>{`
            @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
            @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            
            .chat-input-field {
              flex: 1;
              padding: 12px 16px;
              border-radius: 20px;
              border: 1px solid #edf2f7;
              outline: none;
              background-color: #f8fafc;
              font-size: 0.95rem;
              color: var(--cor-texto-escuro);
              transition: all 0.2s ease;
            }
            .chat-input-field:focus {
              border-color: var(--cor-lilas);
              background-color: white;
              box-shadow: 0 0 0 3px rgba(162, 102, 184, 0.1);
            }

            .chat-send-btn {
              border-radius: 50%;
              background-color: var(--cor-lilas);
              color: white;
              border: none;
              cursor: pointer;
              transition: all 0.2s;
            }
            .chat-send-btn:disabled {
              opacity: 0.5;
              cursor: not-allowed;
            }
            .chat-send-btn:not(:disabled):hover {
              background-color: var(--cor-roxo-escuro);
              transform: scale(1.05);
            }

            .chat-option-btn {
              background: white;
              border: 1px solid var(--cor-lilas);
              color: var(--cor-roxo-escuro);
              padding: 10px 14px;
              border-radius: 20px;
              font-size: 0.9rem;
              cursor: pointer;
              text-align: left;
              transition: all 0.2s;
              font-weight: 600;
            }
            .chat-option-btn:hover {
              background: var(--cor-lilas);
              color: white;
            }

            .header-close-btn {
              background: transparent;
              border: none;
              color: white;
              cursor: pointer;
              display: none;
              padding: 5px;
            }

            @media (max-width: 768px) {
              .chatbot-window { 
                bottom: 0 !important; 
                right: 0 !important; 
                width: 100vw !important; 
                height: 100vh !important; 
                max-width: 100vw !important;
                border-radius: 0 !important; 
                z-index: 9998 !important;
              }
              .header-close-btn { display: block; }
              .floating-chatbot-btn.chat-open { display: none !important; }
            }
          `}</style>
        </div>
      )}
    </>
  );
}