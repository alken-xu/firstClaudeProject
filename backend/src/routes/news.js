const express = require('express');
const router = express.Router();
const { getDb } = require('../db/init');

router.get('/', (req, res) => {
  const db = getDb();
  const items = db.prepare('SELECT * FROM news ORDER BY published_at DESC').all();
  res.json(items);
});

module.exports = router;
