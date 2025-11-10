import { useState, useEffect } from "react";

export function useCreateLocal() {
  const [form, setForm] = useState({
    nombre: "",
    ciudadId: "",
    direccion: "",
    capacidad: "",
  });
  const [ciudades, setCiudades] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Obtener lista de ciudades (ajusta endpoint si tu API difiere)
    let mounted = true;
    async function fetchCiudades() {
      try {
        const res = await fetch("/api/Ciudad"); // o /api/Ciudades
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) setCiudades(Array.isArray(data) ? data : (data.data || []));
      } catch (e) {
        console.warn("No se pudieron cargar ciudades:", e);
      }
    }
    fetchCiudades();
    return () => (mounted = false);
  }, []);

  function handleChange(field, value) {
    setForm((s) => ({ ...s, [field]: value }));
  }

  function validate() {
    if (!form.nombre.trim()) return "Nombre del local es requerido";
    if (!form.ciudadId) return "Seleccione una ciudad";
    if (!form.direccion.trim()) return "Dirección es requerida";
    const cap = Number(String(form.capacidad).replace(/[,\.]/g, ""));
    if (!Number.isFinite(cap) || cap <= 0) return "Capacidad debe ser un número mayor a 0";
    return null;
  }

  async function handleSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    setError(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        nombre: form.nombre.trim(),
        ciudadId: Number(form.ciudadId),
        direccion: form.direccion.trim(),
        capacidad: Number(String(form.capacidad).replace(/[,\.]/g, "")),
      };
      const res = await fetch("/api/Local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => null);
        throw new Error(text || `Error ${res.status}`);
      }
      setSuccess(true);
      setForm({ nombre: "", ciudadId: "", direccion: "", capacidad: "" });
    } catch (err) {
      console.error("Crear local falló:", err);
      setError(err.message || "Error al crear local");
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    form,
    ciudades,
    isSubmitting,
    error,
    success,
    handleChange,
    handleSubmit,
    setForm,
    setError,
    setSuccess,
  };
}

export default useCreateLocal;