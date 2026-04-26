import React, { useState } from 'react';
import ApiService from '../services/api';
import QRCodeGenerator from '../components/QRcode/qrCodeGenerator';

const CriarPage = () => {
  const [formData, setFormData] = useState({
    guestName1: '',
    guestName2: '',
    eventName: '',
    eventDate: '',
    eventTime: '',
    eventLocation: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [conviteCriado, setConviteCriado] = useState(null);
  const [erro, setErro] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.guestName1.trim()) {
      setErro('Nome do primeiro convidado é obrigatório');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      const response = await ApiService.criarConvite({
        guestName1: formData.guestName1,
        guestName2: formData.guestName2
      });
      
      setConviteCriado(response.convite);
      
      // Limpar formulário
      setFormData({
        guestName1: '',
        guestName2: '',
        eventName: '',
        eventDate: '',
        eventTime: '',
        eventLocation: ''
      });
      
    } catch (error) {
      setErro('Erro ao criar convite. Verifique se o backend está rodando.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="criar-page">
      <div className="container">
        <h1>Criar Novo Convite</h1>
        
        {erro && (
          <div className="alert alert-error">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome do Convidado 1 *</label>
            <input
              type="text"
              name="guestName1"
              value={formData.guestName1}
              onChange={handleChange}
              placeholder="Ex: João Silva"
              required
            />
          </div>

          <div className="form-group">
            <label>Nome do Convidado 2 (opcional)</label>
            <input
              type="text"
              name="guestName2"
              value={formData.guestName2}
              onChange={handleChange}
              placeholder="Ex: Maria Silva"
            />
          </div>

          <div className="form-group">
            <label>Nome do Evento</label>
            <input
              type="text"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
              placeholder="Ex: Casamento João & Maria"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Data</label>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Hora</label>
              <input
                type="time"
                name="eventTime"
                value={formData.eventTime}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Local</label>
            <input
              type="text"
              name="eventLocation"
              value={formData.eventLocation}
              onChange={handleChange}
              placeholder="Endereço do evento"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Criando...' : 'Criar Convite'}
          </button>
        </form>

        {conviteCriado && (
          <div className="convite-criado">
            <h2>Convite Criado com Sucesso!</h2>
            <div className="qr-area">
              <QRCodeGenerator data={conviteCriado.qrCode} size={200} />
            </div>
            <div className="info">
              <p><strong>Código:</strong> {conviteCriado.qrCode}</p>
              <p><strong>Convidado:</strong> {conviteCriado.nome_convidado1}</p>
              {conviteCriado.nome_convidado2 && (
                <p><strong>Acompanhante:</strong> {conviteCriado.nome_convidado2}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CriarPage;