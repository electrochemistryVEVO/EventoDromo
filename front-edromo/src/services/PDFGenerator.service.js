import { pdf } from '@react-pdf/renderer';
import EntradaPDF from '../components/pdf/EntradaPDF';

export const generateEntradaPDF = async (entradaData) => {
    try {
        // Crear el blob del PDF
        const blob = await pdf(
            <EntradaPDF entrada={entradaData} />
        ).toBlob();

        // Crear URL del blob
        const url = URL.createObjectURL(blob);

        // Crear elemento anchor temporal
        const link = document.createElement('a');
        link.href = url;
        link.download = `entrada-${entradaData.nombreEvento.toLowerCase().replace(/\s+/g, '-')}.pdf`;

        // Simular click para descargar
        document.body.appendChild(link);
        link.click();

        // Limpiar
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error generando el PDF:', error);
        throw error;
    }
};