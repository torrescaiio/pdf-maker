import type { EventData, ThemeConfig, SlideImages, TypographyPreset, LayoutFormat, FormatConfig } from '../types.ts';

export const formatConfigs: Record<LayoutFormat, FormatConfig> = {
  widescreen: {
    id: 'widescreen',
    label: 'Widescreen / Slides',
    shortLabel: 'Widescreen',
    ratioLabel: '16:9',
    aspectClass: 'aspect-[16/9]',
    previewMaxWidth: 1120,
    printPageSize: '16in 9in',
    printWidth: '16in',
    printHeight: '9in',
    description: 'Proporção horizontal clássica para apresentações e projeções.',
  },
  mobile: {
    id: 'mobile',
    label: 'Mobile / iPhone',
    shortLabel: 'Mobile',
    ratioLabel: '9:16',
    aspectClass: 'aspect-[9/16]',
    previewMaxWidth: 440,
    printPageSize: '9in 16in',
    printWidth: '9in',
    printHeight: '16in',
    description: 'Formato vertical ideal para envio e leitura via WhatsApp / Smartphones.',
  },
  a4Portrait: {
    id: 'a4Portrait',
    label: 'A4 Retrato Documento',
    shortLabel: 'A4 Retrato',
    ratioLabel: 'A4 (1:1.41)',
    aspectClass: 'aspect-[210/297]',
    previewMaxWidth: 720,
    printPageSize: 'A4 portrait',
    printWidth: '210mm',
    printHeight: '297mm',
    description: 'Formato executivo padrão para impressão em papel e leitura formal.',
  },
};

export function getDynamicPrintCss(format: LayoutFormat): string {
  const cfg = formatConfigs[format] || formatConfigs.widescreen;
  return `@media print {
  @page {
    size: ${cfg.printPageSize};
    margin: 0;
  }
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    background: #09090b !important;
    color: #ffffff !important;
    width: ${cfg.printWidth} !important;
    height: auto !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
  .slide-container-print {
    width: ${cfg.printWidth} !important;
    height: ${cfg.printHeight} !important;
    min-width: ${cfg.printWidth} !important;
    min-height: ${cfg.printHeight} !important;
    max-width: ${cfg.printWidth} !important;
    max-height: ${cfg.printHeight} !important;
    page-break-after: always !important;
    break-after: page !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    overflow: hidden !important;
    position: relative !important;
    margin: 0 !important;
    box-shadow: none !important;
    border: none !important;
    border-radius: 0 !important;
  }
}`;
}

export function formatCurrencyBRL(value: number): string {
  if (typeof value !== 'number' || isNaN(value)) return 'R$ 0,00';
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  });
}

export function formatNumberBR(value: number): string {
  if (typeof value !== 'number' || isNaN(value)) return '0';
  return value.toLocaleString('pt-BR');
}

export function validateEventData(data: Partial<EventData>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name || data.name.trim() === '') {
    errors.push('O nome do evento é obrigatório.');
  }
  if (!data.date || data.date.trim() === '') {
    errors.push('A data do evento é obrigatória.');
  }
  if (!data.venue || data.venue.trim() === '') {
    errors.push('O local do evento é obrigatório.');
  }
  if (!data.tiers || data.tiers.length === 0) {
    errors.push('Ao menos uma cota de patrocínio deve estar configurada.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function computeSponsorshipMetrics(data: EventData): {
  totalPotentialRevenue: number;
  totalQuotas: number;
  highlightedTierPrice: number;
} {
  let totalPotentialRevenue = 0;
  let totalQuotas = 0;
  let highlightedTierPrice = 0;

  for (const tier of data.tiers) {
    totalPotentialRevenue += tier.price * tier.quotasAvailable;
    totalQuotas += tier.quotasAvailable;
    if (tier.highlighted) {
      highlightedTierPrice = tier.price;
    }
  }

  return {
    totalPotentialRevenue,
    totalQuotas,
    highlightedTierPrice,
  };
}

export const defaultThemePresets: Record<string, ThemeConfig> = {
  luxuryGold: {
    id: 'luxuryGold',
    name: 'Onyx & Champagne Gold',
    primaryColor: '#D4AF37', // Gold
    secondaryColor: '#F59E0B',
    accentColor: '#FBBF24',
    bgColor: '#09090b',
    bgGradient: 'linear-gradient(135deg, #09090b 0%, #18181b 50%, #0c0a09 100%)',
    cardBg: 'rgba(24, 24, 27, 0.75)',
    cardBorder: 'rgba(212, 175, 55, 0.25)',
    textColor: '#f4f4f5',
    textMuted: '#a1a1aa',
    fontFamilyHead: "'Playfair Display', serif",
    fontFamilyBody: "'Montserrat', sans-serif",
    typographyPreset: 'editorial',
    glassStyle: 'backdrop-blur-md bg-neutral-900/70 border border-amber-500/20 shadow-2xl',
  },
  emeraldPrestige: {
    id: 'emeraldPrestige',
    name: 'Deep Emerald & Platinum',
    primaryColor: '#10B981', // Emerald
    secondaryColor: '#34D399',
    accentColor: '#6EE7B7',
    bgColor: '#041712',
    bgGradient: 'linear-gradient(135deg, #02120e 0%, #062e24 60%, #02120e 100%)',
    cardBg: 'rgba(6, 46, 36, 0.65)',
    cardBorder: 'rgba(16, 185, 129, 0.3)',
    textColor: '#f0fdf4',
    textMuted: '#9ca3af',
    fontFamilyHead: "'Cinzel', serif",
    fontFamilyBody: "'Inter', sans-serif",
    typographyPreset: 'minimal',
    glassStyle: 'backdrop-blur-md bg-emerald-950/60 border border-emerald-500/20 shadow-2xl',
  },
  cyberNeon: {
    id: 'cyberNeon',
    name: 'Cyber Violet & Cyan',
    primaryColor: '#8B5CF6', // Purple
    secondaryColor: '#06B6D4', // Cyan
    accentColor: '#EC4899',
    bgColor: '#070714',
    bgGradient: 'linear-gradient(135deg, #070714 0%, #150f33 50%, #0a0b1e 100%)',
    cardBg: 'rgba(21, 15, 51, 0.7)',
    cardBorder: 'rgba(139, 92, 246, 0.35)',
    textColor: '#faf5ff',
    textMuted: '#a5b4fc',
    fontFamilyHead: "'Space Grotesk', sans-serif",
    fontFamilyBody: "'Inter', sans-serif",
    typographyPreset: 'tech',
    glassStyle: 'backdrop-blur-md bg-indigo-950/60 border border-purple-500/20 shadow-2xl',
  },
  sunsetFestival: {
    id: 'sunsetFestival',
    name: 'Sunset Red & Warm Amber',
    primaryColor: '#F43F5E', // Rose / Sunset
    secondaryColor: '#FB923C',
    accentColor: '#FDE047',
    bgColor: '#0c070a',
    bgGradient: 'linear-gradient(135deg, #0c070a 0%, #260a16 50%, #17070e 100%)',
    cardBg: 'rgba(38, 10, 22, 0.65)',
    cardBorder: 'rgba(244, 63, 94, 0.3)',
    textColor: '#fff1f2',
    textMuted: '#fda4af',
    fontFamilyHead: "'Syne', sans-serif",
    fontFamilyBody: "'Montserrat', sans-serif",
    typographyPreset: 'festival',
    glassStyle: 'backdrop-blur-md bg-rose-950/60 border border-rose-500/20 shadow-2xl',
  },
};

export const typographyStyles: Record<
  TypographyPreset,
  { label: string; headFont: string; bodyFont: string; description: string }
> = {
  editorial: {
    label: 'Editorial Elegante',
    headFont: "'Playfair Display', serif",
    bodyFont: "'Montserrat', sans-serif",
    description: 'Refinamento clássico, ideal para alta gastronomia, moda e luxo.',
  },
  tech: {
    label: 'Tech Moderno',
    headFont: "'Space Grotesk', sans-serif",
    bodyFont: "'Inter', sans-serif",
    description: 'Vanguardista e limpo, ideal para conferências e startups.',
  },
  festival: {
    label: 'Festival Vibrante',
    headFont: "'Syne', sans-serif",
    bodyFont: "'Montserrat', sans-serif",
    description: 'Alta energia, expressivo e audacioso para shows e cultura.',
  },
  minimal: {
    label: 'Minimalista High-End',
    headFont: "'Cinzel', serif",
    bodyFont: "'Inter', sans-serif",
    description: 'Imponência atemporal para eventos corporativos e esportivos.',
  },
};

export const defaultImages: SlideImages = {
  logoUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80',
  slide1Cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1920&q=85',
  slide2Concept: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=85',
  slide3Audience: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=85',
  slide4Attraction1: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80',
  slide4Attraction2: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
  slide4Attraction3: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
  slide6Closing: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1920&q=85',
  sponsorLogos: [],
};

export const curatedGalleryPresets: {
  category: string;
  items: { label: string; url: string }[];
}[] = [
  {
    category: 'Música & Festivais',
    items: [
      {
        label: 'Palco & Iluminação Noturna',
        url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1920&q=85',
      },
      {
        label: 'Multidão com Luzes',
        url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1920&q=85',
      },
      {
        label: 'Show de Luzes & Fogos',
        url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1920&q=85',
      },
      {
        label: 'Atmosfera Sunset Crowd',
        url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1920&q=85',
      },
    ],
  },
  {
    category: 'Gastronomia & Vinhos',
    items: [
      {
        label: 'Banquete & Mixologia',
        url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=85',
      },
      {
        label: 'Vinho & Taças Brindando',
        url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1920&q=85',
      },
      {
        label: 'Chef em Ação',
        url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1920&q=85',
      },
      {
        label: 'Jantar Open-Air Sofisticado',
        url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=85',
      },
    ],
  },
  {
    category: 'Tech & Inovação',
    items: [
      {
        label: 'Auditório de Conferência',
        url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1920&q=85',
      },
      {
        label: 'Palestrante Keynote',
        url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1920&q=85',
      },
      {
        label: 'Lounge de Networking VIP',
        url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1920&q=85',
      },
      {
        label: 'Cenografia Tech Holográfica',
        url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=85',
      },
    ],
  },
  {
    category: 'Esporte & Lifestyle',
    items: [
      {
        label: 'Pôr do Sol Sunset Beach',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=85',
      },
      {
        label: 'Corrida / Desafio Esportivo',
        url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1920&q=85',
      },
      {
        label: 'Comemoração & Pódio',
        url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1920&q=85',
      },
    ],
  },
];

export const defaultEventData: EventData = {
  name: 'AURORA FESTIVAL & SUMMIT',
  subtitle: 'O Ponto de Encontro da Criatividade, Música e Negócios de Vanguarda',
  category: 'Festival & Conferência de Inovação',
  edition: '4ª Edição Oficial',
  date: '24 a 26 de Outubro de 2026',
  venue: 'Parque Ibirapuera & Pavilhão das Artes',
  city: 'São Paulo',
  country: 'Brasil',

  // Lâmina 2: Conceito
  conceptTitle: 'O CONCEITO & EXPERIÊNCIA',
  conceptSubtitle: 'Muito além de um evento: um território de conexões autênticas e marcas memoráveis.',
  conceptStory:
    'O Aurora Festival nasceu com a premissa de reunir o que há de mais expressivo na música contemporânea, artes visuais imersivas e debates de liderança do futuro. Durante 3 dias intensos, transformamos o espaço urbano em uma jornada sensorial inesquecível, onde o público não é apenas espectador, mas protagonista ativo.',
  manifestoQuote:
    'Marcas líderes não buscam apenas visibilidade; elas constroem legados culturais e memórias afetivas duradouras.',
  manifestoAuthor: 'Curadoria Aurora 2026',
  showConceptStory: true,
  showManifesto: true,
  showPillars: true,
  pillars: [
    {
      title: 'Atmosfera Imersiva',
      description: 'Cenografia 360°, projeções mapeadas e iluminação cênica cinematográfica.',
      iconName: 'Sparkles',
    },
    {
      title: 'Curadoria de Elite',
      description: 'Headliners globais, chefs estrelados e os pensadores mais influentes da atualidade.',
      iconName: 'Flame',
    },
    {
      title: 'Networking Qualificado',
      description: 'Espaços VIP desenhados para ativações de alto impacto e fechamento de grandes negócios.',
      iconName: 'Users',
    },
  ],

  // Lâmina 3: Público
  audienceCount: '25.000+',
  digitalImpressions: '4.8M+',
  ageBracket: '25 - 44 anos',
  purchasingPower: 'Classes A/B (84%)',
  demographicsGender: [
    { label: 'Feminino', percentage: 52 },
    { label: 'Masculino', percentage: 45 },
    { label: 'Não-binário / Outros', percentage: 3 },
  ],
  audienceProfileDescription:
    'Formadores de opinião, líderes de inovação, executivos C-Level, criadores de conteúdo e entusiastas de arte e tecnologia com alto poder de decisão de compra e forte consumo cultural.',
  mediaChannels: [
    'Cobertura de Imprensa Nacional',
    'Transmissão ao Vivo em 4K',
    'Comunidade de 180k+ Seguidores',
    'Campanha Digital Geotargeted',
  ],
  showMediaChannels: true,
  showAudienceProfile: true,
  showDemographicsGender: true,
  showMetricAudience: true,
  showMetricImpressions: true,
  showMetricAge: true,
  showMetricPower: true,
  customBlocksSlide3: [],

  // Lâmina 4: Atrações & Estrutura
  structureTitle: 'ATRAÇÕES & INFRAESTRUTURA',
  structureSubtitle: 'Uma megaestrutura planejada nos mínimos detalhes para acolher marcas e pessoas com excelência.',
  attractions: [
    {
      title: 'Palco Aurora Principal',
      tag: 'LINE-UP ESTELAR',
      description: 'Mais de 30 artistas e atrações internacionais em um palco com som espacial imersivo e telões de alta definição.',
      imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80',
      stats: '36 horas de programação ininterrupta',
    },
    {
      title: 'Village Gastronômico & Mixologia',
      tag: 'ALTA GASTRONOMIA',
      description: 'Curadoria com 12 dos melhores restaurantes e bares premiados da cidade, assinando menus autorais exclusivos.',
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      stats: 'Estações gourmets e bares conceito',
    },
    {
      title: 'Espaço Conexões & Lounges VIP',
      tag: 'EXPERIÊNCIAS B2B & B2C',
      description: 'Ambiente climatizado com visão privilegiada, bar proprietário, ativações interativas e acesso exclusivo a camarins.',
      imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
      stats: 'Capacidade para 1.500 convidados VIP',
    },
  ],
  structureMetrics: [
    { value: '18.000 m²', label: 'Área total de ativação' },
    { value: '3 Palcos', label: 'Ambientes simultâneos' },
    { value: '100% Eco', label: 'Neutralização de carbono' },
    { value: 'Wi-Fi 6', label: 'Conectividade dedicada' },
  ],
  showStructureMetrics: true,

  // Lâmina 5: Cotas
  tiersTitle: 'COTAS DE PATROCÍNIO & RETORNO',
  tiersSubtitle: 'Posicione sua marca no centro da experiência com entrega garantida de valor, visibilidade e ROI.',
  tiers: [
    {
      id: 'apresenta',
      name: 'COTA APRESENTA',
      badge: 'NAMING RIGHTS • EXCLUSIVIDADE TOTAL',
      price: 250000,
      quotasAvailable: 1,
      highlighted: true,
      deliverables: [
        'Assinatura "Aurora apresentado por [Sua Marca]" em toda a comunicação',
        'Exclusividade absoluta no segmento de atuação do patrocinador',
        'Espaço nobre de 80m² para ativação proprietária e estande interativo',
        'Logotipo com destaque máximo em todos os materiais impressos e digitais',
        '50 Ingressos VIP Camarote com All Inclusive + 150 Ingressos Pista',
        'Vídeo manifesto da marca exibido nos telões principais nos intervalos',
        'Menção especial em todos os releases de imprensa e coletiva oficial',
        'Direito de uso das marcas e imagens do festival para campanhas próprias',
      ],
    },
    {
      id: 'master',
      name: 'COTA MASTER',
      badge: 'PATROCÍNIO OURO • DESTAQUE CENTRAL',
      price: 120000,
      quotasAvailable: 3,
      highlighted: false,
      deliverables: [
        'Logotipo de grande destaque em backdrops, portal de entrada e site',
        'Espaço de 40m² para ativação de marca e degustação de produtos',
        '25 Ingressos VIP Camarote + 60 Ingressos Pista',
        'Inserções nos telões de LED entre as apresentações principais',
        '3 Posts dedicados nas redes oficiais do evento com link direto',
        'Inclusão de brinde institucional ou cupom no kit de boas-vindas VIP',
        'Relatório completo de clipping de mídia e métricas de engajamento',
      ],
    },
    {
      id: 'apoio',
      name: 'COTA APOIO',
      badge: 'COTA PRATA • CONEXÃO ESTRATÉGICA',
      price: 45000,
      quotasAvailable: 5,
      highlighted: false,
      deliverables: [
        'Logotipo nos painéis de apoiadores e rodapés de comunicação digital',
        'Espaço para totem ou quiosque de ativação de 15m²',
        '10 Ingressos VIP Camarote + 20 Ingressos Pista',
        '1 Post de boas-vindas conjunto no Instagram oficial do evento',
        'Menção nos comunicados digitais e newsletters de patrocinadores',
        'Certificado oficial de parceria e relatório pós-evento consolidado',
      ],
    },
  ],

  // Lâmina 6: Contato
  closingTitle: 'VAMOS ESCREVER ESTE CAPÍTULO JUNTOS?',
  closingSubtitle: 'Garantir presença no Aurora 2026 é associar sua marca a inovação, cultura e momentos memoráveis.',
  closingCta: 'Entre em contato para desenharmos uma ativação customizada para os objetivos da sua marca.',
  contactName: 'Mariana Drummond',
  contactRole: 'Diretora de Parcerias Estratégicas & Patrocínios',
  contactEmail: 'parcerias@aurorafestival.com.br',
  contactPhone: '+55 (11) 98765-4321',
  contactInstagram: '@aurorafestivaloficial',
  contactWebsite: 'www.aurorafestival.com.br',
  proposalValidityDays: 15,
  showContactCard: true,
  showContactSocials: true,
  showClosingSponsors: true,
  showClosingValidity: true,
  customBlocksSlide6: [],
};

export const eventPresets: Record<string, EventData> = {
  festivalMusica: defaultEventData,
  gastronomiaVinho: {
    ...defaultEventData,
    name: 'TERROIR & SABOR GASTRONOMY FEST',
    subtitle: 'O Maior Encontro de Alta Culinária, Produtores Artesanais e Vinhos Finos',
    category: 'Festival Gastronômico Premium',
    edition: '6ª Edição Nacional',
    date: '12 a 15 de Novembro de 2026',
    venue: 'Espaço Cidade Jardim & Jardins Open Air',
    city: 'São Paulo',
    conceptTitle: 'O CONCEITO & SABORES',
    conceptSubtitle: 'Uma celebração refinada à mesa com chefs premiados e produtores apaixonados.',
    conceptStory:
      'O Terroir & Sabor une a elite da culinária internacional à tradição dos produtores locais. Durante 4 dias, sommeliers renomados, mestres cervejeiros e chefs com estrelas Michelin conduzem masterclasses, jantares secretos e degustações harmonizadas para um público com paladar apurado.',
    manifestoQuote:
      'A gastronomia é a arte de criar memórias ao redor da mesa. Conectar sua marca a esse ritual é inesquecível.',
    manifestoAuthor: 'Curadoria Terroir 2026',
    audienceCount: '12.000+',
    digitalImpressions: '3.2M+',
    ageBracket: '28 - 55 anos',
    purchasingPower: 'Classes A (91%)',
    audienceProfileDescription:
      'Gourmands, apreciadores de vinhos raros, executivos, médicos, advogados e casais sofisticados que investem em experiências de alto padrão.',
    tiers: [
      {
        id: 'apresenta',
        name: 'COTA APRESENTA MASTER',
        badge: 'NAMING RIGHTS DO PAVILHÃO PRINCIPAL',
        price: 180000,
        quotasAvailable: 1,
        highlighted: true,
        deliverables: [
          'Assinatura "Terroir apresentado por [Sua Marca]" em todos os canais',
          'Espaço restaurante com cozinha show de 60m² para ativação culinária',
          'Harmonização exclusiva com produtos da sua marca nas masterclasses',
          '40 Ingressos VIP com acesso a todas as degustações e jantar de gala',
          'Menção nominal pelos chefs apresentadores em todos os workshops',
        ],
      },
      {
        id: 'master',
        name: 'COTA HARMONIZAÇÃO',
        badge: 'PATROCÍNIO GOLD',
        price: 90000,
        quotasAvailable: 3,
        highlighted: false,
        deliverables: [
          'Estande nobre de 30m² na alameda principal de degustações',
          'Logo em destaque nos cadernos de receitas e taças comemorativas',
          '20 Ingressos VIP All-Inclusive',
          'Post patrocinado e reels com chef embaixador preparando prato com sua marca',
        ],
      },
      {
        id: 'apoio',
        name: 'COTA APOIO ARTESANAL',
        badge: 'PATROCÍNIO SILVER',
        price: 35000,
        quotasAvailable: 6,
        highlighted: false,
        deliverables: [
          'Bancada de 12m² para exposição e venda direta ao público qualificado',
          'Logo no guia oficial do evento e telões informativos',
          '8 Ingressos VIP',
          'Inclusão no catálogo de parceiros gastronômicos',
        ],
      },
    ],
  },
  techInnovation: {
    ...defaultEventData,
    name: 'NEXUS TECH & AI SUMMIT 2026',
    subtitle: 'Conectando os Líderes Globais de Inteligência Artificial, Clima e Futuro dos Negócios',
    category: 'Congresso & Feira de Inovação',
    edition: '5ª Edição Internacional',
    date: '08 a 10 de Setembro de 2026',
    venue: 'Centro de Convenções WTC & Hall Tecnológico',
    city: 'São Paulo',
    conceptTitle: 'O CONCEITO & VANGUARDA',
    conceptSubtitle: 'O epicentro onde o futuro da tecnologia e do mercado é debatido e construído.',
    conceptStory:
      'O Nexus Summit reúne mais de 10.000 tomadores de decisão, founders de unicórnios, investidores de Venture Capital e pesquisadores pioneiros para 3 dias de debates profundos sobre Inteligência Artificial, sustentabilidade e novos modelos de negócios.',
    manifestoQuote:
      'O futuro pertence àqueles que o constroem hoje. Posicione sua marca como a catalisadora dessa transformação.',
    manifestoAuthor: 'Comitê Diretor Nexus',
    audienceCount: '10.500+',
    digitalImpressions: '6.5M+',
    ageBracket: '26 - 48 anos',
    purchasingPower: 'C-Levels, Diretores e Founders (78%)',
    audienceProfileDescription:
      'CEOs, CTOs, CIOs, investidores de fundos de VC, gerentes de produto e líderes técnicos de grandes corporações da América Latina.',
    tiers: [
      {
        id: 'apresenta',
        name: 'COTA TITLE SPONSOR',
        badge: 'KEYNOTE ARENA NAMING RIGHTS',
        price: 320000,
        quotasAvailable: 1,
        highlighted: true,
        deliverables: [
          'Arena Principal: "Keynote Arena by [Sua Marca]" com capacidade para 3.000 pessoas',
          'Palestra de 30 minutos na grade principal no horário nobre (sem conflito)',
          'Lounge de hospitalidade B2B privativo de 70m² com bar de café e reuniões',
          'Acesso a lista de participantes opt-in e relatórios de inteligência de leads',
          '60 Passes Executivos All-Access + Acesso ao VIP Speakers Dinner',
        ],
      },
      {
        id: 'master',
        name: 'COTA INNOVATION PARTNER',
        badge: 'PATROCÍNIO PLATINUM',
        price: 150000,
        quotasAvailable: 4,
        highlighted: false,
        deliverables: [
          'Estande interativo de 35m² na área de exposição tech com fluxo contínuo',
          'Participação em mesa redonda temática com moderador de mercado',
          '25 Passes Executivos All-Access',
          'Logotipo com alta visibilidade em todas as transmissões de streaming ao vivo',
        ],
      },
      {
        id: 'apoio',
        name: 'COTA STARTUP & GROWTH',
        badge: 'PATROCÍNIO GOLD',
        price: 55000,
        quotasAvailable: 8,
        highlighted: false,
        deliverables: [
          'Pod de demonstração de produto de 12m² com tela de apresentação',
          '10 Passes Executivos',
          'Logo em telões e catálogo oficial de patrocinadores',
          'Participação no Speed Networking com investidores',
        ],
      },
    ],
  },
};

export function generateSingleFileHtml(
  data: EventData,
  theme: ThemeConfig,
  images: SlideImages,
  format: LayoutFormat = 'widescreen'
): string {
  const cfg = formatConfigs[format] || formatConfigs.widescreen;
  const isMobile = format === 'mobile';
  const isA4 = format === 'a4Portrait';

  // Generates clean, standalone valid HTML export file
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.name} - Proposta de Patrocínio & Media Kit</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500;600;700&family=Montserrat:wght@400;600;700;800;900&family=Playfair+Display:ital,wght@0,600;0,700;0,900;1,600&family=Space+Grotesk:wght@500;700&family=Syne:wght@700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: ${theme.bgColor};
      color: ${theme.textColor};
      font-family: ${theme.fontFamilyBody};
      -webkit-font-smoothing: antialiased;
    }
    .slide {
      width: ${isMobile ? '430px' : isA4 ? '680px' : '100vw'};
      height: ${isMobile ? '764px' : isA4 ? '962px' : '56.25vw'};
      max-height: ${isMobile || isA4 ? 'none' : '100vh'};
      max-width: ${isMobile || isA4 ? 'none' : '177.78vh'};
      margin: 0 auto 30px auto;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: ${isMobile ? '28px' : isA4 ? '36px' : '3.5vw'};
      background-size: cover;
      background-position: center;
      page-break-after: always;
      break-after: page;
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    }
    @media print {
      @page {
        size: ${cfg.printPageSize};
        margin: 0;
      }
      body {
        background: #000 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .slide {
        width: ${cfg.printWidth} !important;
        height: ${cfg.printHeight} !important;
        min-width: ${cfg.printWidth} !important;
        min-height: ${cfg.printHeight} !important;
        max-width: ${cfg.printWidth} !important;
        max-height: ${cfg.printHeight} !important;
        margin: 0 !important;
        padding: 0.6in !important;
        border-radius: 0 !important;
        box-shadow: none !important;
      }
      .no-print { display: none !important; }
    }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      font-size: 0.85rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      border-radius: 9999px;
      background: rgba(0,0,0,0.6);
      border: 1px solid ${theme.primaryColor};
      color: ${theme.primaryColor};
    }
    .gold-text {
      color: ${theme.primaryColor};
    }
    .hero-title {
      font-family: ${theme.fontFamilyHead};
      font-size: ${isMobile ? '28px' : isA4 ? '38px' : '3.8vw'};
      font-weight: 900;
      line-height: 1.1;
      text-transform: uppercase;
      letter-spacing: -0.02em;
    }
    .card {
      background: ${theme.cardBg};
      border: 1px solid ${theme.cardBorder};
      border-radius: 12px;
      padding: ${isMobile ? '14px' : '1.5vw'};
      backdrop-filter: blur(12px);
    }
  </style>
</head>
<body>
  <div style="text-align: center; padding: 20px;" class="no-print">
    <button onclick="window.print()" style="background: ${theme.primaryColor}; color: #000; font-weight: bold; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 16px;">
      Exportar PDF (${cfg.ratioLabel})
    </button>
  </div>

  <!-- Lâmina 1 -->
  <section class="slide" style="background-image: linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.85) 100%), url('${images.slide1Cover}');">
    <div style="display: flex; align-items: center; justify-content: space-between;">
      <div style="display: flex; align-items: center; gap: 14px;">
        ${images.logoUrl ? `<img src="${images.logoUrl}" alt="Logomarca" style="height: ${isMobile ? '44px' : '56px'}; max-width: 140px; object-fit: contain; border-radius: 8px; background: rgba(0,0,0,0.4); padding: 4px; border: 1px solid rgba(255,255,255,0.15);">` : ''}
        <span class="badge">Proposta de Patrocínio & Media Kit • Confidencial</span>
      </div>
      <span style="font-family: monospace; font-size: 0.85rem; color: ${theme.primaryColor}; opacity: 0.9;">2026 OFFICIAL</span>
    </div>
    <div>
      <h1 class="hero-title">${data.name}</h1>
      <p style="font-size: ${isMobile ? '14px' : isA4 ? '18px' : '1.5vw'}; margin-top: 1vw; color: ${theme.primaryColor}; font-weight: 600;">${data.subtitle}</p>
    </div>
    <div style="display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 1vw; font-size: ${isMobile ? '11px' : '1.1vw'};">
      <span><strong>Data:</strong> ${data.date}</span>
      <span><strong>Local:</strong> ${data.venue} - ${data.city}</span>
      <span><strong>Edição:</strong> ${data.edition}</span>
    </div>
  </section>

  <!-- Lâmina 2 -->
  <section class="slide" style="background: ${theme.bgGradient};">
    <div>
      <span class="badge">O Conceito & Experiência</span>
      <h2 style="font-family: ${theme.fontFamilyHead}; font-size: 2.5vw; margin-top: 0.5vw;">${data.conceptTitle}</h2>
      <p style="color: ${theme.textMuted}; font-size: 1.1vw;">${data.conceptSubtitle}</p>
    </div>
    <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 2vw; align-items: center;">
      <div class="card">
        <p style="font-size: 1.2vw; line-height: 1.6; margin-bottom: 1.5vw;">${data.conceptStory}</p>
        <blockquote style="border-left: 3px solid ${theme.primaryColor}; padding-left: 1vw; font-style: italic; color: ${theme.primaryColor}; font-size: 1.1vw;">
          "${data.manifestoQuote}"
          <footer style="margin-top: 0.5vw; font-size: 0.9vw; color: ${theme.textMuted};">— ${data.manifestoAuthor}</footer>
        </blockquote>
      </div>
      <div>
        <img src="${images.slide2Concept}" alt="Conceito" style="width: 100%; border-radius: 12px; border: 1px solid ${theme.cardBorder}; object-fit: cover; height: 18vw;">
      </div>
    </div>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1vw;">
      ${data.pillars
        .map(
          (p) => `
        <div class="card" style="padding: 1vw;">
          <h4 style="color: ${theme.primaryColor}; font-size: 1.1vw; margin-bottom: 0.3vw;">${p.title}</h4>
          <p style="font-size: 0.85vw; color: ${theme.textMuted};">${p.description}</p>
        </div>`
        )
        .join('')}
    </div>
  </section>

  <!-- Lâmina 3 -->
  <section class="slide" style="background: ${theme.bgGradient};">
    <div>
      <span class="badge">Audiência Qualificada</span>
      <h2 style="font-family: ${theme.fontFamilyHead}; font-size: 2.5vw; margin-top: 0.5vw;">PÚBLICO & ALCANCE</h2>
    </div>
    ${(() => {
      const activeMetrics = [
        data.showMetricAudience !== false ? { label: 'Público Estimado', value: data.audienceCount, color: theme.primaryColor } : null,
        data.showMetricImpressions !== false ? { label: 'Impacto Digital', value: data.digitalImpressions, color: theme.secondaryColor } : null,
        data.showMetricAge !== false ? { label: 'Faixa Etária Principal', value: data.ageBracket, color: theme.primaryColor } : null,
        data.showMetricPower !== false ? { label: 'Poder Aquisitivo', value: data.purchasingPower, color: theme.secondaryColor } : null,
      ].filter(Boolean) as { label: string; value: string; color: string }[];

      if (activeMetrics.length === 0) return '';
      return `<div style="display: grid; grid-template-columns: repeat(${activeMetrics.length}, 1fr); gap: 1.5vw;">
        ${activeMetrics.map(m => `
          <div class="card" style="text-align: center;">
            <span style="font-size: 2.5vw; font-weight: 800; color: ${m.color};">${m.value}</span>
            <p style="font-size: 0.95vw; margin-top: 0.5vw; font-weight: 600;">${m.label}</p>
          </div>
        `).join('')}
      </div>`;
    })()}
    ${(() => {
      const showProfile = data.showAudienceProfile !== false;
      const showChannels = data.showMediaChannels !== false && data.mediaChannels && data.mediaChannels.length > 0;

      if (!showProfile && !showChannels) return '';
      if (showProfile && !showChannels) {
        return `<div class="card" style="width: 100%;">
          <h3 style="color: ${theme.primaryColor}; font-size: 1.2vw; margin-bottom: 0.5vw;">Perfil Sociodemográfico</h3>
          <p style="font-size: 1.1vw; line-height: 1.5; color: ${theme.textColor};">${data.audienceProfileDescription}</p>
        </div>`;
      }
      if (!showProfile && showChannels) {
        return `<div class="card" style="width: 100%;">
          <h3 style="color: ${theme.secondaryColor}; font-size: 1.2vw; margin-bottom: 0.5vw;">Canais de Mídia & Transmissão</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.8vw; margin-top: 0.8vw;">
            ${data.mediaChannels.map(c => `
              <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); padding: 0.6vw 1vw; border-radius: 6px; font-size: 0.9vw;">
                ${c}
              </div>
            `).join('')}
          </div>
        </div>`;
      }
      return `<div style="display: grid; grid-template-columns: 7fr 5fr; gap: 1.5vw;">
        <div class="card">
          <h3 style="color: ${theme.primaryColor}; font-size: 1.2vw; margin-bottom: 0.5vw;">Perfil Sociodemográfico</h3>
          <p style="font-size: 1.05vw; line-height: 1.5; color: ${theme.textColor};">${data.audienceProfileDescription}</p>
        </div>
        <div class="card">
          <h3 style="color: ${theme.secondaryColor}; font-size: 1.2vw; margin-bottom: 0.5vw;">Canais de Mídia</h3>
          <div style="display: flex; flex-direction: column; gap: 0.5vw; margin-top: 0.5vw;">
            ${data.mediaChannels.map(c => `
              <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); padding: 0.5vw 0.8vw; border-radius: 6px; font-size: 0.85vw;">
                ${c}
              </div>
            `).join('')}
          </div>
        </div>
      </div>`;
    })()}
    ${(data.customBlocksSlide3 && data.customBlocksSlide3.length > 0) ? `
      <div style="display: grid; grid-template-columns: repeat(${Math.min(data.customBlocksSlide3.length, 3)}, 1fr); gap: 1vw;">
        ${data.customBlocksSlide3.map(b => `
          <div class="card">
            <h4 style="color: ${theme.primaryColor}; font-size: 1.1vw; margin-bottom: 0.4vw;">${b.title}</h4>
            <p style="font-size: 0.95vw; line-height: 1.4; color: ${theme.textColor};">${b.content}</p>
          </div>
        `).join('')}
      </div>
    ` : ''}
  </section>

  <!-- Lâmina 4 -->
  <section class="slide" style="background: ${theme.bgGradient};">
    <div>
      <span class="badge">Pilares da Experiência</span>
      <h2 style="font-family: ${theme.fontFamilyHead}; font-size: 2.5vw; margin-top: 0.5vw;">${data.structureTitle}</h2>
    </div>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5vw;">
      ${data.attractions
        .map(
          (a) => `
        <div class="card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column;">
          <img src="${a.imageUrl}" alt="${a.title}" style="width: 100%; height: 10vw; object-fit: cover;">
          <div style="padding: 1vw; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <span style="font-size: 0.75vw; color: ${theme.primaryColor}; font-weight: 700; text-transform: uppercase;">${a.tag}</span>
              <h3 style="font-size: 1.2vw; margin-top: 0.2vw;">${a.title}</h3>
              <p style="font-size: 0.85vw; color: ${theme.textMuted}; margin-top: 0.4vw;">${a.description}</p>
            </div>
            <div style="margin-top: 0.8vw; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 0.5vw; font-size: 0.8vw; color: ${theme.primaryColor};">
              ${a.stats}
            </div>
          </div>
        </div>`
        )
        .join('')}
    </div>
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1vw;">
      ${data.structureMetrics
        .map(
          (m) => `
        <div class="card" style="text-align: center; padding: 0.8vw;">
          <span style="font-weight: 800; font-size: 1.2vw; color: ${theme.primaryColor};">${m.value}</span>
          <p style="font-size: 0.8vw; color: ${theme.textMuted};">${m.label}</p>
        </div>`
        )
        .join('')}
    </div>
  </section>

  <!-- Lâmina 5 -->
  <section class="slide" style="background: ${theme.bgGradient};">
    <div>
      <span class="badge">Investimento & Contrapartidas</span>
      <h2 style="font-family: ${theme.fontFamilyHead}; font-size: 2.5vw; margin-top: 0.5vw;">${data.tiersTitle}</h2>
    </div>
    <div style="display: grid; grid-template-columns: repeat(${data.tiers.length}, 1fr); gap: 1.2vw;">
      ${data.tiers
        .map(
          (tier) => `
        <div class="card" style="${tier.highlighted ? `border: 2px solid ${theme.primaryColor}; box-shadow: 0 0 30px rgba(212,175,55,0.25);` : ''} display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <span style="font-size: 0.75vw; font-weight: 700; color: ${tier.highlighted ? theme.primaryColor : theme.textMuted}; text-transform: uppercase;">${tier.badge}</span>
            <h3 style="font-size: 1.4vw; font-weight: 800; margin-top: 0.2vw;">${tier.name}</h3>
            <div style="margin: 0.8vw 0; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.8vw;">
              <span style="font-size: 1.8vw; font-weight: 900; color: ${theme.primaryColor};">${formatCurrencyBRL(tier.price)}</span>
              <p style="font-size: 0.8vw; color: ${theme.textMuted};">${tier.quotasAvailable} cota(s) disponível(is)</p>
            </div>
            <ul style="list-style: none; font-size: 0.8vw; line-height: 1.6;">
              ${tier.deliverables.map((d) => `<li style="margin-bottom: 0.3vw;">✓ ${d}</li>`).join('')}
            </ul>
          </div>
        </div>`
        )
        .join('')}
    </div>
  </section>

  <!-- Lâmina 6 -->
  <section class="slide" style="background-image: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 100%), url('${images.slide6Closing}'); text-align: center; justify-content: center; gap: ${isMobile ? '16px' : '2vw'};">
    <div>
      ${images.logoUrl ? `<img src="${images.logoUrl}" alt="Logomarca" style="height: ${isMobile ? '38px' : '48px'}; object-fit: contain; margin-bottom: 8px;">` : ''}
      <br>
      <span class="badge">Próximos Passos & Parceria</span>
      <h2 style="font-family: ${theme.fontFamilyHead}; font-size: ${isMobile ? '22px' : '3vw'}; margin-top: 1vw;">${data.closingTitle}</h2>
      <p style="font-size: ${isMobile ? '12px' : '1.3vw'}; color: ${theme.primaryColor}; max-width: 800px; margin: 1vw auto;">${data.closingCta}</p>
    </div>
    <div class="card" style="max-width: 700px; margin: 0 auto; width: 100%;">
      <h3 style="font-size: ${isMobile ? '16px' : '1.5vw'}; color: #fff;">${data.contactName}</h3>
      <p style="font-size: ${isMobile ? '12px' : '1.1vw'}; color: ${theme.primaryColor};">${data.contactRole}</p>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: ${isMobile ? '6px' : '1vw'}; margin-top: 1vw; font-size: ${isMobile ? '11px' : '1vw'};">
        <span><strong>WhatsApp:</strong> ${data.contactPhone}</span>
        <span><strong>E-mail:</strong> ${data.contactEmail}</span>
        <span><strong>Instagram:</strong> ${data.contactInstagram}</span>
        <span><strong>Site:</strong> ${data.contactWebsite}</span>
      </div>
      <p style="margin-top: 1vw; font-size: ${isMobile ? '9px' : '0.8vw'}; color: ${theme.textMuted};">Proposta válida por ${data.proposalValidityDays} dias a partir da data de apresentação.</p>
    </div>
    ${images.sponsorLogos && images.sponsorLogos.length > 0 ? `
    <div style="margin-top: 1vw;">
      <span style="font-size: 0.8vw; text-transform: uppercase; letter-spacing: 0.1em; color: ${theme.textMuted}; display: block; margin-bottom: 0.5vw;">Marcas & Patrocinadores Confirmados</span>
      <div style="display: flex; justify-content: center; align-items: center; gap: 1vw; flex-wrap: wrap;">
        ${images.sponsorLogos.map((s) => `<img src="${s}" alt="Patrocinador" style="height: ${isMobile ? '24px' : '32px'}; max-width: 90px; object-fit: contain; filter: grayscale(20%); background: rgba(255,255,255,0.06); padding: 4px 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1);">`).join('')}
      </div>
    </div>` : ''}
  </section>
</body>
</html>`;
}
