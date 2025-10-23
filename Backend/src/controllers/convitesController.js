const Convite = require('../models/Convite');

exports.criarConvite = async (req, res) => {
  try {
    const { nome_convidado1, nome_convidado2 } = req.body;
    
    if (!nome_convidado1) {
      return res.status(400).json({ 
        error: 'Nome do primeiro convidado é obrigatório' 
      });
    }

    const resultado = await Convite.criar(nome_convidado1, nome_convidado2);
    
    res.status(201).json({
      message: 'Convite criado com sucesso',
      convite: resultado
    });
  } catch (err) {
    console.error('Erro ao criar convite:', err);
    res.status(500).json({ 
      error: err.message 
    });
  }
};

exports.validarConvite = async (req, res) => {
  try {
    const { qrCode } = req.params;
    const convite = await Convite.buscarPorQRCode(qrCode);

    if (!convite) {
      return res.status(404).json({ 
        valido: false, 
        mensagem: 'Convite não encontrado' 
      });
    }

    if (convite.utilizado) {
      return res.json({ 
        valido: false, 
        mensagem: 'Convite já foi utilizado' 
      });
    }

    res.json({
      valido: true,
      convite: {
        nome_convidado1: convite.nome_convidado1,
        nome_convidado2: convite.nome_convidado2,
        data_criacao: convite.data_criacao
      }
    });
  } catch (err) {
    console.error('Erro ao validar convite:', err);
    res.status(500).json({ 
      error: err.message 
    });
  }
};

exports.utilizarConvite = async (req, res) => {
  try {
    const { qrCode } = req.params;
    const changes = await Convite.marcarComoUtilizado(qrCode);

    if (changes === 0) {
      return res.status(404).json({ 
        error: 'Convite não encontrado ou já utilizado' 
      });
    }

    res.json({ 
      message: 'Convite marcado como utilizado com sucesso' 
    });
  } catch (err) {
    console.error('Erro ao utilizar convite:', err);
    res.status(500).json({ 
      error: err.message 
    });
  }
};