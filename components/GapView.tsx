// GapView.tsx
// ¿flex-gap no funciona? ¿No quieres usar Flexbox? Un espaciador que no ocupa espacio en tu código

import * as React from "react";
import * as Native from "react-native";

// TypeScript, supongo
interface GapViewProps {
    height?: number; // Tamaño vertical.
    width?: number; // Tamaño horizontal.
}

// Creamos la funcion
export default function GapView({ height, width }: GapViewProps) {
    return <Native.View style={{ height: height, width: width }} />;
}
