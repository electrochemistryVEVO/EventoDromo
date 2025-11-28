"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export function useDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isOpenRef = useRef(false);

  // Sincronizar el ref con el state
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  const toggle = useCallback((e) => {
    e?.stopPropagation();
    e?.preventDefault();
    console.log('[useDropdown] Toggle clicked, current:', isOpenRef.current);
    setIsOpen((prev) => {
      const newValue = !prev;
      console.log('[useDropdown] New value:', newValue);
      return newValue;
    });
  }, []);

  const close = useCallback(() => {
    console.log('[useDropdown] Closing dropdown');
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    console.log('[useDropdown] Setting up click outside listener');
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        console.log('[useDropdown] Click outside detected');
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      console.log('[useDropdown] Cleanup click outside listener');
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return { isOpen, toggle, close, dropdownRef };
}
