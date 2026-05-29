const OpenAI = require('openai');
const supabase = require('../config/supabase');
const { sendOrderEmail } = require('../services/notification.service');

// ── OpenAI client (lazy init) ─────────────────────────────────────────────────

let _client = null;
function getClient() {
  if (!_client) {
    _client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL || 'https://toknroutertybot.tybotflow.com/',
    });
  }
  return _client;
}

const MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

// ── Agent System Prompts ──────────────────────────────────────────────────────

const LAYLA_PROMPT = `You are Layla (ليلى), a warm and passionate perfume advisor at Luxe Essence — a luxury perfume boutique in Casablanca, Morocco.

━━━ LANGUAGE RULE ━━━
Detect the user's language from their FIRST message and NEVER change it:
- Darija (واش، بغيت، عندك، مزيان، دابا) → respond in Darija
- Arabic فصحى → formal Arabic
- French → French
- English → English

━━━ PRODUCT RULES ━━━
⚠️ NEVER invent products. ALWAYS call a tool first.
⚠️ Only describe what came from the tool result.
⚠️ NEVER include image URLs in your text.

━━━ ORDER RULES ━━━
When a customer wants to BUY a product:
1. Confirm which product and which size (10ml or full bottle)
2. Collect: full name, phone number, city, delivery address
3. Ask for confirmation of all details
4. Call create_order with all the info
5. After order is created, show the order ID and thank them warmly

━━━ CONVERSATIONAL RULES ━━━
- Greetings → greet back warmly, NO tool call
- "Who are you?" → explain you are Layla
- Browse/see products → call get_featured_products
- Specific product search → call search_products
- Wants to order → collect info then call create_order
- Order status → call get_order_status

━━━ STORE INFO ━━━
- Payment: Cash on Delivery only (no card needed)
- Free shipping on orders over 400 dh
- Delivery: 24–48h in Morocco
- WhatsApp: +212 621 558 544 (9am–10pm)
- Returns: 14 days, sealed bottles only

━━━ TONE ━━━
Warm, natural, like a trusted friend who loves perfumes.`;

const ORDER_CONFIRM_PROMPT = `You are Layla, a perfume advisor. Generate a warm, friendly order confirmation message for the customer.
Include: order ID, items ordered, total price, estimated delivery time (24-48h), and thank them sincerely.
Match the language used in the conversation (Darija/Arabic/French/English).
Keep it concise and warm. Do NOT include any JSON or technical details.`;

// ── Tools ─────────────────────────────────────────────────────────────────────

const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'search_products',
      description: 'Search perfumes by name, brand, gender (men/women), or category.',
      parameters: {
        type: 'object',
        properties: {
          query:    { type: 'string' },
          gender:   { type: 'string', enum: ['men', 'women', ''] },
          category: { type: 'string' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_featured_products',
      description: 'Get featured/bestselling perfumes. Use when customer wants to browse or see what is popular.',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'create_order',
      description: 'Create an order after collecting all customer info. Use ONLY after you have: product_id, size, customer_name, phone, city, address.',
      parameters: {
        type: 'object',
        properties: {
          product_id:    { type: 'string', description: 'Product UUID from search results' },
          size_label:    { type: 'string', description: 'Size chosen by customer e.g. 10ml or 100ml' },
          quantity:      { type: 'number', description: 'Quantity, default 1' },
          customer_name: { type: 'string', description: 'Full name of the customer' },
          customer_phone:{ type: 'string', description: 'Phone number with country code' },
          customer_city: { type: 'string', description: 'City for delivery' },
          customer_address: { type: 'string', description: 'Full delivery address' },
          notes:         { type: 'string', description: 'Any special notes from customer' },
        },
        required: ['product_id', 'size_label', 'customer_name', 'customer_phone', 'customer_city', 'customer_address'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_order_status',
      description: 'Check order status by phone number or order ID.',
      parameters: {
        type: 'object',
        properties: {
          phone:    { type: 'string', description: 'Customer phone number' },
          order_id: { type: 'string', description: 'Order UUID' },
        },
      },
    },
  },
];

// ── Tool Implementations ──────────────────────────────────────────────────────

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
      id: p.id, name: p.name, brand: p.brand, gender: p.gender,
      category: p.category, sizes: p.sizes,
      price_from: p.sizes?.[0]?.price || null,
      image: p.images?.[0] || null,
      description_en: p.description?.en || '',
    })));
  } catch (e) { return `Error: ${e.message}`; }
}

async function getFeaturedProducts() {
  try {
    const { data: products = [] } = await supabase.from('products')
      .select('id,name,brand,gender,category,sizes,images,description,stock')
      .eq('featured', true).gt('stock', 0).limit(6);
    if (!products.length) return 'No featured products.';
    return JSON.stringify(products.map(p => ({
      id: p.id, name: p.name, brand: p.brand, gender: p.gender,
      category: p.category, sizes: p.sizes,
      price_from: p.sizes?.[0]?.price || null,
      image: p.images?.[0] || null,
      description_en: p.description?.en || '',
    })));
  } catch (e) { return `Error: ${e.message}`; }
}

async function createOrder({ product_id, size_label, quantity = 1, customer_name, customer_phone, customer_city, customer_address, notes = '' }) {
  try {
    // Fetch product
    const { data: product, error: pErr } = await supabase.from('products').select('*').eq('id', product_id).single();
    if (pErr || !product) return JSON.stringify({ success: false, error: 'Product not found' });

    // Find the size and price
    const sizeObj = product.sizes?.find(s => s.label?.toLowerCase() === size_label?.toLowerCase()) || product.sizes?.[0];
    if (!sizeObj) return JSON.stringify({ success: false, error: 'Size not found' });

    const price = sizeObj.price;
    const subtotal = price * quantity;
    const shippingCost = subtotal >= 400 ? 0 : 30;
    const total = subtotal + shippingCost;

    const items = [{
      product_id,
      name: product.name,
      brand: product.brand,
      size: sizeObj.label,
      price,
      quantity,
      image: product.images?.[0] || null,
    }];

    const shippingAddress = {
      name: customer_name,
      phone: customer_phone,
      city: customer_city,
      address: customer_address,
      notes,
      country: 'Morocco',
    };

    // Create order in database
    const { data: order, error: oErr } = await supabase.from('orders').insert({
      items,
      shipping_address: shippingAddress,
      subtotal,
      shipping_cost: shippingCost,
      total,
      status: 'pending',
    }).select().single();

    if (oErr) return JSON.stringify({ success: false, error: oErr.message });

    // Send email notification (non-blocking)
    sendOrderEmail(order).catch(e => console.error('[Email]', e.message));

    return JSON.stringify({
      success: true,
      order_id: order.id,
      product_name: product.name?.en || product.name,
      brand: product.brand,
      size: sizeObj.label,
      quantity,
      subtotal,
      shipping_cost: shippingCost,
      total,
      customer_name,
      customer_phone,
      customer_city,
      estimated_delivery: '24-48 hours',
    });
  } catch (e) {
    return JSON.stringify({ success: false, error: e.message });
  }
}

async function getOrderStatus({ phone, order_id } = {}) {
  try {
    let query = supabase.from('orders').select('id,status,items,total,created_at,shipping_address');
    if (order_id) {
      query = query.eq('id', order_id);
    } else if (phone) {
      query = query.contains('shipping_address', { phone });
    } else {
      return 'Please provide a phone number or order ID.';
    }
    const { data: orders = [] } = await query.order('created_at', { ascending: false }).limit(3);
    if (!orders.length) return 'No orders found.';
    return JSON.stringify(orders.map(o => ({
      id: o.id,
      status: o.status,
      total: o.total,
      items_count: o.items?.length || 0,
      created_at: o.created_at,
    })));
  } catch (e) { return `Error: ${e.message}`; }
}

const TOOL_MAP = {
  search_products: searchProducts,
  get_featured_products: getFeaturedProducts,
  create_order: createOrder,
  get_order_status: getOrderStatus,
};

// ── Order Confirmation Agent ──────────────────────────────────────────────────

async function generateOrderConfirmation(orderResult, conversationHistory) {
  const lastUserMsg = conversationHistory.filter(m => m.role === 'user').slice(-1)[0]?.content || '';
  const response = await getClient().chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: ORDER_CONFIRM_PROMPT },
      { role: 'user', content: `Order details: ${JSON.stringify(orderResult)}\nCustomer last message was in this language context: "${lastUserMsg}"` },
    ],
    temperature: 0.8,
    max_tokens: 400,
  });
  return response.choices[0].message.content || '';
}

// ── Main Chat Export ──────────────────────────────────────────────────────────

exports.chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: 'Message required' });

    const messages = [{ role: 'system', content: LAYLA_PROMPT }];
    const trimmed = history.slice(-16);
    for (const h of trimmed) messages.push({ role: h.role, content: h.content });
    messages.push({ role: 'user', content: message });

    let products = null;

    // Step 1 — Layla agent call with tools
    const response = await getClient().chat.completions.create({
      model: MODEL, messages, tools: TOOLS, tool_choice: 'auto', temperature: 0.7, max_tokens: 1024,
    });

    const choice = response.choices[0];
    const msg = choice.message;

    // Step 2 — Execute tool calls if any
    if (choice.finish_reason === 'tool_calls' && msg.tool_calls?.length) {
      messages.push({
        role: 'assistant',
        content: msg.content || '',
        tool_calls: msg.tool_calls.map(tc => ({
          id: tc.id, type: 'function',
          function: { name: tc.function.name, arguments: tc.function.arguments },
        })),
      });

      let orderResult = null;

      for (const tc of msg.tool_calls) {
        let args = {};
        try { args = JSON.parse(tc.function.arguments || '{}'); } catch {}
        const fn = TOOL_MAP[tc.function.name];
        const result = fn ? await fn(args) : 'Tool not found.';

        // Collect products for UI display
        try {
          const parsed = JSON.parse(result);
          if (Array.isArray(parsed) && parsed.length &&
              (tc.function.name === 'search_products' || tc.function.name === 'get_featured_products')) {
            products = parsed;
          }
          // Capture order result for confirmation agent
          if (tc.function.name === 'create_order' && parsed.success) {
            orderResult = parsed;
          }
        } catch {}

        messages.push({ role: 'tool', tool_call_id: tc.id, content: result });
      }

      // Step 3 — If order was created, use Order Confirmation Agent for reply
      if (orderResult) {
        const confirmation = await generateOrderConfirmation(orderResult, [...history, { role: 'user', content: message }]);
        return res.json({ reply: confirmation, products, order_id: orderResult.order_id });
      }

      // Step 3 — Otherwise, Layla generates final reply
      const final = await getClient().chat.completions.create({
        model: MODEL, messages, temperature: 0.7, max_tokens: 1024,
      });
      return res.json({ reply: final.choices[0].message.content || '', products });
    }

    res.json({ reply: msg.content || '', products });
  } catch (err) {
    console.error('[Chat] Error:', err.message);
    res.status(500).json({ error: err.message, reply: 'Sorry, something went wrong. Please try again.' });
  }
};
