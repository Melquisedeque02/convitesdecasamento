// src/pages/AboutPage.jsx
import React from 'react';
import { 
  Sparkles, 
  UserPlus, 
  QrCode, 
  Share2, 
  Download, 
  Edit, 
  Trash2,
  CheckCircle,
  Info,
  Mail,
  Smartphone
} from 'lucide-react';
import './Sobre.css';

function AboutPage() {
  const features = [
    {
      icon: <UserPlus size={24} />,
      title: 'Criação Fácil',
      description: 'Crie convites digitais personalizados em minutos'
    },
    {
      icon: <QrCode size={24} />,
      title: 'QR Code Automático',
      description: 'Cada convite gera um QR Code único para compartilhamento'
    },
    {
      icon: <Share2 size={24} />,
      title: 'Compartilhamento Rápido',
      description: 'Envie por WhatsApp, email ou redes sociais'
    },
    {
      icon: <Download size={24} />,
      title: 'Download de Imagem',
      description: 'Baixe seus convites como imagem PNG'
    }
  ];

  const steps = [
    {
      number: '1',
      icon: <UserPlus size={32} />,
      title: 'Criar um Convite',
      description: 'Clique em "Criar Convite" no menu superior',
      details: [
        'Preencha os dados do evento (nome, data, horário)',
        'Adicione o local e descrição',
        'Escolha o tipo de evento',
        'Clique em "Criar Convite"'
      ]
    },
    {
      number: '2',
      icon: <Edit size={32} />,
      title: 'Visualizar e Editar',
      description: 'Acesse "Meus Convites" para ver todos os seus convites',
      details: [
        'Clique em "Visualizar" para ver o convite completo',
        'Use o QR Code para compartilhar facilmente',
        'Baixe a imagem do convite',
        'Edite ou delete conforme necessário'
      ]
    },
    {
      number: '3',
      icon: <Share2 size={32} />,
      title: 'Compartilhar',
      description: 'Envie seus convites para os convidados',
      details: [
        'Compartilhe o link direto do convite',
        'Envie o QR Code por WhatsApp',
        'Baixe e envie a imagem',
        'Os convidados podem visualizar sem cadastro'
      ]
    },
    {
      number: '4',
      icon: <Download size={32} />,
      title: 'Gerenciar',
      description: 'Organize todos os seus convites em um só lugar',
      details: [
        'Busque convites por nome ou local',
        'Filtre por eventos futuros ou passados',
        'Exporte todos os convites em JSON',
        'Importe convites salvos anteriormente'
      ]
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-icon">
            <Sparkles size={48} />
          </div>
          <h1>Digital Invites</h1>
          <p className="hero-subtitle">
            Crie e gerencie convites digitais com QR Code de forma simples e elegante
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Recursos Principais</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How to Use Section */}
      <section className="instructions-section">
        <h2 className="section-title">Como Usar</h2>
        <p className="section-description">
          Siga estes passos simples para criar e compartilhar seus convites digitais
        </p>

        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-header">
                <div className="step-number">{step.number}</div>
                <div className="step-icon">{step.icon}</div>
              </div>
              <div className="step-content">
                <h3>{step.title}</h3>
                <p className="step-description">{step.description}</p>
                <ul className="step-details">
                  {step.details.map((detail, idx) => (
                    <li key={idx}>
                      <CheckCircle size={16} />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tips Section */}
      <section className="tips-section">
        <div className="tips-card">
          <div className="tips-icon">
            <Info size={32} />
          </div>
          <h2>Dicas Úteis</h2>
          <ul className="tips-list">
            <li>
              <Smartphone size={18} />
              <div>
                <strong>QR Code:</strong> Os convidados podem escanear o QR Code com a câmera do celular para acessar o convite instantaneamente
              </div>
            </li>
            <li>
              <Download size={18} />
              <div>
                <strong>Exportar Dados:</strong> Faça backup dos seus convites usando a função "Exportar" no menu Gerenciar
              </div>
            </li>
            <li>
              <Edit size={18} />
              <div>
                <strong>Edição:</strong> Você pode editar os detalhes do convite a qualquer momento antes do evento
              </div>
            </li>
            <li>
              <Trash2 size={18} />
              <div>
                <strong>Organização:</strong> Delete convites antigos para manter sua lista organizada
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="contact-card">
          <div className="contact-icon">
            <Mail size={40} />
          </div>
          <h2>Precisa de Ajuda?</h2>
          <p>
            Entre em contato conosco se tiver dúvidas ou sugestões
          </p>
          <a href="#contato" className="contact-button">
            <Mail size={18} />
            Entrar em Contato
          </a>
        </div>
      </section>

      {/* Footer Info */}
      <section className="info-section">
        <div className="info-content">
          <h3>Sobre o Projeto</h3>
          <p>
            Digital Invites é uma aplicação web moderna para criação e gerenciamento de convites digitais. 
            Desenvolvida com React e armazenamento local, oferece uma experiência simples e eficiente 
            para criar convites personalizados com QR Code.
          </p>
          <p>
            Todos os seus dados são armazenados localmente no seu navegador, garantindo privacidade e 
            acesso offline aos seus convites.
          </p>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;