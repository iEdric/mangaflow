export type Language = 'en' | 'zh';

export const translations = {
  en: {
    // Sidebar
    sidebar: {
      newProject: "New Project",
      yourLibrary: "Your Library",
      noProjects: "No projects yet. Start by creating a new story!",
      studioMaster: "Studio Master",
      proAccount: "Pro Account"
    },
    // App Header
    header: {
      selectOrCreate: "Select or create a project to begin",
      settings: "Settings"
    },
    // Empty State
    emptyState: {
      startYourStory: "Start Your Story",
      description: "Create high-quality manga from just a text prompt. Describe your universe, and let AI handle the artwork.",
      createFirstManga: "Create First Manga"
    },
    // Create Modal
    createModal: {
      title: "New Comic Series",
      description: "Describe the premise and choose your visual aesthetic.",
      seriesTitle: "Series Title",
      seriesTitlePlaceholder: "e.g. Neon Horizon",
      premise: "The Premise",
      premisePlaceholder: "e.g. In a world where gravity is a currency, a young mechanic discovers a secret floating island...",
      visualStyle: "Visual Style",
      cancel: "Cancel",
      generateManga: "Generate Manga",
      storyboarding: "Storyboarding..."
    },
    // Manga Canvas
    canvas: {
      vol: "Vol. 01",
      page: "Page",
      inkingPanel: "Inking Panel...",
      noImageGenerated: "No image generated yet",
      generateImage: "Generate Image",
      regenerate: "Regenerate",
      editPrompt: "Edit Prompt",
      editPanelPrompt: "Edit panel prompt:"
    },
    // Manga Styles
    styles: {
      classicshonen: "Classic Shonen (Dynamic, detailed, ink lines)",
      seinennoir: "Seinen Noir (High contrast, gritty, realistic shades)",
      kawaiishoujo: "Kawaii Shoujo (Soft lines, floral patterns, dreamy)",
      cyberpunkmecha: "Cyberpunk Mecha (Neon accents, sharp metal, futuristic)",
      gothichorror: "Gothic Horror (Dark, eerie, victorian vibes)"
    },
    // Common
    common: {
      deleteConfirm: "Are you sure you want to delete this manga?"
    }
  },
  zh: {
    // Sidebar
    sidebar: {
      newProject: "新建项目",
      yourLibrary: "你的作品库",
      noProjects: "还没有项目。开始创建你的第一个故事吧！",
      studioMaster: "工作室大师",
      proAccount: "专业账户"
    },
    // App Header
    header: {
      selectOrCreate: "选择或创建一个项目开始",
      settings: "设置"
    },
    // Empty State
    emptyState: {
      startYourStory: "开始你的故事",
      description: "只需一个文本提示即可创建高质量漫画。描述你的世界，让AI处理艺术作品。",
      createFirstManga: "创建第一个漫画"
    },
    // Create Modal
    createModal: {
      title: "新漫画系列",
      description: "描述前提并选择你的视觉风格。",
      seriesTitle: "系列标题",
      seriesTitlePlaceholder: "例如：霓虹地平线",
      premise: "故事前提",
      premisePlaceholder: "例如：在一个重力是货币的世界里，一位年轻的机械师发现了一个秘密的浮岛...",
      visualStyle: "视觉风格",
      cancel: "取消",
      generateManga: "生成漫画",
      storyboarding: "分镜中..."
    },
    // Manga Canvas
    canvas: {
      vol: "第 01 卷",
      page: "第",
      inkingPanel: "绘制中...",
      noImageGenerated: "尚未生成图片",
      generateImage: "生成图片",
      regenerate: "重新生成",
      editPrompt: "编辑提示",
      editPanelPrompt: "编辑面板提示："
    },
    // Manga Styles
    styles: {
      classicshonen: "经典少年漫（动态、细致、墨线）",
      seinennoir: "青年黑漫（高对比、粗犷、写实阴影）",
      kawaiishoujo: "可爱少女漫（柔和线条、花卉图案、梦幻）",
      cyberpunkmecha: "赛博朋克机甲（霓虹点缀、锐利金属、未来感）",
      gothichorror: "哥特恐怖（黑暗、诡异、维多利亚风格）"
    },
    // Common
    common: {
      deleteConfirm: "确定要删除这个漫画吗？"
    }
  }
};
