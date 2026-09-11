import React, { useState } from 'react';
import { 
  Search, 
  Copy, 
  Check, 
  Globe, 
  Tag, 
  Image, 
  Link as LinkIcon, 
  Sparkles, 
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface SeoMetaCardProps {
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

export const SeoMetaCard: React.FC<SeoMetaCardProps> = ({ metaFields }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const {
    focusKeyword = '',
    metaTitle = '',
    metaDescription = '',
    metaKeywords = '',
    altText = '',
    tags = '',
    slug = '',
    canonicalUrl = '',
  } = metaFields;

  if (!metaTitle && !focusKeyword && !metaDescription) {
    return null;
  }

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const titleLen = metaTitle.length;
  const descLen = metaDescription.length;

  const getTitleStatus = () => {
    if (titleLen === 0) return { label: 'Empty', color: 'text-slate-400 bg-slate-800' };
    if (titleLen >= 50 && titleLen <= 60) return { label: `${titleLen}/60 chars (Optimal)`, color: 'text-emerald-300 bg-emerald-950/60 border-emerald-800' };
    if (titleLen < 50) return { label: `${titleLen}/60 chars (A bit short)`, color: 'text-amber-300 bg-amber-950/60 border-amber-800' };
    return { label: `${titleLen}/60 chars (May truncate)`, color: 'text-rose-300 bg-rose-950/60 border-rose-800' };
  };

  const getDescStatus = () => {
    if (descLen === 0) return { label: 'Empty', color: 'text-slate-400 bg-slate-800' };
    if (descLen >= 140 && descLen <= 160) return { label: `${descLen}/160 chars (Optimal)`, color: 'text-emerald-300 bg-emerald-950/60 border-emerald-800' };
    if (descLen < 140) return { label: `${descLen}/160 chars (Room for more detail)`, color: 'text-amber-300 bg-amber-950/60 border-amber-800' };
    return { label: `${descLen}/160 chars (May truncate on SERP)`, color: 'text-rose-300 bg-rose-950/60 border-rose-800' };
  };

  const titleStatus = getTitleStatus();
  const descStatus = getDescStatus();

  const formattedUrl = canonicalUrl || `https://embee.co.in/blog/${slug || 'article'}/`;
  const keywordTags = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-lg mb-4 text-slate-100">
      {/* Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-4 py-3 bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/40 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-850 transition"
      >
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-blue-600/30 border border-blue-500/40 text-blue-400">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white flex items-center space-x-2">
              <span>SEO & Publishing Metadata Block</span>
              <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                AEO & SERP Ready
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Validated title tags, meta descriptions, slugs, and banner alt text for CMS publishing
            </p>
          </div>
        </div>

        <button className="text-slate-400 hover:text-white p-1">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-4">
          {/* SERP Preview Simulation */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Google SERP Preview (Desktop & Mobile)</span>
              <span className="text-slate-500 lowercase font-normal font-mono">google.com/search</span>
            </div>

            {/* URL Breadcrumb */}
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 truncate">
              <Globe className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="text-slate-300 font-medium">Embee Software</span>
              <span className="text-slate-600">&gt;</span>
              <span className="text-slate-400 truncate">{formattedUrl}</span>
            </div>

            {/* Title */}
            <div className="text-sm sm:text-base font-semibold text-blue-400 hover:underline cursor-pointer leading-snug">
              {metaTitle || 'Meta Title Not Found in Markdown'}
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
              {metaDescription || 'Meta description will be harvested from the ## Meta and Publishing Fields block.'}
            </p>
          </div>

          {/* Quick Copy Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Meta Title */}
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-400">Meta Title</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${titleStatus.color}`}>
                  {titleStatus.label}
                </span>
              </div>
              <div className="font-semibold text-slate-200 text-xs line-clamp-2">
                {metaTitle || '—'}
              </div>
              <button
                onClick={() => copyToClipboard(metaTitle, 'title')}
                className="mt-1 text-[11px] text-blue-400 hover:text-blue-300 flex items-center space-x-1 font-medium cursor-pointer"
              >
                {copiedKey === 'title' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'title' ? 'Copied Title' : 'Copy Title'}</span>
              </button>
            </div>

            {/* Meta Description */}
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-400">Meta Description</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${descStatus.color}`}>
                  {descStatus.label}
                </span>
              </div>
              <div className="text-slate-300 text-xs line-clamp-2">
                {metaDescription || '—'}
              </div>
              <button
                onClick={() => copyToClipboard(metaDescription, 'desc')}
                className="mt-1 text-[11px] text-blue-400 hover:text-blue-300 flex items-center space-x-1 font-medium cursor-pointer"
              >
                {copiedKey === 'desc' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'desc' ? 'Copied Description' : 'Copy Description'}</span>
              </button>
            </div>

            {/* Focus Keyword & Slug */}
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-400">Target Slug & URL</span>
                <button
                  onClick={() => copyToClipboard(slug, 'slug')}
                  className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center space-x-1 cursor-pointer"
                >
                  {copiedKey === 'slug' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy Slug</span>
                </button>
              </div>
              <div className="font-mono text-xs text-amber-300 bg-slate-900 px-2 py-1 rounded border border-slate-700/80 truncate">
                /{slug || 'slug-placeholder'}
              </div>
              {canonicalUrl && (
                <div className="text-[10px] text-slate-400 truncate flex items-center space-x-1">
                  <LinkIcon className="w-2.5 h-2.5 shrink-0 text-slate-500" />
                  <span className="truncate">{canonicalUrl}</span>
                </div>
              )}
            </div>

            {/* Banner Image Alt Text */}
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-400 flex items-center space-x-1">
                  <Image className="w-3 h-3 text-purple-400" />
                  <span>Banner Image Alt Text</span>
                </span>
                <button
                  onClick={() => copyToClipboard(altText, 'alt')}
                  className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center space-x-1 cursor-pointer"
                >
                  {copiedKey === 'alt' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy Alt</span>
                </button>
              </div>
              <div className="text-slate-300 text-xs italic line-clamp-2 bg-slate-900/60 p-1.5 rounded border border-slate-800">
                "{altText || 'Featured banner visual'}"
              </div>
            </div>
          </div>

          {/* Tags & Keywords */}
          {keywordTags.length > 0 && (
            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 flex items-center justify-between gap-2 flex-wrap text-xs">
              <div className="flex items-center space-x-1.5 text-slate-400">
                <Tag className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[11px] font-medium">Publishing Tags:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {keywordTags.map((tag, idx) => (
                  <span 
                    key={idx}
                    className="px-2 py-0.5 rounded-full bg-blue-950/60 text-blue-300 border border-blue-800/50 text-[10px]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
