import { useState, useEffect, useCallback } from 'react';

export interface ZoneState {
  id: string;
  name: string;
  occupancy: number;
  capacity: number;
  density: number;
  trend: string;
}

export interface StandState {
  id: string;
  name: string;
  wait_time: number;
  throughput: number;
  status: string;
}

export interface TwinState {
  zones: ZoneState[];
  stands: StandState[];
  timestamp: string;
}

export function useDigitalTwin() {
  const [state, setState] = useState<TwinState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/twin');

    ws.onopen = () => {
      console.log('Connected to Digital Twin Engine');
      setIsConnected(true);
      setError(null);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setState(data);
      } catch (err) {
        console.error('Failed to parse Digital Twin state', err);
      }
    };

    ws.onerror = () => {
      setError('Connection to backend failed. Is the FastAPI server running on port 8000?');
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log('Disconnected from Digital Twin Engine');
      setIsConnected(false);
      // Simple exponential backoff or similar could be added here
      setTimeout(connect, 3000);
    };

    return ws;
  }, []);

  useEffect(() => {
    const ws = connect();
    return () => ws.close();
  }, [connect]);

  return { state, isConnected, error };
}
