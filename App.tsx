import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';

import { useAuth } from './src/hooks/useAuth';
import { AuthScreen } from './src/screens/AuthScreen';
import { ChatListScreen } from './src/screens/ChatListScreen';
import { ChatScreen } from './src/screens/ChatScreen';
import { supabase } from './src/config/supabase';

type RootStackParamList = {
  ChatList: undefined;
  Chat: { conversationId: string; title: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AuthenticatedStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitle: '戻る',
        })}
      />
    </Stack.Navigator>
  );
}

const linking = {
  prefixes: [Linking.createURL('/'), 'expo-supabase-chat://'],
  config: {
    screens: {
      ChatList: 'chat-list',
      Chat: 'chat/:conversationId',
    },
  },
};

export default function App() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!supabase) return;

    // ディープリンクからのMagic Link認証を処理
    const handleDeepLink = async (event: { url: string }) => {
      const url = event.url;
      if (url) {
        const { data } = await supabase.auth.getSessionFromUrl({ url });
        if (data.session) {
          // セッションは自動的に設定される
          console.log('Magic Link認証成功');
        }
      }
    };

    // URLイベントリスナーを設定
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // アプリ起動時のURLを確認
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer linking={linking}>
        {user ? <AuthenticatedStack /> : <AuthScreen />}
        <StatusBar style="auto" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});
