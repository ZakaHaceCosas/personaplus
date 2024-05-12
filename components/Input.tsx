// Input.tsx
// Entradas

import React from "react";
import * as Native from "react-native";
import BeText from "./Text";

interface InputProps {
    kind: string; // ¿Qué es? TextInput, TextArea, Select, Toggle...
    text: string; // ¿Texto? Será el placeholder, o el texto a mostrar si es una opción
    placeholder: string; // Place holder
    value?: any; // Value
    isReadOnly: boolean; // ¿Se puede editar? False = no
}

export default function Input({ kind, text, placeholder, value, isReadOnly}:InputProps) {
    return (
        <Native.View style={{width: "100%"}}>
            {kind && kind === "text" && (
                <Native.TextInput
                    readOnly={isReadOnly}
                    placeholder={placeholder}
                    value={value}
                    style={[{ backgroundColor: "white", borderRadius: 10, padding: 10, borderWidth: 2, borderColor: "#000" }]}
                />
            )}
        </Native.View>
    )
}