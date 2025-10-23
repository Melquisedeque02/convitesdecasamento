// src/pages/HomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvite } from '../hooks/useInvite';
import { useModal } from '../hooks/useModal';
import Modal from '../components/Common/Modal';
import InviteCard from '../components/Invite/InviteCard';
import InviteStats from '../components/Invite/InviteStats';
import { generateStats } from '../services/inviteService';
import { Sparkles, Plus } from 'lucide-react';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const { invites, deleteInvite, error, clearError } = useInvite();
  const modal = useModal();

  const handleDeleteClick = (inviteId, eventName) => {
    modal.openModal({
      title: 'Deletar Convite',
      message: `Tem certeza que deseja deletar o convite "${eventName}"?`,
      type: 'danger',
      confirmText: 'Deletar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        try {
          await deleteInvite(inviteId);
        } catch (err) {
          console.error('Erro ao deletar:', err);
        }
      },
    });
  };

  const handlePreviewClick = (inviteId) => {
    navigate(`/convite/${inviteId}`);
  };

  const stats = generateStats(invites);

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>
          <Sparkles size={32} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle', color: '#d4af37' }} />
          Meus Convites
        </h1>
        <p>Gerencie seus convites digitais com QR Code</p>
      </div>

      {error && (
        <div className="error-alert">
          <p>{error}</p>
          <button onClick={clearError}>Fechar</button>
        </div>
      )}

      {invites.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum convite criado ainda</p>
          <button
            onClick={() => navigate('/criar')}
            className="btn btn-primary"
          >
            <Plus size={18} />
            Criar Novo Convite
          </button>
        </div>
      ) : (
        <>
          <div className="home-actions">
            <button
              onClick={() => navigate('/criar')}
              className="btn btn-success"
            >
              <Plus size={18} />
              Criar Novo Convite
            </button>
          </div>

          <InviteStats stats={stats} />

          <div className="invites-grid">
            {invites.map(invite => (
              <InviteCard
                key={invite.id}
                invite={invite}
                onPreview={() => handlePreviewClick(invite.id)}
                onDelete={() => handleDeleteClick(invite.id, invite.eventName)}
              />
            ))}
          </div>
        </>
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

export default HomePage;