import { createClient, SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

// Supabaseの設定が有効かどうかを確認
export const isSupabaseConfigured =
  supabaseUrl.startsWith('http') && supabasePublishableKey.length > 0;

// Supabaseクライアント（設定が有効な場合のみ初期化）
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

// 開発用のプレースホルダー警告
if (!isSupabaseConfigured) {
  console.warn(
    '⚠️ Supabaseが設定されていません。.envファイルに有効なURLとキーを設定してください。'
  );
}
