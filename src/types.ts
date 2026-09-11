export type ContentChannel = 'embee-blog' | 'linkedin' | 'guest-post' | 'third-party';

export interface GenerationParams {
  topic: string;
  focusKeyword: string;
  targetKeywords: string[];
  channel: ContentChannel;
  primarySolutionUrl?: string;
  wordCountTarget?: number;
  indianScenario?: string;
  publicationName?: string;
  authorRole?: string;
  customInstructions?: string;
}

export interface InfographicItem {
  id: string;
  title: string;
  subtitle: string;
  type: 'process-flow' | 'comparison-matrix' | 'cheat-sheet' | 'architecture-diagram' | 'decision-tree';
  targetFormat: '1:1 Square (LinkedIn/Social)' | '16:9 Landscape (Blog Header)' | '4:5 Vertical (Mobile & Pinterest)';
  keyCallout: string;
  nodes: Array<{
    stepNumber?: number;
    title: string;
    description: string;
    iconHint?: string;
  }>;
  designReference: {
    title: string;
    url: string;
    notes: string;
  };
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

export interface ResearchBrief {
  topic: string;
  focusKeyword: string;
  searchIntent: {
    primaryIntent: string;
    readerProfile: string;
    queryVariations: string[];
    aeoQueries: string[];
  };
  keyProofPoints: Array<{
    stat: string;
    source: string;
    insight: string;
  }>;
  externalCitations: Array<{
    title: string;
    url: string;
    domain: string;
    context: string;
  }>;
  internalLinkStrategy: Array<{
    title: string;
    url: string;
    category: string;
    anchorSuggestion: string;
    sectionTarget: string;
  }>;
  aeoQuestionCapsules: Array<{
    question: string;
    capsuleAnswer: string;
  }>;
  scenarioOutline: string;
  seoMetaPlan: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    altText: string;
    tags: string;
    suggestedSlug: string;
    canonicalUrl: string;
  };
  markdownSummary: string;
}

export interface AuditCheck {
  id: string;
  title: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
  suggestion?: string;
}

export interface ContentStats {
  wordCount: number;
  readingLevel: string;
  h2Count: number;
  capsuleH2Count: number;
  capsuleRatio: number;
  internalLinkCount: number;
  foundLinks: string[];
  invalidLinks: string[];
  solutionLinkCount: number;
  blogLinkCount: number;
  caseStudyLinkCount: number;
  externalLinkCount: number;
  foundExternalLinks: string[];
  emDashCount: number;
  bareEmbeeCount: number;
  goldPartnerCount: number;
  hasFirstSentenceFocusKeyword: boolean;
  hasFirstSentenceLink: boolean;
  hasFaq: boolean;
  faqCount: number;
  hasMetaBlock: boolean;
  hasInfographics?: boolean;
  infographics?: InfographicItem[];
  metaFields: {
    focusKeyword?: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    altText?: string;
    tags?: string;
    slug?: string;
    canonicalUrl?: string;
  };
}

export interface AuditResult {
  score: number;
  passed: boolean;
  checks: AuditCheck[];
  stats: ContentStats;
}

export interface SocialMediaPack {
  linkedinPost: string;
  carouselSlides: Array<{
    slideNumber: number;
    title: string;
    bullets: string[];
  }>;
  discussionQuestion: string;
  bannerCopy: {
    headline: string;
    subhead: string;
    supportingLine: string;
    cta: string;
  };
  hashtags: string[];
}

export interface GuestPostPack {
  editorPitchEmail: string;
  authorBio: string;
  targetPublications: string[];
  contextualBacklinks: string[];
}

export interface ThirdPartyPack {
  canonicalUrlNotice: string;
  recommendedTags: string[];
  subtitle: string;
  readingTimeMinutes: number;
}

export interface GeneratedPost {
  id: string;
  title: string;
  channel: ContentChannel;
  markdown: string;
  createdAt: string;
  params: GenerationParams;
  audit?: AuditResult;
  infographics?: InfographicItem[];
  socialPack?: SocialMediaPack;
  guestPostPack?: GuestPostPack;
  thirdPartyPack?: ThirdPartyPack;
}
