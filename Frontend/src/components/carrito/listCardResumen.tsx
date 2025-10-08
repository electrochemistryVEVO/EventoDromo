import { CardResumen } from "./cardResumen";
import { type EntradaDTO } from "@/lib/dto";

export function ListCardResumen({ entradas }: { entradas: EntradaDTO[] }) {
    if (!entradas || entradas.length === 0) {
        return (
            <p style={{ color: "#6b7280" }}>
                No hay entradas disponibles.
            </p>
        );
    }

    return (
        <div>
            {entradas.map((entrada) => (
                <CardResumen key={entrada.id} entrada={entrada} />
            ))}
        </div>
    );
}