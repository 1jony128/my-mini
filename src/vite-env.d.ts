/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_SUPABASE_SERVICE_ROLE_KEY: string
  readonly VITE_OPENROUTER_API_KEY: string
  readonly VITE_GROK_API_KEY: string
  // Добавьте другие переменные окружения здесь
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
