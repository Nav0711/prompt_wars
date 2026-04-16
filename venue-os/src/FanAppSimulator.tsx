import React, { useState, useRef, useEffect } from 'react';
import { Send, MapPin, Coffee, ChevronLeft, Signal, Wifi, Battery, Ticket } from 'lucide-react';
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

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '32px' }}>
      
      {/* Phone Case */}
      <div style={{
        width: '375px', height: '812px', background: '#000', borderRadius: '48px',
        border: '8px solid #1f2128', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.1)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative'
      }}>
        
        {/* iOS Status Bar Mock */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 24px 10px', fontSize: '12px', fontWeight: 600, color: '#fff', zIndex: 10 }}>
          <span>19:41</span>
          <div style={{ width: '100px', height: '30px', background: '#000', borderRadius: '0 0 14px 14px', position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }} /> {/* Notch */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <Signal size={14} />
            <Wifi size={14} />
            <Battery size={14} />
          </div>
        </div>

        {/* FanApp Header */}
        <div style={{ background: 'var(--bg-base)', borderBottom: '1px solid var(--border-subtle)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ChevronLeft size={24} color="var(--accent-primary)" />
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: '1rem', color: '#fff' }}>Sixth Man AI</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--status-success)' }}>● Online (Powered by Digital Twin)</span>
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-surface)' }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              
              <div style={{
                background: msg.role === 'user' ? 'linear-gradient(135deg, var(--accent-primary) 0%, #0099ff 100%)' : 'rgba(255,255,255,0.05)',
                color: msg.role === 'user' ? '#000' : '#fff',
                padding: '12px 16px', borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                maxWidth: '85%', fontSize: '0.9rem', lineHeight: 1.5,
                border: msg.role === 'assistant' ? '1px solid var(--border-subtle)' : 'none'
              }}>
                {msg.content}
              </div>

              {/* Rich Widget Renderer */}
              {msg.widget && (
                <div style={{ marginTop: '8px', width: '260px', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                  
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
                      <button style={{ width: '100%', padding: '8px', borderRadius: '6px', border: 'none', background: 'rgba(0, 229, 255, 0.1)', color: 'var(--accent-primary)', marginTop: '12px', cursor: 'pointer', fontWeight: 500 }}>
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
                      <button style={{ width: '100%', padding: '8px', borderRadius: '6px', border: 'none', background: 'var(--accent-secondary)', color: '#fff', cursor: 'pointer', fontWeight: 500 }}>
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
                      <button style={{ width: '100%', padding: '8px', borderRadius: '6px', border: 'none', background: 'var(--status-info)', color: '#fff', cursor: 'pointer', fontWeight: 500 }}>
                        Upgrade Now
                      </button>
                    </div>
                  )}

                </div>
              )}

            </div>
          ))}
          {isTyping && (
            <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)', padding: '12px 16px', borderRadius: '16px 16px 16px 4px', border: '1px solid var(--border-subtle)', display: 'flex', gap: '4px' }}>
              <div style={{ width: '6px', height: '6px', background: 'var(--text-muted)', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
              <div style={{ width: '6px', height: '6px', background: 'var(--text-muted)', borderRadius: '50%', animation: 'pulse 1s infinite 0.2s' }} />
              <div style={{ width: '6px', height: '6px', background: 'var(--text-muted)', borderRadius: '50%', animation: 'pulse 1s infinite 0.4s' }} />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Queries */}
        <div style={{ padding: '12px 20px', background: 'var(--bg-surface)', display: 'flex', gap: '8px', overflowX: 'auto', whiteSpace: 'nowrap', borderTop: '1px solid var(--border-subtle)', scrollbarWidth: 'none' }}>
           <button onClick={() => setInput('Shortest wait for food?')} style={{ padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--border-focus)', background: 'transparent', color: 'var(--text-primary)', fontSize: '0.8rem', cursor: 'pointer' }}>Wait Times</button>
           <button onClick={() => setInput('Where is the nearest restroom?')} style={{ padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--border-focus)', background: 'transparent', color: 'var(--text-primary)', fontSize: '0.8rem', cursor: 'pointer' }}>Navigation</button>
           <button onClick={() => setInput('Can I upgrade my seat?')} style={{ padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--border-focus)', background: 'transparent', color: 'var(--text-primary)', fontSize: '0.8rem', cursor: 'pointer' }}>Upgrades</button>
        </div>

        {/* Input Area */}
        <div style={{ padding: '16px 20px 32px', background: 'var(--bg-surface)', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Sixth Man..." 
            style={{
              flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)',
              borderRadius: '24px', padding: '12px 16px', color: '#fff', outline: 'none', fontSize: '0.9rem'
            }}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            style={{
              width: '40px', height: '40px', borderRadius: '50%', border: 'none',
              background: input.trim() ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
              color: input.trim() ? '#000' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: input.trim() ? 'pointer' : 'default', transition: 'all 0.2s'
            }}
          >
            <Send size={18} style={{ marginLeft: '2px' }} />
          </button>
        </div>

      </div>

      <div style={{ marginLeft: '64px', maxWidth: '400px', color: 'var(--text-secondary)' }}>
        <h2 style={{ color: '#fff', marginBottom: '16px' }}>FanApp Mobile Simulator</h2>
        <p style={{ lineHeight: 1.6, marginBottom: '16px' }}>
          This simulator demonstrates the <strong>"Sixth Man" AI Concierge</strong> interface as experienced by attendees on their mobile devices.
        </p>
        <p style={{ lineHeight: 1.6 }}>
          Try selecting one of the suggested queries or typing one of the following:
        </p>
        <ul style={{ paddingLeft: '24px', marginTop: '12px', lineHeight: 2, color: 'var(--accent-primary)' }}>
          <li>"Which hot dog stand has the shortest line?"</li>
          <li>"Shortest route to restroom near 204"</li>
          <li>"When is halftime?"</li>
        </ul>
      </div>
    </div>
  );
}
