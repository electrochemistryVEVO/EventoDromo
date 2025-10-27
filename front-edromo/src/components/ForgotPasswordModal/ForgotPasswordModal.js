import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./ForgotPasswordModal.module.css";
import {
  verificarCorreoExistente,
  enviarCorreoRecuperacion,
} from "@/services/loginService";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      // PRIMERO, verificamos que el correo exista para no dar pistas a atacantes
      const verificationResponse = await verificarCorreoExistente(email);

      if (verificationResponse && verificationResponse.data.exists) {
        // ✅ SI EL CORREO EXISTE, AHORA PEDIMOS AL BACKEND QUE ENVÍE EL EMAIL
        await enviarCorreoRecuperacion(email);

        // Si la línea anterior no lanzó un error, todo fue bien
        setSuccess(true);

        // Redirigimos después de mostrar el mensaje
        setTimeout(() => {
          onClose();
          router.push("/auth/login"); // O la ruta de tu login
        }, 3000);
      } else {
        // Si el correo no existe, mostramos un error genérico por seguridad
        setError("Si su correo está registrado, recibirá un enlace.");
        // Opcional: podrías poner setSuccess(true) aquí también para no revelar si un email existe o no.
      }
    } catch (err) {
      setError("Ocurrió un error. Por favor, inténtelo de nuevo más tarde.");
      console.error(err);
    } finally {
      setIsLoading(false); // Terminamos de cargar
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles.modalOverlay}
      onClick={(e) => {
        // Solo cerrar si se hace clic en el overlay y no hay mensaje de éxito
        if (e.target === e.currentTarget && !success) {
          onClose();
        }
      }}
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          style={{ display: success ? "none" : "block" }}
        >
          ×
        </button>
        <h2>Recuperar Contraseña</h2>

        {success ? (
          <div className={styles.successMessage}>
            Se ha enviado un enlace a tu correo electrónico para restablecer tu
            contraseña.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div className={styles.errorMessage}>{error}</div>}
            <div className={styles.inputGroup}>
              <label htmlFor="recovery-email">Correo Electrónico</label>
              <input
                type="email"
                id="recovery-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Ingresa tu correo electrónico"
              />
            </div>
            <button type="submit" className={styles.submitButton}>
              Enviar
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
