import React from 'react';
import type { MangaProject } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  projects: MangaProject[];
  currentProjectId: string | null;
  onSelectProject: (id: string) => void;
  onNewProject: () => void;
  onDeleteProject: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ projects, currentProjectId, onSelectProject, onNewProject, onDeleteProject }) => {
  const { t } = useLanguage();
  return (
    <div className="w-72 bg-slate-900 h-full flex flex-col border-r border-slate-800 text-slate-300">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <i className="fas fa-pen-nib text-xl"></i>
          </div>
          <h1 className="text-xl font-bold text-white manga-font tracking-wider">MANGAFLOW</h1>
        </div>
        
        <button 
          onClick={onNewProject}
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20"
        >
          <i className="fas fa-plus"></i>
          {t.sidebar.newProject}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2 mb-4">{t.sidebar.yourLibrary}</h2>
        <div className="space-y-2">
          {projects.map(project => (
            <div 
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className={`group relative p-3 rounded-xl cursor-pointer transition-all border ${
                currentProjectId === project.id 
                  ? 'bg-slate-800 border-indigo-500 text-white shadow-md shadow-indigo-500/10' 
                  : 'border-transparent hover:bg-slate-800/50 hover:text-slate-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5 max-w-[80%]">
                  <span className="font-medium truncate">{project.title}</span>
                  <span className="text-[10px] text-slate-500">{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteProject(project.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:text-red-400 transition-opacity"
                >
                  <i className="fas fa-trash-can text-sm"></i>
                </button>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <div className="text-center py-10 px-4">
              <i className="fas fa-book-open text-slate-700 text-3xl mb-3 block"></i>
              <p className="text-sm text-slate-500">{t.sidebar.noProjects}</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-700"></div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-200">{t.sidebar.studioMaster}</span>
            <span className="text-[10px] text-slate-500">{t.sidebar.proAccount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
