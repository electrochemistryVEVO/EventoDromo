import React from 'react';
import PropTypes from 'prop-types';
import { FiUpload, FiDownload } from 'react-icons/fi';

const LocalUploadCSVModal = ({ 
  isOpen, 
  onClose, 
  uploadStep, 
  setUploadStep,
  selectedFile, 
  setSelectedFile,
  uploadErrors,
  setUploadErrors,
  onUpload,
  isProcessing 
}) => {
  if (!isOpen) return null;

  const handleDownloadTemplate = () => {
    const csvContent = [
      'nombre_local,ciudad,direccion,capacidad,imagen_url',
      'Teatro Municipal,Lima,Jiron Ica 377,800,https://ejemplo.com/teatro.jpg',
      'Estadio Monumental,Ate,Av. Javier Prado 7700,80000,https://ejemplo.com/estadio.jpg',
      'Arena 1,San Miguel,Circuito de Playas S/N,15000,',
      'Centro de Convenciones,Arequipa,Calle Bolivar 123,500,https://ejemplo.com/convenciones.jpg'
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'plantillaLocales.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClose = () => {
    onClose();
    setUploadStep(1);
    setSelectedFile(null);
    setUploadErrors([]);
  };

  return (
    <div className="fixed z-[999] inset-0 bg-black/50 grid h-screen w-screen place-items-center">
      <div className="relative max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        {/* Botón Cerrar */}
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Cerrar modal"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Título */}
        <div className="flex items-center gap-3 mb-6">
          <FiUpload className="text-3xl text-gray-700" />
          <h2 className="text-2xl font-bold text-gray-800">
            Cargar Locales por CSV
          </h2>
        </div>

        {/* Indicador de Pasos */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${uploadStep === 1 ? 'text-teal-600' : 'text-gray-400'}`}>
              Paso 1
            </span>
            <span className={`text-sm font-medium ${uploadStep === 2 ? 'text-teal-600' : 'text-gray-400'}`}>
              Paso 2
            </span>
          </div>
          <div className="relative">
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-teal-500 rounded-full transition-all duration-300"
                style={{ width: uploadStep === 1 ? '50%' : '100%' }}
              ></div>
            </div>
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-4 h-4 bg-teal-500 rounded-full"></div>
            <div className={`absolute top-1/2 right-0 transform -translate-y-1/2 w-4 h-4 rounded-full ${uploadStep === 2 ? 'bg-teal-500' : 'bg-gray-300'}`}></div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className={`text-sm ${uploadStep === 1 ? 'text-teal-600 font-medium' : 'text-gray-400'}`}>
              Descargar la plantilla
            </span>
            <span className={`text-sm ${uploadStep === 2 ? 'text-teal-600 font-medium' : 'text-gray-400'}`}>
              Cargar archivo
            </span>
          </div>
        </div>

        {/* Contenido del Paso 1 */}
        {uploadStep === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Panel de Límites Importantes */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-start gap-2 mb-4">
                  <svg className="w-5 h-5 text-gray-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
                    <line x1="12" y1="16" x2="12" y2="12" strokeWidth="2"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8" strokeWidth="2"></line>
                  </svg>
                  <h3 className="font-semibold text-gray-800">Límites importantes:</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold">•</span>
                    <span><strong>Dirección única:</strong> No se pueden repetir direcciones ya registradas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold">•</span>
                    <span><strong>Capacidad:</strong> Debe ser un número entero mayor a 0.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold">•</span>
                    <span><strong>Ciudad:</strong> Debe coincidir exactamente con las ciudades disponibles.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold">•</span>
                    <span><strong>Imagen:</strong> Debe ser una URL válida (https://...).</span>
                  </li>
                </ul>
              </div>

              {/* Panel de La plantilla incluye */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-start gap-2 mb-4">
                  <svg className="w-5 h-5 text-gray-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <h3 className="font-semibold text-gray-800">La plantilla incluye</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>Nombre del Local</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>Ciudad</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>Dirección</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>Capacidad</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>Imagen URL</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-between pt-4">
              <button 
                onClick={() => setUploadStep(2)}
                className="px-8 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Siguiente
              </button>
              <button 
                onClick={handleDownloadTemplate}
                className="px-8 py-2.5 text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center gap-2"
              >
                <FiDownload />
                Descarga Plantilla
              </button>
            </div>
          </div>
        )}

        {/* Contenido del Paso 2 */}
        {uploadStep === 2 && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-8 border-2 border-dashed border-gray-300 text-center">
              <FiUpload className="mx-auto text-5xl text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {selectedFile ? selectedFile.name : 'Arrastra tu archivo CSV aquí'}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {selectedFile ? 'Archivo seleccionado' : 'o haz clic para seleccionar un archivo'}
              </p>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                id="csv-upload"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                    setUploadErrors([]);
                  }
                }}
              />
              <label
                htmlFor="csv-upload"
                className="inline-block px-6 py-2.5 text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors font-medium cursor-pointer"
              >
                {selectedFile ? 'Cambiar archivo' : 'Seleccionar archivo'}
              </label>
            </div>

            {/* Mostrar errores de validación */}
            {uploadErrors.length > 0 && (
              <div className="mt-4 max-h-60 overflow-y-auto bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-2">
                  {uploadErrors.length} error{uploadErrors.length > 1 ? 'es' : ''} encontrado{uploadErrors.length > 1 ? 's' : ''}:
                </h3>
                <ul className="space-y-1 text-sm text-red-700">
                  {uploadErrors.slice(0, 10).map((error, idx) => (
                    <li key={idx}>• {error}</li>
                  ))}
                  {uploadErrors.length > 10 && (
                    <li className="font-medium">... y {uploadErrors.length - 10} errores más</li>
                  )}
                </ul>
              </div>
            )}

            {/* Botones */}
            <div className="flex justify-between pt-4">
              <button 
                onClick={() => {
                  setUploadStep(1);
                  setUploadErrors([]);
                }}
                className="px-8 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                disabled={isProcessing}
              >
                Anterior
              </button>
              <div className="flex gap-3">
                <button 
                  onClick={handleClose}
                  className="px-8 py-2.5 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  disabled={isProcessing}
                >
                  Cancelar
                </button>
                <button 
                  onClick={onUpload}
                  className="px-8 py-2.5 text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={!selectedFile || isProcessing}
                >
                  {isProcessing ? 'Procesando...' : 'Cargar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

LocalUploadCSVModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  uploadStep: PropTypes.number.isRequired,
  setUploadStep: PropTypes.func.isRequired,
  selectedFile: PropTypes.object,
  setSelectedFile: PropTypes.func.isRequired,
  uploadErrors: PropTypes.array.isRequired,
  setUploadErrors: PropTypes.func.isRequired,
  onUpload: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired,
};

export default LocalUploadCSVModal;
