// src/components/Layout/Navbar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Plus,
  ClipboardList,
  Info,
  Camera,
  CalendarCheck
} from 'lucide-react';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu  = () => setIsOpen(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-icon">✦</span>
          <span className="logo-text">Digital Invites</span>
        </Link>

        {/* Hamburger */}
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

          {/* Meus Convites — outlined pill */}
          <li className="navbar-item">
            <Link
              to="/"
              className={`navbar-link outlined-btn ${isActive('/') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <span className="nav-icon"><Home size={15} /></span>
              Meus Convites
            </Link>
          </li>

          {/* Criar Convite — CTA green pill */}
          <li className="navbar-item">
            <Link
              to="/criar"
              className={`navbar-link cta-btn ${isActive('/criar') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <span className="nav-icon"><Plus size={15} /></span>
              Criar Convite
            </Link>
          </li>

          {/* Separator */}
          <li className="navbar-separator"></li>

          {/* Gerenciar */}
          <li className="navbar-item">
            <Link
              to="/gerenciar"
              className={`navbar-link ${isActive('/gerenciar') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <span className="nav-icon"><ClipboardList size={15} /></span>
              Gerenciar
            </Link>
          </li>

          {/* Validar Convites */}
          <li className="navbar-item">
            <Link
              to="/scanner"
              className={`navbar-link ${isActive('/scanner') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <span className="nav-icon"><Camera size={15} /></span>
              Validar Convites
            </Link>
          </li>

          {/* Sobre */}
          <li className="navbar-item">
            <Link
              to="/sobre"
              className={`navbar-link ${isActive('/sobre') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <span className="nav-icon"><Info size={15} /></span>
              Sobre
            </Link>
          </li>

        </ul>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div className="navbar-overlay" onClick={closeMenu}></div>
      )}
    </nav>
  );
}

export default Navbar;