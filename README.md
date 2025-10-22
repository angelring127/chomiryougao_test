# 日本の調味料顔診断 (Japanese Seasoning Face Test)

AI を使った顔診断サービス。アップロードした写真から、どの日本の調味料タイプに似ているかを判定します。

## 🚀 特徴

- ✨ ブラウザ内で完結する画像処理（プライバシー保護）
- 🎨 9 種類の調味料タイプ（男性）/ 8 種類（女性）
- 🌍 多言語対応（日本語・韓国語・英語）
- 📱 レスポンシブデザイン
- 🔄 SNS 共有機能
- 📊 GA4 分析統合

## 🛠 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **状態管理**: Zustand
- **UI コンポーネント**: shadcn/ui
- **ML 推論**: TensorFlow.js (Teachable Machine)
- **ホスティング**: Vercel

## 📦 セットアップ

### 1. 依存関係のインストール

\`\`\`bash
npm install
\`\`\`

### 2. shadcn/ui コンポーネントのインストール

\`\`\`bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add progress
npx shadcn@latest add dialog
\`\`\`

### 3. 環境変数の設定

\`.env.example\` を \`.env.local\` にコピーして、必要な値を設定してください。

\`\`\`bash
cp .env.example .env.local
\`\`\`

### 4. 開発サーバーの起動

\`\`\`bash
npm run dev
\`\`\`

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 📁 プロジェクト構造

\`\`\`
├── data/ # 静的データ（JSON）
│ ├── seasonings.json # 調味料タイプ定義
│ └── model_versions.json # モデルバージョン情報
├── i18n/ # 多言語翻訳ファイル
│ ├── ja.json
│ ├── ko.json
│ └── en.json
├── public/
│ └── images/
│ └── face/ # 調味料タイプ別イラスト
│ ├── 남성/
│ └── 여성/
├── src/
│ ├── app/ # Next.js App Router
│ │ ├── layout.tsx
│ │ ├── page.tsx # ランディングページ
│ │ ├── result/ # 結果ページ
│ │ ├── privacy/ # プライバシーポリシー
│ │ └── terms/ # 利用規約
│ ├── components/ # 共通コンポーネント
│ │ ├── language-switcher.tsx
│ │ └── ad-slot.tsx
│ ├── features/ # 機能別コンポーネント
│ │ ├── upload/ # 画像アップロード機能
│ │ ├── inference/ # AI 推論機能
│ │ └── result/ # 結果表示機能
│ ├── hooks/ # カスタムフック
│ │ └── use-i18n.ts
│ ├── lib/ # ユーティリティ
│ │ ├── utils.ts
│ │ └── analytics.ts # GA4 統合
│ ├── store/ # 状態管理
│ │ └── app-store.ts
│ └── types/ # 型定義
│ └── seasoning.ts
└── README.md
\`\`\`

## 🎨 調味料タイプ

### 男性（9 種類）

- 醤油 (Soy Sauce)
- 味噌 (Miso)
- 塩 (Salt)
- 砂糖 (Sugar)
- 酢 (Vinegar)
- ソース (Sauce)
- マヨネーズ (Mayonnaise)
- ケチャップ (Ketchup)
- オリーブオイル (Olive Oil)

### 女性（8 種類）

マヨネーズ、酢、ケチャップを除く

## 📝 最近の更新

### v1.1.0 - AdSense コンプライアンス改善 (2025-10-22)

**AdSense ポリシー対応のためのコンテンツ強化:**

- ✅ メインページに豊富なテキストコンテンツを追加
  - サービス紹介セクション（特徴説明）
  - 使い方ガイド（4 ステップ）
  - 調味料タイプ一覧
  - メリットセクション
  - FAQ セクション（5 項目）
- ✅ 広告配置の最適化（コンテンツの後に配置）
- ✅ SEO メタデータの大幅改善
- ✅ 多言語コンテンツの拡充（日本語・韓国語・英語・中国語）
- ✅ コンテンツ対広告比率の改善

**変更の詳細:**

- **i18n**: 新しい翻訳キーを追加
  - `intro`: サービス紹介
  - `howTo`: 使い方ガイド
  - `seasoningTypes`: 調味料タイプ紹介
  - `faq`: よくある質問
  - `benefits`: サービスのメリット
- **page.tsx**: メインページレイアウトの再構成
  - 広告を中段に移動（コンテンツの後）
  - 5 つの新しいセクションを追加
- **layout.tsx**: メタデータの充実化
  - より詳細な description
  - キーワードの追加
  - category と authors の追加

**AdSense コンプライアンス:**

Google AdSense の「游戏者コンテンツがない画面に Google 掲載広告」という警告に対応し、実質的なコンテンツを大幅に増やしました。これにより：

- ページあたりのテキストコンテンツが 3 倍以上に増加
- ユーザーに価値のある情報を提供
- SEO ランキングの向上
- 広告とコンテンツの適切なバランス

## 🔮 今後の予定

- [ ] Teachable Machine モデルの統合
- [ ] 動的 OG 画像生成
- [ ] パフォーマンス最適化
- [ ] A/B テスト実装
- [x] SEO 改善
- [x] AdSense ポリシー準拠

## 📄 ライセンス

MIT License

## 👤 作成者

Hoya

---

Made with ❤️
