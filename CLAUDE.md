# CLAUDE.md - 共通プロジェクト情報

## プロジェクト概要
- **プロジェクト名**: デモ用旅館予約サイト「山の湯 花結（やまのゆ はなゆい）」
- **目的**: ClaudeCodeデモ用のフルスタック旅館予約サイト
- **GitHubリポジトリ**: https://github.com/alken-xu/firstClaudeProject

## 主要ファイル
- `requirements.md` - 要件定義書（技術スタック・データモデル・ページ構成等）
- `session-requirements.md` - 要件定義セッション用の作業指示
- `session-dev.md` - 開発セッション用の作業指示

## 技術スタック（確定）
- **フロントエンド**: React + Vite + Tailwind CSS（`frontend/` フォルダ）
- **バックエンド**: Node.js + Express（`backend/` フォルダ）
- **DB**: SQLite（better-sqlite3）

## セッション運用ルール
このプロジェクトは **要件定義セッション** と **開発セッション** の2つに分離して運用する。
セッション開始時は必ず対応する `session-*.md` ファイルを読み、その指示に従うこと。
