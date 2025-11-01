import React from "react";

const Paginador = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  const pageRange = 2; // Cuántos números mostrar alrededor de la página actual

  // Lógica para mostrar los números de página y los puntos suspensivos
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 || // Siempre mostrar la primera página
      i === totalPages || // Siempre mostrar la última página
      (i >= currentPage - pageRange && i <= currentPage + pageRange) // Mostrar páginas alrededor de la actual
    ) {
      pageNumbers.push(i);
    } else if (pageNumbers[pageNumbers.length - 1] !== '...') {
      pageNumbers.push('...');
    }
  }

  return (
    <nav className="flex items-center justify-center gap-2 mt-6">
      {/* Botón Anterior */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-bold"
      >
        &larr;
      </button>

      {pageNumbers.map((number, index) =>
        typeof number === 'number' ? (
          <button
            key={index}
            onClick={() => onPageChange(number)}
            className={`px-4 py-2 border rounded-md text-base font-medium ${currentPage === number
                ? 'bg-[#00C49A] text-white border-[#00C49A]'
                : 'border-gray-300 text-gray-600 hover:bg-gray-100'
              }`}
          >
            {number}
          </button>
        ) : (
          <span key={index} className="px-4 py-2 text-gray-500">...</span>
        )
      )}

      {/* Botón Siguiente */}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-bold">&rarr;</button>
    </nav>
  );
};

export default Paginador;