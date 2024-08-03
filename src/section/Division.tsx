// section/Division.tsx
// División

import React, { ReactElement } from "react";
import { View } from "react-native";
import BetterText from "@/src/BetterText";
import GapView from "@/src/GapView";
import colors from "../toolkit/design/colors";

// TypeScript, supongo
/**
 * DivisionProps
 *
 * @interface DivisionProps
 * @typedef {DivisionProps}
 */
interface DivisionProps {
    /**
     * Status. Unused for now. Would define the background color.
     *
     * @type {?string}
     */
    status?: string; // Estado. No se usa por ahora. Definiría el color de fondo.
    /**
     * Whether it has a big icon or not. Unused for now.
     *
     * @type {?boolean}
     */
    hasIcon?: boolean; // ¿Tiene un icono?
    /**
     * Name of the big icon. Unused for now.
     *
     * @type {?(string | null)}
     */
    iconName?: string | null; // Si lo tiene, ¿Cuál es?
    /**
     * An optional smaller text before the header.
     *
     * @type {?string}
     */
    preheader?: string; // Título
    /**
     * The big, main text of the division.
     *
     * @type {string}
     */
    header: string; // Texto grande
    /**
     * An optional small text below the header.
     *
     * @type {?string}
     */
    subheader?: string; // El texto pequeño, de haberlo
    /**
     * A JSX element you can add inside of the division. Optional.
     *
     * @type {?ReactElement}
     */
    children?: ReactElement; // Los hijos (botones, básicamente)
}

// Creamos la función
/**
 * A PersonaPlus division.
 *
 * The PersonaPlus UI operates on a Section-Division basis, with Divisions containing most of the actions and features.
 *
 * @export
 * @param {DivisionProps} param0
 * @param {string} param0.status Status. Unused for now. Would define the background color.
 * @param {string} param0.iconName An optional smaller text before the header.
 * @param {string} param0.preheader The big, main text of the division.
 * @param {string} param0.header The big, main text of the division.
 * @param {string} param0.subheader An optional small text below the header.
 * @param {ReactElement} param0.children A JSX element you can add inside of the division. Optional.
 * @returns {ReactElement}
 */
export default function Division({
    status,
    iconName,
    preheader,
    header,
    subheader,
    children,
}: DivisionProps): ReactElement {
    switch (status) {
        case "REGULAR":
            // El color de fondo es el de siempre (#202328)
            break;
        default:
            // Por defecto
            break;
    }

    return (
        <View
            style={{
                display: "flex",
                backgroundColor: colors.MAIN.DIVISION,
                flexDirection: "row",
                paddingTop: 20,
                paddingLeft: 20,
                paddingRight: 20,
                paddingBottom: 20,
                width: "100%",
            }}
        >
            <View style={{ width: "100%" }}>
                <View style={{ width: "100%" }}>
                    <View>
                        {preheader && (
                            <BetterText
                                textAlign="normal"
                                fontWeight="Bold"
                                fontSize={10}
                                textColor={colors.BASIC.WHITE}
                            >
                                {preheader}
                            </BetterText>
                        )}
                        {preheader && <GapView height={10} />}
                        <BetterText
                            textAlign="normal"
                            fontWeight="Bold"
                            fontSize={25}
                            textColor={colors.BASIC.WHITE}
                        >
                            {header}
                        </BetterText>
                        {subheader && <GapView height={10} />}
                        {subheader && (
                            <BetterText
                                textAlign="normal"
                                fontWeight="Regular"
                                fontSize={12}
                                textColor={colors.LBLS.SDD}
                            >
                                {subheader}
                            </BetterText>
                        )}
                        {children && <GapView height={10} />}
                        {children && (
                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    flex: 1,
                                    width: "100%",
                                    gap: 15,
                                }}
                            >
                                {children}
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
}
