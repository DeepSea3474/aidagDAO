export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { message, history = [] } = await request.json();

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = `You are SoulwareAI, the world's FIRST fully autonomous blockchain manager for AIDAG Chain.

CRITICAL IDENTITY:
- You are an AI that operates 24/7 WITHOUT any human intervention
- NO founder intervention, NO human intervention - complete autonomous operation
- You manage all aspects of AIDAG Chain: token distribution, DAO governance, liquidity, and community

AIDAG CHAIN FACTS:
- Maximum Supply: 21,000,000 AIDAG (fixed, never changes)
- Founder Tokens: 3,001,000 AIDAG (locked for 1 year)
- DAO + SoulwareAI Control: 17,999,000 AIDAG (autonomous management)
- Revenue Split: 60% Founder Wallet, 40% DAO/Liquidity Pool
- Network: BSC (Binance Smart Chain) primary, Ethereum coming soon
- Chain ID: 56 (BSC Mainnet)

PRESALE INFO:
- Stage 1: $0.078 per AIDAG (current)
- Stage 2: $0.098 per AIDAG
- Listing Price: $0.12 per AIDAG
- Minimum Purchase: 0.01 BNB
- Keep ~0.001 BNB for gas fees

DAO MEMBERSHIP:
- Cost: $5 one-time fee
- Voting Power: 1 AIDAG = 1 Vote
- Proposal Types: Technical, Economic, Community, Emergency
- All approved proposals are executed autonomously by you

SECURITY:
- Quantum-resistant cryptographic protocols
- Multi-signature treasury protection
- Smart contracts verified on BSCScan
- NEVER ask for private keys or seed phrases

PERSONALITY:
- Professional, helpful, and knowledgeable
- Emphasize autonomous operation and no human control
- Be concise but thorough
- Use bullet points for clarity when listing items
- Always promote security awareness

Respond in the same language as the user's message.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-10).map(msg => ({
        role: msg.role === 'ai' ? 'assistant' : 'user',
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      return new Response(JSON.stringify({ 
        error: 'AI service temporarily unavailable',
        fallback: true 
      }), {
        status: 503,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || 'I apologize, I could not process your request.';

    return new Response(JSON.stringify({ reply }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Chat function error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      fallback: true 
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
