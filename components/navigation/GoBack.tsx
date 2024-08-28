import React, { ReactElement } from "react";
import BetterText from "@/components/text/BetterText";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import FontSizes from "@/constants/FontSizes";
import { TFunction } from "i18next";
import { logToConsole } from "@/toolkit/debug/Console";

type TranslateFunction = ReturnType<typeof useTranslation>["t"];

/**
 * BackButtonProps interface
 *
 * @interface BackButtonProps
 * @typedef {BackButtonProps}
 */
interface BackButtonProps {
    /**
     * Pass here the translate function, please.
     *
     * @type {TranslateFunction}
     */
    t: TranslateFunction;
}

function handleGoBack() {
    try {
        if (router.canGoBack()) {
            router.back();
            logToConsole("GoBack.tsx is going back!", "success");
        } else {
            router.replace("/");
            logToConsole(
                "GoBack.tsx couldn't find a previous route, so going to index",
                "log"
            );
        }
    } catch (e) {
        logToConsole("Error with GoBack.tsx!" + e, "error");
    }
}

/**
 * A **< Go back** button for the top of the UI in certain pages.
 *
 * @param {{ t: TFunction; }} param0
 * @param {TranslateFunction} param0.t Pass here the translate function, please.
 * @returns {ReactElement} A JSX element
 */
const BackButtonComponent: React.FC<BackButtonProps> = ({
    t,
}: {
    t: TFunction;
}): ReactElement => (
    <BetterText
        fontFamily="JetBrainsMono"
        fontSize={FontSizes.REGULAR}
        fontWeight="Light"
        onTap={() => handleGoBack()}
    >
        {"< " + t("globals.interaction.goBackNoSad")}
    </BetterText>
);

const BackButton = React.memo(BackButtonComponent);

BackButton.displayName = "BackButton";

export default BackButton;
