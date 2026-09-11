export interface SampleTopic {
  id: string;
  category: 'Microsoft & Cloud' | 'Cybersecurity & DPDP' | 'SAP & ERP' | 'HR & Workforce';
  title: string;
  focusKeyword: string;
  secondaryKeywords: string[];
  suggestedSolutionLink: string;
  defaultChannel: 'embee-blog' | 'linkedin' | 'guest-post' | 'third-party';
  summary: string;
}

export const SAMPLE_TOPICS: SampleTopic[] = [
  {
    id: 'agent-365',
    category: 'Microsoft & Cloud',
    title: 'Agent 365: Microsoft Control Plane for Enterprise AI Agents',
    focusKeyword: 'Agent 365',
    secondaryKeywords: ['Microsoft Agent 365', 'AI agent governance', 'Entra Agent ID', 'agent registry', 'shadow AI'],
    suggestedSolutionLink: 'https://embee.co.in/solutions/identity-and-access-management/',
    defaultChannel: 'embee-blog',
    summary: 'How IT leaders can discover, govern, and secure AI agents with Entra Agent ID, Conditional Access, and Defender.'
  },
  {
    id: 'copilot-cowork',
    category: 'Microsoft & Cloud',
    title: 'Copilot Cowork Is GA: Agentic AI for Multi-Step Work in Microsoft 365',
    focusKeyword: 'Copilot Cowork',
    secondaryKeywords: ['Microsoft 365 Copilot', 'agentic AI', 'Copilot Credits', 'Work IQ', 'Copilot Cowork pricing'],
    suggestedSolutionLink: 'https://embee.co.in/solutions/microsoft-365-copilot/',
    defaultChannel: 'linkedin',
    summary: 'The shift from AI that drafts to AI that completes multi-step tasks across enterprise systems, and why your first rollout should be boring.'
  },
  {
    id: 'fabric-cost',
    category: 'Microsoft & Cloud',
    title: 'Microsoft Fabric Cost Optimization: Managing Capacity Units in 2026',
    focusKeyword: 'Microsoft Fabric cost optimization',
    secondaryKeywords: ['fabric capacity units', 'fabric f sku', 'bursting smoothing', 'fabric reserved capacity', 'onelake storage cost'],
    suggestedSolutionLink: 'https://embee.co.in/solutions/azure-cloud-services/',
    defaultChannel: 'embee-blog',
    summary: 'Why Fabric bills on shared compute pools, how bursting and smoothing work, and the 4 levers to cut compute charges by 50%+.'
  },
  {
    id: 'dpdp-may-2027',
    category: 'Cybersecurity & DPDP',
    title: 'Preparing for the DPDP May 2027 Deadline: An Enterprise Action Plan',
    focusKeyword: 'DPDP May 2027 deadline',
    secondaryKeywords: ['DPDP Rules 2025', 'consent manager', 'data fiduciary obligations', '250 crore penalty', 'data discovery'],
    suggestedSolutionLink: 'https://embee.co.in/solutions/cloud-security-services/',
    defaultChannel: 'embee-blog',
    summary: 'Why India DPDP compliance is an access and identity governance program with fixed milestones, not just legal paperwork.'
  },
  {
    id: 'non-human-identity',
    category: 'Cybersecurity & DPDP',
    title: 'Non-Human Identity Security: The Gap Agentic AI Opens in 2026',
    focusKeyword: 'non-human identity',
    secondaryKeywords: ['NHI security', 'machine identity', 'AI agent security', 'service account security', 'Entra Agent ID'],
    suggestedSolutionLink: 'https://embee.co.in/solutions/identity-and-access-management/',
    defaultChannel: 'guest-post',
    summary: 'Why non-human identities outnumber human accounts 10:1 and how to govern AI agents before attackers exploit them.'
  },
  {
    id: 'sap-clean-core',
    category: 'SAP & ERP',
    title: 'SAP Clean Core Strategy: Reducing Custom Code Before S/4HANA Migration',
    focusKeyword: 'SAP Clean Core',
    secondaryKeywords: ['SAP BTP extensibility', 'custom code remediation', 'S/4HANA migration', 'clean core pillars', 'technical debt'],
    suggestedSolutionLink: 'https://embee.co.in/erp/sap-s4hana-cloud-erp/',
    defaultChannel: 'embee-blog',
    summary: 'How to keep the ERP core standard and build extensions on SAP BTP to preserve upgrade safety and enable SAP Joule AI.'
  },
  {
    id: 'greenfield-brownfield-bluefield',
    category: 'SAP & ERP',
    title: 'Greenfield vs Brownfield vs Bluefield: Choosing Your S/4HANA Migration Path',
    focusKeyword: 'Greenfield vs Brownfield vs Bluefield',
    secondaryKeywords: ['selective data transition', 'system conversion sap', 'new implementation sap', 'sap ecc deadline', 'clean core'],
    suggestedSolutionLink: 'https://embee.co.in/erp/sap-s4hana-cloud-erp/',
    defaultChannel: 'third-party',
    summary: 'Comparative analysis of the 3 S/4HANA migration paths with ISG adoption data, cost multipliers, and governance risk factors.'
  },
  {
    id: '50-percent-wage-rule',
    category: 'HR & Workforce',
    title: 'The 50% Wage Rule: A Payroll Restructuring Guide for Indian Employers',
    focusKeyword: '50% wage rule',
    secondaryKeywords: ['new labour codes payroll', 'code on wages 2025', 'CTC restructuring', 'PF gratuity recalculation', 'HRMS payroll'],
    suggestedSolutionLink: 'https://embee.co.in/payroll-software/',
    defaultChannel: 'embee-blog',
    summary: 'How India Code on Wages impacts basic pay, provident fund, gratuity liability, and employee take-home pay.'
  },
  {
    id: 'hr-analytics-india',
    category: 'HR & Workforce',
    title: 'HR Analytics in India: How Data-Driven People Decisions Transform Workforce Management',
    focusKeyword: 'HR analytics',
    secondaryKeywords: ['people analytics', 'workforce analytics', 'octane hrms', 'attrition prediction', 'employee retention'],
    suggestedSolutionLink: 'https://embee.co.in/octane-hrms/',
    defaultChannel: 'linkedin',
    summary: 'Four stages of HR analytics (descriptive to prescriptive) and practical examples from Bengaluru IT and Pune manufacturing.'
  }
];
