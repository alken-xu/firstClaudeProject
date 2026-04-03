const express = require('express');
const router = express.Router();
const { getDb } = require('../db/init');
const { sendReservationNotification } = require('../email');

function generateReservationNo() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = String(Math.floor(Math.random() * 9000) + 1000);
  return `YK-${date}-${rand}`;
}

// 予約作成
router.post('/', (req, res) => {
  const { room_id, plan_id, check_in, check_out, nights, guest_count, total_price, guest_name, guest_email, guest_phone, requests } = req.body;

  if (!room_id || !check_in || !check_out || !nights || !guest_count || !total_price || !guest_name || !guest_email || !guest_phone) {
    return res.status(400).json({ error: '必須項目が不足しています' });
  }

  const db = getDb();

  // 二重予約チェック
  const conflict = db.prepare(`
    SELECT id FROM reservations
    WHERE room_id = ? AND status = 'confirmed'
      AND check_in < ? AND check_out > ?
  `).get(room_id, check_out, check_in);

  if (conflict) {
    return res.status(409).json({ error: '指定の日程はすでに予約済みです' });
  }

  const reservation_no = generateReservationNo();

  const result = db.prepare(`
    INSERT INTO reservations
      (reservation_no, room_id, plan_id, check_in, check_out, nights, guest_count, total_price, guest_name, guest_email, guest_phone, requests)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(reservation_no, room_id, plan_id || null, check_in, check_out, nights, guest_count, total_price, guest_name, guest_email, guest_phone, requests || null);

  const reservation = db.prepare('SELECT * FROM reservations WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(reservation);

  // メール通知（レスポンス後に非同期送信）
  const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(room_id);
  const plan = plan_id ? db.prepare('SELECT * FROM plans WHERE id = ?').get(plan_id) : null;
  sendReservationNotification(reservation, room, plan)
    .then(() => console.log(`予約メール送信完了: ${reservation.reservation_no}`))
    .catch(err => console.error('メール送信エラー:', err.message));
});

// 予約確認（予約番号で検索）
router.get('/:no', (req, res) => {
  const db = getDb();
  const reservation = db.prepare(`
    SELECT r.*, rm.name as room_name, rm.type as room_type, p.name as plan_name
    FROM reservations r
    LEFT JOIN rooms rm ON r.room_id = rm.id
    LEFT JOIN plans p ON r.plan_id = p.id
    WHERE r.reservation_no = ?
  `).get(req.params.no);

  if (!reservation) return res.status(404).json({ error: '予約が見つかりません' });
  res.json(reservation);
});

module.exports = router;
