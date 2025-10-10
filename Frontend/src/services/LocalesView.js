import Image from "next/image";

const LocalCard = ({ local }) => (
    <div className="col-12 col-md-4 mb-4">
        <div className="card h-100">
            {/* Asumimos que las imágenes de locales también están en public/images/ */}
            <Image src={`/images/${local.imagen}`} alt={local.nombre} width={400} height={250} className="card-img-top" />
            <div className="card-body">
                <h5 className="card-title">{local.nombre}</h5>
                <p className="card-text">{local.ciudad}</p>
            </div>
        </div>
    </div>
);

export function LocalesView({ locales }) {
    return (
        <section className="py-5 bg-light">
            <div className="container px-4 px-lg-5 mt-5">
                <h2 className="titulo-destacado mb-4">Lugares para vivirlo en vivo</h2>
                <div className="row gx-4 gx-lg-5">
                    {locales.map(local => (
                        <LocalCard key={local.id} local={local} />
                    ))}
                </div>
            </div>
        </section>
    );
}