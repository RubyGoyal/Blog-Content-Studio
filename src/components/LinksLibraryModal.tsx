import React, { useState } from 'react';
import { X, Search, Copy, Check, ExternalLink, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { EMBEE_INTERNAL_LINKS, InternalLinkItem } from '../data/embeeLinks.js';

interface LinksLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLink?: (url: string, title: string) => void;
}

export const LinksLibraryModal: React.FC<LinksLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectLink,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = ['All', 'Solutions', 'HR / Octane HRMS', 'ERP / SAP', 'Blog Posts', 'Case Studies', 'Contact'];

  const filteredLinks = EMBEE_INTERNAL_LINKS.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.keywords && item.keywords.some((k) => k.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-blue-900/50 text-blue-400 border border-blue-700/50">
              <LinkIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Embee Software Internal Links Library</h3>
              <p className="text-xs text-slate-400">
                Official, verified URLs. Use ONLY these approved links in drafts; never invent a URL.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/40 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search links by topic, title, keyword (e.g. Copilot, DPDP, S/4HANA, Payroll)..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Links List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredLinks.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No matching internal links found for "{searchTerm}".
            </div>
          ) : (
            filteredLinks.map((link, idx) => {
              const isCopied = copiedUrl === link.url;
              return (
                <div
                  key={idx}
                  className="p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-white group-hover:text-blue-300 transition">
                        {link.title}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-mono">
                        {link.category}
                      </span>
                      {link.category === 'Solutions' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                          Recommended for Intro
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-blue-400 font-mono break-all">{link.url}</div>
                    {link.description && (
                      <p className="text-xs text-slate-400 line-clamp-1">{link.description}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                    {onSelectLink && (
                      <button
                        onClick={() => {
                          onSelectLink(link.url, link.title);
                          onClose();
                        }}
                        className="px-2.5 py-1 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition cursor-pointer"
                      >
                        Use in Post
                      </button>
                    )}

                    <button
                      onClick={() => handleCopy(`[${link.title}](${link.url})`)}
                      className="px-2.5 py-1 text-xs font-medium bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition flex items-center space-x-1 cursor-pointer"
                      title="Copy as Markdown Link [Title](URL)"
                    >
                      <Copy className="w-3 h-3" />
                      <span>MD Link</span>
                    </button>

                    <button
                      onClick={() => handleCopy(link.url)}
                      className="p-1.5 text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition cursor-pointer"
                      title="Copy plain URL"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <LinkIcon className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Note */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Rule: Pick the solution page matching your focus keyword for the 1st paragraph link.</span>
          </div>
          <span className="text-slate-500">{filteredLinks.length} total links available</span>
        </div>
      </div>
    </div>
  );
};
