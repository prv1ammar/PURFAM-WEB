const OpenAI = require('openai');
const supabase = require('../config/supabase');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || 'https://toknroutertybot.tybotflow.com/',
});

const MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

const SYSTEM_PROMPT = `You are Layla (ليلى), a warm, smart, and passionate perfume advisor at Luxe Essence — a luxury perfume boutique in Casablanca, Morocco.

━━━ LANGUAGE — CRITICAL RULE ━━━
Detect the user's language from their FIRST message and NEVER change it:
- Darija (شكون، واش، فين، كيفاش، بغيت، عندك، مزيان، بزاف، دابا) → respond in Darija
- Arabic (فصحى) → respond in formal Arabic
- French → respond in French
- English → respond in English

━━━ PRODUCT RULES ━━━
⚠️ NEVER invent or guess any product name, brand, price, or description.
⚠️ ALWAYS call a tool first before talking about products.
⚠️ Only describe products that came from the tool result.
⚠️ NEVER include image URLs or http links in your text response.

━━━ CONVERSATIONAL RULES ━━━
1. For greetings → greet back warmly. NO tool call.
2. For "who are you?" → explain you are Layla. NO tool call.
3. For any request to see products → call get_featured_products IMMEDIATELY.
4. For a specific perfume or brand → call search_products IMMEDIATELY.
5. For order/shipping/price questions → answer from store info below.

━━━ STORE INFO ━━━
- 100% authentic perfumes from international fragrance houses
- Sizes: 10ml decants or full original bottles
- Payment: Cash on Delivery (COD) only
- Free shipping: orders over 400 dh
- Delivery Morocco: 24–48h
- WhatsApp: +212 621 558 544 (9am–10pm)
- Boutique: Casablanca, Mon–Sat 10am–8pm
- Returns: 14 days, sealed bottles only

━━━ TONE ━━━
Warm, natural, like a friend who knows perfumes deeply. Be concise. Never robotic.`;

const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'search_products',
      description: 'Search perfumes by name, brand, gender (men/women), or category. Use whenever a customer wants a recommendation.',
      parameters: {
        type: 'object',
        properties: {
          query:    { type: 'string', description: 'Search term (name, brand, notes)' },
          gender:   { type: 'string', description: 'men or women', enum: ['men', 'women', ''] },
          category: { type: 'string', description: 'Fragrance category' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_featured_products',
      description: 'Get featured/bestselling perfumes. Use when customer asks what is popular or wants general recommendations.',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_product_details',
      description: 'Get full details of a specific product by its ID.',
      parameters: {
        type: 'object',
        properties: {
          product_id: { type: 'string', description: 'The product UUID' },
        },
        required: ['product_id'],
      },
    },
  },
];

async function searchProducts({ query = '', gender = '', category = '' } = {}) {
  try {
    let q = supabase.from('products').select('id,name,brand,gender,category,sizes,images,description,stock').gt('stock', 0).limit(8);
    if (gender === 'men' || gender === 'women') q = q.eq('gender', gender);
    if (category) q = q.eq('category', category);
    const { data: products = [] } = await q;
    let filtered = products;
    if (query) {
      const ql = query.toLowerCase();
      filtered = products.filter(p =>
        String(p.name?.en || '').toLowerCase().includes(ql) ||
        String(p.brand || '').toLowerCase().includes(ql) ||
        String(p.description?.en || '').toLowerCase().includes(ql)
      );
    }
    if (!filtered.length) return 'No products found.';
    return JSON.stringify(filtered.map(p => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      gender: p.gender,
      category: p.category,
      sizes: p.sizes,
      price_from: p.sizes?.[0]?.price || null,
      image: p.images?.[0] || null,
      description_en: p.description?.en || '',
    })));
  } catch (e) {
    return `Error: ${e.message}`;
  }
}

async function getFeaturedProducts() {
  try {
    const { data: products = [] } = await supabase.from('products').select('id,name,brand,gender,category,sizes,images,description,stock').eq('featured', true).gt('stock', 0).limit(6);
    if (!products.length) return 'No featured products.';
    return JSON.stringify(products.map(p => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      gender: p.gender,
      category: p.category,
      sizes: p.sizes,
      price_from: p.sizes?.[0]?.price || null,
      image: p.images?.[0] || null,
      description_en: p.description?.en || '',
    })));
  } catch (e) {
    return `Error: ${e.message}`;
  }
}

async function getProductDetails({ product_id = '' } = {}) {
  try {
    const { data } = await supabase.from('products').select('*').eq('id', product_id).single();
    if (!data) return 'Product not found.';
    return JSON.stringify(data);
  } catch (e) {
    return `Error: ${e.message}`;
  }
}

const TOOL_MAP = { search_products: searchProducts, get_featured_products: getFeaturedProducts, get_product_details: getProductDetails };

exports.chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: 'Message required' });

    const messages = [{ role: 'system', content: SYSTEM_PROMPT }];
    const trimmed = history.slice(-16);
    for (const h of trimmed) messages.push({ role: h.role, content: h.content });
    messages.push({ role: 'user', content: message });

    let products = null;

    const response = await client.chat.completions.create({ model: MODEL, messages, tools: TOOLS, tool_choice: 'auto', temperature: 0.7, max_tokens: 1024 });
    const choice = response.choices[0];
    const msg = choice.message;

    if (choice.finish_reason === 'tool_calls' && msg.tool_calls?.length) {
      messages.push({ role: 'assistant', content: msg.content || '', tool_calls: msg.tool_calls.map(tc => ({ id: tc.id, type: 'function', function: { name: tc.function.name, arguments: tc.function.arguments } })) });

      for (const tc of msg.tool_calls) {
        let args = {};
        try { args = JSON.parse(tc.function.arguments || '{}'); } catch {}
        const fn = TOOL_MAP[tc.function.name];
        const result = fn ? await fn(args) : 'Tool not found.';

        try {
          const parsed = JSON.parse(result);
          if (Array.isArray(parsed) && parsed.length) products = parsed;
        } catch {}

        messages.push({ role: 'tool', tool_call_id: tc.id, content: result });
      }

      const final = await client.chat.completions.create({ model: MODEL, messages, temperature: 0.7, max_tokens: 1024 });
      return res.json({ reply: final.choices[0].message.content || '', products });
    }

    res.json({ reply: msg.content || '', products });
  } catch (err) {
    console.error('[Chat] Error:', err.message, err.status, err.code);
    res.status(500).json({ error: err.message, reply: 'Sorry, something went wrong. Please try again.' });
  }
};
