import Image from "next/image";

const LocalCard = ({ local }) => {
    const imageSrc = typeof local?.imagenURL === "string" ? local.imagenURL.trim() : "";
    const hasImage = imageSrc.length > 0;
    const altText = local?.nombreLocal || "Local";

    return (
        <div className="local-card-container">
            {hasImage ? (
                <Image
                    src={imageSrc}
                    alt={altText}
                    fill
                    sizes="(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 25vw"
                    className="local-card-image"
                />
            ) : null}
            <div className="local-card-overlay">
                <h5 className="local-card-name">{local?.nombreLocal || "Nombre no disponible"}</h5>
                <p className="local-card-city">{local?.nombreCiudad || "Ciudad no disponible"}</p>
            </div>
        </div>
    );
};

const resolveLocalKey = (local, index) => {
    if (local?.id != null) {
        return `local-${local.id}`;
    }
    if (local?.nombreLocal) {
        return `local-${local.nombreLocal}-${index}`;
    }
    return `local-${index}`;
};

export function LocalesView({ locales }) {
    const seen = new Set();
    const safeLocales = Array.isArray(locales)
        ? locales.filter((item) => {
              if (!item) {
                  return false;
              }
              const identifier = item.id ?? `${item.nombreLocal ?? ""}-${item.nombreCiudad ?? ""}`;
              if (seen.has(identifier)) {
                  return false;
              }
              seen.add(identifier);
              return true;
          })
        : [];

    return (
        <section className="py-5 bg-light">
            <div className="px-4 mt-5 container-fluid px-lg-5">
                <div className="section-header">
                    <h2 className="titulo-destacado">Lugares para vivirlo en vivo</h2>
                    <button className="ver-mas-btn">Ver más</button>
                </div>
                <div className="locales-row">
                    {safeLocales.map((local, index) => (
                        <LocalCard key={resolveLocalKey(local, index)} local={local} />
                    ))}
                </div>
            </div>
        </section>
    );
}