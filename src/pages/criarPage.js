import React, { useState } from 'react';
import QRCodeGenerator from '../components/QRcode/QRCodeGenerator';
import GoogleMap from '../components/GoogleMap/GoogleMap';
import Cronograma from '../components/Cronograma/Cronograma';
import ManualConvidado from '../components/ManualConvidado/ManualConvidado';
import DeclaracaoNoivos from '../components/DeclaracaoNoivos/DeclaracaoNoivos';
import SugestoesPresentes from '../components/SugestoesPresentes/SugestoesPresentes';
import ApiService from '../services/api';
import './criarPage.css';

const CriarPage = () => {
  const [formData, setFormData] = useState({
    guestName1: '',
    guestName2: '',
    eventName: '',
    eventDate: '',
    eventTime: '',
    eventLocation: '',
    eventAddress: ''
  });
  
  const [cronogramaEventos, setCronogramaEventos] = useState([]);
  const [manualData, setManualData] = useState({
    dressCode: '',
    whatsapp: '',
    criancas: 'sim',
    estacionamento: '',
    alergias: '',
    observacoes: ''
  });
  const [declaracaoData, setDeclaracaoData] = useState({
    titulo: '',
    mensagem: '',
    frase: '',
    citacao: ''
  });
  const [presentesData, setPresentesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conviteCriado, setConviteCriado] = useState(null);
  const [erro, setErro] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLocationChange = (address) => {
    setFormData(prev => ({ ...prev, eventAddress: address }));
  };

  const handleCronogramaChange = (eventos) => {
    setCronogramaEventos(eventos);
  };

  const handleManualChange = (manual) => {
    setManualData(manual);
  };

  const handleDeclaracaoChange = (declaracao) => {
    setDeclaracaoData(declaracao);
  };

  const handlePresentesChange = (presentes) => {
    setPresentesData(presentes);
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
        guestName2: formData.guestName2,
        endereco: formData.eventAddress,
        nome_evento: formData.eventName,
        data_evento: formData.eventDate,
        hora_evento: formData.eventTime,
        cronograma: cronogramaEventos.length > 0 ? JSON.stringify(cronogramaEventos) : null,
        manual: JSON.stringify(manualData),
        declaracao: JSON.stringify(declaracaoData),
        presentes: presentesData.length > 0 ? JSON.stringify(presentesData) : null
      });
      
      setConviteCriado(response.convite);
      
      // Limpar formulário
      setFormData({
        guestName1: '',
        guestName2: '',
        eventName: '',
        eventDate: '',
        eventTime: '',
        eventLocation: '',
        eventAddress: ''
      });
      setCronogramaEventos([]);
      setManualData({
        dressCode: '',
        whatsapp: '',
        criancas: 'sim',
        estacionamento: '',
        alergias: '',
        observacoes: ''
      });
      setDeclaracaoData({
        titulo: '',
        mensagem: '',
        frase: '',
        citacao: ''
      });
      setPresentesData([]);
      
    } catch (error) {
      setErro('Erro ao criar convite. Verifique se o backend está rodando.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = async () => {
    if (!conviteCriado) return;
    
    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${conviteCriado.qrCode}&format=png&margin=15`;
      const link = document.createElement('a');
      link.href = qrUrl;
      link.download = `qr_code_${conviteCriado.nome_convidado1.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao baixar QR Code:', error);
      alert('Erro ao baixar QR Code');
    }
  };

  const downloadPDF = async () => {
    if (!conviteCriado) return;
    
    try {
      const { default: jsPDF } = await import('jspdf');
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      
      pdf.setFontSize(20);
      pdf.setTextColor(102, 126, 234);
      pdf.text('QR INVITE', pageWidth / 2, 30, { align: 'center' });
      
      pdf.setFontSize(14);
      pdf.setTextColor(60, 60, 60);
      pdf.text(`Convidado: ${conviteCriado.nome_convidado1}`, 20, 60);
      
      if (conviteCriado.nome_convidado2) {
        pdf.text(`Acompanhante: ${conviteCriado.nome_convidado2}`, 20, 75);
      }
      
      pdf.text(`Código: ${conviteCriado.qrCode}`, 20, 90);
      
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${conviteCriado.qrCode}&format=png&margin=10`;
      
      try {
        const qrSize = 80;
        const qrX = (pageWidth - qrSize) / 2;
        pdf.addImage(qrUrl, 'PNG', qrX, 110, qrSize, qrSize);
      } catch (error) {
        console.warn('Erro ao adicionar QR Code no PDF');
      }
      
      pdf.save(`convite_${conviteCriado.nome_convidado1.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
      alert('Erro ao baixar PDF');
    }
  };

  return (
    <div className="criar-page">
      <div className="criar-container">
        <div className="page-header">
          <h1>Criar Convite</h1>
          <p>Crie convites digitais personalizados com QR Code único</p>
        </div>

        <div className="form-card">
          <h2 className="form-title">Novo Convite</h2>
          <p className="form-subtitle">Preencha os dados do convidado e do evento</p>

          {erro && <div className="alert alert-error">{erro}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nome do Convidado 1</label>
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
              <label>Local do Evento</label>
              <input
                type="text"
                name="eventLocation"
                value={formData.eventLocation}
                onChange={handleChange}
                placeholder="Ex: Salão de Festas"
              />
            </div>

            <GoogleMap 
              address={formData.eventAddress}
              locationName={formData.eventName}
              onLocationChange={handleLocationChange}
            />

            <Cronograma 
              eventos={cronogramaEventos}
              onEventosChange={handleCronogramaChange}
            />

            <ManualConvidado 
              manual={manualData}
              onManualChange={handleManualChange}
            />

            <DeclaracaoNoivos 
              declaracao={declaracaoData}
              onDeclaracaoChange={handleDeclaracaoChange}
            />

            <SugestoesPresentes 
              presentes={presentesData}
              onPresentesChange={handlePresentesChange}
            />

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <><span className="spinner-small"></span> Criando...</> : <> Criar Convite</>}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => {
                setFormData({
                  guestName1: '', guestName2: '', eventName: '', eventDate: '', eventTime: '', eventLocation: '', eventAddress: ''
                });
                setCronogramaEventos([]);
                setManualData({
                  dressCode: '', whatsapp: '', criancas: 'sim', estacionamento: '', alergias: '', observacoes: ''
                });
                setDeclaracaoData({
                  titulo: '', mensagem: '', frase: '', citacao: ''
                });
                setPresentesData([]);
              }}>
                Limpar
              </button>
            </div>
          </form>
        </div>

        {conviteCriado && (
          <div className="qr-section">
            <div className="qr-card">
              <div className="qr-header">
                <h3 className="qr-title">Convite Criado com Sucesso!</h3>
                <p className="qr-subtitle">Seu convite está pronto para ser compartilhado</p>
              </div>
              <div className="qr-code-container">
                <QRCodeGenerator data={conviteCriado.qrCode} size={180} />
              </div>
              <div className="qr-info">
                <div className="info-row"><span className="info-label">Código:</span><span className="info-value">{conviteCriado.qrCode}</span></div>
                <div className="info-row"><span className="info-label">Convidado:</span><span className="info-value">{conviteCriado.nome_convidado1}</span></div>
                {conviteCriado.nome_convidado2 && <div className="info-row"><span className="info-label">Acompanhante:</span><span className="info-value">{conviteCriado.nome_convidado2}</span></div>}
                <div className="info-row"><span className="info-label">ID:</span><span className="info-value">#{conviteCriado.id}</span></div>
              </div>
              <div className="qr-actions">
                <button onClick={downloadQRCode} className="btn btn-outline">Baixar QR Code</button>
                <button onClick={downloadPDF} className="btn btn-primary">Baixar Convite (PDF)</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CriarPage;