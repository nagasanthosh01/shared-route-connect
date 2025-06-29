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
      bookings: {
        Row: {
          created_at: string | null
          id: string
          passenger_id: string
          ride_id: string
          seats_booked: number
          status: string
          total_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          passenger_id: string
          ride_id: string
          seats_booked: number
          status?: string
          total_price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          passenger_id?: string
          ride_id?: string
          seats_booked?: number
          status?: string
          total_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "bookings_ride_id_fkey"
            columns: ["ride_id"]
            isOneToOne: false
            referencedRelation: "rides"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          ride_id: string
          sender_id: string
          sender_role: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          ride_id: string
          sender_id: string
          sender_role: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          ride_id?: string
          sender_id?: string
          sender_role?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_ride_id_fkey"
            columns: ["ride_id"]
            isOneToOne: false
            referencedRelation: "rides"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          first_name: string
          id: string
          last_name: string
          phone: string | null
          profile_image: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          first_name: string
          id: string
          last_name: string
          phone?: string | null
          profile_image?: string | null
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          profile_image?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      rides: {
        Row: {
          available_seats: number
          created_at: string | null
          departure_date: string
          departure_time: string
          description: string | null
          driver_id: string
          from_address: string
          from_city: string
          from_country: string | null
          from_latitude: number | null
          from_longitude: number | null
          id: string
          is_location_sharing_enabled: boolean | null
          live_location_accuracy: number | null
          live_location_latitude: number | null
          live_location_longitude: number | null
          live_location_timestamp: string | null
          price_per_seat: number
          status: string
          to_address: string
          to_city: string
          to_country: string | null
          to_latitude: number | null
          to_longitude: number | null
          total_price: number
          updated_at: string | null
        }
        Insert: {
          available_seats: number
          created_at?: string | null
          departure_date: string
          departure_time: string
          description?: string | null
          driver_id: string
          from_address: string
          from_city: string
          from_country?: string | null
          from_latitude?: number | null
          from_longitude?: number | null
          id?: string
          is_location_sharing_enabled?: boolean | null
          live_location_accuracy?: number | null
          live_location_latitude?: number | null
          live_location_longitude?: number | null
          live_location_timestamp?: string | null
          price_per_seat: number
          status?: string
          to_address: string
          to_city: string
          to_country?: string | null
          to_latitude?: number | null
          to_longitude?: number | null
          total_price: number
          updated_at?: string | null
        }
        Update: {
          available_seats?: number
          created_at?: string | null
          departure_date?: string
          departure_time?: string
          description?: string | null
          driver_id?: string
          from_address?: string
          from_city?: string
          from_country?: string | null
          from_latitude?: number | null
          from_longitude?: number | null
          id?: string
          is_location_sharing_enabled?: boolean | null
          live_location_accuracy?: number | null
          live_location_latitude?: number | null
          live_location_longitude?: number | null
          live_location_timestamp?: string | null
          price_per_seat?: number
          status?: string
          to_address?: string
          to_city?: string
          to_country?: string | null
          to_latitude?: number | null
          to_longitude?: number | null
          total_price?: number
          updated_at?: string | null
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
