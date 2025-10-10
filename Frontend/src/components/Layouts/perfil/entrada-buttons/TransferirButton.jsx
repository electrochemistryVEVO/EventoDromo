import React from "react";

export default function TransferirButton() {
  return (
    <button
      type="button"
      className="mei-btn mei-btn--transferir"
      onClick={() => window.alert("Placeholder: Transferir modal")}
    >
      Transferir
    </button>
  );
}