# expo-supabase-chat

React Native + Expo + Supabase を使用したメッセンジャーアプリのスケルトンプロジェクトです。

## 技術スタック

- **フロントエンド**: React Native + Expo (SDK 54)
- **バックエンド**: Supabase (PostgreSQL + リアルタイム通信 + 認証 + ストレージ)
- **パッケージマネージャー**: Bun
- **言語**: TypeScript

## 機能一覧

### 基本機能
- [x] Magic Link 認証（パスワードレス）
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

## クイックスタート

```bash
# クローン
git clone https://github.com/luckypool/expo-supabase-chat.git
cd expo-supabase-chat

# インストール
bun install

# 起動
bunx expo start
```

詳細なセットアップ手順は **[開発環境セットアップガイド](docs/SETUP.md)** を参照してください。

## プロジェクト構造

```
expo-supabase-chat/
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
├── docs/
│   └── SETUP.md                 # セットアップガイド
├── .env                         # 環境変数
├── App.tsx                      # エントリーポイント
├── app.json                     # Expo設定
└── package.json
```

## テスト

```bash
bun test
```

## 参考リソース

- [Expo Documentation](https://docs.expo.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Navigation](https://reactnavigation.org/)
- [Supabase + React Native Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
- [Bun Documentation](https://bun.sh/docs)
