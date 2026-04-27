import React from 'react';
import { Link } from 'react-router-dom';  // ← ADICIONE ESTA LINHA
import './HomePage.css';

const Home = () => {
  return (
    <div className="home-page">
      <div className="home-container">
        <div className="hero-section">
          <div className="hero-icon">✦</div>
          <h1>QR Invite</h1>
          <p>Convites digitais elegantes com validação por QR Code</p>
          <div className="hero-buttons">
            <Link to="/criar" className="btn btn-primary">
              Criar Convite
            </Link>
            <Link to="/scanner" className="btn btn-outline">
              Validar Convite
            </Link>
          </div>
        </div>

        <div className="features-section">
          <div className="feature-card">
            <div className="feature-icon"></div>
            <h3>QR Code Único</h3>
            <p>Cada convite possui um QR Code exclusivo e intransferível</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"></div>
            <h3>Validação Segura</h3>
            <p>Sistema de validação em tempo real na entrada do evento</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"></div>
            <h3>Painel de Leitura</h3>
            <p>Interface otimizada para validação em dispositivos móveis</p>
          </div>
        </div>

        <div className="about-preview">
          <h2>Sobre o Sistema</h2>
          <p>
            QR Invite é uma plataforma moderna para criação e gestão de convites digitais. 
            Com tecnologia de QR Code, garantimos segurança e praticidade na validação de 
            convidados em eventos como casamentos, formaturas e aniversários.
          </p>
          <Link to="/sobre" className="btn-link">
            Saiba mais →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;