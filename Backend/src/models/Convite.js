const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Convite {
  static async criar(nome1, nome2 = null) {
    const uuid = uuidv4();
    const qrCode = uuid;
    
    const query = `
      INSERT INTO convites (uuid, nome_convidado1, nome_convidado2, qr_code)
      VALUES (?, ?, ?, ?)
    `;
    
    try {
      const [result] = await pool.execute(query, [uuid, nome1, nome2, qrCode]);
      
      return {
        id: result.insertId,
        uuid,
        qrCode,
        nome_convidado1: nome1,
        nome_convidado2: nome2
      };
    } catch (err) {
      throw new Error('Erro ao criar convite: ' + err.message);
    }
  }

  static async buscarPorQRCode(qrCode) {
    const query = `SELECT * FROM convites WHERE qr_code = ?`;
    
    try {
      const [rows] = await pool.execute(query, [qrCode]);
      return rows[0] || null;
    } catch (err) {
      throw new Error('Erro ao buscar convite: ' + err.message);
    }
  }

  static async marcarComoUtilizado(qrCode) {
    const query = `UPDATE convites SET utilizado = TRUE WHERE qr_code = ? AND utilizado = FALSE`;
    
    try {
      const [result] = await pool.execute(query, [qrCode]);
      return result.affectedRows;
    } catch (err) {
      throw new Error('Erro ao utilizar convite: ' + err.message);
    }
  }
}

module.exports = Convite;