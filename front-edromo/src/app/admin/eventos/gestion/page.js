"use client"; // Directiva necesaria en Next.js 13+ para componentes con interactividad

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEventManager } from "./controller"; // Ajusta la ruta si es necesario

// Importación de componentes
import EventFilters from "@/components/gestion-evento/EventFilters.jsx";
import EventsTable from "@/components/gestion-evento/EventsTable.jsx";
import Pagination from "@/components/gestion-evento/Pagination.jsx";
import ActionButton from "@/components/gestion-evento/ActionButton.jsx";
import Modal from "@/components/gestion-evento/Modal.jsx";

const GestionEventosPage = () => {
  const router = useRouter();
  // 1. Usamos el controlador (custom hook) para obtener toda la lógica y el estado.
  const {
    events,
    locales,
    eventStatuses,
    pagination,
    isLoading,
    error,
    filters,
    handleFilterChange,
    applyFilters,
    handlePageChange,
  } = useEventManager();

  // 2. Estado para manejar la visibilidad y el contenido del modal.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", data: null });
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null,
    data: null,
  });

  // 3. Cargar los eventos iniciales al montar la página.
  useEffect(() => {
    applyFilters();
  }, []); // El array vacío asegura que se ejecute solo la primera vez.

  // 4. Función para abrir el modal con contenido específico.
  const handleAction = (type, event = null) => {
    switch (type) {
      case "create":
        // Redirige a la página de creación
        router.push("/admin/eventos/crear");
        break;
      case "edit":
        // Redirige a la página de edición con el ID del evento
        router.push(`/admin/eventos/editar/${event.id}`);
        break;
      case "view":
        // Redirige a la página de detalles con el ID del evento
        router.push(`/admin/eventos/ver/${event.id}`);
        break;
      case "upload":
        // Abre el modal para Cargar CSV
        setModalState({ isOpen: true, type: "upload", data: null });
        break;
      case "delete":
        // Abre el modal de confirmación para eliminar
        setModalState({ isOpen: true, type: "delete", data: event });
        break;
      default:
        console.warn("Tipo de acción desconocida:", type);
    }
  };

  const handleDeleteConfirm = () => {
    console.log("Eliminando evento:", modalState.data.id);
    // Aquí iría la llamada al servicio para eliminar el evento
    closeModal();
    // Opcional: Volver a cargar los eventos después de eliminar
    // applyFilters();
  };

  // Función para renderizar el contenido del modal dinámicamente
  const renderModalContent = () => {
    if (!modalState.isOpen) return null;

    if (modalState.type === "upload") {
      return <p>Aquí irá el componente para subir archivos CSV.</p>;
    }

    if (modalState.type === "delete") {
      return (
        <div>
          <p>
            ¿Estás seguro de que deseas eliminar el evento{" "}
            <strong>"{modalState.data?.nombre}"</strong>?
          </p>
          <p className="text-sm text-red-600 mt-2">
            Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              Cancelar
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              Confirmar Eliminación
            </button>
          </div>
        </div>
      );
    }
    return null;
  };
  // Función para cerrar el modal.
  const closeModal = () => {
    setModalState({ isOpen: false, type: null, data: null });
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <main className="max-w-7xl mx-auto">
        {/* --- Encabezado de la Página --- */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            Gestión de Eventos
          </h1>
          <div className="flex items-center gap-3">
            <ActionButton
              text="Cargar CSV"
              iconSrc="/images/icon/upload-icon.png"
              variant="secondary"
              onClick={() => handleAction("upload")}
            />
            <ActionButton
              text="Crear evento"
              iconSrc="/images/icon/plus-icon.png"
              variant="primary"
              onClick={() => handleAction("create")}
            />
          </div>
        </header>

        {/* --- Componente de Filtros --- */}
        <EventFilters
          filters={filters}
          locales={locales}
          statuses={eventStatuses}
          onFilterChange={handleFilterChange}
          onApplyFilters={applyFilters}
        />

        {/* --- Componente de la Tabla de Eventos --- */}
        <div className="mt-6">
          <EventsTable
            events={events}
            isLoading={isLoading}
            error={error}
            onActionClick={handleAction}
          />
        </div>

        {/* --- Componente de Paginación --- */}
        {pagination && pagination.totalPages > 1 && !isLoading && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}

        {/* --- Componente Modal --- */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={
            modalState.type === "delete"
              ? "Confirmar Eliminación"
              : "Cargar CSV"
          }
        >
          {/* CAMBIO: Renderiza contenido dinámico */}
          {renderModalContent()}
        </Modal>
      </main>
    </div>
  );
};

export default GestionEventosPage;
