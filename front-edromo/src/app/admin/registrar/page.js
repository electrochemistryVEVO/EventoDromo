'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useCreateAdmin } from './controller'

export default function RegistrarAdminPage() {
  const {
    form,
    isSubmitting,
    error,
    success,
    handleChange,
    handleSubmit,
    setSuccess
  } = useCreateAdmin()
  const router = useRouter()

  React.useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false)
        router.push('/admin/dashboard')
      }, 1500)
    }
  }, [success, router, setSuccess])

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto rounded-lg p-6 bg-[#EAFDF8] border border-[#DFF6EE] shadow-sm">
        <header className="flex items-center gap-3 mb-6">
          <svg className="w-8 h-8 text-[#00C49A]" viewBox="0 0 24 24" fill="none">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#00C49A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="7" r="4" stroke="#00C49A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h1 className="text-2xl font-semibold">Crear cuenta de administrador</h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombres *</label>
            <input
              placeholder="Ej: Juan Carlos"
              value={form.nombres}
              onChange={(e) => handleChange('nombres', e.target.value)}
              className="w-full border rounded px-3 py-2 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Apellidos *</label>
            <input
              placeholder="Ej: Pérez García"
              value={form.apellidos}
              onChange={(e) => handleChange('apellidos', e.target.value)}
              className="w-full border rounded px-3 py-2 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Correo electrónico *</label>
            <input
              type="email"
              placeholder="Ej: admin@eventodromo.com"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full border rounded px-3 py-2 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contraseña *</label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className="w-full border rounded px-3 py-2 bg-white"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">Administrador creado correctamente</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#00C49A] text-white font-bold px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <span className="text-2xl leading-none">+</span>
            <span>Crear Administrador</span>
          </button>
        </form>
      </div>
    </div>
  )
}