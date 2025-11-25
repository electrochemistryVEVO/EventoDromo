import React from "react";
import DetalleTransaccionModal from "./DetalleTransaccionModal";
import { useDetalleTransaccion } from "./DetalleTransaccionModal.controller";
import { useUser } from "@/context/UserContext";

export default function VerDetalleButton({ numeroTransaccion }) {
  const { user } = useUser();
  const { isOpen, detalle, loading, error, abrirDetalle, cerrarDetalle } = useDetalleTransaccion();

  const handleClick = () => {
    if (numeroTransaccion && user?.token) {
      abrirDetalle(numeroTransaccion, user.token);
    }
  };

  return (
    <>
      <button
        type="button"
        className="mei-btn mei-btn--ver"
        onClick={handleClick}
      >
        Ver detalle
      </button>

      <DetalleTransaccionModal
        isOpen={isOpen}
        onClose={cerrarDetalle}
        detalle={detalle}
        loading={loading}
        error={error}
      />
    </>
  );
}