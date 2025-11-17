/**
 * @file Pagination.jsx
 * @description Componente para la navegación de páginas.
 */

import React from "react";
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems, onItemsPerPageChange }) => {
  // Generar números de página a mostrar
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Si hay pocas páginas, mostrarlas todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar páginas con elipsis
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };
  
  const pageNumbers = getPageNumbers();
  
  return (
    <>
      {/* Selector de items por página y contador - Solo si está habilitado */}
      {onItemsPerPageChange && itemsPerPage && totalItems !== undefined && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <label htmlFor="items-per-page" className="text-sm text-gray-600">
              Eventos por página:
            </label>
            <select
              id="items-per-page"
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-600">
              Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems}
            </span>
          </div>
        </div>
      )}
      
      {/* Controles de paginación */}
      <nav className="pagination-container">
        <button 
          className="pagination-arrow" 
          aria-label="Página anterior"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
        >
          <FiChevronLeft />
        </button>
        
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                ...
              </span>
            );
          }
          
          return (
            <button
              key={page}
              className={`pagination-number ${page === currentPage ? 'active' : ''}`}
              aria-current={page === currentPage ? 'page' : undefined}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          );
        })}
        
        <button 
          className="pagination-arrow" 
          aria-label="Siguiente página"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
        >
          <FiChevronRight />
        </button>
      </nav>
    </>
  );
};

export default Pagination;
