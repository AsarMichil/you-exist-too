export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      invites: {
        Row: {
          anonymous: boolean
          id: number
          invitee_email: string
          inviter_id: string
        }
        Insert: {
          anonymous?: boolean
          id?: never
          invitee_email: string
          inviter_id: string
        }
        Update: {
          anonymous?: boolean
          id?: never
          invitee_email?: string
          inviter_id?: string
        }
        Relationships: []
      }
      logs: {
        Row: {
          created_at: string
          id: number
          ip: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          ip?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          ip?: string | null
        }
        Relationships: []
      }
      person: {
        Row: {
          birthdate: string | null
          blurb: string | null
          country: string | null
          created_at: string
          email: string | null
          family_name: string | null
          given_name: string | null
          id: string
          preferred_name: string | null
          profile_photo_id: string | null
          search_vector: unknown | null
          thoughts_thought: number
          username: string
        }
        Insert: {
          birthdate?: string | null
          blurb?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          family_name?: string | null
          given_name?: string | null
          id: string
          preferred_name?: string | null
          profile_photo_id?: string | null
          search_vector?: unknown | null
          thoughts_thought?: number
          username: string
        }
        Update: {
          birthdate?: string | null
          blurb?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          family_name?: string | null
          given_name?: string | null
          id?: string
          preferred_name?: string | null
          profile_photo_id?: string | null
          search_vector?: unknown | null
          thoughts_thought?: number
          username?: string
        }
        Relationships: []
      }
      social_links: {
        Row: {
          id: number
          platform: string
          user_id: string
          username: string
        }
        Insert: {
          id?: never
          platform: string
          user_id: string
          username: string
        }
        Update: {
          id?: never
          platform?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      thought: {
        Row: {
          about: string
          created_at: string
          id: number
          thinker: string | null
        }
        Insert: {
          about: string
          created_at?: string
          id?: number
          thinker?: string | null
        }
        Update: {
          about?: string
          created_at?: string
          id?: number
          thinker?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "thought_about_fkey"
            columns: ["about"]
            isOneToOne: false
            referencedRelation: "person"
            referencedColumns: ["username"]
          },
          {
            foreignKeyName: "thought_thinker_fkey"
            columns: ["thinker"]
            isOneToOne: false
            referencedRelation: "person"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      search_person: {
        Args:
          | { search_term: string }
          | { search_term: string; is_autocomplete?: boolean }
        Returns: {
          birthdate: string | null
          blurb: string | null
          country: string | null
          created_at: string
          email: string | null
          family_name: string | null
          given_name: string | null
          id: string
          preferred_name: string | null
          profile_photo_id: string | null
          search_vector: unknown | null
          thoughts_thought: number
          username: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
