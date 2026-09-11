import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Copy, 
  Check, 
  Download, 
  Eye, 
  Code, 
  Share2, 
  RefreshCw, 
  FileText, 
  Clock, 
  BookOpen, 
  ArrowRight, 
  Sparkles,
  Link as LinkIcon,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { ContentChannel, AuditResult, InfographicItem } from '../types.js';
import { SeoMetaCard } from './SeoMetaCard.js';
import { InfographicCard } from './InfographicCard.js';
import { extractInfographicsFromMarkdown } from '../lib/infographicHelper.js';
import { Layout } from 'lucide-react';

interface ContentPreviewProps {
  markdown: string;
  onMarkdownChange: (newMarkdown: string) => void;
  channel: ContentChannel;
  topic: string;
  focusKeyword: string;
  audit?: AuditResult;
  infographics?: InfographicItem[];
  onRepurpose: (targetChannel: ContentChannel) => void;
  isRepurposing: boolean;
  onGenerateInfographics?: () => void;
  isGeneratingInfographics?: boolean;
}

export const ContentPreview: React.FC<ContentPreviewProps> = ({
  markdown,
  onMarkdownChange,
  channel,
  topic,
  focusKeyword,
  audit,
  infographics,
  onRepurpose,
  isRepurposing,
  onGenerateInfographics,
  isGeneratingInfographics,
}) => {
  const [viewMode, setViewMode] = useState<'preview' | 'infographics' | 'edit'>('preview');
  const [copied, setCopied] = useState(false);
  const [repurposeTarget, setRepurposeTarget] = useState<ContentChannel>('linkedin');

  // Determine effective infographics from props, audit, or markdown extraction
  const effectiveInfographics = 
    (infographics && infographics.length > 0)
      ? infographics
      : (audit?.stats.infographics && audit.stats.infographics.length > 0)
      ? audit.stats.infographics
      : extractInfographicsFromMarkdown(markdown, topic, focusKeyword);

  if (!markdown) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 text-center text-slate-400 space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-200">No Content Generated Yet</h3>
        <p className="text-xs max-w-md mx-auto text-slate-400">
          Enter a topic and focus keyword above, conduct research, then click Generate to create publish-ready content.
        </p>
      </div>
    );
  }

  const wordCount = markdown.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.ceil(wordCount / 200);

  // Extract meta fields for the card if audit is not supplied
  const extractField = (label: string): string => {
    const regex = new RegExp(`\\*\\*${label}:?\\*\\*\\s*([^\\n]+)`, 'i');
    const match = markdown.match(regex);
    return match ? match[1].trim() : '';
  };

  const metaFields = audit?.stats.metaFields || {
    focusKeyword: extractField('Focus keyword') || focusKeyword,
    metaTitle: extractField('Meta title'),
    metaDescription: extractField('Meta description'),
    metaKeywords: extractField('Meta keywords'),
    altText: extractField('Alt text for banner image'),
    tags: extractField('Tags'),
    slug: extractField('Suggested slug'),
    canonicalUrl: extractField('Canonical URL'),
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(focusKeyword || 'embee-content').toLowerCase().replace(/\s+/g, '-')}-${channel}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-xl overflow-hidden flex flex-col text-slate-100">
      {/* Action & Stats Bar */}
      <div className="px-4 sm:px-6 py-3 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
        {/* Left: View Mode Toggle & Metrics */}
        <div className="flex items-center space-x-3">
          <div className="flex bg-slate-800 p-0.5 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1 rounded-lg font-medium flex items-center space-x-1.5 transition cursor-pointer ${
                viewMode === 'preview'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Formatted Preview</span>
            </button>
            <button
              onClick={() => setViewMode('infographics')}
              className={`px-3 py-1 rounded-lg font-medium flex items-center space-x-1.5 transition cursor-pointer ${
                viewMode === 'infographics'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layout className="w-3.5 h-3.5 text-cyan-400" />
              <span>Infographics ({effectiveInfographics.length})</span>
            </button>
            <button
              onClick={() => setViewMode('edit')}
              className={`px-3 py-1 rounded-lg font-medium flex items-center space-x-1.5 transition cursor-pointer ${
                viewMode === 'edit'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Markdown Source</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center space-x-3 text-xs text-slate-400 pl-2 border-l border-slate-800">
            <span className="flex items-center space-x-1">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <strong className="text-white">{wordCount.toLocaleString()}</strong> words
            </span>
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <strong className="text-white">{readTime}</strong> min read
            </span>
            {audit && (
              <>
                <span className="flex items-center space-x-1">
                  <LinkIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <strong className="text-white">{audit.stats.internalLinkCount}</strong> internal links
                </span>
                <span className="flex items-center space-x-1">
                  <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                  <strong className="text-white">{audit.stats.capsuleH2Count}</strong> AEO capsules
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right: Export & Copy Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyMarkdown}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
            <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-lg text-xs transition cursor-pointer"
            title="Download .md file"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Repurposing Quick Strip */}
      <div className="px-4 sm:px-6 py-2.5 bg-blue-950/20 border-b border-blue-900/30 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-1.5 text-blue-300">
          <Share2 className="w-3.5 h-3.5" />
          <span>Repurpose into another format:</span>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={repurposeTarget}
            onChange={(e) => setRepurposeTarget(e.target.value as ContentChannel)}
            className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
          >
            {channel !== 'embee-blog' && <option value="embee-blog">Embee Website Blog (1,600w SEO)</option>}
            {channel !== 'linkedin' && <option value="linkedin">LinkedIn Multi-Pack (Post + Carousel)</option>}
            {channel !== 'guest-post' && <option value="guest-post">Guest Post (CIO.com / ETCIO)</option>}
            {channel !== 'third-party' && <option value="third-party">Third-Party Deep-Dive (Medium)</option>}
          </select>

          <button
            onClick={() => onRepurpose(repurposeTarget)}
            disabled={isRepurposing}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 transition cursor-pointer disabled:opacity-50"
          >
            {isRepurposing ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <Sparkles className="w-3 h-3 text-amber-300" />
            )}
            <span>{isRepurposing ? 'Adapting...' : 'Repurpose Now'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 sm:p-8 overflow-y-auto max-h-[700px] space-y-6">
        {/* SEO Meta Card for embee-blog */}
        {channel === 'embee-blog' && viewMode !== 'infographics' && (
          <SeoMetaCard metaFields={metaFields} />
        )}

        {viewMode === 'infographics' ? (
          <div className="space-y-4">
            <div className="p-3 bg-blue-950/40 border border-blue-800/40 rounded-xl text-xs text-blue-200 flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Dedicated Infographic Studio: 1-2 crisp visual cards with verified design references for Canva and Figma.</span>
              </span>
              <button
                onClick={() => setViewMode('preview')}
                className="text-cyan-300 hover:text-white underline text-xs cursor-pointer"
              >
                Back to Blog Draft &rarr;
              </button>
            </div>
            <InfographicCard
              infographics={effectiveInfographics}
              topic={topic}
              focusKeyword={focusKeyword}
              onRegenerate={onGenerateInfographics}
              isRegenerating={isGeneratingInfographics}
            />
          </div>
        ) : viewMode === 'preview' ? (
          <>
            {/* Infographics Section inside Preview */}
            <div className="border border-slate-800/80 rounded-2xl overflow-hidden bg-slate-950/40">
              <InfographicCard
                infographics={effectiveInfographics}
                topic={topic}
                focusKeyword={focusKeyword}
                onRegenerate={onGenerateInfographics}
                isRegenerating={isGeneratingInfographics}
              />
            </div>

            <div className="prose prose-invert max-w-none prose-headings:text-white prose-h1:text-2xl sm:prose-h1:text-3xl prose-h1:font-extrabold prose-h1:tracking-tight prose-h1:border-b prose-h1:border-slate-800 prose-h1:pb-3 prose-h2:text-lg sm:prose-h2:text-xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-3 prose-h2:text-blue-200 prose-p:text-slate-300 prose-p:text-sm prose-p:leading-relaxed prose-li:text-slate-300 prose-li:text-sm prose-strong:text-white prose-a:text-blue-400 prose-a:underline hover:prose-a:text-blue-300 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-slate-800/40 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-table:border-collapse prose-th:border prose-th:border-slate-700 prose-th:bg-slate-800 prose-th:p-2.5 prose-th:text-xs prose-td:border prose-td:border-slate-700 prose-td:p-2.5 prose-td:text-xs">
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </div>
          </>
        ) : (
          <textarea
            value={markdown}
            onChange={(e) => onMarkdownChange(e.target.value)}
            className="w-full h-[650px] font-mono text-xs text-slate-200 bg-slate-950/80 p-4 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed"
            placeholder="Edit markdown draft directly..."
          />
        )}
      </div>
    </div>
  );
};
