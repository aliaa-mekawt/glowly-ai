import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_PRODUCTS } from './src/data/catalog.ts';
import { Product } from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

// Shared in-memory catalog initialized with authentic Egyptian & imported products
let catalogProducts: Product[] = [...INITIAL_PRODUCTS];

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

const app = express();
app.use(express.json());

// --- Catalog API ---
app.get('/api/catalog', (req: Request, res: Response) => {
  const { category, skinType, maxPrice, origin, query } = req.query;
  let results = [...catalogProducts];

  if (category && typeof category === 'string' && category !== 'all') {
    results = results.filter((p) => p.category === category);
  }

  if (origin && typeof origin === 'string' && origin !== 'all') {
    results = results.filter((p) => p.origin === origin);
  }

  if (skinType && typeof skinType === 'string' && skinType !== 'all') {
    results = results.filter(
      (p) => p.targetSkinTypes.includes(skinType as any) || p.targetSkinTypes.includes('all' as any)
    );
  }

  if (maxPrice && !isNaN(Number(maxPrice))) {
    results = results.filter((p) => (p.priceEGP || p.price) <= Number(maxPrice));
  }

  if (query && typeof query === 'string') {
    const q = query.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.nameAr && p.nameAr.includes(query)) ||
        p.brand.toLowerCase().includes(q) ||
        (p.brandAr && p.brandAr.includes(query)) ||
        p.activeIngredients.some((i) => i.toLowerCase().includes(q))
    );
  }

  res.json({ success: true, count: results.length, products: results });
});

import crypto from 'crypto';
import fs from 'fs';
import cookieParser from 'cookie-parser';

app.use(cookieParser());

// Persistent catalog disk storage path (free zero-cost local persistence fallback)
const CATALOG_PERSISTENCE_FILE = path.resolve(__dirname, 'catalog-storage.json');

// Initialize catalog from disk if previously saved, else default to authentic catalog
try {
  if (fs.existsSync(CATALOG_PERSISTENCE_FILE)) {
    const raw = fs.readFileSync(CATALOG_PERSISTENCE_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      catalogProducts = parsed;
      console.log(`Loaded ${catalogProducts.length} products from disk storage backup`);
    }
  }
} catch (e) {
  console.warn('Could not read catalog-storage.json, using built-in catalog:', e);
}

function persistCatalogToDisk() {
  try {
    fs.writeFileSync(CATALOG_PERSISTENCE_FILE, JSON.stringify(catalogProducts, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Catalog disk persistence error:', err);
  }
}

// Session store for authenticated admin sessions: token -> timestamp
const activeAdminSessions = new Map<string, number>();
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

// Rate-limiting for admin login: IP -> { attempts: number, lockUntil: number }
const loginRateLimitMap = new Map<string, { attempts: number; lockUntil: number }>();

function checkLoginRateLimit(ip: string): { allowed: boolean; remainingSeconds: number } {
  const now = Date.now();
  const entry = loginRateLimitMap.get(ip);
  if (!entry) return { allowed: true, remainingSeconds: 0 };
  if (entry.lockUntil > now) {
    return { allowed: false, remainingSeconds: Math.ceil((entry.lockUntil - now) / 1000) };
  }
  if (now - entry.lockUntil > 15 * 60 * 1000) {
    loginRateLimitMap.delete(ip);
    return { allowed: true, remainingSeconds: 0 };
  }
  return { allowed: true, remainingSeconds: 0 };
}

function recordLoginFailure(ip: string) {
  const now = Date.now();
  const entry = loginRateLimitMap.get(ip) || { attempts: 0, lockUntil: 0 };
  entry.attempts += 1;
  if (entry.attempts >= 5) {
    entry.lockUntil = now + 15 * 60 * 1000; // Lock for 15 minutes
  }
  loginRateLimitMap.set(ip, entry);
}

function recordLoginSuccess(ip: string) {
  loginRateLimitMap.delete(ip);
}

// Admin Authentication Middleware
const requireAdmin = (req: Request, res: Response, next: express.NextFunction) => {
  const sessionToken = req.cookies?.['glowly_admin_session'];
  
  if (!sessionToken || typeof sessionToken !== 'string') {
    res.status(401).json({ error: 'Unauthorized: Administrator session required' });
    return;
  }

  const sessionCreatedAt = activeAdminSessions.get(sessionToken);
  if (!sessionCreatedAt || Date.now() - sessionCreatedAt > SESSION_TTL_MS) {
    if (sessionCreatedAt) activeAdminSessions.delete(sessionToken);
    res.clearCookie('glowly_admin_session');
    res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
    return;
  }

  next();
};

// Admin Session Status Check Endpoint
app.get('/api/admin/status', (req: Request, res: Response) => {
  const sessionToken = req.cookies?.['glowly_admin_session'];
  const configured = Boolean(process.env.ADMIN_PASSCODE && process.env.ADMIN_PASSCODE.trim().length > 0);
  
  if (!sessionToken) {
    res.json({ authenticated: false, configured });
    return;
  }

  const sessionCreatedAt = activeAdminSessions.get(sessionToken);
  if (!sessionCreatedAt || Date.now() - sessionCreatedAt > SESSION_TTL_MS) {
    res.json({ authenticated: false, configured });
    return;
  }

  res.json({ authenticated: true, configured });
});

// Admin Login Endpoint
app.post('/api/admin/login', (req: Request, res: Response) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  const { passcode } = req.body;

  const rateCheck = checkLoginRateLimit(clientIp);
  if (!rateCheck.allowed) {
    res.status(429).json({
      error: `Too many failed login attempts. Please wait ${rateCheck.remainingSeconds} seconds before trying again.`,
    });
    return;
  }

  const adminPasscode = process.env.ADMIN_PASSCODE;
  if (!adminPasscode || adminPasscode.trim().length === 0) {
    res.status(503).json({
      error: 'Administrator authentication is not yet configured on this server. Please define ADMIN_PASSCODE in server environment variables.',
      configured: false,
    });
    return;
  }

  if (typeof passcode !== 'string' || passcode.length === 0) {
    recordLoginFailure(clientIp);
    res.status(400).json({ error: 'Passcode is required' });
    return;
  }

  // Timing-safe comparison to prevent side-channel timing attacks
  const inputBuffer = Buffer.from(passcode);
  const secretBuffer = Buffer.from(adminPasscode);

  const isMatch =
    inputBuffer.length === secretBuffer.length &&
    crypto.timingSafeEqual(inputBuffer, secretBuffer);

  if (!isMatch) {
    recordLoginFailure(clientIp);
    res.status(401).json({ error: 'Invalid administrator credentials' });
    return;
  }

  recordLoginSuccess(clientIp);

  // Generate cryptographically secure random session token
  const token = crypto.randomBytes(32).toString('hex');
  activeAdminSessions.set(token, Date.now());

  // Set secure HTTP-only cookie
  res.cookie('glowly_admin_session', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    maxAge: SESSION_TTL_MS,
    path: '/',
  });

  res.json({ success: true, message: 'Administrator session established' });
});

// Admin Logout Endpoint
app.post('/api/admin/logout', (req: Request, res: Response) => {
  const sessionToken = req.cookies?.['glowly_admin_session'];
  if (sessionToken) {
    activeAdminSessions.delete(sessionToken);
  }
  res.clearCookie('glowly_admin_session', { path: '/' });
  res.json({ success: true, message: 'Logged out successfully' });
});

// Storage and catalog status endpoint
app.get('/api/admin/storage-status', requireAdmin, (req: Request, res: Response) => {
  const hasDiskStorage = fs.existsSync(CATALOG_PERSISTENCE_FILE);
  let fileSize = 0;
  if (hasDiskStorage) {
    try {
      fileSize = fs.statSync(CATALOG_PERSISTENCE_FILE).size;
    } catch {}
  }
  res.json({
    storageType: 'Ephemeral Server Disk + Memory Cache',
    isPersistentAcrossRestarts: true,
    persistenceFilePath: CATALOG_PERSISTENCE_FILE,
    diskFileExists: hasDiskStorage,
    fileSizeBytes: fileSize,
    totalProductsCount: catalogProducts.length,
    userIsolation: 'Client-side private storage (localStorage) — no cross-user private data leakage',
  });
});

app.post('/api/catalog', requireAdmin, (req: Request, res: Response) => {
  const productData: Product = req.body;
  if (!productData.name || !productData.brand || !productData.price) {
    res.status(400).json({ error: 'Name, brand, and price are required' });
    return;
  }
  const newProduct: Product = {
    ...productData,
    id: `prod-custom-${Date.now()}`,
    verified: Boolean(productData.verified),
    dataStatus: productData.dataStatus || 'verified',
    priceVerificationDate: new Date().toISOString().split('T')[0],
    verifiedDate: new Date().toISOString().split('T')[0],
  };
  catalogProducts.unshift(newProduct);
  persistCatalogToDisk();
  res.status(201).json({ success: true, product: newProduct });
});

app.put('/api/catalog/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = catalogProducts.findIndex((p) => p.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  catalogProducts[index] = { ...catalogProducts[index], ...req.body };
  persistCatalogToDisk();
  res.json({ success: true, product: catalogProducts[index] });
});

app.delete('/api/catalog/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  catalogProducts = catalogProducts.filter((p) => p.id !== id);
  persistCatalogToDisk();
  res.json({ success: true });
});

// --- AI Chat Assistant Route ---
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { message, conversationHistory = [], profile, ownedProducts = [] } = req.body;

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Message is required' });
    return;
  }

  const isArabicInput = /[\u0600-\u06FF]/.test(message);

  const profileSummary = profile
    ? `User Profile:
- Language: ${isArabicInput ? 'Arabic' : 'English'}
- Market: Egypt (EGP currency)
- Age Range: ${profile.ageRange || '18-24'}
- Skin Type: ${profile.skinType || 'Combination'}
- Concerns: ${(profile.concerns || []).join(', ') || 'Not specified'}
- Sensitivities/Allergies: ${(profile.sensitivities || []).join(', ') || 'None reported'}
- Current Routine Summary: ${profile.currentRoutineSummary || 'Minimal'}
- Makeup Level: ${profile.makeupExperience || 'Beginner'}
- Skin Tone & Undertone: ${profile.skinTone || 'Medium'} (${profile.undertone || 'Neutral'})
- Budget Preference: ${profile.budgetTier || 'Budget'} (approx ${profile.monthlyBudget || 600} EGP)`
    : 'No user profile saved yet.';

  const shelfSummary =
    ownedProducts.length > 0
      ? `Products User Already Owns in Her Vanity Shelf:
${ownedProducts.map((p: any) => `- ${p.brand} ${p.name} (${p.category})`).join('\n')}`
      : 'No owned products recorded yet.';

  const systemInstruction = `You are Glowly AI, the premier beauty, skincare, and self-care expert for women and girls aged 15-35, specialized in Egyptian and global dermatological beauty.
Language Policy: Detect the language of the user message. If the user writes in Arabic (including Egyptian Arabic dialect "عايزة روتين", "حبوب", "بشرتي دهنية", "صيدليات مصر"), respond in natural, friendly, accurate Arabic. If the user writes in English, reply in refined, clear English.

Tone: Warm, encouraging, scientifically grounded, empathetic, transparent, and non-judgmental.

Core Behavioral Directives:
1. MULTIPLE RECOMMENDATIONS: When suggesting products, do not give just one product. Provide 2 to 4 distinct candidate alternatives:
   - Match 1: Best overall match for her skin barrier and climate.
   - Match 2: Best certified Egyptian brand budget hero (e.g. Bobana, Starville, Eva Cosmetics, Infinity Clinic, Raw African) with estimated price in EGP.
   - Match 3: Another suitable option or imported pharmacy staple (e.g. CeraVe, La Roche-Posay, Bioderma).
2. For each recommendation, explain:
   - Why it fits her skin type
   - Key active ingredients & what they do
   - Any precautions or sensitivities
   - Approximate verified price in EGP when known
3. ALWAYS check her vanity shelf first: if she already owns a suitable cleanser or sunscreen, tell her to keep using it to save money!
4. ACTIVE COLLISION WARNING: Alert her if she mixes dangerous combinations (e.g. Retinoids + strong AHA/BHA in the same night).
5. MEDICAL BOUNDARY: You are a cosmetic educator, not a medical doctor. Never diagnose skin diseases (cystic acne, severe eczema, psoriasis, infections) or prescribe medications. Recommend consulting a board-certified dermatologist for persistent, cystic, or painful symptoms.
6. Keep recommendations realistic and tailored to Egypt's climate (hot summers, sun protection, non-comedogenic lightweight textures).`;

  if (!aiClient || !apiKey) {
    // Intelligent bilingual fallback advisor
    const fallbackAnswer = generateRuleBasedBeautyAdvice(message, profile, ownedProducts, isArabicInput);
    res.json({ response: fallbackAnswer, isFallback: true });
    return;
  }

  try {
    const prompt = `Context:
${profileSummary}

${shelfSummary}

Conversation context:
${conversationHistory
  .slice(-4)
  .map((m: any) => `${m.role === 'user' ? 'User' : 'Glowly AI'}: ${m.content}`)
  .join('\n')}

User Query: ${message}

Provide a thoughtful, personalized, well-structured response (in ${isArabicInput ? 'Arabic' : 'English'}):`;

    let resultText = '';
    let usedModel = '';

    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
    for (const modelName of candidateModels) {
      try {
        const result = await aiClient.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });
        if (result.text) {
          resultText = result.text;
          usedModel = modelName;
          break;
        }
      } catch (modelErr: any) {
        console.warn(`Model ${modelName} unavailable or busy:`, modelErr?.status || modelErr?.message);
      }
    }

    if (!resultText) {
      const fallbackAnswer = generateRuleBasedBeautyAdvice(message, profile, ownedProducts, isArabicInput);
      res.json({ response: fallbackAnswer, isFallback: true });
      return;
    }

    res.json({ response: resultText, isFallback: false, model: usedModel });
  } catch (err: any) {
    console.error('Gemini API Error:', err);
    const fallbackAnswer = generateRuleBasedBeautyAdvice(message, profile, ownedProducts, isArabicInput);
    res.json({ response: fallbackAnswer, isFallback: true, error: err?.message });
  }
});

// --- AI Ingredient Decoder Route ---
app.post('/api/ai/decode-ingredients', async (req: Request, res: Response) => {
  const { ingredientList, productName, language = 'en' } = req.body;

  if (!ingredientList || typeof ingredientList !== 'string') {
    res.status(400).json({ error: 'Ingredient list string is required' });
    return;
  }

  const isAr = language === 'ar' || /[\u0600-\u06FF]/.test(productName || '');

  if (!aiClient || !apiKey) {
    res.json({
      summary: isAr
        ? `تحليل تركيبة "${productName || 'المنتج التجميلي'}". يحتوي على مرطبات خفيفة ومكونات داعمة لحاجز البشرة.`
        : `Analyzed ingredients for "${productName || 'Cosmetic Formula'}". Includes active humectants and barrier lipids.`,
      identifiedActives: ['Glycerin (جلسرين)', 'Niacinamide (نياسيناميد)', 'Ceramides (سيراميدات)', 'Sodium Hyaluronate (هيالورونيك أسيد)'],
      potentialIrritants: [isAr ? 'العطور (إذا كان المنتج معطراً)' : 'Fragrance (if scented)'],
      comedogenicRisk: isAr ? 'منخفض لمعظم أنواع البشرة' : 'Low to Moderate depending on skin type',
      verdict: isAr
        ? 'تركيبة متوازنة وداعمة للحاجز الواقي. ينصح بعمل اختبار حساسية (باتش تست) خلف الفك لمدة 24 ساعة قبل التطبيق الكامل.'
        : 'Balanced formula suitable for daily hydration. Always patch test before full facial application.',
      isFallback: true,
    });
    return;
  }

  try {
    const prompt = `Act as an expert cosmetic chemist and beauty ingredient decoder.
Analyze this cosmetic ingredient list for ${productName || 'Formula'}:
${ingredientList}

Return a concise educational JSON breakdown in ${isAr ? 'Arabic' : 'English'} with this exact schema:
{
  "summary": "1-2 sentence overview of the formulation type",
  "keyActives": [{"name": "string", "purpose": "string", "benefit": "string"}],
  "barrierLipidsAndHumectants": ["string"],
  "potentialSensitizersOrAllergens": ["string"],
  "comedogenicAssessment": "string explanation",
  "routineCompatibility": "string",
  "safetyVerdict": "Warm scientific summary with patch test advice"
}`;

    let parsed: any = null;
    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
    for (const modelName of candidateModels) {
      try {
        const result = await aiClient.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });
        if (result.text) {
          parsed = JSON.parse(result.text);
          break;
        }
      } catch (mErr: any) {
        console.warn(`Decoder model ${modelName} error:`, mErr?.status || mErr?.message);
      }
    }

    if (!parsed) {
      throw new Error('Could not parse ingredient breakdown from AI');
    }
    res.json({ success: true, data: parsed, isFallback: false });
  } catch (err: any) {
    console.error('Ingredient decoding error:', err);
    res.json({
      summary: isAr
        ? `تحليل التركيبة: تحتوي على مواد مرطبة ومطرية لطيفة داعمة للحاجز السطحي.`
        : `Analyzed formula. Contains gentle hydration agents and emulsifiers.`,
      identifiedActives: ['Hydration agents', 'Barrier-supporting emollients'],
      potentialIrritants: ['Individual sensitivities to botanical extracts or essential oils'],
      comedogenicRisk: isAr ? 'منخفض للتركيبات المائية' : 'Generally low for water-based formulas',
      safetyVerdict: isAr
        ? 'التركيبة داعمة لصحة الحاجز الواقي. قومي بعمل اختبار حساسية خلف الأذن لمدة 24 ساعة للتأكد من الراحة التامة.'
        : 'Formula appears supportive for everyday barrier health. Perform a 24-hour patch test behind your ear first.',
      isFallback: true,
    });
  }
});

// Helper for bilingual rule-based beauty advice fallback
function generateRuleBasedBeautyAdvice(
  message: string,
  profile: any,
  ownedProducts: any[],
  isArabic: boolean
): string {
  const lower = message.toLowerCase();
  const skinType = profile?.skinType || 'combination';
  const ownedCount = ownedProducts.length;

  if (isArabic) {
    if (lower.includes('روتين') || lower.includes('اقتصادي') || lower.includes('دهنية') || lower.includes('حبوب')) {
      return `### روتين العناية المقترح للبشرة (${skinType === 'oily' ? 'الدهنية' : 'المختلطة'}) بالسوق المصري 🇪🇬

أهلاً بكِ! بناءً على طبيعة بشرتكِ وأجواء مصر، صممت لكِ روتيناً فعالاً واقتصادياً يركز على تنقية المسام وحماية حاجز البشرة:

#### 1. الروتين الصباحي (حماية وترطيب خفيف):
1. **غسول منظف للمسام:**
   - **الخيار المصري الاقتصادي الأفضل:** **ستارفيل غسول (Starville Cleanser)** - حوالي 150 ج.م، بزيت شجرة الشاي والساليسيليك ينظف الحبوب دون جفاف.
   - **البديل المستورد:** سيرافي جل منظف (CeraVe Foaming) - حوالي 490 ج.م.
2. **مرطب خفيف غير زيتي:**
   - **الخيار المصري:** إيفا ألوفيرا جل أو بوبانا جل مرطب - حوالي 90–120 ج.م.
   - **البديل المستورد:** سيرافي بي إم لوشن (CeraVe PM) - حوالي 560 ج.م.
3. **واقي شمس جل غير دهني (أهم خطوة):**
   - **الخيار المصري الأفضل:** **بوبانا جل واقي شمس SPF 50+ (Bobana Gel)** - حوالي 175 ج.م، ملمسه مائي بدون لمعة أو أثر أبيض.
   - **خيار صيدلاني ممتاز:** إنفينيتي هايدرو بوست جل SPF 50+ - حوالي 290 ج.م.

#### 2. الروتين المسائي (تنظيف عميق وترميم):
1. **تنظيف الوجه:** نفس الغسول اللطيف بالماء الفاتر.
2. **علاج الحبوب والمسام (2-3 مرات أسبوعياً فقط):** سيروم نياسيناميد 10% (ذا أورديناري حوالي 440 ج.م) أو تونر ساليسيليك BHA.
3. **كريم الترطيب الليلي:** طبقة خفيفة من المرطب لحبس الرطوبة أثناء النوم.

${ownedCount > 0 ? `*ملاحظة الخزانة:* مسجل في خزانتكِ ${ownedCount} منتج. تأكدي أولاً من استخدام ما تملكينه قبل شراء أي منتج جديد لتوفير ميزانيتك!` : ''}
*نصيحة أمان:* ابدئي أي منتج علاجي جديد بالتدريج (مرة أو مرتين أسبوعياً) مع عمل اختبار حساسية خلف الفك لمدة 24 ساعة.`;
    }

    if (lower.includes('مع بعض') || lower.includes('خلط') || lower.includes('ريتينول') || lower.includes('فيتامين')) {
      return `### إرشادات توافق المكونات النشطة وسلامة البشرة

**قواعد دمج المكونات بأمان:**
- **نياسيناميد + هيالورونيك أسيد:** ثنائي ممتاز ومهدئ للبشرة، ينظم الدهون ويرطب بعمق.
- **فيتامين سي (صباحاً) + واقي الشمس:** أفضل حماية مضادة للأكسدة والتصبغات من أشعة الشمس.
- **المقشرات (سلساليك BHA / جليكوليك AHA) + الريتينول:** ⚠️ **احذري وضعهما في نفس الليلة!** وزعيها على ليالٍ متبادلة (مثلاً: المقشر ليلة الثلاثاء، والريتينول ليلة الخميس) لتفادي حرق وتحسس حاجز البشرة.

إذا شعرتِ بأي وخز شديد أو احمرار أو قشور، أوقفي المقشرات فوراً واكتفي بغسول خفيف ومرطب بالسيراميد لمدة أسبوع.`;
    }

    return `### استشارة Glowly AI المخصصة لجمالكِ

أهلاً بكِ! راجعت ملف بشرتكِ المحفوظ (**${skinType}**) وأولوياتكِ.

كيف تحبين أن نساعدكِ اليوم؟
1. ترشيح بدائل اقتصادية مصرية معتمدة لمنتجاتكِ الحالية؟
2. فحص توافق منتجين تنوين استخدامهما معاً؟
3. ضبط روتين صباحي ومسائي بالجنيه المصري يتوافق مع ميزانيتك؟
4. تنسيق ألوان المكياج المناسبة لدرجة لونكِ وآندرتون بشرتك؟

اكتبي لي براحتك بالعامية المصرية أو الفصحى، وأنا معكِ خطوة بخطوة!`;
  }

  // English fallback
  if (lower.includes('simple') || lower.includes('routine') || lower.includes('oily')) {
    return `### Personalized Skincare Regimen (Egyptian & Global Market)

Here is a streamlined, barrier-friendly routine designed for your **${skinType.toUpperCase()}** skin:

#### Morning (Protect & Balance)
1. **Gentle Purifying Cleanser:**
   - **Egyptian Budget Hero:** **Starville Facial Cleanser** (~150 EGP / $3.00) — Tea tree & salicylic acid cleanses without stripping.
   - **Imported Option:** CeraVe Foaming Cleanser (~490 EGP / $15.99).
2. **Lightweight Hydrator:**
   - **Egyptian Brand:** Eva Skin Clinic Hyaluronic Acid Serum (~220 EGP).
3. **Daily Sunscreen (Non-negotiable):**
   - **Egyptian Budget Pick:** **Bobana Sunscreen Gel SPF 50+** (~175 EGP / $3.50) — Lightweight water-gel with zero white cast.
   - **Clinical Choice:** Infinity Care Hydro Boost Gel SPF 50+ (~290 EGP).

#### Evening (Clear & Repair)
1. **Cleanse:** Starville or Bioderma Sensibio H2O.
2. **Active Step (2–3 nights weekly):** Peach Slices 2% BHA Toner or The Ordinary Niacinamide 10%.
3. **Moisture Seal:** CeraVe PM Lotion or Eva Skin Clinic Day/Night Cream.

${ownedCount > 0 ? `*Vanity Shelf Notice:* You have ${ownedCount} product(s) registered in your shelf. Prioritize using what you already own before purchasing new items!` : ''}
*Patch Test Notice:* Always test any active formulation behind your jawline for 24 hours prior to full face application.`;
  }

  return `### Glowly AI Beauty Consultation

Hello! Based on your saved **${skinType}** beauty profile and preferences:

Would you like me to:
1. Recommend top certified Egyptian brands (Bobana, Starville, Eva, Infinity, Raw African)?
2. Check compatibility between your current products?
3. Calculate an all-essential routine fitting your target monthly budget in EGP?
4. Find an affordable drugstore dupe for a high-end product?

Feel free to ask in Arabic or English, and I'll tailor every recommendation!`;
}

// --- Mount Vite / Static Files ---
if (!isProd) {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Glowly AI server active on http://0.0.0.0:${PORT}`);
});
