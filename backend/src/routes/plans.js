const express = require('express');
const router = express.Router();
const { getDb } = require('../db/init');

// プラン一覧
router.get('/', (req, res) => {
  const db = getDb();
  const plans = db.prepare('SELECT * FROM plans').all();
  plans.forEach(p => {
    p.images = JSON.parse(p.images || '[]');
  });
  res.json(plans);
});

// プラン詳細
router.get('/:id', (req, res) => {
  const db = getDb();
  const plan = db.prepare('SELECT * FROM plans WHERE id = ?').get(req.params.id);
  if (!plan) return res.status(404).json({ error: 'プランが見つかりません' });
  plan.images = JSON.parse(plan.images || '[]');
  res.json(plan);
});

module.exports = router;
