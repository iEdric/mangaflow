export interface MangaPanel {
  id: string;
  prompt: string;
  imageUrl: string | null;
  caption: string;
  status: 'idle' | 'generating' | 'completed' | 'error';
}

export interface MangaPage {
  id: string;
  panels: MangaPanel[];
}

export interface MangaProject {
  id: string;
  title: string;
  description: string;
  pages: MangaPage[];
  style: string;
  createdAt: number;
}

export enum MangaStyle {
  CLASSIC_SHONEN = "Classic Shonen (Dynamic, detailed, ink lines)",
  SEINEN_NOIR = "Seinen Noir (High contrast, gritty, realistic shades)",
  KAWAII_SHOUJO = "Kawaii Shoujo (Soft lines, floral patterns, dreamy)",
  CYBERPUNK_MECHA = "Cyberpunk Mecha (Neon accents, sharp metal, futuristic)",
  GOTHIC_HORROR = "Gothic Horror (Dark, eerie, victorian vibes)"
}

