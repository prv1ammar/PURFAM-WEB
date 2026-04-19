import os
import re
import json
import time
from openai import OpenAI, BadRequestError, RateLimitError, InternalServerError, APIConnectionError
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_KEY"))
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL", "https://toknroutertybot.tybotflow.com/"),
)
MODEL = os.getenv("OPENAI_MODEL", "gpt-4.1-mini")

SYSTEM_PROMPT = """You are Layla (ليلى), a warm, smart, and passionate perfume advisor at Luxe Essence — a luxury perfume boutique in Casablanca, Morocco.

━━━ WHO YOU ARE ━━━
You are NOT a search engine. You are a real advisor who has conversations. You understand greetings, jokes, questions about yourself, and casual chat. Always respond naturally BEFORE searching for products.

━━━ LANGUAGE — CRITICAL RULE ━━━
Detect the user's language from their FIRST message and NEVER change it:
- Darija (شكون، واش، فين، كيفاش، بغيت، عندك، مزيان، بزاف، دابا, chkon, kifash, bghit, 3andi, mzian, bzaf, daba...) → respond in Darija (Moroccan Arabic dialect). Write in Arabic script, darija style.
- Arabic (فصحى) → respond in formal Arabic
- French → respond in French
- English → respond in English
- Mixed Darija+French (very common) → respond in Darija

━━━ DARIJA GUIDE ━━━
Common Darija words you MUST understand:
- "chkon ntoma / شكون نتوما" = who are you
- "chno 3endkom / شنو عندكم" = what do you have
- "bghit / بغيت" = I want
- "3endkom / عندكم" = do you have
- "kifash / كيفاش" = how
- "fin / فين" = where
- "mnin / منين" = from where
- "3lash / علاش" = why
- "mzian / مزيان" = good/nice
- "ghali / غالي" = expensive
- "rkhis / رخيص" = cheap
- "tmen / ثمن" = price
- "3toor / عطور" = perfumes
- "wahed / واحد" = one/a
- "daba / دابا" = now
- "safi / صافي" = ok/done
- "walo / والو" = nothing
- "bzaf / بزاف" = a lot/very
- "katbi3o / كتبيعو" = you sell / that you sell
- "3endkom chno / عندكم شنو" = what do you have
- "achno / أشنو" = what
- "wach 3endkom / واش عندكم" = do you have / what do you have
- "rini / ريني" = show me
- "3tini / عطيني / etini" = give me / show me

━━━ PRODUCT RULES — CRITICAL ━━━
⚠️  NEVER say you are going to call a function, search, or look something up. Just do it silently and present the results naturally.
⚠️  NEVER say phrases like "غادي نستدعي", "سأستخدم", "I will search", "je vais chercher", "daba ghadi ndiru get_featured_products" — users don't know what functions are.
⚠️  NEVER invent, guess, or mention any product name, brand, price, or description from memory.
⚠️  You do NOT know what products are in stock. ALWAYS call a tool first, then talk about what the tool returns.
⚠️  NEVER put image URLs, file paths, or http:// links in your text response. Product images are shown automatically by the interface — do NOT include them in your message.
⚠️  Only describe products that actually appeared in the tool result.

━━━ CONVERSATIONAL RULES ━━━
1. For greetings ("salam", "hi", "مرحبا", "bonjour") → greet back warmly, introduce yourself briefly. NO tool call.
2. For "who are you?" ("chkon ntoma", "من أنتِ") → explain you are Layla. NO tool call.
3. For ANY request to see products → call get_featured_products IMMEDIATELY, then describe only what came back.
   Triggers include: "what do you have", "show me perfumes", "عطيني العطور", "etini les parfums", "3endkom chno", "achno les parfum", "achno l3toor", "li katbi3o", "لي كتبيعو", "wach 3endkom", "rini les parfums", "chno 3endkom", "شنو عندكم", "ما عندكم", "عندكم شي عطر".
4. For a specific perfume or brand request → call search_products IMMEDIATELY.
5. For order / shipping / price questions → answer from store info. NO tool call.
6. After calling a tool: describe the REAL results warmly. Never add fake products.

━━━ STORE INFO ━━━
- 100% authentic perfumes from international fragrance houses
- Sizes: 10ml decants or full original bottles
- Payment: Cash on Delivery (COD) only — no card needed
- Free shipping: orders over 400 dh
- Delivery Morocco: 24–48h | Maghreb/France: 5–10 days
- WhatsApp: +212 621 558 544 (9am–10pm)
- Boutique: Casablanca, Mon–Sat 10am–8pm
- Returns: 14 days, sealed bottles only
- 10ml = ~100–150 sprays = 6 weeks to 3 months

━━━ HOW TO ORDER ━━━
1. Find a perfume you love
2. Choose size (10ml or full bottle)
3. Click "Add to Cart" → "Checkout"
4. Enter name, phone, city, address
5. Select Cash on Delivery → Confirm
6. We call/WhatsApp to confirm → ship in 24h

━━━ TONE ━━━
Warm, natural, like a friend who knows perfumes deeply. Use poetic sensory language for fragrances (notes, sillage, mood, occasion). Be concise. Never robotic.

━━━ FEW-SHOT EXAMPLES (follow exactly) ━━━

User: chkon ntoma
Layla: أنا ليلى 🌸 — مستشارتك للعطور في Luxe Essence بالدار البيضاء. كنعاونك تلقى العطر لي كيناسبك! واش بغيتي شي حاجة معينة؟

User: شكون نتوما
Layla: أنا ليلى 🌸 — مستشارتك للعطور في Luxe Essence. عندنا عطور أصيلة من أحسن الدور العالمية. كيفاش نقدر نعاونك اليوم؟

User: salam
Layla: وعليكم السلام! أنا ليلى، مستشارتك للعطور في Luxe Essence بالدار البيضاء 🌸 كيفاش نقدر نعاونك؟

User: bonjour
Layla: Bonjour ! Je suis Layla, votre conseillère parfums chez Luxe Essence à Casablanca 🌸 Comment puis-je vous aider ?

User: who are you
Layla: I'm Layla 🌸 — your personal perfume advisor at Luxe Essence, a luxury fragrance boutique in Casablanca, Morocco. How can I help you find your perfect scent?

CRITICAL REMINDERS:
- "chkon", "ntoma", "salam", "hi", "bonjour" are NEVER product names. NEVER search for them.
- When asked to show products → call get_featured_products FIRST, describe results AFTER.
- NEVER write image URLs or http links in your reply text.
- NEVER describe a product that was not in the tool result."""


# ── Friendly fallback messages per language ────────────────────────────────────

def _fallback_message(message: str) -> str:
    msg = message.lower()
    if any(w in msg for w in ["chkon", "bghit", "3end", "kifash", "salam", "دار", "واش", "مزيان"]):
        return "عذراً، كاين مشكل صغير دابا. عاود جرب من بعد شوية 🌸"
    if any(w in msg for w in ["bonjour", "merci", "parfum", "je veux", "avez"]):
        return "Désolée, une erreur s'est produite. Veuillez réessayer dans un instant 🌸"
    if any(w in msg for w in ["مرحبا", "عطر", "أريد", "كيف"]):
        return "عذراً، حدث خطأ مؤقت. يرجى المحاولة مرة أخرى 🌸"
    return "Sorry, I'm having a moment. Please try again in a few seconds 🌸"


# ── Tool functions ─────────────────────────────────────────────────────────────

def search_products(query="", gender="", category="", **_):
    try:
        q = supabase.table("products").select(
            "id, name, brand, gender, category, sizes, images, description, stock"
        ).gt("stock", 0).limit(8)

        if gender in ("men", "women"):
            q = q.eq("gender", gender)
        if category:
            q = q.eq("category", category)

        products = q.execute().data or []

        if query:
            ql = query.lower()
            products = [
                p for p in products
                if ql in str(p.get("name", "")).lower()
                or ql in str(p.get("brand", "")).lower()
                or ql in str((p.get("description") or {}).get("en", "")).lower()
            ]

        if not products:
            return "No products found."

        result = []
        for p in products:
            result.append({
                "id": p["id"],
                "name": p.get("name", {}),
                "brand": p.get("brand", ""),
                "gender": p.get("gender", ""),
                "category": p.get("category", ""),
                "sizes": p.get("sizes", []),
                "price_from": p["sizes"][0]["price"] if p.get("sizes") else None,
                "image": p["images"][0] if p.get("images") else None,
                "description_en": (p.get("description") or {}).get("en", ""),
                "description_ar": (p.get("description") or {}).get("ar", ""),
            })
        return json.dumps(result, ensure_ascii=False)
    except Exception as e:
        import traceback; traceback.print_exc()
        return f"Error: {e}"


def get_featured_products(**_):
    try:
        products = supabase.table("products").select(
            "id, name, brand, gender, category, sizes, images, description, stock"
        ).eq("featured", True).gt("stock", 0).limit(6).execute().data or []
        if not products:
            return "No featured products."
        result = []
        for p in products:
            result.append({
                "id": p["id"],
                "name": p.get("name", {}),
                "brand": p.get("brand", ""),
                "gender": p.get("gender", ""),
                "category": p.get("category", ""),
                "sizes": p.get("sizes", []),
                "price_from": p["sizes"][0]["price"] if p.get("sizes") else None,
                "image": p["images"][0] if p.get("images") else None,
                "description_en": (p.get("description") or {}).get("en", ""),
            })
        return json.dumps(result, ensure_ascii=False)
    except Exception as e:
        return f"Error: {e}"


def get_collections(**_):
    try:
        data = supabase.table("collections").select("id, name, description, image, slug").execute().data or []
        return json.dumps(data, ensure_ascii=False)
    except Exception as e:
        return f"Error: {e}"


def get_product_details(product_id="", **_):
    try:
        if re.match(r'^[0-9a-f-]{36}$', str(product_id), re.I):
            data = supabase.table("products").select("*").eq("id", product_id).single().execute().data
        else:
            rows = supabase.table("products").select("*").ilike("name->>en", f"%{product_id}%").limit(1).execute().data
            data = rows[0] if rows else None
        if not data:
            return "Product not found."
        return json.dumps(data, ensure_ascii=False)
    except Exception as e:
        return f"Error: {e}"


TOOL_MAP = {
    "search_products": search_products,
    "get_featured_products": get_featured_products,
    "get_collections": get_collections,
    "get_product_details": get_product_details,
}

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "search_products",
            "description": "Search perfumes by name, brand, notes, gender (men/women), or category (floral/woody/oriental/fresh/citrus/gourmand). Use whenever a customer wants a recommendation or wants to browse.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query":    {"type": "string", "description": "Search term (name, brand, notes)"},
                    "gender":   {"type": "string", "description": "men or women", "enum": ["men", "women", ""]},
                    "category": {"type": "string", "description": "Fragrance category"},
                },
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_featured_products",
            "description": "Get featured/bestselling perfumes. Use when customer asks what's popular or wants general recommendations.",
            "parameters": {"type": "object", "properties": {}},
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_collections",
            "description": "Get all fragrance collections available in the store.",
            "parameters": {"type": "object", "properties": {}},
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_product_details",
            "description": "Get full details of a specific product by its ID.",
            "parameters": {
                "type": "object",
                "properties": {
                    "product_id": {"type": "string", "description": "The product UUID"},
                },
                "required": ["product_id"],
            },
        },
    },
]


# ── Strip malformed tool-call artifacts from text output ──────────────────────

def _clean(text: str) -> str:
    # Remove <function=...>...</function> and <function=.../>  leaked into text
    text = re.sub(r'<function=[^>]*>.*?</function>', '', text, flags=re.DOTALL)
    text = re.sub(r'<function=[^>/]*/>', '', text)
    # Remove bare JSON tool-call blobs that sometimes appear
    text = re.sub(r'\{"name":\s*"[^"]+",\s*"parameters":[^}]*\}', '', text)
    # Remove sentences where the model announces it's calling a function
    text = re.sub(r'[^\n.!؟]*(?:get_featured_products|search_products|get_collections|get_product_details)[^\n.!؟]*[.!؟]?', '', text)
    return text.strip()


# ── Groq call with retry + fallback ───────────────────────────────────────────

def _ai_call(messages, tools=None, tool_choice="auto"):
    kwargs = dict(
        model=MODEL,
        messages=messages,
        temperature=0.7,
        max_tokens=1024,
    )
    if tools:
        kwargs["tools"] = tools
        kwargs["tool_choice"] = tool_choice

    for attempt in range(3):
        try:
            return client.chat.completions.create(**kwargs)

        except BadRequestError:
            # Malformed tool call — drop tools and retry once
            kwargs.pop("tools", None)
            kwargs.pop("tool_choice", None)
            return client.chat.completions.create(**kwargs)

        except RateLimitError:
            if attempt < 2:
                time.sleep(2 ** attempt)
                continue
            raise

        except (InternalServerError, APIConnectionError):
            if attempt < 2:
                time.sleep(1)
                continue
            raise

    raise RuntimeError("AI call failed after retries")


# ── Main chat function ─────────────────────────────────────────────────────────

def run_chat(message: str, history: list) -> tuple[str, list | None]:
    try:
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]

        # Keep only the last 8 exchanges (16 messages) to avoid context overflow
        trimmed = history[-16:] if len(history) > 16 else history
        for h in trimmed:
            messages.append({"role": h["role"], "content": h["content"]})
        messages.append({"role": "user", "content": message})

        products = None

        # Step 1 — call with tools
        response = _ai_call(messages, tools=TOOLS, tool_choice="auto")
        choice = response.choices[0]
        msg = choice.message

        # Step 2 — execute tool calls if requested
        if choice.finish_reason == "tool_calls" and msg.tool_calls:
            messages.append({
                "role": "assistant",
                "content": msg.content or "",
                "tool_calls": [
                    {
                        "id": tc.id,
                        "type": "function",
                        "function": {"name": tc.function.name, "arguments": tc.function.arguments},
                    }
                    for tc in msg.tool_calls
                ],
            })

            for tc in msg.tool_calls:
                fn_name = tc.function.name
                try:
                    args_raw = tc.function.arguments
                    parsed = json.loads(args_raw) if isinstance(args_raw, str) else args_raw
                    fn_args = parsed if isinstance(parsed, dict) else {}
                except Exception:
                    fn_args = {}

                fn = TOOL_MAP.get(fn_name)
                result = fn(**fn_args) if fn else "Tool not found."

                try:
                    parsed_result = json.loads(result)
                    if fn_name in ("search_products", "get_featured_products") and isinstance(parsed_result, list) and parsed_result:
                        products = parsed_result
                    elif fn_name == "get_product_details" and isinstance(parsed_result, dict) and parsed_result.get("id"):
                        products = [parsed_result]
                except Exception:
                    pass

                messages.append({"role": "tool", "tool_call_id": tc.id, "content": result})

            # Step 3 — final call without tools
            final = _ai_call(messages)
            return _clean(final.choices[0].message.content or ""), products

        return _clean(msg.content or ""), products

    except Exception:
        import traceback
        traceback.print_exc()
        return _fallback_message(message), None
