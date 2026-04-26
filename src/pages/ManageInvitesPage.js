import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import QRCodeGenerator from '../components/QRcode/qrCodeGenerator';

const ManageInvitesPage = () => {
  const [convites, setConvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

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
      setErro('Erro ao carregar convites. Verifique se o backend está rodando.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUtilizar = async (qrCode) => {
    try {
      await ApiService.utilizarConvite(qrCode);
      carregarConvites(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao marcar como utilizado:', error);
    }
  };

  const handleDeletar = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este convite?')) {
      try {
        await ApiService.deletarConvite(id);
        carregarConvites();
      } catch (error) {
        console.error('Erro ao deletar:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading">Carregando convites...</div>;
  }

  return (
    <div className="manage-page">
      <div className="container">
        <h1>Gerenciar Convites</h1>
        
        {erro && (
          <div className="alert alert-error">{erro}</div>
        )}

        <div className="stats">
          <div className="stat-card">
            <h3>Total</h3>
            <p>{convites.length}</p>
          </div>
          <div className="stat-card">
            <h3>Válidos</h3>
            <p>{convites.filter(c => c.utilizado === 0).length}</p>
          </div>
          <div className="stat-card">
            <h3>Utilizados</h3>
            <p>{convites.filter(c => c.utilizado === 1).length}</p>
          </div>
        </div>

        <div className="convites-list">
          {convites.length === 0 ? (
            <p>Nenhum convite criado ainda.</p>
          ) : (
            convites.map(convite => (
              <div key={convite.id} className="convite-card">
                <div className="qr-mini">
                  <QRCodeGenerator data={convite.qr_code} size={80} />
                </div>
                <div className="info">
                  <h3>{convite.nome_convidado1}</h3>
                  {convite.nome_convidado2 && (
                    <p>& {convite.nome_convidado2}</p>
                  )}
                  <p className="status">
                    Status: {convite.utilizado === 1 ? '❌ Utilizado' : '✅ Válido'}
                  </p>
                  <p className="date">
                    Criado: {new Date(convite.data_criacao).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="code">
                    Código: {convite.qr_code}
                  </p>
                </div>
                <div className="actions">
                  {convite.utilizado === 0 && (
                    <button onClick={() => handleUtilizar(convite.qr_code)}>
                      Marcar como Utilizado
                    </button>
                  )}
                  <button onClick={() => handleDeletar(convite.id)} className="danger">
                      Deletar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default ManageInvitesPage;