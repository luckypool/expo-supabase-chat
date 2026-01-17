import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { isSupabaseConfigured } from '../config/supabase';

export function AuthScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { signInWithMagicLink } = useAuth();

  const handleSubmit = async () => {
    if (!isSupabaseConfigured) {
      Alert.alert(
        'Supabase未設定',
        '.envファイルにSupabaseのURLとAPIキーを設定してください。\n\n詳細はREADME.mdをご確認ください。'
      );
      return;
    }

    if (!email.trim()) {
      Alert.alert('エラー', 'メールアドレスを入力してください');
      return;
    }

    setLoading(true);
    try {
      const { error } = await signInWithMagicLink(email);

      if (error) {
        Alert.alert('エラー', error.message);
      } else {
        setEmailSent(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setEmailSent(false);
    await handleSubmit();
  };

  if (emailSent) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>メールを確認してください</Text>
          <View style={styles.successBanner}>
            <Text style={styles.successIcon}>✉️</Text>
            <Text style={styles.successText}>
              {email} にログインリンクを送信しました
            </Text>
            <Text style={styles.successSubtext}>
              メールに記載されているリンクをタップしてログインしてください
            </Text>
          </View>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleResend}
          >
            <Text style={styles.secondaryButtonText}>メールを再送信</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => setEmailSent(false)}
          >
            <Text style={styles.switchText}>別のメールアドレスを使用</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title}>メッセンジャー</Text>
        <Text style={styles.subtitle}>
          メールアドレスでログイン
        </Text>

        {!isSupabaseConfigured && (
          <View style={styles.warningBanner}>
            <Text style={styles.warningText}>
              ⚠️ Supabaseが設定されていません
            </Text>
            <Text style={styles.warningSubtext}>
              .envファイルにSupabaseのURLとAPIキーを設定してください
            </Text>
          </View>
        )}

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="メールアドレス"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>
                ログインリンクを送信
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            パスワードは不要です。メールアドレスを入力するとログインリンクが送信されます。
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  warningBanner: {
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FFE69C',
  },
  warningText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
    textAlign: 'center',
  },
  warningSubtext: {
    fontSize: 12,
    color: '#856404',
    textAlign: 'center',
    marginTop: 4,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#000000',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  switchButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  switchText: {
    color: '#007AFF',
    fontSize: 14,
  },
  successBanner: {
    backgroundColor: '#D4EDDA',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#C3E6CB',
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  successText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#155724',
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtext: {
    fontSize: 14,
    color: '#155724',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: '600',
  },
  infoBox: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
});
