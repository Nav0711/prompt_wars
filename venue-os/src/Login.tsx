import { GoogleLogin } from '@react-oauth/google';
import { Zap, ShieldCheck, UserCircle2 } from 'lucide-react';

interface LoginProps {
  onSuccess: (credential: string) => void;
  onError: () => void;
}

export function Login({ onSuccess, onError }: LoginProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100vw',
      height: '100vh',
      background: 'url(https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2500) center/cover no-repeat', // Premium stadium background
      position: 'relative'
    }}>
      {/* Dark overlay for contrast */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(6, 8, 15, 0.95) 0%, rgba(6, 8, 15, 0.75) 100%)',
        backdropFilter: 'blur(8px)'
      }} />

      {/* Login Card */}
      <div className="glass-panel" style={{
        position: 'relative',
        padding: '48px',
        maxWidth: '420px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        border: '1px solid rgba(0, 229, 255, 0.2)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
          width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '24px', boxShadow: '0 8px 32px rgba(0, 229, 255, 0.3)'
        }}>
          <Zap size={28} color="#fff" />
        </div>
        
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 12px 0', color: '#fff', letterSpacing: '-0.02em' }}>
          VenueOS Prototype
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.5, marginBottom: '40px' }}>
          Sign in to access the SmartVenue AI Command Center and Digital Twin analytics.
        </p>

        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', background: '#fff', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              if (credentialResponse.credential) {
                onSuccess(credentialResponse.credential);
              } else {
                onError();
              }
            }}
            onError={onError}
            useOneTap
            theme="outline"
            size="large"
            text="continue_with"
            shape="rectangular"
          />
        </div>

        <div style={{ position: 'relative', width: '100%', margin: '16px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', width: '100%', height: '1px', background: 'var(--border-subtle)' }} />
          <span style={{ position: 'relative', background: 'var(--bg-base)', padding: '0 12px', fontSize: '0.85rem', color: 'var(--text-muted)', zIndex: 1, borderRadius: '4px' }}>OR</span>
        </div>

        <button 
          onClick={() => {
            // Provide a mock token/identifier for the demo account bypass
            onSuccess("DEMO_ACCOUNT");
          }}
          className="btn" 
          style={{ width: '100%', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
        >
          <UserCircle2 size={20} /> Use Demo Account
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '32px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <ShieldCheck size={16} /> Restricted access for authorized personnel only
        </div>
      </div>
    </div>
  );
}
