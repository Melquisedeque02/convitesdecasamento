// src/services/api.js

// IMPORTANTE: Substitua SEU_IP pelo IP da sua rede local
// Exemplo: 192.168.1.100, 192.168.0.101, etc.

// Opção 1: Usar IP local (mais rápido)
// const API_BASE_URL = 'http://SEU_IP:5000/api';

// Opção 2: Usar localhost (só funciona no computador)
// const API_BASE_URL = 'http://localhost:5000/api';

// Opção 3: Usar ngrok (para iPhone)
// const API_BASE_URL = 'https://abc123.ngrok.io/api';

// DESCOMENTE APENAS UMA DAS LINHAS ACIMA ↑

// Por enquanto, vamos usar uma variável que você pode mudar facilmente:
let API_BASE_URL = 'http://192.168.18.5:5000/api'; // ← MUDE ESTE IP!

class ApiService {
  // Criar convite
  static async criarConvite(conviteData) {
    try {
      console.log('🎯 Tentando criar convite...');
      console.log('📡 Conectando em:', `${API_BASE_URL}/convites`);
      console.log('📦 Dados enviados:', conviteData);

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

      console.log('📡 Status da resposta:', response.status);
      console.log('📡 URL completa:', `${API_BASE_URL}/convites`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro da API:', errorText);
        
        if (response.status === 404) {
          throw new Error('Servidor não encontrado. Verifique se o backend está rodando.');
        } else if (response.status === 500) {
          throw new Error('Erro interno do servidor.');
        } else {
          throw new Error(`Erro ${response.status}: ${errorText}`);
        }
      }

      const result = await response.json();
      console.log('✅ Convite criado com sucesso:', result);
      return result;

    } catch (error) {
      console.error('💥 Erro completo ao criar convite:', error);
      
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Não foi possível conectar ao servidor. Verifique:\n1. Backend está rodando\n2. IP está correto\n3. Mesma rede Wi-Fi');
      }
      
      throw new Error(error.message || 'Erro desconhecido ao criar convite');
    }
  }

  // Validar convite
  static async validarConvite(qrCode) {
    try {
      console.log('🔍 Validando QR Code:', qrCode);
      
      const response = await fetch(`${API_BASE_URL}/convites/${qrCode}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao validar convite:', error);
      throw error;
    }
  }

  // Utilizar convite
  static async utilizarConvite(qrCode) {
    try {
      const response = await fetch(`${API_BASE_URL}/convites/${qrCode}/utilizar`, {
        method: 'PATCH'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao utilizar convite:', error);
      throw error;
    }
  }

  // Listar todos convites
 static async listarConvites() {
  try {
    console.log('📋 Buscando convites via rota de teste...');
    
    // Use a rota que sabemos que funciona
    const response = await fetch(`${API_BASE_URL}/test-convites`);
    
    if (!response.ok) {
      throw new Error(`Erro ${response.status}`);
    }

    const data = await response.json();
    // Retorne apenas o array de convites (igual à rota normal)
    return data.convites;
    
  } catch (error) {
    console.error('💥 Erro ao carregar convites:', error);
    throw error;
  }
}

  // Atualizar status do convite
  static async atualizarStatus(qrCode, utilizado) {
    try {
      const response = await fetch(`${API_BASE_URL}/convites/${qrCode}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ utilizado })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      throw error;
    }
  }

  // Buscar convite por ID
  static async buscarConvitePorId(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/convites`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      const convites = await response.json();
      return convites.find(c => c.id === parseInt(id));
    } catch (error) {
      console.error('Erro ao buscar convite por ID:', error);
      throw error;
    }
  }

  // Deletar convite
  static async deletarConvite(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/convites/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao deletar convite:', error);
      throw error;
    }
  }

  // Método para testar conexão
  static async testarConexao() {
    try {
      console.log('🧪 Testando conexão com o backend...');
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
      
      if (!response.ok) {
        throw new Error(`Backend respondeu com erro: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Conexão com backend OK:', data);
      return data;
    } catch (error) {
      console.error('❌ Falha na conexão com backend:', error);
      throw error;
    }
  }
}

// Exportar também a URL para poder mudar facilmente
export { API_BASE_URL };
export default ApiService;