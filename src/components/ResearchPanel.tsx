import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  FileText, 
  ExternalLink, 
  Link as LinkIcon, 
  HelpCircle, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  RefreshCw, 
  BookOpen, 
  Layers, 
  TrendingUp, 
  ShieldAlert,
  Sliders,
  Copy,
  Check
} from 'lucide-react';
import { ResearchBrief } from '../types.js';

interface ResearchPanelProps {
  brief?: ResearchBrief | null;
  isLoading: boolean;
  onRunResearch: () => void;
  onGenerateWithResearch: (brief: ResearchBrief) => void;
  topic?: string;
  focusKeyword?: string;
  isDraftGenerating?: boolean;
}

export const ResearchPanel: React.FC<ResearchPanelProps> = ({
  brief,
  isLoading,
  onRunResearch,
  onGenerateWithResearch,
  topic = '',
  focusKeyword = '',
  isDraftGenerating = false,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 1800);
  };

  if (!brief && !isLoading) {
    return (
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 text-center space-y-4 text-slate-200">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-900/60 to-indigo-900/60 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400 shadow-inner">
          <Search className="w-7 h-7" />
        </div>
        <div className="space-y-1.5 max-w-lg mx-auto">
          <h3 className="text-base font-bold text-white">Pre-Writing Topic Intelligence & SEO/AEO Blueprint</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Conduct strategic market research before drafting. Gathers verified 2026 industry statistics, maps out 7-8 internal Embee links, selects 1-2 authoritative external citations, and plans AEO Answer Capsules.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={onRunResearch}
            disabled={!topic || !focusKeyword}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-lg shadow-blue-900/40 flex items-center space-x-2 mx-auto transition cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Conduct Pre-Writing Research & Link Mapping</span>
          </button>
          {(!topic || !focusKeyword) && (
            <p className="text-[11px] text-amber-400/80 mt-2">
              Please enter a Topic and Focus Keyword first.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-10 text-center space-y-4 text-slate-200">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mx-auto" />
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white">Analyzing Search Intent & Mapping Enterprise Links...</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Extracting 2026 benchmarks, structuring 7-8 internal links across solutions/blogs/case studies, and drafting AEO Answer Capsules for "{focusKeyword}".
          </p>
        </div>
      </div>
    );
  }

  if (!brief) return null;

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-xl text-slate-100 space-y-5 p-5 sm:p-6">
      {/* Top Banner & Next Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-md bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-semibold uppercase">
              Phase 1 Complete
            </span>
            <span className="text-xs text-slate-400">Research & Link Blueprint Ready</span>
          </div>
          <h3 className="text-base font-bold text-white">
            Topic Intelligence: {brief.topic}
          </h3>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={onRunResearch}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition cursor-pointer border border-slate-700"
            title="Re-run research"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onGenerateWithResearch(brief)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-md flex items-center space-x-2 transition cursor-pointer"
          >
            <span>Draft Full 1,600-Word Blog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of Key Research Findings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Card 1: Search Intent & Persona */}
        <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2.5">
          <div className="flex items-center space-x-2 text-blue-400 font-semibold">
            <TrendingUp className="w-4 h-4" />
            <span>Search Intent & Persona</span>
          </div>
          <div className="space-y-1.5">
            <div>
              <span className="text-[10px] text-slate-400 block">Primary Intent:</span>
              <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-medium text-[11px] inline-block border border-blue-800/60">
                {brief.searchIntent?.primaryIntent || 'Commercial / Technical'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Target Enterprise Reader:</span>
              <span className="text-slate-200 font-medium text-[11px] leading-snug">
                {brief.searchIntent?.readerProfile || 'CIO, CISO, Head of Infrastructure'}
              </span>
            </div>
            {brief.searchIntent?.queryVariations && (
              <div>
                <span className="text-[10px] text-slate-400 block">Google Search Queries:</span>
                <ul className="text-[10px] text-slate-300 space-y-0.5 list-disc pl-3">
                  {brief.searchIntent.queryVariations.slice(0, 3).map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: 1-2 Outside Authoritative Citations */}
        <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2.5">
          <div className="flex items-center space-x-2 text-amber-400 font-semibold">
            <ExternalLink className="w-4 h-4" />
            <span>Outside Authority Links (1-2 Only)</span>
          </div>
          <div className="space-y-2">
            {brief.externalCitations && brief.externalCitations.length > 0 ? (
              brief.externalCitations.slice(0, 2).map((cit, idx) => (
                <div key={idx} className="p-2 bg-slate-900/80 rounded-lg border border-slate-800 text-[11px] space-y-0.5">
                  <div className="font-semibold text-slate-200 truncate">{cit.title}</div>
                  <div className="text-[10px] text-blue-400 truncate flex items-center space-x-1">
                    <span className="px-1 py-0.2 bg-slate-800 rounded text-[9px] text-slate-300">{cit.domain || 'Official'}</span>
                    <span className="truncate">{cit.url}</span>
                  </div>
                  {cit.context && <p className="text-[10px] text-slate-400 italic">"{cit.context}"</p>}
                </div>
              ))
            ) : (
              <p className="text-[11px] text-slate-400">1 to 2 authoritative citations mapped.</p>
            )}
          </div>
        </div>

        {/* Card 3: Indian Enterprise Scenario */}
        <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2.5">
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
            <Building2 className="w-4 h-4" />
            <span>Indian Enterprise Scenario</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            {brief.scenarioOutline || 'Enterprise manufacturing or BFSI scenario tailored to Indian regulatory compliance (DPDP, RBI, CERT-In).'}
          </p>
        </div>
      </div>

      {/* Key Proof Points & Statistics */}
      {brief.keyProofPoints && brief.keyProofPoints.length > 0 && (
        <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/60 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              <span>Grounded Proof Points & Industry Benchmarks to Weave In</span>
            </div>
            <span className="text-[10px] text-slate-400">Hard quantitative facts for credibility</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {brief.keyProofPoints.map((item, idx) => (
              <div key={idx} className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wide">
                    {item.source}
                  </span>
                </div>
                <div className="font-semibold text-slate-200 text-[11px]">{item.stat}</div>
                <p className="text-[10px] text-slate-400">{item.insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strategic Internal Links Mapping (7-8 Required) */}
      <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
            <LinkIcon className="w-4 h-4 text-emerald-400" />
            <span>Target Internal Link Mapping (7-8 Embee URLs Planned)</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-medium">
            {brief.internalLinkStrategy?.length || 0} Links Mapped
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs max-h-56 overflow-y-auto pr-1">
          {brief.internalLinkStrategy?.map((link, idx) => {
            const isFirst = idx === 0;
            return (
              <div 
                key={idx} 
                className={`p-2.5 rounded-lg border text-xs space-y-1 ${
                  isFirst 
                    ? 'bg-blue-950/40 border-blue-800/80' 
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] px-1.5 py-0.5 rounded uppercase font-bold bg-slate-800 text-slate-300">
                    {link.category || 'Solution'}
                  </span>
                  {isFirst && (
                    <span className="text-[9px] text-amber-300 font-semibold bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/60">
                      Opening Sentence Link
                    </span>
                  )}
                </div>
                <div className="font-semibold text-slate-200 text-[11px] truncate">
                  {link.title}
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Anchor: <strong className="text-white">"{link.anchorSuggestion}"</strong></span>
                  <span className="text-slate-500 italic text-[9px] truncate max-w-[120px]">{link.sectionTarget}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Planned AEO Question Capsules */}
      {brief.aeoQuestionCapsules && brief.aeoQuestionCapsules.length > 0 && (
        <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/60 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>AEO Answer Capsules (Engineered for Google AI Overviews & Perplexity)</span>
            </div>
            <span className="text-[10px] text-slate-400">Direct 30-50 word answers before technical expansion</span>
          </div>

          <div className="space-y-2">
            {brief.aeoQuestionCapsules.map((capsule, idx) => (
              <div key={idx} className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-cyan-300 flex items-center space-x-1.5">
                  <span className="w-4 h-4 rounded-full bg-cyan-950 border border-cyan-800 text-[10px] flex items-center justify-center text-cyan-200 shrink-0">
                    {idx + 1}
                  </span>
                  <span>{capsule.question}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed pl-5 border-l-2 border-cyan-600/40">
                  {capsule.capsuleAnswer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom CTA to Generate */}
      <div className="pt-2 flex items-center justify-between">
        <div className="text-xs text-slate-400">
          All proof points, internal URLs, and AEO capsules will be passed into the drafting engine.
        </div>
        <button
          onClick={() => onGenerateWithResearch(brief)}
          disabled={isDraftGenerating}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-950/40 flex items-center space-x-2 transition cursor-pointer disabled:opacity-50"
        >
          {isDraftGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Generating Draft from Research...</span>
            </>
          ) : (
            <>
              <span>Generate Full AEO & SEO Blog Draft</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
