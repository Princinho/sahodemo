export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  longDescription: string;
  images: string[];
  material: string;
  dimensions: string;
  colors: string[];
  inStock: boolean;
  featured: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

export interface QuoteRequest {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  company?: string;
  message: string;
  products: Array<{ productId: string; quantity: number }>;
  status: 'new' | 'in-progress' | 'completed' | 'archived';
  date: string;
}

export const categories: Category[] = [
  {
    id: '1',
    name: 'Mobilier',
    description: 'Tables, chaises, canapés et meubles de rangement élégants',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop',
    productCount: 24
  },
  {
    id: '2',
    name: 'Décoration',
    description: 'Objets décoratifs, vases, sculptures et accessoires muraux',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&h=600&fit=crop',
    productCount: 18
  },
  {
    id: '3',
    name: 'Textile',
    description: 'Coussins, rideaux, tapis et linge de maison raffiné',
    image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=800&h=600&q=80',
    productCount: 15
  },
  {
    id: '4',
    name: 'Accessoires',
    description: 'Petits objets et accessoires pour compléter votre intérieur',
    image: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=800&h=600&q=80',
    productCount: 12
  }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Canapé Élégance',
    category: 'Mobilier',
    price: 1850000,
    description: 'Canapé trois places en velours premium avec structure en bois massif',
    longDescription: 'Un canapé d\'exception qui allie confort et élégance. Revêtement en velours premium résistant et doux au toucher. Structure en bois massif garantissant robustesse et durabilité. Assise profonde avec coussins moelleux pour un confort optimal. Pieds en bois foncé apportant une touche de raffinement.',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&h=600&q=80',
    ],
    material: 'Velours, Bois massif',
    dimensions: 'L: 220cm x P: 95cm x H: 85cm',
    colors: ['Bleu nuit', 'Gris perle', 'Beige'],
    inStock: true,
    featured: true
  },
  {
    id: '2',
    name: 'Table Basse Natura',
    category: 'Mobilier',
    price: 450000,
    description: 'Table basse en bois de teck recyclé avec finition naturelle',
    longDescription: 'Une pièce unique fabriquée à partir de bois de teck recyclé, chaque table possède ses propres veines et nuances naturelles. Finition à l\'huile naturelle mettant en valeur la beauté du bois. Design moderne et épuré s\'intégrant parfaitement dans tout type d\'intérieur. Plateau spacieux et pieds robustes.',
    images: [
      'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&h=600&q=80',
    ],
    material: 'Teck recyclé',
    dimensions: 'L: 120cm x P: 70cm x H: 45cm',
    colors: ['Naturel'],
    inStock: true,
    featured: true
  },
  {
    id: '3',
    name: 'Lampe Moderne Arc',
    category: 'Décoration',
    price: 285000,
    description: 'Lampadaire arc moderne en métal doré avec abat-jour en marbre',
    longDescription: 'Un lampadaire design qui devient la pièce maîtresse de votre salon. Structure arquée en métal avec finition dorée mate. Abat-jour en marbre véritable créant une lumière douce et chaleureuse. Base en marbre lourd assurant stabilité et élégance. Parfait pour éclairer un coin lecture ou un canapé.',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&h=600&q=80',
    ],
    material: 'Métal doré, Marbre',
    dimensions: 'H: 185cm x P: 180cm',
    colors: ['Doré'],
    inStock: true,
    featured: true
  },
  {
    id: '4',
    name: 'Vase Céramique Artisanal',
    category: 'Décoration',
    price: 125000,
    description: 'Vase en céramique fait main avec motifs géométriques',
    longDescription: 'Chaque vase est une œuvre d\'art unique, façonnée à la main par nos artisans. Céramique de haute qualité avec glaçure brillante. Motifs géométriques contemporains peints à la main. Parfait comme vase ou simple objet décoratif. Disponible en plusieurs tailles et coloris.',
    images: [
      'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1581368135153-a506cf13b1e1?auto=format&fit=crop&w=800&h=600&q=80',
    ],
    material: 'Céramique artisanale',
    dimensions: 'H: 35cm x D: 20cm',
    colors: ['Blanc et or', 'Bleu et blanc', 'Terracotta'],
    inStock: true,
    featured: false
  },
  {
    id: '5',
    name: 'Tapis Berbère Luxe',
    category: 'Textile',
    price: 680000,
    description: 'Tapis berbère authentique tissé main en pure laine',
    longDescription: 'Un tapis d\'exception tissé selon les techniques traditionnelles berbères. Pure laine vierge de haute qualité pour une douceur incomparable. Motifs géométriques authentiques transmis de génération en génération. Chaque tapis est unique avec ses propres variations. Résistant et facile d\'entretien.',
    images: [
      'https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&h=600&q=80',
    ],
    material: 'Laine vierge 100%',
    dimensions: '200cm x 300cm',
    colors: ['Écru et noir', 'Gris et blanc'],
    inStock: true,
    featured: true
  },
  {
    id: '6',
    name: 'Coussins Velours Premium',
    category: 'Textile',
    price: 45000,
    description: 'Lot de 2 coussins en velours avec rembourrage plume',
    longDescription: 'Ces coussins apportent une touche de luxe et de confort à votre canapé. Velours de qualité supérieure avec reflets changeants. Rembourrage en plumes pour un moelleux exceptionnel. Fermeture éclair invisible. Disponibles en plusieurs coloris pour s\'harmoniser avec votre décoration.',
    images: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&h=600&q=80',
    ],
    material: 'Velours, Plumes',
    dimensions: '45cm x 45cm',
    colors: ['Vert émeraude', 'Bleu marine', 'Terracotta', 'Gris perle'],
    inStock: true,
    featured: false
  },
  {
    id: '7',
    name: 'Miroir Soleil Doré',
    category: 'Accessoires',
    price: 195000,
    description: 'Miroir rond avec cadre en métal doré design soleil',
    longDescription: 'Un miroir décoratif qui illumine votre espace. Design soleil avec rayons en métal doré. Miroir de qualité offrant un reflet parfait. Finition dorée mate pour un aspect luxueux et intemporel. Parfait pour agrandir visuellement une pièce et créer un point focal.',
    images: [
      'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1633505650701-6104cdd35149?auto=format&fit=crop&w=800&h=600&q=80',
    ],
    material: 'Métal doré, Miroir',
    dimensions: 'D: 80cm',
    colors: ['Doré'],
    inStock: true,
    featured: false
  },
  {
    id: '8',
    name: 'Fauteuil Lecture Confort',
    category: 'Mobilier',
    price: 895000,
    description: 'Fauteuil ergonomique avec repose-pieds intégré',
    longDescription: 'Le fauteuil idéal pour vos moments de détente et de lecture. Design ergonomique étudié pour un confort optimal. Revêtement en tissu bouclette doux et résistant. Repose-pieds escamotable pour un confort maximal. Structure robuste avec pieds en bois massif tournés.',
    images: [
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1519961655235-4dc55a538c4e?auto=format&fit=crop&w=800&h=600&q=80',
    ],
    material: 'Tissu bouclette, Bois massif',
    dimensions: 'L: 85cm x P: 90cm x H: 105cm',
    colors: ['Crème', 'Terracotta', 'Vert olive'],
    inStock: true,
    featured: false
  },
  {
    id: '9',
    name: 'Bougeoirs Design Minimaliste',
    category: 'Accessoires',
    price: 85000,
    description: 'Ensemble de 3 bougeoirs en laiton brossé',
    longDescription: 'Des bougeoirs au design épuré pour une ambiance chaleureuse. Laiton massif avec finition brossée mate. Trois hauteurs différentes pour créer un effet dynamique. Base lestée pour une stabilité parfaite. S\'intègrent aussi bien dans un intérieur moderne que classique.',
    images: [
      'https://images.unsplash.com/photo-1566204773863-cf63e6d4ab88?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1535231540604-72e8fbaf8cdb?auto=format&fit=crop&w=800&h=600&q=80',
    ],
    material: 'Laiton brossé',
    dimensions: 'H: 15cm, 20cm, 25cm',
    colors: ['Laiton'],
    inStock: true,
    featured: false
  },
  {
    id: '10',
    name: 'Plaid Cachemire Luxe',
    category: 'Textile',
    price: 320000,
    description: 'Plaid en cachemire pur avec finitions franges',
    longDescription: 'Un plaid d\'exception pour vous envelopper de douceur. Cachemire pur de qualité supérieure ultra doux. Tissage serré garantissant chaleur et durabilité. Finitions soignées avec franges nouées main. Un cadeau parfait ou un plaisir personnel pour les soirées fraîches.',
    images: [
      'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?auto=format&fit=crop&w=800&h=600&q=80',
    ],
    material: 'Cachemire 100%',
    dimensions: '130cm x 180cm',
    colors: ['Beige', 'Gris anthracite', 'Camel'],
    inStock: true,
    featured: false
  },
  {
    id: '11',
    name: 'Console Entrée Marbre',
    category: 'Mobilier',
    price: 1250000,
    description: 'Console en marbre blanc avec piètement doré',
    longDescription: 'Une console élégante qui fait sensation dans une entrée ou un couloir. Plateau en marbre blanc véritable avec veinages naturels. Piètement en métal avec finition dorée brillante. Design fin et élancé. Parfaite pour accueillir vos clés, courrier et objets décoratifs.',
    images: [
      'https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1604256522031-a6df7a02ed0e?auto=format&fit=crop&w=800&h=600&q=80',
    ],
    material: 'Marbre, Métal doré',
    dimensions: 'L: 120cm x P: 35cm x H: 80cm',
    colors: ['Blanc et doré'],
    inStock: true,
    featured: false
  },
  {
    id: '12',
    name: 'Sculpture Abstraite Bronze',
    category: 'Décoration',
    price: 425000,
    description: 'Sculpture moderne en bronze patiné sur socle en marbre',
    longDescription: 'Une œuvre d\'art contemporaine pour sublimer votre intérieur. Bronze massif avec patine artisanale unique. Formes abstraites et organiques créant un jeu d\'ombres et de lumières. Socle en marbre noir apportant stabilité et prestance. Chaque pièce est numérotée et signée par l\'artiste.',
    images: [
      'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1578912996078-305d92249aa6?auto=format&fit=crop&w=800&h=600&q=80',
    ],
    material: 'Bronze, Marbre',
    dimensions: 'H: 45cm x L: 25cm',
    colors: ['Bronze patiné'],
    inStock: true,
    featured: true
  }
];

export const mockQuoteRequests: QuoteRequest[] = [
  {
    id: 'Q001',
    customerName: 'Marie Dupont',
    customerEmail: 'marie.dupont@email.com',
    customerPhone: '+225 07 12 34 56 78',
    message: 'Je suis intéressée par le canapé Élégance en bleu nuit. Pouvez-vous me confirmer les délais de livraison?',
    products: [{ productId: '1', quantity: 1 }],
    status: 'new',
    date: '2024-01-15'
  },
  {
    id: 'Q002',
    customerName: 'Jean-Marc Kouassi',
    customerEmail: 'jm.kouassi@entreprise.ci',
    customerPhone: '+225 05 98 76 54 32',
    company: 'Hôtel Prestige Abidjan',
    message: 'Nous équipons notre nouvel hôtel. Besoin de plusieurs articles en quantité. Pouvez-vous nous faire un devis groupé?',
    products: [
      { productId: '1', quantity: 15 },
      { productId: '3', quantity: 30 },
      { productId: '5', quantity: 20 }
    ],
    status: 'in-progress',
    date: '2024-01-14'
  },
  {
    id: 'Q003',
    customerName: 'Aminata Traoré',
    customerEmail: 'a.traore@gmail.com',
    customerPhone: '+225 01 23 45 67 89',
    message: 'Superbe collection! Je voudrais commander la table basse et les coussins en gris perle.',
    products: [
      { productId: '2', quantity: 1 },
      { productId: '6', quantity: 4 }
    ],
    status: 'completed',
    date: '2024-01-10'
  }
];
