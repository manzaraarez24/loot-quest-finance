export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      equipped_accessories: {
        Row: {
          accessory_id: string
          accessory_type: string
          equipped_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          accessory_id: string
          accessory_type: string
          equipped_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          accessory_id?: string
          accessory_type?: string
          equipped_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          id: string
          item_description: string | null
          item_icon: string | null
          item_id: string
          item_name: string
          item_rarity: string
          item_type: string
          obtained_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          item_description?: string | null
          item_icon?: string | null
          item_id: string
          item_name: string
          item_rarity: string
          item_type: string
          obtained_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          item_description?: string | null
          item_icon?: string | null
          item_id?: string
          item_name?: string
          item_rarity?: string
          item_type?: string
          obtained_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_stage: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_stage?: string | null
          created_at?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_stage?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: string | null
          created_at: string | null
          description: string
          id: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string | null
          description: string
          id?: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string | null
          description?: string
          id?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_bosses: {
        Row: {
          boss_id: string
          boss_name: string
          cost: number
          created_at: string | null
          current_hp: number
          defeated_at: string | null
          due_date: string | null
          gem_reward: number
          id: string
          is_defeated: boolean | null
          max_hp: number
          user_id: string
          xp_reward: number
        }
        Insert: {
          boss_id: string
          boss_name: string
          cost: number
          created_at?: string | null
          current_hp: number
          defeated_at?: string | null
          due_date?: string | null
          gem_reward: number
          id?: string
          is_defeated?: boolean | null
          max_hp: number
          user_id: string
          xp_reward: number
        }
        Update: {
          boss_id?: string
          boss_name?: string
          cost?: number
          created_at?: string | null
          current_hp?: number
          defeated_at?: string | null
          due_date?: string | null
          gem_reward?: number
          id?: string
          is_defeated?: boolean | null
          max_hp?: number
          user_id?: string
          xp_reward?: number
        }
        Relationships: []
      }
      user_dungeons: {
        Row: {
          budget: number
          category: string
          created_at: string | null
          dungeon_id: string
          dungeon_name: string
          id: string
          is_completed: boolean | null
          monsters_defeated: number | null
          spent: number | null
          total_monsters: number
          user_id: string
        }
        Insert: {
          budget: number
          category: string
          created_at?: string | null
          dungeon_id: string
          dungeon_name: string
          id?: string
          is_completed?: boolean | null
          monsters_defeated?: number | null
          spent?: number | null
          total_monsters: number
          user_id: string
        }
        Update: {
          budget?: number
          category?: string
          created_at?: string | null
          dungeon_id?: string
          dungeon_name?: string
          id?: string
          is_completed?: boolean | null
          monsters_defeated?: number | null
          spent?: number | null
          total_monsters?: number
          user_id?: string
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          balance: number | null
          created_at: string | null
          expected_expenses: number | null
          gems: number | null
          hp: number | null
          id: string
          level: number | null
          max_hp: number | null
          monthly_limit: number | null
          no_spend_streak: number | null
          onboarding_completed: boolean | null
          updated_at: string | null
          user_id: string
          xp: number | null
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          expected_expenses?: number | null
          gems?: number | null
          hp?: number | null
          id?: string
          level?: number | null
          max_hp?: number | null
          monthly_limit?: number | null
          no_spend_streak?: number | null
          onboarding_completed?: boolean | null
          updated_at?: string | null
          user_id: string
          xp?: number | null
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          expected_expenses?: number | null
          gems?: number | null
          hp?: number | null
          id?: string
          level?: number | null
          max_hp?: number | null
          monthly_limit?: number | null
          no_spend_streak?: number | null
          onboarding_completed?: boolean | null
          updated_at?: string | null
          user_id?: string
          xp?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
