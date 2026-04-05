# 要件定義書 - デモ用旅館予約サイト

**作成日**: 2026-04-03  
**バージョン**: 1.3  
**参考サイト**: https://hatagoya-maruichi.com/（旅籠屋丸一）

---

## 1. プロジェクト概要

### 1.1 目的
デモ用の日本旅館予約サイトを構築する。実際の宿泊予約フローを体験できるフルスタックデモとして機能する。

### 1.2 想定旅館設定
- **旅館名**: 山の湯 花結（やまのゆ はなゆい）※デモ用架空旅館
- **コンセプト**: 和の情緒を大切にした温泉旅館
- **所在地**: 信州・山ノ湯温泉（架空）
- **規模**: 客室6室

---

## 2. ページ構成

| ページ名 | URL |
|---|---|
| トップページ | `/` |
| 客室一覧 | `/rooms` |
| 客室詳細 | `/rooms/:id` |
| プラン一覧 | `/plans` |
| 予約フォーム（4ステップ統合） | `/reserve` |
| 予約完了 | `/reserve/complete` |
| 温泉・施設案内 | `/facilities` |
| アクセス | `/access` |
| お知らせ | `/news` |
| お問い合わせ | `/contact` |

---

## 3. 主要機能

### 3.1 ユーザー向け機能

#### 検索・閲覧
- チェックイン日・チェックアウト日・人数による空室検索
- 客室一覧（Unsplash画像・料金・設備のサマリ）
- 客室詳細（複数写真・設備リスト・料金表）
- プラン一覧・プラン詳細

#### 予約フロー
- 予約フォーム（4ステップ：日程 / 客室・プラン / お客様情報 / 確認）
- 二重予約チェック（同一客室・期間の重複検出）
- 日本の電話番号バリデーション
- 予約完了画面（予約番号の発行・予約内容サマリ）
- 予約作成時のメール通知（nodemailer / Gmail SMTP）

#### その他
- お問い合わせフォーム（メール通知付き）
- アクセスページ（OpenStreetMap埋め込み）
- レスポンシブ対応（SP / Tablet / PC）

### 3.2 管理者向け機能（スコープ外・将来拡張）
- 予約一覧の確認
- 客室・プランの登録・編集

---

## 4. データモデル

### 4.1 客室 (rooms テーブル)
```sql
id           INTEGER PRIMARY KEY AUTOINCREMENT
name         TEXT NOT NULL        -- 例：「松の間」「竹の間」
type         TEXT NOT NULL        -- 和室 / 洋室 / 和洋室
capacity     INTEGER NOT NULL     -- 最大宿泊人数
size         REAL                 -- 部屋の広さ（㎡）
base_price   INTEGER NOT NULL     -- 1泊基本料金（1名あたり・円）
description  TEXT
amenities    TEXT                 -- JSON配列で保存
images       TEXT                 -- JSON配列で保存（画像URLリスト）
is_available INTEGER DEFAULT 1   -- 公開フラグ（0/1）
```

**シードデータ（6室）**

| 名前 | タイプ | 定員 | 基本料金/名 |
|---|---|---|---|
| 松の間 | 和室 | 4名 | ¥15,000 |
| 竹の間 | 和室 | 2名 | ¥12,000 |
| 梅の間 | 和室 | 6名 | ¥14,000 |
| 桜の間 | 和洋室 | 3名 | ¥18,000 |
| 紅葉の間 | 和室 | 4名 | ¥16,000 |
| 雪の間 | 洋室 | 2名 | ¥13,000 |

### 4.2 プラン (plans テーブル)
```sql
id             INTEGER PRIMARY KEY AUTOINCREMENT
name           TEXT NOT NULL
description    TEXT
meal_type      TEXT             -- 朝食のみ / 2食付き / 素泊まり
price_modifier INTEGER DEFAULT 0 -- 基本料金への加算額（円/名/泊）
min_nights     INTEGER DEFAULT 1
available_from TEXT             -- YYYY-MM-DD
available_to   TEXT             -- YYYY-MM-DD
images         TEXT             -- JSON配列で保存
```

**シードデータ（5プラン）**

| プラン名 | 食事 | 加算額/名 | 最低泊数 |
|---|---|---|---|
| スタンダード 2食付きプラン | 2食付き | ¥5,000 | 1泊 |
| 朝食付きプラン | 朝食のみ | ¥2,000 | 1泊 |
| 素泊まりプラン | 素泊まり | ¥0 | 1泊 |
| 【特別】露天風呂付き客室 × 豪華会席プラン | 2食付き | ¥10,000 | 1泊 |
| 【連泊割】2泊以上でお得プラン | 2食付き | ¥3,000 | 2泊 |

### 4.3 予約 (reservations テーブル)
```sql
id             INTEGER PRIMARY KEY AUTOINCREMENT
reservation_no TEXT UNIQUE NOT NULL  -- YK-YYYYMMDD-{4桁乱数}（例: YK-20260403-5823）
room_id        INTEGER REFERENCES rooms(id)
plan_id        INTEGER REFERENCES plans(id)
check_in       TEXT NOT NULL          -- YYYY-MM-DD
check_out      TEXT NOT NULL          -- YYYY-MM-DD
nights         INTEGER NOT NULL
guest_count    INTEGER NOT NULL
total_price    INTEGER NOT NULL
guest_name     TEXT NOT NULL
guest_email    TEXT NOT NULL
guest_phone    TEXT NOT NULL
requests       TEXT                   -- 特別リクエスト（任意）
created_at     TEXT DEFAULT (datetime('now'))
status         TEXT DEFAULT 'confirmed'  -- confirmed / cancelled
```

### 4.4 お知らせ (news テーブル)
```sql
id           INTEGER PRIMARY KEY AUTOINCREMENT
title        TEXT NOT NULL
content      TEXT NOT NULL
published_at TEXT NOT NULL   -- YYYY-MM-DD
category     TEXT            -- お知らせ / イベント / 季節情報
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

### 5.2 UIコンポーネント
- トップページ: フルスクリーンのヒーロー画像スライダー（Unsplash実画像・5秒自動切替）
- 客室カード: Unsplash実画像・名前・料金・設備アイコンを表示
- 予約フォーム: 4ステップ式UI（単一URL `/reserve` で管理）
- アクセスページ: OpenStreetMap（iframeで埋め込み）

### 5.3 レスポンシブ対応
- ブレークポイント: SP（〜768px）/ Tablet（769px〜1024px）/ PC（1025px〜）
- SPではハンバーガーメニューを採用

---

## 6. 技術スタック

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
                                                │  (database.sqlite) │
                                                └──────────────────┘
```

### 6.2 採用技術一覧

| レイヤー | 技術 | 備考 |
|---|---|---|
| フロントエンド | React 18 + Vite 5 | |
| スタイリング | Tailwind CSS 3 | |
| ルーティング | React Router v6 | |
| フォーム | React Hook Form | 独自バリデーション |
| 日付操作 | date-fns | |
| バックエンド | Express 4 + Node.js 22 | |
| DB | SQLite（better-sqlite3） | WALモード・外部キー有効 |
| メール送信 | nodemailer（Gmail SMTP） | 環境変数で設定 |
| 地図 | OpenStreetMap（iframeで埋め込み） | APIキー不要 |
| 画像 | Unsplash（テーマ別実画像） | |

### 6.3 フォルダ構成

```
firstClaudeProject/
├── CLAUDE.md
├── requirements.md
├── session-requirements.md
├── session-dev.md
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Header.jsx
│       │   ├── Footer.jsx
│       │   └── Layout.jsx
│       ├── pages/
│       │   ├── TopPage.jsx
│       │   ├── RoomsPage.jsx
│       │   ├── RoomDetailPage.jsx
│       │   ├── PlansPage.jsx
│       │   ├── ReservePage.jsx
│       │   ├── ReserveCompletePage.jsx
│       │   ├── FacilitiesPage.jsx
│       │   ├── AccessPage.jsx
│       │   ├── NewsPage.jsx
│       │   └── ContactPage.jsx
│       └── utils/
│           └── api.js
└── backend/
    └── src/
        ├── db/
        │   └── init.js
        ├── routes/
        │   ├── rooms.js
        │   ├── plans.js
        │   ├── reservations.js
        │   ├── news.js
        │   └── contact.js
        ├── email.js
        └── index.js
```

### 6.4 環境変数（backend/.env）
```
SMTP_USER=   # Gmail アドレス
SMTP_PASS=   # Googleアプリパスワード
NOTIFY_TO=   # 通知先メールアドレス
```

---

## 7. API設計

| メソッド | エンドポイント | 説明 |
|---|---|---|
| GET | `/api/health` | ヘルスチェック |
| GET | `/api/rooms` | 客室一覧取得（is_available=1のみ）|
| GET | `/api/rooms/availability` | 空室検索（check_in / check_out / guest_count）|
| GET | `/api/rooms/:id` | 客室詳細取得 |
| GET | `/api/plans` | プラン一覧取得 |
| POST | `/api/reservations` | 予約作成（二重予約チェックあり）|
| GET | `/api/reservations/:no` | 予約番号で予約確認 |
| GET | `/api/news` | お知らせ一覧取得 |
| POST | `/api/contact` | お問い合わせ送信（メール通知）|

---

## 8. 予約フロー詳細

| ステップ | 内容 |
|---|---|
| Step 1: 日程・人数 | チェックイン日・チェックアウト日・人数入力 → 空室API呼び出し |
| Step 2: 客室・プラン | 空室客室一覧から選択・プラン選択・料金リアルタイム計算 |
| Step 3: お客様情報 | 氏名・メール・電話番号・特別リクエスト |
| Step 4: 予約確認 | 全入力内容の確認 → 「予約を確定する」ボタン → API送信 |
| 完了画面 | 予約番号・予約内容サマリ（`/reserve/complete`）|

**電話番号バリデーション対応形式**:
- 携帯: `070/080/090-XXXX-XXXX`
- IP電話: `050-XXXX-XXXX`
- フリーダイヤル: `0120-XXX-XXX` / `0800-XXX-XXXX`
- 固定電話: `0X-XXXX-XXXX` / `0XX-XXX-XXXX` 等

---

## 9. スコープ外（将来拡張）

| 機能 |
|---|
| 実決済処理（Stripe等） |
| ユーザー認証・会員登録 |
| 予約等の管理画面 |
| 多言語対応 |
