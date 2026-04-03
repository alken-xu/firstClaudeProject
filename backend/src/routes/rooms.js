const express = require('express');
const router = express.Router();
const { getDb } = require('../db/init');

// 客室一覧
router.get('/', (req, res) => {
  const db = getDb();
  const rooms = db.prepare('SELECT * FROM rooms WHERE is_available = 1').all();
  rooms.forEach(r => {
    r.amenities = JSON.parse(r.amenities || '[]');
    r.images = JSON.parse(r.images || '[]');
  });
  res.json(rooms);
});

// 空室検索
router.get('/availability', (req, res) => {
  const { check_in, check_out, guest_count } = req.query;
  if (!check_in || !check_out || !guest_count) {
    return res.status(400).json({ error: 'check_in, check_out, guest_count は必須です' });
  }

  const db = getDb();
  // 対象期間に予約が重なっていない客室を返す
  const rooms = db.prepare(`
    SELECT * FROM rooms
    WHERE is_available = 1
      AND capacity >= ?
      AND id NOT IN (
        SELECT room_id FROM reservations
        WHERE status = 'confirmed'
          AND check_in < ?
          AND check_out > ?
      )
  `).all(parseInt(guest_count), check_out, check_in);

  rooms.forEach(r => {
    r.amenities = JSON.parse(r.amenities || '[]');
    r.images = JSON.parse(r.images || '[]');
  });
  res.json(rooms);
});

// 客室詳細
router.get('/:id', (req, res) => {
  const db = getDb();
  const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(req.params.id);
  if (!room) return res.status(404).json({ error: '客室が見つかりません' });
  room.amenities = JSON.parse(room.amenities || '[]');
  room.images = JSON.parse(room.images || '[]');
  res.json(room);
});

module.exports = router;
