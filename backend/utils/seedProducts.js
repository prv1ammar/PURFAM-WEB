const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/luxe-essence';

// ─── Image pools (Unsplash – reliable, no hotlink block) ─────────────────────
const U = 'https://images.unsplash.com/photo-';
const I = {
  dm:  U + '1541643600914-78b084683702?w=600&q=80', // dark luxury men
  fm:  U + '1523293182086-7651a899d37f?w=600&q=80', // fresh clean men
  om:  U + '1509457931446-6fee5d0bb1f8?w=600&q=80', // oriental/oud dark
  wm:  U + '1547887537-6158d64c35b3?w=600&q=80',   // woody warm men
  fw:  U + '1585386959984-a4155224a1ad?w=600&q=80', // floral women
  gw:  U + '1588776814546-1ffcf47267a5?w=600&q=80', // gold feminine
  nw:  U + '1548036328-c9fa89d128fa?w=600&q=80',   // niche luxe
  un:  U + '1590736969955-71cc94901144?w=600&q=80', // unisex classic
};

// ─── Helper ────────────────────────────────────────────────────────────────────
const mk = (nameEn, nameAr, brand, gender, cat, price, img, descEn, descAr, featured = false) => ({
  name: { en: nameEn, ar: nameAr },
  brand,
  description: { en: descEn, ar: descAr },
  gender,
  category: cat,
  sizes: [{ ml: 10, price }],
  images: [img],
  stock: 60,
  featured,
});

// ─── 118 unique products (duplicates unified as unisex) ───────────────────────
const products = [

  // ════════════════════════════════════════════════════════════
  //  ACCESSIBLE (40–80 dh) — HOMMES
  // ════════════════════════════════════════════════════════════
  mk('Momento','مومنتو','Armaf','men','fresh',40,I.fm,
    'A fresh and vibrant 10ml decant that opens with clean citrus and herbal notes, perfect for daily wear.',
    'عطر منعش وحيوي، يفتح بنوتات حمضية نظيفة وأعشاب، مثالي للاستخدام اليومي.'),

  mk('Club de Nuit Intense','كلوب دو نوي إنتنس','Armaf','men','woody',50,I.dm,
    'An intense woody fragrance inspired by the legendary Creed Aventus, with birch smoke, pineapple, and black currant opening onto a base of ambergris and oakmoss.',
    'عطر خشبي مكثف مستوحى من الأسطورة كريد أفنتوس، بنوتات دخان البتولا والأناناس والكشمش الأسود على قاعدة من العنبر والطحلب.',
    false),

  mk('Liquid Brun','ليكويد برون','Mancera','men','woody',50,I.wm,
    'A warm and rich woody amber fragrance with notes of dark woods, leather, and precious resins creating a sensual signature.',
    'عطر خشبي عنبري دافئ وغني بنوتات الأخشاب الداكنة والجلد والراتنجات النفيسة.'),

  mk('9PM','9 بي إم','Afnan','men','oriental',60,I.om,
    'A captivating oriental-spicy decant inspired by Azzaro Wanted By Night, with bergamot, cardamom, tobacco, and addictive vanilla base.',
    'عطر شرقي توابلي آسر مستوحى من أزارو ونتيد باي نايت، بالبرغموت والهيل والتبغ وقاعدة فانيليا مدمنة.'),

  mk('9PM Rebel','9 بي إم ريبل','Afnan','men','oriental',70,I.om,
    'A rebellious oriental fragrance with bold spices, dark resins, and an electrifying base that commands attention.',
    'عطر شرقي متمرد بتوابل جريئة وراتنجات داكنة وقاعدة مثيرة تستقطب الأنظار.'),

  mk('9PM Elixir','9 بي إم إليكسير','Afnan','men','gourmand',70,I.wm,
    'An intense elixir version with amplified sweetness, rich amber, and gourmand tonka bean notes for a memorable sillage.',
    'إليكسير مكثف بحلاوة معززة وعنبر غني ونوتات فول التونكا الحلوى لأثر لا يُنسى.'),

  mk('French Tobacco','فرنش توباكو','Mancera','men','woody',70,I.dm,
    'A sophisticated tobacco and wood accord that evokes the elegance of Parisian ateliers, with warm leathery undertones.',
    'مزيج تبغ وخشب راقٍ يستحضر أناقة المحترفات الباريسية مع دفء جلدي.'),

  mk('1 Million Lucky','وان مليون لاكي','Paco Rabanne','men','oriental',80,I.fm,
    'A fresh-woody take on the iconic 1 Million dynasty with grapefruit, apple, hazelnut, and vetiver for a lucky signature.',
    'نسخة منعشة خشبية من سلالة وان مليون الأيقونية بالجريب فروت والتفاح والبندق والفيتيفر.'),

  mk('9PM Night Out','9 بي إم نايت أوت','Afnan','men','oriental',80,I.om,
    'The night-out edition of the beloved 9PM line, with deeper smoky notes and a magnetic, long-lasting projection.',
    'إصدار ليلة الخروج من خط 9PM المحبوب، بنوتات مدخنة أعمق وإسقاط مغناطيسي دائم.'),

  // ════════════════════════════════════════════════════════════
  //  MID-RANGE (100–175 dh) — HOMMES
  // ════════════════════════════════════════════════════════════
  mk('Stronger With You Intensely','ستروانجر ويذ يو إنتنسلي','Giorgio Armani','men','oriental',100,I.wm,
    'A powerfully sensual oriental fougère with sweet chestnut, patchouli, and vetiver amplified to an intense, skin-close warmth.',
    'عطر شرقي فوجيري حسي بالكستناء الحلو والباتشولي والفيتيفر بدفء مكثف قريب من الجلد.'),

  mk('Le Male Le Parfum','لو مال لو بارفيم','Jean Paul Gaultier','men','oriental',100,I.dm,
    'The darkest and most intense interpretation of Le Male with black lavender, amber, and tonka in a deeply masculine sillage.',
    'أكثر تفسيرات لو مال قتامةً وكثافةً مع اللافندر الأسود والعنبر وفول التونكا في أثر ذكوري عميق.'),

  mk('Arabians Tonka','أرابيانز تونكا','Lattafa','men','gourmand',100,I.wm,
    'A rich oriental gourmand blending Arabic oud-inspired warmth with creamy tonka bean, vanilla, and amber in a sumptuous accord.',
    'شرقي حلواني غني يمزج دفء العود العربي مع فول التونكا الكريمي والفانيليا والعنبر.'),

  mk('Le Male Elixir','لو مال إليكسير','Jean Paul Gaultier','men','oriental',100,I.om,
    'An intensely concentrated elixir of the iconic Le Male, with lavender, vanilla, and a hypnotic amber heart pushed to the extreme.',
    'إليكسير مركّز للغاية من لو مال الأيقوني مع اللافندر والفانيليا وقلب عنبري ساحر مدفوع إلى الحد الأقصى.'),

  mk('Dior Homme Intense','ديور أوم إنتنس','Dior','men','woody',100,I.dm,
    'A hauntingly beautiful iris-based masculine fragrance with ambrette, lavender, and cedarwood in a powdery, sophisticated drydown.',
    'عطر ذكوري ساحر مبني على الأيريس مع الأمبريت واللافندر وخشب الأرز في نهاية بودرية راقية.',
    false),

  mk('Stronger With You Absolutely','ستروانجر ويذ يو أبسولوتلي','Giorgio Armani','men','gourmand',100,I.wm,
    'A caramel and dark woods oriental with magnetic sweetness and a powerful, addictive sillage for confident individuals.',
    'شرقي بالكراميل والأخشاب الداكنة مع حلاوة مغناطيسية وأثر قوي مدمن للشخصيات الواثقة.'),

  mk('Sandalwood','سانتال وود','Lattafa','men','woody',100,I.wm,
    'A creamy and warm sandalwood-centered fragrance with a smooth, comforting base of musk and amber.',
    'عطر دافئ وكريمي يتمحور حول خشب الصندل مع قاعدة ناعمة ومريحة من المسك والعنبر.'),

  mk('Red Tobacco','ريد توباكو','Mancera','men','woody',100,I.dm,
    'A bold and seductive red fruit and tobacco composition with patchouli and amber, evoking the pleasure of a fine cigar.',
    'مزيج جريء وإغرائي من الفاكهة الحمراء والتبغ مع الباتشولي والعنبر، يستحضر متعة سيجار فاخر.'),

  mk('YSL Y EDP','إيه إس إل واي إيدي بي','Yves Saint Laurent','men','woody',100,I.fm,
    'A modern and energetic woody aromatic with fresh apple, bergamot, ginger, and a dry cedarwood signature that defines contemporary masculinity.',
    'عطر خشبي عطري حديث وحيوي بالتفاح المنعش والبرغموت والزنجبيل وبصمة خشب الأرز الجاف.'),

  mk('Arabian Musk','عربيان ماسك','Lattafa','men','oriental',100,I.om,
    'A silky oriental musk crafted in the Arab tradition with warm amber, rose water, and powdery white musk.',
    'مسك شرقي حريري مصنوع بالتقليد العربي مع العنبر الدافئ وماء الورد والمسك الأبيض البودري.'),

  mk('Azzaro Most Wanted','أزارو موست وانتيد','Azzaro','men','oriental',100,I.wm,
    'A seductive amber fougère with cinnamon, tonka bean, and vetiver that captures magnetic charisma and irresistible allure.',
    'عنبر فوجيري إغرائي مع القرفة وفول التونكا والفيتيفر يجسد الكاريزما المغناطيسية والجذب الذي لا يقاوم.'),

  mk('Ultra Male','ألترا مال','Jean Paul Gaultier','men','gourmand',100,I.dm,
    'An ultra-powerful and provocative oriental with intense lavender, pear, spices, and vanilla in a gourmand-spicy signature.',
    'شرقي فائق القوة والاستفزاز مع اللافندر المكثف والكمثرى والتوابل والفانيليا في بصمة حلوى-توابل.'),

  mk('Chopard Oud Malaki','شوبار عود ملكي','Chopard','men','oriental',100,I.om,
    'A royal oriental oud fragrance with saffron, rose, and amber woods creating a majestic and opulent sillage fit for royalty.',
    'عطر عود ملكي شرقي بالزعفران والورد وأخشاب العنبر يخلق أثراً مهيباً وفاخراً يليق بالملوك.'),

  mk('Mancera Lemon Line','مانسيرا ليمون لاين','Mancera','men','citrus',100,I.fm,
    'A vibrant citrus powerhouse with Sicilian lemon, bergamot, and a clean musky woody base that radiates freshness.',
    'عطر حمضي نابض بالحياة بالليمون الصقلي والبرغموت وقاعدة خشبية مسكية نظيفة تشع بالانتعاش.'),

  mk('Habit Rouge EDP','هابي روج إيدي بي','Guerlain','men','oriental',100,I.wm,
    'A classic and elegant oriental from Guerlain\'s heritage, with bergamot, rose, sandalwood, and a sensual amber-vanilla heart.',
    'عطر شرقي كلاسيكي أنيق من إرث غيرلان، بالبرغموت والورد وخشب الصندل وقلب عنبري-فانيليا حسي.'),

  mk('Hermès Terre d\'Hermès EDT','تير ديرميس إيدي تي','Hermès','men','woody',115,I.wm,
    'An iconic woody-citrus composition from Hermès evoking the raw beauty of the earth, with orange, flint mineral, and vetiver.',
    'مزيج خشبي حمضي أيقوني من إيرميس يستحضر الجمال الخام للأرض بالبرتقال والصوان المعدني والفيتيفر.'),

  mk('Bleu de Chanel EDP','بلو دو شانيل إيدي بي','Chanel','men','woody',120,I.fm,
    'A refined woody aromatic with grapefruit, labdanum, and woody notes that embodies the understated elegance of a free man.',
    'عطر خشبي عطري متقن بالجريب فروت واللبدانوم والأخشاب يجسد الأناقة الهادئة لرجل حر.',
    false),

  mk('Bois Impérial','بويس إمبيريال','Initio','men','woody',120,I.dm,
    'An imperial wood accord with sandalwood, vanilla, and musk that balances power and sensuality in a timeless masculine signature.',
    'وتر خشب إمبراطوري بخشب الصندل والفانيليا والمسك يوازن بين القوة والحسية في بصمة ذكورية خالدة.'),

  mk('Boss Bottled Absolu','بوس بوتليد أبسولو','Hugo Boss','men','woody',130,I.dm,
    'The most intense and refined Boss Bottled, with bergamot, apple, cardamom, and sandalwood-vetiver in a commanding, polished finish.',
    'أكثر بوس بوتليد كثافة وأناقةً، بالبرغموت والتفاح والهيل وخشب الصندل-فيتيفر في نهاية محكمة ومصقولة.'),

  mk('Scandal Absolu','سكانديل أبسولو','Jean Paul Gaultier','men','oriental',130,I.dm,
    'A provocative and heady oriental for the daring man, with honey, tuberose, and patchouli amplified to scandalous intensity.',
    'عطر شرقي مثير وصاخب للرجل الجريء، بالعسل والتوبروز والباتشولي مضخوماً إلى كثافة فضائحية.'),

  mk('Le Beau Paradise Garden','لو بو باراديس غاردن','Jean Paul Gaultier','men','fresh',130,I.fm,
    'A tropical and radiant version of Le Beau with mango, coconut, and tiare flower notes evoking a paradise garden.',
    'نسخة استوائية ومشرقة من لو بو مع المانغو وجوز الهند وزهر التياري تستحضر جنة رياض.'),

  mk('Sauvage EDP','سوفاج إيدي بي','Dior','men','fresh',130,I.fm,
    'Dior\'s best-selling fragrance worldwide, a bold and radiant raw freshness with Calabrian bergamot and ambroxan on a patchouli base.',
    'أكثر عطور ديور مبيعاً في العالم، انتعاش خام جريء ومشرق بالبرغموت الكالابري والأمبروكسان على قاعدة باتشولي.',
    true),

  mk('L\'Interdit Rouge','لانترديت روج','Givenchy','women','floral',130,I.fw,
    'The bold red variation of Givenchy\'s iconic L\'Interdit, with orange blossom, jasmine, patchouli, and a sensual dark floral heart.',
    'التنويع الأحمر الجريء على لانترديت الأيقوني من جيفنشي، بزهر البرتقال والياسمين والباتشولي وقلب زهري داكن حسي.'),

  mk('Le Beau Parfum','لو بو بارفيم','Jean Paul Gaultier','men','citrus',135,I.fm,
    'A sophisticated and sensual interpretation of Le Beau with intensified coconut, amber, and tonka bean on a warm woody base.',
    'تفسير راقٍ وحسي للو بو مع جوز الهند المعزز والعنبر وفول التونكا على قاعدة خشبية دافئة.'),

  mk('Valentino Uomo Intense','فالنتينو أومو إنتنس','Valentino','men','oriental',140,I.dm,
    'An intensely seductive Italian fragrance with bergamot, rum, iris, cocoa, and leather — power dressed in Roman sophistication.',
    'عطر إيطالي إغرائي مكثف بالبرغموت والروم والأيريس والكاكاو والجلد — قوة مكسوة بأناقة رومانية.'),

  mk('Valentino Born in Roma Coral Fantasy','فالنتينو كورال فانتازي','Valentino','men','woody',140,I.fm,
    'A luminous woody fragrance with mandarin, aquatic notes, and amber wood that channels a Roman summer fantasy.',
    'عطر خشبي مضيء بالماندرين ونوتات مائية وخشب عنبري يستحضر خيال صيف روماني.'),

  mk('Jazz Club','جاز كلوب','Maison Margiela','men','woody',150,I.dm,
    'A cult fragrance from the REPLICA line that perfectly captures the warm, smoky atmosphere of a late-night jazz club with rum, tobacco, and pink pepper.',
    'عطر ثقافي من خط ريبليكا يجسد بشكل مثالي الأجواء الدافئة المدخنة لنادٍ جاز ليلي بالروم والتبغ والفلفل الوردي.',
    true),

  mk('You Powerfully','يو باورفولي','Zadig & Voltaire','men','woody',150,I.wm,
    'A powerful and modern fougère for the strong-willed man, with bergamot, cedar, and aromatic notes creating an assertive signature.',
    'فوجيري قوي وعصري للرجل ذو الإرادة القوية، بالبرغموت والأرز والنوتات العطرية.'),

  mk('Stronger With You Spices','ستروانجر ويذ يو سبايسيز','Giorgio Armani','men','oriental',150,I.wm,
    'The spiciest chapter in the Stronger With You saga with black pepper, cardamom, and woody tobacco in a fearless masculine blend.',
    'أكثر فصول ستروانجر ويذ يو توابلاً مع الفلفل الأسود والهيل والتبغ الخشبي في مزيج ذكوري جريء.'),

  mk('Spice Bomb Extreme','سبايس بومب إكستريم','Viktor & Rolf','men','oriental',160,I.dm,
    'The extreme edition of the iconic red grenade bottle, packed with explosive cinnamon, tobacco, and bourbon vanilla for maximum impact.',
    'الإصدار المتطرف من زجاجة القنبلة الحمراء الأيقونية، محشوٌ بقرفة متفجرة وتبغ وفانيليا البوربون لأقصى تأثير.'),

  mk('Le Male Collector Christmas','لو مال كولكتور كريسماس','Jean Paul Gaultier','men','oriental',165,I.dm,
    'A limited collector edition of the legendary Le Male, heightened with richer lavender and amplified vanilla in an exclusive festive bottle.',
    'إصدار كولكتور محدود من لو مال الأسطوري، بلافندر أغنى وفانيليا معززة في زجاجة احتفالية حصرية.'),

  mk('Le Male Collector Edition','لو مال كولكتور إيديشن','Jean Paul Gaultier','men','oriental',175,I.dm,
    'A prestige collector edition of the iconic Le Male in a uniquely designed bottle, with the same beloved lavender-vanilla accord enhanced.',
    'إصدار كولكتور مرموق من لو مال الأيقوني في زجاجة مصممة بشكل فريد مع نفس وتر اللافندر-فانيليا المحبوب معززاً.'),

  // ════════════════════════════════════════════════════════════
  //  MID-RANGE — FEMMES
  // ════════════════════════════════════════════════════════════
  mk('Hypnotic Poison','هيبنوتيك بويزون','Dior','women','oriental',100,I.gw,
    'A bewitching oriental with bitter almond, jacaranda wood, and vanilla in a dangerously seductive feminine signature.',
    'شرقي ساحر باللوز المر وخشب الجاكارندا والفانيليا في بصمة نسائية خطيرة وإغرائية.'),

  mk('Devotion','ديفوشن','Dolce & Gabbana','women','floral',100,I.fw,
    'A tender and luminous floral with orange blossom, jasmine absolute, and vanilla that exudes devotion and feminine grace.',
    'زهري رقيق ومضيء بزهر البرتقال والياسمين المطلق والفانيليا يشع بالتفاني والأناقة النسائية.'),

  mk('Libre Intense','ليبر إنتنس','Yves Saint Laurent','women','floral',100,I.gw,
    'The intensified version of the groundbreaking YSL Libre, with amplified black lavender and orange blossom in an even more provocative formula.',
    'النسخة المكثفة من إيه إس إل ليبر الرائدة، مع اللافندر الأسود المعزز وزهر البرتقال في تركيبة أكثر استفزازاً.'),

  mk('La Belle EDP','لا بيل إيدي بي','Jean Paul Gaultier','women','floral',120,I.fw,
    'A modern, bold floral with almond, jasmine, and vanilla pear that redefines feminine beauty with an addictive sweet-floral signature.',
    'زهري حديث جريء باللوز والياسمين والكمثرى بالفانيليا يعيد تعريف الجمال النسائي ببصمة حلوى-زهرية مدمنة.',
    false),

  mk('Idole EDP','إيدول إيدي بي','Lancôme','women','floral',120,I.fw,
    'A luminous and powerful rose-jasmine fragrance that champions the modern woman with a clean, sustainable, and radiant floral spirit.',
    'عطر ورد-ياسمين مضيء وقوي يعتز بالمرأة العصرية بروح زهرية نظيفة ومستدامة ومشرقة.'),

  mk('Kayali Marshmallow 81','كايالي مارشميلو 81','Kayali','women','gourmand',140,I.fw,
    'An irresistibly sweet and fluffy gourmand with marshmallow, coconut, and sandalwood that feels like a warm, comforting hug.',
    'حلواني لا يقاوم بالمارشميلو وجوز الهند وخشب الصندل يشبه احتضاناً دافئاً ومريحاً.'),

  mk('La Belle','لا بيل لو بارفيم','Jean Paul Gaultier','women','floral',140,I.fw,
    'The original La Belle in a more concentrated formula, a luscious floral-oriental with pear, jasmine, and a deep vanilla-amber base.',
    'لا بيل الأصلية في تركيبة أكثر تركيزاً، زهري-شرقي شهي بالكمثرى والياسمين وقاعدة فانيليا-عنبر عميقة.'),

  mk('Versace Crystal Noir','فيرساتشي كريستال نوار','Versace','women','oriental',140,I.gw,
    'A dark and mysterious floral oriental with gardenia, peony, and amber for a woman who exudes sensual sophistication.',
    'زهري شرقي داكن وغامض بالغارديني والفاوانيا والعنبر لامرأة تشع بالأناقة الحسية.'),

  mk('Valentino Donna','فالنتينو دونا','Valentino','women','floral',160,I.fw,
    'An iconic Italian rose fragrance from Valentino with berry, iris, and white leather base that embodies romantic femininity.',
    'عطر ورد إيطالي أيقوني من فالنتينو بالتوت والأيريس وقاعدة الجلد الأبيض يجسد الأنوثة الرومانسية.'),

  mk('YSL Libre EDP','إيه إس إل ليبر إيدي بي','Yves Saint Laurent','women','floral',160,I.gw,
    'A revolutionary floral that captures female freedom, with black lavender from France, orange blossom from Morocco, and warm Madagascar vanilla.',
    'زهري ثوري يجسد الحرية النسائية، باللافندر الأسود الفرنسي وزهر البرتقال المغربي والفانيليا المدغشقرية الدافئة.',
    true),

  mk('La Belle Paradise Garden','لا بيل باراديس غاردن','Jean Paul Gaultier','women','floral',170,I.fw,
    'A tropical floral fantasy with lychee, tropical flowers, and white musk evoking an enchanted garden of paradise.',
    'خيال زهري استوائي بالليتشي والزهور الاستوائية والمسك الأبيض يستحضر جنة رياض ساحرة.'),

  mk('Prada Paradoxe EDP','برادا باراداكس إيدي بي','Prada','women','floral',180,I.fw,
    'A paradoxically fresh and warm floral with neroli, jasmine, and musk that celebrates the multidimensional modern woman.',
    'زهري منعش ودافئ بشكل متناقض مع النيرولي والياسمين والمسك يحتفل بالمرأة العصرية متعددة الأبعاد.'),

  // ════════════════════════════════════════════════════════════
  //  PREMIUM (200–500 dh) — HOMMES
  // ════════════════════════════════════════════════════════════
  mk('Sauvage Elixir','سوفاج إليكسير','Dior','men','oriental',200,I.dm,
    'The most concentrated and intense Sauvage, a raw and animalic elixir of spices, sandalwood, and licorice root with extraordinary depth.',
    'أكثر سوفاج تركيزاً وكثافةً، إليكسير خام وحيواني من التوابل وخشب الصندل وجذر عرق السوس بعمق استثنائي.'),

  mk('Fragrance du Bois Siren','فراغرانس دو بويس سيرين','Fragrance du Bois','men','woody',200,I.nw,
    'A rare and artisanal wood-infused fragrance with sustainably sourced oud, cedar, and exotic resins from a prestigious French niche house.',
    'عطر خشبي نادر وحرفي بالعود المستدام والأرز والراتنجات الغريبة من دار نيش فرنسية مرموقة.'),

  mk('Jo Malone Velvet Rose & Oud','جو مالون فيلفيت روز وعود','Jo Malone London','men','oriental',200,I.nw,
    'An opulent rose and oud accord from Jo Malone\'s Colognes Intense line, with velvety rose petals, oud wood, and a deep benzoin base.',
    'وتر ورد وعود فاخر من خط كولونز إنتنس لجو مالون، ببتلات ورد مخملية وخشب العود وقاعدة بنزوين عميقة.'),

  mk('Jo Malone Cypress & Grapevine','جو مالون سيبريس وغريبفاين','Jo Malone London','men','woody',200,I.fm,
    'A sophisticated autumnal fragrance with aromatic cypress, grapevine, amber, and patchouli evoking the serene beauty of an Italian vineyard.',
    'عطر خريفي متطور بالسرو العطري والعنب والعنبر والباتشولي يستحضر الجمال الهادئ لكرم عنب إيطالي.'),

  mk('Vibrato','فيبراتو','Initio','men','citrus',250,I.wm,
    'A vibrating citrus and woody accord that resonates with energy and depth, built on bergamot, vetiver, and a sensual base note.',
    'وتر حمضي وخشبي متذبذب يتردد صداه بالطاقة والعمق، مبني على البرغموت والفيتيفر ونوتة قاعدية حسية.'),

  mk('Tom Ford Ombre Leather Eau de Parfum','توم فورد أومبر ليذر','Tom Ford','men','woody',270,I.dm,
    'The definitive masculine leather fragrance from Tom Ford, with cardamom, jasmine, and leather on a bed of white moss and patchouli.',
    'عطر الجلد الذكوري الجوهري من توم فورد، بالهيل والياسمين والجلد على سرير من الطحلب الأبيض والباتشولي.'),

  mk('Lamar by Kajal EDP','لامار من كاجال','Kajal','men','oriental',300,I.om,
    'A luxurious Middle Eastern inspired oriental with rose, oud, saffron, and musk that conjures the opulence of Gulf heritage.',
    'شرقي فاخر مستوحى من الشرق الأوسط بالورد والعود والزعفران والمسك يستحضر ثراء التراث الخليجي.'),

  mk('Masa Kajal','ماسا كاجال','Kajal','men','oriental',300,I.om,
    'A captivating blend from Kajal featuring warm amber, tobacco, and precious woods in an intimate and enveloping oriental signature.',
    'مزيج آسر من كاجال بالعنبر الدافئ والتبغ والأخشاب النفيسة في بصمة شرقية حميمة وملفحة.'),

  mk('Unique\'E Luxury Soscentific','يونيك لاكشري سوسنتيفيك','Unique\'E Luxury','men','woody',300,I.nw,
    'A scientific and avant-garde woody fragrance from the UAE niche house, with unique molecular ingredients and an unexpectedly beautiful result.',
    'عطر خشبي علمي وطليعي من الدار الخليجية النيش، بمكونات جزيئية فريدة ونتيجة جميلة بشكل غير متوقع.'),

  mk('Unique\'E Luxury Beverly Hills','يونيك لاكشري بيفرلي هيلز','Unique\'E Luxury','men','fresh',300,I.nw,
    'A glamorous and vibrant fresh fragrance inspired by the Hollywood hills lifestyle, with bergamot, white woods, and white musk.',
    'عطر منعش بريق ومتألق مستوحى من أسلوب حياة هضاب هوليوود، بالبرغموت والأخشاب البيضاء والمسك الأبيض.'),

  mk('Unique\'E Luxury Izmir','يونيك لاكشري إزمير','Unique\'E Luxury','men','citrus',300,I.fm,
    'A Mediterranean-inspired citrus fragrance evoking the turquoise shores of Izmir with lemon, orange blossom, and sea breeze notes.',
    'عطر حمضي مستوحى من البحر الأبيض المتوسط يستحضر شواطئ إزمير الفيروزية بالليمون وزهر البرتقال ونسيم البحر.'),

  mk('Naxos by Xerjoff','ناكسوس من زيرجوف','Xerjoff','men','gourmand',350,I.nw,
    'A masterpiece of Italian perfumery with Calabrian bergamot, jasmine, tobacco, honey, and vanilla in a warm, deeply seductive oriental-gourmand.',
    'تحفة من صناعة العطور الإيطالية بالبرغموت الكالابري والياسمين والتبغ والعسل والفانيليا في شرقي-حلواني دافئ وإغرائي للغاية.',
    true),

  mk('Blue Talisman','بلو تاليسمان','Initio','men','fresh',350,I.fm,
    'A talisman-like fresh aquatic fragrance with blue elemi, sea notes, and a spiritual ambergris base that bestows magnetic aura.',
    'عطر مائي منعش كالتعويذة بالإيليمي الأزرق ونوتات البحر وقاعدة عنبر روحانية تمنح هالة مغناطيسية.'),

  mk('Aquamarine Touch the Fragrance','أكوامارين توتش ذا فراغرانس','Touch the Fragrance','men','fresh',350,I.fm,
    'A brilliant aquamarine blue fragrance with marine freshness, aquatic florals, and a clean woody-amber finish that embodies sea and sky.',
    'عطر أزرق الأكوامارين اللامع بانتعاش بحري وزهور مائية ونهاية خشبية-عنبرية نظيفة تجسد البحر والسماء.'),

  mk('Xerjoff 40 Knots','زيرجوف 40 نوت','Xerjoff','men','fresh',350,I.nw,
    'A nautical Italian luxury fragrance by Xerjoff with bergamot, ginger, sea notes, and ambergris that captures the freedom of the open sea.',
    'عطر بحري فاخر إيطالي من زيرجوف بالبرغموت والزنجبيل ونوتات البحر والعنبر يجسد حرية البحر المفتوح.'),

  mk('Casamorati Italica','كازاموراتي إيتاليكا','Xerjoff/Casamorati','men','oriental',350,I.nw,
    'An opulent historical homage to Roman Italy from the Casamorati heritage line, with saffron, myrrh, rose, and sandalwood.',
    'تكريم تاريخي فاخر لإيطاليا الرومانية من خط تراث كازاموراتي، بالزعفران والمر والورد وخشب الصندل.'),

  mk('Xerjoff More Than Words','زيرجوف مور ذان ووردز','Xerjoff','men','floral',350,I.nw,
    'An ode beyond words to Italian elegance, with rose, iris, patchouli, and sandalwood in a romantically complex and deeply personal accord.',
    'قصيدة تتجاوز الكلمات للأناقة الإيطالية، بالورد والأيريس والباتشولي وخشب الصندل في وتر رومانسي معقد وشخصي بعمق.'),

  mk('Xerjoff Opera','زيرجوف أوبيرا','Xerjoff','men','oriental',350,I.nw,
    'A theatrical and magnificent oriental-woody composition inspired by the grandeur of Italian opera, with bergamot, amber, and rare woods.',
    'مزيج شرقي-خشبي مسرحي ورائع مستوحى من عظمة الأوبرا الإيطالية، بالبرغموت والعنبر والأخشاب النادرة.'),

  mk('Xerjoff Accento Gold','زيرجوف أكنتو غولد','Xerjoff','men','woody',350,I.nw,
    'A golden woody floral with bergamot, iris, cedarwood, and vetiver that captures the brilliance and warmth of Italian gold.',
    'خشبي زهري ذهبي بالبرغموت والأيريس وخشب الأرز والفيتيفر يجسد لمعان ودفء الذهب الإيطالي.'),

  mk('Xerjoff Soprano','زيرجوف سوبرانو','Xerjoff','men','floral',350,I.nw,
    'A high-pitched and luminous floral-fresh composition from Xerjoff with jasmine, rose, and white musk in a soprano-like light signature.',
    'مزيج زهري-منعش مضيء وعالٍ من زيرجوف بالياسمين والورد والمسك الأبيض في بصمة خفيفة كالسوبرانو.'),

  mk('Xerjoff Accento','زيرجوف أكنتو','Xerjoff','men','floral',350,I.nw,
    'A beautifully accented floral fragrance from Xerjoff with fresh bergamot, rose, lily of the valley, and clean white musk.',
    'عطر زهري مميز بشكل جميل من زيرجوف بالبرغموت المنعش والورد وزنبق الوادي والمسك الأبيض النظيف.'),

  mk('Xerjoff Ouverture','زيرجوف أوفيرتير','Xerjoff','men','woody',350,I.nw,
    'An overture to fine Italian perfumery with a classical woody composition of bergamot, violet, sandalwood, and vetiver.',
    'افتتاحية لصناعة العطور الإيطالية الراقية بمزيج خشبي كلاسيكي من البرغموت والبنفسج وخشب الصندل والفيتيفر.'),

  mk('Penhaligon\'s Babylon','بنهاليجونز بابيلون','Penhaligon\'s','men','oriental',350,I.nw,
    'An ancient and luxurious oud-rose oriental from British niche house Penhaligon\'s, evoking the decadent splendour of Babylonian royalty.',
    'شرقي عود-ورد قديم وفاخر من الدار البريطانية النيش بنهاليجونز، يستحضر الأبهة الباذخة للملوك البابليين.'),

  mk('Amouage Interlude Man','أموآج إنترلود','Amouage','men','oriental',400,I.om,
    'A complex and philosophical oriental masterpiece from Amouage with oregano, incense, frankincense, amber, and leather in a deeply intellectual signature.',
    'تحفة شرقية معقدة وفلسفية من أموآج بالأوريغانو والبخور واللبان والعنبر والجلد في بصمة فكرية عميقة.',
    true),

  mk('Zingi Unique\'E Luxury','زينجي يونيك لاكشري','Unique\'E Luxury','men','citrus',400,I.nw,
    'A zingy and invigorating fragrance from Unique\'E Luxury with vibrant ginger, lemon zest, and aromatic spices on a warm woody base.',
    'عطر منشط وحيوي من يونيك لاكشري بالزنجبيل النابض بالحياة وقشر الليمون والتوابل العطرية على قاعدة خشبية دافئة.'),

  mk('Teroni','تيروني','Fragrance du Bois','men','woody',450,I.nw,
    'An artisanal woody fragrance from Fragrance du Bois with sustainably sourced tree resins, sandalwood, and earthy vetiver in a grounded, meditative accord.',
    'عطر خشبي حرفي من فراغرانس دو بويس براتنجات أشجار مستدامة وخشب الصندل وفيتيفر ترابي في وتر متأمل.'),

  mk('Xerjoff La Capitale','زيرجوف لا كابيتال','Xerjoff','men','oriental',450,I.nw,
    'A noble and lavish oriental homage to capital cities of the world with bergamot, oud, amber, and a magnificent rose-vetiver heart.',
    'تكريم شرقي نبيل وباذخ للعواصم العالمية بالبرغموت والعود والعنبر وقلب ورد-فيتيفر رائع.'),

  mk('Angel Share','أنجل شير','By Kilian','men','gourmand',500,I.om,
    'Inspired by Cognac\'s \"Angel\'s Share\", a stunning gourmand with cognac, rum, oak, and dried fruits evoking the finest French distilleries.',
    'مستوحى من حصة الملاك في الكونياك، حلواني مذهل بالكونياك والروم والبلوط والفاكهة المجففة يستحضر أفخر المقطرات الفرنسية.'),

  mk('Babycat YSL','بيبي كات إيه إس إل','Yves Saint Laurent','men','woody',500,I.dm,
    'An exclusive Le Vestiaire des Parfums creation with a purring softness of velvet, white flowers, and sandalwood for the modern dandy.',
    'إبداع حصري من لو فستيير دي بارفيم بنعومة مخملية متمردة وأزهار بيضاء وخشب الصندل للرجل الأنيق المعاصر.'),

  mk('Grand Soir','غران سوار','Maison Francis Kurkdjian','men','oriental',500,I.om,
    'A rich and opulent amber oriental from MFK, composed of amber, benzoin, tonka bean, and musk in a magnificent grand evening accord.',
    'عنبر شرقي غني وفاخر من أم إف كيه، مؤلف من العنبر والبنزوين وفول التونكا والمسك في وتر سهرة عظيمة رائع.'),

  mk('Creed Oud Zarian','كريد عود زاريان','Creed','men','oriental',500,I.om,
    'A masterful oud composition from the royal house of Creed, with Bulgarian rose, pink pepper, rhubarb, and a majestic oud-vetiver base.',
    'مزيج عود بارع من الدار الملكية كريد، بالورد البلغاري والفلفل الوردي والراوند وقاعدة عود-فيتيفر مهيبة.',
    true),

  mk('Tuxedo YSL','توكسيدو إيه إس إل','Yves Saint Laurent','men','woody',500,I.dm,
    'An exclusive Le Vestiaire des Parfums tuxedo-inspired woody fragrance with iris, leather, and precious woods for a black tie occasion.',
    'عطر خشبي حصري مستوحى من السموكينج من لو فستيير دي بارفيم بالأيريس والجلد والأخشاب النفيسة لمناسبة رسمية.'),

  // ════════════════════════════════════════════════════════════
  //  PREMIUM — FEMMES
  // ════════════════════════════════════════════════════════════
  mk('Kayali Vanille 28','كايالي فانيلا 28','Kayali','women','gourmand',220,I.gw,
    'A warm and addictive vanilla fragrance from Kayali with Madagascar vanilla, musk, and sandalwood in the ultimate cosy feminine signature.',
    'عطر فانيليا دافئ ومدمن من كايالي بفانيليا مدغشقر والمسك وخشب الصندل في أكثر البصمات النسائية دفئاً.',
    true),

  mk('Tom Ford Ombre Leather Le Parfum','توم فورد أومبر ليذر لو بارفيم','Tom Ford','women','woody',270,I.nw,
    'The feminine and most concentrated interpretation of Ombre Leather, with jasmine absolute, black leather, amber, and patchouli at their most intense.',
    'التفسير النسائي والأكثر تركيزاً لأومبر ليذر، بالياسمين المطلق والجلد الأسود والعنبر والباتشولي في أشد كثافتها.'),

  mk('Delina Exclusif','ديلينا إكسكلوسيف','Parfums de Marly','women','floral',280,I.fw,
    'The exclusive and most opulent version of the beloved Delina, with a richer peony, litchi, rose, and vanilla accord of unmatched luxury.',
    'النسخة الحصرية والأكثر فخامة من ديلينا المحبوبة، بوتر فاوانيا وليتشي وورد وفانيليا أغنى من فخامة لا تُضاهى.',
    true),

  mk('Rouge Malachite','روج ملاكيت','Parfums de Marly','women','floral',400,I.gw,
    'A bold and vibrant floral from Parfums de Marly with red fruits, peony, malachite-green notes, and a warm amber-musk base.',
    'زهري جريء وحيوي من بارفيمز دو مارلي بالفاكهة الحمراء والفاوانيا ونوتات مالاكيت الخضراء وقاعدة عنبر-مسك دافئة.'),

  mk('Ombre Nomade','أومبر نوماد','Louis Vuitton','women','oriental',500,I.om,
    'A rare and precious oud fragrance from Louis Vuitton with oud, labdanum, benzoin, and raspberry that embodies the spirit of a wandering nomad.',
    'عطر عود نادر وثمين من لويس فويتون بالعود واللبدانوم والبنزوين والتوت يجسد روح البدوي الجوال.'),

  // ════════════════════════════════════════════════════════════
  //  NICHE / LUXE (550–750 dh) — HOMMES
  // ════════════════════════════════════════════════════════════
  mk('Ardent Boadicea the Victorious','أردنت بواديسيا','Boadicea the Victorious','men','oriental',600,I.nw,
    'A powerfully ardent oriental from the British luxury niche house, with bergamot, rose, oud, and amber in a triumphant, imposing sillage.',
    'شرقي قوي ومتحمس من الدار البريطانية النيش الفاخرة، بالبرغموت والورد والعود والعنبر في أثر منتصر ومهيب.'),

  mk('Complex Boadicea the Victorious','كومبليكس بواديسيا','Boadicea the Victorious','men','woody',600,I.nw,
    'A complex and layered woody-oriental creation from Boadicea the Victorious that unfolds with bergamot, incense, vetiver, and oud over hours.',
    'إبداع خشبي-شرقي معقد ومتعدد الطبقات من بواديسيا يتكشف بالبرغموت والبخور والفيتيفر والعود على مدار ساعات.'),

  mk('Byredo Bal d\'Afrique','بيريدو بال دافريك','Byredo','men','floral',600,I.nw,
    'A sun-drenched African floral from Byredo with bergamot, African marigold, Moroccan cedarwood, vetiver, and musk in a liberating, joyful spirit.',
    'زهري أفريقي مشمس من بيريدو بالبرغموت وأقحوان أفريقي وأرز مغربي وفيتيفر ومسك في روح محررة وبهيجة.'),

  mk('Black Phantom','بلاك فانتوم','By Kilian','men','gourmand',700,I.dm,
    'By Kilian\'s iconic gourmand masterpiece with rum, vanilla, coffee, and dark woods creating an unforgettable, decadent, and seductive signature.',
    'تحفة بيليان الحلوانية الأيقونية بالروم والفانيليا والقهوة والأخشاب الداكنة تخلق بصمة لا تُنسى وإغرائية.',
    true),

  mk('Zoologist Orchid Mantis','زولوجيست أوركيد مانتيس','Zoologist','men','floral',700,I.nw,
    'An extraordinary artistic creation by Zoologist inspired by the orchid mantis, blending rare orchid, osmanthus, and silky musk in a living floral art.',
    'إبداع فني استثنائي من زولوجيست مستوحى من حشرة الأوركيد العرابة، يمزج بين الأوركيد النادر والأوسمانثوس والمسك الحريري.'),

  mk('Black Phantom — Friend Edition','بلاك فانتوم فريند','By Kilian','men','gourmand',700,I.om,
    'The exclusive Friend edition of Black Phantom — a collector gift set version with the same extraordinary rum-vanilla-coffee accord in a unique presentation.',
    'الإصدار الصديق الحصري من بلاك فانتوم — نسخة هدية كولكتور مع نفس وتر الروم-الفانيليا-القهوة الاستثنائي.'),

  mk('Richwood by Xerjoff','ريتشوود من زيرجوف','Xerjoff','men','woody',700,I.nw,
    'A richly textured woody composition by Xerjoff with sustainably sourced oud, sandalwood, myrrh, and cedarwood in a museum-quality olfactory experience.',
    'مزيج خشبي غني بالملمس من زيرجوف بالعود المستدام وخشب الصندل والمر وخشب الأرز في تجربة شمية على مستوى المتحف.'),

  mk('Zoologist Dodo Jackfruit','زولوجيست دودو جاكفروت','Zoologist','men','fresh',700,I.nw,
    'An imaginative tropical fragrance from Zoologist dedicated to the extinct Dodo bird, with jackfruit, tropical leaves, and woody musk.',
    'عطر استوائي خيالي من زولوجيست مكرس لطائر الدودو المنقرض، بفاكهة الجاك فروت والأوراق الاستوائية والمسك الخشبي.'),

  mk('Oud Stallion','عود ستاليون','Niche Brand','men','oriental',700,I.om,
    'A majestic Arabian oud fragrance built like a stallion — powerful, proud, and untamed — with saffron, rose, oud, and ambergris.',
    'عطر عود عربي مهيب مبني كالحصان — قوي وفخور وغير مروّض — بالزعفران والورد والعود والعنبر.'),

  mk('Maison Crivelli Oud Maracuja','ميزون كريفيلي عود ماراكويا','Maison Crivelli','men','oriental',750,I.nw,
    'An unexpected East-meets-tropics luxury from Maison Crivelli combining velvety oud with passionfruit (maracuja) and saffron in an extraordinary accord.',
    'ترف غير متوقع حيث يلتقي الشرق بالاستوائيات من ميزون كريفيلي يجمع العود المخملي مع فاكهة العاطفة والزعفران.'),

  mk('Hibiscus Mahajad','هيبيسكوس محاجد','Maison Crivelli','men','floral',750,I.nw,
    'A desert blooming hibiscus from Maison Crivelli with solar amber, cardamom, and white musk creating a mesmerizing mirage of floral luxury.',
    'هيبيسكوس صحراوي مزهر من ميزون كريفيلي مع عنبر شمسي وهيل ومسك أبيض يخلق سراباً آسراً من الفخامة الزهرية.'),

  mk('Clive Christian 1872','كلايف كريستيان 1872','Clive Christian','men','floral',750,I.nw,
    'An extraordinary luxury fragrance from Clive Christian\'s landmark 1872 collection with bergamot, nutmeg, coriander, and rose in the finest English tradition.',
    'عطر فاخر استثنائي من مجموعة 1872 المعلمة لكلايف كريستيان بالبرغموت وجوزة الطيب والكزبرة والورد في أرقى التقاليد الإنجليزية.'),

  mk('Maison Crivelli Safran Secret','ميزون كريفيلي زعفران سيكريت','Maison Crivelli','men','oriental',750,I.nw,
    'A precious saffron secret from Maison Crivelli with Kashmiri saffron, rose absolute, leather, and sandalwood woven into an intimate luxury accord.',
    'سر زعفران ثمين من ميزون كريفيلي بزعفران كشميري ووردة مطلقة وجلد وخشب صندل منسوجة في وتر ترف حميم.'),

  // ════════════════════════════════════════════════════════════
  //  UNISEX (deduplicated — appear for both HOMME & FEMME)
  // ════════════════════════════════════════════════════════════
  mk('Imperial Valley Gissah','إمبيريال فالي جيسة','Gissah','unisex','oriental',60,I.wm,
    'A fresh and warm oriental unisex fragrance from Gissah with pomegranate, apple blossom, amber, and sandalwood for everyday elegance.',
    'عطر شرقي منعش ودافئ للجنسين من جيسة بالرمان وزهر التفاح والعنبر وخشب الصندل لأناقة يومية.'),

  mk('Bianco Latte','بيانكو لاتيه','Giardini di Toscana','unisex','gourmand',140,I.un,
    'A comforting unisex milky gourmand with white milk, musk, and soft woods — like wearing the softest cashmere on a cool morning.',
    'حلواني مريح للجنسين بالحليب الأبيض والمسك والأخشاب الناعمة — كارتداء أناقة الكشمير في صباح هادئ.'),

  mk('Tom Ford Black Orchid','توم فورد بلاك أوركيد','Tom Ford','unisex','oriental',200,I.dm,
    'An iconic and hypnotic luxury fragrance with black truffle, ylang-ylang, dark chocolate, patchouli, and vetiver in a uniquely captivating accord.',
    'عطر فاخر أيقوني وساحر بالكمأة السوداء واليلانغ يلانغ والشوكولاتة الداكنة والباتشولي والفيتيفر في وتر آسر بشكل فريد.',
    true),

  mk('Ombre Leather EDP','أومبر ليذر إيدي بي','Tom Ford','unisex','woody',250,I.dm,
    'Tom Ford\'s definitive leather-woody fragrance, with cardamom, white floral, and bold leather on a patchouli and white moss base.',
    'عطر الجلد-الخشب الجوهري من توم فورد، بالهيل والأزهار البيضاء والجلد الجريء على قاعدة باتشولي وطحلب أبيض.'),

  mk('Imagination Louis Vuitton','إيماجيناشن لويس فويتون','Louis Vuitton','unisex','fresh',500,I.nw,
    'A clean and imaginative Louis Vuitton fragrance with bergamot, mandarin, iris, and musks that distills the essence of fresh creativity.',
    'عطر نظيف وخيالي من لويس فويتون بالبرغموت والماندرين والأيريس والمسكات يقطر جوهر الإبداع المنعش.'),

  mk('Afternoon Swim Louis Vuitton','أفترنون سويم لويس فويتون','Louis Vuitton','unisex','fresh',500,I.fm,
    'A sun-warmed aquatic luxury from Louis Vuitton with chlorine, sun-kissed skin, citrus, and aquatic musks evoking a perfect summer afternoon.',
    'ترف مائي مدفأ بالشمس من لويس فويتون بالكلور وجلد مدهون بالشمس والحمضيات والمسكات المائية يستحضر فترة ظهيرة صيفية مثالية.'),

  mk('Elves Louis Vuitton','إيلفيز لويس فويتون','Louis Vuitton','unisex','woody',500,I.nw,
    'A magical and ethereal woody fragrance from Louis Vuitton inspired by forest elves with hinoki wood, iris, and whisper-soft musk.',
    'عطر خشبي سحري وأثيري من لويس فويتون مستوحى من جنيات الغابة بخشب الهينوكي والأيريس والمسك الناعم.'),

  mk('California Dream Louis Vuitton','كاليفورنيا دريم لويس فويتون','Louis Vuitton','unisex','fresh',500,I.fm,
    'A dreamy Californian odyssey from Louis Vuitton with orange, almond blossom, cedarwood, and musks that embodies the Pacific coast lifestyle.',
    'أوديسة كاليفورنية حالمة من لويس فويتون بالبرتقال وزهر اللوز وخشب الأرز والمسكات تجسد أسلوب حياة الساحل الهادئ.'),

  mk('Coeur Battant Louis Vuitton','كور باتان لويس فويتون','Louis Vuitton','unisex','floral',500,I.gw,
    'A radiant and romantic floral from Louis Vuitton with peony, rose, and sandalwood creating a heartbeat of fragrant joy and feminine beauty.',
    'زهري مشرق ورومانسي من لويس فويتون بالفاوانيا والورد وخشب الصندل يخلق نبضة قلب من البهجة العطرية.'),

  mk('Orage Louis Vuitton','أوراج لويس فويتون','Louis Vuitton','unisex','woody',500,I.wm,
    'A stormy and electric woody fragrance from Louis Vuitton inspired by a thunderstorm, with vetiver, amber, and petrichor-like earthy notes.',
    'عطر خشبي عاصف وكهربائي من لويس فويتون مستوحى من عاصفة رعدية، بالفيتيفر والعنبر ونوتات ترابية.'),

  mk('Météore Louis Vuitton','ميتيور لويس فويتون','Louis Vuitton','unisex','fresh',500,I.fm,
    'A meteoric and luminous fresh woody fragrance from Louis Vuitton with bergamot, blue mate, cedar, and musk streaking across the skin like a comet.',
    'عطر خشبي منعش نيزكي ومضيء من لويس فويتون بالبرغموت والمات الأزرق والأرز والمسك يجتاح الجلد كالمذنب.'),

  mk('God of Fire','غود أوف فاير','Stéphane Humbert Lucas 777','unisex','oriental',550,I.om,
    'A divine and powerful incense-amber-oud from the artisan house SHL 777, burning with bergamot, cypriol, labdanum, and oud in a sacred, otherworldly signature.',
    'بخور-عنبر-عود إلهي وقوي من الدار الحرفية SHL 777، يشتعل بالبرغموت والسيبريول واللبدانوم والعود في بصمة مقدسة أخرى.'),
];

// ─── Admin User ────────────────────────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');

    // Drop slug index so we can recreate cleanly
    try { await Product.collection.dropIndex('slug_1'); } catch {}

    await Product.deleteMany({});
    console.log('🗑  Old products cleared');

    let count = 0;
    for (const p of products) {
      await Product.create(p);
      count++;
    }
    console.log(`✅ ${count} products seeded`);

    // Admin user
    const existing = await User.findOne({ email: 'admin@luxeessence.com' });
    if (!existing) {
      await User.create({
        name: 'Admin',
        email: 'admin@luxeessence.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('✅ Admin user created: admin@luxeessence.com / admin123');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    console.log('\n🌟 Seed complete! Products:', count);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
