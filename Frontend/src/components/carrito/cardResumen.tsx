import { EntradaDTO } from "@/lib/dto";

export function CardResumen({ entrada }: { entrada: EntradaDTO }) {
    return (
        <div>
            <h2>{entrada.nombreEvento}</h2>
            <p>{entrada.nombreLocal}</p>
            <p>{entrada.precioEntrada}</p>
            <p>{entrada.cantidadEntradas}</p>
            <p>{entrada.tipoEntrada}</p>
            <p>{entrada.imagenURL}</p>
        </div>
    );
}