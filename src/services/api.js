const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  static async criarConvite(conviteData) {
    try {
      const response = await fetch(`${API_BASE_URL}/convites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome_convidado1: conviteData.guestName1,
          nome_convidado2: conviteData.guestName2 || null,
          endereco: conviteData.endereco || null,
          nome_evento: conviteData.nome_evento || null,
          data_evento: conviteData.data_evento || null,
          hora_evento: conviteData.hora_evento || null,
          cronograma: conviteData.cronograma || null,
          manual: conviteData.manual || null
        })
      });
      if (!response.ok) throw new Error('Erro ao criar convite');
      return await response.json();
    } catch (error) {
      console.error('❌ Erro ao criar convite:', error);
      throw error;
    }
  }

  static async listarConvites() {
    try {
      const response = await fetch(`${API_BASE_URL}/convites`);
      if (!response.ok) throw new Error('Erro ao buscar convites');
      return await response.json();
    } catch (error) {
      console.error('❌ Erro ao listar convites:', error);
      throw error;
    }
  }

  static async buscarConvitePorId(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/convites/${id}`);
      if (!response.ok) throw new Error('Erro ao buscar detalhes');
      return await response.json();
    } catch (error) {
      console.error('❌ Erro ao buscar convite:', error);
      throw error;
    }
  }

  static async validarConvite(qrCode) {
    try {
      const response = await fetch(`${API_BASE_URL}/convites/validar/${qrCode}`);
      if (response.status === 404) return { valido: false, mensagem: 'Convite não encontrado' };
      if (!response.ok) throw new Error('Erro ao validar convite');
      return await response.json();
    } catch (error) {
      console.error('❌ Erro ao validar:', error);
      throw error;
    }
  }

  static async utilizarConvite(qrCode) {
    try {
      const response = await fetch(`${API_BASE_URL}/convites/${qrCode}/utilizar`, { method: 'PATCH' });
      if (!response.ok) throw new Error('Erro ao marcar convite');
      return await response.json();
    } catch (error) {
      console.error('❌ Erro ao utilizar convite:', error);
      throw error;
    }
  }

  static async deletarConvite(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/convites/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Erro ao deletar convite');
      return await response.json();
    } catch (error) {
      console.error('❌ Erro ao deletar:', error);
      throw error;
    }
  }
}

export default ApiService;