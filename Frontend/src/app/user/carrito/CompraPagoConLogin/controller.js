// controller.js or the file defining the component class
import image from "@/assets/pictures/festival-overpass-lima.png"
import React, { useState } from 'react';

export const items = [
    { id: "1", imageUrl: image, title: "Overpass Lima", subtitle: "Super VIP", quantity: 1, price: 500 },
    { id: "2", imageUrl: image, title: "Overpass Lima", subtitle: "VIP",       quantity: 1, price: 400 },
    { id: "3", imageUrl: image, title: "Overpass Lima", subtitle: "Exclusivo", quantity: 1, price: 300 },
  ];

  export function cantidadEntradas(){
    return items.length;
  }
   
export function importeTotal(){
    return items.reduce((total, item) => total + item.price, 0);
}

class AppController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: 'opcionA', // Existing state
            // New state for payment method
            selectedPaymentMethod: null, // 'tarjeta' or 'transferencia'
        };
        // Bind new handler if using class methods
        this.handlePaymentMethodChange = this.handlePaymentMethodChange.bind(this);
        // Assuming this one is already bound
        this.handleOptionChange = this.handleOptionChange.bind(this); 
    }

    // New handler to manage the payment radio buttons
    handlePaymentMethodChange(event) {
        this.setState({
            selectedPaymentMethod: event.target.value
        });
        console.log('Método de Pago Seleccionado:', event.target.value);
    }
    
    // Existing handler
    handleOptionChange(event) {
        this.setState({
            selectedOption: event.target.value
        });
    }

    render() {
        return (
            // The App component from page.jsx needs to be used here
            // If page.jsx IS the component, then this structure is the component itself.
            <App 
                selectedOption={this.state.selectedOption}
                selectedPaymentMethod={this.state.selectedPaymentMethod}
                handleOptionChange={this.handleOptionChange}
                handlePaymentMethodChange={this.handlePaymentMethodChange}
            />
        );
    }
}

// export default AppController;