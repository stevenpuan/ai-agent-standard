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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip: string | null
          route: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip?: string | null
          route?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip?: string | null
          route?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_skills: {
        Row: {
          content: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          status?: string
          type?: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      agent_templates: {
        Row: {
          claude_md: string | null
          created_at: string
          department_id: string | null
          description: string | null
          emoji: string | null
          id: string
          name: string
          role: string | null
          skills: Json
          subagents: Json
          tone: string | null
          updated_at: string
        }
        Insert: {
          claude_md?: string | null
          created_at?: string
          department_id?: string | null
          description?: string | null
          emoji?: string | null
          id?: string
          name: string
          role?: string | null
          skills?: Json
          subagents?: Json
          tone?: string | null
          updated_at?: string
        }
        Update: {
          claude_md?: string | null
          created_at?: string
          department_id?: string | null
          description?: string | null
          emoji?: string | null
          id?: string
          name?: string
          role?: string | null
          skills?: Json
          subagents?: Json
          tone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_templates_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_tokens: {
        Row: {
          created_at: string
          id: string
          last_used_at: string | null
          name: string
          owner_id: string | null
          token: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_used_at?: string | null
          name: string
          owner_id?: string | null
          token: string
        }
        Update: {
          created_at?: string
          id?: string
          last_used_at?: string | null
          name?: string
          owner_id?: string | null
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_tokens_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      attachments: {
        Row: {
          bucket: string
          created_at: string
          filename: string | null
          id: string
          mime: string | null
          path: string
          size: number | null
          uploaded_by: string | null
        }
        Insert: {
          bucket?: string
          created_at?: string
          filename?: string | null
          id?: string
          mime?: string | null
          path: string
          size?: number | null
          uploaded_by?: string | null
        }
        Update: {
          bucket?: string
          created_at?: string
          filename?: string | null
          id?: string
          mime?: string | null
          path?: string
          size?: number | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          after: Json | null
          before: Json | null
          created_at: string
          id: string
          ip: string | null
          target_id: string | null
          target_table: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          after?: Json | null
          before?: Json | null
          created_at?: string
          id?: string
          ip?: string | null
          target_id?: string | null
          target_table?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          after?: Json | null
          before?: Json | null
          created_at?: string
          id?: string
          ip?: string | null
          target_id?: string | null
          target_table?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      changelogs: {
        Row: {
          content: string | null
          created_at: string
          id: string
          released_at: string | null
          title: string
          type: string | null
          version: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          released_at?: string | null
          title: string
          type?: string | null
          version: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          released_at?: string | null
          title?: string
          type?: string | null
          version?: string
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          brand_tone: string | null
          core_values: string | null
          global_principles: string | null
          id: number
          industry: string | null
          name: string | null
          updated_at: string
        }
        Insert: {
          brand_tone?: string | null
          core_values?: string | null
          global_principles?: string | null
          id?: number
          industry?: string | null
          name?: string | null
          updated_at?: string
        }
        Update: {
          brand_tone?: string | null
          core_values?: string | null
          global_principles?: string | null
          id?: number
          industry?: string | null
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          code: string | null
          created_at: string
          description: string | null
          emoji: string | null
          id: string
          is_active: boolean
          name: string
          sort_order: number
        }
        Insert: {
          code?: string | null
          created_at?: string
          description?: string | null
          emoji?: string | null
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number
        }
        Update: {
          code?: string | null
          created_at?: string
          description?: string | null
          emoji?: string | null
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      dev_todos: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          done_at: string | null
          id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          done_at?: string | null
          id?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          done_at?: string | null
          id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dev_todos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      doc_pages: {
        Row: {
          content: string | null
          id: string
          key: string
          title: string | null
          updated_at: string
        }
        Insert: {
          content?: string | null
          id?: string
          key: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          content?: string | null
          id?: string
          key?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          context: Json | null
          created_at: string
          id: string
          level: string
          message: string | null
          route: string | null
          stack: string | null
          user_id: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string
          id?: string
          level?: string
          message?: string | null
          route?: string | null
          stack?: string | null
          user_id?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string
          id?: string
          level?: string
          message?: string | null
          route?: string | null
          stack?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "error_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_requests: {
        Row: {
          area: string | null
          created_at: string
          description: string | null
          id: string
          points_cost: number
          status: string
          submitter_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          area?: string | null
          created_at?: string
          description?: string | null
          id?: string
          points_cost?: number
          status?: string
          submitter_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          area?: string | null
          created_at?: string
          description?: string | null
          id?: string
          points_cost?: number
          status?: string
          submitter_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feature_requests_submitter_id_fkey"
            columns: ["submitter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          code: string
          created_at: string
          email: string | null
          expires_at: string | null
          id: string
          invited_by: string | null
          role_id: string | null
          status: string
          used_at: string | null
        }
        Insert: {
          code: string
          created_at?: string
          email?: string | null
          expires_at?: string | null
          id?: string
          invited_by?: string | null
          role_id?: string | null
          status?: string
          used_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          email?: string | null
          expires_at?: string | null
          id?: string
          invited_by?: string | null
          role_id?: string | null
          status?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      issue_reports: {
        Row: {
          created_at: string
          description: string | null
          id: string
          reporter_id: string | null
          severity: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          reporter_id?: string | null
          severity?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          reporter_id?: string | null
          severity?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "issue_reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lookups: {
        Row: {
          category: string
          code: string
          created_at: string
          id: string
          is_active: boolean
          label: string
          sort_order: number
        }
        Insert: {
          category: string
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          label: string
          sort_order?: number
        }
        Update: {
          category?: string
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string
          sort_order?: number
        }
        Relationships: []
      }
      menus: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          is_active: boolean
          menu_key: string
          module_key: string | null
          page_key: string | null
          parent_id: string | null
          route: string | null
          sort_order: number
          title: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          menu_key: string
          module_key?: string | null
          page_key?: string | null
          parent_id?: string | null
          route?: string | null
          sort_order?: number
          title: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          menu_key?: string
          module_key?: string | null
          page_key?: string | null
          parent_id?: string | null
          route?: string | null
          sort_order?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "menus_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "menus"
            referencedColumns: ["id"]
          },
        ]
      }
      my_agents: {
        Row: {
          claude_md: string | null
          created_at: string
          department_id: string | null
          id: string
          name: string
          owner_id: string | null
          role: string | null
          skills: Json
          status: string
          subagents: Json
          updated_at: string
        }
        Insert: {
          claude_md?: string | null
          created_at?: string
          department_id?: string | null
          id?: string
          name: string
          owner_id?: string | null
          role?: string | null
          skills?: Json
          status?: string
          subagents?: Json
          updated_at?: string
        }
        Update: {
          claude_md?: string | null
          created_at?: string
          department_id?: string | null
          id?: string
          name?: string
          owner_id?: string | null
          role?: string | null
          skills?: Json
          status?: string
          subagents?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "my_agents_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "my_agents_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          last_login_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          last_login_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          last_login_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      role_module_permissions: {
        Row: {
          can_create: boolean
          can_delete: boolean
          can_edit: boolean
          can_export: boolean
          can_view: boolean
          module_key: string
          role_id: string
        }
        Insert: {
          can_create?: boolean
          can_delete?: boolean
          can_edit?: boolean
          can_export?: boolean
          can_view?: boolean
          module_key: string
          role_id: string
        }
        Update: {
          can_create?: boolean
          can_delete?: boolean
          can_edit?: boolean
          can_export?: boolean
          can_view?: boolean
          module_key?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_module_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      role_page_permissions: {
        Row: {
          can_create: boolean | null
          can_delete: boolean | null
          can_edit: boolean | null
          can_export: boolean | null
          can_view: boolean | null
          page_key: string
          role_id: string
        }
        Insert: {
          can_create?: boolean | null
          can_delete?: boolean | null
          can_edit?: boolean | null
          can_export?: boolean | null
          can_view?: boolean | null
          page_key: string
          role_id: string
        }
        Update: {
          can_create?: boolean | null
          can_delete?: boolean | null
          can_edit?: boolean | null
          can_export?: boolean | null
          can_view?: boolean | null
          page_key?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_page_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          is_system: boolean
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          is_system?: boolean
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_system?: boolean
          name?: string
        }
        Relationships: []
      }
      system_configs: {
        Row: {
          description: string | null
          group_name: string | null
          id: string
          key: string
          updated_at: string
          value: string | null
          value_type: string
        }
        Insert: {
          description?: string | null
          group_name?: string | null
          id?: string
          key: string
          updated_at?: string
          value?: string | null
          value_type?: string
        }
        Update: {
          description?: string | null
          group_name?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: string | null
          value_type?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          role_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          role_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wish_point_ledger: {
        Row: {
          balance: number
          change: number
          created_at: string
          id: string
          period: string
          reason: string | null
          ref_id: string | null
        }
        Insert: {
          balance: number
          change: number
          created_at?: string
          id?: string
          period: string
          reason?: string | null
          ref_id?: string | null
        }
        Update: {
          balance?: number
          change?: number
          created_at?: string
          id?: string
          period?: string
          reason?: string | null
          ref_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      daily_maintenance: { Args: never; Returns: Json }
      is_admin: { Args: never; Returns: boolean }
      redeem_invitation: { Args: { p_code: string }; Returns: string }
      user_can: {
        Args: { p_action: string; p_module: string }
        Returns: boolean
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
