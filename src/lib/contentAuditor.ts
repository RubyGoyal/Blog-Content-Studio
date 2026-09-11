import { EMBEE_INTERNAL_LINKS } from '../data/embeeLinks.js';
import { AuditCheck, AuditResult, ContentStats } from '../types.js';
import { extractInfographicsFromMarkdown } from './infographicHelper.js';

export function auditEmbeeContent(
  markdown: string,
  focusKeyword: string,
  channel: string = 'embee-blog'
): AuditResult {
  const text = markdown || '';
  const checks: AuditCheck[] = [];
  let score = 100;

  // 1. Em / En Dashes Check (STRICT RULE)
  const emDashMatches = text.match(/[—–]/g) || [];
  const emDashCount = emDashMatches.length;
  if (emDashCount > 0) {
    score -= Math.min(25, emDashCount * 5);
    checks.push({
      id: 'no-dashes',
      title: 'Em / En Dashes Rule',
      status: 'fail',
      message: `Found ${emDashCount} em or en dash(es) (— or –). Brand guidelines strictly forbid em/en dashes.`,
      suggestion: 'Replace dashes with commas, full stops, or rewrite into two sentences.'
    });
  } else {
    checks.push({
      id: 'no-dashes',
      title: 'No Em/En Dashes',
      status: 'pass',
      message: 'Zero em or en dashes detected. Complies with strict typography guidelines.'
    });
  }

  // 2. Brand Name "Embee Software" (Never standalone "Embee")
  // Match "Embee" when not followed by "Software" (case-insensitive, but usually capital)
  const bareEmbeeMatches = text.match(/\bEmbee(?!\s+Software)\b/gi) || [];
  const bareEmbeeCount = bareEmbeeMatches.length;
  if (bareEmbeeCount > 0) {
    score -= Math.min(20, bareEmbeeCount * 5);
    checks.push({
      id: 'brand-name',
      title: 'Brand Name: Embee Software in Full',
      status: 'fail',
      message: `Found ${bareEmbeeCount} instance(s) of standalone "Embee". Always write "Embee Software" in full.`,
      suggestion: 'Update all occurrences of "Embee" to "Embee Software".'
    });
  } else {
    checks.push({
      id: 'brand-name',
      title: 'Embee Software Naming',
      status: 'pass',
      message: 'Brand name correctly written as "Embee Software" in full.'
    });
  }

  // 3. Microsoft Partnership Title: "Microsoft Frontier Partner" (Never "Gold Partner")
  const goldPartnerMatches = text.match(/\bGold\s+Partner\b/gi) || [];
  const goldPartnerCount = goldPartnerMatches.length;
  if (goldPartnerCount > 0) {
    score -= 15;
    checks.push({
      id: 'partner-status',
      title: 'Partner Designation Rule',
      status: 'fail',
      message: 'Found "Gold Partner". Brand rules mandate "Microsoft Frontier Partner".',
      suggestion: 'Replace "Gold Partner" with "Microsoft Frontier Partner".'
    });
  } else if (/Microsoft\s+Frontier\s+Partner/i.test(text)) {
    checks.push({
      id: 'partner-status',
      title: 'Microsoft Frontier Partner',
      status: 'pass',
      message: 'Accurately uses "Microsoft Frontier Partner" designation.'
    });
  } else {
    checks.push({
      id: 'partner-status',
      title: 'Partner Designation',
      status: 'warn',
      message: 'Consider referencing Embee Software\'s official status as a Microsoft Frontier Partner.',
      suggestion: 'Include "As a Microsoft Frontier Partner..." in the expertise / CTA sections.'
    });
  }

  // 4. Links Auditing (Internal & External)
  const allLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g;
  const foundLinks: string[] = [];
  const invalidLinks: string[] = [];
  const foundExternalLinks: string[] = [];
  const validUrlSet = new Set(EMBEE_INTERNAL_LINKS.map(l => l.url.replace(/\/$/, '').toLowerCase()));

  let solutionLinkCount = 0;
  let blogLinkCount = 0;
  let caseStudyLinkCount = 0;

  let linkMatch;
  while ((linkMatch = allLinkRegex.exec(text)) !== null) {
    const url = linkMatch[2];
    if (url.includes('embee.co.in')) {
      foundLinks.push(url);
      const normalizedUrl = url.replace(/\/$/, '').toLowerCase();
      if (!validUrlSet.has(normalizedUrl)) {
        invalidLinks.push(url);
      }
      if (url.includes('/solutions/') || url.includes('/erp/') || url.includes('/octane-hrms') || url.includes('/payroll-software') || url.includes('/employee-self-service') || url.includes('/recruitment-onboarding')) {
        solutionLinkCount++;
      } else if (url.includes('/blog/')) {
        blogLinkCount++;
      } else if (url.includes('/case-studies/')) {
        caseStudyLinkCount++;
      }
    } else {
      foundExternalLinks.push(url);
    }
  }

  if (channel === 'embee-blog') {
    // 4a. Check for Hallucinated URLs
    if (invalidLinks.length > 0) {
      score -= Math.min(25, invalidLinks.length * 10);
      checks.push({
        id: 'valid-links',
        title: 'Invented / Hallucinated URLs',
        status: 'fail',
        message: `Found ${invalidLinks.length} URL(s) not in the official Embee Software Links Library: ${invalidLinks.join(', ')}`,
        suggestion: 'Replace with approved URLs from the Knowledge Library.'
      });
    } else {
      checks.push({
        id: 'valid-links',
        title: 'Verified Internal URLs',
        status: 'pass',
        message: 'All Embee Software internal URLs are authentic and verified from the library.'
      });
    }

    // 4b. Internal Link Quantity: at least 7-8 internal links to webpages, blogs, and case studies
    if (foundLinks.length >= 7) {
      checks.push({
        id: 'internal-links-qty',
        title: 'Internal Links (7-8+ target)',
        status: 'pass',
        message: `${foundLinks.length} internal links found (Distribution: ${solutionLinkCount} solution pages, ${blogLinkCount} blogs, ${caseStudyLinkCount} case studies). Meets the 7-8 link requirement.`
      });
    } else if (foundLinks.length >= 4) {
      score -= 8;
      checks.push({
        id: 'internal-links-qty',
        title: 'Internal Links Quantity',
        status: 'warn',
        message: `Found ${foundLinks.length} internal link(s). Guidelines require at least 7 to 8 internal links across solution pages, blogs, and case studies.`,
        suggestion: 'Add links to relevant case studies (e.g. airport SOC, auto components) and related blogs from the library.'
      });
    } else {
      score -= 15;
      checks.push({
        id: 'internal-links-qty',
        title: 'Internal Links Quantity',
        status: 'fail',
        message: `Found only ${foundLinks.length} internal link(s). At least 7 to 8 internal links required.`,
        suggestion: 'Add approved links to solution pages, related blogs, and case studies.'
      });
    }

    // 4c. Outside Links: only 1-2 outside links to authoritative sources
    const externalCount = foundExternalLinks.length;
    if (externalCount >= 1 && externalCount <= 2) {
      checks.push({
        id: 'external-links',
        title: 'Authoritative Outside Links (1-2 target)',
        status: 'pass',
        message: `Found ${externalCount} outside link(s): ${foundExternalLinks.join(', ')}. Conforms to the 1-2 external link limit.`
      });
    } else if (externalCount === 0) {
      score -= 5;
      checks.push({
        id: 'external-links',
        title: 'Authoritative Outside Links',
        status: 'warn',
        message: 'Found 0 outside links. Guidelines specify 1 to 2 authoritative outside citations (e.g. Microsoft Learn, SAP, Gartner).',
        suggestion: 'Add 1 official reference link (e.g. to learn.microsoft.com or sap.com).'
      });
    } else {
      score -= 10;
      checks.push({
        id: 'external-links',
        title: 'Too Many Outside Links',
        status: 'warn',
        message: `Found ${externalCount} outside links (${foundExternalLinks.join(', ')}). Rule allows only 1-2 outside links to preserve authority.`,
        suggestion: 'Reduce outside links to at most 1 or 2 high-authority citations.'
      });
    }
  }

  // 5. First sentence checks (for embee-blog)
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim() && !p.startsWith('#') && !p.startsWith('**TL;DR'));
  const introParagraph = paragraphs[0] || '';
  const firstSentence = introParagraph.split(/[.!?]/)[0] || '';

  const cleanKeyword = focusKeyword ? focusKeyword.trim().toLowerCase() : '';
  const hasFirstSentenceFocusKeyword = cleanKeyword
    ? firstSentence.toLowerCase().includes(cleanKeyword)
    : false;
  const hasFirstSentenceLink = /\[[^\]]+\]\(https:\/\/embee\.co\.in\/[^\)]+\)/.test(firstSentence);

  if (channel === 'embee-blog') {
    if (hasFirstSentenceFocusKeyword && hasFirstSentenceLink) {
      checks.push({
        id: 'intro-structure',
        title: 'First Paragraph & Focus Keyword Link',
        status: 'pass',
        message: 'First sentence opens with the focus keyword and links directly to a relevant solution page.'
      });
    } else {
      score -= 10;
      checks.push({
        id: 'intro-structure',
        title: 'Intro Focus Keyword & Solution Link',
        status: 'warn',
        message: 'Guidelines require putting the focus keyword in the first sentence and linking it to a relevant embee.co.in solution page.',
        suggestion: 'Start intro with `[${focusKeyword}](https://embee.co.in/solutions/...) is...`'
      });
    }
  }

  // 6. H2 Structure & Answer Capsules
  const h2Matches = text.match(/^##\s+(.+)$/gm) || [];
  const h2Count = h2Matches.length;
  const questionH2s = h2Matches.filter(h => h.includes('?') || /^##\s+(What|Why|How|Can|Which|Are|Does|Who)\b/i.test(h));
  const capsuleH2Count = questionH2s.length;
  const capsuleRatio = h2Count > 0 ? capsuleH2Count / h2Count : 0;

  if (channel === 'embee-blog') {
    if (h2Count >= 4 && capsuleRatio >= 0.4) {
      checks.push({
        id: 'answer-capsules',
        title: 'Answer Capsule Structure',
        status: 'pass',
        message: `${Math.round(capsuleRatio * 100)}% of H2 sections (${capsuleH2Count}/${h2Count}) use question/answer capsule format.`
      });
    } else {
      checks.push({
        id: 'answer-capsules',
        title: 'Answer Capsule Headings',
        status: 'warn',
        message: `Currently ${Math.round(capsuleRatio * 100)}% of H2s are questions. Target is ~60% answer capsule format for AI overview extraction.`,
        suggestion: 'Frame more H2s as questions (e.g. "What Is...", "How Does...", "Why Do...") with the direct answer in the first 30-50 words.'
      });
    }
  }

  // 7. Word count & Readability
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Approximate Flesch-Kincaid reading level
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  const avgSentenceLength = sentences.length > 0 ? wordCount / sentences.length : 15;
  const readingLevel = avgSentenceLength < 18 ? 'Grade 7-8 (Clean, Plain, Accessible)' : 'Grade 9-10 (Slightly dense, consider shortening sentences)';

  if (channel === 'embee-blog') {
    if (wordCount >= 1300 && wordCount <= 2200) {
      checks.push({
        id: 'word-count',
        title: 'Target Word Count (~1,600 words)',
        status: 'pass',
        message: `Total word count is ${wordCount.toLocaleString()} words (target is ~1,600 words).`
      });
    } else if (wordCount < 1300) {
      score -= 10;
      checks.push({
        id: 'word-count',
        title: 'Word Count Depth',
        status: 'warn',
        message: `Current word count is ${wordCount} words, below standard Embee blog target (~1,600 words).`,
        suggestion: 'Expand sections with Indian enterprise scenarios, architectural trade-offs, and actionable checklists.'
      });
    } else {
      checks.push({
        id: 'word-count',
        title: 'Word Count Depth',
        status: 'pass',
        message: `In-depth coverage with ${wordCount} words.`
      });
    }
  }

  // 8. FAQ Section
  const hasFaq = /##\s+(Frequently Asked Questions|FAQ)/i.test(text);
  const faqQuestions = (text.match(/\*\*(What|Why|How|Can|Is|Which|Does|When)[^\*]+\?\*\*/gi) || []).length;

  if (channel === 'embee-blog') {
    if (hasFaq && faqQuestions >= 4) {
      checks.push({
        id: 'faq-section',
        title: 'FAQ Section (5 Questions)',
        status: 'pass',
        message: `FAQ section present with ${faqQuestions} structured questions.`
      });
    } else {
      score -= 8;
      checks.push({
        id: 'faq-section',
        title: 'FAQ Section',
        status: 'warn',
        message: 'Guidelines specify an FAQ with exactly 5 questions and concise answers.',
        suggestion: 'Include `## Frequently Asked Questions` with 5 bolded Q&A entries.'
      });
    }
  }

  // 9. Meta & Publishing Block & Extraction
  const hasMetaBlock = /##\s+Meta and Publishing Fields/i.test(text) || /\*\*Focus keyword:\*\*/i.test(text);

  // Extract meta fields
  const extractField = (label: string): string => {
    const regex = new RegExp(`\\*\\*${label}:?\\*\\*\\s*([^\\n]+)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  };

  const metaFields = {
    focusKeyword: extractField('Focus keyword') || focusKeyword,
    metaTitle: extractField('Meta title'),
    metaDescription: extractField('Meta description'),
    metaKeywords: extractField('Meta keywords'),
    altText: extractField('Alt text for banner image'),
    tags: extractField('Tags'),
    slug: extractField('Suggested slug'),
    canonicalUrl: extractField('Canonical URL') || 'https://embee.co.in/blog/' + (extractField('Suggested slug') || 'article'),
  };

  if (channel === 'embee-blog') {
    if (hasMetaBlock) {
      const titleLen = metaFields.metaTitle ? metaFields.metaTitle.length : 0;
      const descLen = metaFields.metaDescription ? metaFields.metaDescription.length : 0;
      const titleStatus = titleLen >= 40 && titleLen <= 65 ? 'optimal' : titleLen > 65 ? 'too long' : 'too short';
      const descStatus = descLen >= 120 && descLen <= 165 ? 'optimal' : descLen > 165 ? 'too long' : 'too short';

      checks.push({
        id: 'meta-fields',
        title: 'Meta & Publishing Fields Block',
        status: 'pass',
        message: `SEO Block detected. Title: ${titleLen} chars (${titleStatus}), Description: ${descLen} chars (${descStatus}). Slug & Tags generated.`
      });
    } else {
      score -= 10;
      checks.push({
        id: 'meta-fields',
        title: 'Meta & Publishing Block',
        status: 'warn',
        message: 'Missing "## Meta and Publishing Fields" block at the end.',
        suggestion: 'Include Focus keyword, Meta title, Meta description, Alt text, Tags, and Suggested slug.'
      });
    }
  }

  // 10. Crisp Infographics Check
  const hasInfographics = /##\s+(?:Infographic\s+Concepts|Infographics|Visual\s+Assets)/i.test(text) || /###\s+Infographic\s+[12]/i.test(text);
  const parsedInfographics = extractInfographicsFromMarkdown(text, '', focusKeyword);

  if (channel === 'embee-blog') {
    if (hasInfographics || parsedInfographics.length >= 1) {
      checks.push({
        id: 'infographics-check',
        title: 'Crisp Infographics (1-2 Visuals)',
        status: 'pass',
        message: `${parsedInfographics.length} crisp infographic blueprint(s) found with micro-copy, flow, and design reference links.`
      });
    } else {
      checks.push({
        id: 'infographics-check',
        title: 'Crisp Infographics',
        status: 'warn',
        message: 'No infographic blueprint section detected in markdown.',
        suggestion: 'Include 1-2 crisp infographic blueprints with micro-copy and design reference links.'
      });
    }
  }

  const finalScore = Math.max(0, Math.min(100, score));

  return {
    score: finalScore,
    passed: finalScore >= 80 && emDashCount === 0 && bareEmbeeCount === 0,
    checks,
    stats: {
      wordCount,
      readingLevel,
      h2Count,
      capsuleH2Count,
      capsuleRatio,
      internalLinkCount: foundLinks.length,
      foundLinks,
      invalidLinks,
      solutionLinkCount,
      blogLinkCount,
      caseStudyLinkCount,
      externalLinkCount: foundExternalLinks.length,
      foundExternalLinks,
      emDashCount,
      bareEmbeeCount,
      goldPartnerCount,
      hasFirstSentenceFocusKeyword,
      hasFirstSentenceLink,
      hasFaq,
      faqCount: faqQuestions,
      hasMetaBlock,
      hasInfographics,
      infographics: parsedInfographics,
      metaFields,
    }
  };
}
