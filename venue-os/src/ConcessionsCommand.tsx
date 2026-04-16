import { useState, useEffect } from 'react';
import { Coffee, TrendingUp, AlertCircle } from 'lucide-react';

interface Stand {
  id: string;
  name: string;
  waitTime: number; // in seconds
  throughput: number; // orders per minute
  predictedDemand: 'low' | 'medium' | 'high' | 'surge';
  status: 'optimal' | 'warning' | 'critical';
  alerts: string[];
}

export default function ConcessionsCommand() {
  const [stands, setStands] = useState<Stand[]>([
    { id: '1', name: 'Stand 12B - Grill', waitTime: 105, throughput: 12, predictedDemand: 'medium', status: 'optimal', alerts: [] },
    { id: '2', name: 'North Concourse Bar', waitTime: 420, throughput: 18, predictedDemand: 'surge', status: 'critical', alerts: ['Prep trigger: Halftime surge', 'Low stock: IPA keg'] },
    { id: '3', name: 'Section 204 Hotdogs', waitTime: 240, throughput: 8, predictedDemand: 'high', status: 'warning', alerts: ['Wait time creeping'] },
    { id: '4', name: 'East Gate Snacks', waitTime: 60, throughput: 4, predictedDemand: 'low', status: 'optimal', alerts: [] },
  ]);

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStands(prev => prev.map(stand => {
        const delta = Math.floor(Math.random() * 20) - 10; // -10 to +10 secs
        const newWait = Math.max(0, stand.waitTime + delta);
        
        // update status based on wait
        let newStatus = stand.status;
        if (newWait > 300) newStatus = 'critical';
        else if (newWait > 180) newStatus = 'warning';
        else newStatus = 'optimal';

        return { ...stand, waitTime: newWait, status: newStatus };
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (secs: number) => `${Math.floor(secs / 60)}m ${secs % 60}s`;

  return (
    <div style={{ padding: '32px', height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#fff' }}>Concessions Command</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
           <button className="btn btn-primary">Publish Menu Updates</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 12px 0', fontWeight: 400 }}>Total Throughput</h4>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 600, color: '#fff' }}>42 ord/min</span>
            <span style={{ color: 'var(--status-success)', fontSize: '0.85rem' }}>+12% vs expected</span>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 12px 0', fontWeight: 400 }}>Avg Wait Time</h4>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 600, color: '#fff' }}>3m 15s</span>
            <span style={{ color: 'var(--status-success)', fontSize: '0.85rem' }}>Below threshold</span>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '20px', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--status-critical)', margin: '0 0 12px 0', fontWeight: 400, display: 'flex', alignItems: 'center', gap: '6px' }}>
             <AlertCircle size={16} /> Kitchen Alerts
          </h4>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 600, color: '#fff' }}>2</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Require attention</span>
          </div>
        </div>
      </div>

      <h3 style={{ fontSize: '1.2rem', margin: '0 0 16px 0', color: '#fff' }}>Stand Intelligence Grids</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
        {stands.map(stand => (
          <div key={stand.id} className="glass-panel" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
            {/* Status Top Bar */}
            <div style={{ height: '4px', width: '100%', position: 'absolute', top: 0, left: 0, background: stand.status === 'optimal' ? 'var(--status-success)' : stand.status === 'warning' ? 'var(--status-warning)' : 'var(--status-critical)' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '10px' }}><Coffee size={24} color="#fff" /></div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>{stand.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Throughput: {stand.throughput} / min</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                 <div style={{ fontSize: '1.4rem', fontWeight: 600, color: stand.status === 'optimal' ? '#fff' : stand.status === 'warning' ? 'var(--status-warning)' : 'var(--status-critical)' }}>
                    {formatTime(stand.waitTime)}
                 </div>
                 <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Est. Wait</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <TrendingUp size={16} color="var(--accent-primary)" />
                 <span style={{ fontSize: '0.85rem', color: '#fff' }}>Demand: <span style={{ textTransform: 'uppercase', color: stand.predictedDemand === 'surge' ? 'var(--status-critical)' : 'var(--accent-primary)' }}>{stand.predictedDemand}</span></span>
               </div>
               
               {stand.alerts.length > 0 && (
                 <div style={{ display: 'flex', gap: '8px' }}>
                    {stand.alerts.map((alert, i) => (
                      <span key={i} style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--status-critical)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>{alert}</span>
                    ))}
                 </div>
               )}
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}
