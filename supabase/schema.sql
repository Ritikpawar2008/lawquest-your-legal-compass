-- ============================================================================
-- LAWQUEST - Supabase Database Schema
-- Production-ready schema for AI-powered Legal Literacy Platform
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. USER PROFILES & AUTHENTICATION
-- ============================================================================

-- User profiles (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  jurisdiction TEXT DEFAULT 'India',
  preferred_language TEXT DEFAULT 'English',
  practice_interest TEXT DEFAULT '',
  timezone TEXT DEFAULT 'Asia/Kolkata',
  level INTEGER NOT NULL DEFAULT 1,
  level_title TEXT NOT NULL DEFAULT 'Novice',
  xp INTEGER NOT NULL DEFAULT 0,
  coins INTEGER NOT NULL DEFAULT 0,
  streak_days INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_active_date DATE,
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  is_premium BOOLEAN NOT NULL DEFAULT FALSE,
  premium_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User notification preferences
CREATE TABLE public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  push_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  streak_reminders BOOLEAN NOT NULL DEFAULT TRUE,
  community_updates BOOLEAN NOT NULL DEFAULT TRUE,
  weekly_digest BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================================
-- 2. GAMIFICATION SYSTEM
-- ============================================================================

-- XP transaction log
CREATE TABLE public.xp_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('courtroom', 'quiz', 'lesson', 'daily_challenge', 'streak_bonus', 'badge', 'community', 'referral')),
  source_id UUID,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Coin transaction log
CREATE TABLE public.coin_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('earned', 'spent', 'bonus')),
  source TEXT NOT NULL,
  source_id UUID,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Badge definitions
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'trophy',
  category TEXT NOT NULL CHECK (category IN ('courtroom', 'quiz', 'learning', 'streak', 'community', 'special')),
  criteria_type TEXT NOT NULL,
  criteria_value INTEGER NOT NULL DEFAULT 1,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  coin_reward INTEGER NOT NULL DEFAULT 0,
  rarity TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User earned badges
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Daily challenges
CREATE TABLE public.daily_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  challenge_type TEXT NOT NULL CHECK (challenge_type IN ('courtroom', 'quiz', 'lesson', 'assistant', 'community')),
  target_value INTEGER NOT NULL DEFAULT 1,
  xp_reward INTEGER NOT NULL DEFAULT 50,
  coin_reward INTEGER NOT NULL DEFAULT 10,
  active_date DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User daily challenge progress
CREATE TABLE public.user_daily_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES public.daily_challenges(id) ON DELETE CASCADE,
  progress INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);

-- Leaderboard (materialized weekly)
CREATE TABLE public.leaderboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  period_type TEXT NOT NULL CHECK (period_type IN ('weekly', 'monthly', 'all_time')),
  period_start DATE NOT NULL,
  total_xp INTEGER NOT NULL DEFAULT 0,
  rank INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, period_type, period_start)
);

-- ============================================================================
-- 3. COURTROOM SIMULATOR
-- ============================================================================

-- Case definitions (admin-created)
CREATE TABLE public.cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  area TEXT NOT NULL,
  jurisdiction TEXT NOT NULL DEFAULT 'Consumer Protection Act, 2019',
  bench TEXT NOT NULL DEFAULT 'District Consumer Disputes Redressal Commission',
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  facts TEXT NOT NULL,
  plaintiff_role TEXT NOT NULL DEFAULT 'Consumer',
  defendant_role TEXT NOT NULL DEFAULT 'Retailer',
  estimated_duration TEXT NOT NULL DEFAULT '15 min',
  xp_reward INTEGER NOT NULL DEFAULT 200,
  coin_reward INTEGER NOT NULL DEFAULT 50,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Case evidence items
CREATE TABLE public.case_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  evidence_code TEXT NOT NULL,
  label TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('document', 'media', 'precedent', 'witness', 'exhibit')),
  content TEXT,
  file_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User courtroom sessions
CREATE TABLE public.courtroom_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  side TEXT NOT NULL DEFAULT 'plaintiff' CHECK (side IN ('plaintiff', 'defendant')),
  score_reasoning INTEGER DEFAULT 0,
  score_concepts INTEGER DEFAULT 0,
  score_communication INTEGER DEFAULT 0,
  overall_score INTEGER DEFAULT 0,
  verdict TEXT CHECK (verdict IN ('won', 'lost', 'partial', 'mistrial')),
  judge_feedback TEXT,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  coins_earned INTEGER NOT NULL DEFAULT 0,
  duration_seconds INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Courtroom transcript (conversation turns)
CREATE TABLE public.courtroom_turns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.courtroom_sessions(id) ON DELETE CASCADE,
  turn_number INTEGER NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('judge', 'plaintiff', 'defendant', 'clerk', 'witness')),
  speaker_name TEXT NOT NULL,
  content TEXT NOT NULL,
  is_user BOOLEAN NOT NULL DEFAULT FALSE,
  ai_model TEXT,
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 4. AI LEGAL ASSISTANT
-- ============================================================================

-- Assistant conversation threads
CREATE TABLE public.assistant_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New conversation',
  topic_area TEXT,
  message_count INTEGER NOT NULL DEFAULT 0,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Assistant messages
CREATE TABLE public.assistant_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID NOT NULL REFERENCES public.assistant_threads(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  citations TEXT[],
  ai_model TEXT,
  tokens_used INTEGER DEFAULT 0,
  feedback TEXT CHECK (feedback IN ('helpful', 'not_helpful', NULL)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 5. ADAPTIVE QUIZ ENGINE
-- ============================================================================

-- Quiz categories/topics
CREATE TABLE public.quiz_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT DEFAULT 'brain',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Quiz questions bank
CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID NOT NULL REFERENCES public.quiz_topics(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  options JSONB NOT NULL, -- [{id: "a", text: "..."}, ...]
  correct_option TEXT NOT NULL,
  rationale TEXT NOT NULL,
  difficulty INTEGER NOT NULL DEFAULT 2 CHECK (difficulty BETWEEN 1 AND 5),
  tags TEXT[] DEFAULT '{}',
  is_ai_generated BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  times_shown INTEGER NOT NULL DEFAULT 0,
  times_correct INTEGER NOT NULL DEFAULT 0,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Quiz sessions
CREATE TABLE public.quiz_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES public.quiz_topics(id),
  mode TEXT NOT NULL DEFAULT 'adaptive' CHECK (mode IN ('adaptive', 'practice', 'timed', 'challenge')),
  total_questions INTEGER NOT NULL DEFAULT 10,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  current_question INTEGER NOT NULL DEFAULT 0,
  current_difficulty INTEGER NOT NULL DEFAULT 2,
  streak INTEGER NOT NULL DEFAULT 0,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  coins_earned INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Quiz answers (per question per session)
CREATE TABLE public.quiz_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  selected_option TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_taken_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User topic mastery (adaptive difficulty tracking)
CREATE TABLE public.user_topic_mastery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES public.quiz_topics(id) ON DELETE CASCADE,
  mastery_score INTEGER NOT NULL DEFAULT 0 CHECK (mastery_score BETWEEN 0 AND 100),
  questions_attempted INTEGER NOT NULL DEFAULT 0,
  questions_correct INTEGER NOT NULL DEFAULT 0,
  current_difficulty INTEGER NOT NULL DEFAULT 2,
  last_attempted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, topic_id)
);

-- ============================================================================
-- 6. LEARNING MODULES (ACADEMY)
-- ============================================================================

-- Learning tracks
CREATE TABLE public.learning_tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT DEFAULT 'book-open',
  color TEXT DEFAULT 'accent',
  total_lessons INTEGER NOT NULL DEFAULT 0,
  estimated_hours NUMERIC(4,1) DEFAULT 0,
  difficulty TEXT NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  is_premium BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Lessons within tracks
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  track_id UUID NOT NULL REFERENCES public.learning_tracks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content_markdown TEXT NOT NULL DEFAULT '',
  summary TEXT,
  lesson_number INTEGER NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 10,
  xp_reward INTEGER NOT NULL DEFAULT 50,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(track_id, lesson_number)
);

-- User lesson progress
CREATE TABLE public.user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES public.learning_tracks(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  progress_percent INTEGER NOT NULL DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
  time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- User track progress (aggregate)
CREATE TABLE public.user_track_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES public.learning_tracks(id) ON DELETE CASCADE,
  lessons_completed INTEGER NOT NULL DEFAULT 0,
  total_lessons INTEGER NOT NULL DEFAULT 0,
  progress_percent INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  certificate_issued BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, track_id)
);

-- ============================================================================
-- 7. CERTIFICATES
-- ============================================================================

CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  track_id UUID REFERENCES public.learning_tracks(id),
  certificate_type TEXT NOT NULL CHECK (certificate_type IN ('track_completion', 'courtroom_mastery', 'quiz_champion', 'special')),
  title TEXT NOT NULL,
  description TEXT,
  certificate_number TEXT NOT NULL UNIQUE,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  pdf_url TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 8. COMMUNITY
-- ============================================================================

-- Discussion threads
CREATE TABLE public.discussion_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  area TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  reply_count INTEGER NOT NULL DEFAULT 0,
  like_count INTEGER NOT NULL DEFAULT 0,
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  is_locked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Thread replies
CREATE TABLE public.discussion_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID NOT NULL REFERENCES public.discussion_threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  like_count INTEGER NOT NULL DEFAULT 0,
  is_accepted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Thread/reply likes
CREATE TABLE public.likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('thread', 'reply')),
  target_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id)
);

-- ============================================================================
-- 9. ADMIN & ANALYTICS
-- ============================================================================

-- Platform analytics events
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  page_path TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Admin audit log
CREATE TABLE public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Feature flags
CREATE TABLE public.feature_flags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  is_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  target_roles TEXT[] DEFAULT '{user}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 10. INDEXES FOR QUERY OPTIMIZATION
-- ============================================================================

-- Profiles
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_xp ON public.profiles(xp DESC);
CREATE INDEX idx_profiles_level ON public.profiles(level DESC);
CREATE INDEX idx_profiles_streak ON public.profiles(streak_days DESC);

-- XP & Coins
CREATE INDEX idx_xp_transactions_user ON public.xp_transactions(user_id, created_at DESC);
CREATE INDEX idx_coin_transactions_user ON public.coin_transactions(user_id, created_at DESC);

-- Badges
CREATE INDEX idx_user_badges_user ON public.user_badges(user_id);
CREATE INDEX idx_user_badges_badge ON public.user_badges(badge_id);

-- Courtroom
CREATE INDEX idx_courtroom_sessions_user ON public.courtroom_sessions(user_id, created_at DESC);
CREATE INDEX idx_courtroom_sessions_case ON public.courtroom_sessions(case_id);
CREATE INDEX idx_courtroom_sessions_status ON public.courtroom_sessions(status);
CREATE INDEX idx_courtroom_turns_session ON public.courtroom_turns(session_id, turn_number);

-- Assistant
CREATE INDEX idx_assistant_threads_user ON public.assistant_threads(user_id, updated_at DESC);
CREATE INDEX idx_assistant_messages_thread ON public.assistant_messages(thread_id, created_at);

-- Quizzes
CREATE INDEX idx_quiz_questions_topic ON public.quiz_questions(topic_id, difficulty);
CREATE INDEX idx_quiz_sessions_user ON public.quiz_sessions(user_id, created_at DESC);
CREATE INDEX idx_quiz_answers_session ON public.quiz_answers(session_id);
CREATE INDEX idx_quiz_answers_user ON public.quiz_answers(user_id, created_at DESC);
CREATE INDEX idx_user_topic_mastery_user ON public.user_topic_mastery(user_id);

-- Learning
CREATE INDEX idx_lessons_track ON public.lessons(track_id, lesson_number);
CREATE INDEX idx_user_lesson_progress_user ON public.user_lesson_progress(user_id, track_id);
CREATE INDEX idx_user_track_progress_user ON public.user_track_progress(user_id);

-- Community
CREATE INDEX idx_discussion_threads_area ON public.discussion_threads(area, created_at DESC);
CREATE INDEX idx_discussion_threads_user ON public.discussion_threads(user_id);
CREATE INDEX idx_discussion_replies_thread ON public.discussion_replies(thread_id, created_at);

-- Leaderboard
CREATE INDEX idx_leaderboard_period ON public.leaderboard(period_type, period_start, rank);

-- Analytics
CREATE INDEX idx_analytics_events_user ON public.analytics_events(user_id, created_at DESC);
CREATE INDEX idx_analytics_events_type ON public.analytics_events(event_type, created_at DESC);

-- ============================================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courtroom_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courtroom_turns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assistant_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assistant_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_topic_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_track_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all profiles, update own
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_admin_update" ON public.profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Notification preferences: own only
CREATE POLICY "notif_prefs_own" ON public.notification_preferences FOR ALL USING (auth.uid() = user_id);

-- XP/Coin transactions: read own, insert via service role
CREATE POLICY "xp_read_own" ON public.xp_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "coins_read_own" ON public.coin_transactions FOR SELECT USING (auth.uid() = user_id);

-- Badges: everyone can read definitions
CREATE POLICY "badges_read_all" ON public.badges FOR SELECT USING (true);
CREATE POLICY "badges_admin_manage" ON public.badges FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- User badges: read own + public view
CREATE POLICY "user_badges_read_all" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "user_badges_insert_own" ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Daily challenges: everyone reads active
CREATE POLICY "daily_challenges_read" ON public.daily_challenges FOR SELECT USING (is_active = true);
CREATE POLICY "daily_challenges_admin" ON public.daily_challenges FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- User daily challenges: own only
CREATE POLICY "user_daily_challenges_own" ON public.user_daily_challenges FOR ALL USING (auth.uid() = user_id);

-- Leaderboard: everyone reads
CREATE POLICY "leaderboard_read_all" ON public.leaderboard FOR SELECT USING (true);

-- Cases: everyone reads published, admins manage all
CREATE POLICY "cases_read_published" ON public.cases FOR SELECT USING (is_published = true);
CREATE POLICY "cases_admin_all" ON public.cases FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Case evidence: readable if case is published
CREATE POLICY "evidence_read" ON public.case_evidence FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.cases WHERE id = case_id AND is_published = true)
);
CREATE POLICY "evidence_admin" ON public.case_evidence FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Courtroom sessions: own only
CREATE POLICY "courtroom_sessions_own" ON public.courtroom_sessions FOR ALL USING (auth.uid() = user_id);

-- Courtroom turns: own session only
CREATE POLICY "courtroom_turns_own" ON public.courtroom_turns FOR ALL USING (
  EXISTS (SELECT 1 FROM public.courtroom_sessions WHERE id = session_id AND user_id = auth.uid())
);

-- Assistant threads: own only
CREATE POLICY "assistant_threads_own" ON public.assistant_threads FOR ALL USING (auth.uid() = user_id);

-- Assistant messages: own thread only
CREATE POLICY "assistant_messages_own" ON public.assistant_messages FOR ALL USING (
  EXISTS (SELECT 1 FROM public.assistant_threads WHERE id = thread_id AND user_id = auth.uid())
);

-- Quiz topics: everyone reads
CREATE POLICY "quiz_topics_read" ON public.quiz_topics FOR SELECT USING (is_active = true);
CREATE POLICY "quiz_topics_admin" ON public.quiz_topics FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Quiz questions: everyone reads active
CREATE POLICY "quiz_questions_read" ON public.quiz_questions FOR SELECT USING (is_active = true);
CREATE POLICY "quiz_questions_admin" ON public.quiz_questions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Quiz sessions: own only
CREATE POLICY "quiz_sessions_own" ON public.quiz_sessions FOR ALL USING (auth.uid() = user_id);

-- Quiz answers: own only
CREATE POLICY "quiz_answers_own" ON public.quiz_answers FOR ALL USING (auth.uid() = user_id);

-- User topic mastery: own only
CREATE POLICY "topic_mastery_own" ON public.user_topic_mastery FOR ALL USING (auth.uid() = user_id);

-- Learning tracks: everyone reads published
CREATE POLICY "tracks_read_published" ON public.learning_tracks FOR SELECT USING (is_published = true);
CREATE POLICY "tracks_admin" ON public.learning_tracks FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Lessons: everyone reads published
CREATE POLICY "lessons_read_published" ON public.lessons FOR SELECT USING (is_published = true);
CREATE POLICY "lessons_admin" ON public.lessons FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- User lesson progress: own only
CREATE POLICY "lesson_progress_own" ON public.user_lesson_progress FOR ALL USING (auth.uid() = user_id);

-- User track progress: own only
CREATE POLICY "track_progress_own" ON public.user_track_progress FOR ALL USING (auth.uid() = user_id);

-- Certificates: own + public verification
CREATE POLICY "certificates_read_all" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "certificates_insert_own" ON public.certificates FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Discussion threads: everyone reads, own manage
CREATE POLICY "threads_read_all" ON public.discussion_threads FOR SELECT USING (true);
CREATE POLICY "threads_insert_auth" ON public.discussion_threads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "threads_update_own" ON public.discussion_threads FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "threads_delete_own" ON public.discussion_threads FOR DELETE USING (auth.uid() = user_id);

-- Discussion replies: everyone reads, own manage
CREATE POLICY "replies_read_all" ON public.discussion_replies FOR SELECT USING (true);
CREATE POLICY "replies_insert_auth" ON public.discussion_replies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "replies_update_own" ON public.discussion_replies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "replies_delete_own" ON public.discussion_replies FOR DELETE USING (auth.uid() = user_id);

-- Likes: own manage
CREATE POLICY "likes_read_all" ON public.likes FOR SELECT USING (true);
CREATE POLICY "likes_own" ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "likes_delete_own" ON public.likes FOR DELETE USING (auth.uid() = user_id);

-- Analytics: insert own, admin reads all
CREATE POLICY "analytics_insert" ON public.analytics_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "analytics_admin_read" ON public.analytics_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Admin audit log: super_admin only
CREATE POLICY "audit_log_admin" ON public.admin_audit_log FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- Feature flags: everyone reads, admin manages
CREATE POLICY "feature_flags_read" ON public.feature_flags FOR SELECT USING (true);
CREATE POLICY "feature_flags_admin" ON public.feature_flags FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- ============================================================================
-- 12. FUNCTIONS & TRIGGERS
-- ============================================================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  
  -- Create default notification preferences
  INSERT INTO public.notification_preferences (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_notif_prefs_updated_at BEFORE UPDATE ON public.notification_preferences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON public.cases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_assistant_threads_updated_at BEFORE UPDATE ON public.assistant_threads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_quiz_questions_updated_at BEFORE UPDATE ON public.quiz_questions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_learning_tracks_updated_at BEFORE UPDATE ON public.learning_tracks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.lessons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_user_lesson_progress_updated_at BEFORE UPDATE ON public.user_lesson_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_user_track_progress_updated_at BEFORE UPDATE ON public.user_track_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_user_topic_mastery_updated_at BEFORE UPDATE ON public.user_topic_mastery FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_leaderboard_updated_at BEFORE UPDATE ON public.leaderboard FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_discussion_threads_updated_at BEFORE UPDATE ON public.discussion_threads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_discussion_replies_updated_at BEFORE UPDATE ON public.discussion_replies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_feature_flags_updated_at BEFORE UPDATE ON public.feature_flags FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Function to award XP and update user level
CREATE OR REPLACE FUNCTION public.award_xp(
  p_user_id UUID,
  p_amount INTEGER,
  p_source TEXT,
  p_source_id UUID DEFAULT NULL,
  p_description TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_new_xp INTEGER;
  v_new_level INTEGER;
  v_level_title TEXT;
  v_leveled_up BOOLEAN := FALSE;
BEGIN
  -- Insert XP transaction
  INSERT INTO public.xp_transactions (user_id, amount, source, source_id, description)
  VALUES (p_user_id, p_amount, p_source, p_source_id, p_description);
  
  -- Update user XP
  UPDATE public.profiles
  SET xp = xp + p_amount
  WHERE id = p_user_id
  RETURNING xp INTO v_new_xp;
  
  -- Calculate new level (every 1000 XP = 1 level)
  v_new_level := GREATEST(1, (v_new_xp / 1000) + 1);
  
  -- Determine level title
  v_level_title := CASE
    WHEN v_new_level >= 20 THEN 'Supreme Court Justice'
    WHEN v_new_level >= 15 THEN 'High Court Judge'
    WHEN v_new_level >= 12 THEN 'Senior Advocate'
    WHEN v_new_level >= 9 THEN 'Advocate'
    WHEN v_new_level >= 6 THEN 'Junior Counsel'
    WHEN v_new_level >= 3 THEN 'Law Clerk'
    ELSE 'Novice'
  END;
  
  -- Check if leveled up
  IF v_new_level > (SELECT level FROM public.profiles WHERE id = p_user_id) THEN
    v_leveled_up := TRUE;
  END IF;
  
  -- Update level
  UPDATE public.profiles
  SET level = v_new_level, level_title = v_level_title
  WHERE id = p_user_id;
  
  RETURN jsonb_build_object(
    'new_xp', v_new_xp,
    'new_level', v_new_level,
    'level_title', v_level_title,
    'leveled_up', v_leveled_up
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to award coins
CREATE OR REPLACE FUNCTION public.award_coins(
  p_user_id UUID,
  p_amount INTEGER,
  p_source TEXT,
  p_source_id UUID DEFAULT NULL,
  p_description TEXT DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  v_new_coins INTEGER;
BEGIN
  INSERT INTO public.coin_transactions (user_id, amount, type, source, source_id, description)
  VALUES (p_user_id, p_amount, 'earned', p_source, p_source_id, p_description);
  
  UPDATE public.profiles
  SET coins = coins + p_amount
  WHERE id = p_user_id
  RETURNING coins INTO v_new_coins;
  
  RETURN v_new_coins;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update streak
CREATE OR REPLACE FUNCTION public.update_streak(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_last_active DATE;
  v_today DATE := CURRENT_DATE;
  v_new_streak INTEGER;
  v_longest INTEGER;
BEGIN
  SELECT last_active_date, streak_days, longest_streak
  INTO v_last_active, v_new_streak, v_longest
  FROM public.profiles WHERE id = p_user_id;
  
  IF v_last_active = v_today THEN
    -- Already active today, no change
    RETURN jsonb_build_object('streak', v_new_streak, 'extended', FALSE);
  ELSIF v_last_active = v_today - INTERVAL '1 day' THEN
    -- Consecutive day, extend streak
    v_new_streak := v_new_streak + 1;
  ELSE
    -- Streak broken, reset to 1
    v_new_streak := 1;
  END IF;
  
  -- Update longest streak
  IF v_new_streak > v_longest THEN
    v_longest := v_new_streak;
  END IF;
  
  UPDATE public.profiles
  SET streak_days = v_new_streak,
      longest_streak = v_longest,
      last_active_date = v_today
  WHERE id = p_user_id;
  
  RETURN jsonb_build_object(
    'streak', v_new_streak,
    'longest', v_longest,
    'extended', TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 13. SEED DATA - BADGES
-- ============================================================================

INSERT INTO public.badges (slug, name, description, icon, category, criteria_type, criteria_value, xp_reward, coin_reward, rarity) VALUES
  ('first_verdict', 'First Verdict', 'Won your first courtroom case', 'gavel', 'courtroom', 'cases_won', 1, 100, 25, 'common'),
  ('iron_streak_7', 'Iron Streak', '7-day learning streak', 'flame', 'streak', 'streak_days', 7, 150, 30, 'common'),
  ('iron_streak_14', 'Steel Streak', '14-day learning streak', 'flame', 'streak', 'streak_days', 14, 300, 60, 'rare'),
  ('iron_streak_30', 'Diamond Streak', '30-day learning streak', 'flame', 'streak', 'streak_days', 30, 500, 100, 'epic'),
  ('cite_the_bench', 'Cite the Bench', 'Used 10 precedents in courtroom arguments', 'star', 'courtroom', 'precedents_cited', 10, 200, 40, 'rare'),
  ('rapid_counsel', 'Rapid Counsel', 'Closed a case in under 8 minutes', 'zap', 'courtroom', 'fast_case', 1, 150, 30, 'rare'),
  ('constitutional_sage', 'Constitutional Sage', 'Complete all constitutional law lessons', 'award', 'learning', 'track_complete', 1, 500, 100, 'epic'),
  ('perfect_cross', 'Perfect Cross', 'Score 100 on communication in courtroom', 'target', 'courtroom', 'perfect_score', 1, 300, 60, 'epic'),
  ('quiz_master', 'Quiz Master', 'Answer 100 quiz questions correctly', 'brain', 'quiz', 'correct_answers', 100, 400, 80, 'rare'),
  ('community_star', 'Community Star', 'Receive 50 likes on discussions', 'users', 'community', 'likes_received', 50, 250, 50, 'rare'),
  ('first_steps', 'First Steps', 'Complete your first lesson', 'book-open', 'learning', 'lessons_complete', 1, 50, 10, 'common'),
  ('legal_eagle', 'Legal Eagle', 'Reach Level 10', 'trophy', 'special', 'level_reached', 10, 1000, 200, 'legendary');

-- ============================================================================
-- 14. SEED DATA - QUIZ TOPICS
-- ============================================================================

INSERT INTO public.quiz_topics (name, slug, description, icon, display_order) VALUES
  ('Constitutional Law', 'constitutional-law', 'Fundamental rights, directive principles, and constitutional provisions', 'scale', 1),
  ('Consumer Rights', 'consumer-rights', 'Consumer Protection Act, 2019 and related statutes', 'shield', 2),
  ('Criminal Law', 'criminal-law', 'IPC, CrPC, and criminal jurisprudence', 'gavel', 3),
  ('Cyber Law', 'cyber-law', 'IT Act, data protection, and digital rights', 'zap', 4),
  ('Contract Law', 'contract-law', 'Indian Contract Act, 1872 and commercial agreements', 'file-text', 5),
  ('Property Law', 'property-law', 'Transfer of Property Act, tenancy, and land laws', 'home', 6);

-- ============================================================================
-- 15. SEED DATA - LEARNING TRACKS
-- ============================================================================

INSERT INTO public.learning_tracks (title, slug, description, icon, color, total_lessons, estimated_hours, difficulty, display_order) VALUES
  ('Constitutional Fundamentals', 'constitutional-fundamentals', 'Master the Indian Constitution — fundamental rights, directive principles, and the structure of governance.', 'scale', 'accent', 24, 12.0, 'beginner', 1),
  ('Consumer Rights in India', 'consumer-rights-india', 'Understand the Consumer Protection Act, 2019 and learn to protect your rights as a consumer.', 'shield', 'success', 18, 9.0, 'beginner', 2),
  ('Contracts & Agreements', 'contracts-agreements', 'Master the Indian Contract Act, 1872 — from offer and acceptance to breach and remedies.', 'file-text', 'warning', 20, 10.0, 'intermediate', 3),
  ('Cyber Law Essentials', 'cyber-law-essentials', 'Navigate the IT Act, data protection frameworks, and digital rights in the modern era.', 'zap', 'accent', 14, 7.0, 'intermediate', 4),
  ('Criminal Law Basics', 'criminal-law-basics', 'Understand IPC provisions, criminal procedure, and the justice system.', 'gavel', 'destructive', 22, 11.0, 'advanced', 5),
  ('Employment & Labour Law', 'employment-labour-law', 'Know your workplace rights — from hiring to termination, wages to safety.', 'users', 'accent', 16, 8.0, 'intermediate', 6);

-- ============================================================================
-- 16. SEED DATA - CASES
-- ============================================================================

INSERT INTO public.cases (case_number, title, area, jurisdiction, bench, difficulty, facts, plaintiff_role, defendant_role, estimated_duration, xp_reward, coin_reward, is_published, tags) VALUES
  ('0421', 'Ravi Kumar v. NexaMart Retail Pvt. Ltd.', 'Consumer Rights', 'Consumer Protection Act, 2019 · §2(1)(g), §17', 'Hon''ble AI Judge · District Consumer Disputes Redressal Commission', 'medium', 'The plaintiff purchased a smart television via NexaMart''s app. The unit failed within 48 hours. The retailer refused refund citing a ''no returns on electronics'' clause buried in the digital terms of sale.', 'Consumer', 'E-Retailer', '12 min', 280, 50, TRUE, ARRAY['consumer-rights', 'refund', 'e-commerce']),
  ('0418', 'State v. Mehta — §420 IPC', 'Criminal Law', 'Indian Penal Code · §420, §406', 'Hon''ble AI Judge · Sessions Court', 'hard', 'The accused is charged under §420 IPC for allegedly defrauding investors through a Ponzi scheme disguised as a cryptocurrency investment platform. Prosecution claims ₹4.2 crore was misappropriated.', 'Prosecution', 'Defense', '22 min', 420, 80, TRUE, ARRAY['criminal', 'fraud', 'ponzi']),
  ('0416', 'Ananya Sharma v. TechCorp — Data Breach', 'Cyber Law', 'IT Act, 2000 · §43A, §72A', 'Hon''ble AI Judge · Cyber Appellate Tribunal', 'hard', 'The plaintiff''s personal data including Aadhaar number, bank details, and medical records were exposed in a data breach at TechCorp. The company delayed notification by 45 days and offered no compensation.', 'Data Subject', 'Data Controller', '25 min', 500, 100, TRUE, ARRAY['cyber', 'data-breach', 'privacy']),
  ('0410', 'Public Interest Litigation — Air Quality', 'Constitutional', 'Constitution of India · Article 21, Article 48A', 'Hon''ble AI Judge · High Court', 'medium', 'A PIL filed by environmental activists seeking enforcement of air quality standards in Delhi NCR. Government argues economic constraints; petitioners cite Article 21 right to life includes right to clean air.', 'Petitioner', 'State Government', '18 min', 360, 70, TRUE, ARRAY['constitutional', 'pil', 'environment']),
  ('0402', 'Landlord–Tenant Dispute · Delhi Rent Act', 'Property', 'Delhi Rent Control Act, 1958 · §14', 'Hon''ble AI Judge · Rent Controller', 'easy', 'Landlord seeks eviction of tenant of 12 years citing personal need under §14(1)(e). Tenant argues landlord owns multiple properties and the claim is not bona fide.', 'Landlord', 'Tenant', '10 min', 180, 30, TRUE, ARRAY['property', 'rent', 'eviction']),
  ('0398', 'LuxeCo v. FashionHub — Trademark Infringement', 'IP Law', 'Trade Marks Act, 1999 · §29, §30', 'Hon''ble AI Judge · Commercial Court', 'medium', 'LuxeCo alleges FashionHub is selling counterfeit luxury goods using deceptively similar trademarks online. FashionHub claims fair use and argues the marks are not identical.', 'Trademark Owner', 'Alleged Infringer', '16 min', 240, 45, TRUE, ARRAY['ip', 'trademark', 'counterfeit']);

-- ============================================================================
-- 17. SEED DATA - CASE EVIDENCE
-- ============================================================================

INSERT INTO public.case_evidence (case_id, evidence_code, label, type, content, display_order) VALUES
  ((SELECT id FROM public.cases WHERE case_number = '0421'), 'EX-A', 'Order invoice & delivery log', 'document', 'NexaMart Order #NM-2024-78432. Smart TV 55" 4K. Delivered 15-Mar-2024. Payment: ₹42,999 via UPI.', 1),
  ((SELECT id FROM public.cases WHERE case_number = '0421'), 'EX-B', 'Product failure video (48h post-delivery)', 'media', 'Video evidence showing display malfunction — horizontal lines and complete blackout within 48 hours of delivery.', 2),
  ((SELECT id FROM public.cases WHERE case_number = '0421'), 'EX-C', 'NexaMart Terms of Sale (excerpt)', 'document', 'Clause 14.3: "All electronics purchases are final. No returns, refunds, or exchanges shall be entertained post-delivery acceptance."', 3),
  ((SELECT id FROM public.cases WHERE case_number = '0421'), 'EX-D', 'Prior CDRC ruling — Sharma v. E-Bazaar (2022)', 'precedent', 'The Commission held that boilerplate no-return clauses cannot override statutory consumer rights under §2(1)(g). Unfair trade practice under §2(47).', 4);