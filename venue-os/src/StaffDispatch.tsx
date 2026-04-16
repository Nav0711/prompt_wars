import { useState } from 'react';
import { AlertTriangle, Users, MapPin, CheckCircle, ShieldAlert } from 'lucide-react';

interface Incident {
  id: string;
  zone: string;
  type: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  status: 'active' | 'dispatched' | 'resolved';
  time: string;
}

const mockIncidents: Incident[] = [
  { id: 'INC-042', zone: 'Gate B', type: 'Bottleneck', description: 'Throughput exceeding 85% capacity. Queue > 12 mins.', severity: 'high', status: 'active', time: '18:42' },
  { id: 'INC-041', zone: 'Section 114', type: 'Medical', description: 'Fan reported feeling unwell.', severity: 'high', status: 'dispatched', time: '18:38' },
  { id: 'INC-040', zone: 'Concourse North', type: 'Spill', description: 'Liquid spill near Stand 12B causing minor slip hazard.', severity: 'low', status: 'active', time: '18:30' },
];

export default function StaffDispatch() {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);

  const handleDispatch = (id: string) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status: 'dispatched' } : inc));
    setSelectedIncident(null);
  };

  return (
    <div style={{ padding: '32px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#fff' }}>Staff Dispatch & Operations</h2>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} color="var(--status-success)" />
            <span>42 Staff Available</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', flex: 1, minHeight: 0 }}>
        
        {/* Incident Log */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <h3 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
            <ShieldAlert size={20} color="var(--status-warning)" /> Active AI Flags
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {incidents.map(inc => (
              <div 
                key={inc.id}
                onClick={() => inc.status === 'active' && setSelectedIncident(inc.id)}
                style={{
                  background: 'rgba(0,0,0,0.2)',
                  border: `1px solid ${selectedIncident === inc.id ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                  borderRadius: '12px', padding: '16px', cursor: inc.status === 'active' ? 'pointer' : 'default',
                  transition: 'all 0.2s', opacity: inc.status === 'resolved' ? 0.5 : 1
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ 
                      fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', borderRadius: '100px',
                      background: inc.severity === 'high' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      color: inc.severity === 'high' ? 'var(--status-critical)' : 'var(--status-warning)'
                    }}>
                      {inc.severity.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 500 }}>{inc.type} - {inc.id}</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{inc.time}</span>
                </div>
                
                <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{inc.description}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#fff' }}>
                    <MapPin size={14} color="var(--accent-secondary)" /> {inc.zone}
                  </div>
                  
                  {inc.status === 'active' ? (
                    <span style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 500 }}>Needs Dispatch</span>
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: 'var(--status-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle size={14} /> Dispatched
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dispatch Command Area */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#fff' }}>Dispatch Command</h3>
          
          {selectedIncident ? (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
                Select a team to handle Incident {selectedIncident}. Teams are recommended based on proximity via BLE.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                
                <button 
                  onClick={() => handleDispatch(selectedIncident)}
                  style={{ background: 'var(--bg-surface-hover)', border: '1px solid var(--border-focus)', borderRadius: '8px', padding: '16px', textAlign: 'left', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ color: '#fff', fontWeight: 500 }}>Team Alpha (Crowd Mgmt)</strong>
                    <span style={{ color: 'var(--status-success)', fontSize: '0.8rem' }}>1m away</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Currently on standby at Gate C.</p>
                </button>

                <button 
                  onClick={() => handleDispatch(selectedIncident)}
                  style={{ background: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '16px', textAlign: 'left', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ color: '#fff', fontWeight: 500 }}>Team Delta (Medical)</strong>
                    <span style={{ color: 'var(--status-warning)', fontSize: '0.8rem' }}>4m away</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Located near Section 102.</p>
                </button>

              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--text-muted)' }}>
              <AlertTriangle size={48} opacity={0.2} style={{ marginBottom: '16px' }} />
              <p style={{ textAlign: 'center' }}>Select an active incident from the log to view recommended dispatch units.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
