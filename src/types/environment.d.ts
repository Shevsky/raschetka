export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      HOSTNAME: string;
      DEBUG: '1' | '0';
      TZ: string;
      TELEGRAM_BOT_TOKEN: string;
      TELEGRAM_BOT_USERNAME: string;
      TELEGRAM_BOT_AUTH_DATE_TTL: string;
      APP_PORT: string;
      APP_SESSION_SECRET: string;
      PUBLIC_PATH: string;
      STORAGE_PATH: string;
      WEB_PORT: string;
      WEB_HOST: string;
      WEB_PUBLIC_URL: string;
      DATABASE_URL: string;
      PROVERKA_CHEKA_URL: string;
      PROVERKA_CHEKA_TOKEN: string;
      GEMINI_URL: string;
      GEMINI_MODEL: string;
      GEMINI_KEY: string;
      SOCKS_PROXY_URL: string;
    }
  }
}
