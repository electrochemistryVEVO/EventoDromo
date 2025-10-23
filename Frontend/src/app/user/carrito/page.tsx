import React from 'react'

const carrito = () => {
    return (
        <div className='flex flex-col px-4 py-6'>
            <div className=''>
                {/* LOGO */}
                <h1 className=''>Mi Carrito</h1>
            </div>
            {/* LISTA DE ENTRADAS */}
            <div className=''>
                <div className=''>Tienes 3 entradas</div>
                <div className=''>
                    {/* TABLA DE ENTRADAS */}
                </div>
            </div>
            {/* RESUMEN */}
            <div className=''>
                <h2 className=''>Detalle de pago</h2>
                <div className=''>
                    <div className=''>
                        <span className=''>Overpass Festival</span>
                        <span className=''>S/1200.00</span>
                    </div>
                    <div className=''>
                        <span className=''>Total</span>
                        <span className=''>S/1200.00</span>
                    </div>
                    <div className=''>¡Con esta compra acumulas 12 Dromopuntos!</div>
                </div>
                <div className=''>
                    <div className=''>
                        <button className=''>CheckBox 1</button>
                        <span className=''>He leído y acepto los Términos y Condiciones de compra en Eventódromo. Acepto igualmente la Política de Privacidad y Seguridad y la Política de Cookies.</span>
                    </div>
                    <div className=''>
                        <button className=''>CheckBox 2</button>
                        <span className=''>Autorizo el uso de mis datos para finalidades adicionales.</span>
                    </div>
                </div>
                <div className=''>
                    <button className=''>
                        {/* Imagen de carrito */}
                        <span className=''>FINALIZAR PEDIDO</span>
                    </button>
                    <button className=''>
                        {/* Imagen de la flecha */}
                        <span className=''>SEGUIR COMPRANDO</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default carrito