'use strict';

/**
 * 山の湯 花結 - 自動単体テストランナー
 * Playwright で各ページ・機能を自動テストし、結果を Excel ファイルに出力します。
 *
 * 実行前提:
 *   - フロントエンドサーバー起動済み: http://localhost:5173
 *   - バックエンドサーバー起動済み:   http://localhost:3001
 *
 * 実行方法:
 *   cd tests
 *   npm install
 *   npx playwright install chromium
 *   node run-tests.js
 *
 * 出力:
 *   tests/test-results.xlsx  ← テストケース一覧 + 各テストのエビデンス（スクリーンショット）
 */

const { chromium } = require('playwright');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

// ─── 設定 ────────────────────────────────────────────────────────────────────
const BASE_URL = 'http://localhost:5173';
const VIEWPORT = { width: 1280, height: 900 };
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
const OUTPUT_FILE = path.join(__dirname, 'test-results.xlsx');

// スクリーンショット保存ディレクトリ確保
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// ─── テストケース定義 ────────────────────────────────────────────────────────
/**
 * 各テストケースの execute(page) 関数:
 *   - 正常時: return なし (または任意の値)
 *   - 失敗時: throw new Error('理由')
 */
const TEST_CASES = [
  // ── ページ表示テスト ────────────────────────────────────────────────────────
  {
    id: 'TC-001',
    name: 'トップページ表示確認',
    category: 'ページ表示',
    precondition: 'フロント/バックエンドサーバー起動済み',
    steps: '① http://localhost:5173 へアクセス\n② ページ表示を確認',
    expected: '旅館名「山の湯 花結」・ヒーロー画像・ナビゲーションが表示される',
    async execute(page) {
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      const h1Text = await page.locator('h1').first().textContent();
      if (!h1Text.includes('山の湯 花結')) {
        throw new Error(`h1 に旅館名が見つかりません: "${h1Text}"`);
      }
      const nav = page.locator('nav');
      if (!(await nav.isVisible())) {
        throw new Error('ナビゲーションが表示されていません');
      }
    },
  },
  {
    id: 'TC-002',
    name: '客室一覧ページ表示確認',
    category: 'ページ表示',
    precondition: 'フロント/バックエンドサーバー起動済み',
    steps: '① http://localhost:5173/rooms へアクセス\n② 客室カードが表示されることを確認',
    expected: '"客室一覧" のタイトルと複数の客室カードが表示される',
    async execute(page) {
      await page.goto(`${BASE_URL}/rooms`);
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      const h1Text = await page.locator('h1').first().textContent();
      if (!h1Text.includes('客室')) {
        throw new Error(`ページタイトルが "客室" を含みません: "${h1Text}"`);
      }
      // 客室カードが1件以上表示されるまで待機（最大5秒）
      await page.waitForSelector('.grid a', { timeout: 5000 });
      const cards = await page.locator('.grid a').count();
      if (cards < 1) {
        throw new Error(`客室カードが見つかりません (count=${cards})`);
      }
    },
  },
  {
    id: 'TC-003',
    name: '客室詳細ページ表示確認',
    category: 'ページ表示',
    precondition: 'フロント/バックエンドサーバー起動済み',
    steps: '① http://localhost:5173/rooms/1 へアクセス\n② 客室名・料金が表示されることを確認',
    expected: '客室名（松の間）、料金、設備情報が表示される',
    async execute(page) {
      await page.goto(`${BASE_URL}/rooms/1`);
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      await page.waitForTimeout(2000); // データ取得待ち
      const body = await page.locator('body').textContent();
      if (!body.includes('松の間')) {
        throw new Error('客室名「松の間」が見つかりません');
      }
    },
  },
  {
    id: 'TC-004',
    name: 'プラン一覧ページ表示確認',
    category: 'ページ表示',
    precondition: 'フロント/バックエンドサーバー起動済み',
    steps: '① http://localhost:5173/plans へアクセス\n② プランカードが表示されることを確認',
    expected: '"宿泊プラン" のタイトルと複数のプランが表示される',
    async execute(page) {
      await page.goto(`${BASE_URL}/plans`);
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      const h1Text = await page.locator('h1').first().textContent();
      if (!h1Text.includes('プラン') && !h1Text.includes('宿泊')) {
        throw new Error(`ページタイトルが想定外: "${h1Text}"`);
      }
      await page.waitForTimeout(2000);
      const body = await page.locator('body').textContent();
      if (!body.includes('スタンダード') && !body.includes('朝食')) {
        throw new Error('プラン情報が見つかりません');
      }
    },
  },
  {
    id: 'TC-005',
    name: '温泉・施設案内ページ表示確認',
    category: 'ページ表示',
    precondition: 'フロントエンドサーバー起動済み',
    steps: '① http://localhost:5173/facilities へアクセス\n② 施設情報が表示されることを確認',
    expected: '温泉・施設案内のタイトルとコンテンツが表示される',
    async execute(page) {
      await page.goto(`${BASE_URL}/facilities`);
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      const h1Text = await page.locator('h1').first().textContent();
      if (!h1Text.includes('温泉') && !h1Text.includes('施設')) {
        throw new Error(`ページタイトルが想定外: "${h1Text}"`);
      }
    },
  },
  {
    id: 'TC-006',
    name: 'アクセスページ表示確認（地図埋め込み）',
    category: 'ページ表示',
    precondition: 'フロントエンドサーバー起動済み',
    steps: '① http://localhost:5173/access へアクセス\n② 地図（OpenStreetMap iframe）が表示されることを確認',
    expected: '"アクセス" タイトルと地図 iframe が表示される',
    async execute(page) {
      await page.goto(`${BASE_URL}/access`);
      await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
      const h1Text = await page.locator('h1').first().textContent();
      if (!h1Text.includes('アクセス')) {
        throw new Error(`ページタイトルが想定外: "${h1Text}"`);
      }
      const iframe = page.locator('iframe');
      if (!(await iframe.isVisible())) {
        throw new Error('地図 iframe が表示されていません');
      }
    },
  },
  {
    id: 'TC-007',
    name: 'お知らせページ表示確認',
    category: 'ページ表示',
    precondition: 'フロント/バックエンドサーバー起動済み',
    steps: '① http://localhost:5173/news へアクセス\n② お知らせ一覧が表示されることを確認',
    expected: '"お知らせ" タイトルとお知らせ記事が表示される',
    async execute(page) {
      await page.goto(`${BASE_URL}/news`);
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      const h1Text = await page.locator('h1').first().textContent();
      if (!h1Text.includes('お知らせ')) {
        throw new Error(`ページタイトルが想定外: "${h1Text}"`);
      }
      await page.waitForTimeout(2000);
    },
  },
  {
    id: 'TC-008',
    name: 'お問い合わせページ表示確認',
    category: 'ページ表示',
    precondition: 'フロントエンドサーバー起動済み',
    steps: '① http://localhost:5173/contact へアクセス\n② お問い合わせフォームが表示されることを確認',
    expected: '"お問い合わせ" タイトルと入力フォームが表示される',
    async execute(page) {
      await page.goto(`${BASE_URL}/contact`);
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      const h1Text = await page.locator('h1').first().textContent();
      if (!h1Text.includes('お問い合わせ')) {
        throw new Error(`ページタイトルが想定外: "${h1Text}"`);
      }
      const form = page.locator('form');
      if (!(await form.isVisible())) {
        throw new Error('フォームが表示されていません');
      }
    },
  },

  // ── 予約フローテスト ─────────────────────────────────────────────────────────
  {
    id: 'TC-009',
    name: '予約フォーム Step1 表示確認',
    category: '予約フロー',
    precondition: 'フロントエンドサーバー起動済み',
    steps: '① http://localhost:5173/reserve へアクセス\n② Step1（日程・人数）フォームが表示されることを確認',
    expected: 'ステップインジケーター・チェックイン日・チェックアウト日・人数・検索ボタンが表示される',
    async execute(page) {
      await page.goto(`${BASE_URL}/reserve`);
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      const h2Text = await page.locator('h2').first().textContent();
      if (!h2Text.includes('日程') && !h2Text.includes('人数')) {
        throw new Error(`Step1 見出しが想定外: "${h2Text}"`);
      }
      const checkIn = page.locator('input[name="check_in"]');
      if (!(await checkIn.isVisible())) throw new Error('チェックイン日フィールドが見つかりません');
      const checkOut = page.locator('input[name="check_out"]');
      if (!(await checkOut.isVisible())) throw new Error('チェックアウト日フィールドが見つかりません');
      const guestCount = page.locator('select[name="guest_count"]');
      if (!(await guestCount.isVisible())) throw new Error('人数フィールドが見つかりません');
    },
  },
  {
    id: 'TC-010',
    name: '予約 Step1 バリデーション確認（未入力送信）',
    category: '予約フロー',
    precondition: 'フロントエンドサーバー起動済み',
    steps: '① /reserve へアクセス\n② 日程を入力せず「空室を検索する」ボタンをクリック\n③ バリデーションエラーが表示されることを確認',
    expected: 'チェックイン日・チェックアウト日のエラーメッセージ「入力してください」が表示される',
    async execute(page) {
      await page.goto(`${BASE_URL}/reserve`);
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      // Submit without filling dates
      await page.locator('button[type="submit"]').click();
      await page.waitForTimeout(500);
      // Expect validation error messages
      const errorMessages = page.locator('p.text-red-500');
      const count = await errorMessages.count();
      if (count < 1) {
        throw new Error('バリデーションエラーメッセージが表示されません');
      }
      const firstError = await errorMessages.first().textContent();
      if (!firstError.includes('入力')) {
        throw new Error(`エラーメッセージが想定外: "${firstError}"`);
      }
    },
  },
  {
    id: 'TC-011',
    name: '予約 Step1 空室検索実行確認',
    category: '予約フロー',
    precondition: 'フロント/バックエンドサーバー起動済み',
    steps: '① /reserve へアクセス\n② チェックイン: 2026-06-10、チェックアウト: 2026-06-11、人数: 2名 を入力\n③「空室を検索する」クリック\n④ 空室一覧が表示されることを確認',
    expected: '空室状況セクションが表示され、利用可能な客室が一覧表示される',
    async execute(page) {
      await page.goto(`${BASE_URL}/reserve`);
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      await page.locator('input[name="check_in"]').fill('2026-06-10');
      await page.locator('input[name="check_out"]').fill('2026-06-11');
      await page.locator('select[name="guest_count"]').selectOption('2');
      await page.locator('button[type="submit"]').click();
      // Wait for API response and rooms to appear
      await page.waitForTimeout(3000);
      const body = await page.locator('body').textContent();
      if (!body.includes('空室状況') && !body.includes('空室がありません')) {
        throw new Error('空室検索結果が表示されません');
      }
    },
  },
  {
    id: 'TC-012',
    name: '予約 Step2 客室・プラン選択確認',
    category: '予約フロー',
    precondition: 'フロント/バックエンドサーバー起動済み',
    steps: '① /reserve → Step1 入力・検索\n② 空室一覧から最初の客室を選択\n③ Step2（客室・プラン選択）画面へ遷移することを確認',
    expected: '「客室・プランを選択してください」が表示され、プラン選択ボタンが並ぶ',
    async execute(page) {
      await page.goto(`${BASE_URL}/reserve`);
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      await page.locator('input[name="check_in"]').fill('2026-06-10');
      await page.locator('input[name="check_out"]').fill('2026-06-11');
      await page.locator('select[name="guest_count"]').selectOption('2');
      await page.locator('button[type="submit"]').click();
      await page.waitForTimeout(3000);
      // Click the first available room
      const roomBtn = page.locator('button').filter({ hasText: /¥/ }).first();
      if (!(await roomBtn.isVisible())) throw new Error('空室ボタンが見つかりません');
      await roomBtn.click();
      await page.waitForTimeout(500);
      const h2Text = await page.locator('h2').first().textContent();
      if (!h2Text.includes('客室') && !h2Text.includes('プラン')) {
        throw new Error(`Step2 見出しが想定外: "${h2Text}"`);
      }
    },
  },
  {
    id: 'TC-013',
    name: '予約 Step3 お客様情報入力フォーム確認',
    category: '予約フロー',
    precondition: 'フロント/バックエンドサーバー起動済み',
    steps: '① Steps 1-2 完了\n②「次へ進む」クリック\n③ Step3（お客様情報）フォームが表示されることを確認',
    expected: '氏名・メール・電話番号・特別リクエスト欄が表示される',
    async execute(page) {
      await page.goto(`${BASE_URL}/reserve`);
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      // Step1
      await page.locator('input[name="check_in"]').fill('2026-06-10');
      await page.locator('input[name="check_out"]').fill('2026-06-11');
      await page.locator('select[name="guest_count"]').selectOption('2');
      await page.locator('button[type="submit"]').click();
      await page.waitForTimeout(3000);
      // Step2: select first room
      const roomBtn = page.locator('button').filter({ hasText: /¥/ }).first();
      if (!(await roomBtn.isVisible())) throw new Error('空室ボタンが見つかりません');
      await roomBtn.click();
      await page.waitForTimeout(500);
      // Proceed to Step3
      await page.locator('button').filter({ hasText: '次へ進む' }).click();
      await page.waitForTimeout(500);
      const h2Text = await page.locator('h2').first().textContent();
      if (!h2Text.includes('お客様情報')) {
        throw new Error(`Step3 見出しが想定外: "${h2Text}"`);
      }
      if (!(await page.locator('input[name="guest_name"]').isVisible())) {
        throw new Error('氏名入力フィールドが見つかりません');
      }
    },
  },
  {
    id: 'TC-014',
    name: '予約 Step4 確認画面表示確認',
    category: '予約フロー',
    precondition: 'フロント/バックエンドサーバー起動済み',
    steps: '① Steps 1-3 完了（氏名・メール・電話番号入力）\n②「確認画面へ進む」クリック\n③ Step4（確認画面）が表示されることを確認',
    expected: '「予約内容をご確認ください」と宿泊情報・お客様情報が表示され、「予約を確定する」ボタンが表示される',
    async execute(page) {
      await page.goto(`${BASE_URL}/reserve`);
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      // Step1
      await page.locator('input[name="check_in"]').fill('2026-06-10');
      await page.locator('input[name="check_out"]').fill('2026-06-11');
      await page.locator('select[name="guest_count"]').selectOption('2');
      await page.locator('button[type="submit"]').click();
      await page.waitForTimeout(3000);
      // Step2: select first room, proceed to Step3
      const roomBtn = page.locator('button').filter({ hasText: /¥/ }).first();
      if (!(await roomBtn.isVisible())) throw new Error('空室ボタンが見つかりません');
      await roomBtn.click();
      await page.waitForTimeout(500);
      await page.locator('button').filter({ hasText: '次へ進む' }).click();
      await page.waitForTimeout(500);
      // Step3: fill guest info
      await page.locator('input[name="guest_name"]').fill('山田 太郎');
      await page.locator('input[name="guest_email"]').fill('test@example.com');
      await page.locator('input[name="guest_phone"]').fill('090-1234-5678');
      await page.locator('button[type="submit"]').click();
      await page.waitForTimeout(500);
      // Verify Step4
      const h2Text = await page.locator('h2').first().textContent();
      if (!h2Text.includes('確認')) {
        throw new Error(`Step4 見出しが想定外: "${h2Text}"`);
      }
      if (!(await page.locator('button').filter({ hasText: '予約を確定する' }).isVisible())) {
        throw new Error('「予約を確定する」ボタンが見つかりません');
      }
    },
  },

  // ── フォームバリデーションテスト ────────────────────────────────────────────
  {
    id: 'TC-015',
    name: 'お問い合わせフォーム バリデーション確認',
    category: 'フォーム',
    precondition: 'フロントエンドサーバー起動済み',
    steps: '① /contact へアクセス\n② 何も入力せず「送信する」クリック\n③ バリデーションエラーが表示されることを確認',
    expected: '「お名前」「メールアドレス」「お問い合わせ内容」のエラーメッセージが表示される',
    async execute(page) {
      await page.goto(`${BASE_URL}/contact`);
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      await page.locator('button[type="submit"]').click();
      await page.waitForTimeout(500);
      const errors = page.locator('p.text-red-500');
      const count = await errors.count();
      if (count < 2) {
        throw new Error(`エラーメッセージ数が不足: ${count} 件（2件以上期待）`);
      }
    },
  },
  {
    id: 'TC-016',
    name: '電話番号バリデーション確認（不正形式）',
    category: 'フォーム',
    precondition: 'フロント/バックエンドサーバー起動済み',
    steps: '① /reserve Step3 へ進む\n② 電話番号に不正な値「12345」を入力\n③「確認画面へ進む」クリック\n④ バリデーションエラーが表示されることを確認',
    expected: '「有効な電話番号を入力してください」のエラーメッセージが表示される',
    async execute(page) {
      await page.goto(`${BASE_URL}/reserve`);
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      // Reach Step3
      await page.locator('input[name="check_in"]').fill('2026-06-10');
      await page.locator('input[name="check_out"]').fill('2026-06-11');
      await page.locator('select[name="guest_count"]').selectOption('2');
      await page.locator('button[type="submit"]').click();
      await page.waitForTimeout(3000);
      const roomBtn = page.locator('button').filter({ hasText: /¥/ }).first();
      if (!(await roomBtn.isVisible())) throw new Error('空室ボタンが見つかりません');
      await roomBtn.click();
      await page.waitForTimeout(500);
      await page.locator('button').filter({ hasText: '次へ進む' }).click();
      await page.waitForTimeout(500);
      // Fill invalid phone number
      await page.locator('input[name="guest_name"]').fill('山田 太郎');
      await page.locator('input[name="guest_email"]').fill('test@example.com');
      await page.locator('input[name="guest_phone"]').fill('12345');
      await page.locator('button[type="submit"]').click();
      await page.waitForTimeout(500);
      // Expect phone validation error
      const errors = page.locator('p.text-red-500');
      const count = await errors.count();
      if (count < 1) throw new Error('電話番号エラーメッセージが表示されません');
      const errorText = await errors.first().textContent();
      if (!errorText.includes('電話番号') && !errorText.includes('有効')) {
        throw new Error(`エラーメッセージが想定外: "${errorText}"`);
      }
    },
  },
];

// ─── Excel ヘルパー ─────────────────────────────────────────────────────────
const COLOR = {
  GREEN_BG: 'FF2C4A3E',   // ヘッダー背景（深緑）
  GOLD_BG: 'FFC9A84C',    // 金色
  WHITE: 'FFFFFFFF',
  PASS_BG: 'FFD4EDDA',    // PASS 行背景（薄緑）
  FAIL_BG: 'FFF8D7DA',    // FAIL 行背景（薄赤）
  ERROR_BG: 'FFFFF3CD',   // ERROR 行背景（薄黄）
  PASS_TEXT: 'FF155724',
  FAIL_TEXT: 'FF721C24',
  ERROR_TEXT: 'FF856404',
  BORDER: 'FFCCCCCC',
};

function cellBorder() {
  return {
    top:    { style: 'thin', color: { argb: COLOR.BORDER } },
    left:   { style: 'thin', color: { argb: COLOR.BORDER } },
    bottom: { style: 'thin', color: { argb: COLOR.BORDER } },
    right:  { style: 'thin', color: { argb: COLOR.BORDER } },
  };
}

function statusStyle(status) {
  if (status === 'PASS')  return { bg: COLOR.PASS_BG,  text: COLOR.PASS_TEXT };
  if (status === 'FAIL')  return { bg: COLOR.FAIL_BG,  text: COLOR.FAIL_TEXT };
  return { bg: COLOR.ERROR_BG, text: COLOR.ERROR_TEXT };
}

// ─── テスト実行 ─────────────────────────────────────────────────────────────
async function runTestCase(browser, tc) {
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();
  const startTime = Date.now();
  let status = 'PASS';
  let errorMsg = '';
  let screenshotBuffer = null;

  try {
    await tc.execute(page);
  } catch (err) {
    status = err.message.startsWith('[network]') ? 'ERROR' : 'FAIL';
    errorMsg = err.message;
  }

  // スクリーンショット取得（成功・失敗どちらも）
  try {
    screenshotBuffer = await page.screenshot({ fullPage: false });
    // ファイルにも保存
    fs.writeFileSync(path.join(SCREENSHOTS_DIR, `${tc.id}.png`), screenshotBuffer);
  } catch (_) { /* ページが既に閉じられている等 */ }

  await context.close();

  return {
    id: tc.id,
    name: tc.name,
    category: tc.category,
    precondition: tc.precondition,
    steps: tc.steps,
    expected: tc.expected,
    status,
    errorMsg,
    screenshotBuffer,
    duration: Date.now() - startTime,
    executedAt: new Date().toLocaleString('ja-JP'),
  };
}

// ─── Excel 生成 ─────────────────────────────────────────────────────────────
async function createExcel(results) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Playwright 自動テスト';
  workbook.created = new Date();

  // ── Sheet 1: テストケース一覧 ────────────────────────────────────────────
  const summarySheet = workbook.addWorksheet('テストケース一覧');

  // 列定義
  summarySheet.columns = [
    { header: 'No.',           key: 'no',          width: 6  },
    { header: 'テストID',      key: 'id',          width: 10 },
    { header: 'カテゴリ',      key: 'category',    width: 14 },
    { header: 'テスト名',      key: 'name',        width: 30 },
    { header: '前提条件',      key: 'precondition',width: 28 },
    { header: '操作手順',      key: 'steps',       width: 38 },
    { header: '期待結果',      key: 'expected',    width: 40 },
    { header: 'テスト結果',    key: 'status',      width: 12 },
    { header: 'エラー内容',    key: 'errorMsg',    width: 38 },
    { header: 'エビデンスシート', key: 'evidenceSheet', width: 16 },
    { header: '実施日時',      key: 'executedAt',  width: 22 },
    { header: '実施時間(ms)',  key: 'duration',    width: 14 },
  ];

  // ヘッダー行スタイル
  const headerRow = summarySheet.getRow(1);
  headerRow.height = 22;
  headerRow.eachCell(cell => {
    cell.font   = { bold: true, color: { argb: COLOR.WHITE }, name: 'Meiryo UI', size: 10 };
    cell.fill   = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR.GREEN_BG } };
    cell.border = cellBorder();
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
  });

  // サマリ統計行（3行目に記載）
  const passCount  = results.filter(r => r.status === 'PASS').length;
  const failCount  = results.filter(r => r.status === 'FAIL').length;
  const errorCount = results.filter(r => r.status === 'ERROR').length;
  summarySheet.addRow([]);
  const statRow = summarySheet.addRow([
    '', `実施件数: ${results.length}件`,
    `PASS: ${passCount}`, `FAIL: ${failCount}`, `ERROR: ${errorCount}`,
    '', '', '', '', '', `実施日: ${new Date().toLocaleDateString('ja-JP')}`,
  ]);
  statRow.height = 18;
  statRow.getCell(2).font = { bold: true, name: 'Meiryo UI', size: 10 };
  statRow.getCell(3).font = { bold: true, color: { argb: COLOR.PASS_TEXT }, name: 'Meiryo UI', size: 10 };
  statRow.getCell(4).font = { bold: true, color: { argb: COLOR.FAIL_TEXT }, name: 'Meiryo UI', size: 10 };
  statRow.getCell(5).font = { bold: true, color: { argb: COLOR.ERROR_TEXT }, name: 'Meiryo UI', size: 10 };
  summarySheet.addRow([]);

  // テスト結果データ行（5行目〜）
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    const dataRow = summarySheet.addRow({
      no:            i + 1,
      id:            r.id,
      category:      r.category,
      name:          r.name,
      precondition:  r.precondition,
      steps:         r.steps,
      expected:      r.expected,
      status:        r.status,
      errorMsg:      r.errorMsg || '',
      evidenceSheet: r.id,
      executedAt:    r.executedAt,
      duration:      r.duration,
    });

    dataRow.height = 55;
    const { bg, text } = statusStyle(r.status);

    dataRow.eachCell(cell => {
      cell.font      = { name: 'Meiryo UI', size: 9 };
      cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
      cell.border    = cellBorder();
      cell.alignment = { vertical: 'top', wrapText: true };
    });

    // No. / ID / カテゴリ / テスト結果 は中央揃え
    [1, 2, 3, 8, 10, 12].forEach(col => {
      dataRow.getCell(col).alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
    });

    // テスト結果セルを強調
    const statusCell = dataRow.getCell(8);
    statusCell.font = { bold: true, color: { argb: text }, name: 'Meiryo UI', size: 10 };
  }

  // ウィンドウ枠の固定（ヘッダー行）
  summarySheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

  // ── 各テストケースのエビデンスシート ─────────────────────────────────────
  for (const r of results) {
    const sheet = workbook.addWorksheet(r.id, {
      pageSetup: { orientation: 'landscape', fitToPage: true },
    });

    // タイトル行
    sheet.mergeCells('A1:H1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = `${r.id}  ${r.name}`;
    titleCell.font  = { bold: true, size: 13, name: 'Meiryo UI', color: { argb: COLOR.WHITE } };
    titleCell.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR.GREEN_BG } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
    sheet.getRow(1).height = 28;

    // テスト結果バッジ行
    sheet.mergeCells('A2:H2');
    const resultCell = sheet.getCell('A2');
    const { bg, text } = statusStyle(r.status);
    resultCell.value = `テスト結果: ${r.status}  ／  実施日時: ${r.executedAt}  ／  実施時間: ${r.duration}ms`;
    resultCell.font  = { bold: true, size: 10, name: 'Meiryo UI', color: { argb: text } };
    resultCell.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
    resultCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
    sheet.getRow(2).height = 20;

    // テスト情報テーブル（3〜7行目）
    const infoRows = [
      ['カテゴリ',   r.category],
      ['前提条件',   r.precondition],
      ['操作手順',   r.steps],
      ['期待結果',   r.expected],
      ['エラー内容', r.errorMsg || '—'],
    ];
    infoRows.forEach(([label, value], idx) => {
      const rowNum = idx + 3;
      sheet.getRow(rowNum).height = label === '操作手順' ? 40 : 24;
      const labelCell = sheet.getCell(`A${rowNum}`);
      labelCell.value = label;
      labelCell.font  = { bold: true, size: 9, name: 'Meiryo UI' };
      labelCell.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0EDE8' } };
      labelCell.border = cellBorder();
      labelCell.alignment = { vertical: 'middle', horizontal: 'center' };

      sheet.mergeCells(`B${rowNum}:H${rowNum}`);
      const valueCell = sheet.getCell(`B${rowNum}`);
      valueCell.value = value;
      valueCell.font  = { size: 9, name: 'Meiryo UI' };
      valueCell.border = cellBorder();
      valueCell.alignment = { vertical: 'middle', wrapText: true, indent: 1 };
    });

    // 列幅設定
    sheet.getColumn('A').width = 14;
    for (let c = 2; c <= 8; c++) {
      sheet.getColumn(c).width = 20;
    }

    // スクリーンショット埋め込み
    if (r.screenshotBuffer) {
      const imageId = workbook.addImage({
        buffer: r.screenshotBuffer,
        extension: 'png',
      });

      const ssRow = 9; // スクリーンショット開始行
      // 行の高さをスクリーンショットに合わせて確保（約60行 × 15pt = 900px）
      for (let rowIdx = ssRow; rowIdx <= ssRow + 55; rowIdx++) {
        sheet.getRow(rowIdx).height = 15;
      }

      sheet.addImage(imageId, {
        tl: { col: 0, row: ssRow - 1 },
        ext: { width: 1280, height: 810 },
      });

      // キャプション
      sheet.mergeCells(`A${ssRow - 1}:H${ssRow - 1}`);
      const captionCell = sheet.getCell(`A${ssRow - 1}`);
      captionCell.value = 'テストエビデンス（スクリーンショット）';
      captionCell.font  = { bold: true, size: 9, name: 'Meiryo UI', color: { argb: COLOR.GREEN_BG } };
      captionCell.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEAF4EC' } };
      captionCell.alignment = { vertical: 'middle', indent: 1 };
      sheet.getRow(ssRow - 1).height = 18;
    } else {
      sheet.mergeCells('A9:H9');
      sheet.getCell('A9').value = 'スクリーンショット取得失敗';
      sheet.getCell('A9').font = { color: { argb: COLOR.FAIL_TEXT }, name: 'Meiryo UI', size: 9 };
    }
  }

  await workbook.xlsx.writeFile(OUTPUT_FILE);
  return OUTPUT_FILE;
}

// ─── メイン処理 ─────────────────────────────────────────────────────────────
async function main() {
  console.log('='.repeat(60));
  console.log(' 山の湯 花結 — 自動単体テスト');
  console.log('='.repeat(60));
  console.log(`対象URL : ${BASE_URL}`);
  console.log(`テスト数: ${TEST_CASES.length} 件`);
  console.log(`出力先  : ${OUTPUT_FILE}`);
  console.log('-'.repeat(60));

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (err) {
    console.error('\n[ERROR] Playwright Chromium の起動に失敗しました。');
    console.error('  → 以下のコマンドでブラウザをインストールしてください:');
    console.error('      npx playwright install chromium\n');
    process.exit(1);
  }

  const results = [];
  for (let i = 0; i < TEST_CASES.length; i++) {
    const tc = TEST_CASES[i];
    process.stdout.write(`[${String(i + 1).padStart(2)}/${TEST_CASES.length}] ${tc.id} ${tc.name} ... `);
    const result = await runTestCase(browser, tc);
    results.push(result);
    const label = result.status === 'PASS' ? '✓ PASS' : result.status === 'FAIL' ? '✗ FAIL' : '⚠ ERROR';
    console.log(`${label}  (${result.duration}ms)`);
    if (result.errorMsg) {
      console.log(`         → ${result.errorMsg}`);
    }
  }

  await browser.close();

  console.log('-'.repeat(60));
  const passCount  = results.filter(r => r.status === 'PASS').length;
  const failCount  = results.filter(r => r.status === 'FAIL').length;
  const errorCount = results.filter(r => r.status === 'ERROR').length;
  console.log(`結果: PASS=${passCount}  FAIL=${failCount}  ERROR=${errorCount}  合計=${results.length}`);

  console.log('\nExcel ファイルを生成中...');
  const outputPath = await createExcel(results);
  console.log(`完了: ${outputPath}`);
  console.log('='.repeat(60));
}

main().catch(err => {
  console.error('予期しないエラー:', err);
  process.exit(1);
});
