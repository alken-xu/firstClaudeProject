const express = require('express');
const router = express.Router();
const { sendContactNotification } = require('../email');

router.post('/', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'お名前・メールアドレス・お問い合わせ内容は必須です' });
  }

  res.json({ success: true, message: 'お問い合わせを受け付けました。担当者よりご連絡いたします。' });

  // メール通知（レスポンス後に非同期送信）
  sendContactNotification({ name, email, phone, subject, message })
    .then(() => console.log(`お問い合わせメール送信完了: ${name} 様`))
    .catch(err => console.error('お問い合わせメール送信エラー:', err.message));
});

module.exports = router;
