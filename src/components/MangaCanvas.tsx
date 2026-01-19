import React from 'react';
import type { MangaProject, MangaPanel } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface MangaCanvasProps {
  project: MangaProject;
  onUpdatePanel: (panelId: string, updates: Partial<MangaPanel>) => void;
  onRegeneratePanel: (panelId: string) => void;
}

const MangaCanvas: React.FC<MangaCanvasProps> = ({ project, onUpdatePanel, onRegeneratePanel }) => {
  const { t } = useLanguage();
  const currentPage = project.pages[0]; // Simplified for now

  return (
    <div className="flex-1 bg-slate-100 overflow-y-auto p-8 flex justify-center">
      <div className="w-full max-w-[1000px]">
        <div className="bg-white shadow-2xl rounded-none border-[12px] border-slate-900 min-h-[1400px] p-8 flex flex-col gap-8">
          <div className="flex justify-between items-end border-b-2 border-slate-900 pb-4">
            <h1 className="manga-font text-5xl text-slate-900 uppercase tracking-tighter">{project.title}</h1>
            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-1">{t.canvas.vol}</span>
              <span className="marker-font text-2xl text-slate-900">{t.canvas.page} 1</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 flex-1">
            {currentPage.panels.map((panel, idx) => (
              <div 
                key={panel.id} 
                className={`relative group overflow-hidden border-4 border-slate-900 min-h-[400px] transition-all bg-slate-50 ${
                  idx === 0 ? 'col-span-2 h-[500px]' : ''
                }`}
              >
                {panel.status === 'generating' && (
                  <div className="absolute inset-0 bg-slate-900/80 z-20 flex flex-col items-center justify-center text-white p-6 text-center">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="marker-font text-xl mb-2">{t.canvas.inkingPanel}</p>
                    <p className="text-xs text-slate-400 max-w-[250px]">{panel.prompt}</p>
                  </div>
                )}

                {panel.imageUrl ? (
                  <img 
                    src={panel.imageUrl} 
                    alt={panel.prompt} 
                    className="w-full h-full object-cover grayscale brightness-110" 
                  />
                ) : panel.status !== 'generating' && (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400 italic">
                    <i className="fas fa-image text-4xl mb-4 opacity-20"></i>
                    <p>{t.canvas.noImageGenerated}</p>
                    <button 
                      onClick={() => onRegeneratePanel(panel.id)}
                      className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-md not-italic hover:bg-slate-800 transition-colors"
                    >
                      {t.canvas.generateImage}
                    </button>
                  </div>
                )}

                {/* Caption / Dialogue Bubble Overlay */}
                <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
                  <div className="bg-white border-2 border-slate-900 px-4 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative inline-block max-w-[80%] pointer-events-auto">
                    <textarea
                      value={panel.caption}
                      onChange={(e) => onUpdatePanel(panel.id, { caption: e.target.value })}
                      className="w-full bg-transparent border-none focus:ring-0 text-slate-900 font-bold uppercase text-sm resize-none tracking-tight leading-none h-auto overflow-hidden text-center"
                      rows={2}
                    />
                    <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white border-r-2 border-b-2 border-slate-900 rotate-45 transform"></div>
                  </div>
                </div>

                {/* Edit Controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onRegeneratePanel(panel.id)}
                    className="w-10 h-10 bg-white border-2 border-slate-900 rounded-full flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-colors shadow-lg"
                    title={t.canvas.regenerate}
                  >
                    <i className="fas fa-rotate"></i>
                  </button>
                  <button 
                    className="w-10 h-10 bg-white border-2 border-slate-900 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors shadow-lg"
                    title={t.canvas.editPrompt}
                    onClick={() => {
                      const newPrompt = prompt(t.canvas.editPanelPrompt, panel.prompt);
                      if (newPrompt) onUpdatePanel(panel.id, { prompt: newPrompt });
                    }}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-8 border-t border-slate-200 flex justify-center">
             <div className="w-12 h-12 border-2 border-slate-900 rounded-full flex items-center justify-center marker-font text-lg">1</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MangaCanvas;
