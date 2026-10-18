export interface SponsorshipTier {
  id: string;
  name: string;
  badge: string;
  price: number;
  quotasAvailable: number;
  highlighted?: boolean;
  deliverables: string[];
  hideBadge?: boolean;
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
  coverBadge?: string;
  showCoverPhoto?: boolean;
  showCoverTitle?: boolean;
  showCoverBadge?: boolean;
  showCoverCategory?: boolean;
  showCoverEdition?: boolean;
  showCoverSubtitle?: boolean;
  showCoverMetaDate?: boolean;
  showCoverMetaVenue?: boolean;
  showIconsSlide1?: boolean;
  customBlocksSlide1?: CustomSlideBlock[];

  // Lâmina 2: Conceito
  conceptBadge?: string;
  conceptTitle: string;
  conceptSubtitle: string;
  conceptStory: string;
  manifestoQuote: string;
  manifestoAuthor: string;
  pillars: ExperiencePillar[];
  conceptImageBadge?: string;
  conceptImageSubtitle?: string;
  showConceptBadge?: boolean;
  showConceptTitle?: boolean;
  showConceptStory?: boolean;
  showManifesto?: boolean;
  showConceptImage?: boolean;
  showConceptImageBadge?: boolean;
  showPillars?: boolean;
  showIconsSlide2?: boolean;
  customBlocksSlide2?: CustomSlideBlock[];

  // Lâmina 3: Público & Métricas
  audienceBadge?: string;
  audienceCount: string;
  digitalImpressions: string;
  ageBracket: string;
  purchasingPower: string;
  demographicsGender: { label: string; percentage: number }[];
  audienceProfileDescription: string;
  mediaChannels: string[];
  showAudienceBgPhoto?: boolean;
  showAudienceBadge?: boolean;
  showAudienceTitle?: boolean;
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
  structureBadge?: string;
  structureTitle: string;
  structureSubtitle: string;
  attractions: AttractionCard[];
  structureMetrics: { value: string; label: string }[];
  showStructureBadge?: boolean;
  showStructureTitle?: boolean;
  showAttractions?: boolean;
  showAttractionPhotos?: boolean;
  showStructureMetrics?: boolean;
  showIconsSlide4?: boolean;
  customBlocksSlide4?: CustomSlideBlock[];

  // Lâmina 5: Cotas
  tiersBadge?: string;
  tiersTitle: string;
  tiersSubtitle: string;
  tiers: SponsorshipTier[];
  showTiersTitle?: boolean;
  showTiersSubtitle?: boolean;
  showTiersBadge?: boolean;
  showTierBadge?: boolean;
  showTierDeliverables?: boolean;
  showIconsSlide5?: boolean;
  customBlocksSlide5?: CustomSlideBlock[];

  // Lâmina 6: Contato
  closingBadge?: string;
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
  showClosingBgPhoto?: boolean;
  showClosingBadge?: boolean;
  showClosingTitle?: boolean;
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
