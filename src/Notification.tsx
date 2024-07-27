// src/Notification.tsx
// Notificaciones, para alertar al usuario de cosas que pasan

import React from "react";
import { DimensionValue, View } from "react-native";
import BetterText from "@/src/BetterText";
import GapView from "@/src/GapView";
import colors from "@/src/toolkit/design/colors";

// TypeScript, supongo
/**
 * NotificationProps interface
 *
 * @interface NotificationProps
 * @typedef {NotificationProps}
 */
interface NotificationProps {
    /**
     * The style of the button. Use ACE (blue) for accent, GOD (green) for positive / success alerts, WOR (red) for destructive / failure alerts, and HMM (orange) for warning alerts.
     *
     * @type {("ACE" | "GOD" | "WOR" | "HMM")}
     */
    style: "ACE" | "GOD" | "WOR" | "HMM"; // Tipo (color)
    /**
     * The title of the notification (a small, short text before the actual "title").
     *
     * @type {string}
     */
    title: string; // Título de la notificación
    /**
     * The actual "title" / main, big text of the notification.
     *
     * @type {string}
     */
    text: string; // Texto de la misma
    /**
     * An optional smaller subtext below the title (`text`) to provide additional details.
     *
     * @type {?string}
     */
    subtext?: string; // De haberlo, subtexto de la misma
    /**
     * CSS (StyleSheet) position.
     *
     * @type {?string}
     */
    position?: string; // Posicionamiento
}

// Creamos la función
/**
 * Homemade alert / notification component
 *
 * @export
 * @param {NotificationProps} param0
 * @param {("ACE" | "GOD" | "WOR" | "HMM")} param0.style
 * @param {string} param0.title
 * @param {string} param0.text
 * @param {string} [param0.position="static"]
 * @param {string} param0.subtext
 * @returns {*}
 */
export default function Notification({
    style,
    title,
    text,
    position = "static",
    subtext,
}: NotificationProps) {
    let borderColor: string; // Color del borde
    let backgroundColor: string; // Color del fondo
    let textColor: string; // Color del texto

    switch (style) {
        case "ACE":
            borderColor = colors.PRIMARIES.ACE.ACESTRK;
            backgroundColor = colors.PRIMARIES.ACE.ACE;
            textColor = "#FFFFFF";
            break;
        case "GOD":
            borderColor = colors.PRIMARIES.GOD.GODSTRK;
            backgroundColor = colors.PRIMARIES.GOD.GOD;
            textColor = "#000000";
            break;
        case "WOR":
            borderColor = colors.PRIMARIES.WOR.WORSTRK;
            backgroundColor = colors.PRIMARIES.WOR.WOR;
            textColor = "#FFFFFF";
            break;
        case "HMM":
            borderColor = colors.PRIMARIES.HMM.HMMSTRK;
            backgroundColor = colors.PRIMARIES.HMM.HMM;
            textColor = "#000000";
            break;
        default:
            borderColor = colors.MAIN.BLANDITEM.STRK;
            backgroundColor = colors.MAIN.BLANDITEM.BACKGROUND;
            textColor = "#FFF";
            break;
    }

    // Usamos estilos en línea ya que tienen un efecto pequeño pero positivo en el rendimiento final
    return (
        <View
            // @ts-expect-error: "Unnasignable types"
            style={{
                padding: 15,
                borderRadius: 10,
                borderColor: borderColor,
                backgroundColor: backgroundColor,
                borderWidth: 4,
                width: "100%" as DimensionValue,
                position: position,
                bottom: position === "absolute" ? 100 : undefined,
                left: position === "absolute" ? 20 : undefined,
                right: position === "absolute" ? 20 : undefined,
                zIndex: 999,
            }}
        >
            <BetterText
                fontWeight="SemiBold"
                fontSize={12}
                textColor={textColor}
                textAlign="normal"
            >
                {String(title)}
            </BetterText>
            <GapView height={5} />
            <BetterText
                fontWeight="Bold"
                fontSize={22}
                textColor={textColor}
                textAlign="normal"
            >
                {String(text)}
            </BetterText>
            {subtext && <GapView height={5} />}
            {subtext && (
                <BetterText
                    fontWeight="Light"
                    fontSize={12}
                    textColor={textColor}
                    textAlign="normal"
                >
                    {String(subtext)}
                </BetterText>
            )}
        </View>
    );
}
