# Messenger App

React Native + Expo + Supabase を使用した音声通話機能なしのメッセンジャーアプリです。

## 技術スタック

- **フロントエンド**: React Native + Expo (SDK 54)
- **バックエンド**: Supabase (PostgreSQL + リアルタイム通信 + 認証 + ストレージ)
- **パッケージマネージャー**: Bun
- **言語**: TypeScript

## 機能一覧

### 基本機能
- [x] Email/Password 認証
- [ ] 1対1チャット
- [ ] リアルタイムメッセージング

### コア機能
- [ ] メッセージ履歴
- [ ] 既読管理
- [ ] オンライン状態

### 拡張機能
- [ ] グループチャット
- [ ] 画像/ファイル送信
- [ ] プッシュ通知
- [ ] 検索

## 開発環境のセットアップ

### 必要なツール

- Node.js (v18以上)
- Bun (`curl -fsSL https://bun.sh/install | bash`)
- Xcode (iOSビルド用)
- Watchman (`brew install watchman`)
- CocoaPods (`brew install cocoapods`)

### インストール

```bash
# 依存関係のインストール
bun install

# iOSの依存関係をインストール（初回のみ）
cd ios && pod install && cd ..
```

### Supabaseのセットアップ

1. [supabase.com](https://supabase.com) でアカウントを作成
2. 新しいプロジェクトを作成
3. プロジェクト設定 > API から以下を取得:
   - `Project URL`
   - `anon/public key`
4. プロジェクトルートの `.env` ファイルを編集:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### データベーススキーマの作成

Supabase SQL Editor で以下のスキーマを実行:

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

## 開発サーバーの起動

```bash
# 開発サーバーを起動
bunx expo start

# iOSシミュレータで起動
bunx expo start --ios

# Androidエミュレータで起動
bunx expo start --android
```

## テスト

```bash
bun test
```

## プロジェクト構造

```
messenger-app/
├── src/
│   ├── config/
│   │   └── supabase.ts          # Supabase初期化
│   ├── screens/
│   │   ├── AuthScreen.tsx       # 認証画面
│   │   ├── ChatListScreen.tsx   # チャット一覧
│   │   └── ChatScreen.tsx       # チャット画面
│   ├── components/
│   │   ├── MessageBubble.tsx    # メッセージ表示
│   │   └── ChatInput.tsx        # 入力欄
│   ├── hooks/
│   │   ├── useAuth.ts           # 認証フック
│   │   └── useMessages.ts       # メッセージ取得
│   ├── types/
│   │   └── database.types.ts    # Supabase型定義
│   └── utils/
│       └── helpers.ts           # ユーティリティ関数
├── .env                         # 環境変数
├── App.tsx                      # エントリーポイント
├── app.json                     # Expo設定
└── package.json
```

## 参考リソース

- [Expo Documentation](https://docs.expo.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Navigation](https://reactnavigation.org/)
- [Supabase + React Native Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
- [Bun Documentation](https://bun.sh/docs)
