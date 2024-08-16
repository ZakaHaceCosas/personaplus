import React, { ReactElement } from "react";
import BetterText from "@/src/BetterText";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import FontSizes from "@/src/toolkit/design/fontSizes";
import { TFunction } from "i18next";

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

// Memoized back button component
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
        fontSize={FontSizes.LARGE}
        fontWeight="Light"
        onTap={router.back}
    >
        {"<"} {t("globals.go_back")}
    </BetterText>
);

const BackButton = React.memo(BackButtonComponent);

BackButton.displayName = "BackButton";

export default BackButton;
