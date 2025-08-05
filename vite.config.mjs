import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import mkcert from 'vite-plugin-mkcert';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  base: '/',
  css: { preprocessorOptions: { scss: { silenceDeprecations: ['legacy-js-api'] } } },
  define: {
    TELEGRAM_BOT_TOKEN_ONLY_FOR_DEV: JSON.stringify(command === 'serve' ? process.env.TELEGRAM_BOT_TOKEN : '')
  },
  plugins: [
    react({
      // @see https://github.com/vitejs/vite-plugin-react-swc/issues/179
      useAtYourOwnRisk_mutateSwcOptions(options) {
        options.jsc.parser.decorators = true;
        options.jsc.transform.decoratorVersion = '2022-03';
      }
    }),
    command === 'serve' && checker({ typescript: true }),
    tsconfigPaths(),
    mkcert({
      hosts: [process.env.WEB_HOST]
    })
  ].filter(Boolean),
  publicDir: './public',
  esbuild: {
    legalComments: 'none',
    supported: {
      decorators: false,
      'top-level-await': true
    }
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        dir: 'dist/web',
        manualChunks: (id) => {
          switch (true) {
            case /node_modules\/core-js\//.test(id): {
              return 'core-js';
            }
            case /node_modules\//.test(id): {
              return 'vendor';
            }
            default: {
              return null;
            }
          }
        }
      }
    }
  },
  server: {
    host: true,
    port: Number(process.env.WEB_PORT),
    proxy: {
      ...Object.fromEntries(
        ['/api', '/storage'].map((path) => [
          path,
          {
            target: `http://localhost:${process.env.APP_PORT}`,
            changeOrigin: true,
            secure: false,
            cookieDomainRewrite: 'localhost',
            ws: true
          }
        ])
      )
    }
  }
}));
