const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../database.sqlite');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

function initDb() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS rooms (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      name         TEXT NOT NULL,
      type         TEXT NOT NULL,
      capacity     INTEGER NOT NULL,
      size         REAL,
      base_price   INTEGER NOT NULL,
      description  TEXT,
      amenities    TEXT,
      images       TEXT,
      is_available INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS plans (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      name           TEXT NOT NULL,
      description    TEXT,
      meal_type      TEXT,
      price_modifier INTEGER DEFAULT 0,
      min_nights     INTEGER DEFAULT 1,
      available_from TEXT,
      available_to   TEXT,
      images         TEXT
    );

    CREATE TABLE IF NOT EXISTS reservations (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      reservation_no TEXT UNIQUE NOT NULL,
      room_id        INTEGER REFERENCES rooms(id),
      plan_id        INTEGER REFERENCES plans(id),
      check_in       TEXT NOT NULL,
      check_out      TEXT NOT NULL,
      nights         INTEGER NOT NULL,
      guest_count    INTEGER NOT NULL,
      total_price    INTEGER NOT NULL,
      guest_name     TEXT NOT NULL,
      guest_email    TEXT NOT NULL,
      guest_phone    TEXT NOT NULL,
      requests       TEXT,
      created_at     TEXT DEFAULT (datetime('now')),
      status         TEXT DEFAULT 'confirmed'
    );

    CREATE TABLE IF NOT EXISTS news (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      title        TEXT NOT NULL,
      content      TEXT NOT NULL,
      published_at TEXT NOT NULL,
      category     TEXT
    );
  `);

  seedData(db);
  console.log('DB initialized');
}

function seedData(db) {
  const roomCount = db.prepare('SELECT COUNT(*) as cnt FROM rooms').get().cnt;
  if (roomCount > 0) return;

  // 客室データ
  const insertRoom = db.prepare(`
    INSERT INTO rooms (name, type, capacity, size, base_price, description, amenities, images, is_available)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const rooms = [
    {
      name: '松の間',
      type: '和室',
      capacity: 4,
      size: 45.0,
      base_price: 15000,
      description: '静かな庭園を望む落ち着いた和室。松の木を眺めながらゆったりとした時間をお過ごしいただけます。',
      amenities: JSON.stringify(['温泉露天風呂付き', 'エアコン', 'テレビ', '冷蔵庫', '金庫', 'バスローブ', '浴衣']),
      images: JSON.stringify(['/images/rooms/matsu-1.jpg', '/images/rooms/matsu-2.jpg']),
    },
    {
      name: '竹の間',
      type: '和室',
      capacity: 2,
      size: 32.0,
      base_price: 12000,
      description: '竹林を望む二人旅に最適なコンパクトな和室。シンプルながらも上質な設えです。',
      amenities: JSON.stringify(['エアコン', 'テレビ', '冷蔵庫', '金庫', '浴衣']),
      images: JSON.stringify(['/images/rooms/take-1.jpg', '/images/rooms/take-2.jpg']),
    },
    {
      name: '梅の間',
      type: '和室',
      capacity: 6,
      size: 60.0,
      base_price: 14000,
      description: '梅の香漂う広々とした和室。ご家族やグループでのご利用に最適です。',
      amenities: JSON.stringify(['エアコン', 'テレビ', '冷蔵庫', '金庫', '浴衣', '広縁付き']),
      images: JSON.stringify(['/images/rooms/ume-1.jpg', '/images/rooms/ume-2.jpg']),
    },
    {
      name: '桜の間',
      type: '和洋室',
      capacity: 3,
      size: 50.0,
      base_price: 18000,
      description: '和の趣とベッドの快適さを兼ね備えた和洋室。春には桜を愛でることができます。',
      amenities: JSON.stringify(['温泉露天風呂付き', 'ツインベッド', 'エアコン', 'テレビ', '冷蔵庫', '金庫', 'バスローブ', '浴衣']),
      images: JSON.stringify(['/images/rooms/sakura-1.jpg', '/images/rooms/sakura-2.jpg']),
    },
    {
      name: '紅葉の間',
      type: '和室',
      capacity: 4,
      size: 52.0,
      base_price: 16000,
      description: '秋の紅葉が美しい山を一望できる特別な和室。四季折々の景色をお楽しみください。',
      amenities: JSON.stringify(['温泉露天風呂付き', 'エアコン', 'テレビ', '冷蔵庫', '金庫', 'バスローブ', '浴衣', '広縁付き']),
      images: JSON.stringify(['/images/rooms/momiji-1.jpg', '/images/rooms/momiji-2.jpg']),
    },
    {
      name: '雪の間',
      type: '洋室',
      capacity: 2,
      size: 35.0,
      base_price: 13000,
      description: '冬の雪景色が美しいモダンな洋室。ダブルベッドでゆったりとお休みいただけます。',
      amenities: JSON.stringify(['ダブルベッド', 'エアコン', 'テレビ', '冷蔵庫', '金庫', 'シャワーブース']),
      images: JSON.stringify(['/images/rooms/yuki-1.jpg', '/images/rooms/yuki-2.jpg']),
    },
  ];

  const insertRooms = db.transaction(() => {
    for (const r of rooms) {
      insertRoom.run(r.name, r.type, r.capacity, r.size, r.base_price, r.description, r.amenities, r.images, 1);
    }
  });
  insertRooms();

  // プランデータ
  const insertPlan = db.prepare(`
    INSERT INTO plans (name, description, meal_type, price_modifier, min_nights, available_from, available_to, images)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const plans = [
    {
      name: 'スタンダード 2食付きプラン',
      description: '旬の食材をふんだんに使った会席料理と朝食をご用意。山の恵みをたっぷりとお楽しみください。',
      meal_type: '2食付き',
      price_modifier: 5000,
      min_nights: 1,
      available_from: '2026-01-01',
      available_to: '2026-12-31',
      images: JSON.stringify(['/images/plans/standard-2meals.jpg']),
    },
    {
      name: '朝食付きプラン',
      description: '地元の食材を使った和朝食をご提供。夕食はお近くの飲食店をお楽しみいただけます。',
      meal_type: '朝食のみ',
      price_modifier: 2000,
      min_nights: 1,
      available_from: '2026-01-01',
      available_to: '2026-12-31',
      images: JSON.stringify(['/images/plans/breakfast.jpg']),
    },
    {
      name: '素泊まりプラン',
      description: '食事なしでリーズナブルにご宿泊。温泉とお部屋をゆっくりお楽しみください。',
      meal_type: '素泊まり',
      price_modifier: 0,
      min_nights: 1,
      available_from: '2026-01-01',
      available_to: '2026-12-31',
      images: JSON.stringify(['/images/plans/roomonly.jpg']),
    },
    {
      name: '【特別】露天風呂付き客室 × 豪華会席プラン',
      description: '露天風呂付き客室と総料理長特製の豪華会席のスペシャルパッケージ。記念日や特別なひとときに。',
      meal_type: '2食付き',
      price_modifier: 10000,
      min_nights: 1,
      available_from: '2026-01-01',
      available_to: '2026-12-31',
      images: JSON.stringify(['/images/plans/special-rotenburo.jpg']),
    },
    {
      name: '【連泊割】2泊以上でお得プラン',
      description: '2泊以上ご宿泊のお客様に特別割引をご提供。ゆっくりと温泉をお楽しみください。',
      meal_type: '2食付き',
      price_modifier: 3000,
      min_nights: 2,
      available_from: '2026-01-01',
      available_to: '2026-12-31',
      images: JSON.stringify(['/images/plans/consecutive.jpg']),
    },
  ];

  const insertPlans = db.transaction(() => {
    for (const p of plans) {
      insertPlan.run(p.name, p.description, p.meal_type, p.price_modifier, p.min_nights, p.available_from, p.available_to, p.images);
    }
  });
  insertPlans();

  // お知らせデータ
  const insertNews = db.prepare(`
    INSERT INTO news (title, content, published_at, category)
    VALUES (?, ?, ?, ?)
  `);

  const newsItems = [
    {
      title: '春の特別プランを公開しました',
      content: '4月〜5月限定の春の特別プランを公開しました。桜と温泉を一緒にお楽しみいただける特別な機会です。ぜひご利用ください。',
      published_at: '2026-03-15',
      category: 'お知らせ',
    },
    {
      title: 'GWの空室状況について',
      content: 'ゴールデンウィーク期間中（4/29〜5/6）の空室状況をご確認いただけます。お早めのご予約をお勧めします。',
      published_at: '2026-03-10',
      category: 'お知らせ',
    },
    {
      title: '山菜料理フェア開催のご案内',
      content: '4月〜5月の期間、地元で採れた山菜をふんだんに使った特別料理フェアを開催します。旬の恵みをぜひご堪能ください。',
      published_at: '2026-03-01',
      category: 'イベント',
    },
    {
      title: '大浴場リニューアルのお知らせ',
      content: '大浴場のリニューアル工事が完了しました。より広く快適な温泉をお楽しみいただけます。',
      published_at: '2026-02-20',
      category: 'お知らせ',
    },
    {
      title: '春の桜シーズン到来',
      content: '当旅館周辺の桜が見頃を迎えています。温泉と桜の共演をぜひお楽しみください。',
      published_at: '2026-04-01',
      category: '季節情報',
    },
  ];

  const insertNewsItems = db.transaction(() => {
    for (const n of newsItems) {
      insertNews.run(n.title, n.content, n.published_at, n.category);
    }
  });
  insertNewsItems();

  console.log('Seed data inserted');
}

module.exports = { getDb, initDb };
