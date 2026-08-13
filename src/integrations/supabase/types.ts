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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string
          description: string | null
          happened_on: string
          id: string
          member_id: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          happened_on?: string
          id?: string
          member_id?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          happened_on?: string
          id?: string
          member_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievements_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          author_id: string | null
          body: string
          created_at: string
          id: string
          pinned: boolean
          published: boolean
          team_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          body: string
          created_at?: string
          id?: string
          pinned?: boolean
          published?: boolean
          team_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          body?: string
          created_at?: string
          id?: string
          pinned?: boolean
          published?: boolean
          team_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          branch: string | null
          created_at: string
          email: string
          id: string
          links: string | null
          name: string
          notes: string | null
          phone: string | null
          status: string
          team_first: string | null
          team_second: string | null
          updated_at: string
          usn: string | null
          why: string | null
          year: string | null
        }
        Insert: {
          branch?: string | null
          created_at?: string
          email: string
          id?: string
          links?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          status?: string
          team_first?: string | null
          team_second?: string | null
          updated_at?: string
          usn?: string | null
          why?: string | null
          year?: string | null
        }
        Update: {
          branch?: string | null
          created_at?: string
          email?: string
          id?: string
          links?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          status?: string
          team_first?: string | null
          team_second?: string | null
          updated_at?: string
          usn?: string | null
          why?: string | null
          year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_team_first_fkey"
            columns: ["team_first"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_team_second_fkey"
            columns: ["team_second"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      badges: {
        Row: {
          created_at: string
          description: string | null
          icon: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string
          id: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          checked_in_at: string | null
          checked_in_by: string | null
          code: string
          created_at: string
          email: string
          event_id: string
          id: string
          name: string
          phone: string | null
          usn: string | null
        }
        Insert: {
          checked_in_at?: string | null
          checked_in_by?: string | null
          code?: string
          created_at?: string
          email: string
          event_id: string
          id?: string
          name: string
          phone?: string | null
          usn?: string | null
        }
        Update: {
          checked_in_at?: string | null
          checked_in_by?: string | null
          code?: string
          created_at?: string
          email?: string
          event_id?: string
          id?: string
          name?: string
          phone?: string | null
          usn?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          capacity: number | null
          cover_url: string | null
          created_at: string
          description: string | null
          event_date: string
          id: string
          location: string
          published: boolean
          slug: string
          start_time: string | null
          tag: string
          title: string
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          event_date: string
          id?: string
          location?: string
          published?: boolean
          slug: string
          start_time?: string | null
          tag?: string
          title: string
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          event_date?: string
          id?: string
          location?: string
          published?: boolean
          slug?: string
          start_time?: string | null
          tag?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      member_badges: {
        Row: {
          awarded_on: string
          badge_id: string
          member_id: string
          note: string | null
        }
        Insert: {
          awarded_on?: string
          badge_id: string
          member_id: string
          note?: string | null
        }
        Update: {
          awarded_on?: string
          badge_id?: string
          member_id?: string
          note?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "member_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_badges_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          is_head: boolean
          is_leadership: boolean
          links: Json
          name: string
          photo_url: string | null
          role: string
          skills: string[]
          slug: string
          sort_order: number
          team_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id?: string
          is_head?: boolean
          is_leadership?: boolean
          links?: Json
          name: string
          photo_url?: string | null
          role?: string
          skills?: string[]
          slug: string
          sort_order?: number
          team_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          is_head?: boolean
          is_leadership?: boolean
          links?: Json
          name?: string
          photo_url?: string | null
          role?: string
          skills?: string[]
          slug?: string
          sort_order?: number
          team_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_requests: {
        Row: {
          created_at: string
          id: string
          mentee_id: string
          mentor_id: string
          message: string | null
          status: string
          topic: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          mentee_id: string
          mentor_id: string
          message?: string | null
          status?: string
          topic: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          mentee_id?: string
          mentor_id?: string
          message?: string | null
          status?: string
          topic?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_requests_mentee_id_fkey"
            columns: ["mentee_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_requests_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      project_contributors: {
        Row: {
          member_id: string
          project_id: string
        }
        Insert: {
          member_id: string
          project_id: string
        }
        Update: {
          member_id?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_contributors_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_contributors_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          cover_url: string | null
          created_at: string
          description: string | null
          id: string
          link: string | null
          published: boolean
          slug: string
          tech: string[]
          title: string
          year: number | null
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          link?: string | null
          published?: boolean
          slug: string
          tech?: string[]
          title: string
          year?: number | null
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          link?: string | null
          published?: boolean
          slug?: string
          tech?: string[]
          title?: string
          year?: number | null
        }
        Relationships: []
      }
      teams: {
        Row: {
          blurb: string | null
          code: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          blurb?: string | null
          code: string
          id: string
          name: string
          sort_order?: number
        }
        Update: {
          blurb?: string | null
          code?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_head_of: {
        Args: { _team_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "head" | "member"
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
    Enums: {
      app_role: ["admin", "head", "member"],
    },
  },
} as const
