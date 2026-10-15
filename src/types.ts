export interface SponsorshipTier {
  id: string;
  name: string;
  badge: string;
  price: number;
  quotasAvailable: number;
  highlighted?: boolean;
  deliverables: string[];
}

export interface ExperiencePillar {
  title: string;
  description: string;
  iconName: string;
}

export interface AttractionCard {
  title: string;
  tag: string;
  description: string;
  imageUrl: string;
  stats: string;
}

export interface EventData {
  name: string;
  subtitle: string;
  category: string;
  edition: string;
  date: string;
  venue: string;
  city: string;
  country: string;

  // Lâmina 2: Conceito
  conceptTitle: string;
  conceptSubtitle: string;
  conceptStory: string;
  manifestoQuote: string;
  manifestoAuthor: string;
  pillars: ExperiencePillar[];

  // Lâmina 3: Público & Métricas
  audienceCount: string;
  digitalImpressions: string;
  ageBracket: string;
  purchasingPower: string;
  demographicsGender: { label: string; percentage: number }[];
  audienceProfileDescription: string;
  mediaChannels: string[];

  // Lâmina 4: Atrações & Estrutura
  structureTitle: string;
  structureSubtitle: string;
  attractions: AttractionCard[];
  structureMetrics: { value: string; label: string }[];

  // Lâmina 5: Cotas
  tiersTitle: string;
  tiersSubtitle: string;
  tiers: SponsorshipTier[];

  // Lâmina 6: Contato
  closingTitle: string;
  closingSubtitle: string;
  closingCta: string;
  contactName: string;
  contactRole: string;
  contactEmail: string;
  contactPhone: string;
  contactInstagram: string;
  contactWebsite: string;
  proposalValidityDays: number;
}

export type TypographyPreset = 'editorial' | 'tech' | 'festival' | 'minimal';

export interface ThemeConfig {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgColor: string;
  bgGradient: string;
  cardBg: string;
  cardBorder: string;
  textColor: string;
  textMuted: string;
  fontFamilyHead: string;
  fontFamilyBody: string;
  typographyPreset: TypographyPreset;
  glassStyle: string;
}

export type LayoutFormat = 'widescreen' | 'mobile' | 'a4Portrait';

export interface FormatConfig {
  id: LayoutFormat;
  label: string;
  shortLabel: string;
  ratioLabel: string;
  aspectClass: string;
  previewMaxWidth: number;
  printPageSize: string;
  printWidth: string;
  printHeight: string;
  description: string;
}

export interface SlideImages {
  logoUrl: string;
  slide1Cover: string;
  slide2Concept: string;
  slide3Audience: string;
  slide4Attraction1: string;
  slide4Attraction2: string;
  slide4Attraction3: string;
  slide6Closing: string;
  sponsorLogos?: string[];
}
