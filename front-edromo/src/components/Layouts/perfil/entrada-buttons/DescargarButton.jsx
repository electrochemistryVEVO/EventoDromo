import React from "react";

export default function DescargarButton() {
  return (
    <button
      type="button"
      className="mei-btn mei-btn--descargar"
      onClick={() => window.alert("Placeholder: Descargar modal")}
    >
      Descargar
    </button>
  );
}