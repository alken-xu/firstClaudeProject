# 要件定義書 - デモ用旅館予約サイト

**作成日**: 2026-04-03  
**バージョン**: 1.1（技術スタック確定）  
**参考サイト**: https://hatagoya-maruichi.com/（旅籠屋丸一）

---

## 1. プロジェクト概要

### 1.1 目的
デモ用の日本旅館予約サイトを構築する。実際の宿泊予約フローを体験できるフルスタックデモとして機能する。

### 1.2 想定旅館設定
- **旅館名**: 山の湯 花結（やまのゆ はなゆい）※デモ用架空旅館
- **コンセプト**: 和の情緒を大切にした温泉旅館
- **所在地**: 架空の温泉地（例：信州・山ノ湯温泉）
- **規模**: 客室10室程度（デモ用）

---

## 2. ページ構成

| ページ名 | URL | 説明 |
|---|---|---|
| トップページ | `/` | メインビジュアル、旅館紹介、おすすめプラン |
| 客室一覧 | `/rooms` | 全客室の一覧表示 |
| 客室詳細 | `/rooms/:id` | 各客室の詳細・写真・設備 |
| プラン一覧 | `/plans` | 宿泊プラン一覧 |
| 予約フォーム | `/reserve` | チェックイン日・人数・客室選択・個人情報入力 |
| 予約確認 | `/reserve/confirm` | 入力内容の確認画面 |
| 予約完了 | `/reserve/complete` | 予約完了メッセージ |
| 温泉・施設案内 | `/facilities` | 温泉・食事・館内施設の紹介 |
| アクセス | `/access` | 地図・交通案内 |
| お知らせ | `/news` | 最新情報・イベント情報 |
| お問い合わせ | `/contact` | 問い合わせフォーム |

---

## 3. 主要機能

### 3.1 ユーザー向け機能

#### 検索・閲覧
- [ ] チェックイン日・チェックアウト日・人数による空室検索
- [ ] 客室一覧の表示（写真・料金・設備のサマリ）
- [ ] 客室詳細ページ（複数写真・設備リスト・料金表）
- [ ] プラン一覧・プラン詳細の表示

#### 予約フロー
- [ ] 空室カレンダー表示（日付別の空室状況）
- [ ] 予約フォーム入力（宿泊日・人数・客室・プラン・氏名・連絡先）
- [ ] 入力内容の確認画面
- [ ] 予約完了画面（予約番号の発行）
- [ ] 予約確認メール送信（デモのため画面表示のみ）

#### その他
- [ ] お問い合わせフォーム
- [ ] レスポンシブ対応（スマートフォン・タブレット・PC）

### 3.2 管理者向け機能（デモスコープ外・将来拡張）
- 予約一覧の確認
- 客室・プランの登録・編集
- カレンダー管理

---

## 4. データモデル

### 4.1 客室 (rooms テーブル)
```
- id          INTEGER PRIMARY KEY AUTOINCREMENT
- name        TEXT NOT NULL        -- 例：「松の間」「竹の間」
- type        TEXT NOT NULL        -- 和室 / 洋室 / 和洋室
- capacity    INTEGER NOT NULL     -- 最大宿泊人数
- size        REAL                 -- 部屋の広さ（㎡）
- base_price  INTEGER NOT NULL     -- 1泊基本料金（1名あたり・円）
- description TEXT
- amenities   TEXT                 -- JSON配列で保存
- images      TEXT                 -- JSON配列で保存（画像URLリスト）
- is_available INTEGER DEFAULT 1  -- 公開フラグ（0/1）
```

### 4.2 プラン (plans テーブル)
```
- id               INTEGER PRIMARY KEY AUTOINCREMENT
- name             TEXT NOT NULL    -- 例：「スタンダード夕食付きプラン」
- description      TEXT
- meal_type        TEXT             -- 朝食のみ / 夕食付き / 2食付き / 素泊まり
- price_modifier   INTEGER DEFAULT 0 -- 基本料金への加算額（円）
- min_nights       INTEGER DEFAULT 1
- available_from   TEXT             -- 販売開始日（YYYY-MM-DD）
- available_to     TEXT             -- 販売終了日（YYYY-MM-DD）
- images           TEXT             -- JSON配列で保存
```

### 4.3 予約 (reservations テーブル)
```
- id            INTEGER PRIMARY KEY AUTOINCREMENT
- reservation_no TEXT UNIQUE NOT NULL  -- 予約番号（例：YK-20260403-0001）
- room_id       INTEGER REFERENCES rooms(id)
- plan_id       INTEGER REFERENCES plans(id)
- check_in      TEXT NOT NULL          -- YYYY-MM-DD
- check_out     TEXT NOT NULL          -- YYYY-MM-DD
- nights        INTEGER NOT NULL
- guest_count   INTEGER NOT NULL
- total_price   INTEGER NOT NULL
- guest_name    TEXT NOT NULL
- guest_email   TEXT NOT NULL
- guest_phone   TEXT NOT NULL
- requests      TEXT                   -- 特別リクエスト
- created_at    TEXT DEFAULT (datetime('now'))
- status        TEXT DEFAULT 'confirmed'  -- confirmed / cancelled
```

### 4.4 お知らせ (news テーブル)
```
- id           INTEGER PRIMARY KEY AUTOINCREMENT
- title        TEXT NOT NULL
- content      TEXT NOT NULL
- published_at TEXT NOT NULL   -- YYYY-MM-DD
- category     TEXT            -- お知らせ / イベント / 季節情報
```

---

## 5. UI/UXの方針

### 5.1 デザインコンセプト
- **テーマ**: モダン和風（和の素材感 × 洗練されたレイアウト）
- **カラーパレット**:
  - メイン: 深緑 `#2C4A3E` / 和赤 `#A0522D`
  - アクセント: 金色 `#C9A84C`
  - 背景: オフホワイト `#FAF8F5`
  - テキスト: 濃茶 `#2D2012`
- **フォント**:
  - 日本語: Noto Serif JP（見出し）/ Noto Sans JP（本文）
  - 英数字: Cormorant Garamond

### 5.2 UIコンポーネント方針
- トップページ: フルスクリーンのヒーロー画像スライダー
- 客室カード: 画像・名前・料金・設備アイコンを表示
- 予約フォーム: ステップ式UI（Step 1: 日程選択 → Step 2: 客室選択 → Step 3: 個人情報）
- カレンダー: 日付ピッカーで空室状況を視覚的に表示

### 5.3 レスポンシブ対応
- ブレークポイント: SP（〜768px）/ Tablet（769px〜1024px）/ PC（1025px〜）
- SPではハンバーガーメニューを採用

---

## 6. 技術スタック（確定）

### 6.1 全体アーキテクチャ

```
┌─────────────────────┐     HTTP/REST API     ┌──────────────────────┐
│  フロントエンド      │ ◄──────────────────► │  バックエンド         │
│  React + Vite       │                       │  Express + Node.js   │
│  (port: 5173)       │                       │  (port: 3001)        │
└─────────────────────┘                       └──────────┬───────────┘
                                                         │
                                                         ▼
                                                ┌──────────────────┐
                                                │  SQLite          │
                                                │  (ローカルファイル) │
                                                └──────────────────┘
```

### 6.2 採用技術一覧

| レイヤー | 技術 | バージョン | 理由 |
|---|---|---|---|
| フロントエンド | React | 18.x | コンポーネント指向UI |
| ビルドツール | Vite | 5.x | 高速なHMR・シンプルな設定 |
| スタイリング | Tailwind CSS | 3.x | ユーティリティ・高速UI構築 |
| ルーティング | React Router | v6 | SPA画面遷移 |
| フォーム | React Hook Form | 7.x | バリデーション付きフォーム |
| 日付操作 | date-fns | 3.x | 日付計算・フォーマット |
| バックエンド | Express | 4.x | Node.js Webフレームワーク |
| DB | SQLite | - | ローカルファイルDB・設定不要 |
| DBドライバー | better-sqlite3 | - | 同期API・高速・シンプル |

### 6.3 フォルダ構成（予定）

```
firstClaudeProject/
├── requirements.md
├── frontend/               # React + Vite
│   ├── src/
│   │   ├── components/     # 共通コンポーネント
│   │   ├── pages/          # 各ページコンポーネント
│   │   ├── hooks/          # カスタムフック
│   │   └── utils/          # ユーティリティ関数
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── backend/                # Express + SQLite
    ├── src/
    │   ├── routes/         # APIルート定義
    │   ├── db/             # DB初期化・クエリ
    │   └── index.js        # エントリポイント
    ├── database.sqlite     # SQLiteファイル
    └── package.json
```

---

## 7. API設計（主要エンドポイント）

| メソッド | エンドポイント | 説明 |
|---|---|---|
| GET | `/api/rooms` | 客室一覧取得 |
| GET | `/api/rooms/:id` | 客室詳細取得 |
| GET | `/api/rooms/availability` | 空室検索 |
| GET | `/api/plans` | プラン一覧取得 |
| GET | `/api/plans/:id` | プラン詳細取得 |
| POST | `/api/reservations` | 予約作成 |
| GET | `/api/reservations/:no` | 予約確認 |
| GET | `/api/news` | お知らせ一覧取得 |
| POST | `/api/contact` | お問い合わせ送信 |

---

## 8. デモ用に省略する機能

| 機能 | 理由 |
|---|---|
| 実決済処理（Stripe等） | デモのため不要 |
| ユーザー認証・会員登録 | スコープ外 |
| メール送信（実送信） | 画面表示のみで代替 |
| 管理画面 | 将来拡張として扱う |
| 多言語対応 | 日本語のみ |

---

## 9. ページ別コンテンツ詳細

### 9.1 トップページ
- ヒーロースライダー（旅館の雰囲気写真 3〜5枚）
- キャッチコピー・旅館コンセプト文
- 「ご予約」への導線ボタン
- おすすめ客室（2〜3室のカード表示）
- 季節のプランピックアップ
- 温泉・食事・施設のハイライトセクション
- お知らせ（最新3件）
- アクセス概要
- フッター（ナビ・連絡先・SNSリンク）

### 9.2 予約フォーム（3ステップ）
- **Step 1**: チェックイン日・チェックアウト日・人数入力 → 空室検索
- **Step 2**: 空室客室一覧からの選択・プラン選択・料金確認
- **Step 3**: 氏名・電話番号・メールアドレス・特別リクエスト入力
- **確認画面**: 全入力内容の表示・修正リンク
- **完了画面**: 予約番号・予約内容サマリ

---

## 10. 開発優先順位

| 優先度 | タスク |
|---|---|
| 高 | プロジェクト初期構築（frontend/backend分離構成） |
| 高 | DB初期化・シードデータ投入 |
| 高 | 共通レイアウト（ヘッダー・フッター） |
| 高 | トップページ実装 |
| 高 | 客室一覧・客室詳細ページ |
| 高 | 予約フォーム（3ステップ） |
| 中 | プラン一覧ページ |
| 中 | 施設案内・アクセスページ |
| 低 | お知らせ一覧 |
| 低 | お問い合わせフォーム |
