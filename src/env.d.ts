/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLEARTRACE_API: string;
  readonly VITE_CLEARTRACE_WSS: string;
  readonly VITE_DEBUG: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
