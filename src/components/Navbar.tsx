import React from 'react';
import { 
  FileText, 
  Link as LinkIcon, 
  BookOpen, 
  Sparkles, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { ContentChannel } from '../types.js';

interface NavbarProps {
  activeChannel: ContentChannel;
  onChannelChange: (channel: ContentChannel) => void;
  onOpenLinks: () => void;
  onOpenGuidelines: () => void;
  onOpenTemplates: () => void;
  savedDraftCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeChannel,
  onChannelChange,
  onOpenLinks,
  onOpenGuidelines,
  onOpenTemplates,
  savedDraftCount,
}) => {
  const channels: { id: ContentChannel; label: string; badge: string; icon: string }[] = [
    { id: 'embee-blog', label: 'Embee Website Blog', badge: '1,600w SEO/AEO', icon: '🌐' },
    { id: 'linkedin', label: 'LinkedIn Multi-Pack', badge: 'Posts & Carousel', icon: '💼' },
    { id: 'guest-post', label: 'Guest Post', badge: 'CIO.com / ETCIO', icon: '✍️' },
    { id: 'third-party', label: 'Third-Party / Medium', badge: 'Deep-dive Essay', icon: '📰' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-xl shadow-inner shadow-blue-400/20">
              E
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white tracking-tight">Embee Software</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800/80 font-medium">
                  Content Studio
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <span>Microsoft Frontier Partner</span>
                <span>•</span>
                <span>SAP Partner</span>
              </div>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onOpenTemplates}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
              title="Browse pre-crafted topic templates"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Topics Matrix</span>
            </button>

            <button
              onClick={onOpenLinks}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
              title="Official Embee Internal Links Library"
            >
              <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Links Library</span>
            </button>

            <button
              onClick={onOpenGuidelines}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
              title="Embee Brand & Editorial Guidelines"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Brand Rules</span>
            </button>
          </div>
        </div>
      </div>

      {/* Channel Tabs */}
      <div className="bg-slate-950/80 border-t border-slate-800/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none">
            {channels.map((ch) => {
              const isActive = activeChannel === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => onChannelChange(ch.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <span>{ch.icon}</span>
                  <span className="font-semibold">{ch.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-blue-800 text-blue-100'
                        : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                    }`}
                  >
                    {ch.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
