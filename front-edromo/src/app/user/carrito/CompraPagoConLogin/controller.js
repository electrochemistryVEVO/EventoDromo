// controller.js or the file defining the component class
import React, { useState } from 'react';
import { entradas } from "public/data/entradas";

// Asegurar que items siempre sea un array
export const items = Array.isArray(entradas) ? entradas : [];

export function cantidadEntradas() {
    return items.length;
}

export function importeTotal() {
    if (!Array.isArray(items) || items.length === 0) return 0;
    return items.reduce((total, item) => {
        const precio = Number(item?.precioEntrada) || 0;
        const qty = Number(item?.cantidadEntradas) || 0;
        return total + precio * qty;
    }, 0);
}

class AppController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: 'opcionA',
            selectedPaymentMethod: null,
        };
        this.handlePaymentMethodChange = this.handlePaymentMethodChange.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
    }

    handlePaymentMethodChange(event) {
        this.setState({
            selectedPaymentMethod: event.target.value
        });
        console.log('Método de Pago Seleccionado:', event.target.value);
    }

    handleOptionChange(event) {
        this.setState({
            selectedOption: event.target.value
        });
    }

    render() {
        return (
            <App
                selectedOption={this.state.selectedOption}
                selectedPaymentMethod={this.state.selectedPaymentMethod}
                handleOptionChange={this.handleOptionChange}
                handlePaymentMethodChange={this.handlePaymentMethodChange}
            />
        );
    }
}