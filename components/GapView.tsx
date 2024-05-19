// GapView.tsx
// ¿flex-gap no funciona? ¿No quieres usar Flexbox? Un espaciador que no ocupa espacio en tu código

import React from "react";
import * as Native from "react-native";

// TypeScript, supongo
interface GapViewProps {
    height: number; // Altura.
}

// Creamos la funcion con estilos en línea
export default function GapView({height}: GapViewProps) {
    return (
        <Native.View style={{ height: height }} />
    )
}