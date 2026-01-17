// Supabaseのデータベース型定義
// supabase gen types typescript コマンドで自動生成可能

export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  is_online: boolean;
  last_seen: string | null;
}

export interface Conversation {
  id: string;
  name: string | null;
  is_group: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConversationMember {
  id: string;
  conversation_id: string;
  user_id: string;
  joined_at: string;
  role: 'admin' | 'member';
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'image' | 'file';
  file_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReadReceipt {
  id: string;
  message_id: string;
  user_id: string;
  read_at: string;
}

// Database型定義（Supabaseクライアント用）
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      conversations: {
        Row: Conversation;
        Insert: Omit<Conversation, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Conversation, 'id' | 'created_at'>>;
      };
      conversation_members: {
        Row: ConversationMember;
        Insert: Omit<ConversationMember, 'id' | 'joined_at'>;
        Update: Partial<Omit<ConversationMember, 'id' | 'joined_at'>>;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Message, 'id' | 'created_at'>>;
      };
      read_receipts: {
        Row: ReadReceipt;
        Insert: Omit<ReadReceipt, 'id' | 'read_at'>;
        Update: never;
      };
    };
  };
}
