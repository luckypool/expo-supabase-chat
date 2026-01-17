import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MessageBubble } from '../components/MessageBubble';
import { ChatInput } from '../components/ChatInput';
import { useMessages } from '../hooks/useMessages';
import { useAuth } from '../hooks/useAuth';

type RootStackParamList = {
  ChatList: undefined;
  Chat: { conversationId: string; title: string };
};

type ChatScreenProps = NativeStackScreenProps<RootStackParamList, 'Chat'>;

export function ChatScreen({ route }: ChatScreenProps) {
  const { conversationId } = route.params;
  const { messages, loading, error, sendMessage } = useMessages(conversationId);
  const { user } = useAuth();

  const handleSend = async (content: string) => {
    if (!user) return;
    await sendMessage(content, user.id);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <MessageBubble
            message={item}
            isOwnMessage={item.sender_id === user?.id}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        inverted={false}
        showsVerticalScrollIndicator={false}
      />
      <ChatInput onSend={handleSend} disabled={!user} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
  },
  messageList: {
    paddingVertical: 8,
  },
});
