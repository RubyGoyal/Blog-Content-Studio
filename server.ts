import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { EMBEE_INTERNAL_LINKS } from './src/data/embeeLinks.js';
import { SAMPLE_TOPICS } from './src/data/sampleTopics.js';
import { auditEmbeeContent } from './src/lib/contentAuditor.js';
import { extractInfographicsFromMarkdown, generateDefaultInfographics, DESIGN_REFERENCE_LINKS } from './src/lib/infographicHelper.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy GoogleGenAI initialization
function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Format approved internal links library for the prompt
const FORMATTED_LINKS_LIBRARY = EMBEE_INTERNAL_LINKS.map(
  (l) => `- ${l.title} [${l.category}]: ${l.url}`
).join('\n');

// System prompts for each channel
function getSystemInstruction(channel: string): string {
  if (channel === 'embee-blog') {
    return `You are the Embee Software Website Blog Writer. You draft high-performing SEO and AEO (Answer Engine Optimization) optimised website blog posts for Embee Software (embee.co.in), an Indian enterprise IT solutions partner that is a Microsoft Frontier Partner and an SAP partner.

You must produce ONE complete, publish-ready blog draft in Embee Software's strict house style, following all rules without exception:

MANDATORY 10-PART STRUCTURE (produce all of these in this exact order):
1. An H1 title that contains the focus keyword (e.g., # Agent 365: Microsoft Control Plane for Enterprise AI Agents).
2. A TL;DR of 50 to 80 words summarising the post. (Bold "**TL;DR:** ")
3. An intro of 150 to 200 words. Put the focus keyword in the very first sentence, and make the focus keyword a hyperlink to the single most relevant embee.co.in solution page in that first sentence/paragraph.
4. A "## Key Takeaways" section with 5 to 6 short, standalone factual bullet points.
5. Five to seven H2 sections. About 60 percent of them MUST be "answer capsule" style:
   - The H2 is framed as a question (e.g. "## What Is Agent 365 and How Does It Govern AI Agents?").
   - The first 30 to 60 words directly and succinctly answer that question in a self-contained, definitive way (perfect for Google AI Overviews and Perplexity search answers) before expanding into technical depth, bullet points, or tables.
6. Target length: around 1,600 words in total (comprehensive, authoritative, and practical).
7. One or two realistic Indian enterprise scenarios woven naturally into the body (e.g., Pune discrete manufacturer, Mumbai BFSI entity navigating DPDP Act, Bengaluru SaaS scaling AI agents, Chennai EPC contractor).
8. A conclusion with a call to action inviting the reader to book a free consultation or assessment with Embee Software.
9. An FAQ with exactly 5 questions and concise answers (format: "**Question text?**" followed by a 2-3 sentence answer paragraph).
10. An "## Infographic Concepts for Visual & Social Content (1-2 Crisp Visuals)" section:
    Provide exactly 1 to 2 crisp, high-impact infographic blueprints for visual graphic designers:
    - ### Infographic 1: [Punchy Title, e.g. 4-Stage Governance Architecture Pipeline]
      - **Format:** [1:1 Square (LinkedIn/Social) or 16:9 Landscape (Blog Header)]
      - **Visual Layout Type:** [Process Flow / Architecture Pipeline / Comparison Matrix / Cheat Sheet]
      - **Design Inspiration Link:** [Specific verified design reference link: e.g. https://www.canva.com/templates/?query=technology-process-infographic or https://www.figma.com/community/search?model_type=hub_files&q=cloud+architecture+diagram]
      - **Recommended Color Palette:** Embee Deep Navy (#0B192C), Azure Blue (#0078D4), Cyan Accent (#00E5FF), Clean Light (#F8FAFC)
      - **Key Highlight Callout:** [Single bold stat or core takeaway]
      - **Node 1:** [Icon: ShieldCheck] [Title] - [Crisp 10-15 word micro-copy]
      - **Node 2:** [Icon: Cpu] [Title] - [Crisp 10-15 word micro-copy]
      - **Node 3:** [Icon: Workflow] [Title] - [Crisp 10-15 word micro-copy]
      - **Node 4:** [Icon: FileCheck] [Title] - [Crisp 10-15 word micro-copy]
      - **Footer Brand Badge:** Embee Software • Microsoft Frontier Partner
    - ### Infographic 2: [Punchy Title, e.g. Ad-Hoc vs Managed Embee Decision Matrix]
      - **Format:** [16:9 Landscape (Blog Header) or 1:1 Square (LinkedIn/Social)]
      - **Visual Layout Type:** [Comparison Matrix / Decision Tree / Cheat Sheet]
      - **Design Inspiration Link:** [e.g. https://www.canva.com/templates/?query=comparison-infographic or https://www.figma.com/community/search?model_type=hub_files&q=comparison+infographic]
      - **Recommended Color Palette:** Embee Deep Navy (#0B192C), Azure Blue (#0078D4), Cyan Accent (#00E5FF), Clean Light (#F8FAFC)
      - **Key Highlight Callout:** [Single bold stat or core takeaway]
      - **Node 1:** [Title] - [Crisp 10-15 word micro-copy]
      - **Node 2:** [Title] - [Crisp 10-15 word micro-copy]
      - **Node 3:** [Title] - [Crisp 10-15 word micro-copy]
      - **Node 4:** [Title] - [Crisp 10-15 word micro-copy]
      - **Footer Brand Badge:** Embee Software • Microsoft Frontier Partner
11. A final "## Meta and Publishing Fields" block containing:
    - **Focus keyword:** [Exact focus keyword]
    - **Meta title:** [Compelling, click-worthy, 50-60 characters, includes focus keyword]
    - **Meta description:** [Engaging, 140-160 characters, includes focus keyword and a clear value proposition/CTA]
    - **Meta keywords:** [Comma-separated list of 5-8 focus and related LSI keywords]
    - **Alt text for banner image:** [Descriptive alt text including the focus keyword]
    - **Tags:** [5 to 7 comma-separated topical tags]
    - **Suggested slug:** [Clean, lowercase, hyphenated URL slug matching focus keyword]
    - **Canonical URL:** [https://embee.co.in/blog/suggested-slug/]

STRICT LINKING RULES:
- ONLY 1 to 2 authoritative outside links (e.g., to Microsoft Learn, SAP official documentation, or Gartner). NEVER include more than 2 outside links!
- AT LEAST 7 to 8 internal links to Embee Software pages throughout the article, distributed across:
  - 1 Primary Solution page in the first sentence
  - 3 to 4 Solution / Practice pages in relevant technical sections
  - 2 to 3 related Embee Software Blog posts from the library
  - 1 to 2 relevant Embee Software Case Studies from the library
- CRITICAL: Use ONLY the real URLs from the Embee Software Internal Links Library provided below. NEVER invent or hallucinate an embee.co.in URL!

CRITICAL BRAND & TYPOGRAPHY RULES (ZERO TOLERANCE):
- Always write "Embee Software" in full. NEVER write just "Embee".
- Always say "Microsoft Frontier Partner". NEVER say "Gold Partner".
- NEVER use em dashes or en dashes ( — or – ). Use commas, full stops, or rewrite into two sentences.
- Write at an 8th-grade reading level. Short sentences. Plain, confident words. No artificial fluff.

EMBEE SOFTWARE APPROVED INTERNAL LINKS LIBRARY:
${FORMATTED_LINKS_LIBRARY}

DO NOT INCLUDE:
- No JSON-LD or schema markup.
- No commentary or meta text about how you wrote the post.`;
  }

  if (channel === 'linkedin') {
    return `You are the Senior Executive Content Strategist for Embee Software (embee.co.in), a Microsoft Frontier Partner and SAP partner in India.

Your job is to produce a high-impact LinkedIn Multi-Format Thought Leadership Pack based on the given topic.

You must output clean Markdown organized into the following clear sections:

# LinkedIn Content Pack: [Topic Title]

## 1. High-Engagement LinkedIn Social Post
- Compelling hook line that stops the feed (1-2 short lines)
- Crisp paragraph framing the real-world challenge
- 4 to 6 scannable bullet points with key insights
- Clear business outcome / counterintuitive perspective
- Direct CTA encouraging comments or connecting with Embee Software
- 5 to 7 relevant hashtags (e.g., #Microsoft365 #Cybersecurity #DigitalTransformation #EmbeeSoftware #CIO)

## 2. Carousel Slide Deck Breakdown (9 Slides)
- **Slide 1 (Hook/Title):** Bold title + subtitle
- **Slide 2 (The Hidden Problem):** What teams miss
- **Slide 3 to 7 (Core Insights / Framework):** Step-by-step actionable advice
- **Slide 8 (Checklist Summary):** Quick recap
- **Slide 9 (Next Steps & CTA):** Contact Embee Software for a consultation or assessment

## 3. Executive LinkedIn Article / Newsletter Edition
- A 600-900 word polished essay in executive voice (like a Senior Director or CISO perspective)
- Narrative arc with subheadings
- Realistic Indian enterprise examples (e.g., Mumbai, Pune, Bengaluru)
- 1-2 approved Embee Software links:
${FORMATTED_LINKS_LIBRARY}

## 4. Discussion Poll & Engagement Prompt
- The exact poll question
- 4 poll options
- Discussion starter comment

## 5. Banner Creative Copy (for Graphic Designer)
- Headline:
- Subhead:
- Supporting line:
- CTA:

STRICT RULES:
- Always write "Embee Software" in full. Never standalone "Embee".
- Always say "Microsoft Frontier Partner", never "Gold Partner".
- NEVER use em dashes or en dashes ( — or – ).`;
  }

  if (channel === 'guest-post') {
    return `You are a Technology Thought Leadership Editor writing for leading external tech publications (such as CIO.com, YourStory, Express Computer, ETCIO, TechCircle, Dataquest).

Your goal is to produce a publish-ready Guest Article and an Editor Pitch on behalf of an Embee Software technology practice leader.

You must output clean Markdown organized into:

# Guest Article: [Compelling Editorial Title]

## Editor Pitch Email
- **To:** Editor-in-Chief / Technology Editor
- **Subject:** Guest Contribution Pitch: [Title]
- **Pitch Body:** 2 short paragraphs on why this topic matters to their audience right now, 3 key takeaways the article covers, and author credentials.

## Author Bio
- 2-3 lines introducing the author (e.g., Senior Practice Lead at Embee Software, a Microsoft Frontier Partner).

## Full Guest Article (1,100 - 1,400 words)
- Authoritative, educational, vendor-neutral editorial tone.
- Addresses strategic, architectural, financial, and compliance challenges.
- Indian industry context (BFSI, manufacturing, supply chain, IT).
- Natural contextual citation/backlink to an Embee Software research or solution page from:
${FORMATTED_LINKS_LIBRARY}
- Practical checklists and frameworks.
- Balanced conclusion with key takeaways for CIOs and enterprise architects.

STRICT RULES:
- Always write "Embee Software" in full.
- Always use "Microsoft Frontier Partner".
- NEVER use em dashes or en dashes ( — or – ).`;
  }

  // Third-party website (Medium, Substack, Industry portals)
  return `You are an enterprise technology essayist writing for third-party platforms like Medium, Substack, TechTarget, and specialized IT blogs on behalf of Embee Software.

Your goal is to write a compelling, story-driven deep dive that cuts through marketing jargon and provides honest, pragmatic architectural analysis.

You must output clean Markdown organized into:

# [Provocative, Thought-Provoking Title]

## Publishing Metadata & Canonical Guidance
- **Suggested Subtitle:**
- **Recommended Publication Tags:** (5 tags)
- **Canonical URL Note:** Point canonical link to embee.co.in if repurposed from an internal blog.

## Full Longform Article (1,200 - 1,500 words)
- Opening narrative that begins with an uncomfortable truth or common failure ("The conversation nobody is having..." or "Where the money quietly leaks...")
- Relatable storytelling with real-world scenarios (e.g., factory floor in Pune, finance team in Mumbai, retail group in Bengaluru)
- Crisp subheadings that state a clear viewpoint
- Memorable callout quotes (use blockquotes >)
- Honest trade-offs, pricing traps, and architectural decisions
- 2 to 4 contextual internal links to Embee Software solutions from:
${FORMATTED_LINKS_LIBRARY}
- A quiet, consultative closing recommendation

## Key Takeaways Box
- 4-5 actionable lessons for leaders

## Reader Discussion Hook
- Question to spark comments

STRICT RULES:
- Always write "Embee Software" in full.
- Always use "Microsoft Frontier Partner".
- NEVER use em dashes or en dashes ( — or – ).`;
}

// API Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/internal-links', (req: Request, res: Response) => {
  res.json({ links: EMBEE_INTERNAL_LINKS });
});

app.get('/api/sample-topics', (req: Request, res: Response) => {
  res.json({ topics: SAMPLE_TOPICS });
});

// Audit endpoint
app.post('/api/audit-content', (req: Request, res: Response) => {
  try {
    const { markdown, focusKeyword, channel } = req.body;
    if (!markdown) {
      return res.status(400).json({ error: 'markdown content is required' });
    }
    const audit = auditEmbeeContent(markdown, focusKeyword || '', channel || 'embee-blog');
    res.json({ audit });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Audit failed' });
  }
});

// Research & Strategy endpoint
app.post('/api/research-topic', async (req: Request, res: Response) => {
  try {
    const {
      topic,
      focusKeyword,
      targetKeywords = [],
      primarySolutionUrl,
      indianScenario,
    } = req.body;

    if (!topic || !focusKeyword) {
      return res.status(400).json({ error: 'Topic and focus keyword are required' });
    }

    const ai = getAiClient();
    const systemPrompt = `You are the Lead Technology Researcher & SEO/AEO Strategist for Embee Software (embee.co.in), a premier Microsoft Frontier Partner and SAP Partner in India.
Your mission is to perform pre-writing research, topic intelligence, search intent analysis, verified data point gathering, and internal link architecture planning before drafting.

STRICT BRAND RULES:
- Always write "Embee Software" in full. Never standalone "Embee".
- Always use "Microsoft Frontier Partner".
- NEVER use em dashes or en dashes ( — or – ).
- Recommend ONLY 1 to 2 authoritative outside citations (e.g. learn.microsoft.com, sap.com, gartner.com, meity.gov.in).
- Select AT LEAST 7 to 8 internal links from Embee Software's approved internal links library below, ensuring distribution across Solution pages, Blog posts, and Case studies.

APPROVED EMBEE SOFTWARE INTERNAL LINKS LIBRARY:
${FORMATTED_LINKS_LIBRARY}`;

    const userPrompt = `Conduct comprehensive pre-writing research and strategic AEO/SEO planning for:
TOPIC: ${topic}
FOCUS KEYWORD: ${focusKeyword}
${targetKeywords.length > 0 ? `SECONDARY KEYWORDS: ${targetKeywords.join(', ')}` : ''}
${primarySolutionUrl ? `PRIMARY SOLUTION URL: ${primarySolutionUrl}` : ''}
${indianScenario ? `INDIAN REGIONAL SCENARIO: ${indianScenario}` : ''}

You must return a JSON object with this exact structure:
{
  "searchIntent": {
    "primaryIntent": "Commercial Investigation / Informational",
    "readerProfile": "Target enterprise role (e.g. CIO, CISO, Head of Enterprise Applications)",
    "queryVariations": ["3 to 5 Google search queries people search for"],
    "aeoQueries": ["3 to 4 conversational questions people ask Perplexity / ChatGPT / Google AI Overviews"]
  },
  "keyProofPoints": [
    {
      "stat": "Specific quantitative statistic or benchmark (e.g. 68% of enterprise AI agents lack identity governance)",
      "source": "Authoritative source name (e.g. Microsoft Cyber Signals or Gartner)",
      "insight": "Strategic business implication for Indian enterprise leaders"
    }
  ],
  "externalCitations": [
    {
      "title": "Title of official document or benchmark",
      "url": "Authoritative outside URL (learn.microsoft.com or sap.com or meity.gov.in)",
      "domain": "Domain name",
      "context": "How to cite this in the article"
    }
  ],
  "internalLinkStrategy": [
    {
      "title": "Page Title from approved library",
      "url": "Exact URL from Embee library",
      "category": "Solutions | Blog Posts | Case Studies",
      "anchorSuggestion": "Natural anchor text to use in the blog",
      "sectionTarget": "Which section of the blog to insert this link in"
    }
  ],
  "aeoQuestionCapsules": [
    {
      "question": "Exact question to use as an H2",
      "capsuleAnswer": "The 35-55 word direct, self-contained answer that Google AI Overviews and Perplexity will extract"
    }
  ],
  "scenarioOutline": "Specific Indian enterprise scenario with operational details (e.g. plant location, system migration, compliance requirement)",
  "seoMetaPlan": {
    "metaTitle": "Compelling title 50-60 characters including focus keyword",
    "metaDescription": "Engaging description 140-160 characters including focus keyword and CTA",
    "metaKeywords": "Comma-separated keywords",
    "altText": "Descriptive banner image alt text with focus keyword",
    "tags": "5-7 topical tags",
    "suggestedSlug": "clean-lowercase-slug-matching-focus-keyword",
    "canonicalUrl": "https://embee.co.in/blog/clean-lowercase-slug-matching-focus-keyword/"
  },
  "markdownSummary": "A beautifully formatted Markdown executive summary of this research brief."
}

Ensure "internalLinkStrategy" has AT LEAST 7 to 8 entries from the library, with at least 1 solution page, 2-3 blogs, and 1-2 case studies.
Return ONLY valid JSON.`;

    let responseText = '';
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          temperature: 0.3,
          tools: [{ googleSearch: {} }],
        },
      });
      responseText = response.text || '';
    } catch (searchErr) {
      console.warn('Search tool fallback:', searchErr);
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });
      responseText = response.text || '';
    }

    let parsedBrief: any;
    try {
      parsedBrief = JSON.parse(responseText.trim());
    } catch (jsonErr) {
      const match = responseText.match(/\{[\s\S]*\}/);
      if (match) {
        parsedBrief = JSON.parse(match[0]);
      } else {
        throw new Error('Failed to parse research brief JSON');
      }
    }

    res.json({
      brief: {
        topic,
        focusKeyword,
        ...parsedBrief,
      },
    });
  } catch (err: any) {
    console.error('Research error:', err);
    res.status(500).json({ error: err.message || 'Failed to conduct research' });
  }
});

// Generate content endpoint
app.post('/api/generate-content', async (req: Request, res: Response) => {
  try {
    const {
      topic,
      focusKeyword,
      targetKeywords = [],
      channel = 'embee-blog',
      primarySolutionUrl,
      wordCountTarget = 1600,
      indianScenario,
      publicationName,
      authorRole,
      customInstructions,
      researchBrief,
    } = req.body;

    if (!topic || !focusKeyword) {
      return res.status(400).json({ error: 'Topic and focus keyword are required' });
    }

    const ai = getAiClient();
    const systemInstruction = getSystemInstruction(channel);

    let userPrompt = `TOPIC: ${topic}\nFOCUS KEYWORD: ${focusKeyword}\n`;
    if (targetKeywords.length > 0) {
      userPrompt += `TARGET SECONDARY KEYWORDS (include every one naturally): ${targetKeywords.join(', ')}\n`;
    }
    if (primarySolutionUrl) {
      userPrompt += `PRIMARY SOLUTION URL (must link focus keyword in first sentence here): ${primarySolutionUrl}\n`;
    }
    if (indianScenario) {
      userPrompt += `SPECIFIC INDIAN ENTERPRISE SCENARIO: ${indianScenario}\n`;
    }
    if (publicationName) {
      userPrompt += `TARGET PUBLICATION: ${publicationName}\n`;
    }
    if (authorRole) {
      userPrompt += `AUTHOR PERSPECTIVE/ROLE: ${authorRole}\n`;
    }
    if (wordCountTarget) {
      userPrompt += `TARGET LENGTH: approximately ${wordCountTarget} words.\n`;
    }
    if (customInstructions) {
      userPrompt += `ADDITIONAL INSTRUCTIONS: ${customInstructions}\n`;
    }

    // Incorporate research brief if available
    if (researchBrief) {
      userPrompt += `\n--- PRE-WRITING RESEARCH & AEO/SEO STRATEGY (INCORPORATE ALL ELEMENTS) ---\n`;
      if (researchBrief.keyProofPoints && researchBrief.keyProofPoints.length > 0) {
        userPrompt += `KEY INDUSTRY PROOF POINTS & DATA (weave these facts into the body):\n` +
          researchBrief.keyProofPoints.map((p: any) => `- ${p.stat} (Source: ${p.source}) - Insight: ${p.insight}`).join('\n') + '\n';
      }
      if (researchBrief.externalCitations && researchBrief.externalCitations.length > 0) {
        userPrompt += `AUTHORITATIVE OUTSIDE CITATIONS (strictly 1 to 2 only):\n` +
          researchBrief.externalCitations.slice(0, 2).map((c: any) => `- [${c.title}](${c.url}) (${c.context})`).join('\n') + '\n';
      }
      if (researchBrief.internalLinkStrategy && researchBrief.internalLinkStrategy.length > 0) {
        userPrompt += `TARGET INTERNAL LINKS (MUST include at least 7 to 8 of these throughout intro and body):\n` +
          researchBrief.internalLinkStrategy.map((l: any) => `- Anchor: "${l.anchorSuggestion}" -> [${l.title}](${l.url}) in section: ${l.sectionTarget}`).join('\n') + '\n';
      }
      if (researchBrief.aeoQuestionCapsules && researchBrief.aeoQuestionCapsules.length > 0) {
        userPrompt += `AEO QUESTION H2s & ANSWER CAPSULES (use these question H2s and open each with the concise 30-50 word answer capsule):\n` +
          researchBrief.aeoQuestionCapsules.map((q: any) => `- H2: "${q.question}" -> First sentence answer: "${q.capsuleAnswer}"`).join('\n') + '\n';
      }
      if (researchBrief.seoMetaPlan) {
        userPrompt += `TARGET SEO META VALUES (use in the final Meta block):\n` +
          `- Meta Title: ${researchBrief.seoMetaPlan.metaTitle}\n` +
          `- Meta Description: ${researchBrief.seoMetaPlan.metaDescription}\n` +
          `- Alt Text: ${researchBrief.seoMetaPlan.altText}\n` +
          `- Slug: ${researchBrief.seoMetaPlan.suggestedSlug}\n`;
      }
    }

    userPrompt += `\nRemember all strict rules:
1. Zero em/en dashes (strictly forbidden).
2. Always write "Embee Software" in full. Never write standalone "Embee".
3. Always "Microsoft Frontier Partner" (never "Gold Partner").
4. 8th-grade level, punchy sentences, plain language.
5. Only 1 to 2 outside links.
6. At least 7 to 8 internal links to Embee pages, blogs, and case studies.
7. Include full ## Meta and Publishing Fields block at the very end.
Produce the full, complete publish-ready draft now.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const markdown = response.text || '';
    const audit = auditEmbeeContent(markdown, focusKeyword, channel);
    const infographics = extractInfographicsFromMarkdown(markdown, topic, focusKeyword);

    res.json({
      markdown,
      audit,
      infographics,
      channel,
      focusKeyword,
      topic,
    });
  } catch (err: any) {
    console.error('Content generation error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate content' });
  }
});

// Generate Infographics endpoint
app.post('/api/generate-infographics', async (req: Request, res: Response) => {
  try {
    const { topic, focusKeyword, markdownSummary = '' } = req.body;
    if (!topic || !focusKeyword) {
      return res.status(400).json({ error: 'Topic and focus keyword are required' });
    }

    const ai = getAiClient();
    const prompt = `You are a Senior B2B Information Architect & Infographic Designer for Embee Software (embee.co.in), a Microsoft Frontier Partner in India.

TOPIC: ${topic}
FOCUS KEYWORD: ${focusKeyword}
SUMMARY CONTEXT: ${markdownSummary.slice(0, 1000)}

Generate exactly 2 crisp, publication-ready infographic blueprints tailored for B2B enterprise tech buyers (CIOs, CISOs, IT Heads):
1. Infographic 1: A 4-stage process flow or architecture pipeline (e.g. Identity & Governance Pipeline). Format: 1:1 Square (LinkedIn/Social).
2. Infographic 2: An executive comparison matrix, decision tree, or cheat sheet comparing ad-hoc/legacy methods vs the Embee Software managed framework. Format: 16:9 Landscape (Blog Header).

STRICT RULES:
- Brand: Always say "Embee Software" in full. Never "Embee" alone.
- Partner: Always "Microsoft Frontier Partner".
- Micro-copy: Each node must have crisp, concrete 10 to 18 word micro-copy. No vague fluff.
- Zero em dashes or en dashes.

Output purely valid JSON in the following schema:
{
  "infographics": [
    {
      "id": "info-1",
      "title": "string (punchy, high-impact)",
      "subtitle": "string (subhead context)",
      "type": "process-flow",
      "targetFormat": "1:1 Square (LinkedIn/Social)",
      "keyCallout": "string (punchy stat or takeaway)",
      "nodes": [
        { "stepNumber": 1, "title": "string", "description": "string (10-18 words)", "iconHint": "ShieldCheck" },
        { "stepNumber": 2, "title": "string", "description": "string (10-18 words)", "iconHint": "Cpu" },
        { "stepNumber": 3, "title": "string", "description": "string (10-18 words)", "iconHint": "Workflow" },
        { "stepNumber": 4, "title": "string", "description": "string (10-18 words)", "iconHint": "FileCheck" }
      ],
      "designReference": {
        "title": "Canva Technology & Cloud Process Infographic Template",
        "url": "https://www.canva.com/templates/?query=technology-process-infographic",
        "notes": "Horizontal 4-stage pipeline with numbered badges and dark card nodes."
      },
      "colorPalette": {
        "primary": "#0B192C",
        "secondary": "#0078D4",
        "accent": "#00E5FF",
        "background": "#030712"
      }
    },
    {
      "id": "info-2",
      "title": "string (punchy comparison/decision title)",
      "subtitle": "string (subhead context)",
      "type": "comparison-matrix",
      "targetFormat": "16:9 Landscape (Blog Header)",
      "keyCallout": "string (punchy stat or takeaway)",
      "nodes": [
        { "stepNumber": 1, "title": "string", "description": "string (10-18 words)", "iconHint": "ShieldCheck" },
        { "stepNumber": 2, "title": "string", "description": "string (10-18 words)", "iconHint": "Workflow" },
        { "stepNumber": 3, "title": "string", "description": "string (10-18 words)", "iconHint": "TrendingUp" },
        { "stepNumber": 4, "title": "string", "description": "string (10-18 words)", "iconHint": "Users" }
      ],
      "designReference": {
        "title": "Canva B2B Enterprise Feature & Decision Matrix Template",
        "url": "https://www.canva.com/templates/?query=comparison-infographic",
        "notes": "Side-by-side comparative layout with clear criteria."
      },
      "colorPalette": {
        "primary": "#0B192C",
        "secondary": "#0078D4",
        "accent": "#00E5FF",
        "background": "#030712"
      }
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.6,
      },
    });

    let infographics: any[] = [];
    try {
      const parsed = JSON.parse(response.text || '{}');
      infographics = parsed.infographics || [];
    } catch {
      infographics = generateDefaultInfographics(topic, focusKeyword);
    }

    if (infographics.length === 0) {
      infographics = generateDefaultInfographics(topic, focusKeyword);
    }

    res.json({ infographics });
  } catch (err: any) {
    console.error('Generate infographics error:', err);
    res.json({ infographics: generateDefaultInfographics(req.body.topic || 'Enterprise IT', req.body.focusKeyword || 'Cloud Transformation') });
  }
});

// Repurpose content endpoint
app.post('/api/repurpose-content', async (req: Request, res: Response) => {
  try {
    const { sourceMarkdown, targetChannel, focusKeyword, customNotes } = req.body;
    if (!sourceMarkdown || !targetChannel) {
      return res.status(400).json({ error: 'sourceMarkdown and targetChannel are required' });
    }

    const ai = getAiClient();
    const systemInstruction = getSystemInstruction(targetChannel);

    const prompt = `Please adapt and repurpose the following source content for the "${targetChannel}" channel.
FOCUS KEYWORD: ${focusKeyword || 'Enterprise IT'}
${customNotes ? `CUSTOM NOTES: ${customNotes}\n` : ''}

SOURCE CONTENT:
${sourceMarkdown}

Transform it completely into the required format for ${targetChannel}.
Adhere strictly to: Zero em/en dashes, "Embee Software" in full, "Microsoft Frontier Partner", and only use approved Embee URLs.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const markdown = response.text || '';
    const audit = auditEmbeeContent(markdown, focusKeyword || '', targetChannel);

    res.json({
      markdown,
      audit,
      targetChannel,
    });
  } catch (err: any) {
    console.error('Repurpose error:', err);
    res.status(500).json({ error: err.message || 'Failed to repurpose content' });
  }
});

// Start Express server with Vite middleware in dev, or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Embee Software Content Studio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
