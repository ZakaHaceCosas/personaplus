// src/GapView.tsx
// ¿flex-gap no funciona? ¿No quieres usar Flexbox? Un espaciador que no ocupa espacio en tu código

import React from "react";
import { View } from "react-native-animatable";

// TypeScript, supongo
interface GapViewProps {
    height?: number; // Tamaño vertical.
    width?: number; // Tamaño horizontal.
}

// Creamos la funcion
export default function GapView({ height, width }: GapViewProps) {
    return <View style={{ height: height, width: width }} />;
}
