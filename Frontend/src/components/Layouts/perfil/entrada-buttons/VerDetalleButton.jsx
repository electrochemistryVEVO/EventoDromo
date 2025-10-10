import React from "react";

export default function VerDetalleButton() {
  return (
    <button
      type="button"
      className="mei-btn mei-btn--ver"
      onClick={() => window.alert("Placeholder: Ver detalle modal")}
    >
      Ver detalle
    </button>
  );
}