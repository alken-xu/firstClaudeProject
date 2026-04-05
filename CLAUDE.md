# CLAUDE.md - 共通プロジェクト情報

## プロジェクト概要
- **プロジェクト名**: デモ用旅館予約サイト「山の湯 花結（やまのゆ はなゆい）」
- **目的**: ClaudeCodeデモ用のフルスタック旅館予約サイト
- **GitHubリポジトリ**: https://github.com/alken-xu/firstClaudeProject

## 主要ファイル
- `requirements.md` - 要件定義書（技術スタック・データモデル・ページ構成等）
- `session-requirements.md` - 要件定義セッション用の作業指示
- `session-dev.md` - 開発セッション用の作業指示
- `session-test.md` - 自動単体テストセッション用の作業指示・テスト仕様
- `session-memo-for-ppt.md` - PPT作成用セッションメモ（全セッションの記録）

## 技術スタック（確定）
- **フロントエンド**: React + Vite + Tailwind CSS（`frontend/` フォルダ）
- **バックエンド**: Node.js + Express（`backend/` フォルダ）
- **DB**: SQLite（better-sqlite3）

## テスト基盤
- **テストフレームワーク**: Playwright（Node.js API）
- **レポート形式**: Excel（exceljs）— テストケース一覧 + スクリーンショットエビデンス
- **テストスクリプト**: `tests/run-tests.js`（16テストケース）
- **実行方法**: `cd tests && node run-tests.js`
- **出力**: `tests/test-results.xlsx`、`tests/screenshots/TC-XXX.png`

## セッション運用ルール
このプロジェクトは以下の3セッションに分離して運用する。
セッション開始時は必ず対応する `session-*.md` ファイルを読み、その指示に従うこと。

| セッション | 指示ファイル | 目的 |
|---|---|---|
| 要件定義セッション | `session-requirements.md` | 要件定義書の作成・更新 |
| 開発セッション | `session-dev.md` | フロントエンド・バックエンドの実装 |
| テストセッション | `session-test.md` | 自動単体テストの実施・Excel出力 |
