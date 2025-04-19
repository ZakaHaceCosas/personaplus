/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2023-2025 The "Give It A Plus" organization and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this repository for more details.
 * <=============================================================================>
 *
 * You are in: @/components/ui/BetterAlert.tsx
 * Basically: Alerts and notifications, to tell the user about important stuff.
 *
 * <=============================================================================>
 */

import React, { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import BetterText from "@/components/text/better_text";
import GapView from "@/components/ui/gap_view";
import Colors from "@/constants/colors";
import { GetCommonScreenSize } from "@/constants/screen";
import { UniversalItemStyle } from "@/constants/ui/pressables";
import { PrimaryColorsType } from "@/types/color";

// TypeScript, supongo
/**
 * BetterAlertProps
 *
 * @interface BetterAlertProps
 */
interface BetterAlertProps {
    /**
     * The color of the notification.
     *
     * @type {PrimaryColorsType}
     */
    style: PrimaryColorsType;
    /**
     * A small text to show before the title / main text of the notification.
     *
     * @type {?string}
     */
    preTitle?: string;
    /**
     * Title / main big text of the notification.
     *
     * @type {string}
     */
    title: string;
    /**
     * An optional long text for the notification's content.
     *
     * @type {?string}
     */
    bodyText?: string;
    /**
     * Whether it's an alert (a normal item) or a notification (a fixed, floating element).
     *
     * @type {("alert" | "notification")}
     */
    layout: "alert" | "notification";
}

const styles = StyleSheet.create({
    betterAlert: {
        padding: UniversalItemStyle.padding,
        borderRadius: UniversalItemStyle.borderRadius,
        borderWidth: UniversalItemStyle.borderWidth,
        width: GetCommonScreenSize("width"),
        display: "flex",
        flexDirection: "column",
    },
});

export default function BetterAlert({
    style,
    preTitle,
    title,
    bodyText,
    layout,
}: BetterAlertProps): ReactElement {
    let borderColor: string; // Border color
    let backgroundColor: string; // Background color
    let textColor: string; // Text color
    let itemLayout: "absolute" | "static"; // Position of the notification

    switch (style) {
        case "ACE":
            borderColor = Colors.PRIMARIES.ACE.ACE_STROKE;
            backgroundColor = Colors.PRIMARIES.ACE.ACE;
            textColor = Colors.BASIC.WHITE;
            break;
        case "WOR":
            borderColor = Colors.PRIMARIES.WOR.WOR_STROKE;
            backgroundColor = Colors.PRIMARIES.WOR.WOR;
            textColor = Colors.BASIC.WHITE;
            break;
        case "HMM":
            borderColor = Colors.PRIMARIES.HMM.HMM_STROKE;
            backgroundColor = Colors.PRIMARIES.HMM.HMM;
            textColor = Colors.BASIC.BLACK;
            break;
        case "DEFAULT":
        default:
            borderColor = Colors.MAIN.DEFAULT_ITEM.STROKE;
            backgroundColor = Colors.MAIN.DEFAULT_ITEM.BACKGROUND;
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
            {preTitle && (
                <>
                    <BetterText
                        fontWeight="Medium"
                        fontSize={12}
                        textColor={textColor}
                        textAlign="normal"
                    >
                        {preTitle}
                    </BetterText>
                    <GapView height={5} />
                </>
            )}
            <BetterText
                fontWeight="SemiBold"
                fontSize={20}
                textColor={textColor}
                textAlign="normal"
            >
                {title}
            </BetterText>
            {bodyText && (
                <>
                    <GapView height={5} />
                    <BetterText
                        fontWeight="Regular"
                        fontSize={12}
                        textColor={textColor}
                        textAlign="normal"
                    >
                        {bodyText}
                    </BetterText>
                </>
            )}
        </View>
    );
}
