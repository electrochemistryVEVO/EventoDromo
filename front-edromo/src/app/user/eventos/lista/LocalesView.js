import Image from "next/image";

const LocalCard = ({ local }) => (
    <div className="local-card-container">
            <Image 
                src={local.imagenURL}
                alt={local.nombreLocal}
                layout="fill" 
                className="local-card-image" 
            />
            <div className="local-card-overlay">
                <h5 className="local-card-name">{local.nombreLocal}</h5>
                <p className="local-card-city">{local.nombreCiudad}</p>
            </div>
    </div>
);

export function LocalesView({ locales }) {
    return (
        <section className="py-5 bg-light">
            <div className="container-fluid px-4 px-lg-5 mt-5">
                <div className="section-header">
                    <h2 className="titulo-destacado">Lugares para vivirlo en vivo</h2>
                    <button className="ver-mas-btn">Ver más</button>
                </div>
                <div className="locales-row">
                    {locales.map(local => (
                        <LocalCard key={local.id} local={local} />
                    ))}
                </div>
            </div>
        </section>
    );
}