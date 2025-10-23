const mysql = require('mysql2/promise');

// Configuração do MySQL
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'wedding_invites',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Criar pool de conexões
const pool = mysql.createPool(dbConfig);

// Testar conexão
async function testarConexao() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conectado ao MySQL com sucesso!');
    console.log('✅ Base de dados: wedding_invites');
    connection.release();
  } catch (err) {
    console.error('❌ Erro ao conectar MySQL:', err.message);
    console.log('💡 Verifica se:');
    console.log('   - MySQL está running');
    console.log('   - A base de dados "wedding_invites" existe');
    console.log('   - A tabela "convites" foi criada');
  }
}

testarConexao();

module.exports = pool;