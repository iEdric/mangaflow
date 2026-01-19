import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { MangaProject, MangaPage, MangaPanel } from './types';
import { MangaStyle } from './types';
import Sidebar from './components/Sidebar';
import MangaCanvas from './components/MangaCanvas';
import LanguageSwitcher from './components/LanguageSwitcher';
import { generateStoryline, generatePanelImage } from './services/modelScopeService';
import { useLanguage } from './contexts/LanguageContext';

const App: React.FC = () => {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<MangaProject[]>(() => {
    const saved = localStorage.getItem('mangaflow_projects');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStyle, setNewStyle] = useState(MangaStyle.CLASSIC_SHONEN);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    localStorage.setItem('mangaflow_projects', JSON.stringify(projects));
  }, [projects]);

  const activeProject = projects.find(p => p.id === currentProjectId);

  const handleNewProject = () => {
    setIsCreating(true);
  };

  const createProject = async () => {
    if (!newTitle.trim() || !newDescription.trim()) return;
    
    setIsGenerating(true);
    const result = await generateStoryline(newDescription, newStyle);
    
    if (result) {
      const newProject: MangaProject = {
        id: uuidv4(),
        title: result.title || newTitle,
        description: newDescription,
        style: newStyle,
        createdAt: Date.now(),
        pages: [
          {
            id: uuidv4(),
            panels: result.panels.map((p: any) => ({
              id: uuidv4(),
              prompt: p.prompt,
              caption: p.caption,
              imageUrl: null,
              status: 'idle'
            }))
          }
        ]
      };
      
      setProjects([newProject, ...projects]);
      setCurrentProjectId(newProject.id);
      setIsCreating(false);
      setNewTitle('');
      setNewDescription('');
      
      // Auto-trigger image generation for all panels
      triggerBulkPanelGeneration(newProject.id);
    }
    setIsGenerating(false);
  };

  const triggerBulkPanelGeneration = async (projectId: string) => {
    const project = projects.find(p => p.id === projectId) || projects[0];
    if (!project) return;

    for (const panel of project.pages[0].panels) {
      await regeneratePanel(projectId, panel.id);
    }
  };

  const regeneratePanel = async (projectId: string, panelId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        pages: p.pages.map(page => ({
          ...page,
          panels: page.panels.map(panel => 
            panel.id === panelId ? { ...panel, status: 'generating' } : panel
          )
        }))
      };
    }));

    const project = projects.find(p => p.id === projectId);
    const panel = project?.pages[0].panels.find(p => p.id === panelId);
    
    if (panel) {
      const imageUrl = await generatePanelImage(panel.prompt, project?.style || MangaStyle.CLASSIC_SHONEN);
      
      setProjects(prev => prev.map(p => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          pages: p.pages.map(page => ({
            ...page,
            panels: page.panels.map(panelItem => 
              panelItem.id === panelId 
                ? { ...panelItem, imageUrl, status: imageUrl ? 'completed' : 'error' } 
                : panelItem
            )
          }))
        };
      }));
    }
  };

  const updatePanel = (panelId: string, updates: Partial<MangaPanel>) => {
    if (!currentProjectId) return;
    setProjects(prev => prev.map(p => {
      if (p.id !== currentProjectId) return p;
      return {
        ...p,
        pages: p.pages.map(page => ({
          ...page,
          panels: page.panels.map(panel => 
            panel.id === panelId ? { ...panel, ...updates } : panel
          )
        }))
      };
    }));
  };

  const deleteProject = (id: string) => {
    if (confirm(t.common.deleteConfirm)) {
      setProjects(prev => prev.filter(p => p.id !== id));
      if (currentProjectId === id) setCurrentProjectId(null);
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-900 font-sans">
      <Sidebar 
        projects={projects}
        currentProjectId={currentProjectId}
        onSelectProject={setCurrentProjectId}
        onNewProject={handleNewProject}
        onDeleteProject={deleteProject}
      />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            {activeProject ? (
              <>
                <h2 className="font-bold text-slate-800">{activeProject.title}</h2>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] uppercase font-bold tracking-wider">
                  {activeProject.style.split(' ')[0]}
                </span>
              </>
            ) : (
              <span className="text-slate-400">{t.header.selectOrCreate}</span>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors" title={t.header.settings}>
              <i className="fas fa-cog"></i>
            </button>
          </div>
        </header>

        {activeProject ? (
          <MangaCanvas 
            project={activeProject} 
            onUpdatePanel={updatePanel}
            onRegeneratePanel={(pid) => regeneratePanel(activeProject.id, pid)}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
             <div className="w-32 h-32 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300 mb-8 border-4 border-dashed border-slate-200">
               <i className="fas fa-plus text-5xl"></i>
             </div>
             <h3 className="manga-font text-4xl mb-4">{t.emptyState.startYourStory}</h3>
             <p className="text-slate-500 max-w-md mb-8">
               {t.emptyState.description}
             </p>
             <button 
                onClick={handleNewProject}
                className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
             >
                {t.emptyState.createFirstManga}
             </button>
          </div>
        )}

        {/* Create Modal */}
        {isCreating && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200">
              <div className="p-8 border-b border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold text-slate-800">{t.createModal.title}</h2>
                  <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600">
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>
                <p className="text-slate-500">{t.createModal.description}</p>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase mb-2">{t.createModal.seriesTitle}</label>
                  <input 
                    type="text" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder={t.createModal.seriesTitlePlaceholder}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase mb-2">{t.createModal.premise}</label>
                  <textarea 
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    rows={4}
                    placeholder={t.createModal.premisePlaceholder}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase mb-2">{t.createModal.visualStyle}</label>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.values(MangaStyle).map(style => {
                      // Map style enum to translation key
                      const styleMap: Record<string, keyof typeof t.styles> = {
                        [MangaStyle.CLASSIC_SHONEN]: 'classicshonen',
                        [MangaStyle.SEINEN_NOIR]: 'seinennoir',
                        [MangaStyle.KAWAII_SHOUJO]: 'kawaiishoujo',
                        [MangaStyle.CYBERPUNK_MECHA]: 'cyberpunkmecha',
                        [MangaStyle.GOTHIC_HORROR]: 'gothichorror'
                      };
                      const styleKey = styleMap[style];
                      const styleLabel = styleKey ? t.styles[styleKey] : style;
                      return (
                        <button
                          key={style}
                          onClick={() => setNewStyle(style)}
                          className={`p-3 text-left rounded-xl border-2 transition-all ${
                            newStyle === style 
                              ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                              : 'border-slate-100 hover:border-slate-300 bg-slate-50'
                          }`}
                        >
                          <span className="font-medium">{styleLabel}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50 flex items-center justify-end gap-4">
                <button 
                  onClick={() => setIsCreating(false)}
                  className="px-6 py-2 text-slate-600 font-bold hover:text-slate-900"
                >
                  {t.createModal.cancel}
                </button>
                <button 
                  disabled={isGenerating || !newTitle || !newDescription}
                  onClick={createProject}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <i className="fas fa-spinner animate-spin"></i>
                      {t.createModal.storyboarding}
                    </>
                  ) : t.createModal.generateManga}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
