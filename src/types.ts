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
  hideImage?: boolean;
  hideTag?: boolean;
}

export interface CustomSlideBlock {
  id: string;
  title: string;
  content: string;
  tag?: string;
  badge?: string;
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

  // Global Icon Toggle
  hideAllIcons?: boolean;

  // Lâmina 1: Capa & Identidade
  showCoverBadge?: boolean;
  showCoverCategory?: boolean;
  showCoverEdition?: boolean;
  showCoverSubtitle?: boolean;
  showCoverMetaDate?: boolean;
  showCoverMetaVenue?: boolean;
  showIconsSlide1?: boolean;
  customBlocksSlide1?: CustomSlideBlock[];

  // Lâmina 2: Conceito
  conceptTitle: string;
  conceptSubtitle: string;
  conceptStory: string;
  manifestoQuote: string;
  manifestoAuthor: string;
  pillars: ExperiencePillar[];
  showConceptStory?: boolean;
  showManifesto?: boolean;
  showConceptImage?: boolean;
  showPillars?: boolean;
  showIconsSlide2?: boolean;
  customBlocksSlide2?: CustomSlideBlock[];

  // Lâmina 3: Público & Métricas
  audienceCount: string;
  digitalImpressions: string;
  ageBracket: string;
  purchasingPower: string;
  demographicsGender: { label: string; percentage: number }[];
  audienceProfileDescription: string;
  mediaChannels: string[];
  showMediaChannels?: boolean;
  showAudienceProfile?: boolean;
  showDemographicsGender?: boolean;
  showMetricAudience?: boolean;
  showMetricImpressions?: boolean;
  showMetricAge?: boolean;
  showMetricPower?: boolean;
  showIconsSlide3?: boolean;
  customBlocksSlide3?: CustomSlideBlock[];

  // Lâmina 4: Atrações & Estrutura
  structureTitle: string;
  structureSubtitle: string;
  attractions: AttractionCard[];
  structureMetrics: { value: string; label: string }[];
  showAttractions?: boolean;
  showAttractionPhotos?: boolean;
  showStructureMetrics?: boolean;
  showIconsSlide4?: boolean;
  customBlocksSlide4?: CustomSlideBlock[];

  // Lâmina 5: Cotas
  tiersTitle: string;
  tiersSubtitle: string;
  tiers: SponsorshipTier[];
  showTiersTitle?: boolean;
  showTierBadge?: boolean;
  showTierDeliverables?: boolean;
  showIconsSlide5?: boolean;
  customBlocksSlide5?: CustomSlideBlock[];

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
  showClosingCta?: boolean;
  showContactCard?: boolean;
  showContactPhone?: boolean;
  showContactEmail?: boolean;
  showContactInstagram?: boolean;
  showContactWebsite?: boolean;
  showClosingSponsors?: boolean;
  showClosingValidity?: boolean;
  showIconsSlide6?: boolean;
  customBlocksSlide6?: CustomSlideBlock[];
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
