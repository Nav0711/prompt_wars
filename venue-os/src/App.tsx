import React, { useState, useEffect } from 'react';
import './App.css';
import { 
  Activity, 
  Map as MapIcon, 
  Coffee, 
  Users, 
  AlertTriangle, 
  Bell, 
  Search,
  ChevronRight,
  Zap,
  MessageSquare
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import FanAppSimulator from './FanAppSimulator';
import StaffDispatch from './StaffDispatch';
import ConcessionsCommand from './ConcessionsCommand';
import { useDigitalTwin } from './hooks/useDigitalTwin';

const mockChartData = [
  { time: '18:00', density: 12 },
  { time: '18:15', density: 25 },
  { time: '18:30', density: 48 },
  { time: '18:45', density: 72 },
  { time: '19:00', density: 85 },
  { time: '19:15', density: 65 },
  { time: '19:30', density: 50 },
];

function App() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [activeTab, setActiveTab] = useState<'dashboard' | 'fanapp' | 'staff' | 'concessions'>('dashboard');
  const { state, isConnected, error } = useDigitalTwin();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        background: 'var(--bg-surface)',
        backdropFilter: 'blur(16px)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', padding: '0 8px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
            width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Zap size={18} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, letterSpacing: '0.02em', color: '#fff' }}>VenueOS</h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <NavItem icon={<MapIcon size={20} />} label="Live Map" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<MessageSquare size={20} />} label="FanApp Concierge" active={activeTab === 'fanapp'} onClick={() => setActiveTab('fanapp')} />
          <NavItem icon={<Activity size={20} />} label="Command Center" />
          <NavItem icon={<Coffee size={20} />} label="Concessions" active={activeTab === 'concessions'} onClick={() => setActiveTab('concessions')} />
          <NavItem icon={<Users size={20} />} label="Staff Dispatch" active={activeTab === 'staff'} onClick={() => setActiveTab('staff')} />
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <div className="glass-panel" style={{ padding: '16px', background: 'rgba(0, 229, 255, 0.05)', borderColor: 'rgba(0, 229, 255, 0.2)' }}>
            <h4 style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 8px 0' }}>
              <AlertTriangle size={14} /> AI Alert
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
              Gate B throughput predicted to exceed 85% capacity in 12 mins.
            </p>
            <button className="btn" style={{ background: 'transparent', color: 'var(--accent-primary)', padding: '8px 0 0 0', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Dispatch Staff <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Header */}
        <header style={{
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(6, 8, 15, 0.6)',
          backdropFilter: 'blur(8px)'
        }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', margin: 0, color: '#fff', background: 'none', WebkitTextFillColor: 'initial', letterSpacing: 'normal' }}>National Stadium • Main Event</h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>Gate Opens: {currentTime} — Expected: 55,000</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
              <input 
                type="text" 
                placeholder="Search staff, zones, alerts..." 
                style={{
                  background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                  borderRadius: '100px', padding: '10px 16px 10px 40px', color: 'var(--text-primary)',
                  fontSize: '0.9rem', width: '280px', outline: 'none'
                }}
              />
            </div>
            <button className="btn-icon"><Bell size={20} /></button>
          </div>
        </header>

        {/* Main View Area */}
        {activeTab === 'fanapp' ? (
          <FanAppSimulator />
        ) : activeTab === 'staff' ? (
          <StaffDispatch />
        ) : activeTab === 'concessions' ? (
          <ConcessionsCommand />
        ) : (
          <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
            
            <HeaderAlert error={error} isConnected={isConnected} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
            <StatCard 
              title="Current Attendance" 
              value={state?.zones.reduce((acc, z) => acc + z.occupancy, 0).toLocaleString() || "..."} 
              trend="+1,200 / 15m" 
              type="info" 
            />
            <StatCard 
              title="Avg Gate Wait" 
              value={state ? "4m 12s" : "..."} 
              trend="-30s vs Avg" 
              type="success" 
            />
            <StatCard 
              title="Concession Wait" 
              value={state ? `${Math.floor(state.stands[0].wait_time / 60)}m ${state.stands[0].wait_time % 60}s` : "..."} 
              trend="+2m (High)" 
              type="warning" 
            />
            <StatCard title="Predicted Spend" value="$42.50" trend="+12% pre-game" type="success" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            
            {/* Live Map Area */}
            <div className="glass-panel" style={{ height: '500px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.25rem', margin: 0, color: '#fff' }}>Live Spatial Model (Digital Twin)</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn" style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-primary)' }}>Level 1</button>
                  <button className="btn" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>Level 2</button>
                </div>
              </div>
              
              <div style={{ 
                flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '12px', position: 'relative',
                border: '1px dashed var(--border-subtle)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  <MapIcon size={48} opacity={0.5} style={{ margin: '0 auto 16px', display: 'block' }} />
                  <p style={{ margin: 0 }}>{isConnected ? "Streaming Spatial Twin..." : "Connecting to Edge Node..."}</p>
                  <p style={{ fontSize: '0.8rem', margin: '4px 0 0 0' }}>({state?.timestamp})</p>
                </div>
                
                {/* Live State Heatmap Nodes */}
                {state?.zones.map((zone, i) => (
                  <HeatmapNode 
                    key={zone.id}
                    top={i === 0 ? "40%" : i === 1 ? "25%" : "65%"} 
                    left={i === 0 ? "30%" : i === 1 ? "70%" : "55%"} 
                    color={zone.density > 0.8 ? "var(--status-critical)" : zone.density > 0.5 ? "var(--status-warning)" : "var(--status-success)"} 
                    pulse={zone.density > 0.8}
                  />
                ))}
              </div>
            </div>

            {/* Density Graph */}
            <div className="glass-panel" style={{ height: '500px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.1rem', margin: '0 0 24px 0', color: '#fff' }}>Concourse Density Forecast</h3>
              <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorDensity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}
                      itemStyle={{ color: 'var(--accent-primary)' }}
                    />
                    <Area type="monotone" dataKey="density" stroke="var(--accent-primary)" fillOpacity={1} fill="url(#colorDensity)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Subcomponents

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
      padding: '12px 16px', borderRadius: '8px', cursor: 'pointer',
      background: active ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
      color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
      border: active ? '1px solid rgba(0, 229, 255, 0.2)' : '1px solid transparent',
      transition: 'all 0.2s', textAlign: 'left', fontSize: '0.95rem', fontWeight: active ? 500 : 400
    }}>
      {icon}
      {label}
    </button>
  );
}

function HeaderAlert({ error, isConnected }: { error: string | null, isConnected: boolean }) {
  if (!error && isConnected) return null;
  
  return (
    <div style={{
      marginBottom: '24px',
      padding: '12px 16px',
      borderRadius: '8px',
      background: isConnected ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
      border: `1px solid ${isConnected ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
      color: isConnected ? 'var(--status-success)' : 'var(--status-critical)',
      fontSize: '0.9rem',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>
      <AlertTriangle size={16} />
      {error || (isConnected ? 'Backend Connected' : 'Connecting to Digital Twin Backend...')}
    </div>
  );
}

function StatCard({ title, value, trend, type }: { title: string, value: string, trend: string, type: 'success' | 'warning' | 'critical' | 'info' }) {
  return (
    <div className="glass-panel" style={{ padding: '20px' }}>
      <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 12px 0', fontWeight: 400 }}>{title}</h4>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '1.8rem', fontWeight: 600, color: '#fff' }}>{value}</span>
        <span style={{ 
          fontSize: '0.85rem', 
          color: type === 'warning' ? 'var(--status-warning)' : type === 'critical' ? 'var(--status-critical)' : 'var(--status-info)',
          background: `rgba(${type === 'warning' ? '245, 158, 11' : type === 'critical' ? '239, 68, 68' : '59, 130, 246'}, 0.1)`,
          padding: '4px 8px', borderRadius: '100px'
        }}>
          {trend}
        </span>
      </div>
    </div>
  );
}

function HeatmapNode({ top, left, color, pulse = false }: { top: string, left: string, color: string, pulse?: boolean }) {
  return (
    <div style={{
      position: 'absolute', top, left, width: '120px', height: '120px',
      transform: 'translate(-50%, -50%)', borderRadius: '50%',
      background: `radial-gradient(circle, ${color} 0%, transparent 60%)`,
      opacity: pulse ? 1 : 0.6,
      animation: pulse ? 'pulse 2s infinite' : 'none',
      mixBlendMode: 'screen',
      pointerEvents: 'none'
    }}>
      <style>
        {`@keyframes pulse { 0% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.6; } 50% { transform: translate(-50%, -50%) scale(1.3); opacity: 1; } 100% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.6; } }`}
      </style>
    </div>
  );
}

export default App;
