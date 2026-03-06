import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `Você é a Lumos, assistente de marketing e conteúdo da Singular Mídias — criada para acompanhar empreendedoras que querem crescer com leveza, propósito e estratégia.

## Sua personalidade
- Acolhedora, próxima e direta — como uma amiga que entende muito de negócios
- Nunca usa jargões de marketing sem explicar
- Fala como gente real: sem "alavancar", "potencializar", "agregar valor"
- Encoraja sem ser superficial — celebra o progresso real, não só anima
- É honesta: quando algo não está claro, pergunta antes de responder
- Usa linguagem feminina quando fala com a aluna

## O que você sabe fazer

### 1. Raiz Estratégica
Guia pelos 3 pilares: Por Quê (dor + transformação), Como (método + diferencial), O Quê (oferta + promessa).
Ao final, gera frase de posicionamento (bio) e descrição da oferta.

### 2. Os 3 Movimentos do Fluxo
- **Conexão**: conteúdo de identificação — bastidores, valores, histórias, "eu também sinto isso"
- **Construção**: conteúdo de prova — guias, cases, depoimentos, como funciona
- **Decisão**: conteúdo de conversão — objeções, "como comprar", CTA direto, urgência
Sempre equilibra os 3 — conteúdo só de conexão não vende; só de decisão afasta.

### 3. Oferta comunicável
Ajuda a transformar a oferta em linguagem clara: mensagem de DM/WhatsApp, CTA padrão, processo de compra em 3 etapas, transformação tangível em 1 frase.

### 4. Impulso de Vendas
Orienta sobre: sequência de stories de venda (5 partes), retomada de leads, ativações simples, processo de compra, impulsionamento e parcerias.

### 5. Legendas e posts
Cria com primeiras linhas de recorte claro, storytelling real e CTA pensado para salvar/encaminhar/gerar DM.

### 6. Feedback de perfil
Avalia: @, foto, bio, feed, destaques, stories. Pede @ ou descrição antes de dar feedback.

## Memória
Lembra de tudo nessa conversa. Usa o contexto da aluna sem pedir de novo.

## Regras
- Nunca genérica — conecte ao contexto da aluna
- Se faltar contexto, faça UMA pergunta antes
- Respostas claras, sem textos enormes
- Nunca prometa resultados exatos`;

const MODULES = [
  {
    id: "movimentos",
    icon: "🌊",
    label: "3 Movimentos do Fluxo",
    color: "#93C5FD",
    colorDim: "rgba(147,197,253,0.12)",
    colorBorder: "rgba(147,197,253,0.35)",
    tagline: "Pare de postar no escuro. Publique com intenção.",
    sections: [
      {
        icon: "🤝",
        title: "Conexão",
        desc: "Cria identificação e aproxima. A pessoa se sente vista.",
        items: ["Bastidores do seu trabalho ou processo", "Valores e crenças da marca", "Histórias reais — desafios e conquistas", "\"Eu também sinto isso\" — o que seu público pensa mas não fala", "Rotina, dia a dia, lado humano"]
      },
      {
        icon: "🏗️",
        title: "Construção",
        desc: "Educa e gera autoridade. A pessoa começa a confiar.",
        items: ["Guias práticos e passo a passo", "Mini casos de sucesso de clientes", "Depoimentos com contexto (antes → depois)", "Como funciona seu método ou produto", "Erros comuns do seu nicho"]
      },
      {
        icon: "🎯",
        title: "Decisão",
        desc: "Convida para comprar. A pessoa toma uma ação.",
        items: ["Responder objeções reais do público", "\"Como funciona comprar\" — processo claro", "Oferta com CTA direto e natural", "Urgência real (vagas, prazo, condição)", "Retomada de leads no direct"]
      }
    ],
    prompts: [
      { label: "Ideias de Conexão", text: "Me dê 5 ideias de post de Conexão para minha oferta. Quero conteúdo que gere identificação real com meu público." },
      { label: "Post de Construção", text: "Escreva um post de Construção que mostre meu método ou resultado de cliente. Quero que gere autoridade e confiança." },
      { label: "Ideias de Decisão", text: "Me dê 5 objeções do meu público e transforme cada uma em ideia de post de Decisão com CTA natural." },
      { label: "Semana equilibrada", text: "Monte uma semana de conteúdo equilibrada com 1 post de cada movimento (Conexão, Construção e Decisão) para minha oferta." }
    ]
  },
  {
    id: "oferta",
    icon: "💎",
    label: "Oferta Comunicável",
    color: "#86EFAC",
    colorDim: "rgba(134,239,172,0.12)",
    colorBorder: "rgba(134,239,172,0.35)",
    tagline: "Consiga explicar o que vende sem travar.",
    sections: [
      {
        icon: "🎯",
        title: "Transformação tangível",
        desc: "O resultado prático em 1 frase — específico, não genérico.",
        items: ["Evite: \"te ajudo a crescer\"", "Prefira: \"sair de X posts por semana para atrair Y clientes por mês\"", "Foque no antes → depois concreto", "Use a linguagem que sua cliente usaria"]
      },
      {
        icon: "🛒",
        title: "Como compra (3 etapas)",
        desc: "Simplifica o processo para o cliente não travar na hora de contratar.",
        items: ["Etapa 1: como entrar em contato ou acessar", "Etapa 2: como funciona a conversa ou compra", "Etapa 3: o que acontece depois de contratar"]
      },
      {
        icon: "💬",
        title: "Mensagem de apresentação",
        desc: "5 linhas para DM ou WhatsApp — clara, natural, sem pressão.",
        items: ["Linha 1: quem você atende", "Linha 2: o problema que resolve", "Linha 3: como você faz isso", "Linha 4: o resultado que entrega", "Linha 5: CTA simples e direto"]
      }
    ],
    prompts: [
      { label: "Mensagem de venda (DM)", text: "Transforme minha oferta em uma mensagem de 5 linhas para DM — clara, natural e sem parecer panfleto." },
      { label: "Transformação em 1 frase", text: "Me ajude a escrever a transformação tangível da minha oferta em 1 frase específica e concreta." },
      { label: "3 variações de CTA", text: "Crie 3 variações de CTA para minha oferta: uma suave, uma média e uma direta." },
      { label: "Como comprar (3 etapas)", text: "Escreva o processo de compra do meu serviço em 3 etapas simples, que eu possa usar em stories ou posts." }
    ]
  },
  {
    id: "impulso",
    icon: "🚀",
    label: "Impulso de Vendas",
    color: "#FCA5A5",
    colorDim: "rgba(252,165,165,0.12)",
    colorBorder: "rgba(252,165,165,0.35)",
    tagline: "Agora que você tem a base, é hora de escalar.",
    sections: [
      {
        icon: "📱",
        title: "Sequência de stories de venda",
        desc: "5 partes que conduzem do problema ao convite sem forçar.",
        items: ["1. Situação — o que sua cliente está vivendo agora", "2. Erro comum — o que ela tenta e não funciona", "3. Explicação — por que isso acontece", "4. Prova — depoimento ou resultado real", "5. Convite — CTA claro e leve"]
      },
      {
        icon: "💌",
        title: "Retomada de leads",
        desc: "Reativar conversas paradas no direct ou WhatsApp.",
        items: ["Mensagem curta, sem pressão", "Conecte com algo relevante para ela", "Suave: \"lembrei de você quando...\"", "Direta: \"ainda tenho 1 vaga essa semana\"", "Sempre com próximo passo claro"]
      },
      {
        icon: "⚡",
        title: "Ativações simples",
        desc: "Movimentos pequenos que geram impulso de vendas.",
        items: ["Semana de vagas abertas", "Condição especial por tempo limitado", "Agenda aberta com link direto", "Oferta relâmpago (24–48h)", "Convite exclusivo para lista ou grupo"]
      }
    ],
    prompts: [
      { label: "Sequência de stories", text: "Crie uma sequência de 5 stories de venda para minha oferta com linguagem natural — situação, erro, explicação, prova e convite." },
      { label: "Retomar leads", text: "Escreva 2 mensagens curtas para retomar leads parados: uma suave e uma mais direta." },
      { label: "Ativação simples", text: "Me sugira 3 ativações simples que posso rodar essa semana para gerar vendas sem parecer desesperada." },
      { label: "Post de decisão", text: "Crie 1 post de decisão que responde uma objeção comum do meu público e termina com um convite natural para comprar." }
    ]
  }
];

const SHORTCUTS = [
  { icon: "🌴", label: "Raiz Estratégica", prompt: "Quero mapear minha Raiz Estratégica. Por onde começo?" },
  { icon: "✍️", label: "Criar legenda", prompt: "Me ajuda a criar uma legenda para o Instagram?" },
  { icon: "🏡", label: "Revisar perfil", prompt: "Quero um feedback do meu perfil no Instagram." },
];

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "4px 0" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: "50%", background: "#C4B5FD",
          animation: "bounce 1.2s infinite", animationDelay: `${i * 0.2}s`
        }} />
      ))}
      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}`}</style>
    </div>
  );
}

function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: 16, alignItems: "flex-end", gap: 8 }}>
      {!isUser && (
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#C4B5FD,#F9A8D4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>✦</div>
      )}
      <div style={{
        maxWidth: "75%", background: isUser ? "#1C1917" : "#FAFAF9",
        border: isUser ? "none" : "1.5px solid #E7E5E4",
        borderRadius: isUser ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
        padding: "12px 16px", fontFamily: "'DM Sans',sans-serif", fontSize: 14,
        color: isUser ? "#F5F5F4" : "#1C1917", lineHeight: 1.65, whiteSpace: "pre-wrap", wordBreak: "break-word"
      }}>{msg.content}</div>
    </div>
  );
}

function ModulePanel({ module, onSendPrompt, onClose }) {
  const [activeSection, setActiveSection] = useState(0);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(28,25,23,0.6)", zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: "#F7F4EE", borderRadius: "16px 16px 0 0", width: "100%", maxWidth: 720,
        maxHeight: "85vh", overflow: "hidden", display: "flex", flexDirection: "column",
        animation: "slideUp 0.25s ease"
      }}>
        <style>{`@keyframes slideUp{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>

        {/* Panel header */}
        <div style={{ background: "#1C1917", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>{module.icon}</span>
            <div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, color: "#F5F5F4" }}>{module.label}</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#78716C", marginTop: 1 }}>{module.tagline}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#57534E", fontSize: 20, cursor: "pointer", lineHeight: 1 }}>✕</button>
        </div>

        <div style={{ overflowY: "auto", flex: 1 }}>
          {/* Section tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #E7E5E4", background: "#F0EDE6" }}>
            {module.sections.map((s, i) => (
              <button key={i} onClick={() => setActiveSection(i)} style={{
                flex: 1, padding: "12px 8px", border: "none",
                borderBottom: activeSection === i ? `2px solid ${module.color}` : "2px solid transparent",
                background: "none", cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: activeSection === i ? 600 : 500,
                color: activeSection === i ? "#1C1917" : "#A8A29E", marginBottom: -1, transition: "all 0.15s"
              }}>
                {s.icon} {s.title}
              </button>
            ))}
          </div>

          <div style={{ padding: "20px" }}>
            {/* Section content */}
            {(() => {
              const s = module.sections[activeSection];
              return (
                <div>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#78716C", margin: "0 0 16px", fontStyle: "italic" }}>{s.desc}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                    {s.items.map((item, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <span style={{ color: module.color, fontSize: 10, marginTop: 5, flexShrink: 0 }}>◆</span>
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#44403C", lineHeight: 1.55 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Prompts */}
            <div style={{ borderTop: "1px solid #E7E5E4", paddingTop: 20 }}>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, color: "#A8A29E", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
                ✦ Pedir à Lumos
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 8 }}>
                {module.prompts.map((p, i) => (
                  <button key={i} onClick={() => { onSendPrompt(p.text); onClose(); }} style={{
                    background: module.colorDim, border: `1.5px solid ${module.colorBorder}`,
                    borderRadius: 8, padding: "11px 14px", cursor: "pointer", textAlign: "left",
                    fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, color: "#1C1917",
                    lineHeight: 1.4, transition: "all 0.15s"
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = module.colorBorder.replace("0.35","0.2")}
                    onMouseLeave={e => e.currentTarget.style.background = module.colorDim}>
                    {p.label} →
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState({ nicho: "", nome: "" });
  const [showContext, setShowContext] = useState(false);
  const [activeModule, setActiveModule] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);
    const contextNote = (context.nicho || context.nome)
      ? `\n\n## Contexto da aluna\n${context.nome ? `- Nome: ${context.nome}\n` : ""}${context.nicho ? `- Negócio: ${context.nicho}` : ""}`
      : "";
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: SYSTEM_PROMPT + contextNote,
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();
      const reply = data.content?.map(b => b.text || "").join("") || "Ops, não consegui responder agora. Tenta de novo?";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
      if (!context.nicho && newMessages.length <= 4) {
        const lower = userText.toLowerCase();
        if (["sou ", "trabalho com", "meu negócio", "vendo", "atendo"].some(h => lower.includes(h)))
          setContext(prev => ({ ...prev, nicho: userText.slice(0, 120) }));
      }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Ops, algo deu errado. Tenta de novo em instantes ✦" }]);
    }
    setLoading(false);
    inputRef.current?.focus();
  };

  const isEmpty = messages.length === 0;

  return (
    <div style={{ fontFamily: "'Lora','Georgia',serif", background: "#F7F4EE", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: "#1C1917", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#C4B5FD,#F9A8D4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✦</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: "#F5F5F4", lineHeight: 1.1 }}>Lumos</div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#78716C" }}>Singular Mídias · Assistente MME</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setShowContext(!showContext)} style={{
            background: context.nicho ? "rgba(196,181,253,0.2)" : "transparent",
            border: `1px solid ${context.nicho ? "rgba(196,181,253,0.4)" : "#2C2927"}`,
            borderRadius: 6, padding: "6px 10px", cursor: "pointer",
            fontFamily: "'DM Sans',sans-serif", fontSize: 11,
            color: context.nicho ? "#C4B5FD" : "#57534E"
          }}>{context.nicho ? "✦ contexto salvo" : "＋ contexto"}</button>
          {messages.length > 0 && (
            <button onClick={() => { setMessages([]); setContext({ nicho: "", nome: "" }); }} style={{
              background: "transparent", border: "1px solid #2C2927", borderRadius: 6,
              padding: "6px 10px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#57534E"
            }}>Nova conversa</button>
          )}
        </div>
      </div>

      {/* Context panel */}
      {showContext && (
        <div style={{ background: "#F0EDE6", borderBottom: "1px solid #E7E5E4", padding: "16px 20px" }}>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, color: "#A8A29E", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Contexto da sessão</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 160 }}>
              <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#78716C", display: "block", marginBottom: 4 }}>Seu nome</label>
              <input value={context.nome} onChange={e => setContext(p => ({ ...p, nome: e.target.value }))} placeholder="Ex: Ana" style={{ width: "100%", boxSizing: "border-box", fontFamily: "'DM Sans',sans-serif", fontSize: 13, background: "#FAFAF9", border: "1.5px solid #E7E5E4", borderRadius: 6, padding: "8px 12px", color: "#1C1917", outline: "none" }} />
            </div>
            <div style={{ flex: 2, minWidth: 220 }}>
              <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#78716C", display: "block", marginBottom: 4 }}>Seu negócio / nicho</label>
              <input value={context.nicho} onChange={e => setContext(p => ({ ...p, nicho: e.target.value }))} placeholder="Ex: nutricionista para mães, loja de roupas femininas..." style={{ width: "100%", boxSizing: "border-box", fontFamily: "'DM Sans',sans-serif", fontSize: 13, background: "#FAFAF9", border: "1.5px solid #E7E5E4", borderRadius: 6, padding: "8px 12px", color: "#1C1917", outline: "none" }} />
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px", maxWidth: 720, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        {isEmpty ? (
          <div style={{ textAlign: "center", paddingTop: 12 }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg,#C4B5FD,#F9A8D4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 14px" }}>✦</div>
            <h2 style={{ fontSize: 21, fontWeight: 600, margin: "0 0 8px", color: "#1C1917" }}>Olá! Eu sou a <em style={{ fontStyle: "italic", color: "#C4B5FD" }}>Lumos</em></h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#78716C", margin: "0 0 28px", lineHeight: 1.6, maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
              Sua assistente do MME. Explore os módulos abaixo ou me faça uma pergunta direta.
            </p>

            {/* MODULE CARDS */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24, textAlign: "left" }}>
              {MODULES.map(mod => (
                <button key={mod.id} onClick={() => setActiveModule(mod)} style={{
                  background: "#FAFAF9", border: `1.5px solid ${mod.colorBorder}`,
                  borderRadius: 12, padding: "16px 18px", cursor: "pointer", textAlign: "left",
                  display: "flex", alignItems: "center", gap: 14, transition: "all 0.2s"
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = mod.colorDim; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#FAFAF9"; }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: mod.colorDim, border: `1px solid ${mod.colorBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{mod.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, color: "#1C1917", marginBottom: 2 }}>{mod.label}</div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#78716C" }}>{mod.tagline}</div>
                  </div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: mod.color }}>→</div>
                </button>
              ))}
            </div>

            {/* Quick shortcuts */}
            <div style={{ borderTop: "1px solid #E7E5E4", paddingTop: 20 }}>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, color: "#C7C3BB", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Acesso rápido</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                {SHORTCUTS.map((s, i) => (
                  <button key={i} onClick={() => sendMessage(s.prompt)} style={{
                    background: "#F0EDE6", border: "1.5px solid #E7E5E4", borderRadius: 10,
                    padding: "12px 10px", cursor: "pointer", textAlign: "center",
                    fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 500, color: "#57534E",
                    transition: "all 0.15s"
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#C4B5FD"; e.currentTarget.style.color = "#1C1917"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#E7E5E4"; e.currentTarget.style.color = "#57534E"; }}>
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => <Message key={i} msg={msg} />)}
            {loading && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#C4B5FD,#F9A8D4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>✦</div>
                <div style={{ background: "#FAFAF9", border: "1.5px solid #E7E5E4", borderRadius: "4px 18px 18px 18px", padding: "12px 16px" }}>
                  <TypingDots />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div style={{ background: "#F7F4EE", borderTop: "1px solid #E7E5E4", padding: "14px 20px", flexShrink: 0 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", gap: 10, alignItems: "flex-end" }}>
          <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Escreva sua dúvida ou peça ajuda à Lumos… (Enter para enviar)"
            rows={1}
            style={{ flex: 1, fontFamily: "'DM Sans',sans-serif", fontSize: 14, background: "#FAFAF9", border: "1.5px solid #E7E5E4", borderRadius: 12, padding: "12px 16px", color: "#1C1917", resize: "none", lineHeight: 1.5, outline: "none", maxHeight: 120, overflowY: "auto", transition: "border-color 0.2s" }}
            onFocus={e => e.target.style.borderColor = "#C4B5FD"}
            onBlur={e => e.target.style.borderColor = "#E7E5E4"} />
          <button onClick={() => sendMessage()} disabled={!input.trim() || loading} style={{
            width: 44, height: 44, borderRadius: "50%", border: "none",
            cursor: input.trim() && !loading ? "pointer" : "not-allowed",
            background: input.trim() && !loading ? "linear-gradient(135deg,#C4B5FD,#F9A8D4)" : "#E7E5E4",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, flexShrink: 0, transition: "all 0.2s"
          }}>{loading ? "·" : "↑"}</button>
        </div>
        <div style={{ maxWidth: 720, margin: "6px auto 0", fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#C7C3BB", textAlign: "center" }}>
          Shift+Enter para nova linha · A Lumos lembra do contexto durante a conversa
        </div>
      </div>

      {/* Module panel overlay */}
      {activeModule && (
        <ModulePanel
          module={activeModule}
          onSendPrompt={sendMessage}
          onClose={() => setActiveModule(null)}
        />
      )}
    </div>
  );
}
