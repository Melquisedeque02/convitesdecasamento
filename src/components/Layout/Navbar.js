// src/components/Layout/Navbar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  Home, 
  Plus, 
  ClipboardList, 
  Info, 
  Mail, 
  Moon, 
  User,
  Camera
} from 'lucide-react';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">
            <Sparkles size={24} />
          </span>
          <span className="logo-text">Digital Invites</span>
        </Link>

        {/* Hamburger Menu */}
        <button
          className={`hamburger ${isOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* Navigation Menu */}
        <ul className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <li className="navbar-item">
            <Link
              to="/"
              className={`navbar-link ${isActive('/') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <span className="nav-icon">
                <Home size={18} />
              </span>
              <span>Início</span>
            </Link>
          </li>

          <li className="navbar-item">
            <Link
              to="/criar"
              className={`navbar-link ${isActive('/criar') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <span className="nav-icon">
                <Plus size={18} />
              </span>
              <span>Criar Convite</span>
            </Link>
          </li>

          <li className="navbar-item">
            <Link
              to="/gerenciar"
              className={`navbar-link ${isActive('/gerenciar') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <span className="nav-icon">
                <ClipboardList size={18} />
              </span>
              <span>Gerenciar</span>
            </Link>
          </li>

          {/* NOVO BOTÃO SCANNER */}
          <li className="navbar-item">
            <Link
              to="/scanner"
              className={`navbar-link ${isActive('/scanner') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <span className="nav-icon">
                <Camera size={18} />
              </span>
              <span>Validar Convites</span>
            </Link>
          </li>

          {/* Separator */}
          <li className="navbar-separator"></li>

          {/* About Section */}
          <li className="navbar-item">
            <Link
              to="/sobre"
              className={`navbar-link ${isActive('/sobre') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <span className="nav-icon">
                <Info size={18} />
              </span>
              <span>Sobre</span>
            </Link>
          </li>

          <li className="navbar-item">
            <a
              href="#contato"
              className="navbar-link"
              onClick={closeMenu}
            >
              <span className="nav-icon">
                <Mail size={18} />
              </span>
              <span>Contato</span>
            </a>
          </li>
        </ul>

        {/* Right Section */}
        <div className="navbar-right">
          <button className="theme-toggle" aria-label="Toggle theme">
            <Moon size={18} />
          </button>
          <button className="user-button">
            <span className="user-icon">
              <User size={18} />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="navbar-overlay" onClick={closeMenu}></div>
      )}
    </nav>
  );
}

export default Navbar;