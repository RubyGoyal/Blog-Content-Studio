import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Wand2, 
  ExternalLink,
  BookOpen,
  FileCheck,
  Check
} from 'lucide-react';
import { AuditResult } from '../types.js';

interface ComplianceAuditorProps {
  audit?: AuditResult;
  onAutoFix?: () => void;
  channel: string;
}

export const ComplianceAuditor: React.FC<ComplianceAuditorProps> = ({
  audit,
  onAutoFix,
  channel,
}) => {
  if (!audit) {
    return (
      <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl text-center text-xs text-slate-400">
        Generate or paste content to run the automatic Embee Software Brand & Quality Audit.
      </div>
    );
  }

  const { score, passed, checks, stats } = audit;

  const getScoreColor = (s: number) => {
    if (s >= 90) return 'text-emerald-400 border-emerald-500 bg-emerald-950/40';
    if (s >= 75) return 'text-amber-400 border-amber-500 bg-amber-950/40';
    return 'text-rose-400 border-rose-500 bg-rose-950/40';
  };

  const hasFixableIssues = stats.emDashCount > 0 || stats.bareEmbeeCount > 0 || stats.goldPartnerCount > 0;

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 sm:p-5 space-y-4 shadow-md text-slate-100">
      {/* Header with Score */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-blue-950 text-blue-400 border border-blue-800/60">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Brand & Editorial Audit</h4>
            <p className="text-[11px] text-slate-400">
              Evaluated against Embee Software House Style & AEO rules
            </p>
          </div>
        </div>

        {/* Score Pill */}
        <div className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center space-x-1.5 ${getScoreColor(score)}`}>
          <span>{score}% Score</span>
          {passed ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5" />
          )}
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
        <div className="p-2 bg-slate-800/60 rounded-xl border border-slate-700/50">
          <div className="text-slate-400 text-[10px]">Word Count</div>
          <div className="font-bold text-white text-sm mt-0.5">{stats.wordCount.toLocaleString()}</div>
        </div>

        <div className="p-2 bg-slate-800/60 rounded-xl border border-slate-700/50">
          <div className="text-slate-400 text-[10px]">Internal Links</div>
          <div className={`font-bold text-sm mt-0.5 ${stats.internalLinkCount >= 7 ? 'text-emerald-400' : stats.internalLinkCount >= 4 ? 'text-amber-400' : 'text-rose-400'}`}>
            {stats.internalLinkCount} (Goal: 7-8)
          </div>
          <div className="text-[9px] text-slate-400 truncate">
            {stats.solutionLinkCount || 0}s / {stats.blogLinkCount || 0}b / {stats.caseStudyLinkCount || 0}cs
          </div>
        </div>

        <div className="p-2 bg-slate-800/60 rounded-xl border border-slate-700/50">
          <div className="text-slate-400 text-[10px]">Outside Links</div>
          <div className={`font-bold text-sm mt-0.5 ${stats.externalLinkCount >= 1 && stats.externalLinkCount <= 2 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {stats.externalLinkCount} (1-2 max)
          </div>
          <div className="text-[9px] text-slate-400 truncate">
            {stats.externalLinkCount > 2 ? 'Reduce links' : stats.externalLinkCount === 0 ? 'Need 1 citation' : 'Authoritative'}
          </div>
        </div>

        <div className="p-2 bg-slate-800/60 rounded-xl border border-slate-700/50">
          <div className="text-slate-400 text-[10px]">AEO Capsules</div>
          <div className="font-bold text-cyan-400 text-sm mt-0.5">{Math.round(stats.capsuleRatio * 100)}%</div>
          <div className="text-[9px] text-slate-400 truncate">
            {stats.capsuleH2Count}/{stats.h2Count} H2s
          </div>
        </div>

        <div className="p-2 bg-slate-800/60 rounded-xl border border-slate-700/50 col-span-2 sm:col-span-1">
          <div className="text-slate-400 text-[10px]">SEO Meta Block</div>
          <div className={`font-bold text-sm mt-0.5 ${stats.hasMetaBlock ? 'text-emerald-400' : 'text-rose-400'}`}>
            {stats.hasMetaBlock ? 'Validated' : 'Missing'}
          </div>
          <div className="text-[9px] text-slate-400 truncate">
            {stats.metaFields?.metaTitle ? `${stats.metaFields.metaTitle.length}ch title` : 'Check block'}
          </div>
        </div>
      </div>

      {/* Auto-Fix Action if errors present */}
      {hasFixableIssues && onAutoFix && (
        <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl flex items-center justify-between text-xs">
          <div className="space-y-0.5 text-amber-200">
            <span className="font-semibold block">Quick Auto-Fix Available</span>
            <span className="text-[11px] text-amber-300/80">
              Clean {stats.emDashCount} dashes, {stats.bareEmbeeCount} brand names, and partner designations in 1 click.
            </span>
          </div>
          <button
            onClick={onAutoFix}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium flex items-center space-x-1.5 transition cursor-pointer shrink-0"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Auto-Fix</span>
          </button>
        </div>
      )}

      {/* Detailed Checklist */}
      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {checks.map((check) => {
          let statusIcon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
          let borderClass = 'border-slate-800 bg-slate-800/40';

          if (check.status === 'fail') {
            statusIcon = <XCircle className="w-4 h-4 text-rose-400 shrink-0" />;
            borderClass = 'border-rose-900/50 bg-rose-950/20';
          } else if (check.status === 'warn') {
            statusIcon = <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
            borderClass = 'border-amber-900/40 bg-amber-950/20';
          }

          return (
            <div key={check.id} className={`p-2.5 rounded-xl border text-xs flex items-start space-x-2.5 ${borderClass}`}>
              {statusIcon}
              <div className="flex-1 space-y-0.5">
                <div className="font-semibold text-slate-200">{check.title}</div>
                <p className="text-slate-300 text-[11px]">{check.message}</p>
                {check.suggestion && (
                  <p className="text-blue-300/80 text-[10px] italic">Tip: {check.suggestion}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
