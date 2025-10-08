"use client"

import React from "react";
import "@/css/checkboxCarrito.css";

export default function CheckboxCarrito({ checked, onChange, label, required }) {
    return (
        <label className="checkbox-carrito-label">
            <input
                type="checkbox"
                className="checkbox-carrito-input"
                checked={checked}
                onChange={onChange}
                required={required}
            />
            <span className="checkbox-carrito-custom" />
            <span className="checkbox-carrito-text">{label}</span>
        </label>
    );
}
