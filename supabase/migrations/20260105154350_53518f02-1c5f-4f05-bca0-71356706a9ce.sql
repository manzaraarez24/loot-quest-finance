-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  avatar_stage TEXT DEFAULT 'egg',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_stats table
CREATE TABLE public.user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance NUMERIC DEFAULT 1000,
  monthly_limit NUMERIC DEFAULT 2000,
  hp INTEGER DEFAULT 100,
  max_hp INTEGER DEFAULT 100,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  gems INTEGER DEFAULT 0,
  no_spend_streak INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
  amount NUMERIC NOT NULL,
  category TEXT,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create inventory table
CREATE TABLE public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  item_name TEXT NOT NULL,
  item_type TEXT NOT NULL,
  item_rarity TEXT NOT NULL,
  item_description TEXT,
  item_icon TEXT,
  obtained_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, item_id)
);

-- Create user_bosses table
CREATE TABLE public.user_bosses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  boss_id TEXT NOT NULL,
  boss_name TEXT NOT NULL,
  current_hp INTEGER NOT NULL,
  max_hp INTEGER NOT NULL,
  cost NUMERIC NOT NULL,
  xp_reward INTEGER NOT NULL,
  gem_reward INTEGER NOT NULL,
  due_date DATE,
  is_defeated BOOLEAN DEFAULT false,
  defeated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, boss_id)
);

-- Create user_dungeons table
CREATE TABLE public.user_dungeons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dungeon_id TEXT NOT NULL,
  dungeon_name TEXT NOT NULL,
  category TEXT NOT NULL,
  budget NUMERIC NOT NULL,
  spent NUMERIC DEFAULT 0,
  monsters_defeated INTEGER DEFAULT 0,
  total_monsters INTEGER NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, dungeon_id)
);

-- Create equipped_accessories table
CREATE TABLE public.equipped_accessories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  accessory_type TEXT NOT NULL CHECK (accessory_type IN ('hat', 'weapon', 'aura', 'pet')),
  accessory_id TEXT NOT NULL,
  equipped_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, accessory_type)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bosses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_dungeons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipped_accessories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for user_stats
CREATE POLICY "Users can view own stats" ON public.user_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own stats" ON public.user_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own stats" ON public.user_stats FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for transactions
CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own transactions" ON public.transactions FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for inventory
CREATE POLICY "Users can view own inventory" ON public.inventory FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own inventory" ON public.inventory FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own inventory" ON public.inventory FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_bosses
CREATE POLICY "Users can view own bosses" ON public.user_bosses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own bosses" ON public.user_bosses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bosses" ON public.user_bosses FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_dungeons
CREATE POLICY "Users can view own dungeons" ON public.user_dungeons FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own dungeons" ON public.user_dungeons FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own dungeons" ON public.user_dungeons FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for equipped_accessories
CREATE POLICY "Users can view own accessories" ON public.equipped_accessories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own accessories" ON public.equipped_accessories FOR ALL USING (auth.uid() = user_id);

-- Create trigger for new user profile and stats
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'username');
  
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON public.user_stats FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();