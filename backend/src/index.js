require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDb } = require('./db/init');

const app = express();
const PORT = process.env.PORT ?? 3001;
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:5173';

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

// DB 初期化
initDb();

// ルート
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/plans', require('./routes/plans'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/news', require('./routes/news'));
app.use('/api/contact', require('./routes/contact'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
