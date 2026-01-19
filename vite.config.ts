import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    // Debug: log environment variable loading
    console.log('Vite Config - Loading environment variables:');
    console.log('  MODELSCOPE_API_KEY:', env.MODELSCOPE_API_KEY ? `${env.MODELSCOPE_API_KEY.substring(0, 5)}...` : 'NOT FOUND');
    console.log('  API_KEY:', env.API_KEY ? `${env.API_KEY.substring(0, 5)}...` : 'NOT FOUND');
    
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api/modelscope': {
            target: 'https://api-inference.modelscope.cn',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/modelscope/, ''),
            configure: (proxy, _options) => {
              proxy.on('proxyReq', (proxyReq, req, _res) => {
                // Forward all custom headers (case-insensitive matching)
                const headers = req.headers;
                Object.keys(headers).forEach((key) => {
                  const lowerKey = key.toLowerCase();
                  if (lowerKey.startsWith('x-') || lowerKey === 'authorization' || lowerKey === 'content-type') {
                    const value = headers[key];
                    if (Array.isArray(value)) {
                      proxyReq.setHeader(key, value[0]);
                    } else if (value) {
                      proxyReq.setHeader(key, value);
                    }
                  }
                });
              });
            },
          },
          // Proxy for OSS images to bypass CORS
          '/api/oss-image': {
            target: 'https://muse-ai.oss-cn-hangzhou.aliyuncs.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/oss-image/, ''),
            configure: (proxy, _options) => {
              proxy.on('proxyRes', (proxyRes) => {
                // Add CORS headers to the response
                proxyRes.headers['Access-Control-Allow-Origin'] = '*';
                proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS';
              });
            },
          },
        },
      },
      plugins: [react()],
      define: {
        // Define environment variables for client-side code
        // Support both MODELSCOPE_API_KEY and VITE_MODELSCOPE_API_KEY
        'import.meta.env.MODELSCOPE_API_KEY': JSON.stringify(env.MODELSCOPE_API_KEY || env.VITE_MODELSCOPE_API_KEY || ''),
        'import.meta.env.VITE_MODELSCOPE_API_KEY': JSON.stringify(env.MODELSCOPE_API_KEY || env.VITE_MODELSCOPE_API_KEY || ''),
        'import.meta.env.API_KEY': JSON.stringify(env.MODELSCOPE_API_KEY || env.VITE_MODELSCOPE_API_KEY || env.API_KEY || env.VITE_API_KEY || ''),
        'import.meta.env.VITE_API_KEY': JSON.stringify(env.MODELSCOPE_API_KEY || env.VITE_MODELSCOPE_API_KEY || env.API_KEY || env.VITE_API_KEY || ''),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
