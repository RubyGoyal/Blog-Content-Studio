import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Layers, 
  Plus, 
  X, 
  HelpCircle, 
  Building2, 
  Globe, 
  FileText,
  Sliders,
  ChevronDown
} from 'lucide-react';
import { ContentChannel, GenerationParams } from '../types.js';
import { EMBEE_INTERNAL_LINKS } from '../data/embeeLinks.js';

interface ContentFormProps {
  channel: ContentChannel;
  params: GenerationParams;
  onChange: (params: GenerationParams) => void;
  onGenerate: () => void;
  onRunResearch?: () => void;
  isLoading: boolean;
  isResearching?: boolean;
  onOpenTemplates: () => void;
  onOpenLinks: () => void;
}

export const ContentForm: React.FC<ContentFormProps> = ({
  channel,
  params,
  onChange,
  onGenerate,
  onRunResearch,
  isLoading,
  isResearching = false,
  onOpenTemplates,
  onOpenLinks,
}) => {
  const [keywordInput, setKeywordInput] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Filter solution links for dropdown recommendation
  const solutionLinks = EMBEE_INTERNAL_LINKS.filter(
    (l) => l.category === 'Solutions' || l.category === 'HR / Octane HRMS' || l.category === 'ERP / SAP'
  );

  const indianScenarios = [
    { label: 'Pune Automotive & Discrete Manufacturer', value: 'A tier-1 automotive components manufacturer in Pune running discrete production shifts with ECC migration pressure' },
    { label: 'Mumbai BFSI & Regulated Enterprise', value: 'A mid-sized BFSI enterprise in Mumbai managing DPDP Act consent compliance and hybrid cloud audit trails' },
    { label: 'Bengaluru Tech & SaaS Enterprise', value: 'A high-growth IT and SaaS company in Bengaluru deploying AI agents and dealing with non-human identity sprawl' },
    { label: 'Ahmedabad Retail & Multi-Branch Distributor', value: 'A consumer retail distribution network in Ahmedabad modernizing inventory across 40+ branches on SAP B1' },
    { label: 'Chennai Heavy Engineering & EPC Firm', value: 'A heavy engineering and infrastructure contractor in Chennai executing project-based workflows' },
    { label: 'Delhi-NCR Logistics & Supply Chain Fleet', value: 'A nationwide third-party logistics firm in Gurugram automating warehouse dispatch and labour compliance' }
  ];

  const handleAddKeyword = () => {
    if (!keywordInput.trim()) return;
    const newKws = keywordInput
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k && !params.targetKeywords.includes(k));
    
    onChange({
      ...params,
      targetKeywords: [...params.targetKeywords, ...newKws],
    });
    setKeywordInput('');
  };

  const handleRemoveKeyword = (index: number) => {
    const updated = [...params.targetKeywords];
    updated.splice(index, 1);
    onChange({
      ...params,
      targetKeywords: updated,
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 sm:p-6 space-y-5 shadow-lg text-slate-100">
      {/* Channel Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-white">Content Creation Engine</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/60 font-semibold">
              {channel === 'embee-blog' && 'Embee Website Blog'}
              {channel === 'linkedin' && 'LinkedIn Multi-Format Pack'}
              {channel === 'guest-post' && 'Guest Article & Editor Pitch'}
              {channel === 'third-party' && 'Third-Party Deep Dive'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {channel === 'embee-blog' && '1,600+ words, answer-capsules, verified Embee solution link, no em-dashes, 8th-grade style.'}
            {channel === 'linkedin' && 'Executive hook, carousel slide outline, newsletter article, discussion poll, and banner text.'}
            {channel === 'guest-post' && 'Vendor-neutral authority piece for CIO.com/ETCIO with editor pitch email and author bio.'}
            {channel === 'third-party' && 'Story-driven essay for Medium/Substack with takeaways and canonical tag guidance.'}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenTemplates}
          className="self-start sm:self-auto text-xs px-3 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-800/60 flex items-center space-x-1.5 transition cursor-pointer font-medium"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Pick from Topics Matrix</span>
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onGenerate();
        }}
        className="space-y-4"
      >
        {/* Topic Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1">
            Article / Content Topic <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            value={params.topic}
            onChange={(e) => onChange({ ...params, topic: e.target.value })}
            placeholder="e.g. Agent 365: Microsoft Control Plane for Enterprise AI Agents"
            className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {/* Focus Keyword & Primary Solution URL Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Focus Keyword */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Focus Keyword <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={params.focusKeyword}
              onChange={(e) => onChange({ ...params, focusKeyword: e.target.value })}
              placeholder="e.g. Agent 365"
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <p className="text-[11px] text-slate-400 mt-1">Must appear in H1 and first sentence.</p>
          </div>

          {/* Primary Solution URL */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-200">
                Primary Solution Page Link (for 1st Paragraph)
              </label>
              <button
                type="button"
                onClick={onOpenLinks}
                className="text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer"
              >
                Browse Library
              </button>
            </div>
            <select
              value={params.primarySolutionUrl || ''}
              onChange={(e) => onChange({ ...params, primarySolutionUrl: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">-- Auto-select matching solution URL --</option>
              {solutionLinks.map((link, idx) => (
                <option key={idx} value={link.url}>
                  [{link.category}] {link.title}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              Guidelines require hyperlinking the focus keyword to an approved solution page.
            </p>
          </div>
        </div>

        {/* Secondary Target Keywords Chips */}
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1">
            Secondary Keywords (Used throughout naturally)
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddKeyword();
                }
              }}
              placeholder="Type keyword and press Enter or Add (e.g. Entra Agent ID, shadow AI, Copilot)..."
              className="flex-1 px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <button
              type="button"
              onClick={handleAddKeyword}
              className="px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-medium transition cursor-pointer flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Chips list */}
          {params.targetKeywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {params.targetKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-blue-950 text-blue-300 border border-blue-800/60 text-xs"
                >
                  <span>{kw}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(i)}
                    className="hover:text-white cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Indian Enterprise Scenario */}
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1">
            Indian Enterprise Scenario
          </label>
          <select
            value={params.indianScenario || ''}
            onChange={(e) => onChange({ ...params, indianScenario: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">-- Choose a pre-crafted Indian enterprise scenario --</option>
            {indianScenarios.map((sc, idx) => (
              <option key={idx} value={sc.value}>
                {sc.label}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-400 mt-1">
            Gives real regional credibility (e.g. Pune auto manufacturing, Mumbai BFSI, Bengaluru IT).
          </p>
        </div>

        {/* Toggle Advanced Controls */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center space-x-1 transition cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showAdvanced ? 'Hide Advanced Settings' : 'Show Advanced Settings (Word count, publication, author perspective)'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Advanced Settings Drawer */}
        {showAdvanced && (
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3.5 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Target Word Count
                </label>
                <select
                  value={params.wordCountTarget || 1600}
                  onChange={(e) => onChange({ ...params, wordCountTarget: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                >
                  <option value={1200}>1,200 words (Standard)</option>
                  <option value={1600}>1,600 words (Embee Target)</option>
                  <option value={2000}>2,000 words (Comprehensive Deep-Dive)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Target Publication (for Guest Post / 3rd Party)
                </label>
                <input
                  type="text"
                  value={params.publicationName || ''}
                  onChange={(e) => onChange({ ...params, publicationName: e.target.value })}
                  placeholder="e.g. CIO.com, YourStory, ETCIO, Medium"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Author Persona / Byline
                </label>
                <input
                  type="text"
                  value={params.authorRole || ''}
                  onChange={(e) => onChange({ ...params, authorRole: e.target.value })}
                  placeholder="e.g. Enterprise Cloud Practice Lead"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Custom Instructions or Specific Angles
              </label>
              <textarea
                rows={2}
                value={params.customInstructions || ''}
                onChange={(e) => onChange({ ...params, customInstructions: e.target.value })}
                placeholder="e.g. Emphasize the difference between per-user vs capacity credits, and add a checklist for plant heads."
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white resize-none"
              />
            </div>
          </div>
        )}

        {/* Channel Guidelines Strip for Blog */}
        {channel === 'embee-blog' && (
          <div className="p-3 bg-blue-950/30 border border-blue-900/40 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2 text-blue-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="font-medium">SEO & AEO Architecture:</span>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] text-slate-300">
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">7-8 Internal Embee Links</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">1-2 Authoritative Outside Links</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">AEO Answer Capsules (60%)</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Full SEO Meta Block</span>
            </div>
          </div>
        )}

        {/* Submit Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Zero em-dashes • Verified URLs • 8th-grade style</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
            {/* Step 1: Pre-Writing Research (recommended for embee-blog) */}
            {channel === 'embee-blog' && onRunResearch && (
              <button
                type="button"
                onClick={onRunResearch}
                disabled={isResearching || isLoading || !params.topic || !params.focusKeyword}
                className={`w-full sm:w-auto px-4 py-3 rounded-xl font-semibold text-xs flex items-center justify-center space-x-2 transition cursor-pointer border ${
                  isResearching || isLoading || !params.topic || !params.focusKeyword
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700'
                    : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-600/40 hover:border-amber-500'
                }`}
              >
                {isResearching ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
                    <span>Researching 2026 Topic Benchmarks...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Step 1: Conduct Research & Link Mapping</span>
                  </>
                )}
              </button>
            )}

            {/* Step 2: Full Drafting Button */}
            <button
              type="submit"
              disabled={isLoading || isResearching || !params.topic || !params.focusKeyword}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition cursor-pointer shadow-lg ${
                isLoading || isResearching || !params.topic || !params.focusKeyword
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/20'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Drafting Complete Publish-Ready Content...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-white" />
                  <span>
                    {channel === 'embee-blog'
                      ? 'Draft Full 1,600-Word Blog'
                      : channel === 'linkedin'
                      ? 'Generate LinkedIn Multi-Pack'
                      : channel === 'guest-post'
                      ? 'Generate Guest Article'
                      : 'Generate Third-Party Article'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
