"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useEventManager } from "./controller";
import "@/css/adminEventos/gestionEventos.css";
import { FiPlus, FiUpload } from "react-icons/fi";

import EventFilters from "@/components/gestion-evento/EventFilters.jsx";
import EventsTable from "@/components/gestion-evento/EventsTable.jsx";
import Pagination from "@/components/gestion-evento/Pagination.jsx";
import Modal from "@/components/gestion-evento/Modal.jsx";
import EventUploadCSVModal from '@/components/modals/EventUploadCSVModal';
import EventCSVUploadSuccessModal from '@/components/modals/EventCSVUploadSuccessModal';
import EventCSVUploadErrorModal from '@/components/modals/EventCSVUploadErrorModal';

const GestionEventosPage = () => {
  const router = useRouter();
  const {
    events,
    locales,
    eventStatuses,
    pagination,
    isLoading,
    error,
    filters,
    removeEvent,
    handleFilterChange,
    applyFilters,
    handlePageChange,
  } = useEventManager();

  // Estado para controlar el modal
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null,
    data: null,
  });

  // CSV Upload States
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadStep, setUploadStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadErrors, setUploadErrors] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [uploadResult, setUploadResult] = useState({ success: 0, failed: 0, errors: [] });

  // 1️⃣ NUEVO: Estado local para controlar la carga específica del botón de eliminar
  const [isDeleting, setIsDeleting] = useState(false);

  const closeModal = () => {
    // Si se está eliminando, evitamos cerrar el modal accidentalmente
    if (isDeleting) return;
    setModalState({ isOpen: false, type: null, data: null });
  };

  const handleAction = (type, event = null) => {
    const actions = {
      create: () => router.push("/admin/eventos/crear"),
      edit: () => router.push(`/admin/eventos/editar/${event.id}`),
      view: () => router.push(`/admin/eventos/ver/${event.id}`),
      upload: () => setShowUploadModal(true),
      delete: () => setModalState({ isOpen: true, type: "delete", data: event }),
    };

    actions[type]?.() || console.warn("Tipo de acción desconocida:", type);
  };

  const handleDeleteConfirm = async () => {
    if (!modalState.data?.id) return;

    // 2️⃣ Iniciamos carga del botón
    setIsDeleting(true);

    // Esperamos a que el controller elimine Y recargue la tabla
    const result = await removeEvent(modalState.data.id);

    // 3️⃣ Terminamos carga
    setIsDeleting(false);

    if (result.success) {
      // 4️⃣ Primero cerramos el modal (actualizamos estado)
      closeModal();

      // 5️⃣ Usamos un pequeño timeout para el alert.
      // Esto permite que React desmonte el modal visualmente ANTES de que el alert congele la pantalla.
      setTimeout(() => {
        alert("Evento eliminado correctamente");
      }, 100);
    } else {
      alert("Error al eliminar: " + result.message);
    }
  };

  // Parsear línea de CSV manejando comillas
  const parseCSVLine = (line) => {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  };

  // Validar y cargar CSV
  const handleUploadCSV = async () => {
    if (!selectedFile) {
      alert('Por favor selecciona un archivo CSV');
      return;
    }
    
    setIsProcessing(true);
    setUploadErrors([]);
    
    try {
      const text = await selectedFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('El archivo está vacío o solo tiene encabezados');
      }
      
      // Validar headers
      const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim());
      const required = ['nombre', 'descripcion', 'local_id', 'tipo_evento_id', 'capacidad', 'fecha_publicacion', 'fecha_compra', 'horarios'];
      const missing = required.filter(h => !headers.includes(h));
      
      if (missing.length > 0) {
        throw new Error(`Faltan columnas: ${missing.join(', ')}`);
      }
      
      // Procesar filas
      const eventosData = [];
      const errors = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const row = {};
        headers.forEach((h, idx) => row[h] = values[idx] || '');
        
        const rowNum = i + 1;
        const rowErrors = [];
        
        // Validar campos básicos
        if (!row.nombre) rowErrors.push(`Fila ${rowNum}: Falta nombre`);
        if (!row.descripcion) rowErrors.push(`Fila ${rowNum}: Falta descripción`);
        
        const localId = parseInt(row.local_id);
        if (isNaN(localId) || localId <= 0) rowErrors.push(`Fila ${rowNum}: Local ID inválido`);
        
        const tipoEventoId = parseInt(row.tipo_evento_id);
        if (isNaN(tipoEventoId) || tipoEventoId <= 0) rowErrors.push(`Fila ${rowNum}: Tipo Evento ID inválido`);
        
        const capacidad = parseInt(row.capacidad);
        if (isNaN(capacidad) || capacidad <= 0) rowErrors.push(`Fila ${rowNum}: Capacidad inválida`);
        
        // Validar fechas
        if (!/^\d{4}-\d{2}-\d{2}$/.test(row.fecha_publicacion)) {
          rowErrors.push(`Fila ${rowNum}: Fecha de publicación inválida (formato: YYYY-MM-DD)`);
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(row.fecha_compra)) {
          rowErrors.push(`Fila ${rowNum}: Fecha de compra inválida (formato: YYYY-MM-DD)`);
        }
        
        // Validar horarios
        const horarios = row.horarios ? row.horarios.split('|').filter(h => h.trim()) : [];
        if (horarios.length === 0) {
          rowErrors.push(`Fila ${rowNum}: Debe haber al menos un horario`);
        }
        
        // Validar imagen URL (opcional)
        if (row.imagen_url && !/^https?:\/\//i.test(row.imagen_url)) {
          rowErrors.push(`Fila ${rowNum}: URL de imagen inválida`);
        }
        
        // Procesar entradas (al menos una entrada es obligatoria)
        const entradas = [];
        let entradaIndex = 1;
        while (row[`entrada_nombre_${entradaIndex}`]) {
          const entrada = {
            nombre: row[`entrada_nombre_${entradaIndex}`],
            precio: parseFloat(row[`entrada_precio_${entradaIndex}`] || 0),
            cantidad: parseInt(row[`entrada_cantidad_${entradaIndex}`] || 0),
            limiteCompra: parseInt(row[`entrada_limite_${entradaIndex}`] || 0),
            puntos: parseInt(row[`entrada_puntos_${entradaIndex}`] || 0)
          };
          
          if (!entrada.nombre) {
            rowErrors.push(`Fila ${rowNum}: Entrada ${entradaIndex} falta nombre`);
          }
          if (isNaN(entrada.precio) || entrada.precio < 0) {
            rowErrors.push(`Fila ${rowNum}: Entrada ${entradaIndex} precio inválido`);
          }
          if (isNaN(entrada.cantidad) || entrada.cantidad <= 0) {
            rowErrors.push(`Fila ${rowNum}: Entrada ${entradaIndex} cantidad inválida`);
          }
          if (isNaN(entrada.limiteCompra) || entrada.limiteCompra <= 0) {
            rowErrors.push(`Fila ${rowNum}: Entrada ${entradaIndex} límite inválido`);
          }
          
          entradas.push(entrada);
          entradaIndex++;
        }
        
        if (entradas.length === 0) {
          rowErrors.push(`Fila ${rowNum}: Debe haber al menos una entrada`);
        }
        
        if (rowErrors.length > 0) {
          errors.push(...rowErrors);
        } else {
          eventosData.push({
            nombre: row.nombre,
            descripcion: row.descripcion,
            localId: localId,
            tipoEventoId: tipoEventoId,
            capacidad: capacidad,
            fechaPublicacion: row.fecha_publicacion,
            fechaCompra: row.fecha_compra,
            imagenURL: row.imagen_url || '',
            horarios: horarios,
            entradas: entradas
          });
        }
      }
      
      // Si hay errores de validación, mostrarlos en el modal de carga
      if (errors.length > 0) {
        setUploadErrors(errors);
        setIsProcessing(false);
        return;
      }
      
      // Cargar al backend
      const token = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user'))?.token : null;
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }
      
      const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5189/api";
      
      const response = await fetch(`${BASE_API_URL}/Evento/EventoCrearMasivo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventos: eventosData })
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        // Cerrar modal de carga y mostrar modal de error
        setShowUploadModal(false);
        setUploadResult({ 
          success: result.data?.insertados || 0,
          failed: result.data?.fallidos || eventosData.length, 
          errors: result.data?.errores || [result.message || 'Error al cargar eventos al servidor'] 
        });
        setShowErrorModal(true);
        setIsProcessing(false);
        return;
      }
      
      const insertados = result.data?.insertados || 0;
      const fallidos = result.data?.fallidos || 0;
      
      // Recargar lista
      await applyFilters();
      
      // Cerrar modal de carga
      setShowUploadModal(false);
      setSelectedFile(null);
      setUploadStep(1);
      setUploadErrors([]);
      
      // Mostrar resultado apropiado
      if (fallidos > 0) {
        setUploadResult({ 
          success: insertados, 
          failed: fallidos, 
          errors: result.data?.errores || [] 
        });
        setShowErrorModal(true);
      } else {
        setUploadResult({ success: insertados, failed: 0, errors: [] });
        setShowSuccessModal(true);
      }
      
    } catch (error) {
      // Error general (archivo, formato, etc)
      setShowUploadModal(false);
      setUploadResult({ 
        success: 0, 
        failed: 0, 
        errors: [error.message] 
      });
      setShowErrorModal(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderModalContent = () => {
    if (!modalState.isOpen) return null;

    if (modalState.type === "delete") {
      return (
        <div>
          <p>
            ¿Estás seguro de que deseas eliminar el evento{" "}
            <strong>"{modalState.data?.nombre}"</strong>?
          </p>
          <p className="mt-2 text-sm text-red-600">
            Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={closeModal}
              className="px-4 py-2 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
              disabled={isDeleting} // Deshabilitar si está cargando
            >
              Cancelar
            </button>

            {/* 6️⃣ Botón con Feedback visual de carga */}
            <button
              onClick={handleDeleteConfirm}
              disabled={isDeleting} // Evita doble clic
              className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2 ${
                isDeleting
                  ? "bg-red-300 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {isDeleting ? (
                <>
                  {/* Spinner simple con CSS de Tailwind */}
                  <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                  Eliminando...
                </>
              ) : (
                "Confirmar Eliminación"
              )}
            </button>
          </div>
        </div>
      );
    }
  };

  const modalTitle =
    modalState.type === "delete" ? "Confirmar Eliminación" : "Cargar CSV";
  const showPagination = pagination?.totalPages > 0 && !isLoading;

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="page-container">
        <header className="page-header">
          <h1>Gestión de Eventos</h1>
          <div className="flex items-center gap-3">
            <button
              className="btn btn-secondary"
              onClick={() => handleAction("upload")}
            >
              <FiUpload /> Cargar CSV
            </button>
            <button
              className="btn btn-create"
              onClick={() => handleAction("create")}
            >
              <FiPlus /> Crear evento
            </button>
          </div>
        </header>

        <div className="content-wrapper">
          <EventFilters
            filters={filters}
            locales={locales}
            statuses={eventStatuses}
            onFilterChange={handleFilterChange}
            onApplyFilters={applyFilters}
          />

          <EventsTable
            events={events}
            isLoading={isLoading}
            error={error}
            onActionClick={handleAction}
          />

          {showPagination && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>

        <Modal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          title={modalTitle}
        >
          {renderModalContent()}
        </Modal>

        {/* --- Modal: Cargar CSV --- */}
        <EventUploadCSVModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          uploadStep={uploadStep}
          setUploadStep={setUploadStep}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          uploadErrors={uploadErrors}
          setUploadErrors={setUploadErrors}
          onUpload={handleUploadCSV}
          isProcessing={isProcessing}
        />

        {/* --- Modal: Éxito CSV --- */}
        <EventCSVUploadSuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            setUploadResult({ success: 0, failed: 0, errors: [] });
          }}
          count={uploadResult.success}
        />

        {/* --- Modal: Error CSV --- */}
        <EventCSVUploadErrorModal
          isOpen={showErrorModal}
          onClose={() => {
            setShowErrorModal(false);
            setShowUploadModal(true);
          }}
          errors={uploadResult.errors}
          failedCount={uploadResult.failed}
          successCount={uploadResult.success}
        />
      </div>
    </div>
  );
};

export default GestionEventosPage;
