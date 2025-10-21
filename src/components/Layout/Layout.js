// src/components/Layout/Layout.jsx
import React from 'react';
import Navbar from './Navbar';
import './Layout.css';

function Layout({ children }) {
  return (
    <div className="layout">
      <Navbar />

      <main className="layout-main">
        <div className="main-container">
          {children}
        </div>
      </main>

      <footer className="layout-footer">
        <div className="footer-container">
          <p>&copy; 2024 Digital Invites. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;