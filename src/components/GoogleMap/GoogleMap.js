import React, { useState } from 'react';
import './GoogleMap.css';

const GoogleMap = ({ address, locationName, onLocationChange }) => {
  const [searchAddress, setSearchAddress] = useState(address || '');

  const getStaticMapUrl = (addr) => {
    if (!addr) return null;
    const encodedAddress = encodeURIComponent(addr);
    // Usando imagem estática do Google Maps (não precisa de API key para visualização simples)
    return `https://maps.googleapis.com/maps/api/staticmap?center=${encodedAddress}&zoom=15&size=400x200&markers=color:red%7C${encodedAddress}&key=AIzaSyDummyKey`;
  };

  const getNavigationUrl = (addr) => {
    if (!addr) return '#';
    const encodedAddress = encodeURIComponent(addr);
    return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  };

  const handleSaveAddress = () => {
    if (onLocationChange && searchAddress) {
      onLocationChange(searchAddress);
    }
  };

  return (
    <div className="google-map-component">
      <div className="map-address-input">
        <label className="map-label">
           Local do Evento
        </label>
        <div className="address-input-group">
          <input
            type="text"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            placeholder="Digite o endereço completo do evento"
            className="address-input"
          />
          <button
            type="button"
            onClick={handleSaveAddress}
            className="btn-save-address"
          >
            Salvar
          </button>
        </div>
      </div>

      {address && (
        <div className="map-preview">
          <div className="map-header">
            <span className="map-title"> {locationName || 'Local do Evento'}</span>
          </div>
          <div className="map-link-container">
            <a
              href={getNavigationUrl(address)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-navigate"
            >
               Abrir no Google Maps
            </a>
            <p className="map-address-display">{address}</p>
          </div>
        </div>
      )}

      {!address && (
        <div className="map-tip">
          <span className="tip-icon"></span>
          <span className="tip-text">
            Adicione o endereço do evento para que os convidados possam ver o local
          </span>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;