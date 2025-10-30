import React, { useState } from 'react';
import Modal from '../components/Common/Modal';
import { useModal } from '../hooks/useModal';
import QRCodeGenerator from '../components/QRcode/qrcodeGenerator';
import ApiService from '../services/api';
import './criarPage.css';

const CriarPage = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    eventTime: '',
    eventLocation: '',
    guestName1: '',
    guestName2: '',
    description: '',
  });

  const [conviteCriado, setConviteCriado] = useState(null);
  const [loading, setLoading] = useState(false);
  const modal = useModal();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCriarConvite = async () => {
    // Validação básica
    if (!formData.guestName1.trim()) {
      modal.openModal({
        title: 'Campo Obrigatório',
        message: 'O nome do primeiro convidado é obrigatório',
        type: 'danger',
        confirmText: 'OK',
      });
      return;
    }

    setLoading(true);

    try {
      // Chamar a API do backend
      const response = await ApiService.criarConvite(formData);
      
      setConviteCriado(response.convite);
      
      modal.openModal({
        title: 'Sucesso!',
        message: 'Convite criado com sucesso! O QR Code foi gerado.',
        type: 'success',
        confirmText: 'OK',
      });

      // Limpar formulário
      setFormData({
        eventName: '',
        eventDate: '',
        eventTime: '',
        eventLocation: '',
        guestName1: '',
        guestName2: '',
        description: '',
      });

    } catch (error) {
      console.error('Erro ao criar convite:', error);
      modal.openModal({
        title: 'Erro',
        message: 'Erro ao criar convite. Tente novamente.',
        type: 'danger',
        confirmText: 'OK',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLimpar = () => {
    setFormData({
      eventName: '',
      eventDate: '',
      eventTime: '',
      eventLocation: '',
      guestName1: '',
      guestName2: '',
      description: '',
    });
    setConviteCriado(null);
  };

  return (
    <div className="criar-page">
      <div className="criar-container">
        <div className="form-section">
          <h2 className="form-title">Criar Convite</h2>
          <p className="form-subtitle">Preencha os dados do seu evento</p>
          
          <div className="form-card">
            {/* Campos do Evento */}
            <div className="form-group">
              <label htmlFor="eventName" className="form-label">Nome do Evento</label>
              <input
                id="eventName"
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleInputChange}
                placeholder="Ex: Casamento, Aniversário, Formatura..."
                className="form-input"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="eventDate" className="form-label">Data</label>
                <input
                  id="eventDate"
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="eventTime" className="form-label">Hora</label>
                <input
                  id="eventTime"
                  type="time"
                  name="eventTime"
                  value={formData.eventTime}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="eventLocation" className="form-label">Local do Evento</label>
              <input
                id="eventLocation"
                type="text"
                name="eventLocation"
                value={formData.eventLocation}
                onChange={handleInputChange}
                placeholder="Ex: Salão de Festas ABC, Rua X..."
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">Descrição</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Detalhes adicionais sobre o evento..."
                rows="3"
                className="form-textarea"
              />
            </div>

            {/* Convidados - CAMPOS OBRIGATÓRIOS PARA O BACKEND */}
            <div className="guests-section">
              <h3 className="guests-title">Convidados</h3>
              <p className="guests-subtitle">
                <strong>Primeiro convidado é obrigatório</strong>
              </p>
              
              <div className="form-group">
                <label htmlFor="guestName1" className="form-label">
                  Primeiro Convidado *
                </label>
                <input
                  id="guestName1"
                  type="text"
                  name="guestName1"
                  value={formData.guestName1}
                  onChange={handleInputChange}
                  placeholder="Nome completo (obrigatório)"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="guestName2" className="form-label">Segundo Convidado</label>
                <input
                  id="guestName2"
                  type="text"
                  name="guestName2"
                  value={formData.guestName2}
                  onChange={handleInputChange}
                  placeholder="Nome completo (opcional)"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                onClick={handleCriarConvite}
                className="btn btn-primary"
                disabled={loading || !formData.guestName1.trim()}
              >
                {loading ? 'Criando...' : (
                  <>
                    <span>✓</span>
                    Criar Convite
                  </>
                )}
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleLimpar}
                disabled={loading}
              >
                <span>✕</span>
                Limpar
              </button>
            </div>
          </div>
        </div>

        {/* QR Code Gerado */}
        {conviteCriado && (
          <div className="qr-section">
            <h3 className="qr-title">Convite Criado com Sucesso!</h3>
            <div className="qr-card">
              <div className="qr-code-container">
                <QRCodeGenerator 
                  data={conviteCriado.qr_code} 
                  size={200} 
                />
              </div>
              <div className="qr-info">
                <h4>Informações do Convite:</h4>
                <p><strong>Convidado 1:</strong> {conviteCriado.nome_convidado1}</p>
                {conviteCriado.nome_convidado2 && (
                  <p><strong>Convidado 2:</strong> {conviteCriado.nome_convidado2}</p>
                )}
                <p><strong>QR Code:</strong> {conviteCriado.qr_code}</p>
                <p><strong>ID:</strong> {conviteCriado.id}</p>
              </div>
            </div>
          </div>
        )}
      </div>

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
};

export default CriarPage;