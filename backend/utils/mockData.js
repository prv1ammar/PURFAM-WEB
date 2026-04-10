const mockProducts = [
  {
    _id: "mock_prod_1",
    name: { en: "Momento", ar: "مومنتو" },
    brand: "Armaf",
    description: { en: "A fresh and vibrant 10ml decant", ar: "عطر منعش وحيوي" },
    gender: "men",
    category: "fresh",
    sizes: [{ ml: 10, price: 40 }],
    images: ["https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80"],
    stock: 60,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: "mock_prod_2",
    name: { en: "Club de Nuit Intense", ar: "كلوب دو نوي إنتنس" },
    brand: "Armaf",
    description: { en: "An intense woody fragrance", ar: "عطر خشبي مكثف" },
    gender: "men",
    category: "woody",
    sizes: [{ ml: 10, price: 50 }],
    images: ["https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80"],
    stock: 60,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: "mock_prod_3",
    name: { en: "Hypnotic Poison", ar: "هيبنوتيك بويزون" },
    brand: "Dior",
    description: { en: "A bewitching oriental", ar: "شرقي ساحر" },
    gender: "women",
    category: "oriental",
    sizes: [{ ml: 10, price: 100 }],
    images: ["https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&q=80"],
    stock: 60,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: "mock_prod_4",
    name: { en: "Sauvage EDP", ar: "سوفاج إيدي بي" },
    brand: "Dior",
    description: { en: "Dior's best-selling fragrance", ar: "أكثر عطور ديور مبيعاً" },
    gender: "men",
    category: "fresh",
    sizes: [{ ml: 10, price: 130 }],
    images: ["https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80"],
    stock: 60,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: "mock_prod_5",
    name: { en: "Libre Intense", ar: "ليبر إنتنس" },
    brand: "Yves Saint Laurent",
    description: { en: "The intensified version of Libre", ar: "النسخة المكثفة من ليبر" },
    gender: "women",
    category: "floral",
    sizes: [{ ml: 10, price: 100 }],
    images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80"],
    stock: 60,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: "mock_prod_6",
    name: { en: "Arabians Tonka", ar: "أرابيانز تونكا" },
    brand: "Lattafa",
    description: { en: "A rich oriental gourmand blending Arabic oud-inspired warmth", ar: "شرقي حلواني غني يمزج دفء العود العربي" },
    gender: "men",
    category: "gourmand",
    sizes: [{ ml: 10, price: 100 }],
    images: ["https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&q=80"],
    stock: 60,
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    _id: "mock_prod_7",
    name: { en: "1 Million Lucky", ar: "وان مليون لاكي" },
    brand: "Paco Rabanne",
    description: { en: "A fresh-woody take on the iconic 1 Million dynasty", ar: "نسخة منعشة خشبية من سلالة وان مليون الأيقونية" },
    gender: "men",
    category: "oriental",
    sizes: [{ ml: 10, price: 80 }],
    images: ["https://images.unsplash.com/photo-1509457931446-6fee5d0bb1f8?w=600&q=80"],
    stock: 60,
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    _id: "mock_prod_8",
    name: { en: "Prada Paradoxe EDP", ar: "برادا باراداكس إيدي بي" },
    brand: "Prada",
    description: { en: "A paradoxically fresh and warm floral", ar: "زهري منعش ودافئ بشكل متناقض" },
    gender: "women",
    category: "floral",
    sizes: [{ ml: 10, price: 180 }],
    images: ["https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80"],
    stock: 60,
    featured: true,
    createdAt: new Date().toISOString()
  }
];

const mockUser = {
  _id: "mock_user_1",
  name: "Demo Admin",
  email: "admin@luxeessence.com",
  password: "admin123", // used in mock
  role: "admin",
  createdAt: new Date().toISOString()
};

module.exports = { mockProducts, mockUser };
