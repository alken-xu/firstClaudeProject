const pptx = require("pptxgenjs");

const prs = new pptx();

// ============================================================
// テーマカラー定義
// ============================================================
const C = {
  deep_green : "2C4A3E",
  gold       : "C9A84C",
  off_white  : "FAF8F5",
  dark_brown : "2D2012",
  light_green: "E8F0ED",
  red_accent : "A0522D",
  white      : "FFFFFF",
  gray_light : "F0EEEB",
  gray_mid   : "9E9E9E",
  pass_green : "2E7D32",
};

prs.layout = "LAYOUT_WIDE"; // 16:9

// ============================================================
// ヘルパー関数
// ============================================================

/** タイトルスライド */
function addTitleSlide(title, subtitle) {
  const slide = prs.addSlide();
  // 背景
  slide.background = { color: C.deep_green };

  // 金のライン（上）
  slide.addShape(prs.ShapeType.rect, { x: 0, y: 1.1, w: "100%", h: 0.04, fill: { color: C.gold }, line: { color: C.gold } });
  // 金のライン（下）
  slide.addShape(prs.ShapeType.rect, { x: 0, y: 5.8, w: "100%", h: 0.04, fill: { color: C.gold }, line: { color: C.gold } });

  // タイトル
  slide.addText(title, {
    x: 0.8, y: 1.6, w: 11.4, h: 2.0,
    fontSize: 36, bold: true, color: C.white,
    fontFace: "Yu Gothic", align: "center",
  });

  // サブタイトル
  slide.addText(subtitle, {
    x: 0.8, y: 3.7, w: 11.4, h: 0.8,
    fontSize: 18, color: C.gold,
    fontFace: "Yu Gothic", align: "center",
  });

  // 会社名・日付
  slide.addText("株式会社シャインソフト  社内勉強会  |  2026年4月", {
    x: 0.8, y: 6.1, w: 11.4, h: 0.5,
    fontSize: 13, color: C.white, align: "center",
    fontFace: "Yu Gothic",
  });

  return slide;
}

/** セクション区切りスライド */
function addSectionSlide(phase, title, desc) {
  const slide = prs.addSlide();
  slide.background = { color: C.deep_green };

  // フェーズラベル
  slide.addText(phase, {
    x: 0.5, y: 0.5, w: 5, h: 0.5,
    fontSize: 14, color: C.gold, bold: true, fontFace: "Yu Gothic",
  });

  // タイトル
  slide.addText(title, {
    x: 0.5, y: 1.1, w: 12, h: 1.5,
    fontSize: 40, bold: true, color: C.white, fontFace: "Yu Gothic",
  });

  // 区切り線
  slide.addShape(prs.ShapeType.rect, { x: 0.5, y: 2.7, w: 3, h: 0.05, fill: { color: C.gold }, line: { color: C.gold } });

  // 説明
  slide.addText(desc, {
    x: 0.5, y: 3.0, w: 12, h: 1.2,
    fontSize: 18, color: C.off_white, fontFace: "Yu Gothic",
  });

  return slide;
}

/** 通常コンテンツスライド（左タイトル + コンテンツエリア） */
function addContentSlide(title, callback) {
  const slide = prs.addSlide();
  slide.background = { color: C.off_white };

  // タイトルバー
  slide.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 1.0, fill: { color: C.deep_green }, line: { color: C.deep_green } });
  slide.addText(title, {
    x: 0.4, y: 0.1, w: 12, h: 0.8,
    fontSize: 22, bold: true, color: C.white, fontFace: "Yu Gothic", valign: "middle",
  });

  // ゴールドアクセントライン
  slide.addShape(prs.ShapeType.rect, { x: 0, y: 1.0, w: "100%", h: 0.06, fill: { color: C.gold }, line: { color: C.gold } });

  callback(slide);
  return slide;
}

/** コードブロック風テキスト */
function addCodeBlock(slide, text, x, y, w, h) {
  slide.addShape(prs.ShapeType.rect, { x, y, w, h, fill: { color: "2D2012" }, line: { color: "1a1208", pt: 1 }, radius: 4 });
  slide.addText(text, {
    x: x + 0.15, y: y + 0.1, w: w - 0.3, h: h - 0.2,
    fontSize: 11, color: "A8D8A8", fontFace: "Courier New",
  });
}

/** 吹き出し風強調ボックス */
function addHighlightBox(slide, text, x, y, w, h, bgColor = C.gold) {
  slide.addShape(prs.ShapeType.rect, { x, y, w, h, fill: { color: bgColor }, line: { color: bgColor }, radius: 6 });
  slide.addText(text, {
    x: x + 0.1, y: y + 0.05, w: w - 0.2, h: h - 0.1,
    fontSize: 13, color: bgColor === C.gold ? C.dark_brown : C.white,
    bold: true, fontFace: "Yu Gothic", align: "center", valign: "middle",
  });
}

// ============================================================
// スライド生成
// ============================================================

// --- S1: 表紙 ---
addTitleSlide(
  "ClaudeCodeで旅館予約サイトを\n作ってみた",
  "要件定義 → 実装 → テスト を「会話だけ」で完結させる"
);

// --- S2: ClaudeCodeとは？ ---
addContentSlide("ClaudeCodeとは？", (s) => {
  s.addText("CLI型 AI コーディングエージェント", {
    x: 0.5, y: 1.2, w: 12, h: 0.55,
    fontSize: 20, bold: true, color: C.deep_green, fontFace: "Yu Gothic",
  });

  // 概要テーブル
  const tableData = [
    [{ text: "項目", options: { bold: true, color: C.white, fill: C.deep_green } }, { text: "内容", options: { bold: true, color: C.white, fill: C.deep_green } }],
    ["提供元", "Anthropic（Claude AI）"],
    ["形式", "CLIツール / VS Code拡張 / デスクトップアプリ"],
    ["料金", "Pro プラン（月額定額）で利用可能"],
    ["最大の特徴", "会話するだけで、コードを書き・実行し・Gitに上げる"],
  ];
  s.addTable(tableData, {
    x: 0.5, y: 1.9, w: 7.5, h: 2.5,
    fontSize: 14, fontFace: "Yu Gothic",
    border: { pt: 1, color: C.deep_green },
    fill: C.white,
    colW: [2.2, 5.3],
  });

  // できること
  s.addText("できること", {
    x: 8.4, y: 1.2, w: 4.5, h: 0.55,
    fontSize: 16, bold: true, color: C.deep_green, fontFace: "Yu Gothic",
  });
  const items = [
    "ファイルの読み書き・コード生成",
    "ターミナルコマンドの実行",
    "Webページの参照・情報収集",
    "ブラウザ操作（Playwright連携）",
    "GitHubへのコミット・プッシュ",
  ];
  items.forEach((item, i) => {
    s.addText(`▶  ${item}`, {
      x: 8.4, y: 1.8 + i * 0.5, w: 4.5, h: 0.45,
      fontSize: 13, color: C.dark_brown, fontFace: "Yu Gothic",
    });
  });

  addHighlightBox(s, "「何をしたいか」を伝えるだけで、\n手順はClaudeが考えて実行する", 0.5, 4.7, 12, 0.9, C.deep_green);
  s.addText("「何をしたいか」を伝えるだけで、手順はClaudeが考えて実行する", {
    x: 0.5, y: 4.7, w: 12, h: 0.9,
    fontSize: 16, bold: true, color: C.white, fontFace: "Yu Gothic", align: "center", valign: "middle",
  });
});

// --- S3: デモ全体像 ---
addContentSlide("デモの全体像", (s) => {
  s.addText("今回作ったもの：「山の湯 花結（やまのゆ はなゆい）」旅館予約サイト", {
    x: 0.5, y: 1.2, w: 12, h: 0.5,
    fontSize: 15, color: C.deep_green, bold: true, fontFace: "Yu Gothic",
  });

  // 3フェーズボックス
  const phases = [
    { phase: "Phase 1", label: "要件定義", time: "約1時間", icon: "📋", detail: "Web参照 → 要件定義書\n自動生成 → GitHub push" },
    { phase: "Phase 2", label: "開発実装", time: "約2〜3時間", icon: "💻", detail: "初期構築 → 画像 → 地図\n→ メール → UI改善" },
    { phase: "Phase 3", label: "自動テスト", time: "約30分", icon: "✅", detail: "テスト設計・実行 →\nExcelレポート出力" },
  ];

  phases.forEach((p, i) => {
    const x = 0.5 + i * 4.2;
    s.addShape(prs.ShapeType.rect, { x, y: 1.9, w: 3.8, h: 3.2, fill: { color: i === 1 ? C.deep_green : C.light_green }, line: { color: C.deep_green, pt: 2 }, radius: 8 });
    s.addText(p.phase, { x, y: 2.0, w: 3.8, h: 0.4, fontSize: 12, color: i === 1 ? C.gold : C.deep_green, bold: true, fontFace: "Yu Gothic", align: "center" });
    s.addText(p.label, { x, y: 2.5, w: 3.8, h: 0.6, fontSize: 20, color: i === 1 ? C.white : C.deep_green, bold: true, fontFace: "Yu Gothic", align: "center" });
    s.addText(p.time, { x, y: 3.1, w: 3.8, h: 0.4, fontSize: 13, color: i === 1 ? C.gold : C.red_accent, fontFace: "Yu Gothic", align: "center" });
    s.addText(p.detail, { x: x + 0.2, y: 3.6, w: 3.4, h: 1.0, fontSize: 12, color: i === 1 ? C.off_white : C.dark_brown, fontFace: "Yu Gothic", align: "center" });

    // 矢印
    if (i < 2) {
      s.addText("→", { x: x + 3.9, y: 3.1, w: 0.3, h: 0.5, fontSize: 22, color: C.gold, bold: true, align: "center" });
    }
  });

  // 成果物サマリ
  s.addText("成果物  |  React 10ページ + Express 9 API + SQLite + メール送信 + Playwright 16テスト + Excelレポート", {
    x: 0.5, y: 5.3, w: 12, h: 0.5,
    fontSize: 13, color: C.dark_brown, fontFace: "Yu Gothic", align: "center",
  });
});

// --- S4: 要件定義 ---
addContentSlide("Phase 1：要件定義（Web参照 → 自動生成 → GitHub push）", (s) => {
  const steps = [
    { num: "①", title: "Web情報を参照して要件定義を生成", detail: "参考サイトのURLを渡すだけ → サイト構成を読み取り → 要件定義書（Markdown）を自動生成\nページ構成・データモデル・API設計・技術スタックを一括出力" },
    { num: "②", title: "GitHubへの自動プッシュ", detail: "git init → gh repo create → git push をすべて自動実行\nGitHub CLIのパスも自力で探索して解決（環境依存問題も自己解消）" },
    { num: "③", title: "技術スタック選定の支援", detail: "ユーザーのスキル（JS/Node.js経験あり・React未経験）を踏まえて選択肢を比較提示\n最新技術を押しつけず、ユーザーが読めるレベルを優先して提案" },
  ];

  steps.forEach((step, i) => {
    const y = 1.2 + i * 1.5;
    s.addShape(prs.ShapeType.rect, { x: 0.4, y, w: 0.7, h: 0.7, fill: { color: C.deep_green }, line: { color: C.deep_green }, radius: 4 });
    s.addText(step.num, { x: 0.4, y, w: 0.7, h: 0.7, fontSize: 16, color: C.gold, bold: true, fontFace: "Yu Gothic", align: "center", valign: "middle" });
    s.addText(step.title, { x: 1.3, y, w: 11, h: 0.5, fontSize: 15, color: C.deep_green, bold: true, fontFace: "Yu Gothic" });
    s.addText(step.detail, { x: 1.3, y: y + 0.5, w: 11, h: 0.85, fontSize: 12, color: C.dark_brown, fontFace: "Yu Gothic" });
  });

  addHighlightBox(s, "決定技術スタック：React + Vite + Tailwind CSS  /  Express + SQLite (better-sqlite3)", 0.4, 5.55, 12.2, 0.5, C.gold);
  s.addText("決定技術スタック：React + Vite + Tailwind CSS  /  Express + SQLite (better-sqlite3)", {
    x: 0.4, y: 5.55, w: 12.2, h: 0.5,
    fontSize: 13, color: C.dark_brown, bold: true, fontFace: "Yu Gothic", align: "center", valign: "middle",
  });
});

// --- S5: セッション管理 ---
addContentSlide("セッション管理の工夫 — 記憶の限界をファイルで補う", (s) => {
  s.addText("ClaudeCodeはセッションをまたいで記憶を保持しない  →  ファイルベースの引き継ぎ設計で解決", {
    x: 0.5, y: 1.15, w: 12.5, h: 0.5,
    fontSize: 14, color: C.red_accent, fontFace: "Yu Gothic",
  });

  // ファイル構成図
  addCodeBlock(s, [
    "firstClaudeProject/",
    "├── CLAUDE.md                ← 共通情報（毎回自動参照）",
    "├── session-requirements.md  ← 要件定義セッション専用ルール",
    "├── session-dev.md           ← 開発セッション専用ルール",
    "├── session-test.md          ← テストセッション専用ルール",
    "└── requirements.md          ← 要件定義書（セッション間の橋渡し）",
  ].join("\n"), 0.5, 1.75, 7.5, 1.9);

  // メモリ機能
  s.addShape(prs.ShapeType.rect, { x: 8.3, y: 1.75, w: 5.0, h: 1.9, fill: { color: C.light_green }, line: { color: C.deep_green, pt: 1 }, radius: 6 });
  s.addText("メモリ機能（永続保存）", { x: 8.5, y: 1.85, w: 4.6, h: 0.45, fontSize: 14, bold: true, color: C.deep_green, fontFace: "Yu Gothic" });
  s.addText("プロジェクト情報・ユーザープロフィールを memory/ フォルダに自動保存。次回セッション開始時に自動読み込み。", {
    x: 8.5, y: 2.35, w: 4.6, h: 1.2, fontSize: 12, color: C.dark_brown, fontFace: "Yu Gothic",
  });

  // セッション開始方法
  s.addText("セッション開始は一行だけ", { x: 0.5, y: 3.8, w: 6, h: 0.45, fontSize: 15, bold: true, color: C.deep_green, fontFace: "Yu Gothic" });
  addCodeBlock(s, '"session-dev.md を読んで、その指示に従って作業してください"', 0.5, 4.3, 12.5, 0.65);

  // ポイント
  s.addText("→ これだけで前回の文脈を完全に復元して作業開始", {
    x: 0.5, y: 5.1, w: 12.5, h: 0.45,
    fontSize: 14, color: C.red_accent, bold: true, fontFace: "Yu Gothic",
  });

  // 分離の目的
  const reasons = ["要件定義の変更と実装の変更を混在させない", "修正はユーザーが各セッションで明示的に承認してから行う"];
  reasons.forEach((r, i) => {
    s.addText(`✓  ${r}`, { x: 0.5, y: 5.65 + i * 0.42, w: 12.5, h: 0.38, fontSize: 13, color: C.dark_brown, fontFace: "Yu Gothic" });
  });
});

// --- S6: 初期構築 ---
addContentSlide("Phase 2：初期構築 ― 「一言」でフルスタックを構築", (s) => {
  // 実際のプロンプト
  s.addText("ユーザーが入力した一言：", { x: 0.5, y: 1.2, w: 12, h: 0.45, fontSize: 14, color: C.gray_mid, fontFace: "Yu Gothic" });
  addCodeBlock(s, '"CLAUDE.mdをベースに、プロジェクト初期構築してください。"', 0.5, 1.65, 12.3, 0.65);

  // Claudeが実行したこと
  s.addText("Claudeが自律的に実行したこと（この一言だけで）", {
    x: 0.5, y: 2.5, w: 12, h: 0.5, fontSize: 15, bold: true, color: C.deep_green, fontFace: "Yu Gothic",
  });

  const actions = [
    "① requirements.md（要件定義書）を読み込み、仕様を把握",
    "② npm create vite でフロントエンドを初期化",
    "③ Tailwind CSS / React Router / React Hook Form を設定",
    "④ Express + SQLite のバックエンドをセットアップ",
    "⑤ 全10ページのReactコンポーネントを生成",
    "⑥ 全9エンドポイントのAPIを実装",
    "⑦ DBのテーブル定義 + シードデータを自動挿入",
    "⑧ git commit & push",
  ];

  // 2列表示
  actions.forEach((a, i) => {
    const col = i < 4 ? 0 : 1;
    const row = i % 4;
    s.addText(a, {
      x: 0.5 + col * 6.4, y: 3.1 + row * 0.42, w: 6.1, h: 0.38,
      fontSize: 12, color: C.dark_brown, fontFace: "Yu Gothic",
    });
  });

  // 成果
  s.addShape(prs.ShapeType.rect, { x: 0.5, y: 5.45, w: 12.3, h: 0.65, fill: { color: C.deep_green }, line: { color: C.deep_green }, radius: 4 });
  s.addText("成果：フロントエンド 10ページ ＋ バックエンド 9 API ＋ DB（4テーブル・シードデータ）を 1 セッションで完成", {
    x: 0.5, y: 5.45, w: 12.3, h: 0.65,
    fontSize: 13, color: C.gold, bold: true, fontFace: "Yu Gothic", align: "center", valign: "middle",
  });
});

// --- S7: トラブル自律解決 ---
addContentSlide("自律的なトラブル解決 ― エラーはClaudeが解消する", (s) => {
  s.addText("例：better-sqlite3 のインストール失敗", {
    x: 0.5, y: 1.2, w: 12, h: 0.5, fontSize: 16, bold: true, color: C.red_accent, fontFace: "Yu Gothic",
  });

  // エラー
  addCodeBlock(s, "エラー: Node.js v22 向けのビルド済みバイナリが存在しない\n        prebuild binary not found", 0.5, 1.8, 12.3, 0.8);

  // 解決ステップ
  s.addText("Claudeがやったこと（ユーザーは何もしていない）", {
    x: 0.5, y: 2.75, w: 12, h: 0.5, fontSize: 15, bold: true, color: C.deep_green, fontFace: "Yu Gothic",
  });

  const steps = [
    ["① エラーログを読んで原因を特定", '"prebuild binary not found" → バイナリ未対応と判断'],
    ["② npmパッケージのバージョン履歴を調査", "v9.6.0 ではなく v12.8.0 が Node.js v22 対応と確認"],
    ["③ バージョン指定でインストール", "npm install better-sqlite3@12.8.0"],
    ["④ 動作確認 → 解決", "DB接続テストを実行して完了を確認"],
  ];

  steps.forEach((step, i) => {
    const y = 3.35 + i * 0.55;
    s.addShape(prs.ShapeType.rect, { x: 0.5, y, w: 3.8, h: 0.45, fill: { color: C.deep_green }, line: { color: C.deep_green }, radius: 3 });
    s.addText(step[0], { x: 0.5, y, w: 3.8, h: 0.45, fontSize: 12, color: C.white, bold: true, fontFace: "Yu Gothic", align: "center", valign: "middle" });
    s.addText(step[1], { x: 4.5, y, w: 8.3, h: 0.45, fontSize: 12, color: C.dark_brown, fontFace: "Yu Gothic", valign: "middle" });
  });

  // まとめ
  s.addShape(prs.ShapeType.rect, { x: 0.5, y: 5.65, w: 12.3, h: 0.55, fill: { color: C.gold }, line: { color: C.gold }, radius: 4 });
  s.addText('ユーザーは「エラーが出ました」と伝えるだけ  ―  調査 → 修正 → 確認まですべて自律実行', {
    x: 0.5, y: 5.65, w: 12.3, h: 0.55,
    fontSize: 14, color: C.dark_brown, bold: true, fontFace: "Yu Gothic", align: "center", valign: "middle",
  });
});

// --- S8: 画像収集 ---
addContentSlide("画像収集・外部サービス連携 ― 検索→DL→実装を一気通貫", (s) => {
  s.addText('"雰囲気の近い画像を見つかれば良いです" の一言から…', {
    x: 0.5, y: 1.2, w: 12, h: 0.5, fontSize: 15, color: C.deep_green, bold: true, fontFace: "Yu Gothic",
  });

  const flow = [
    { step: "1", label: "WebSearch", detail: "Unsplash Photo IDを\nテーマ別に並行検索" },
    { step: "2", label: "URL確認", detail: "一覧をユーザーに提示\n→ 内容確認（安全確認）" },
    { step: "3", label: "並行DL", detail: "20枚を一括ダウンロード\npublic/images/ に配置" },
    { step: "4", label: "コード修正", detail: "プレースホルダーを\n<img>タグに自動差し替え" },
    { step: "5", label: "スライダー化", detail: "ヒーローを5秒\n自動切替に改修" },
  ];

  flow.forEach((f, i) => {
    const x = 0.4 + i * 2.55;
    s.addShape(prs.ShapeType.rect, { x, y: 2.0, w: 2.3, h: 2.5, fill: { color: C.light_green }, line: { color: C.deep_green, pt: 1 }, radius: 8 });
    s.addShape(prs.ShapeType.ellipse, { x: x + 0.75, y: 2.1, w: 0.8, h: 0.8, fill: { color: C.deep_green }, line: { color: C.deep_green } });
    s.addText(f.step, { x: x + 0.75, y: 2.1, w: 0.8, h: 0.8, fontSize: 18, color: C.gold, bold: true, fontFace: "Yu Gothic", align: "center", valign: "middle" });
    s.addText(f.label, { x, y: 3.05, w: 2.3, h: 0.45, fontSize: 14, color: C.deep_green, bold: true, fontFace: "Yu Gothic", align: "center" });
    s.addText(f.detail, { x: x + 0.1, y: 3.55, w: 2.1, h: 0.8, fontSize: 11, color: C.dark_brown, fontFace: "Yu Gothic", align: "center" });

    if (i < 4) s.addText("→", { x: x + 2.35, y: 2.9, w: 0.2, h: 0.5, fontSize: 18, color: C.gold, bold: true, align: "center" });
  });

  const points = [
    "Unsplashの直接fetchが403エラー → WebSearchで代替（自ら判断）",
    "「内容を確認してからDL」というユーザーの安全確認にもきちんと対応",
  ];
  points.forEach((p, i) => {
    s.addText(`▶  ${p}`, { x: 0.5, y: 4.8 + i * 0.5, w: 12.3, h: 0.45, fontSize: 13, color: C.dark_brown, fontFace: "Yu Gothic" });
  });
});

// --- S9: メール実装 ---
addContentSlide("メール送信機能の実装 ― 自然な日本語から機能を実装", (s) => {
  s.addText("ユーザーの指示：", { x: 0.5, y: 1.2, w: 12, h: 0.4, fontSize: 13, color: C.gray_mid, fontFace: "Yu Gothic" });
  addCodeBlock(s, '"予約した後、予約情報を xuguoqi00@gmail.com に送信してくれますか。"', 0.5, 1.65, 12.3, 0.65);
  s.addText("技術的指示ゼロ。自然な日本語だけでメール送信機能を実装", {
    x: 0.5, y: 2.4, w: 12, h: 0.45, fontSize: 14, color: C.deep_green, bold: true, fontFace: "Yu Gothic",
  });

  // 技術的議論のやり取り
  s.addText("デモ見せ場：技術的議論のやり取り", {
    x: 0.5, y: 3.0, w: 12, h: 0.45, fontSize: 15, bold: true, color: C.red_accent, fontFace: "Yu Gothic",
  });

  const dialog = [
    { user: "送信元をユーザーのアドレスにしたい", claude: "SMTP制約を説明 → Reply-To方式で代替提案" },
    { user: "Googleアプリパスワードの取得で詰まる", claude: "設定URLを直接案内して解決" },
  ];

  dialog.forEach((d, i) => {
    const y = 3.55 + i * 1.0;
    // ユーザー発言
    s.addShape(prs.ShapeType.rect, { x: 0.5, y, w: 5.8, h: 0.75, fill: { color: C.light_green }, line: { color: C.deep_green, pt: 1 }, radius: 6 });
    s.addText(`👤 ユーザー\n${d.user}`, { x: 0.6, y: y + 0.05, w: 5.6, h: 0.65, fontSize: 12, color: C.dark_brown, fontFace: "Yu Gothic" });
    // 矢印
    s.addText("→", { x: 6.5, y: y + 0.2, w: 0.5, h: 0.4, fontSize: 18, color: C.gold, bold: true, align: "center" });
    // Claude発言
    s.addShape(prs.ShapeType.rect, { x: 7.1, y, w: 5.7, h: 0.75, fill: { color: C.deep_green }, line: { color: C.deep_green }, radius: 6 });
    s.addText(`🤖 Claude\n${d.claude}`, { x: 7.2, y: y + 0.05, w: 5.5, h: 0.65, fontSize: 12, color: C.white, fontFace: "Yu Gothic" });
  });

  s.addShape(prs.ShapeType.rect, { x: 0.5, y: 5.65, w: 12.3, h: 0.55, fill: { color: C.gold }, line: { color: C.gold }, radius: 4 });
  s.addText("技術的制約をきちんと説明し、代替案を提示する ― 丸投げではなく対話で解決", {
    x: 0.5, y: 5.65, w: 12.3, h: 0.55,
    fontSize: 13, color: C.dark_brown, bold: true, fontFace: "Yu Gothic", align: "center", valign: "middle",
  });
});

// --- S10: 完成サイト ---
addContentSlide("完成したサイト ― 実際の画面構成", (s) => {
  const pages = [
    { name: "トップページ", detail: "Unsplash実画像の5秒スライダー\n+ 予約検索フォーム" },
    { name: "客室一覧", detail: "6室のカード形式一覧\n（画像・料金・設備）" },
    { name: "予約フロー", detail: "4ステップ式\n日程→客室→情報→確認→完了" },
    { name: "アクセス", detail: "OpenStreetMap埋め込み\n（APIキー不要・無料）" },
    { name: "お問い合わせ", detail: "フォーム送信 →\nメール通知" },
    { name: "お知らせ", detail: "ニュース一覧\nカテゴリ別表示" },
  ];

  pages.forEach((p, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.4 + col * 4.3;
    const y = 1.2 + row * 2.2;
    s.addShape(prs.ShapeType.rect, { x, y, w: 4.0, h: 1.9, fill: { color: i % 2 === 0 ? C.light_green : C.white }, line: { color: C.deep_green, pt: 1 }, radius: 6 });
    s.addText(p.name, { x, y: y + 0.1, w: 4.0, h: 0.5, fontSize: 14, bold: true, color: C.deep_green, fontFace: "Yu Gothic", align: "center" });
    s.addShape(prs.ShapeType.rect, { x: x + 0.2, y: y + 0.65, w: 3.6, h: 0.03, fill: { color: C.gold }, line: { color: C.gold } });
    s.addText(p.detail, { x: x + 0.1, y: y + 0.75, w: 3.8, h: 1.0, fontSize: 12, color: C.dark_brown, fontFace: "Yu Gothic", align: "center" });
  });

  s.addText("→  http://localhost:5173  でローカル動作確認済み", {
    x: 0.5, y: 5.7, w: 12.3, h: 0.45, fontSize: 13, color: C.gray_mid, fontFace: "Yu Gothic", align: "center",
  });
});

// --- S11: 自動テスト ---
addContentSlide("Phase 3：自動テスト ― 一言でテスト基盤を構築", (s) => {
  s.addText("ユーザーの指示：", { x: 0.5, y: 1.2, w: 12, h: 0.4, fontSize: 13, color: C.gray_mid, fontFace: "Yu Gothic" });
  addCodeBlock(s, [
    '"私がインストールした playwright を利用し、自動単体テストを実施したいです。',
    ' あなたが単体テストの EXCEL ファイルを作成し、ここの単体テストも実施してもらえますか。"',
  ].join("\n"), 0.5, 1.65, 12.3, 0.8);

  s.addText("Claudeが自律的に実行したこと", {
    x: 0.5, y: 2.6, w: 12, h: 0.45, fontSize: 15, bold: true, color: C.deep_green, fontFace: "Yu Gothic",
  });

  const actions = [
    "① ページ構成・フォーム仕様を読み込み → テストケース 16件 を自ら設計",
    "② tests/package.json 作成 → npm install（playwright + exceljs）",
    "③ npx playwright install chromium でブラウザを自動インストール",
    "④ run-tests.js（約400行）を生成 — テストロジック + Excel生成を一ファイルに統合",
    "⑤ サーバー起動確認（curl）→ テスト実行 → 全16件 PASS → Excel出力まで一気通貫",
  ];

  actions.forEach((a, i) => {
    s.addText(a, { x: 0.5, y: 3.15 + i * 0.46, w: 12.3, h: 0.42, fontSize: 13, color: C.dark_brown, fontFace: "Yu Gothic" });
  });

  // 結果
  s.addShape(prs.ShapeType.rect, { x: 0.5, y: 5.5, w: 12.3, h: 0.65, fill: { color: C.pass_green }, line: { color: C.pass_green }, radius: 4 });
  s.addText("結果：16件 / 16件  PASS（初回実行）  ―  合計実行時間 約40秒", {
    x: 0.5, y: 5.5, w: 12.3, h: 0.65,
    fontSize: 16, color: C.white, bold: true, fontFace: "Yu Gothic", align: "center", valign: "middle",
  });
});

// --- S12: Excelレポート ---
addContentSlide("テスト Excel レポート ― そのまま納品物として使えるクオリティ", (s) => {
  // Sheet 1説明
  s.addShape(prs.ShapeType.rect, { x: 0.4, y: 1.2, w: 6.0, h: 3.5, fill: { color: C.light_green }, line: { color: C.deep_green, pt: 2 }, radius: 6 });
  s.addText("Sheet 1「テストケース一覧」", { x: 0.5, y: 1.3, w: 5.8, h: 0.5, fontSize: 14, bold: true, color: C.deep_green, fontFace: "Yu Gothic" });

  const tcTable = [
    [{ text: "TC-ID", options: { bold: true, fill: C.deep_green, color: C.white } }, { text: "テスト名", options: { bold: true, fill: C.deep_green, color: C.white } }, { text: "結果", options: { bold: true, fill: C.deep_green, color: C.white } }],
    ["TC-001", "トップページ表示", { text: "PASS", options: { color: C.pass_green, bold: true } }],
    ["TC-005", "予約フロー完走", { text: "PASS", options: { color: C.pass_green, bold: true } }],
    ["TC-010", "電話番号バリデーション", { text: "PASS", options: { color: C.pass_green, bold: true } }],
    ["…（16件）", "…", { text: "全PASS", options: { color: C.pass_green, bold: true } }],
  ];
  s.addTable(tcTable, {
    x: 0.5, y: 1.9, w: 5.8, h: 2.6,
    fontSize: 12, fontFace: "Yu Gothic",
    border: { pt: 1, color: C.deep_green },
    fill: C.white,
    colW: [1.2, 3.0, 1.6],
  });

  // エビデンスシート説明
  s.addShape(prs.ShapeType.rect, { x: 6.8, y: 1.2, w: 6.0, h: 3.5, fill: { color: C.light_green }, line: { color: C.deep_green, pt: 2 }, radius: 6 });
  s.addText("Sheet TC-001〜TC-016（エビデンス）", { x: 6.9, y: 1.3, w: 5.8, h: 0.5, fontSize: 14, bold: true, color: C.deep_green, fontFace: "Yu Gothic" });

  const evidenceItems = [
    "テストID・テスト名",
    "実施日時・実施結果",
    "スクリーンショット（実画面）",
    "各テストケース独立 1シート",
  ];
  evidenceItems.forEach((item, i) => {
    s.addText(`▶  ${item}`, { x: 6.9, y: 1.95 + i * 0.55, w: 5.7, h: 0.45, fontSize: 13, color: C.dark_brown, fontFace: "Yu Gothic" });
  });

  // 概要ボックス
  s.addShape(prs.ShapeType.rect, { x: 6.9, y: 3.75, w: 5.7, h: 0.75, fill: { color: C.deep_green }, line: { color: C.deep_green }, radius: 4 });
  s.addText("全17シート\n（一覧1 + エビデンス16）", { x: 6.9, y: 3.75, w: 5.7, h: 0.75, fontSize: 13, color: C.gold, bold: true, fontFace: "Yu Gothic", align: "center", valign: "middle" });

  s.addShape(prs.ShapeType.rect, { x: 0.4, y: 4.95, w: 12.4, h: 0.65, fill: { color: C.gold }, line: { color: C.gold }, radius: 4 });
  s.addText("スクリーンショット付きエビデンスシートは業務での検収・納品書類としてそのまま使えるクオリティ", {
    x: 0.4, y: 4.95, w: 12.4, h: 0.65,
    fontSize: 13, color: C.dark_brown, bold: true, fontFace: "Yu Gothic", align: "center", valign: "middle",
  });
});

// --- S13: プロンプトのコツ ---
addContentSlide("プロンプト設計のコツ ― 効果的だったパターン", (s) => {
  const patterns = [
    { pattern: "一言指示", example: "「CLAUDE.mdをベースに、\n初期構築してください」", effect: "要件定義書を読み込み\nフルスタック全体を構築" },
    { pattern: "画像を渡す", example: "スクリーンショットを貼り付けて\n「この画面を改修して」", effect: "現状を正確に把握した上で\n改修" },
    { pattern: "自然な日本語", example: "「予約情報を〇〇に\n送信してくれますか」", effect: "技術的指示なしで\nメール機能を実装" },
    { pattern: "制約を伝える", example: "「早いほうで\nお願いします」", effect: "速度優先で\n手段を自ら選択" },
  ];

  patterns.forEach((p, i) => {
    const x = 0.4 + i * 3.25;
    // パターン名
    s.addShape(prs.ShapeType.rect, { x, y: 1.25, w: 2.95, h: 0.55, fill: { color: C.deep_green }, line: { color: C.deep_green }, radius: 4 });
    s.addText(p.pattern, { x, y: 1.25, w: 2.95, h: 0.55, fontSize: 13, color: C.gold, bold: true, fontFace: "Yu Gothic", align: "center", valign: "middle" });

    // 例
    s.addShape(prs.ShapeType.rect, { x, y: 1.9, w: 2.95, h: 1.4, fill: { color: C.light_green }, line: { color: C.deep_green, pt: 1 }, radius: 4 });
    s.addText("実例", { x, y: 1.95, w: 2.95, h: 0.3, fontSize: 10, color: C.deep_green, bold: true, fontFace: "Yu Gothic", align: "center" });
    s.addText(p.example, { x: x + 0.1, y: 2.3, w: 2.75, h: 0.9, fontSize: 11, color: C.dark_brown, fontFace: "Yu Gothic", align: "center" });

    // 矢印
    s.addText("↓", { x, y: 3.4, w: 2.95, h: 0.35, fontSize: 18, color: C.gold, bold: true, align: "center" });

    // 効果
    s.addShape(prs.ShapeType.rect, { x, y: 3.8, w: 2.95, h: 1.2, fill: { color: C.white }, line: { color: C.gold, pt: 2 }, radius: 4 });
    s.addText("効果", { x, y: 3.85, w: 2.95, h: 0.3, fontSize: 10, color: C.red_accent, bold: true, fontFace: "Yu Gothic", align: "center" });
    s.addText(p.effect, { x: x + 0.1, y: 4.2, w: 2.75, h: 0.7, fontSize: 11, color: C.dark_brown, fontFace: "Yu Gothic", align: "center" });
  });

  s.addShape(prs.ShapeType.rect, { x: 0.4, y: 5.2, w: 12.4, h: 0.55, fill: { color: C.deep_green }, line: { color: C.deep_green }, radius: 4 });
  s.addText("「意図を伝えれば十分」 ―  実装方法の指定は不要。曖昧さを恐れない", {
    x: 0.4, y: 5.2, w: 12.4, h: 0.55,
    fontSize: 14, color: C.white, bold: true, fontFace: "Yu Gothic", align: "center", valign: "middle",
  });
});

// --- S14: 役割分担 ---
addContentSlide("ユーザーがやること・やらなくていいこと", (s) => {
  // Claudeが全部やる
  s.addShape(prs.ShapeType.rect, { x: 0.4, y: 1.2, w: 5.8, h: 4.8, fill: { color: C.light_green }, line: { color: C.deep_green, pt: 2 }, radius: 8 });
  s.addText("🤖 Claudeが全部やる", { x: 0.5, y: 1.3, w: 5.6, h: 0.55, fontSize: 16, bold: true, color: C.deep_green, fontFace: "Yu Gothic", align: "center" });
  s.addShape(prs.ShapeType.rect, { x: 0.7, y: 1.9, w: 5.2, h: 0.04, fill: { color: C.gold }, line: { color: C.gold } });

  const claudeDoes = [
    "ライブラリのバージョン選定・インストール",
    "npm / git コマンドの実行",
    "ファイルの作成・編集（何十ファイルでも）",
    "エラーの調査・修正・確認",
    "テストケースの設計",
    "テストスクリプトの実装・実行",
    "Excelレポートのフォーマット設計",
    "ブラウザのインストール",
  ];
  claudeDoes.forEach((item, i) => {
    s.addText(`✓  ${item}`, { x: 0.6, y: 2.1 + i * 0.45, w: 5.5, h: 0.4, fontSize: 12, color: C.dark_brown, fontFace: "Yu Gothic" });
  });

  // ユーザーが判断
  s.addShape(prs.ShapeType.rect, { x: 6.8, y: 1.2, w: 5.8, h: 4.8, fill: { color: "#FFF8E7" }, line: { color: C.gold, pt: 2 }, radius: 8 });
  s.addText("👤 ユーザーが判断・確認する", { x: 6.9, y: 1.3, w: 5.6, h: 0.55, fontSize: 16, bold: true, color: C.dark_brown, fontFace: "Yu Gothic", align: "center" });
  s.addShape(prs.ShapeType.rect, { x: 7.1, y: 1.9, w: 5.2, h: 0.04, fill: { color: C.gold }, line: { color: C.gold } });

  const userDoes = [
    "ダウンロードURLの内容確認（セキュリティ）",
    "送信元メールアドレスの設計方針",
    "画像テーマ・ズームレベルの方向性",
    "最終的な予約フロー設計",
    "APIキー・認証情報の準備",
  ];
  userDoes.forEach((item, i) => {
    s.addText(`▶  ${item}`, { x: 7.0, y: 2.1 + i * 0.55, w: 5.5, h: 0.48, fontSize: 12, color: C.dark_brown, fontFace: "Yu Gothic" });
  });

  // 役割分担まとめ
  s.addShape(prs.ShapeType.rect, { x: 0.4, y: 6.15, w: 12.4, h: 0.55, fill: { color: C.deep_green }, line: { color: C.deep_green }, radius: 4 });
  s.addText("「実行はClaude、判断はユーザー」の役割分担が最適", {
    x: 0.4, y: 6.15, w: 12.4, h: 0.55,
    fontSize: 15, color: C.gold, bold: true, fontFace: "Yu Gothic", align: "center", valign: "middle",
  });
});

// --- S15: ライブデモ 将来拡張 ---
addContentSlide("ライブデモ：今ここで拡張機能を実装する", (s) => {
  s.addText("要件書に書いてあった「将来拡張」機能を、この場でプロンプトを入力して実装します", {
    x: 0.4, y: 1.15, w: 12.4, h: 0.48,
    fontSize: 14, color: C.deep_green, bold: true, fontFace: "Yu Gothic",
  });

  // ── 機能リスト（上段）──────────────────────────────────
  const features = [
    {
      num: "1",
      title: "ユーザー認証・会員登録",
      detail: "会員登録・ログイン・ログアウト\nログイン後にマイページ（予約履歴）を閲覧",
    },
    {
      num: "2",
      title: "予約等の管理画面",
      detail: "予約一覧・ステータス変更\n客室・プランの登録・編集",
    },
  ];

  features.forEach((f, i) => {
    const x = 0.4 + i * 6.5;
    s.addShape(prs.ShapeType.rect, { x, y: 1.72, w: 6.1, h: 1.3, fill: { color: C.light_green }, line: { color: C.deep_green, pt: 2 }, radius: 6 });
    s.addShape(prs.ShapeType.ellipse, { x: x + 0.15, y: 1.82, w: 0.65, h: 0.65, fill: { color: C.deep_green }, line: { color: C.deep_green } });
    s.addText(f.num, { x: x + 0.15, y: 1.82, w: 0.65, h: 0.65, fontSize: 16, color: C.gold, bold: true, align: "center", valign: "middle" });
    s.addText(f.title, { x: x + 0.95, y: 1.78, w: 5.0, h: 0.5, fontSize: 15, bold: true, color: C.deep_green, fontFace: "Yu Gothic" });
    s.addText(f.detail, { x: x + 0.95, y: 2.3, w: 5.0, h: 0.65, fontSize: 12, color: C.dark_brown, fontFace: "Yu Gothic" });
  });

  // ── プロンプト① ──────────────────────────────────────
  s.addText("デモプロンプト①  ユーザー認証・会員登録", {
    x: 0.4, y: 3.15, w: 12.4, h: 0.45,
    fontSize: 14, bold: true, color: C.red_accent, fontFace: "Yu Gothic",
  });
  addCodeBlock(s, [
    'session-dev.mdを読んで、以下の機能を追加してください。',
    'ユーザー認証機能（会員登録・ログイン・ログアウト）を実装してください。',
    '- バックエンド: JWT認証。/api/auth/register と /api/auth/login を追加。usersテーブルも作成。',
    '- フロントエンド: /register・/login・/mypage（予約履歴）を追加。ヘッダーに認証状態を反映。',
  ].join("\n"), 0.4, 3.65, 12.4, 1.15);

  // ── プロンプト② ──────────────────────────────────────
  s.addText("デモプロンプト②  予約等の管理画面", {
    x: 0.4, y: 4.9, w: 12.4, h: 0.45,
    fontSize: 14, bold: true, color: C.red_accent, fontFace: "Yu Gothic",
  });
  addCodeBlock(s, [
    'session-dev.mdを読んで、以下の機能を追加してください。',
    '旅館スタッフ向けの管理画面を実装してください。',
    '- /admin/login（簡易パスワード認証）→ /admin/reservations（予約一覧・ステータス変更）',
    '- /admin/rooms と /admin/plans（客室・プラン一覧・編集）も追加してください。',
  ].join("\n"), 0.4, 5.4, 12.4, 1.15);

  // ── 進行メモ（フッター）────────────────────────────────
  s.addShape(prs.ShapeType.rect, { x: 0.4, y: 6.62, w: 12.4, h: 0.52, fill: { color: C.gold }, line: { color: C.gold }, radius: 4 });
  s.addText("聴衆に「どちらから実装しますか？」と問いかけ → プロンプトを貼り付け → 実装される様子をリアルタイムで見せる", {
    x: 0.4, y: 6.62, w: 12.4, h: 0.52,
    fontSize: 12, color: C.dark_brown, bold: true, fontFace: "Yu Gothic", align: "center", valign: "middle",
  });
});

// --- S16: まとめ ---
addContentSlide("まとめ・Q&A", (s) => {
  // 所要時間テーブル
  s.addText("所要時間まとめ", { x: 0.5, y: 1.2, w: 6, h: 0.45, fontSize: 15, bold: true, color: C.deep_green, fontFace: "Yu Gothic" });

  const timeTable = [
    [{ text: "フェーズ", options: { bold: true, fill: C.deep_green, color: C.white } }, { text: "所要時間", options: { bold: true, fill: C.deep_green, color: C.white } }, { text: "主な成果物", options: { bold: true, fill: C.deep_green, color: C.white } }],
    ["Phase 1 要件定義", "約1時間", "requirements.md / GitHub push"],
    ["Phase 2 開発実装", "約2〜3時間", "フルスタックWebアプリ（10ページ+9 API）"],
    ["Phase 3 自動テスト", "約30分", "16件 PASS / Excelレポート"],
    [{ text: "合計", options: { bold: true } }, { text: "約4〜5時間", options: { bold: true, color: C.red_accent } }, { text: "本番レベルのデモサイト", options: { bold: true } }],
  ];
  s.addTable(timeTable, {
    x: 0.5, y: 1.75, w: 7.5, h: 2.3,
    fontSize: 13, fontFace: "Yu Gothic",
    border: { pt: 1, color: C.deep_green },
    fill: C.white,
    colW: [2.5, 1.8, 3.2],
  });

  // 向いているユースケース
  s.addText("ClaudeCodeが向いているユースケース", { x: 8.4, y: 1.2, w: 4.8, h: 0.45, fontSize: 14, bold: true, color: C.deep_green, fontFace: "Yu Gothic" });

  const usecases = [
    "プロトタイプ・デモサイトの高速構築",
    "要件定義書・設計ドキュメントの自動生成",
    "テストスクリプトの作成・実行",
    "既存コードのリファクタリング・機能追加",
    "エラー調査・デバッグの自律実行",
  ];
  usecases.forEach((u, i) => {
    s.addShape(prs.ShapeType.rect, { x: 8.4, y: 1.75 + i * 0.46, w: 0.4, h: 0.38, fill: { color: C.pass_green }, line: { color: C.pass_green }, radius: 2 });
    s.addText("✓", { x: 8.4, y: 1.75 + i * 0.46, w: 0.4, h: 0.38, fontSize: 12, color: C.white, bold: true, align: "center", valign: "middle" });
    s.addText(u, { x: 8.9, y: 1.75 + i * 0.46, w: 4.4, h: 0.38, fontSize: 12, color: C.dark_brown, fontFace: "Yu Gothic", valign: "middle" });
  });

  // 利用料金
  s.addShape(prs.ShapeType.rect, { x: 0.5, y: 4.2, w: 12.3, h: 0.6, fill: { color: C.light_green }, line: { color: C.deep_green, pt: 1 }, radius: 4 });
  s.addText("利用料金：Claude Code Pro プラン（月額定額）で利用 ― 追加従量課金なし", {
    x: 0.5, y: 4.2, w: 12.3, h: 0.6,
    fontSize: 13, color: C.deep_green, fontFace: "Yu Gothic", align: "center", valign: "middle",
  });

  // GitHub
  s.addText("GitHub: https://github.com/alken-xu/firstClaudeProject", {
    x: 0.5, y: 5.0, w: 12.3, h: 0.4,
    fontSize: 12, color: C.gray_mid, fontFace: "Yu Gothic", align: "center",
  });

  // Q&A
  s.addShape(prs.ShapeType.rect, { x: 0.5, y: 5.55, w: 12.3, h: 0.65, fill: { color: C.deep_green }, line: { color: C.deep_green }, radius: 4 });
  s.addText("Q & A", {
    x: 0.5, y: 5.55, w: 12.3, h: 0.65,
    fontSize: 24, color: C.gold, bold: true, fontFace: "Yu Gothic", align: "center", valign: "middle",
  });
});

// ============================================================
// ファイル出力
// ============================================================
prs.writeFile({ fileName: "ClaudeCode_ShinesoftIntro.pptx" })
  .then(() => console.log("✅  ClaudeCode_ShinesoftIntro.pptx を出力しました"))
  .catch((e) => console.error("❌ ", e));
