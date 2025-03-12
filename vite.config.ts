
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api/users/me': {
        target: 'https://api.ciser.com.br/copiloto-vendas-api-qas/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/users\/me/, '/users/me'),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
            
            // Garantir que os headers Content-Type e Authorization sejam preservados
            if (req.headers['content-type']) {
              proxyReq.setHeader('Content-Type', req.headers['content-type']);
              console.log('Setting Content-Type header:', req.headers['content-type']);
            }
            
            if (req.headers['authorization']) {
              proxyReq.setHeader('Authorization', req.headers['authorization']);
              console.log('Setting Authorization header:', 'Bearer ' + req.headers['authorization'].substring(7, 15) + '...');
            }
            
            // Log de todos os headers sendo enviados
            console.log('All request headers:', Object.keys(req.headers).join(', '));
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            console.log('Response headers:', JSON.stringify(proxyRes.headers));
          });
        }
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
