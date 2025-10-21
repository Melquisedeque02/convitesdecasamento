// src/pages/ManageInvitesPage.jsx
import React, { useState } from 'react';
import { useInvite } from '../hooks/useInvite';
import { useModal } from '../hooks/useModal';
import Modal from '../components/Common/Modal';
import InviteCard from '../components/Invite/InviteCard';
import { searchInvites, sortInvitesByDate } from '../services/inviteService';
import { exportInvitesAsJSON, importInvitesFromJSON } from '../services/storageService';
import { 
  ClipboardList, 
  Search, 
  FileText, 
  Calendar, 
  Upload, 
  Download, 
  Trash2, 
  SearchX,
  CheckCircle
} from 'lucide-react';
import './ManageInvitesPage.css';

function ManageInvitesPage() {
  const { invites, deleteInvite, error, clearError } = useInvite();
  const modal = useModal();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterType, setFilterType] = useState('all');
  const [successMessage, setSuccessMessage] = useState('');

  // Filtrar e ordenar convites
  const getFilteredInvites = () => {
    let filtered = invites;

    // Aplicar busca
    if (searchTerm) {
      filtered = searchInvites(filtered, searchTerm);
    }

    // Aplicar filtro de tipo
    const now = new Date();
    if (filterType === 'upcoming') {
      filtered = filtered.filter(inv => new Date(inv.eventDate) > now);
    } else if (filterType === 'past') {
      filtered = filtered.filter(inv => new Date(inv.eventDate) <= now);
    }

    // Aplicar ordenação
    filtered = sortInvitesByDate(filtered, sortOrder);

    return filtered;
  };

  const filteredInvites = getFilteredInvites();

  // Handle Delete
  const handleDeleteClick = (inviteId, eventName) => {
    modal.openModal({
      title: 'Deletar Convite',
      message: `Tem certeza que deseja deletar o convite "${eventName}"? Esta ação é irreversível.`,
      type: 'danger',
      confirmText: 'Deletar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        try {
          await deleteInvite(inviteId);
          setSuccessMessage('Convite deletado com sucesso!');
          setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
          console.error('Erro ao deletar:', err);
        }
      },
    });
  };

  // Handle Export
  const handleExport = () => {
    if (invites.length === 0) {
      modal.openModal({
        title: 'Nenhum Convite',
        message: 'Você não tem convites para exportar.',
        type: 'info',
        confirmText: 'OK',
      });
      return;
    }

    try {
      exportInvitesAsJSON(invites);
      setSuccessMessage('Convites exportados com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Erro ao exportar:', err);
      modal.openModal({
        title: 'Erro',
        message: 'Erro ao exportar convites.',
        type: 'danger',
        confirmText: 'OK',
      });
    }
  };

  // Handle Import
  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedInvites = await importInvitesFromJSON(file);
      setSuccessMessage(`${importedInvites.length} convites importados com sucesso!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      modal.openModal({
        title: 'Erro na Importação',
        message: err.message,
        type: 'danger',
        confirmText: 'OK',
      });
    }

    // Reset input
    event.target.value = '';
  };

  // Handle Delete All
  const handleDeleteAll = () => {
    if (invites.length === 0) {
      modal.openModal({
        title: 'Nenhum Convite',
        message: 'Você não tem convites para deletar.',
        type: 'info',
        confirmText: 'OK',
      });
      return;
    }

    modal.openModal({
      title: 'Deletar Todos os Convites',
      message: `Tem certeza que deseja deletar TODOS os ${invites.length} convites? Esta ação é irreversível!`,
      type: 'danger',
      confirmText: 'Deletar Todos',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        try {
          for (const invite of invites) {
            await deleteInvite(invite.id);
          }
          setSuccessMessage('Todos os convites foram deletados!');
          setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
          console.error('Erro ao deletar todos:', err);
        }
      },
    });
  };

  return (
    <div className="manage-invites-page">
      <div className="manage-header">
        <h1>
          <ClipboardList size={32} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
          Gerenciar Convites
        </h1>
        <p>Administre, organize e exporte seus convites</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-error">
          <p>{error}</p>
          <button onClick={clearError}>Fechar</button>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="alert alert-success">
          <p>
            <CheckCircle size={18} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
            {successMessage}
          </p>
        </div>
      )}

      {/* Controls Section */}
      <div className="controls-section">
        <div className="search-bar">
          <div style={{ position: 'relative' }}>
            <Search 
              size={18} 
              style={{ 
                position: 'absolute', 
                left: '1rem', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }} 
            />
            <input
              type="text"
              placeholder="Buscar por evento, local ou convidado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              style={{ paddingLeft: '3rem' }}
            />
          </div>
        </div>

        <div className="filters-row">
          <div className="filter-group">
            <label htmlFor="filterType">Filtro:</label>
            <select
              id="filterType"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">Todos os Convites</option>
              <option value="upcoming">Próximos Eventos</option>
              <option value="past">Eventos Passados</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sortOrder">Ordenar:</label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="filter-select"
            >
              <option value="asc">Mais Antigos</option>
              <option value="desc">Mais Recentes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stat-box">
          <span className="stat-icon">
            <ClipboardList size={24} />
          </span>
          <div>
            <p className="stat-value">{invites.length}</p>
            <p className="stat-label">Total de Convites</p>
          </div>
        </div>
        <div className="stat-box">
          <span className="stat-icon">
            <FileText size={24} />
          </span>
          <div>
            <p className="stat-value">{filteredInvites.length}</p>
            <p className="stat-label">Resultados Encontrados</p>
          </div>
        </div>
        <div className="stat-box">
          <span className="stat-icon">
            <Calendar size={24} />
          </span>
          <div>
            <p className="stat-value">
              {invites.filter(inv => new Date(inv.eventDate) > new Date()).length}
            </p>
            <p className="stat-label">Próximos Eventos</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <label className="btn btn-secondary">
          <Upload size={18} />
          Importar
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
        </label>
        <button onClick={handleExport} className="btn btn-secondary">
          <Download size={18} />
          Exportar
        </button>
        <button onClick={handleDeleteAll} className="btn btn-danger">
          <Trash2 size={18} />
          Deletar Todos
        </button>
      </div>

      {/* Content */}
      {filteredInvites.length === 0 ? (
        <div className="empty-state">
          <p className="empty-icon">
            <SearchX size={48} />
          </p>
          <h3>Nenhum Convite Encontrado</h3>
          <p>
            {searchTerm
              ? 'Nenhum convite corresponde à sua busca'
              : 'Comece criando seu primeiro convite'}
          </p>
        </div>
      ) : (
        <div className="invites-list">
          <h2 className="list-title">
            {filteredInvites.length} Convite{filteredInvites.length !== 1 ? 's' : ''}
          </h2>
          <div className="invites-grid">
            {filteredInvites.map(invite => (
              <InviteCard
                key={invite.id}
                invite={invite}
                onPreview={() => {
                  // Será implementado com rota
                }}
                onDelete={() => handleDeleteClick(invite.id, invite.eventName)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
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