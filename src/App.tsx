import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  History, 
  Copy, 
  FileText,
  Layers,
  Wand2
} from 'lucide-react';
import { Navbar } from './components/Navbar.js';
import { ContentForm } from './components/ContentForm.js';
import { ContentPreview } from './components/ContentPreview.js';
import { ComplianceAuditor } from './components/ComplianceAuditor.js';
import { ResearchPanel } from './components/ResearchPanel.js';
import { LinksLibraryModal } from './components/LinksLibraryModal.js';
import { BrandGuidelinesModal } from './components/BrandGuidelinesModal.js';
import { TopicTemplatesModal } from './components/TopicTemplatesModal.js';
import { ContentChannel, GenerationParams, GeneratedPost, AuditResult, ResearchBrief, InfographicItem } from './types.js';
import { SAMPLE_TOPICS, SampleTopic } from './data/sampleTopics.js';
import { auditEmbeeContent } from './lib/contentAuditor.js';

export default function App() {
  const [activeChannel, setActiveChannel] = useState<ContentChannel>('embee-blog');
  const [workspaceTab, setWorkspaceTab] = useState<'draft' | 'research'>('draft');
  
  // Modals state
  const [isLinksOpen, setIsLinksOpen] = useState(false);
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);

  // Current Form state
  const [params, setParams] = useState<GenerationParams>({
    topic: 'Agent 365: Microsoft Control Plane for Enterprise AI Agents',
    focusKeyword: 'Agent 365',
    targetKeywords: ['Microsoft Agent 365', 'AI agent governance', 'Entra Agent ID', 'agent registry', 'shadow AI'],
    channel: 'embee-blog',
    primarySolutionUrl: 'https://embee.co.in/solutions/identity-and-access-management/',
    wordCountTarget: 1600,
    indianScenario: 'A mid-sized BFSI enterprise in Mumbai managing DPDP Act consent compliance and hybrid cloud audit trails',
    publicationName: '',
    authorRole: 'Senior Partner, Cybersecurity & Cloud Solutions',
    customInstructions: '',
  });

  // Generated Content State
  const [currentMarkdown, setCurrentMarkdown] = useState<string>('');
  const [audit, setAudit] = useState<AuditResult | undefined>(undefined);
  const [infographics, setInfographics] = useState<InfographicItem[]>([]);
  const [isGeneratingInfographics, setIsGeneratingInfographics] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRepurposing, setIsRepurposing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Research Brief State
  const [researchBrief, setResearchBrief] = useState<ResearchBrief | null>(null);
  const [isResearching, setIsResearching] = useState(false);

  // Drafts history list
  const [savedDrafts, setSavedDrafts] = useState<GeneratedPost[]>([]);

  // Keep channel in sync with params
  useEffect(() => {
    setParams((prev) => ({ ...prev, channel: activeChannel }));
  }, [activeChannel]);

  // Re-audit content when markdown or focusKeyword changes
  useEffect(() => {
    if (currentMarkdown) {
      const result = auditEmbeeContent(currentMarkdown, params.focusKeyword, activeChannel);
      setAudit(result);
    }
  }, [currentMarkdown, params.focusKeyword, activeChannel]);

  // Handle running pre-writing research
  const handleRunResearch = async () => {
    if (!params.topic || !params.focusKeyword) return;
    setIsResearching(true);
    setError(null);
    try {
      const response = await fetch('/api/research-topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: params.topic,
          focusKeyword: params.focusKeyword,
          targetKeywords: params.targetKeywords,
          primarySolutionUrl: params.primarySolutionUrl,
          indianScenario: params.indianScenario,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to conduct pre-writing research');
      }

      const data = await response.json();
      setResearchBrief(data.brief);
      setWorkspaceTab('research');
    } catch (err: any) {
      console.error('Research error:', err);
      setError(err.message || 'Failed to conduct topic research.');
    } finally {
      setIsResearching(false);
    }
  };

  // Handle generating content (with optional research brief)
  const handleGenerate = async (briefToUse?: ResearchBrief) => {
    setIsLoading(true);
    setError(null);
    try {
      const activeBrief = briefToUse || researchBrief;
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...params,
          channel: activeChannel,
          researchBrief: activeBrief,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to generate content');
      }

      const data = await response.json();
      setCurrentMarkdown(data.markdown);
      setAudit(data.audit);
      if (data.infographics && data.infographics.length > 0) {
        setInfographics(data.infographics);
      }
      setWorkspaceTab('draft');

      // Save to drafts history
      const newDraft: GeneratedPost = {
        id: Date.now().toString(),
        title: params.topic,
        channel: activeChannel,
        markdown: data.markdown,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        params: { ...params },
        audit: data.audit,
        infographics: data.infographics || [],
      };
      setSavedDrafts((prev) => [newDraft, ...prev.slice(0, 9)]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during generation.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle regenerating or generating standalone infographics
  const handleGenerateInfographics = async () => {
    if (!params.topic || !params.focusKeyword) return;
    setIsGeneratingInfographics(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-infographics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: params.topic,
          focusKeyword: params.focusKeyword,
          markdownSummary: currentMarkdown.slice(0, 1500),
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.infographics && data.infographics.length > 0) {
          setInfographics(data.infographics);
        }
      }
    } catch (err: any) {
      console.error('Infographics generation error:', err);
    } finally {
      setIsGeneratingInfographics(false);
    }
  };

  // Handle repurposing content into another channel
  const handleRepurpose = async (targetChannel: ContentChannel) => {
    if (!currentMarkdown) return;
    setIsRepurposing(true);
    setError(null);
    try {
      const response = await fetch('/api/repurpose-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceMarkdown: currentMarkdown,
          targetChannel,
          focusKeyword: params.focusKeyword,
          customNotes: params.customInstructions,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to repurpose content');
      }

      const data = await response.json();
      setActiveChannel(targetChannel);
      setCurrentMarkdown(data.markdown);
      setAudit(data.audit);

      const newDraft: GeneratedPost = {
        id: Date.now().toString(),
        title: `${params.topic} (${targetChannel})`,
        channel: targetChannel,
        markdown: data.markdown,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        params: { ...params, channel: targetChannel },
        audit: data.audit,
      };
      setSavedDrafts((prev) => [newDraft, ...prev.slice(0, 9)]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to repurpose content.');
    } finally {
      setIsRepurposing(false);
    }
  };

  // Auto-Fix typography & brand rule issues directly in the text
  const handleAutoFix = () => {
    if (!currentMarkdown) return;

    let fixed = currentMarkdown;

    // 1. Replace em dashes (—) and en dashes (–) with commas or periods
    fixed = fixed.replace(/ — /g, ', ');
    fixed = fixed.replace(/ – /g, ', ');
    fixed = fixed.replace(/—/g, ', ');
    fixed = fixed.replace(/–/g, ', ');

    // 2. Fix standalone "Embee" -> "Embee Software" (careful with existing "Embee Software")
    fixed = fixed.replace(/\bEmbee(?!\s+Software)\b/gi, 'Embee Software');

    // 3. Fix "Gold Partner" -> "Microsoft Frontier Partner"
    fixed = fixed.replace(/\bGold\s+Partner\b/gi, 'Microsoft Frontier Partner');

    setCurrentMarkdown(fixed);
  };

  // Load a topic template from the matrix
  const handleSelectTopic = (topic: SampleTopic) => {
    setParams({
      topic: topic.title,
      focusKeyword: topic.focusKeyword,
      targetKeywords: topic.secondaryKeywords,
      channel: topic.defaultChannel,
      primarySolutionUrl: topic.suggestedSolutionLink,
      wordCountTarget: 1600,
      indianScenario: 'A mid-sized Indian enterprise balancing compliance, cost control, and rapid cloud adoption',
      publicationName: '',
      authorRole: 'Enterprise Technology Practice Lead',
      customInstructions: '',
    });
    setActiveChannel(topic.defaultChannel);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeChannel={activeChannel}
        onChannelChange={(ch) => setActiveChannel(ch)}
        onOpenLinks={() => setIsLinksOpen(true)}
        onOpenGuidelines={() => setIsGuidelinesOpen(true)}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        savedDraftCount={savedDrafts.length}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Error Banner */}
        {error && (
          <div className="p-4 bg-rose-950/80 border border-rose-800 rounded-xl text-xs text-rose-200 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-rose-400 hover:text-white text-xs underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Input Form Section */}
        <section aria-label="Content Parameters">
          <ContentForm
            channel={activeChannel}
            params={params}
            onChange={setParams}
            onGenerate={() => handleGenerate()}
            onRunResearch={handleRunResearch}
            isLoading={isLoading}
            isResearching={isResearching}
            onOpenTemplates={() => setIsTemplatesOpen(true)}
            onOpenLinks={() => setIsLinksOpen(true)}
          />
        </section>

        {/* Output & Auditor Dual View */}
        <section aria-label="Content Results & Audit" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            {/* View Selector Tabs (Draft / Research Brief) */}
            <div className="flex items-center justify-between bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 text-xs">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setWorkspaceTab('draft')}
                  className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center space-x-2 transition cursor-pointer ${
                    workspaceTab === 'draft'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Publish Draft & SEO Meta</span>
                  {currentMarkdown && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-700/60 text-blue-200">
                      Ready
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setWorkspaceTab('research')}
                  className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center space-x-2 transition cursor-pointer ${
                    workspaceTab === 'research'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Topic Research & Link Strategy</span>
                  {researchBrief && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/80 text-emerald-300 border border-emerald-700/60">
                      Grounded
                    </span>
                  )}
                </button>
              </div>

              {workspaceTab === 'draft' && currentMarkdown && (
                <div className="hidden sm:flex items-center text-[11px] text-slate-400 space-x-2 pr-2">
                  <span>10-part structure • Verified links</span>
                </div>
              )}
            </div>

            {workspaceTab === 'draft' ? (
              <ContentPreview
                markdown={currentMarkdown}
                onMarkdownChange={setCurrentMarkdown}
                channel={activeChannel}
                topic={params.topic}
                focusKeyword={params.focusKeyword}
                audit={audit}
                infographics={infographics}
                onRepurpose={handleRepurpose}
                isRepurposing={isRepurposing}
                onGenerateInfographics={handleGenerateInfographics}
                isGeneratingInfographics={isGeneratingInfographics}
              />
            ) : (
              <ResearchPanel
                brief={researchBrief}
                isLoading={isResearching}
                onRunResearch={handleRunResearch}
                onGenerateWithResearch={(brief) => handleGenerate(brief)}
                topic={params.topic}
                focusKeyword={params.focusKeyword}
                isDraftGenerating={isLoading}
              />
            )}
          </div>

          {/* Right Sidebar: Auditor & Recent Drafts (1 col) */}
          <div className="space-y-6">
            {/* Real-time Quality & Brand Auditor */}
            <ComplianceAuditor
              audit={audit}
              onAutoFix={handleAutoFix}
              channel={activeChannel}
            />

            {/* Recent Drafts Tray */}
            {savedDrafts.length > 0 && (
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-200">
                    <History className="w-3.5 h-3.5 text-blue-400" />
                    <span>Recent Session Drafts ({savedDrafts.length})</span>
                  </div>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {savedDrafts.map((draft) => (
                    <button
                      key={draft.id}
                      onClick={() => {
                        setCurrentMarkdown(draft.markdown);
                        setActiveChannel(draft.channel);
                        setParams(draft.params);
                        setAudit(draft.audit);
                        if (draft.infographics && draft.infographics.length > 0) {
                          setInfographics(draft.infographics);
                        }
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition group cursor-pointer"
                    >
                      <div className="text-xs font-semibold text-white group-hover:text-blue-300 truncate">
                        {draft.title}
                      </div>
                      <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                        <span className="capitalize font-mono px-1.5 py-0.5 rounded bg-slate-700">
                          {draft.channel}
                        </span>
                        <span>{draft.createdAt}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900 text-slate-400 text-xs py-4 text-center mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Embee Software Content Studio • Microsoft Frontier Partner • SAP Partner
          </div>
          <div className="text-[11px] text-slate-500">
            Internal Links Library: 25+ approved URLs • Zero em/en dashes enforced
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LinksLibraryModal
        isOpen={isLinksOpen}
        onClose={() => setIsLinksOpen(false)}
        onSelectLink={(url) => setParams((prev) => ({ ...prev, primarySolutionUrl: url }))}
      />

      <BrandGuidelinesModal
        isOpen={isGuidelinesOpen}
        onClose={() => setIsGuidelinesOpen(false)}
      />

      <TopicTemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTopic={handleSelectTopic}
      />
    </div>
  );
}
