'use client'

import { useState } from 'react'

export function useCreateAdmin() {
  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    password: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  function handleChange(field, value) {
    setForm((s) => ({ ...s, [field]: value }))
  }

  function validate() {
    if (!form.nombres.trim()) return 'Nombres es requerido'
    if (!form.apellidos.trim()) return 'Apellidos es requerido'
    if (!form.email.trim()) return 'Correo electrónico es requerido'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) return 'Correo electrónico inválido'
    if (!form.password) return 'Contraseña es requerida'
    if (form.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres'
    return null
  }

  async function handleSubmit(e) {
    if (e && e.preventDefault) e.preventDefault()
    setError(null)
    const v = validate()
    if (v) {
      setError(v)
      return
    }
    setIsSubmitting(true)
    try {
      const payload = {
        nombres: form.nombres.trim(),
        apellidos: form.apellidos.trim(),
        email: form.email.trim(),
        password: form.password
      }
      // Usar variable de entorno para la URL del backend
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Administrador/Registrar`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const text = await res.text().catch(() => null)
        throw new Error(text || `Error ${res.status}`)
      }
      setSuccess(true)
      setForm({ nombres: '', apellidos: '', email: '', password: '' })
    } catch (err) {
      console.error('Crear administrador falló:', err)
      setError(err.message || 'Error al crear administrador')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    form,
    isSubmitting,
    error,
    success,
    handleChange,
    handleSubmit,
    setSuccess,
    setError
  }
}

export default useCreateAdmin