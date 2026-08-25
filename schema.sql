-- 1. Buat Tabel Users
CREATE TABLE public.users (
  user_id TEXT PRIMARY KEY,
  user_name TEXT,
  user_bio TEXT,
  onboarding_status TEXT DEFAULT 'asking_ai_name',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Buat Tabel Bot Personas
CREATE TABLE public.bot_personas (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT UNIQUE REFERENCES public.users(user_id) ON DELETE CASCADE,
  bot_name TEXT NOT NULL,
  system_prompt TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Buat Tabel Chat History
CREATE TABLE public.chat_history (
  user_id TEXT PRIMARY KEY REFERENCES public.users(user_id) ON DELETE CASCADE,
  messages JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing untuk optimasi kecepatan pencarian berbasis user_id
CREATE INDEX idx_users_onboarding ON public.users(user_id, onboarding_status);