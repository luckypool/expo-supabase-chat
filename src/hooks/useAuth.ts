import { useState, useEffect, useCallback } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import { supabase, isSupabaseConfigured } from '../config/supabase';

interface AuthResult {
  data: unknown;
  error: { message: string } | AuthError | null;
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Supabaseが設定されていない場合はすぐにローディングを終了
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    // 現在のセッションを取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // ディープリンクからのMagic Link処理
    const handleDeepLink = async (event: { url: string }) => {
      const url = event.url;
      if (url && supabase) {
        // URLからトークンを抽出
        // Magic LinkのURLは #access_token=...&refresh_token=... の形式
        const hashPart = url.split('#')[1];
        if (hashPart) {
          const params = new URLSearchParams(hashPart);
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');
          
          if (accessToken && refreshToken) {
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            if (data?.session) {
              setSession(data.session);
              setUser(data.session.user);
            }
            if (error) {
              console.error('Magic Link認証エラー:', error);
            }
          }
        }
      }
    };

    // 初回起動時のURL確認
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    // リスナー登録
    const linkingSubscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.unsubscribe();
      linkingSubscription.remove();
    };
  }, []);

  const signInWithMagicLink = useCallback(async (email: string): Promise<AuthResult> => {
    if (!supabase) {
      return { data: null, error: { message: 'Supabaseが設定されていません' } };
    }

    // Expo Go用のリダイレクトURL
    const redirectUrl = Linking.createURL('auth/callback');
    console.log('Magic Link redirect URL:', redirectUrl);

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
    return { data, error };
  }, []);

  const signOut = useCallback(async (): Promise<{ error: { message: string } | AuthError | null }> => {
    if (!supabase) {
      return { error: { message: 'Supabaseが設定されていません' } };
    }
    const { error } = await supabase.auth.signOut();
    return { error };
  }, []);

  return {
    session,
    user,
    loading,
    isConfigured: isSupabaseConfigured,
    signInWithMagicLink,
    signOut,
  };
}
