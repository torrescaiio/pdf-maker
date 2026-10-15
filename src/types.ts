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

  // Lâmina 2: Conceito
  conceptTitle: string;
  conceptSubtitle: string;
  conceptStory: string;
  manifestoQuote: string;
  manifestoAuthor: string;
  pillars: ExperiencePillar[];
  showConceptStory?: boolean;
  showManifesto?: boolean;
  showPillars?: boolean;

  // Lâmina 3: Público & Métricas
  audienceCount: string;
  digitalImpressions: string;
  ageBracket: string;
  purchasingPower: string;
  demographicsGender: { label: string; percentage: number }[];
  audienceProfileDescription: string;
  mediaChannels: string[];

  // Freedom / Customization toggles for Slide 3 balloons:
  showMediaChannels?: boolean; // Can be excluded/deleted or restored
  showAudienceProfile?: boolean; // Can be excluded/deleted or restored
  showDemographicsGender?: boolean; // Can be excluded/deleted or restored
  showMetricAudience?: boolean; // Metric card 1
  showMetricImpressions?: boolean; // Metric card 2
  showMetricAge?: boolean; // Metric card 3
  showMetricPower?: boolean; // Metric card 4
  customBlocksSlide3?: CustomSlideBlock[]; // User-created balloons on Slide 3

  // Lâmina 4: Atrações & Estrutura
  structureTitle: string;
  structureSubtitle: string;
  attractions: AttractionCard[];
  structureMetrics: { value: string; label: string }[];
  showStructureMetrics?: boolean;

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
  showContactCard?: boolean;
  showContactSocials?: boolean;
  showClosingSponsors?: boolean;
  showClosingValidity?: boolean;
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
