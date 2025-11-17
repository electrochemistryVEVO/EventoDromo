// controller.js or the file defining the component class
import React, { useState } from "react";
import { entradas } from "./entradas";

export const items = entradas;

export function cantidadEntradas() {
  if(items)return items.length;
  return 0;
}

export function importeTotal() {
  return items.reduce(
    (total, item) => total + item.precioEntrada * item.cantidadEntradas,
    0
  );
}

class AppController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: "opcionA",
      selectedPaymentMethod: null,
    };
    this.handlePaymentMethodChange = this.handlePaymentMethodChange.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
  }

  handlePaymentMethodChange(event) {
    this.setState({
      selectedPaymentMethod: event.target.value,
    });
    console.log("Método de Pago Seleccionado:", event.target.value);
  }

  handleOptionChange(event) {
    this.setState({
      selectedOption: event.target.value,
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
