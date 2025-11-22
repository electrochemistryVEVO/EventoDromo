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

  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null,
    data: null,
  });

  const closeModal = () =>
    setModalState({ isOpen: false, type: null, data: null });

  const handleAction = (type, event = null) => {
    const actions = {
      create: () => router.push("/admin/eventos/crear"),
      edit: () => router.push(`/admin/eventos/editar/${event.id}`),
      view: () => router.push(`/admin/eventos/ver/${event.id}`),
      upload: () => setModalState({ isOpen: true, type: "upload", data: null }),
      delete: () =>
        setModalState({ isOpen: true, type: "delete", data: event }),
    };

    actions[type]?.() || console.warn("Tipo de acción desconocida:", type);
  };

  const handleDeleteConfirm = async () => {
    if (!modalState.data?.id) return;

    console.log("Eliminando evento:", modalState.data.id);

    // Llamamos a la función del controller
    const result = await removeEvent(modalState.data.id);

    if (result.success) {
      alert("Evento eliminado correctamente");
      closeModal();
    } else {
      alert("Error al eliminar: " + result.message);
    }
  };

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
  };

  const modalTitle =
    modalState.type === "delete" ? "Confirmar Eliminación" : "Cargar CSV";
  const showPagination = pagination?.totalPages > 0 && !isLoading;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
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
      </div>
    </div>
  );
};

export default GestionEventosPage;
