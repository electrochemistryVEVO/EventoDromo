"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import EventCard from "@/components/card-evento/eventCard.jsx";
import { listarEventosPorBusqueda } from "@/services/EntradaDetalle.service";

export function ListaEventosBusqueda() {
  const params = useSearchParams();
  const searchText = params.get("search")?.trim() ?? "";
  const [eventList, setEventList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isSubscribed = true;

    const fetchResults = async () => {
      if (!searchText) {
        setEventList([]);
        setError(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const resultados = await listarEventosPorBusqueda(searchText);
        if (!isSubscribed) return;

        const normalized = Array.isArray(resultados?.data)
          ? resultados.data
          : Array.isArray(resultados)
            ? resultados
            : [];

        const hasError = resultados && resultados.success === false;
        setEventList(hasError ? [] : normalized);
        setError(hasError ? (resultados.error || resultados.mensaje || "No se pudieron cargar los resultados") : null);
      } catch (err) {
        if (!isSubscribed) return;
        console.error("Error buscando eventos:", err);
        setEventList([]);
        setError("No se pudieron cargar los resultados");
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    fetchResults();

    return () => {
      isSubscribed = false;
    };
  }, [searchText]);

  const heading = useMemo(() => {
    if (!searchText) return "Explora nuestros eventos";
    return `Resultados para "${searchText}"`;
  }, [searchText]);

  const renderResults = () => {
    if (isLoading) {
      return <p>Buscando eventos...</p>;
    }

    if (error) {
      return <p className="text-danger">{error}</p>;
    }

    if (eventList.length === 0) {
      return <h3>No se encontraron resultados</h3>;
    }

    return eventList.map((evento) => (
      <EventCard key={evento.id} event={evento} />
    ));
  };

  return (
    <section className="py-5">
      <div className="container px-4 mt-5 px-lg-5">
        <h2>{heading}</h2>
        <div className="col gx-4 gx-lg-5 justify-content-center">
          <div
            id="lista-destacados"
            className="container px-4 mt-5 row px-lg-5"
          >
            {renderResults()}
          </div>
        </div>
      </div>
    </section>
  );
}
