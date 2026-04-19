import React, { useState, useRef, useEffect } from 'react';
import { Send, MapPin, Coffee, Signal, Wifi, Battery, Ticket, Bot, User } from 'lucide-react';
import { askConcierge, type ChatMessage } from './lib/concierge';

export default function FanAppSimulator() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I am your Sixth Man Concierge. How can I help you navigate the venue today?',
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const response = await askConcierge(userMsg.content);
    
    setIsTyping(false);
    setMessages(prev => [...prev, response]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  const suggestedQueries = [
    { label: '🍔 Wait Times', query: 'Shortest wait for food?' },
    { label: '🗺️ Navigation', query: 'Where is the nearest restroom?' },
    { label: '⬆️ Upgrades', query: 'Can I upgrade my seat?' },
    { label: '⏱️ Halftime', query: 'When is halftime?' },
  ];

  return (
    <div className="fanapp-container">

      {/* Left: Chat Interface */}
      <div className="fanapp-chat">

        {/* Chat Header */}
        <div className="fanapp-chat-header">
          <div className="fanapp-avatar">
            <Bot size={22} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>Sixth Man AI Concierge</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--status-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>● Online — Powered by Digital Twin</span>
          </div>
          <div style={{ display: 'flex', gap: '6px', color: 'var(--text-muted)' }}>
            <Signal size={14} />
            <Wifi size={14} />
            <Battery size={14} />
          </div>
        </div>

        {/* Messages */}
        <div className="fanapp-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`fanapp-msg-row ${msg.role === 'user' ? 'fanapp-msg-user' : 'fanapp-msg-bot'}`}>

              {msg.role === 'assistant' && (
                <div className="fanapp-msg-avatar">
                  <Bot size={16} color="var(--accent-primary)" />
                </div>
              )}

              <div className="fanapp-msg-group">
                <div className={`fanapp-bubble ${msg.role === 'user' ? 'fanapp-bubble-user' : 'fanapp-bubble-bot'}`}>
                  {msg.content}
                </div>

                {/* Rich Widget Renderer */}
                {msg.widget && (
                  <div className="fanapp-widget">
                    
                    {msg.widget.type === 'stand_info' && (
                      <div style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--accent-primary)' }}>
                          <Coffee size={18} />
                          <span style={{ fontWeight: 600 }}>{msg.widget.name}</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)'}}>
                          <span>Wait Time:</span> <strong style={{ color: 'var(--status-success)' }}>{msg.widget.waitTime}</strong>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px'}}>
                          <span>Walk Time:</span> <strong style={{color: '#fff'}}>{msg.widget.walkTime}</strong>
                        </div>
                        <button className="fanapp-widget-btn fanapp-widget-btn-cyan">
                          Order Ahead
                        </button>
                      </div>
                    )}

                    {msg.widget.type === 'route_map' && (
                      <div style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#fff' }}>
                          <MapPin size={18} color="var(--accent-secondary)" />
                          <span style={{ fontWeight: 500 }}>{msg.widget.destination}</span>
                        </div>
                        <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{msg.widget.distance} away • ~{msg.widget.predictedTime} walk</p>
                        <button className="fanapp-widget-btn fanapp-widget-btn-purple">
                          Start Navigation
                        </button>
                      </div>
                    )}

                    {msg.widget.type === 'upgrade_offer' && (
                      <div style={{ padding: '16px', borderTop: '2px solid var(--status-info)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#fff' }}>
                          <Ticket size={18} color="var(--status-info)" />
                          <span style={{ fontWeight: 500 }}>Premium Upgrade</span>
                        </div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{msg.widget.seat}</p>
                        <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', color: 'var(--status-success)' }}>Only {msg.widget.price} (was {msg.widget.originalPrice})</p>
                        <button className="fanapp-widget-btn fanapp-widget-btn-blue">
                          Upgrade Now
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="fanapp-msg-avatar fanapp-msg-avatar-user">
                  <User size={16} color="#fff" />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="fanapp-msg-row fanapp-msg-bot">
              <div className="fanapp-msg-avatar">
                <Bot size={16} color="var(--accent-primary)" />
              </div>
              <div className="fanapp-bubble fanapp-bubble-bot" style={{ display: 'flex', gap: '6px', padding: '14px 20px' }}>
                <div className="typing-dot" />
                <div className="typing-dot" style={{ animationDelay: '0.2s' }} />
                <div className="typing-dot" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Queries */}
        <div className="fanapp-suggestions">
          {suggestedQueries.map((sq) => (
            <button key={sq.label} onClick={() => setInput(sq.query)} className="fanapp-suggestion-chip">
              {sq.label}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="fanapp-input-area">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask the Sixth Man..." 
            className="fanapp-input"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className={`fanapp-send-btn ${input.trim() ? 'fanapp-send-btn-active' : ''}`}
          >
            <Send size={18} style={{ marginLeft: '2px' }} />
          </button>
        </div>
      </div>

      {/* Right: Info Panel */}
      <div className="fanapp-info-panel">
        <h2 style={{ color: '#fff', marginBottom: '16px', fontSize: '1.5rem' }}>AI Concierge (RAG)</h2>
        <p style={{ lineHeight: 1.6, marginBottom: '16px', color: 'var(--text-secondary)' }}>
          This demonstrates the <strong style={{ color: '#fff' }}>"Sixth Man" AI Concierge</strong> interface as experienced by attendees. It uses Retrieval-Augmented Generation to query the Digital Twin in real-time.
        </p>
        <div className="glass-panel" style={{ padding: '20px', marginTop: '24px' }}>
          <h4 style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', marginBottom: '12px' }}>💡 Try asking:</h4>
          <ul style={{ paddingLeft: '20px', margin: 0, lineHeight: 2.2, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <li>"Which hot dog stand has the shortest line?"</li>
            <li>"Shortest route to restroom near section 204"</li>
            <li>"Can I upgrade my seat?"</li>
            <li>"When is halftime?"</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
