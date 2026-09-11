import { InfographicItem } from '../types.js';

/**
 * Curated design reference links for different infographic visual patterns
 */
export const DESIGN_REFERENCE_LINKS = {
  processFlow: {
    title: 'Canva Technology & Cloud Process Infographic Template',
    url: 'https://www.canva.com/templates/?query=technology-process-infographic',
    notes: 'Horizontal 4-stage pipeline with numbered badges, high-contrast dark card nodes, and gradient connector lines.',
  },
  architecture: {
    title: 'Figma Community Enterprise Architecture & Cloud Flowchart Kit',
    url: 'https://www.figma.com/community/search?model_type=hub_files&q=cloud+architecture+diagram',
    notes: 'Modular bento-grid card layout with cloud identity icons, security boundaries, and directional arrows.',
  },
  comparison: {
    title: 'Canva B2B Enterprise Feature & Decision Matrix Template',
    url: 'https://www.canva.com/templates/?query=comparison-infographic',
    notes: 'Side-by-side 2-column comparative layout with green/red checkmarks and highlighted winning tier.',
  },
  cheatSheet: {
    title: 'Canva Executive Technology Cheat Sheet & Checklist Template',
    url: 'https://www.canva.com/templates/?query=cheat-sheet-infographic',
    notes: 'Compact 4-quadrant summary card with metric callouts, executive bullet points, and QR code to consultation.',
  },
  general: {
    title: 'Figma B2B Technology Infographic & Presentation Asset Pack',
    url: 'https://www.figma.com/community/search?model_type=hub_files&q=technology+infographic',
    notes: 'Clean enterprise aesthetic pairing Deep Navy (#0B192C), Azure Blue (#0078D4), and Cyber Cyan (#00E5FF).',
  }
};

/**
 * Extract 1-2 structured infographic items from generated markdown text
 */
export function extractInfographicsFromMarkdown(
  markdown: string,
  topic: string,
  focusKeyword: string
): InfographicItem[] {
  const infographics: InfographicItem[] = [];

  // Match the Infographic section if present
  const sectionRegex = /##\s+(?:Infographic\s+Concepts|Infographics|Visual\s+Assets)[\s\S]*?(?=(?:##\s+Meta|\n#\s+|$))/i;
  const sectionMatch = markdown.match(sectionRegex);
  const sectionText = sectionMatch ? sectionMatch[0] : markdown;

  // Find ### Infographic 1 and ### Infographic 2
  const infoBlocks = sectionText.split(/###\s+Infographic\s+[12]:?/i);

  if (infoBlocks.length > 1) {
    for (let i = 1; i < infoBlocks.length && i <= 2; i++) {
      const block = infoBlocks[i];
      const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
      
      const rawTitle = lines[0]?.replace(/^[:\s\*\-]+/, '') || `Infographic ${i}: ${topic}`;
      const title = rawTitle.replace(/\*\*/g, '').trim();

      // Extract format & type
      const formatMatch = block.match(/\*\*Format[^\*]*:\*\*\s*([^\n]+)/i);
      const targetFormat = (formatMatch?.[1]?.includes('16:9')
        ? '16:9 Landscape (Blog Header)'
        : formatMatch?.[1]?.includes('4:5')
        ? '4:5 Vertical (Mobile & Pinterest)'
        : '1:1 Square (LinkedIn/Social)') as InfographicItem['targetFormat'];

      // Extract design reference link
      const linkMatch = block.match(/(?:Design\s+Reference|Inspiration\s+Link|Reference\s+Link)[^\n]*:\s*\[?([^\s\]\)]+)\]?(?:\((https?:\/\/[^\s\)]+)\))?/i);
      const refUrl = linkMatch?.[2] || (linkMatch?.[1]?.startsWith('http') ? linkMatch[1] : (i === 1 ? DESIGN_REFERENCE_LINKS.processFlow.url : DESIGN_REFERENCE_LINKS.comparison.url));

      // Extract callout stat
      const calloutMatch = block.match(/\*\*(?:Key\s+Highlight|Key\s+Stat|Key\s+Metric|Callout)[^\*]*:\*\*\s*([^\n]+)/i);
      const keyCallout = calloutMatch ? calloutMatch[1].replace(/\*\*/g, '').trim() : `Enterprise benchmark for ${focusKeyword}`;

      // Extract nodes
      const nodeRegex = /(?:Node|Step|Stage)\s*(\d+)?:?\s*\*?\*?([^\n\*\-]+)\*?\*?\s*-\s*([^\n]+)/gi;
      const nodes: InfographicItem['nodes'] = [];
      let match;
      let nodeIdx = 1;

      while ((match = nodeRegex.exec(block)) !== null && nodes.length < 5) {
        const titleText = match[2]?.replace(/^\[[^\]]+\]\s*/, '').trim() || `Step ${nodeIdx}`;
        const descText = match[3]?.trim() || '';
        
        let iconHint = 'Workflow';
        if (/security|identity|shield|dpdp/i.test(titleText + ' ' + descText)) iconHint = 'ShieldCheck';
        else if (/ai|agent|copilot|model/i.test(titleText + ' ' + descText)) iconHint = 'Cpu';
        else if (/data|audit|compliance|report/i.test(titleText + ' ' + descText)) iconHint = 'FileCheck';
        else if (/cloud|azure|infra|server/i.test(titleText + ' ' + descText)) iconHint = 'Database';
        else if (/team|user|governance/i.test(titleText + ' ' + descText)) iconHint = 'Users';

        nodes.push({
          stepNumber: nodeIdx,
          title: titleText,
          description: descText,
          iconHint,
        });
        nodeIdx++;
      }

      // If no nodes matched regex, parse generic bullet points
      if (nodes.length === 0) {
        const bullets = lines.filter((l) => l.startsWith('- ') && !l.includes('**'));
        bullets.slice(0, 4).forEach((b, idx) => {
          const parts = b.replace(/^- /, '').split(':');
          nodes.push({
            stepNumber: idx + 1,
            title: parts[0]?.trim() || `Step ${idx + 1}`,
            description: parts[1]?.trim() || parts[0]?.trim() || '',
            iconHint: idx === 0 ? 'ShieldCheck' : idx === 1 ? 'Cpu' : idx === 2 ? 'Workflow' : 'FileCheck',
          });
        });
      }

      infographics.push({
        id: `info-${i}-${Date.now()}`,
        title,
        subtitle: i === 1 ? '4-Stage Enterprise Implementation Architecture' : 'Strategic Comparison & Decision Matrix',
        type: i === 1 ? 'process-flow' : 'comparison-matrix',
        targetFormat,
        keyCallout,
        nodes: nodes.length > 0 ? nodes : getDefaultNodes(i, focusKeyword),
        designReference: {
          title: i === 1 ? DESIGN_REFERENCE_LINKS.processFlow.title : DESIGN_REFERENCE_LINKS.comparison.title,
          url: refUrl,
          notes: i === 1 ? DESIGN_REFERENCE_LINKS.processFlow.notes : DESIGN_REFERENCE_LINKS.comparison.notes,
        },
        colorPalette: {
          primary: '#0B192C',
          secondary: '#0078D4',
          accent: '#00E5FF',
          background: '#030712',
        },
      });
    }
  }

  // If none parsed from markdown, generate default tailored 1-2 infographics
  if (infographics.length === 0) {
    return generateDefaultInfographics(topic, focusKeyword);
  }

  return infographics;
}

function getDefaultNodes(index: number, focusKeyword: string) {
  if (index === 1) {
    return [
      { stepNumber: 1, title: 'Discovery & Identity Mapping', description: `Audit all active ${focusKeyword} touchpoints and service principles across your tenant.`, iconHint: 'ShieldCheck' },
      { stepNumber: 2, title: 'Governance & Access Boundaries', description: 'Enforce least privilege access, conditional access policies, and prompt boundaries.', iconHint: 'Cpu' },
      { stepNumber: 3, title: 'Real-Time Telemetry & Monitoring', description: 'Route agent actions to Microsoft Sentinel with automated threat containment.', iconHint: 'Workflow' },
      { stepNumber: 4, title: 'Continuous Compliance & Optimization', description: 'Maintain DPDP and ISO 27001 audit trails verified by Embee Software experts.', iconHint: 'FileCheck' },
    ];
  }
  return [
    { stepNumber: 1, title: 'Manual / Fragmented Approach', description: 'Ad-hoc agent creation with zero visibility, siloed data credentials, and high audit risk.', iconHint: 'Users' },
    { stepNumber: 2, title: 'Centralized Control Plane', description: `Unified governance via ${focusKeyword} with real-time registry and kill-switch capability.`, iconHint: 'Cpu' },
    { stepNumber: 3, title: 'Security & Token Safeguards', description: 'Managed Entra Agent IDs preventing privilege escalation and non-human identity sprawl.', iconHint: 'ShieldCheck' },
    { stepNumber: 4, title: 'Embee Managed Services', description: 'End-to-end partner onboarding, policy enforcement, and 24/7 SOC integration.', iconHint: 'FileCheck' },
  ];
}

/**
 * Generate 2 crisp default infographics tailored to the topic and focus keyword
 */
export function generateDefaultInfographics(topic: string, focusKeyword: string): InfographicItem[] {
  return [
    {
      id: `default-info-1-${Date.now()}`,
      title: `${focusKeyword}: 4-Stage Enterprise Governance Architecture`,
      subtitle: 'From Unmanaged Shadow Agents to Controlled Production Deployment',
      type: 'process-flow',
      targetFormat: '1:1 Square (LinkedIn/Social)',
      keyCallout: 'Reduces enterprise shadow agent risk by up to 84% in multi-cloud environments.',
      nodes: [
        {
          stepNumber: 1,
          title: 'Inventory & Discovery',
          description: 'Catalog all copilots, API keys, and autonomous agent instances across departments.',
          iconHint: 'ShieldCheck',
        },
        {
          stepNumber: 2,
          title: 'Identity & Access Controls',
          description: 'Assign managed Entra Agent IDs with strict conditional access and prompt guardrails.',
          iconHint: 'Cpu',
        },
        {
          stepNumber: 3,
          title: 'Operational Telemetry',
          description: 'Stream audit logs into SIEM/SOC for real-time monitoring of agent reasoning loops.',
          iconHint: 'Workflow',
        },
        {
          stepNumber: 4,
          title: 'Compliance & Audit Signoff',
          description: 'Ensure automated evidence generation for DPDP Act, RBI guidelines, and ISO 27001.',
          iconHint: 'FileCheck',
        },
      ],
      designReference: {
        title: DESIGN_REFERENCE_LINKS.processFlow.title,
        url: DESIGN_REFERENCE_LINKS.processFlow.url,
        notes: DESIGN_REFERENCE_LINKS.processFlow.notes,
      },
      colorPalette: {
        primary: '#0B192C',
        secondary: '#0078D4',
        accent: '#00E5FF',
        background: '#030712',
      },
    },
    {
      id: `default-info-2-${Date.now()}`,
      title: `Ad-Hoc Deployment vs. Embee ${focusKeyword} Framework`,
      subtitle: 'Executive Decision Matrix: Architecture, Security, and Compliance Comparison',
      type: 'comparison-matrix',
      targetFormat: '16:9 Landscape (Blog Header)',
      keyCallout: 'Saves an average of 40+ engineering hours per quarter on audit preparation.',
      nodes: [
        {
          stepNumber: 1,
          title: 'Credential Governance',
          description: 'Ad-hoc: Hardcoded API tokens. Embee: Managed non-human identities with rotation.',
          iconHint: 'ShieldCheck',
        },
        {
          stepNumber: 2,
          title: 'Execution Safeguards',
          description: 'Ad-hoc: Unbounded agent actions. Embee: Dual-custody approval workflows.',
          iconHint: 'Workflow',
        },
        {
          stepNumber: 3,
          title: 'Cost & Token Visibility',
          description: 'Ad-hoc: Opaque capacity charges. Embee: Per-department cost attribution.',
          iconHint: 'TrendingUp',
        },
        {
          stepNumber: 4,
          title: 'Enterprise Support',
          description: 'Ad-hoc: Internal firefighting. Embee: Certified Microsoft Frontier Partner SLA.',
          iconHint: 'Users',
        },
      ],
      designReference: {
        title: DESIGN_REFERENCE_LINKS.comparison.title,
        url: DESIGN_REFERENCE_LINKS.comparison.url,
        notes: DESIGN_REFERENCE_LINKS.comparison.notes,
      },
      colorPalette: {
        primary: '#0B192C',
        secondary: '#0078D4',
        accent: '#00E5FF',
        background: '#030712',
      },
    },
  ];
}
