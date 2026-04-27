import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Lock, 
  Search, 
  Eye, 
  CheckCircle, 
  Trash2, 
  RefreshCw,
  BarChart3,
  QrCode,
  Clock,
  MapPin,
  UserPlus
} from 'lucide-react';
import ApiService from '../services/api';
import QRCodeGenerator from '../components/QRcode/QRCodeGenerator';
import ConviteDetalhes from '../components/ConviteDetalhes/ConviteDetalhes';
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
  const [baixando, setBaixando] = useState(null);

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
    setCarregandoDetalhes(true);
    
    try {
      const convite = await ApiService.buscarConvitePorId(id);
      setConviteSelecionado(convite);
      setShowDetalhes(true);
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error);
      alert('Erro ao carregar detalhes do convite');
    } finally {
      setCarregandoDetalhes(false);
    }
  };

  const handleFecharDetalhes = () => {
    setShowDetalhes(false);
    setConviteSelecionado(null);
  };

  const handleDownloadPDF = async (convite) => {
    setBaixando(convite.id);
    try {
      const { default: jsPDF } = await import('jspdf');
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      
      pdf.setFontSize(20);
      pdf.setTextColor(201, 168, 124);
      pdf.text('QR INVITE', pageWidth / 2, 30, { align: 'center' });
      
      pdf.setFontSize(14);
      pdf.setTextColor(74, 55, 40);
      pdf.text(`Convidado: ${convite.nome_convidado1}`, 20, 60);
      
      if (convite.nome_convidado2) {
        pdf.text(`Acompanhante: ${convite.nome_convidado2}`, 20, 75);
      }
      
      if (convite.nome_evento) {
        pdf.text(`Evento: ${convite.nome_evento}`, 20, 90);
      }
      
      pdf.text(`Código: ${convite.qr_code}`, 20, 105);
      
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${convite.qr_code}&format=png&margin=10`;
      
      try {
        const qrSize = 80;
        const qrX = (pageWidth - qrSize) / 2;
        pdf.addImage(qrUrl, 'PNG', qrX, 120, qrSize, qrSize);
      } catch (error) {
        console.warn('Erro ao adicionar QR Code no PDF');
      }
      
      pdf.save(`convite_${convite.nome_convidado1.replace(/\s+/g, '_')}.pdf`);
      
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
      alert('Erro ao baixar PDF');
    } finally {
      setBaixando(null);
    }
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
            <div className="stat-icon total">
              <Users size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{estatisticas.total}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon valid">
              <CheckCircle size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{estatisticas.validos}</span>
              <span className="stat-label">Válidos</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon used">
              <Lock size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{estatisticas.utilizados}</span>
              <span className="stat-label">Utilizados</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon found">
              <BarChart3 size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{convitesFiltrados.length}</span>
              <span className="stat-label">Filtrados</span>
            </div>
          </div>
        </div>

        {/* Barra de busca e filtros */}
        <div className="search-filters">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
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
            <div className="empty-icon">
              <Users size={48} />
            </div>
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
                    <Eye size={14} />
                    {carregandoDetalhes ? 'Carregando...' : 'Ver Detalhes'}
                  </button>
                  {convite.utilizado === 0 && (
                    <button
                      onClick={() => handleUtilizar(convite.qr_code, convite.nome_convidado1)}
                      className="btn-action btn-validar"
                    >
                      <CheckCircle size={14} />
                      Utilizar
                    </button>
                  )}
                  <button
                    onClick={() => handleDeletar(convite.id, convite.nome_convidado1)}
                    className="btn-action btn-deletar"
                  >
                    <Trash2 size={14} />
                    Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="refresh-container">
          <button onClick={carregarConvites} className="btn-refresh">
            <RefreshCw size={16} />
            Atualizar lista
          </button>
        </div>
      </div>

      {/* Modal de Detalhes - Usando o componente separado */}
      {showDetalhes && conviteSelecionado && (
        <ConviteDetalhes
          convite={conviteSelecionado}
          onClose={handleFecharDetalhes}
          onDownload={handleDownloadPDF}
        />
      )}
    </div>
  );
};

export default ManageInvitesPage;