const express = require('express');
const cors = require('cors');
require('./config/database'); // Inicializa DB
const convitesRoutes = require('./routes/convitesRoutes');
const pool = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', convitesRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: '🚀 Wedding Invites API está funcionando!' });
});

// Rota para ver todos os convites (apenas para desenvolvimento)
app.get('/api/convites', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM convites');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
  console.log(`📱 API disponível em: http://localhost:${PORT}/api`);
  console.log('💾 Usando banco de dados SQLite');
});