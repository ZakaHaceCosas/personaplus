import React, { ReactElement } from "react";
import BetterText from "./BetterText";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import FontSizes from "./toolkit/design/fontSizes";

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
 * Description placeholder
 *
 * @param {{ t: any; }} param0
 * @param {TranslateFunction} param0.t Pass here the translate function, please.
 * @returns {ReactElement} A JSX element
 */
const BackButtonComponent: React.FC<BackButtonProps> = ({
    t,
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
