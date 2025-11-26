'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix para los íconos de Leaflet en Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/**
 * Componente interno que maneja los clicks en el mapa
 */
function MapClickHandler({ onLocationSelect, markerPosition, setMarkerPosition }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setMarkerPosition({ lat, lng });

      // Geocodificación inversa con Nominatim
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=es`
        );
        const data = await response.json();
        
        const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        // Usar OpenStreetMap para el iframe (gratuito, sin API key)
        const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`;
        const googleMapsUrl = `<iframe src="${mapUrl}" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`;

        onLocationSelect({
          lat,
          lng,
          address,
          googleMapsUrl
        });
      } catch (error) {
        console.error('Error en geocodificación:', error);
        const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`;
        const googleMapsUrl = `<iframe src="${mapUrl}" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`;
        onLocationSelect({
          lat,
          lng,
          address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          googleMapsUrl
        });
      }
    },
  });

  return markerPosition ? <Marker position={markerPosition} /> : null;
}

/**
 * Componente de búsqueda de direcciones con Nominatim
 */
function AddressSearch({ onAddressSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Búsqueda automática con debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        // Búsqueda con Nominatim, limitada a Perú
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=pe&limit=5&accept-language=es`
        );
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error('Error en búsqueda:', error);
      } finally {
        setIsSearching(false);
      }
    }, 800); // 800ms de debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Ya no hace nada, la búsqueda es automática
  };

  const handleSelectResult = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`;
    const googleMapsUrl = `<iframe src="${mapUrl}" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`;
    
    onAddressSelect({
      lat,
      lng,
      address: result.display_name,
      googleMapsUrl
    });
    
    setSearchResults([]);
    setSearchQuery('');
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch(e);
            }
          }}
          placeholder="Buscar dirección en Perú..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00C49A] focus:border-transparent outline-none"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={isSearching}
          className="px-4 py-2 bg-[#00C49A] text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-all"
        >
          {isSearching ? '🔍' : 'Buscar'}
        </button>
      </div>

      {searchResults.length > 0 && (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {searchResults.map((result, index) => (
            <button
              key={index}
              onClick={() => handleSelectResult(result)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-200 last:border-b-0 transition-colors"
            >
              <p className="text-sm text-gray-800">{result.display_name}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Componente principal de selección de ubicación con mapa
 */
export default function MapLocationPicker({ 
  onLocationSelect, 
  initialLocation = null,
  initialAddress = ''
}) {
  const defaultCenter = initialLocation || { lat: -12.046374, lng: -77.042793 }; // Lima, Perú
  const [markerPosition, setMarkerPosition] = useState(initialLocation);
  const [selectedAddress, setSelectedAddress] = useState(initialAddress);
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  const handleLocationChange = useCallback((locationData) => {
    setMarkerPosition({ lat: locationData.lat, lng: locationData.lng });
    setSelectedAddress(locationData.address);
    setMapCenter({ lat: locationData.lat, lng: locationData.lng });
    onLocationSelect(locationData);
  }, [onLocationSelect]);

  return (
    <div className="space-y-4">
      {/* Buscador de direcciones */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          🔍 Buscar dirección
        </label>
        <AddressSearch onAddressSelect={handleLocationChange} />
        <p className="text-xs text-gray-500">
          Busca una dirección o haz clic directamente en el mapa para seleccionar la ubicación
        </p>
      </div>

      {/* Mapa */}
      <div className="relative" style={{ height: '400px', zIndex: 0 }}>
        <MapContainer
          center={mapCenter}
          zoom={15}
          style={{ height: '100%', width: '100%', borderRadius: '0.5rem', zIndex: 0 }}
          key={`${mapCenter.lat}-${mapCenter.lng}`} // Force re-render when center changes
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler 
            onLocationSelect={handleLocationChange}
            markerPosition={markerPosition}
            setMarkerPosition={setMarkerPosition}
          />
        </MapContainer>
      </div>

      {/* Tip de uso */}
      {!markerPosition && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Haz clic en el mapa o busca una dirección para seleccionar la ubicación del local
          </p>
        </div>
      )}
    </div>
  );
}
