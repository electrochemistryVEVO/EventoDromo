// src/components/ForgotPasswordModal/ForgotPasswordModal.jsx
import { useState } from "react";
import styles from "./ForgotPasswordModal.module.css";
import { enviarCorreoRecuperacion } from "@/services/loginService";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' o 'error'
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setEmail("");
      setMessage("");
      setMessageType("");
      setIsLoading(false);
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      await enviarCorreoRecuperacion(email);
      setMessageType("success");
      setMessage(
        "Se ha enviado un enlace a tu correo electrónico para restablecer tu contraseña."
      );
    } catch (err) {
      setMessageType("error");
      setMessage(
        "El correo electrónico no está registrado. Por favor, verifica e intenta de nuevo."
      );
      console.error("Error capturado en el modal:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Recuperar Contraseña</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            ×
          </button>
        </div>

        {/* El mensaje de éxito o error se mostrará aquí, encima del formulario */}
        {message && (
          <div className={`${styles.message} ${styles[messageType]}`}>
            {message}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="recovery-email" className={styles.label}>
              Correo Electrónico
            </label>
            <input
              type="email"
              id="recovery-email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu-correo@ejemplo.com"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? "Enviando..." : "Enviar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
