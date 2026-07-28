# LawQuest Supabase Database Schema

## Overview

This directory contains the complete database schema for the LawQuest AI-powered Legal Literacy Platform. The schema is designed for Supabase (PostgreSQL) with Row Level Security (RLS) policies, optimized indexes, and helper functions.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        LAWQUEST DATABASE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   AUTH &      │  │ GAMIFICATION │  │   COURTROOM          │  │
│  │   PROFILES    │  │   SYSTEM     │  │   SIMULATOR          │  │
│  │              │  │              │  │                      │  │
│  │ • profiles   │  │ • xp_trans   │  │ • cases              │  │
│  │ • notif_pref │  │ • coin_trans │  │ • case_evidence      │  │
│  │              │  │ • badges     │  │ • courtroom_sessions │  │
│  │              │  │ • user_badges│  │ • courtroom_turns    │  │
│  │              │  │ • daily_chal │  │                      │  │
│  │              │  │ • leaderboard│  │                      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ AI ASSISTANT │  │ QUIZ ENGINE  │  │   LEARNING MODULES   │  │
│  │              │  │              │  │                      │  │
│  │ • threads    │  │ • topics     │  │ • learning_tracks    │  │
│  │ • messages   │  │ • questions  │  │ • lessons            │  │
│  │              │  │ • sessions   │  │ • user_lesson_prog   │  │
│  │              │  │ • answers    │  │ • user_track_prog    │  │
│  │              │  │ • mastery    │  │ • certificates       │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│                                                                  │
│  ┌──────────────┐  ┌──────────────────────────────────────────┐ │
│  │  COMMUNITY   │  │          ADMIN & ANALYTICS               │ │
│  │              │  │                                          │ │
│  │ • threads    │  │ • analytics_events                       │ │
│  │ • replies    │  │ • admin_audit_log                        │ │
│  │ • likes      │  │ • feature_flags                          │ │
│  └──────────────┘  └──────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Tables (30 total)

### Authentication & Profiles
| Table | Description |
|-------|-------------|
| `profiles` | User profiles extending Supabase auth (level, XP, coins, streak) |
| `notification_preferences` | Per-user notification settings |

### Gamification System
| Table | Description |
|-------|-------------|
| `xp_transactions` | XP earning history with source tracking |
| `coin_transactions` | Virtual currency transaction log |
| `badges` | Badge definitions (criteria, rewards, rarity) |
| `user_badges` | Badges earned by users |
| `daily_challenges` | Daily quest definitions |
| `user_daily_challenges` | User progress on daily quests |
| `leaderboard` | Weekly/monthly/all-time rankings |

### Courtroom Simulator
| Table | Description |
|-------|-------------|
| `cases` | Case definitions with facts, jurisdiction, difficulty |
| `case_evidence` | Evidence items attached to cases |
| `courtroom_sessions` | User sessions with scoring and verdict |
| `courtroom_turns` | Conversation transcript per session |

### AI Legal Assistant
| Table | Description |
|-------|-------------|
| `assistant_threads` | Conversation threads per user |
| `assistant_messages` | Individual messages with citations |

### Adaptive Quiz Engine
| Table | Description |
|-------|-------------|
| `quiz_topics` | Quiz categories (constitutional, consumer, etc.) |
| `quiz_questions` | Question bank with options, rationale, difficulty |
| `quiz_sessions` | Active/completed quiz sessions |
| `quiz_answers` | Per-question answers with timing |
| `user_topic_mastery` | Adaptive difficulty tracking per topic |

### Learning Modules (Academy)
| Table | Description |
|-------|-------------|
| `learning_tracks` | Course tracks (6 pillars) |
| `lessons` | Individual lessons within tracks |
| `user_lesson_progress` | Per-lesson completion status |
| `user_track_progress` | Aggregate track progress |
| `certificates` | Issued completion certificates |

### Community
| Table | Description |
|-------|-------------|
| `discussion_threads` | Forum discussion threads |
| `discussion_replies` | Thread replies |
| `likes` | Likes on threads and replies |

### Admin & Analytics
| Table | Description |
|-------|-------------|
| `analytics_events` | Platform usage events |
| `admin_audit_log` | Admin action audit trail |
| `feature_flags` | Feature toggle system |

## Key Features

### Row Level Security (RLS)
Every table has RLS enabled with appropriate policies:
- **Public data** (badges, cases, leaderboard): readable by all
- **User data** (sessions, progress, threads): restricted to owner
- **Admin data** (audit logs, analytics): restricted to admin/super_admin roles

### Roles
- `user` — Standard learner
- `admin` — Content manager (cases, questions, tracks)
- `super_admin` — Full platform access

### Helper Functions
- `award_xp(user_id, amount, source)` — Awards XP and auto-levels up
- `award_coins(user_id, amount, source)` — Awards coins with transaction log
- `update_streak(user_id)` — Manages daily streak logic
- `handle_new_user()` — Auto-creates profile on signup (trigger)
- `update_updated_at()` — Auto-updates timestamps (trigger)

### Level System
| Level | Title | XP Required |
|-------|-------|-------------|
| 1-2 | Novice | 0-1,999 |
| 3-5 | Law Clerk | 2,000-5,999 |
| 6-8 | Junior Counsel | 6,000-8,999 |
| 9-11 | Advocate | 9,000-11,999 |
| 12-14 | Senior Advocate | 12,000-14,999 |
| 15-19 | High Court Judge | 15,000-19,999 |
| 20+ | Supreme Court Justice | 20,000+ |

## Setup Instructions

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor in your Supabase dashboard
3. Copy and paste the contents of `schema.sql`
4. Execute the SQL
5. Configure environment variables in your app:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Seed Data Included

The schema includes seed data for:
- 12 badge definitions (common → legendary)
- 6 quiz topics
- 6 learning tracks
- 6 courtroom cases with evidence