# 山の湯 花結 — デモ用旅館予約サイト

> **ClaudeCode** で要件定義・実装・テストを「会話だけ」で完結させたフルスタックデモプロジェクト

[![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-better--sqlite3-003B57?logo=sqlite&logoColor=white)](https://github.com/WiseLibs/better-sqlite3)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

---

## 概要

**「山の湯 花結（やまのゆ はなゆい）」** は、ClaudeCode のデモ用に構築した架空旅館の予約サイトです。  
実際の宿泊予約フロー（検索 → 客室選択 → 情報入力 → 確認 → 完了）を体験できるフルスタック Web アプリケーションです。

| 項目 | 内容 |
|---|---|
| 旅館名 | 山の湯 花結（やまのゆ はなゆい） |
| コンセプト | 和の情緒を大切にした温泉旅館（信州・山ノ湯温泉） |
| 目的 | ClaudeCode の機能紹介デモ |
| 構築方法 | ClaudeCode との会話のみ（約4〜5時間） |

---

## 主な機能

- **ヒーロー画像スライダー** — Unsplash 実画像の5秒自動切替
- **空室検索** — チェックイン日・アウト日・人数による検索
- **客室一覧・詳細** — 6室の画像・料金・設備表示
- **プラン一覧** — 食事プラン別に5プランを表示
- **予約フロー（4ステップ）** — 日程 → 客室・プラン → お客様情報 → 確認 → 完了
- **二重予約チェック** — 同一客室・期間の重複検出
- **電話番号バリデーション** — 携帯・固定・IP電話・フリーダイヤル対応
- **メール通知** — 予約完了・お問い合わせ時に Gmail SMTP でオーナーへ通知
- **地図埋め込み** — OpenStreetMap（APIキー不要）
- **自動テスト** — Playwright 16テストケース + Excel エビデンスレポート

---

## 技術スタック

| レイヤー | 技術 |
|---|---|
| フロントエンド | React 19 + Vite 8 + Tailwind CSS 3 |
| ルーティング | React Router v7 |
| フォーム | React Hook Form |
| 日付操作 | date-fns |
| バックエンド | Express 4 + Node.js 22 |
| DB | SQLite（better-sqlite3 v12） |
| メール送信 | nodemailer（Gmail SMTP） |
| 地図 | OpenStreetMap（iframe埋め込み） |
| テスト | Playwright + exceljs |

---

## セットアップ

### 前提条件

- Node.js 22 以上
- npm 9 以上

### 1. リポジトリをクローン

```bash
git clone https://github.com/alken-xu/firstClaudeProject.git
cd firstClaudeProject
```

### 2. バックエンドのセットアップ

```bash
cd backend
npm install
```

`.env` ファイルを作成し、メール設定を記入します：

```env
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-app-password        # Googleアプリパスワード（通常のGmailパスワードではない）
NOTIFY_TO=owner-notify@example.com # 予約・問い合わせ通知の送信先
```

> メール通知が不要な場合は `.env` を空のまま起動しても動作します（メール送信エラーはログに出力されますがアプリは動きます）。

#### Googleアプリパスワードの取得手順

Gmail の通常パスワードは SMTP 認証に使えません。**アプリパスワード**（16桁）を別途発行する必要があります。

**前提条件：Googleアカウントの2段階認証が有効であること**  
（アプリパスワードは2段階認証が ON のアカウントにのみ発行できます）

**手順：**

1. 以下のURLにアクセスします（Googleアカウントへのログインが必要）  
   👉 https://myaccount.google.com/apppasswords

2. 「アプリ名」の入力欄に任意の名前（例：`旅館予約サイト`）を入力して **「作成」** をクリック

3. 表示された **16桁のパスワード**（スペース区切り4×4）をコピーします  
   ⚠️ このダイアログを閉じると二度と表示されません。必ずコピーしてください。

4. `backend/.env` の `SMTP_PASS` にスペースなしで貼り付けます：
   ```env
   SMTP_USER=your-gmail@gmail.com
   SMTP_PASS=abcdabcdabcdabcd       # 16桁をそのまま貼り付け（スペース不要）
   NOTIFY_TO=owner-notify@example.com
   ```

**2段階認証が未設定の場合：**

1. https://myaccount.google.com/security にアクセス
2. 「2段階認証プロセス」をクリックして有効化
3. 有効化完了後、上記のアプリパスワード発行手順へ進む

> **注意**：送信元（`SMTP_USER`）は実際に存在する Gmail アドレスを指定してください。  
> お問い合わせフォームでユーザーが入力した「返信先」メールアドレスは `Reply-To` ヘッダーに設定されるため、受信したメールに返信するだけでユーザーへ送信できます。

### 3. フロントエンドのセットアップ

```bash
cd ../frontend
npm install
```

### 4. サーバー起動

**バックエンド**（ターミナル①）：
```bash
cd backend
npm run dev        # nodemon で起動 → http://localhost:3001
```

**フロントエンド**（ターミナル②）：
```bash
cd frontend
npm run dev        # Vite で起動 → http://localhost:5173
```

ブラウザで `http://localhost:5173` を開くと旅館サイトが表示されます。

---

## プロジェクト構成

```
firstClaudeProject/
├── frontend/                    # React + Vite
│   └── src/
│       ├── components/
│       │   ├── Header.jsx
│       │   ├── Footer.jsx
│       │   └── Layout.jsx
│       ├── pages/
│       │   ├── TopPage.jsx          # トップ（ヒーロースライダー）
│       │   ├── RoomsPage.jsx        # 客室一覧
│       │   ├── RoomDetailPage.jsx   # 客室詳細
│       │   ├── PlansPage.jsx        # プラン一覧
│       │   ├── ReservePage.jsx      # 予約フォーム（4ステップ）
│       │   ├── ReserveCompletePage.jsx
│       │   ├── FacilitiesPage.jsx   # 温泉・施設案内
│       │   ├── AccessPage.jsx       # アクセス（地図）
│       │   ├── NewsPage.jsx         # お知らせ
│       │   └── ContactPage.jsx      # お問い合わせ
│       └── utils/api.js
├── backend/                     # Express + SQLite
│   ├── src/
│   │   ├── db/init.js               # DBテーブル定義・シードデータ
│   │   ├── routes/
│   │   │   ├── rooms.js
│   │   │   ├── plans.js
│   │   │   ├── reservations.js
│   │   │   ├── news.js
│   │   │   └── contact.js
│   │   ├── email.js                 # nodemailer設定
│   │   └── index.js
│   └── .env                         # 環境変数（要作成）
├── tests/
│   ├── run-tests.js                 # Playwright テストランナー（16件）
│   ├── test-results.xlsx            # テスト結果レポート
│   └── screenshots/                 # エビデンス画像
├── requirements.md                  # 要件定義書
├── CLAUDE.md                        # ClaudeCode セッション設定
├── presentation-for-shinesoft.md    # 社内勉強会スライド原稿
└── ClaudeCode_ShinesoftIntro.pptx   # 社内勉強会 PPT
```

---

## API エンドポイント

| メソッド | エンドポイント | 説明 |
|---|---|---|
| GET | `/api/health` | ヘルスチェック |
| GET | `/api/rooms` | 客室一覧（公開中のみ） |
| GET | `/api/rooms/availability` | 空室検索 |
| GET | `/api/rooms/:id` | 客室詳細 |
| GET | `/api/plans` | プラン一覧 |
| POST | `/api/reservations` | 予約作成（二重予約チェックあり） |
| GET | `/api/reservations/:no` | 予約番号で予約確認 |
| GET | `/api/news` | お知らせ一覧 |
| POST | `/api/contact` | お問い合わせ送信 |

---

## 自動テストの実行

```bash
# フロントエンド・バックエンドが起動している状態で実行
cd tests
npm install       # 初回のみ
node run-tests.js
```

- **テスト数**: 16件
- **出力**: `tests/test-results.xlsx`（テスト一覧 + スクリーンショット付きエビデンスシート）

---

## シードデータ

### 客室（6室）

| 名前 | タイプ | 定員 | 基本料金/名 |
|---|---|---|---|
| 松の間 | 和室 | 4名 | ¥15,000 |
| 竹の間 | 和室 | 2名 | ¥12,000 |
| 梅の間 | 和室 | 6名 | ¥14,000 |
| 桜の間 | 和洋室 | 3名 | ¥18,000 |
| 紅葉の間 | 和室 | 4名 | ¥16,000 |
| 雪の間 | 洋室 | 2名 | ¥13,000 |

### プラン（5件）

| プラン名 | 食事 | 加算額/名 |
|---|---|---|
| スタンダード 2食付きプラン | 2食付き | ¥5,000 |
| 朝食付きプラン | 朝食のみ | ¥2,000 |
| 素泊まりプラン | 素泊まり | ¥0 |
| 露天風呂付き × 豪華会席プラン | 2食付き | ¥10,000 |
| 【連泊割】2泊以上でお得プラン | 2食付き | ¥3,000 |

---

## 将来拡張（スコープ外）

- [ ] ユーザー認証・会員登録（JWT認証 + マイページ）
- [ ] 予約・客室・プランの管理画面（スタッフ向け）
- [ ] 実決済処理（Stripe等）
- [ ] 多言語対応

---

## ClaudeCode デモについて

このプロジェクトは **ClaudeCode**（Anthropic 製 CLI型 AI コーディングエージェント）を使って構築しました。

| フェーズ | 所要時間 | 主な作業 |
|---|---|---|
| 要件定義 | 約1時間 | Web参照・Markdown要件定義書生成・GitHub push |
| 開発実装 | 約2〜3時間 | フルスタック構築・画像収集・地図・メール実装 |
| 自動テスト | 約30分 | Playwright テスト設計・実行・Excel レポート出力 |

社内勉強会向け資料（PPT・スライド原稿）もリポジトリに含まれています：
- [`presentation-for-shinesoft.md`](./presentation-for-shinesoft.md)
- [`ClaudeCode_ShinesoftIntro.pptx`](./ClaudeCode_ShinesoftIntro.pptx)

---

## ライセンス

本リポジトリはデモ・学習目的のサンプルです。商用利用はご遠慮ください。  
使用画像は [Unsplash](https://unsplash.com/) より取得しています。
