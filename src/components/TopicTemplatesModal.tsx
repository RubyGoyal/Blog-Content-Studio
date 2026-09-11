import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, Layers, Shield, Database, Users } from 'lucide-react';
import { SAMPLE_TOPICS, SampleTopic } from '../data/sampleTopics.js';

interface TopicTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic: (topic: SampleTopic) => void;
}

export const TopicTemplatesModal: React.FC<TopicTemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTopic,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Microsoft & Cloud', 'Cybersecurity & DPDP', 'SAP & ERP', 'HR & Workforce'];

  const filteredTopics = SAMPLE_TOPICS.filter(
    (t) => selectedCategory === 'All' || t.category === selectedCategory
  );

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Microsoft & Cloud':
        return <Layers className="w-4 h-4 text-blue-400" />;
      case 'Cybersecurity & DPDP':
        return <Shield className="w-4 h-4 text-rose-400" />;
      case 'SAP & ERP':
        return <Database className="w-4 h-4 text-amber-400" />;
      case 'HR & Workforce':
        return <Users className="w-4 h-4 text-emerald-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-amber-950/60 text-amber-400 border border-amber-800/60">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Topics Matrix & Editorial Prompts</h3>
              <p className="text-xs text-slate-400">Pre-curated enterprise topics with verified solution links and target keywords</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-950/40 flex flex-wrap gap-2 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Topic Cards Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTopics.map((topic) => (
            <div
              key={topic.id}
              className="p-4 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition flex flex-col justify-between space-y-3 group hover:border-blue-500/50"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-400">
                    {getCategoryIcon(topic.category)}
                    <span>{topic.category}</span>
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                    {topic.defaultChannel}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition line-clamp-2">
                  {topic.title}
                </h4>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {topic.summary}
                </p>

                <div className="pt-1">
                  <div className="text-[11px] text-slate-400 font-medium">
                    Focus: <span className="text-amber-300 font-semibold">{topic.focusKeyword}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {topic.secondaryKeywords.slice(0, 3).map((kw, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 bg-slate-900 text-slate-400 rounded">
                        {kw}
                      </span>
                    ))}
                    {topic.secondaryKeywords.length > 3 && (
                      <span className="text-[10px] text-slate-500">+{topic.secondaryKeywords.length - 3}</span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectTopic(topic);
                  onClose();
                }}
                className="w-full mt-2 py-2 px-3 bg-blue-600/90 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 transition cursor-pointer"
              >
                <span>Load Template into Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 text-right">
          Click any card to load all keywords and matching solution links directly.
        </div>
      </div>
    </div>
  );
};
