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
    // Esperamos la animación de cierre para limpiar el estado
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
    setMessageType("");

    try {
      await enviarCorreoRecuperacion(email);

      // ✅ Al ser exitoso, cambiamos el estado.
      // Esto disparará el cambio en la vista (JSX) abajo.
      setMessageType("success");
      setMessage(
        "Se ha enviado un enlace a tu correo electrónico para restablecer tu contraseña."
      );
      setEmail("");
    } catch (err) {
      setMessageType("error");
      setMessage(err.message || "Ocurrió un error al procesar la solicitud.");
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

        {/* Mensaje de éxito o error */}
        {message && (
          <div className={`${styles.message} ${styles[messageType]}`}>
            {message}
          </div>
        )}

        {/* 
            LOGICA CONDICIONAL:
            Si NO es éxito, mostramos el formulario.
            Si SI es éxito, mostramos un botón para cerrar.
        */}
        {messageType !== "success" ? (
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
        ) : (
          /* Opcional: Un botón para cerrar el modal amigablemente cuando todo salió bien */
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button
              className={styles.submitButton}
              onClick={handleClose}
              type="button"
            >
              Entendido, cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
