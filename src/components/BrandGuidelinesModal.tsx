import React from 'react';
import { X, ShieldCheck, CheckCircle2, XCircle, AlertTriangle, BookCheck } from 'lucide-react';

interface BrandGuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrandGuidelinesModal: React.FC<BrandGuidelinesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/60">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Embee Software Editorial & Brand Guidelines</h3>
              <p className="text-xs text-slate-400">Strict rules enforced by our AI auditor for all published content</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs leading-relaxed">
          {/* Strict Brand Rules */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-emerald-400 flex items-center space-x-1.5">
              <BookCheck className="w-4 h-4" />
              <span>Non-Negotiable Brand Rules (Zero Tolerance)</span>
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl space-y-1.5">
                <div className="flex items-center space-x-1 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Always write "Embee Software" in full</span>
                </div>
                <p className="text-slate-300">
                  Never write standalone "Embee". Always include the full company name on first and subsequent mentions.
                </p>
                <div className="text-[11px] font-mono text-red-400 line-through">"Embee helps enterprises..."</div>
                <div className="text-[11px] font-mono text-emerald-300">"Embee Software helps enterprises..."</div>
              </div>

              <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl space-y-1.5">
                <div className="flex items-center space-x-1 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Microsoft Frontier Partner</span>
                </div>
                <p className="text-slate-300">
                  Always use the designation "Microsoft Frontier Partner". Never refer to legacy "Gold Partner".
                </p>
                <div className="text-[11px] font-mono text-red-400 line-through">"A Microsoft Gold Partner..."</div>
                <div className="text-[11px] font-mono text-emerald-300">"As a Microsoft Frontier Partner..."</div>
              </div>

              <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl space-y-1.5">
                <div className="flex items-center space-x-1 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>NO Em/En Dashes (— or –)</span>
                </div>
                <p className="text-slate-300">
                  Strict zero-dash rule. Use commas, full stops, or split into two clean declarative sentences.
                </p>
                <div className="text-[11px] font-mono text-red-400 line-through">"The platform is fast — very fast."</div>
                <div className="text-[11px] font-mono text-emerald-300">"The platform is fast, and very responsive."</div>
              </div>

              <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl space-y-1.5">
                <div className="flex items-center space-x-1 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>8th-Grade Reading Level</span>
                </div>
                <p className="text-slate-300">
                  Short sentences. Plain words. Confident, helpful tone without self-aggrandizing hype or buzzwords.
                </p>
                <div className="text-[11px] font-mono text-slate-400">Aim for ~15 words per sentence average.</div>
              </div>
            </div>
          </div>

          {/* 10-Part Structure for Website Blog */}
          <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl space-y-3">
            <h4 className="text-sm font-bold text-blue-400">The 10-Part Embee Software Website Blog Formula</h4>
            <ol className="list-decimal list-inside space-y-2 text-slate-300">
              <li><strong className="text-white">H1 Title:</strong> Must naturally contain the focus keyword.</li>
              <li><strong className="text-white">TL;DR:</strong> 50 to 80 words summarizing the post (bold prefix).</li>
              <li><strong className="text-white">Introduction:</strong> 150 to 200 words. First sentence must contain the focus keyword hyperlinked to the most relevant embee.co.in solution page.</li>
              <li><strong className="text-white">Key Takeaways:</strong> 5 to 6 concise bullet points.</li>
              <li><strong className="text-white">5 to 7 H2 Sections:</strong> ~60% in "Answer Capsule" format (H2 is a question; first 30-50 words directly answer it).</li>
              <li><strong className="text-white">Length:</strong> ~1,600 words total (up to ~2,000 words for deep-dives).</li>
              <li><strong className="text-white">Indian Enterprise Scenarios:</strong> 1 or 2 realistic examples (e.g. Pune manufacturer, Mumbai BFSI, Bengaluru IT, Ahmedabad distributor).</li>
              <li><strong className="text-white">Conclusion & CTA:</strong> Invite reader to book a free assessment or consultation with Embee Software.</li>
              <li><strong className="text-white">FAQ:</strong> Exactly 5 questions and concise answers.</li>
              <li><strong className="text-white">Meta and Publishing Fields Block:</strong> Focus keyword, Meta title, Meta description, Meta keywords, Alt text for banner image, Tags, Suggested slug.</li>
            </ol>
          </div>

          {/* Approved Links Rule */}
          <div className="p-4 bg-cyan-950/40 border border-cyan-800/60 rounded-xl space-y-2">
            <h4 className="text-sm font-bold text-cyan-300">Internal Links Rules</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>Use <strong>ONLY</strong> the verified URLs in the Embee Internal Links Library.</li>
              <li><strong>NEVER</strong> invent, assume, or hallucinate an `embee.co.in` URL.</li>
              <li>Aim for <strong>5 to 8 internal links</strong> distributed smoothly across the post.</li>
              <li>Use at most 1 to 2 external links to authoritative documentation (Microsoft, SAP, Gartner).</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
