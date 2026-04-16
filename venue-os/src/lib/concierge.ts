export type Intent = 'WAIT_TIME' | 'NAVIGATION' | 'FAQ' | 'UPGRADE' | 'UNKNOWN';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  intent?: Intent;
  widget?: any; // To render rich UI elements in FanApp
}

// Real RAG Pipeline: Calling the FastAPI Digital Twin Backend
export const askConcierge = async (query: string): Promise<ChatMessage> => {
  try {
    const response = await fetch('http://localhost:8000/api/v1/concierge/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        user_id: 'fan-123',
        section: '102'
      }),
    });

    if (!response.ok) throw new Error('Concierge service unavailable');

    const data = await response.json();
    
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: data.content,
      intent: data.intent,
      widget: data.widget
    };
  } catch (error) {
    console.error('Concierge Error:', error);
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: "I'm having trouble connecting to the live Digital Twin model right now. Please check if the backend is running.",
      intent: 'UNKNOWN'
    };
  }
};
