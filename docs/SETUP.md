# 開発環境セットアップガイド

このドキュメントでは、expo-supabase-chat を手元で起動するまでの手順を説明します。

## 1. 必要なツール

以下のツールをインストールしてください：

| ツール | バージョン | インストール方法 |
|-------|----------|----------------|
| Node.js | v18以上 | [nodejs.org](https://nodejs.org/) |
| Bun | 最新 | `curl -fsSL https://bun.sh/install \| bash` |
| Xcode | 最新 | App Store (iOS開発用) |
| Watchman | 最新 | `brew install watchman` |
| CocoaPods | 最新 | `brew install cocoapods` |

## 2. プロジェクトのセットアップ

### リポジトリのクローン

```bash
git clone https://github.com/luckypool/expo-supabase-chat.git
cd expo-supabase-chat
```

### 依存関係のインストール

```bash
bun install
```

> **Note**: Expo Go を使う場合は `bun install` のみでOKです。Development Build を使う場合は `cd ios && pod install && cd ..` も実行してください。

## 3. Supabaseのセットアップ

### 3.1 プロジェクトの作成

1. [supabase.com](https://supabase.com) でアカウントを作成
2. 「New Project」から新しいプロジェクトを作成
3. プロジェクトの作成が完了するまで待機（数分かかる場合があります）

### 3.2 APIキーの取得

1. Supabase ダッシュボードで「Project Settings」を開く
2. 「API」セクションに移動
3. 以下の値をコピー:
   - `Project URL`
   - `anon/public key`

### 3.3 環境変数の設定

プロジェクトルートに `.env` ファイルを作成（または `.env.example` をコピー）:

```bash
cp .env.example .env
```

`.env` ファイルを編集:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3.4 Magic Link認証の設定

1. Supabase ダッシュボードで「Authentication」を開く
2. 「URL Configuration」に移動
3. 「Redirect URLs」に以下を追加:
   - `exp://` (Expo Go 開発用)
   - `expo-supabase-chat://` (プロダクションビルド用)

### 3.5 データベーススキーマの作成

Supabase ダッシュボードの「SQL Editor」で以下を実行:

```sql
-- ユーザープロフィール
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  is_online BOOLEAN DEFAULT false,
  last_seen TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 会話
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  is_group BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 会話メンバー
CREATE TABLE conversation_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

-- メッセージ
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 既読管理
CREATE TABLE read_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(message_id, user_id)
);

-- リアルタイム購読を有効化
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
```

## 4. 開発サーバーの起動

```bash
# 開発サーバーを起動
bunx expo start

# iOSシミュレータで起動
bunx expo start --ios

# Androidエミュレータで起動
bunx expo start --android
```

## 5. 動作確認

1. アプリが起動したら、メールアドレスを入力
2. 「ログインリンクを送信」をタップ
3. メールを確認し、Magic Linkをタップ
4. アプリに戻り、ログイン完了

## トラブルシューティング

### Supabaseに接続できない

- `.env` ファイルの値が正しいか確認
- Supabase プロジェクトがアクティブか確認

### Magic Linkが届かない

- メールアドレスが正しいか確認
- Supabase の Authentication > Email Templates を確認
- スパムフォルダを確認

### iOSビルドエラー

```bash
cd ios && pod install --repo-update && cd ..
```

### 依存関係のエラー

```bash
rm -rf node_modules
bun install
```
