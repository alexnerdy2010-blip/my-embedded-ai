# RefAI Database Schema Documentation

## Overview
This document describes the complete database schema for the RefAI Basketball Rules Assistant application, including tables, columns, security policies, and functions.

---

## Tables

### `profiles`
Stores user profile information that is created automatically when a user signs up.

**Columns:**

| Column Name | Type | Nullable | Default | Description |
|------------|------|----------|---------|-------------|
| `id` | uuid | No | - | Primary key, references auth.users |
| `created_at` | timestamp with time zone | No | now() | Timestamp when profile was created |
| `updated_at` | timestamp with time zone | No | now() | Timestamp of last update |
| `username` | text | Yes | - | User's display name |
| `avatar_url` | text | Yes | - | URL to user's avatar image |

**Row Level Security (RLS) Policies:**

| Policy Name | Command | Description |
|------------|---------|-------------|
| Profiles are viewable by everyone | SELECT | Anyone can view all profiles |
| Users can insert their own profile | INSERT | Users can only create their own profile (auth.uid() = id) |
| Users can update their own profile | UPDATE | Users can only update their own profile (auth.uid() = id) |

**Restrictions:**
- Users **cannot** DELETE profiles through the API

**Foreign Keys:**
- `id` references `auth.users(id)` with cascade delete

---

## Database Functions

### `handle_new_user()`
**Type:** Trigger Function  
**Security:** DEFINER  
**Purpose:** Automatically creates a profile entry when a new user signs up

**Behavior:**
- Triggers on INSERT to `auth.users`
- Extracts `username` and `avatar_url` from user metadata
- Creates corresponding entry in `public.profiles` table

**SQL Definition:**
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$function$
```

### `update_updated_at_column()`
**Type:** Trigger Function  
**Security:** DEFINER  
**Purpose:** Automatically updates the `updated_at` timestamp on row modifications

**Behavior:**
- Triggers on UPDATE to tables where applied
- Sets `updated_at` to current timestamp

**SQL Definition:**
```sql
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
```

---

## Triggers

Currently, there are no active triggers configured in the database.

**Note:** While the `handle_new_user()` and `update_updated_at_column()` functions exist, their corresponding triggers may need to be configured.

---

## Security Architecture

### Authentication
- Users authenticate through Supabase Auth (email/password)
- Auto-confirm email signups are enabled
- Session management via localStorage with auto-refresh

### Row Level Security (RLS)
All tables have RLS enabled with specific policies:

**Public Data:**
- All profiles are publicly viewable

**Protected Operations:**
- Profile creation and updates are restricted to the profile owner
- Verified through `auth.uid()` matching the profile `id`

### Best Practices Implemented
✅ Foreign key references to auth.users for automatic cleanup  
✅ RLS enabled on all user-facing tables  
✅ Security definer functions with explicit search_path  
✅ Automatic timestamp tracking  
✅ Proper authentication flow with redirects

---

## Schema Diagram

```
┌─────────────────────────┐
│     auth.users          │
│  (Supabase Managed)     │
└───────────┬─────────────┘
            │
            │ on delete cascade
            │
            ▼
┌─────────────────────────┐
│   public.profiles       │
├─────────────────────────┤
│ • id (PK, FK)           │
│ • created_at            │
│ • updated_at            │
│ • username              │
│ • avatar_url            │
└─────────────────────────┘

Triggers:
- handle_new_user() → Creates profile on user signup
- update_updated_at_column() → Updates timestamp on changes
```

---

## Future Expansion Opportunities

Based on the current schema, here are potential tables you might want to add:

1. **chat_conversations** - Store user chat history
2. **basketball_rules** - Store basketball rules and regulations
3. **user_favorites** - Bookmark frequently asked questions
4. **feedback** - Collect user feedback on responses
5. **game_scenarios** - Store specific game situations and rulings

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2025-11-23 | 1.0 | Initial schema with profiles table |

---

## Notes

- This is a Lovable Cloud project using Supabase backend
- All environment variables are managed automatically
- Database migrations are version-controlled
- Schema changes should be done through migrations for proper tracking
