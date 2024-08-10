// src/GapView.tsx
// ¿flex-gap no funciona? ¿No quieres usar Flexbox? Un espaciador que no ocupa espacio en tu código

import React, { ReactElement } from "react";
import { View } from "react-native-animatable";

// TypeScript, supongo
/**
 * GapViewProps interface
 *
 * @interface GapViewProps
 * @typedef {GapViewProps}
 */
interface GapViewProps {
    /**
     * The height of the GapView
     *
     * @type {?number}
     */
    height?: number; // Tamaño vertical.
    /**
     * The width of the GapView
     *
     * @type {?number}
     */
    width?: number; // Tamaño horizontal.
}

// Creamos la funcion
/**
 * Homemade custom gap component. Think of it as an invisible box that creates empty space. It renders an empty `<View>` component with custom width and/or height, replicating gap to space items.
 *
 * @export
 * @param {GapViewProps} param0
 * @param {number} param0.height
 * @param {number} param0.width
 * @returns {ReactElement}
 */
export default function GapView({ height, width }: GapViewProps): ReactElement {
    return <View style={{ height: height, width: width }} />;
}
