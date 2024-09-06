// src/Notification.tsx
// Notificaciones, para alertar al usuario de cosas que pasan

import React, { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import BetterText from "@/components/text/BetterText";
import GapView from "@/components/ui/GapView";
import Colors from "@/constants/Colors";
import getCommonScreenSize from "@/constants/Screen";
import { UniversalPressableStyle } from "@/constants/ui/Pressables";

// TypeScript, supongo
interface BetterAlertProps {
    style: "DEFAULT" | "ACE" | "GOD" | "WOR" | "HMM"; // Tipo (color)
    title: string; // Título de la notificación
    text: string; // Texto de la misma
    subtext?: string; // De haberlo, subtexto de la misma
    layout: "alert" | "notification";
}

const styles = StyleSheet.create({
    betterAlert: {
        padding: UniversalPressableStyle.padding,
        borderRadius: UniversalPressableStyle.borderRadius,
        borderWidth: UniversalPressableStyle.borderWidth,
        width: getCommonScreenSize("width"),
        display: "flex",
        flexDirection: "column",
    },
});

export default function BetterAlert({
    style,
    title,
    text,
    subtext,
    layout,
}: BetterAlertProps): ReactElement {
    let borderColor: string; // Color del borde
    let backgroundColor: string; // Color del fondo
    let textColor: string; // Color del texto
    let itemLayout: "absolute" | "static";

    switch (style) {
        case "ACE":
            borderColor = Colors.PRIMARIES.ACE.ACESTRK;
            backgroundColor = Colors.PRIMARIES.ACE.ACE;
            textColor = Colors.BASIC.WHITE;
            break;
        case "GOD":
            borderColor = Colors.PRIMARIES.GOD.GODSTRK;
            backgroundColor = Colors.PRIMARIES.GOD.GOD;
            textColor = Colors.BASIC.BLACK;
            break;
        case "WOR":
            borderColor = Colors.PRIMARIES.WOR.WORSTRK;
            backgroundColor = Colors.PRIMARIES.WOR.WOR;
            textColor = Colors.BASIC.WHITE;
            break;
        case "HMM":
            borderColor = Colors.PRIMARIES.HMM.HMMSTRK;
            backgroundColor = Colors.PRIMARIES.HMM.HMM;
            textColor = Colors.BASIC.BLACK;
            break;
        case "DEFAULT":
        default:
            borderColor = Colors.MAIN.BLANDITEM.STRK;
            backgroundColor = Colors.MAIN.BLANDITEM.BACKGROUND;
            textColor = Colors.BASIC.WHITE;
            break;
    }

    switch (layout) {
        case "notification":
            itemLayout = "absolute";
            break;
        case "alert":
        default:
            itemLayout = "static";
            break;
    }

    return (
        <View
            style={[
                {
                    position: itemLayout,
                    borderColor: borderColor,
                    backgroundColor: backgroundColor,
                    bottom: layout === "notification" ? 0 : undefined,
                },
                styles.betterAlert,
            ]}
        >
            <BetterText
                fontWeight="Medium"
                fontSize={12}
                textColor={textColor}
                textAlign="normal"
            >
                {String(title)}
            </BetterText>
            <GapView height={5} />
            <BetterText
                fontWeight="SemiBold"
                fontSize={20}
                textColor={textColor}
                textAlign="normal"
            >
                {String(text)}
            </BetterText>
            {subtext && <GapView height={5} />}
            {subtext && (
                <BetterText
                    fontWeight="Regular"
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
