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
      budget: {
        Row: {
          created_at: string
          id: string
          name: string
          password: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          password: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          password?: string
        }
        Relationships: []
      }
      entertainment_budget: {
        Row: {
          amount: number
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          bank_account: string | null
          category: string
          created_at: string
          currency_symbol: string | null
          date: string
          id: string
          is_deleted: boolean | null
          name: string
          notes: string | null
          savings_account: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          bank_account?: string | null
          category: string
          created_at?: string
          currency_symbol?: string | null
          date?: string
          id?: string
          is_deleted?: boolean | null
          name: string
          notes?: string | null
          savings_account?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          bank_account?: string | null
          category?: string
          created_at?: string
          currency_symbol?: string | null
          date?: string
          id?: string
          is_deleted?: boolean | null
          name?: string
          notes?: string | null
          savings_account?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      groceries_budget: {
        Row: {
          amount: number
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      history: {
        Row: {
          amount_saved: number | null
          created_at: string
          expenses: number | null
          id: string
          income: number | null
          month: string
          remaining_balance: number
          total_apple: number | null
          total_chase: number | null
          total_euro: number | null
          user_id: string | null
          year: number
        }
        Insert: {
          amount_saved?: number | null
          created_at?: string
          expenses?: number | null
          id?: string
          income?: number | null
          month: string
          remaining_balance: number
          total_apple?: number | null
          total_chase?: number | null
          total_euro?: number | null
          user_id?: string | null
          year: number
        }
        Update: {
          amount_saved?: number | null
          created_at?: string
          expenses?: number | null
          id?: string
          income?: number | null
          month?: string
          remaining_balance?: number
          total_apple?: number | null
          total_chase?: number | null
          total_euro?: number | null
          user_id?: string | null
          year?: number
        }
        Relationships: []
      }
      income: {
        Row: {
          amount: number
          category: string | null
          created_at: string
          currency: string | null
          id: string
          tag: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          tag?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          tag?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      invoice_history: {
        Row: {
          bill_to: Json
          created_at: string
          expenses: Json | null
          id: string
          invoice_date: string
          invoice_number: string
          monthly_salary: number
          notes: string | null
          send_to: Json
          total_amount: number
        }
        Insert: {
          bill_to: Json
          created_at?: string
          expenses?: Json | null
          id?: string
          invoice_date: string
          invoice_number: string
          monthly_salary: number
          notes?: string | null
          send_to: Json
          total_amount: number
        }
        Update: {
          bill_to?: Json
          created_at?: string
          expenses?: Json | null
          id?: string
          invoice_date?: string
          invoice_number?: string
          monthly_salary?: number
          notes?: string | null
          send_to?: Json
          total_amount?: number
        }
        Relationships: []
      }
      recurrent_expenses: {
        Row: {
          amount: number
          bank_account: string | null
          category: string
          created_at: string
          currency_symbol: string | null
          id: string
          is_deleted: boolean | null
          name: string
          user_id: string | null
        }
        Insert: {
          amount: number
          bank_account?: string | null
          category: string
          created_at?: string
          currency_symbol?: string | null
          id?: string
          is_deleted?: boolean | null
          name: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          bank_account?: string | null
          category?: string
          created_at?: string
          currency_symbol?: string | null
          id?: string
          is_deleted?: boolean | null
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      savings: {
        Row: {
          account: string
          amount: number
          bank_account: string | null
          created_at: string
          date: string
          id: string
          is_deleted: boolean | null
          user_id: string | null
        }
        Insert: {
          account: string
          amount: number
          bank_account?: string | null
          created_at?: string
          date?: string
          id?: string
          is_deleted?: boolean | null
          user_id?: string | null
        }
        Update: {
          account?: string
          amount?: number
          bank_account?: string | null
          created_at?: string
          date?: string
          id?: string
          is_deleted?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      shared_expenses: {
        Row: {
          amount: number
          created_at: string
          id: string
          name: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          name: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          name?: string
          user_id?: string | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
