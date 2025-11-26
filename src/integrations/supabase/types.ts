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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string
          id: string
          metadata: Json | null
          user_id: string
          warehouse_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description: string
          id?: string
          metadata?: Json | null
          user_id: string
          warehouse_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string
          id?: string
          metadata?: Json | null
          user_id?: string
          warehouse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      category_performance: {
        Row: {
          average_time_minutes: number | null
          category: string
          created_at: string | null
          date: string
          failed_picks: number | null
          id: string
          successful_picks: number | null
          total_picks: number | null
          updated_at: string | null
          warehouse_id: string
        }
        Insert: {
          average_time_minutes?: number | null
          category: string
          created_at?: string | null
          date?: string
          failed_picks?: number | null
          id?: string
          successful_picks?: number | null
          total_picks?: number | null
          updated_at?: string | null
          warehouse_id: string
        }
        Update: {
          average_time_minutes?: number | null
          category?: string
          created_at?: string | null
          date?: string
          failed_picks?: number | null
          id?: string
          successful_picks?: number | null
          total_picks?: number | null
          updated_at?: string | null
          warehouse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_performance_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          created_at: string | null
          id: string
          is_broadcast: boolean
          message_text: string
          message_type: string
          recipient_id: string | null
          sender_id: string
          warehouse_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_broadcast?: boolean
          message_text: string
          message_type?: string
          recipient_id?: string | null
          sender_id: string
          warehouse_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_broadcast?: boolean
          message_text?: string
          message_type?: string
          recipient_id?: string | null
          sender_id?: string
          warehouse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          location: string
          product_name: string
          quantity: number
          reserved_quantity: number
          sku: string
          unit_price: number | null
          updated_at: string | null
          warehouse_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          location: string
          product_name: string
          quantity?: number
          reserved_quantity?: number
          sku: string
          unit_price?: number | null
          updated_at?: string | null
          warehouse_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          location?: string
          product_name?: string
          quantity?: number
          reserved_quantity?: number
          sku?: string
          unit_price?: number | null
          updated_at?: string | null
          warehouse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_metrics: {
        Row: {
          average_pick_time: unknown
          created_at: string | null
          date: string
          efficiency_score: number | null
          exceptions: number
          id: string
          picker_id: string
          successful_picks: number
          total_picks: number
          warehouse_id: string
        }
        Insert: {
          average_pick_time?: unknown
          created_at?: string | null
          date: string
          efficiency_score?: number | null
          exceptions?: number
          id?: string
          picker_id: string
          successful_picks?: number
          total_picks?: number
          warehouse_id: string
        }
        Update: {
          average_pick_time?: unknown
          created_at?: string | null
          date?: string
          efficiency_score?: number | null
          exceptions?: number
          id?: string
          picker_id?: string
          successful_picks?: number
          total_picks?: number
          warehouse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "performance_metrics_picker_id_fkey"
            columns: ["picker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_metrics_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      pick_list_items: {
        Row: {
          created_at: string | null
          id: string
          inventory_id: string
          pick_list_id: string
          picked_at: string | null
          picker_notes: string | null
          quantity_picked: number
          quantity_requested: number
          status: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          inventory_id: string
          pick_list_id: string
          picked_at?: string | null
          picker_notes?: string | null
          quantity_picked?: number
          quantity_requested: number
          status?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          inventory_id?: string
          pick_list_id?: string
          picked_at?: string | null
          picker_notes?: string | null
          quantity_picked?: number
          quantity_requested?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "pick_list_items_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pick_list_items_pick_list_id_fkey"
            columns: ["pick_list_id"]
            isOneToOne: false
            referencedRelation: "pick_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      pick_lists: {
        Row: {
          assigned_picker_id: string | null
          completed_at: string | null
          created_at: string | null
          id: string
          list_number: string
          picked_items: number
          priority: string
          status: string
          total_items: number
          updated_at: string | null
          warehouse_id: string
        }
        Insert: {
          assigned_picker_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          list_number: string
          picked_items?: number
          priority?: string
          status?: string
          total_items?: number
          updated_at?: string | null
          warehouse_id: string
        }
        Update: {
          assigned_picker_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          list_number?: string
          picked_items?: number
          priority?: string
          status?: string
          total_items?: number
          updated_at?: string | null
          warehouse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pick_lists_assigned_picker_id_fkey"
            columns: ["assigned_picker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pick_lists_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          employee_id: string
          full_name: string
          id: string
          role: string
          updated_at: string | null
          warehouse_id: string | null
        }
        Insert: {
          created_at?: string | null
          employee_id: string
          full_name: string
          id: string
          role: string
          updated_at?: string | null
          warehouse_id?: string | null
        }
        Update: {
          created_at?: string | null
          employee_id?: string
          full_name?: string
          id?: string
          role?: string
          updated_at?: string | null
          warehouse_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_profiles_warehouse"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      task_assignments: {
        Row: {
          assigned_at: string | null
          created_at: string | null
          due_date: string | null
          id: string
          notes: string | null
          picker_id: string
          priority: string
          status: string
          supervisor_id: string
          task_id: string | null
          task_type: string
          updated_at: string | null
          warehouse_id: string
        }
        Insert: {
          assigned_at?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          picker_id: string
          priority?: string
          status?: string
          supervisor_id: string
          task_id?: string | null
          task_type?: string
          updated_at?: string | null
          warehouse_id: string
        }
        Update: {
          assigned_at?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          picker_id?: string
          priority?: string
          status?: string
          supervisor_id?: string
          task_id?: string | null
          task_type?: string
          updated_at?: string | null
          warehouse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_assignments_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      warehouses: {
        Row: {
          created_at: string | null
          id: string
          location: string
          manager_id: string | null
          name: string
          updated_at: string | null
          wms_config: Json | null
          wms_integration_type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          location: string
          manager_id?: string | null
          name: string
          updated_at?: string | null
          wms_config?: Json | null
          wms_integration_type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          location?: string
          manager_id?: string | null
          name?: string
          updated_at?: string | null
          wms_config?: Json | null
          wms_integration_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "warehouses_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
