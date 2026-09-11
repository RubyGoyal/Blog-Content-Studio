export interface InternalLinkItem {
  title: string;
  url: string;
  category: 'Solutions' | 'HR / Octane HRMS' | 'ERP / SAP' | 'Contact' | 'Blog Posts' | 'Case Studies';
  description?: string;
  keywords?: string[];
}

export const EMBEE_INTERNAL_LINKS: InternalLinkItem[] = [
  // SOLUTION PAGES
  {
    title: 'Windows 365 Cloud PC',
    url: 'https://embee.co.in/solutions/windows-365/',
    category: 'Solutions',
    description: 'Cloud PC streaming, hybrid desktop virtualization, virtual desktop solutions',
    keywords: ['windows 365', 'cloud pc', 'vdi', 'desktop virtualization']
  },
  {
    title: 'Microsoft 365 for Enterprise',
    url: 'https://embee.co.in/solutions/microsoft-365-for-enterprise/',
    category: 'Solutions',
    description: 'Enterprise modern workplace, Office 365 enterprise, E3/E5 plans',
    keywords: ['microsoft 365', 'm365 enterprise', 'office 365', 'e5', 'e7']
  },
  {
    title: 'Microsoft 365 Copilot',
    url: 'https://embee.co.in/solutions/microsoft-365-copilot/',
    category: 'Solutions',
    description: 'Enterprise generative AI assistant, Copilot Business vs Enterprise, Work IQ',
    keywords: ['copilot', 'microsoft copilot', 'ai assistant', 'cowork', 'copilot credits']
  },
  {
    title: 'Microsoft 365 Managed Services',
    url: 'https://embee.co.in/solutions/microsoft-365-managed-services/',
    category: 'Solutions',
    description: 'Managed support, tenant management, deployment, security and adoption',
    keywords: ['microsoft 365 partner', 'managed m365', 'm365 service provider']
  },
  {
    title: 'Managed IT Services',
    url: 'https://embee.co.in/solutions/managed-it-services/',
    category: 'Solutions',
    description: 'Proactive MSP operations, 24/7 IT infrastructure management, remote support',
    keywords: ['managed it services', 'msp', 'it infrastructure management', 'remote it support']
  },
  {
    title: 'Identity and Access Management',
    url: 'https://embee.co.in/solutions/identity-and-access-management/',
    category: 'Solutions',
    description: 'Microsoft Entra ID, Azure AD, SSO, MFA, Conditional Access, Entra Agent ID',
    keywords: ['identity and access management', 'iam', 'entra id', 'azure ad', 'sso', 'mfa']
  },
  {
    title: 'Cloud Security Services',
    url: 'https://embee.co.in/solutions/cloud-security-services/',
    category: 'Solutions',
    description: 'Cyber Defense Center, SOC, Zero Trust, DPDP compliance safeguards, CSPM',
    keywords: ['cloud security services', 'custom cybersecurity solutions', 'cybersecurity', 'soc']
  },
  {
    title: 'Azure Cloud Services',
    url: 'https://embee.co.in/solutions/azure-cloud-services/',
    category: 'Solutions',
    description: 'Azure cloud migration, Microsoft Fabric, Azure PaaS, AI Foundry, cost governance',
    keywords: ['azure cloud services', 'azure paas', 'microsoft fabric', 'azure ai', 'cloud migration']
  },

  // HR / OCTANE HRMS PAGES
  {
    title: 'Octane HRMS',
    url: 'https://embee.co.in/octane-hrms/',
    category: 'HR / Octane HRMS',
    description: 'Comprehensive Indian HRMS suite, attendance, leave, performance & workforce analytics',
    keywords: ['octane hrms', 'hrms software india', 'hr analytics', 'human resource management']
  },
  {
    title: 'Payroll Software',
    url: 'https://embee.co.in/payroll-software/',
    category: 'HR / Octane HRMS',
    description: 'Indian statutory payroll compliance, 50% wage rule, Labour Codes 2025, PF & gratuity',
    keywords: ['payroll software', '50% wage rule', 'labour codes', 'pf gratuity calculation']
  },
  {
    title: 'Employee Self-Service Portal',
    url: 'https://embee.co.in/employee-self-service-portal/',
    category: 'HR / Octane HRMS',
    description: 'Employee ESS portal, digital payslips, tax declarations, leave requests',
    keywords: ['employee self-service portal', 'ess portal', 'employee self service']
  },
  {
    title: 'Recruitment and Onboarding Software',
    url: 'https://embee.co.in/recruitment-onboarding-software/',
    category: 'HR / Octane HRMS',
    description: 'End-to-end recruitment channels, applicant tracking, digital joining workflows',
    keywords: ['recruitment onboarding software', 'recruitment channels', 'talent acquisition']
  },

  // ERP / SAP PAGES
  {
    title: 'ERP Portfolio (Hub)',
    url: 'https://embee.co.in/erp/',
    category: 'ERP / SAP',
    description: 'Embee Software complete SAP & ERP practice, ERP for manufacturing & SMEs',
    keywords: ['erp portfolio', 'erp', 'sap erp', 'manufacturing erp']
  },
  {
    title: 'SAP Business One',
    url: 'https://embee.co.in/erp/sap-business-one/',
    category: 'ERP / SAP',
    description: 'ERP for SMEs, GST & e-invoicing ready, inventory, purchasing, sales & finance',
    keywords: ['sap business one', 'sap b1', 'erp for sme']
  },
  {
    title: 'SAP S/4HANA Cloud ERP',
    url: 'https://embee.co.in/erp/sap-s4hana-cloud-erp/',
    category: 'ERP / SAP',
    description: 'Flagship enterprise cloud ERP, in-memory SAP HANA, RISE with SAP, Clean Core',
    keywords: ['sap s/4hana', 's4hana cloud erp', 'sap s4hana', 'rise with sap', 'sap clean core']
  },
  {
    title: 'SAP Business One Implementation Services',
    url: 'https://embee.co.in/erp/sap-business-one-implementation-services/',
    category: 'ERP / SAP',
    description: 'Certified implementation partner in India, customization, deployment & support',
    keywords: ['sap business one implementation services', 'sap partner in india', 'sap implementation partner']
  },

  // CONTACT
  {
    title: 'Contact Us',
    url: 'https://embee.co.in/contact-us/',
    category: 'Contact',
    description: 'Consultation booking, free readiness assessment, expert advisory',
    keywords: ['contact embee software', 'book consultation', 'assessment']
  },

  // BLOG POSTS
  {
    title: 'Microsoft Sentinel vs Third-Party SIEM',
    url: 'https://embee.co.in/blog/microsoft-sentinel-vs-third-party-siem/',
    category: 'Blog Posts',
    description: 'Buyer guide for Indian SOCs comparing Sentinel, Splunk, QRadar and Elastic',
    keywords: ['microsoft sentinel', 'siem', 'splunk', 'soc']
  },
  {
    title: 'DPDP Rules 2025 Compliance Roadmap',
    url: 'https://embee.co.in/blog/dpdp-rules-2025-compliance-roadmap/',
    category: 'Blog Posts',
    description: 'Compliance roadmap for India DPDP Act, Consent Manager & 250 crore penalty risk',
    keywords: ['dpdp rules', 'dpdp act', 'data privacy india', 'consent manager']
  },
  {
    title: 'Copilot Control System Explained',
    url: 'https://embee.co.in/blog/copilot-control-system-explained/',
    category: 'Blog Posts',
    description: 'Governing M365 Copilot, Copilot Credits, preventing oversharing & Purview',
    keywords: ['copilot control system', 'copilot credits', 'copilot agent governance']
  },
  {
    title: 'Microsoft 365 Copilot Business vs Enterprise',
    url: 'https://embee.co.in/blog/microsoft-365-copilot-business-vs-enterprise/',
    category: 'Blog Posts',
    description: 'Pricing comparison, 300-seat cap, SKUs and plan selection for SMB vs Enterprise',
    keywords: ['copilot business vs enterprise', 'copilot pricing', 'copilot tiers']
  },
  {
    title: 'Work IQ, Fabric IQ, Foundry IQ Explained',
    url: 'https://embee.co.in/blog/work-iq-fabric-iq-foundry-iq-explained/',
    category: 'Blog Posts',
    description: 'Microsoft enterprise AI intelligence layer grounded in work and business data',
    keywords: ['work iq', 'fabric iq', 'foundry iq', 'enterprise ai layer']
  },
  {
    title: 'Microsoft Fabric Cost Optimization',
    url: 'https://embee.co.in/blog/microsoft-fabric-cost-optimization-capacity-units/',
    category: 'Blog Posts',
    description: 'Managing Capacity Units, bursting, smoothing, throttling and F SKU right-sizing',
    keywords: ['microsoft fabric cost optimization', 'capacity units', 'f sku', 'bursting smoothing']
  },
  {
    title: 'Azure AI Foundry (Enterprise AI Agents)',
    url: 'https://embee.co.in/blog/azure-ai-foundry-enterprise-ai-agents/',
    category: 'Blog Posts',
    description: 'Building and governing AI agents on Azure with Entra Agent ID & Model Context Protocol',
    keywords: ['azure ai foundry', 'microsoft foundry', 'ai agents', 'entra agent id']
  },
  {
    title: 'Windows 10 End of Support Migration',
    url: 'https://embee.co.in/blog/windows-10-end-of-support-migration/',
    category: 'Blog Posts',
    description: 'Migration options for Indian enterprises: Windows 11, Cloud PC and ESU bridge',
    keywords: ['windows 10 end of support', 'windows 11 migration', 'windows 365 cloud pc']
  },
  {
    title: 'Greenfield vs Brownfield vs Bluefield (S/4HANA)',
    url: 'https://embee.co.in/blog/greenfield-vs-brownfield-vs-bluefield-s4hana/',
    category: 'Blog Posts',
    description: 'Selective Data Transition, system conversion and clean slate S/4HANA approaches',
    keywords: ['greenfield vs brownfield vs bluefield', 'selective data transition', 's4hana migration']
  },
  {
    title: 'SAP Clean Core Strategy',
    url: 'https://embee.co.in/blog/sap-clean-core-strategy/',
    category: 'Blog Posts',
    description: 'Reducing custom ABAP code with SAP BTP extensibility before S/4HANA migration',
    keywords: ['sap clean core strategy', 'clean core', 'sap btp extensibility', 'custom code']
  },
  {
    title: 'SAP Cloud ERP Private Edition (RISE rebrand)',
    url: 'https://embee.co.in/blog/sap-cloud-erp-private-edition-rise-rebrand/',
    category: 'Blog Posts',
    description: 'What the RISE with SAP rebrand means for contracts, FUE licensing & AI unbundling',
    keywords: ['rise with sap rebrand', 'sap cloud erp private edition', 'fue licensing']
  },
  {
    title: 'SAP Joule Enterprise AI Copilot Guide',
    url: 'https://embee.co.in/blog/sap-joule-enterprise-ai-copilot-guide/',
    category: 'Blog Posts',
    description: 'SAP Joule agents, Joule Studio, and bidirectional integration with Microsoft 365 Copilot',
    keywords: ['sap joule agents', 'joule studio', 'sap business ai']
  },
  {
    title: 'SAP Business One vs S/4HANA',
    url: 'https://embee.co.in/blog/sap-business-one-vs-s4hana/',
    category: 'Blog Posts',
    description: 'Comparison of SME ERP vs Enterprise ERP, pricing, deployment and upgrade paths',
    keywords: ['sap business one vs s/4hana', 'sap b1 vs s4hana', 'erp comparison']
  },
  {
    title: 'New Labour Codes 2025 Payroll Restructuring',
    url: 'https://embee.co.in/blog/new-labour-codes-2025-payroll-restructuring/',
    category: 'Blog Posts',
    description: 'The 50% wage rule under India Code on Wages, PF, gratuity and take-home recalculation',
    keywords: ['50% wage rule', 'new labour codes payroll', 'code on wages 2025']
  },
  {
    title: 'SAP LeanIX on Azure (migration & AI governance)',
    url: 'https://embee.co.in/blog/sap-leanix-azure-cloud-migration-ai-governance/',
    category: 'Blog Posts',
    description: 'Living enterprise architecture map to de-risk Azure migration and govern AI sprawl',
    keywords: ['sap leanix', 'enterprise architecture', 'azure migration', 'ai governance']
  },

  // CASE STUDIES
  {
    title: 'Microsoft Sentinel SOC for an Airport',
    url: 'https://embee.co.in/case-studies/microsoft-sentinel-soc-airport-cyber-defense/',
    category: 'Case Studies',
    description: 'Cutting mean time to detect to <15 mins with unified Microsoft Sentinel SOC',
    keywords: ['airport soc case study', 'microsoft sentinel case study', 'cyber defense']
  },
  {
    title: 'AI-Ready Azure Foundation for a Healthcare Provider',
    url: 'https://embee.co.in/case-studies/ai-ready-azure-foundation-healthcare-provider/',
    category: 'Case Studies',
    description: 'Cost-governed Azure Enterprise Agreement foundation for scalable AI initiatives',
    keywords: ['healthcare azure case study', 'ai-ready azure foundation', 'azure cost governance']
  },
  {
    title: 'SAP S/4HANA Cloud Migration for Tier-1 Auto Component Maker',
    url: 'https://embee.co.in/case-studies/sap-s4hana-manufacturing-migration/',
    category: 'Case Studies',
    description: 'Selective Data Transition to SAP S/4HANA with Clean Core for discrete manufacturing',
    keywords: ['sap case study', 's4hana migration', 'manufacturing case study', 'clean core']
  },
  {
    title: 'Octane HRMS & Payroll Automation for 15,000+ Retail Associates',
    url: 'https://embee.co.in/case-studies/octane-hrms-retail-workforce-automation/',
    category: 'Case Studies',
    description: 'Zero-error payroll processing and biometric attendance integration across 120 stores',
    keywords: ['octane hrms case study', 'payroll automation case study', 'retail workforce']
  }
];
