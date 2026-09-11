import React, { useState } from 'react';
import { 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Check, 
  Download, 
  Layers, 
  ArrowRight, 
  Share2, 
  Palette, 
  Type, 
  Layout, 
  ShieldCheck, 
  Cpu, 
  Workflow, 
  Database, 
  Users, 
  FileCheck, 
  CheckCircle2, 
  TrendingUp, 
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { InfographicItem } from '../types.js';

interface InfographicCardProps {
  infographics: InfographicItem[];
  topic: string;
  focusKeyword: string;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

export const InfographicCard: React.FC<InfographicCardProps> = ({
  infographics,
  topic,
  focusKeyword,
  onRegenerate,
  isRegenerating = false,
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!infographics || infographics.length === 0) {
    return (
      <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl text-center space-y-3">
        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mx-auto text-blue-400">
          <Layout className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-white">Crisp Infographic Blueprints</h4>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Generate 1-2 crisp, publication-ready infographic blueprints complete with micro-copy, visual flow, color codes, and design reference links for Canva or Figma.
        </p>
        {onRegenerate && (
          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold inline-flex items-center space-x-2 transition cursor-pointer disabled:opacity-50"
          >
            {isRegenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
            <span>Generate 1-2 Infographics</span>
          </button>
        )}
      </div>
    );
  }

  const currentInfo = infographics[activeIdx] || infographics[0];

  const handleCopySpec = (info: InfographicItem) => {
    const specMarkdown = `# Infographic Design Brief: ${info.title}
**Topic:** ${topic}
**Focus Keyword:** ${focusKeyword}
**Format:** ${info.targetFormat}
**Layout Style:** ${info.type.toUpperCase()}
**Design Inspiration Reference:** ${info.designReference.url} (${info.designReference.title})

## Recommended Color Palette
- Primary Brand: ${info.colorPalette.primary} (Embee Deep Navy)
- Secondary: ${info.colorPalette.secondary} (Azure Blue)
- Accent: ${info.colorPalette.accent} (Cyan Glow)
- Background: ${info.colorPalette.background}

## Key Stat / Callout Banner
"${info.keyCallout}"

## Structured Micro-Copy & Visual Nodes
${info.nodes
  .map(
    (n, idx) =>
      `### Node ${n.stepNumber || idx + 1}: ${n.title}
- Icon Suggestion: ${n.iconHint || 'Standard B2B Icon'}
- Micro-Copy: ${n.description}`
  )
  .join('\n\n')}

## Footer Brand Badge
"Embee Software • Microsoft Frontier Partner • embee.co.in"
Design Notes: ${info.designReference.notes}`;

    navigator.clipboard.writeText(specMarkdown);
    setCopiedId(info.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getNodeIcon = (iconHint?: string) => {
    switch (iconHint?.toLowerCase()) {
      case 'shield':
      case 'shieldcheck':
      case 'security':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'cpu':
      case 'ai':
      case 'agent':
        return <Cpu className="w-4 h-4 text-cyan-400" />;
      case 'workflow':
      case 'process':
        return <Workflow className="w-4 h-4 text-blue-400" />;
      case 'database':
      case 'storage':
        return <Database className="w-4 h-4 text-purple-400" />;
      case 'users':
      case 'team':
        return <Users className="w-4 h-4 text-amber-400" />;
      case 'compliance':
      case 'audit':
        return <FileCheck className="w-4 h-4 text-teal-400" />;
      default:
        return <TrendingUp className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-4 sm:p-6 space-y-5 shadow-xl text-slate-100">
      {/* Top Header & Infographic Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center space-x-2">
              <Layout className="w-4 h-4 text-cyan-400" />
              <span>Crisp Infographic Blueprints ({infographics.length})</span>
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-semibold">
              Designer-Ready Specs
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Crisp visual frameworks with verified layout inspiration links, micro-copy, and brand color codes.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Infographic 1 vs 2 switcher */}
          <div className="flex bg-slate-800 p-0.5 rounded-xl border border-slate-700 text-xs">
            {infographics.map((info, idx) => (
              <button
                key={info.id || idx}
                onClick={() => setActiveIdx(idx)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  activeIdx === idx
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Infographic #{idx + 1}
              </button>
            ))}
          </div>

          {onRegenerate && (
            <button
              onClick={onRegenerate}
              disabled={isRegenerating}
              title="Regenerate Infographic Concepts"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-xl text-xs transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Active Infographic Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-blue-950/60 text-blue-300 border border-blue-800/50 font-medium">
            Format: {currentInfo.targetFormat}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
            Type: {currentInfo.type.replace('-', ' ').toUpperCase()}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Design Reference Link */}
          {currentInfo.designReference?.url && (
            <a
              href={currentInfo.designReference.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-gradient-to-r from-cyan-900/60 to-blue-900/60 hover:from-cyan-800/60 hover:to-blue-800/60 text-cyan-200 border border-cyan-700/50 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
            >
              <span>Design Reference Link</span>
              <ExternalLink className="w-3 h-3 text-cyan-300" />
            </a>
          )}

          {/* Copy Brief Button */}
          <button
            onClick={() => handleCopySpec(currentInfo)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer"
          >
            {copiedId === currentInfo.id ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied Brief!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-300" />
                <span>Copy Designer Brief</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interactive Visual Mockup / Diagram Card */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-700 rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative grid background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Infographic Top Brand Strip */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-5">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold">
              Infographic Architecture
            </div>
            <h4 className="text-base sm:text-lg font-extrabold text-white tracking-tight mt-0.5">
              {currentInfo.title}
            </h4>
            {currentInfo.subtitle && (
              <p className="text-xs text-slate-400 mt-0.5">{currentInfo.subtitle}</p>
            )}
          </div>

          <div className="text-right shrink-0">
            <span className="text-[11px] font-bold text-slate-300 tracking-wide block">
              Embee Software
            </span>
            <span className="text-[9px] text-cyan-400/80 block">
              Microsoft Frontier Partner
            </span>
          </div>
        </div>

        {/* Highlight Callout Stat Banner */}
        {currentInfo.keyCallout && (
          <div className="relative z-10 mb-6 p-3 rounded-xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-cyan-950/70 border border-blue-700/40 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 text-cyan-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-semibold text-white">Key Insight / Data Callout:</span>
              <span className="text-cyan-200">{currentInfo.keyCallout}</span>
            </div>
            <span className="hidden sm:inline-block text-[10px] text-slate-400 uppercase tracking-wider font-mono">
              Stat Anchor
            </span>
          </div>
        )}

        {/* Infographic Flow Nodes (Grid / Sequence) */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {currentInfo.nodes.map((node, index) => (
            <div
              key={index}
              className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col justify-between transition group shadow-md"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-lg bg-blue-900/60 border border-blue-700/60 text-blue-300 text-[11px] font-bold flex items-center justify-center">
                    {node.stepNumber || index + 1}
                  </span>
                  <div className="p-1 rounded-md bg-slate-800 text-slate-400 group-hover:text-cyan-400 transition">
                    {getNodeIcon(node.iconHint)}
                  </div>
                </div>

                <div className="font-bold text-xs sm:text-sm text-white group-hover:text-cyan-200 transition line-clamp-2">
                  {node.title}
                </div>

                <p className="text-xs text-slate-300/90 leading-relaxed">
                  {node.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
                <span>Icon: {node.iconHint || 'Metric'}</span>
                <span className="text-slate-400 font-mono">Node #{index + 1}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Infographic Footer Strip */}
        <div className="relative z-10 mt-6 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-300">Embee Software</span>
            <span>•</span>
            <span>embee.co.in</span>
            <span>•</span>
            <span className="text-cyan-400">Enterprise Cloud & AI Practice</span>
          </div>

          <div className="text-[10px] text-slate-500">
            Source: Embee Software Research & Microsoft Enterprise Documentation
          </div>
        </div>
      </div>

      {/* Design Specs & Color Palette Guide */}
      <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-300 font-semibold">
            <Palette className="w-4 h-4 text-cyan-400" />
            <span>Design System Specifications for Visual Designer</span>
          </div>
          <span className="text-[10px] text-slate-400">
            Canva / Figma Compatible
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-slate-400 text-[10px]">Primary Navy</div>
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#0B192C] border border-slate-600" />
              <code className="text-white font-mono">{currentInfo.colorPalette?.primary || '#0B192C'}</code>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-slate-400 text-[10px]">Secondary Azure</div>
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#0078D4] border border-slate-600" />
              <code className="text-white font-mono">{currentInfo.colorPalette?.secondary || '#0078D4'}</code>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-slate-400 text-[10px]">Accent Cyan</div>
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#00E5FF] border border-slate-600" />
              <code className="text-white font-mono">{currentInfo.colorPalette?.accent || '#00E5FF'}</code>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-slate-400 text-[10px]">Display & Body Fonts</div>
            <div className="text-white font-medium">
              Outfit / Montserrat + Inter
            </div>
          </div>
        </div>

        {currentInfo.designReference?.notes && (
          <div className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-900">
            <strong>Designer Note:</strong> {currentInfo.designReference.notes}
          </div>
        )}
      </div>
    </div>
  );
};
