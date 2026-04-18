import { useNavigate } from 'react-router-dom';
import { Zap, Map, MessageSquare, ArrowRight } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'url(https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2500) center/cover no-repeat fixed',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Dark overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(6, 8, 15, 0.95) 0%, rgba(6, 8, 15, 0.8) 100%)',
        backdropFilter: 'blur(4px)',
        zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1, padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Nav */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
              width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Zap size={20} color="#fff" />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#fff' }}>VenueOS</h2>
          </div>
          <div>
            <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ padding: '12px 24px', borderRadius: '100px' }}>
              Access Prototype
            </button>
          </div>
        </header>

        {/* Hero */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 80px auto' }}>
          <h1 style={{ fontSize: '4rem', lineHeight: 1.1, marginBottom: '24px' }}>
            The AI Command Center for Modern Venues
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '40px' }}>
            Unify your stadium operations with a real-time spatial digital twin, predictive analytics, and a powerful RAG-powered "Sixth Man" Concierge for fans.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem', borderRadius: '100px' }}>
              Enter Command Center <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', paddingBottom: '80px' }}>
          <div className="glass-panel" style={{ padding: '32px', textAlign: 'left' }}>
            <div style={{ background: 'rgba(0, 229, 255, 0.1)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: 'var(--accent-primary)' }}>
              <Map size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '12px' }}>Spatial Digital Twin</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Live IoT simulation tracks concourse density, throughput, and precise concession wait times across the entire venue.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '32px', textAlign: 'left' }}>
            <div style={{ background: 'rgba(124, 58, 237, 0.1)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: 'var(--accent-secondary)' }}>
              <MessageSquare size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '12px' }}>AI Fan Concierge</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Retrieval-Augmented Generation (RAG) chatbot connects directly to the digital twin to give fans real-time dynamic answers.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
