import React from 'react';
import QRCodeGenerator from '../QRcode/QRCodeGenerator';
import GoogleMap from '../GoogleMap/GoogleMap';
import Cronograma from '../Cronograma/Cronograma';
import ManualConvidado from '../ManualConvidado/ManualConvidado';
import './ConviteDetalhes.css';

const ConviteDetalhes = ({ convite, onClose, onDownload }) => {
  if (!convite) return null;

  let cronogramaData = null;
  if (convite.cronograma) {
    try { cronogramaData = JSON.parse(convite.cronograma); } catch (e) { console.error(e); }
  }

  let manualData = null;
  if (convite.manual) {
    try { manualData = JSON.parse(convite.manual); } catch (e) { console.error(e); }
  }

  const handleDownload = () => { if (onDownload) onDownload(convite); };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <div className="modal-header">
          <h2> Detalhes do Convite</h2>
          <div className={`status-badge ${convite.utilizado === 1 ? 'status-used' : 'status-valid'}`}>
            {convite.utilizado === 1 ? 'Utilizado' : 'Válido'}
          </div>
        </div>

        <div className="modal-body">
          {/* Convidados */}
          <div className="detalhes-section">
            <h3> Convidados</h3>
            <p><strong>Principal:</strong> {convite.nome_convidado1}</p>
            {convite.nome_convidado2 && <p><strong>Acompanhante:</strong> {convite.nome_convidado2}</p>}
          </div>

          {/* Evento */}
          {convite.nome_evento && (
            <div className="detalhes-section">
              <h3>🎊 Evento</h3>
              <p><strong>Nome:</strong> {convite.nome_evento}</p>
              {convite.data_evento && <p><strong>Data:</strong> {new Date(convite.data_evento).toLocaleDateString('pt-BR')}</p>}
              {convite.hora_evento && <p><strong>Hora:</strong> {convite.hora_evento}</p>}
            </div>
          )}

          {/* Local */}
          {convite.endereco && (
            <div className="detalhes-section">
              <h3> Local do Evento</h3>
              <GoogleMap address={convite.endereco} locationName={convite.nome_evento} />
            </div>
          )}

          {/* Cronograma */}
          {cronogramaData && cronogramaData.length > 0 && (
            <div className="detalhes-section">
              <Cronograma eventos={cronogramaData} isViewMode={true} />
            </div>
          )}

          {/* Manual do Convidado */}
          {manualData && (
            <div className="detalhes-section">
              <ManualConvidado manual={manualData} isViewMode={true} />
            </div>
          )}

          {/* QR Code */}
          <div className="detalhes-section qr-section-modal">
            <h3> QR Code de Validação</h3>
            <QRCodeGenerator data={convite.qr_code} size={120} />
            <p className="qr-code-text">{convite.qr_code}</p>
            <p className="qr-info-text">Apresente este QR Code na entrada do evento</p>
          </div>

          {/* Informações */}
          <div className="detalhes-section">
            <h3>ℹ Informações</h3>
            <p><strong>ID do Convite:</strong> #{convite.id}</p>
            <p><strong>Criado em:</strong> {new Date(convite.data_criacao).toLocaleDateString('pt-BR')} às {new Date(convite.data_criacao).toLocaleTimeString('pt-BR')}</p>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={handleDownload} className="btn btn-primary"> Baixar Convite (PDF)</button>
          <button onClick={onClose} className="btn btn-secondary">Fechar</button>
        </div>
      </div>
    </div>
  );
};

export default ConviteDetalhes;