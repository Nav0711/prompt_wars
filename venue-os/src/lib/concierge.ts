export type Intent = 'WAIT_TIME' | 'NAVIGATION' | 'FAQ' | 'UPGRADE' | 'UNKNOWN';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  intent?: Intent;
  widget?: any; // To render rich UI elements in FanApp
}

// Mock RAG Pipeline Simulator
export const askConcierge = async (query: string): Promise<ChatMessage> => {
  // Simulate network latency for LLM generation
  const delay = 800 + Math.random() * 600;
  await new Promise(resolve => setTimeout(resolve, delay));

  const lowerQuery = query.toLowerCase();
  
  // Simulated Pinecone Document Match: Live State (Wait Times)
  if (lowerQuery.includes('shortest line') || lowerQuery.includes('wait') || lowerQuery.includes('food')) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: 'Based on live Digital Twin sensor data, Stand 12B (North Concourse) currently has the shortest line with an estimated wait of 1m 45s.',
      intent: 'WAIT_TIME',
      widget: { type: 'stand_info', name: 'Stand 12B - Grill', waitTime: '1m 45s', walkTime: '2m', status: 'optimal' }
    };
  }

  // Simulated Pinecone Document Match: Navigation / Pathfinding API
  if (lowerQuery.includes('route') || lowerQuery.includes('bathroom') || lowerQuery.includes('restroom') || lowerQuery.includes('where')) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: 'The fastest accessible route to the nearest restroom avoids the current crowd bottleneck at Gate C. It should take about 3 minutes to walk there.',
      intent: 'NAVIGATION',
      widget: { type: 'route_map', destination: 'Restroom (Section 204)', distance: '120m', predictedTime: '3m' }
    };
  }

  // Simulated Pinecone Document Match: Yield Management API
  if (lowerQuery.includes('upgrade') || lowerQuery.includes('seat')) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: 'I noticed there are a few empty premium seats in Row C right now! As a season ticket holder, you can upgrade instantly for $15.',
      intent: 'UPGRADE',
      widget: { type: 'upgrade_offer', seat: 'Row C, Seat 12', price: '$15.00', originalPrice: '$45.00' }
    };
  }

  // Simulated Pinecone Document Match: Static FAQ docs
  if (lowerQuery.includes('halftime') || lowerQuery.includes('when')) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: 'Halftime is scheduled to begin in approximately 14 minutes. If you want to avoid the rush, I highly recommend placing a mobile order through the app now!',
      intent: 'FAQ'
    };
  }

  // Fallback
  return {
    id: Date.now().toString(),
    role: 'assistant',
    content: "I'm checking the live venue state for that. Could you clarify what exactly you're looking for, or provide your current section number?",
    intent: 'UNKNOWN'
  };
};
