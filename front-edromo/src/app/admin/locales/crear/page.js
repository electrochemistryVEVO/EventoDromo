
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import useCreateLocal, { useCreateLocal as _u } from "./controller.js";
import { useCreateLocal as useHook } from "./controller.js";

export default function CrearLocalPage() {
  const {
    form,
    ciudades,
    isSubmitting,
    error,
    success,
    handleChange,
    handleSubmit,
    setSuccess,
  } = useHook();
  const router = useRouter();

  React.useEffect(() => {
    if (success) {
      // mostrar breve confirmación y navegar atrás
      setTimeout(() => {
        setSuccess(false);
        router.push("/admin/locales/gestion");
      }, 900);
    }
  }, [success, router, setSuccess]);

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-3xl mx-auto rounded-lg p-6 bg-[#EAFDF8] border border-[#DFF6EE] shadow-sm">
        <header className="flex items-center gap-3 mb-4">
          <svg className="w-8 h-8 text-[#00C49A]" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 7v7c0 5 9 7 9 7s9-2 9-7V7l-9-5z" stroke="#00C49A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h1 className="text-2xl font-semibold">Datos del Local</h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre del Local *</label>
            <input
              placeholder="Ej: Teatro Municipal"
              value={form.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
              className="w-full border rounded px-3 py-2 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Ciudad *</label>
            <select
              value={form.ciudadId}
              onChange={(e) => handleChange("ciudadId", e.target.value)}
              className="w-full border rounded px-3 py-2 bg-white"
            >
              <option value="">Selecciona una ciudad</option>
              {ciudades && ciudades.map((c) => (
                <option key={c.id ?? c.value} value={c.id ?? c.value}>{c.nombre ?? c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Dirección *</label>
            <input
              placeholder="Ej: Av. Principal 123"
              value={form.direccion}
              onChange={(e) => handleChange("direccion", e.target.value)}
              className="w-full border rounded px-3 py-2 bg-white"
            />
            <p className="text-xs text-gray-500 mt-1">La dirección debe ser única y no puede repetirse en el sistema</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Capacidad *</label>
            <input
              placeholder="Ej: 5,000"
              value={form.capacidad}
              onChange={(e) => handleChange("capacidad", e.target.value)}
              className="w-full border rounded px-3 py-2 bg-white"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">Local creado correctamente</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#00C49A] text-white font-bold px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <span className="text-2xl leading-none">+</span>
            <span>Crear Local</span>
          </button>
        </form>
      </div>
    </div>
  );
}