// API Service para conectar com backend

// URL base da API (backend rodando na porta 5000)
const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  // ==================== CONVITES ====================
  
  // Criar convite
  static async criarConvite(conviteData) {
    try {
      console.log(' Criando convite:', conviteData);
      
      const response = await fetch(`${API_BASE_URL}/convites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome_convidado1: conviteData.guestName1,
          nome_convidado2: conviteData.guestName2 || null
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao criar convite');
      }

      const result = await response.json();
      console.log('Convite criado:', result);
      return result;

    } catch (error) {
      console.error(' Erro ao criar convite:', error);
      throw error;
    }
  }

  // Listar todos convites
  static async listarConvites() {
    try {
      console.log(' Buscando convites...');
      
      const response = await fetch(`${API_BASE_URL}/convites`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar convites');
      }

      const convites = await response.json();
      console.log(` ${convites.length} convites carregados`);
      return convites;

    } catch (error) {
      console.error(' Erro ao listar convites:', error);
      throw error;
    }
  }

  // Validar convite por QR Code
  static async validarConvite(qrCode) {
    try {
      console.log(' Validando QR Code:', qrCode);
      
      const response = await fetch(`${API_BASE_URL}/convites/${qrCode}`);
      
      if (response.status === 404) {
        return { valido: false, mensagem: 'Convite não encontrado' };
      }

      if (!response.ok) {
        throw new Error('Erro ao validar convite');
      }

      const result = await response.json();
      console.log(' Validação:', result);
      return result;

    } catch (error) {
      console.error(' Erro ao validar:', error);
      throw error;
    }
  }

  // Marcar convite como utilizado
  static async utilizarConvite(qrCode) {
    try {
      console.log(' Marcando convite como utilizado:', qrCode);
      
      const response = await fetch(`${API_BASE_URL}/convites/${qrCode}/utilizar`, {
        method: 'PATCH'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao marcar convite');
      }

      const result = await response.json();
      console.log(' Convite marcado como utilizado');
      return result;

    } catch (error) {
      console.error(' Erro ao utilizar convite:', error);
      throw error;
    }
  }

  // Deletar convite
  static async deletarConvite(id) {
    try {
      console.log(' Deletando convite ID:', id);
      
      const response = await fetch(`${API_BASE_URL}/convites/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar convite');
      }

      const result = await response.json();
      console.log(' Convite deletado');
      return result;

    } catch (error) {
      console.error(' Erro ao deletar:', error);
      throw error;
    }
  }

  // ==================== TESTE ====================
  
  // Testar conexão com backend
  static async testarConexao() {
    try {
      const response = await fetch('http://localhost:5000/health');
      const data = await response.json();
      console.log(' Backend conectado:', data);
      return data;
    } catch (error) {
      console.error(' Backend offline:', error);
      throw error;
    }
  }
}

export default ApiService;