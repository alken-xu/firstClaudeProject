const express = require('express');
const router = express.Router();

// デモ用：実際のメール送信は行わず、受け付けたことを返すのみ
router.post('/', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'お名前・メールアドレス・お問い合わせ内容は必須です' });
  }
  // 実際の実装ではここでメール送信処理を行う
  res.json({ success: true, message: 'お問い合わせを受け付けました。担当者よりご連絡いたします。' });
});

module.exports = router;
