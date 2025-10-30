import React, { useState, useEffect } from 'react';
import { useModal } from '../hooks/useModal';
import Modal from '../components/Common/Modal';
import QRCodeGenerator from '../components/QRcode/qrcodeGenerator';
import StatusBadge from '../components/Status/StatusBadge';
import ApiService from '../services/api';
import DownloadService from '../services/downloadService';
import QRDownloadService from '../services/qrDownloadService';
import { 
  ClipboardList, 
  Search, 
  FileText, 
  Calendar, 
  CheckCircle,
  Trash2,
  Download,
  FileDown,
  Filter,
  SortAsc,
  RefreshCw,
  QrCode,
  Image,
  User,
  Eye,
  ExternalLink
} from 'lucide-react';
import './ManageInvitesPage.css';

function ManageInvitesPage() {
  const [convites, setConvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [ordenacao, setOrdenacao] = useState('recentes');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [baixando, setBaixando] = useState(null);
  const [baixandoQR, setBaixandoQR] = useState(null);
  const [conviteSelecionado, setConviteSelecionado] = useState(null);
  const modal = useModal();

  // Carregar convites do backend
  useEffect(() => {
    carregarConvites();
  }, []);

  const carregarConvites = async () => {
    try {
      setLoading(true);
      const data = await ApiService.listarConvites();
      setConvites(data);
    } catch (err) {
      console.error('Erro ao carregar convites:', err);
      setError('Erro ao carregar convites. Verifique se o servidor está rodando.');
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal com detalhes do convite
  const abrirDetalhesConvite = (convite) => {
    setConviteSelecionado(convite);
  };

  // Fechar modal
  const fecharDetalhesConvite = () => {
    setConviteSelecionado(null);
  };

  // Filtrar e ordenar convites
  const convitesFiltrados = convites
    .filter(convite => {
      const busca = searchTerm.toLowerCase();
      const matchesSearch = 
        convite.nome_convidado1.toLowerCase().includes(busca) ||
        (convite.nome_convidado2 && convite.nome_convidado2.toLowerCase().includes(busca)) ||
        convite.qr_code.toLowerCase().includes(busca);
      
      const matchesStatus = 
        filtroStatus === 'todos' ||
        (filtroStatus === 'validos' && !convite.utilizado) ||
        (filtroStatus === 'utilizados' && convite.utilizado);
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (ordenacao === 'recentes') {
        return new Date(b.data_criacao) - new Date(a.data_criacao);
      } else {
        return new Date(a.data_criacao) - new Date(b.data_criacao);
      }
    });

  // Atualizar status do convite
  const handleStatusChange = async (conviteId, novoStatus) => {
    try {
      const convite = convites.find(c => c.id === conviteId);
      if (!convite) return;

      await ApiService.atualizarStatus(convite.qr_code, novoStatus);
      
      setConvites(prev => prev.map(c => 
        c.id === conviteId ? { ...c, utilizado: novoStatus } : c
      ));
      
      setSuccessMessage(`Status atualizado para ${novoStatus ? 'Utilizado' : 'Válido'}!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      setError('Erro ao atualizar status');
    }
  };

  // Download do PDF do convite
  const handleDownloadPDF = async (conviteId) => {
    setBaixando(conviteId);
    try {
      await DownloadService.downloadPDF(conviteId);
      setSuccessMessage('PDF baixado com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Erro ao baixar PDF:', err);
      setError('Erro ao baixar PDF. Tente novamente.');
    } finally {
      setBaixando(null);
    }
  };

  // Download do QR Code individual
  const handleDownloadQRCode = async (convite) => {
    setBaixandoQR(convite.id);
    try {
      await QRDownloadService.downloadQRCode(convite);
      setSuccessMessage(`QR Code de ${convite.nome_convidado1} baixado!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Erro ao baixar QR Code:', err);
      setError('Erro ao baixar QR Code');
    } finally {
      setBaixandoQR(null);
    }
  };

  // Download do QR Code como imagem
  const handleDownloadQRCodeImage = async (convite) => {
    setBaixandoQR(convite.id + '-img');
    try {
      await QRDownloadService.downloadQRCodeAsImage(convite);
      setSuccessMessage(`Imagem QR Code de ${convite.nome_convidado1} baixada!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Erro ao baixar imagem do QR Code:', err);
      setError('Erro ao baixar imagem do QR Code');
    } finally {
      setBaixandoQR(null);
    }
  };

  // Deletar convite
  const handleDeletarConvite = async (conviteId) => {
    try {
      await ApiService.deletarConvite(conviteId);
      setConvites(prev => prev.filter(c => c.id !== conviteId));
      setSuccessMessage('Convite deletado com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Erro ao deletar convite:', err);
      setError('Erro ao deletar convite');
    }
  };

  // Confirmar deleção
  const handleConfirmarDelecao = (convite) => {
    modal.openModal({
      title: 'Deletar Convite',
      message: `Tem certeza que deseja deletar o convite de "${convite.nome_convidado1}"? Esta ação não pode ser desfeita.`,
      type: 'danger',
      confirmText: 'Deletar',
      cancelText: 'Cancelar',
      onConfirm: () => handleDeletarConvite(convite.id),
    });
  };

  // Exportar todos convites como JSON
  const handleExportarJSON = () => {
    if (convites.length === 0) {
      setError('Nenhum convite para exportar');
      return;
    }

    try {
      const dataStr = JSON.stringify(convites, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `convites_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      setSuccessMessage('Convites exportados com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Erro ao exportar:', err);
      setError('Erro ao exportar convites');
    }
  };

  // Abrir página de validação em nova aba
  const abrirValidacao = (qrCode) => {
    const validationUrl = `${window.location.origin}/validate/${qrCode}`;
    window.open(validationUrl, '_blank');
  };

  // Estatísticas
  const estatisticas = {
    total: convites.length,
    validos: convites.filter(c => !c.utilizado).length,
    utilizados: convites.filter(c => c.utilizado).length,
    encontrados: convitesFiltrados.length
  };

  if (loading) {
    return (
      <div className="manage-invites-page">
        <div className="loading-container">
          <RefreshCw size={32} className="loading-spinner" />
          <p>Carregando convites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-invites-page">
      {/* Cabeçalho */}
      <div className="manage-header">
        <h1>
          <ClipboardList size={32} />
          Gerenciar Convites
        </h1>
        <p>Visualize e gerencie todos os convites criados</p>
      </div>

      {/* Alertas */}
      {error && (
        <div className="alert alert-error">
          <p>{error}</p>
          <button onClick={() => setError('')}>✕</button>
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success">
          <p>
            <CheckCircle size={18} />
            {successMessage}
          </p>
          <button onClick={() => setSuccessMessage('')}>✕</button>
        </div>
      )}

      {/* Estatísticas */}
      <div className="stats-section">
        <div className="stat-box">
          <span className="stat-icon total">
            <ClipboardList size={20} />
          </span>
          <div>
            <p className="stat-value">{estatisticas.total}</p>
            <p className="stat-label">Total</p>
          </div>
        </div>
        <div className="stat-box">
          <span className="stat-icon valid">
            <CheckCircle size={20} />
          </span>
          <div>
            <p className="stat-value">{estatisticas.validos}</p>
            <p className="stat-label">Válidos</p>
          </div>
        </div>
        <div className="stat-box">
          <span className="stat-icon used">
            <FileText size={20} />
          </span>
          <div>
            <p className="stat-value">{estatisticas.utilizados}</p>
            <p className="stat-label">Utilizados</p>
          </div>
        </div>
        <div className="stat-box">
          <span className="stat-icon found">
            <Search size={20} />
          </span>
          <div>
            <p className="stat-value">{estatisticas.encontrados}</p>
            <p className="stat-label">Encontrados</p>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="controls-section">
        <div className="search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por nome, convidado ou QR Code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters-row">
          <div className="filter-group">
            <Filter size={16} />
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="filter-select"
            >
              <option value="todos">Todos os Status</option>
              <option value="validos">Apenas Válidos</option>
              <option value="utilizados">Apenas Utilizados</option>
            </select>
          </div>

          <div className="filter-group">
            <SortAsc size={16} />
            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value)}
              className="filter-select"
            >
              <option value="recentes">Mais Recentes</option>
              <option value="antigos">Mais Antigos</option>
            </select>
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={carregarConvites} className="btn btn-secondary">
            <RefreshCw size={16} />
            Atualizar
          </button>
          <button onClick={handleExportarJSON} className="btn btn-secondary">
            <Download size={16} />
            Exportar JSON
          </button>
        </div>
      </div>

      {/* Lista de Convites */}
      <div className="invites-list">
        <h2 className="list-title">
          {convitesFiltrados.length} Convite{convitesFiltrados.length !== 1 ? 's' : ''} Encontrado{convitesFiltrados.length !== 1 ? 's' : ''}
        </h2>

        {convitesFiltrados.length === 0 ? (
          <div className="empty-state">
            <Search size={48} className="empty-icon" />
            <h3>Nenhum Convite Encontrado</h3>
            <p>
              {searchTerm || filtroStatus !== 'todos' 
                ? 'Tente ajustar os filtros de busca' 
                : 'Comece criando seu primeiro convite'
              }
            </p>
          </div>
        ) : (
          <div className="invites-grid">
            {convitesFiltrados.map(convite => (
              <div key={convite.id} className="invite-card">
                <div className="invite-card-header">
                  <div 
                    className="invite-names clickable" 
                    onClick={() => abrirDetalhesConvite(convite)}
                    title="Clique para ver detalhes completos"
                  >
                    <h3>
                      <User size={16} />
                      {convite.nome_convidado1}
                      <Eye size={14} className="view-icon" />
                    </h3>
                    {convite.nome_convidado2 && (
                      <p className="secondary-guest">& {convite.nome_convidado2}</p>
                    )}
                  </div>
                  <StatusBadge 
                    convite={convite} 
                    onStatusChange={handleStatusChange}
                  />
                </div>

                <div className="invite-card-info">
                  <p className="info-item">
                    <strong>ID:</strong> <code>#{convite.id}</code>
                  </p>
                  <p className="info-item">
                    <strong>Criado em:</strong> {new Date(convite.data_criacao).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="info-item">
                    <strong>QR Code:</strong> <code>{convite.qr_code.substring(0, 8)}...</code>
                  </p>
                </div>

                <div className="invite-card-actions">
                  <button
                    onClick={() => handleDownloadPDF(convite.id)}
                    disabled={baixando === convite.id}
                    className="btn btn-primary btn-sm"
                  >
                    <FileDown size={14} />
                    {baixando === convite.id ? 'Baixando...' : 'PDF Convite'}
                  </button>
                  
                  <button
                    onClick={() => abrirValidacao(convite.qr_code)}
                    className="btn btn-success btn-sm"
                  >
                    <ExternalLink size={14} />
                    Validar
                  </button>

                  <button
                    onClick={() => abrirDetalhesConvite(convite)}
                    className="btn btn-secondary btn-sm"
                  >
                    <Eye size={14} />
                    Detalhes
                  </button>
                  
                  <button
                    onClick={() => handleConfirmarDelecao(convite)}
                    className="btn btn-danger btn-sm"
                  >
                    <Trash2 size={14} />
                    Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL DE DETALHES DO CONVITE */}
      {conviteSelecionado && (
        <div className="modal-overlay active" onClick={fecharDetalhesConvite}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <User size={24} />
                Detalhes do Convite
              </h2>
              <button className="modal-close" onClick={fecharDetalhesConvite}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              {/* Informações do Convidado */}
              <div className="detail-section">
                <h3>Informações do Convidado</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <strong>Convidado Principal:</strong>
                    <span>{conviteSelecionado.nome_convidado1}</span>
                  </div>
                  {conviteSelecionado.nome_convidado2 && (
                    <div className="detail-item">
                      <strong>Acompanhante:</strong>
                      <span>{conviteSelecionado.nome_convidado2}</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <strong>Status:</strong>
                    <span className={`status-badge ${conviteSelecionado.utilizado ? 'used' : 'valid'}`}>
                      {conviteSelecionado.utilizado ? 'Utilizado' : 'Válido'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <strong>Data de Criação:</strong>
                    <span>{new Date(conviteSelecionado.data_criacao).toLocaleString('pt-BR')}</span>
                  </div>
                </div>
              </div>

              {/* Informações Técnicas */}
              <div className="detail-section">
                <h3>Informações Técnicas</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <strong>ID do Convite:</strong>
                    <code>#{conviteSelecionado.id}</code>
                  </div>
                  <div className="detail-item">
                    <strong>UUID:</strong>
                    <code>{conviteSelecionado.uuid}</code>
                  </div>
                  <div className="detail-item">
                    <strong>QR Code:</strong>
                    <code>{conviteSelecionado.qr_code}</code>
                  </div>
                </div>
              </div>

              {/* QR Code - VALIDAÇÃO COM LINK ÚNICO */}
              <div className="detail-section">
                <h3>QR Code - Validação</h3>
                <div className="qr-code-modal-container">
                  <QRCodeGenerator 
                    data={conviteSelecionado.qr_code} 
                    size={200} 
                  />
                  
                  <div className="qr-instructions">
                    <h4>📋 Como Validar:</h4>
                    <ol>
                      <li>Escaneie o QR Code com qualquer app de leitura</li>
                      <li>OU copie o link abaixo e cole no navegador</li>
                      <li>Será aberta uma página de validação</li>
                      <li>Clique em "Validar Convite" para confirmar</li>
                    </ol>
                  </div>

                  <div className="validation-actions">
                    <button 
                      onClick={() => abrirValidacao(conviteSelecionado.qr_code)}
                      className="btn btn-success"
                    >
                      <ExternalLink size={16} />
                      Abrir Página de Validação
                    </button>
                  </div>

                  <div className="qr-download-actions">
                    <button
                      onClick={() => handleDownloadQRCode(conviteSelecionado)}
                      disabled={baixandoQR === conviteSelecionado.id}
                      className="btn btn-primary btn-sm"
                    >
                      <QrCode size={14} />
                      {baixandoQR === conviteSelecionado.id ? '...' : 'PDF QR'}
                    </button>
                    
                    <button
                      onClick={() => handleDownloadQRCodeImage(conviteSelecionado)}
                      disabled={baixandoQR === conviteSelecionado.id + '-img'}
                      className="btn btn-secondary btn-sm"
                    >
                      <Image size={14} />
                      {baixandoQR === conviteSelecionado.id + '-img' ? '...' : 'PNG QR'}
                    </button>

                    <button
                      onClick={() => handleDownloadPDF(conviteSelecionado.id)}
                      disabled={baixando === conviteSelecionado.id}
                      className="btn btn-info btn-sm"
                    >
                      <FileDown size={14} />
                      {baixando === conviteSelecionado.id ? '...' : 'PDF Convite'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={fecharDetalhesConvite} className="btn btn-primary">
                Fechar
              </button>
              <button 
                onClick={() => handleStatusChange(conviteSelecionado.id, !conviteSelecionado.utilizado)}
                className={`btn ${conviteSelecionado.utilizado ? 'btn-success' : 'btn-warning'}`}
              >
                {conviteSelecionado.utilizado ? 'Marcar como Válido' : 'Marcar como Utilizado'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
        onConfirm={modal.onConfirm}
        onCancel={modal.closeModal}
      />
    </div>
  );
}

export default ManageInvitesPage;