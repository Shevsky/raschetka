/// <reference types="vite/client" />

interface ImportMetaEnv {
  //
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  const TELEGRAM_BOT_TOKEN_ONLY_FOR_DEV: string;
}

export {};
