/**
 * ModelScope API Service for Image Generation
 * Replaces Gemini API with ModelScope API
 * Based on ModelScope async task mode
 */

const ENDPOINT = 'https://api-inference.modelscope.cn';

interface TaskResponse {
  task_id: string;
}

interface TaskStatusResponse {
  task_status: 'PENDING' | 'RUNNING' | 'SUCCEED' | 'FAILED';
  output_images?: string[];
  error_message?: string;
  message?: string;
}

/**
 * Get API key from environment variable
 * In Vite, environment variables are exposed via import.meta.env
 * Variables defined in vite.config.ts define block are available here
 */
const getApiKey = (): string => {
  // Try multiple possible env variable names
  // @ts-ignore - Vite defines these at build time via define
  let key = import.meta.env.MODELSCOPE_API_KEY 
    || import.meta.env.VITE_MODELSCOPE_API_KEY 
    || import.meta.env.API_KEY 
    || import.meta.env.VITE_API_KEY
    || '';
  
  // Temporary fallback for testing (remove in production)
  if (!key) {
    key = 'ms-1b3c1a50-fea6-4962-b9d2-ec7b99dd936e';
    console.warn('ModelScopeService - Using hardcoded API key (temporary fallback)');
  }
  
  // Debug: log detailed info
  console.log('ModelScopeService.getApiKey - Debug info:', {
    'import.meta.env.MODELSCOPE_API_KEY': import.meta.env.MODELSCOPE_API_KEY ? '***' : 'undefined',
    'import.meta.env.VITE_MODELSCOPE_API_KEY': import.meta.env.VITE_MODELSCOPE_API_KEY ? '***' : 'undefined',
    'import.meta.env.API_KEY': import.meta.env.API_KEY ? '***' : 'undefined',
    'import.meta.env.VITE_API_KEY': import.meta.env.VITE_API_KEY ? '***' : 'undefined',
    'key found': !!key,
    'key length': key.length
  });
  
  if (!key) {
    console.error('ModelScopeService - API key not found!');
    console.error('ModelScopeService - Please check:');
    console.error('  1. .env file exists in project root');
    console.error('  2. .env file contains: MODELSCOPE_API_KEY=your_key');
    console.error('  3. Development server was restarted after creating/updating .env');
  } else {
    console.log('ModelScopeService - API key found, length:', key.length);
  }
  
  return key;
};

/**
 * Check if we should use proxy (development mode)
 */
const useProxy = (): boolean => {
  // @ts-ignore
  return import.meta.env.DEV || import.meta.env.MODE === 'development';
};

/**
 * Get base URL (proxy in dev, direct in prod)
 */
const getBaseUrl = (): string => {
  return useProxy() ? '/api/modelscope' : ENDPOINT;
};

/**
 * Common headers for API requests
 */
const getHeaders = (): Record<string, string> => {
  return {
    "Authorization": `Bearer ${getApiKey()}`,
    "Content-Type": "application/json",
  };
};

/**
 * Process image response
 * Since CDN (like Alibaba Cloud OSS) may not have CORS headers,
 * directly return the URL for browser to load
 */
const processImageResponse = async (imageUrl: string): Promise<string> => {
  // If already a full HTTP/HTTPS URL, return directly
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    console.log('ModelScopeService - Returning image URL directly:', imageUrl);
    return imageUrl;
  }
  
  // If data URL or blob URL, return directly
  if (imageUrl.startsWith('data:') || imageUrl.startsWith('blob:')) {
    return imageUrl;
  }
  
  // Try to fetch and convert to blob URL (may fail due to CORS)
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.warn('ModelScopeService - Failed to fetch image, returning URL directly:', error);
    // If fetch fails, return URL directly (browser will try to load it)
    return imageUrl;
  }
};

/**
 * Create an image generation task
 */
const createImageTask = async (prompt: string): Promise<string | null> => {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/v1/images/generations`;
  
  const requestBody = {
    model: "Qwen/Qwen-Image",
    // Optional: You can add loras configuration here if needed
    // loras: "<lora-repo-id>", // for single LoRA
    // loras: {"<lora-repo-id1>": 0.6, "<lora-repo-id2>": 0.4}, // for multiple LoRAs
    prompt: prompt,
  };

  console.log('ModelScopeService.createImageTask - Making request to:', url);
  console.log('ModelScopeService.createImageTask - Using proxy:', useProxy());
  console.log('ModelScopeService.createImageTask - Request body:', requestBody);

  try {
    const headers: Record<string, string> = {
      ...getHeaders(),
      // Always add async mode header (required by ModelScope API)
      "X-ModelScope-Async-Mode": "true"
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody),
      mode: 'cors'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ModelScopeService.createImageTask - API error:', response.status, errorText);
      
      // Check for CORS errors
      if (response.status === 0 || errorText.includes('CORS') || errorText.includes('cors')) {
        throw new Error(`CORS_ERROR: Browser CORS policy blocked the request. Please configure Vite proxy. Details: ${errorText}`);
      }
      
      // Check for authentication errors
      if (response.status === 401) {
        throw new Error(`AUTH_ERROR: Authentication failed. Please check your API key. Details: ${errorText}`);
      }
      
      throw new Error(`API_ERROR: ${response.status} - ${errorText}`);
    }

    const data: TaskResponse = await response.json();
    console.log('ModelScopeService.createImageTask - Task created, task_id:', data.task_id);
    return data.task_id;
  } catch (error: any) {
    console.error('ModelScopeService.createImageTask - Error:', error);
    throw error;
  }
};

/**
 * Poll task status until completion
 */
const pollTaskStatus = async (taskId: string): Promise<string> => {
  const baseUrl = getBaseUrl();
  const statusUrl = `${baseUrl}/v1/tasks/${taskId}`;
  const MAX_WAIT = 5 * 60 * 1000; // 5 minutes timeout
  const POLL_INTERVAL = 5000; // Poll every 5 seconds
  const startTime = Date.now();

  console.log('ModelScopeService.pollTaskStatus - Starting to poll for taskId:', taskId);
  console.log('ModelScopeService.pollTaskStatus - Using proxy:', useProxy());

  while (Date.now() - startTime < MAX_WAIT) {
    try {
      const headers: Record<string, string> = {
        ...getHeaders(),
        // Always add task type header (required by ModelScope API)
        "X-ModelScope-Task-Type": "image_generation"
      };

      const response = await fetch(statusUrl, {
        method: 'GET',
        headers: headers,
        mode: 'cors'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('ModelScopeService.pollTaskStatus - API error:', response.status, errorText);
        throw new Error(`API_ERROR: ${response.status} - ${errorText}`);
      }

      const data: TaskStatusResponse = await response.json();
      console.log('ModelScopeService.pollTaskStatus - Task status:', data.task_status);

      // Check task status
      if (data.task_status === 'SUCCEED') {
        if (data.output_images && data.output_images.length > 0) {
          const imageUrl = data.output_images[0];
          console.log('ModelScopeService.pollTaskStatus - Image generated successfully:', imageUrl);
          return imageUrl;
        } else {
          throw new Error('NO_IMAGE_IN_RESPONSE: Task succeeded but no image URL found');
        }
      } else if (data.task_status === 'FAILED') {
        const errorMessage = data.error_message || data.message || 'Image generation failed';
        throw new Error(`IMAGE_GENERATION_FAILED: ${errorMessage}`);
      }

      // Still processing, wait before next poll
      await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
    } catch (error: any) {
      // If it's a clear error (not timeout), throw it
      if (error.message && !error.message.includes('timeout')) {
        throw error;
      }
      // Otherwise continue polling
      await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
    }
  }

  throw new Error('IMAGE_GENERATION_TIMEOUT: Image generation timed out after 5 minutes');
};

/**
 * Generates a manga illustration for a specific panel prompt using ModelScope API
 */
export const generatePanelImage = async (panelPrompt: string, style: string): Promise<string | null> => {
  const fullPrompt = `Manga illustration in the style of ${style}. ${panelPrompt}. High quality, professional line art, detailed backgrounds, expressive characters. Clean black and white manga aesthetics unless specified otherwise.`;
  
  console.log('ModelScopeService.generatePanelImage - Starting image generation');
  console.log('ModelScopeService.generatePanelImage - Prompt:', fullPrompt);
  
  try {
    // Create image generation task
    const taskId = await createImageTask(fullPrompt);
    if (!taskId) {
      throw new Error('Failed to create image generation task');
    }

    // Poll for task completion
    const imageUrl = await pollTaskStatus(taskId);
    
    // Process image response (returns URL directly, not base64)
    // This avoids CORS issues with CDN
    const processedUrl = await processImageResponse(imageUrl);
    console.log('ModelScopeService.generatePanelImage - Image generated successfully');
    return processedUrl;
  } catch (error: any) {
    console.error('ModelScopeService.generatePanelImage - Error:', error);
    return null;
  }
};

/**
 * Generates a storyline and panel breakdown for a manga page based on a theme.
 * This is a simplified version that creates a basic structure.
 * You may want to replace this with another API or implement a more sophisticated solution.
 */
export const generateStoryline = async (theme: string, style: string) => {
  // For now, create a simple structure based on the theme
  // You can replace this with an actual API call to a text generation service
  const panels = [
    {
      prompt: `Opening scene: ${theme}. Establish the setting and mood in ${style} style.`,
      caption: "The story begins..."
    },
    {
      prompt: `Character introduction: ${theme}. Show the main character in ${style} style.`,
      caption: "Our hero appears"
    },
    {
      prompt: `Action or conflict: ${theme}. Dramatic moment in ${style} style.`,
      caption: "The challenge arises"
    },
    {
      prompt: `Climax or resolution: ${theme}. Powerful conclusion in ${style} style.`,
      caption: "The moment of truth"
    }
  ];

  return {
    title: theme.split(' ').slice(0, 3).join(' ') || "Untitled Manga",
    panels: panels
  };
};
