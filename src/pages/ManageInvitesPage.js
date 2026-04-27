import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import QRCodeGenerator from '../components/QRcode/QRCodeGenerator';
import './ManageInvitesPage.css';

const ManageInvitesPage = () => {
  const [convites, setConvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [conviteSelecionado, setConviteSelecionado] = useState(null);
  const [showDetalhes, setShowDetalhes] = useState(false);
  const [carregandoDetalhes, setCarregandoDetalhes] = useState(false);

  useEffect(() => {
    carregarConvites();
  }, []);

  const carregarConvites = async () => {
    try {
      setLoading(true);
      const data = await ApiService.listarConvites();
      setConvites(data);
      setErro('');
    } catch (error) {
      setErro('Erro ao carregar convites');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerDetalhes = async (id) => {
    console.log('🔍 Clicou em Ver Detalhes, ID:', id);
    setCarregandoDetalhes(true);
    
    try {
      const convite = await ApiService.buscarConvitePorId(id);
      console.log(' Convite carregado:', convite);
      setConviteSelecionado(convite);
      setShowDetalhes(true);
    } catch (error) {
      console.error(' Erro ao buscar detalhes:', error);
      alert('Erro ao carregar detalhes do convite');
    } finally {
      setCarregandoDetalhes(false);
    }
  };

  const handleFecharDetalhes = () => {
    setShowDetalhes(false);
    setConviteSelecionado(null);
  };

  const handleUtilizar = async (qrCode, nome) => {
    if (window.confirm(`Marcar ${nome} como utilizado?`)) {
      try {
        await ApiService.utilizarConvite(qrCode);
        carregarConvites();
        if (showDetalhes) handleFecharDetalhes();
      } catch (error) {
        console.error('Erro ao marcar:', error);
      }
    }
  };

  const handleDeletar = async (id, nome) => {
    if (window.confirm(`Deletar convite de ${nome}?`)) {
      try {
        await ApiService.deletarConvite(id);
        carregarConvites();
        if (showDetalhes) handleFecharDetalhes();
      } catch (error) {
        console.error('Erro ao deletar:', error);
      }
    }
  };

  // Filtros
  const convitesFiltrados = convites.filter(convite => {
    const matchesSearch = 
      convite.nome_convidado1.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (convite.nome_convidado2 && convite.nome_convidado2.toLowerCase().includes(searchTerm.toLowerCase())) ||
      convite.qr_code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filtroStatus === 'todos' ||
      (filtroStatus === 'validos' && convite.utilizado === 0) ||
      (filtroStatus === 'utilizados' && convite.utilizado === 1);
    
    return matchesSearch && matchesStatus;
  });

  const estatisticas = {
    total: convites.length,
    validos: convites.filter(c => c.utilizado === 0).length,
    utilizados: convites.filter(c => c.utilizado === 1).length
  };

  if (loading) {
    return (
      <div className="manage-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando convites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-page">
      <div className="manage-container">
        {/* Cabeçalho */}
        <div className="manage-header">
          <h1>Gerenciar Convites</h1>
          <p>Visualize, valide e organize todos os convites criados</p>
        </div>

        {/* Estatísticas */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon total"></div>
            <div className="stat-info">
              <span className="stat-value">{estatisticas.total}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon valid"></div>
            <div className="stat-info">
              <span className="stat-value">{estatisticas.validos}</span>
              <span className="stat-label">Válidos</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon used"></div>
            <div className="stat-info">
              <span className="stat-value">{estatisticas.utilizados}</span>
              <span className="stat-label">Utilizados</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon found"></div>
            <div className="stat-info">
              <span className="stat-value">{convitesFiltrados.length}</span>
              <span className="stat-label">Filtrados</span>
            </div>
          </div>
        </div>

        {/* Barra de busca e filtros */}
        <div className="search-filters">
          <div className="search-bar">
            <span className="search-icon"></span>
            <input
              type="text"
              placeholder="Buscar por nome ou código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="filter-select"
            >
              <option value="todos">Todos os status</option>
              <option value="validos">Apenas válidos</option>
              <option value="utilizados">Apenas utilizados</option>
            </select>
          </div>
        </div>

        {erro && (
          <div className="alert alert-error">{erro}</div>
        )}

        {/* Lista de convites */}
        {convitesFiltrados.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"></div>
            <h3>Nenhum convite encontrado</h3>
            <p>{searchTerm ? 'Tente outro termo de busca' : 'Comece criando seu primeiro convite'}</p>
          </div>
        ) : (
          <div className="convites-grid">
            {convitesFiltrados.map(convite => (
              <div key={convite.id} className="convite-card">
                <div className="card-header">
                  <div className="convidados">
                    <h3 className="convidado-principal">{convite.nome_convidado1}</h3>
                    {convite.nome_convidado2 && (
                      <p className="convidado-secundario">{convite.nome_convidado2}</p>
                    )}
                  </div>
                  <div className={`status-badge ${convite.utilizado === 1 ? 'status-used' : 'status-valid'}`}>
                    {convite.utilizado === 1 ? 'Utilizado' : 'Válido'}
                  </div>
                </div>

                <div className="card-qr">
                  <QRCodeGenerator data={convite.qr_code} size={100} />
                  <p className="qr-code-text">{convite.qr_code.substring(0, 16)}...</p>
                </div>

                <div className="card-info">
                  <div className="info-row">
                    <span className="info-label">ID</span>
                    <span className="info-value">#{convite.id}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Criado em</span>
                    <span className="info-value">
                      {new Date(convite.data_criacao).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                <div className="card-actions">
                  <button
                    onClick={() => handleVerDetalhes(convite.id)}
                    className="btn-action btn-detalhes"
                    disabled={carregandoDetalhes}
                  >
                    {carregandoDetalhes ? ' Carregando...' : ' Ver Detalhes'}
                  </button>
                  {convite.utilizado === 0 && (
                    <button
                      onClick={() => handleUtilizar(convite.qr_code, convite.nome_convidado1)}
                      className="btn-action btn-validar"
                    >
                      ✓ Utilizar
                    </button>
                  )}
                  <button
                    onClick={() => handleDeletar(convite.id, convite.nome_convidado1)}
                    className="btn-action btn-deletar"
                  >
                     Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="refresh-container">
          <button onClick={carregarConvites} className="btn-refresh">
             Atualizar lista
          </button>
        </div>
      </div>

      {/* Modal de Detalhes - Versão Simplificada para Teste */}
      {showDetalhes && conviteSelecionado && (
        <div className="modal-overlay" onClick={handleFecharDetalhes}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleFecharDetalhes}>✕</button>
            
            <div className="modal-header">
              <h2>Detalhes do Convite</h2>
              <div className={`status-badge ${conviteSelecionado.utilizado === 1 ? 'status-used' : 'status-valid'}`}>
                {conviteSelecionado.utilizado === 1 ? 'Utilizado' : 'Válido'}
              </div>
            </div>

            <div className="modal-body">
              {/* Convidados */}
              <div className="detalhes-section">
                <h3>Convidados</h3>
                <p><strong>Principal:</strong> {conviteSelecionado.nome_convidado1}</p>
                {conviteSelecionado.nome_convidado2 && (
                  <p><strong>Acompanhante:</strong> {conviteSelecionado.nome_convidado2}</p>
                )}
              </div>

              {/* Evento */}
              {conviteSelecionado.nome_evento && (
                <div className="detalhes-section">
                  <h3>Evento</h3>
                  <p><strong>Nome:</strong> {conviteSelecionado.nome_evento}</p>
                  {conviteSelecionado.data_evento && (
                    <p><strong>Data:</strong> {new Date(conviteSelecionado.data_evento).toLocaleDateString('pt-BR')}</p>
                  )}
                  {conviteSelecionado.hora_evento && (
                    <p><strong>Hora:</strong> {conviteSelecionado.hora_evento}</p>
                  )}
                </div>
              )}

              {/* Local */}
              {conviteSelecionado.endereco && (
                <div className="detalhes-section">
                  <h3>Local</h3>
                  <p>{conviteSelecionado.endereco}</p>
                </div>
              )}

              {/* QR Code */}
              <div className="detalhes-section qr-section-modal">
                <h3>QR Code de Validação</h3>
                <QRCodeGenerator data={conviteSelecionado.qr_code} size={120} />
                <p className="qr-code-text">{conviteSelecionado.qr_code}</p>
              </div>

              {/* Informações adicionais */}
              <div className="detalhes-section">
                <h3>Informações</h3>
                <p><strong>ID:</strong> #{conviteSelecionado.id}</p>
                <p><strong>Criado em:</strong> {new Date(conviteSelecionado.data_criacao).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={handleFecharDetalhes} className="btn btn-secondary">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageInvitesPage;