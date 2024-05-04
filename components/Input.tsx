// Input.tsx
// Entradas

import React from "react";
import * as Native from "react-native";
import BeText from "./Text";

interface InputProps {
    kind: string; // ¿Qué es? TextInput, TextArea, Select, Toggle...
    text: string; // ¿Texto? Será el placeholder, o el texto a mostrar si es una opción
    hasChevron?: boolean;
    children?: React.ReactNode;
}

export default function Input({ kind, text, hasChevron, children}:InputProps) {
    return (
        <BeText weight="Italic" size={15} align="rigt">
            {text}
        </BeText>
    )
}