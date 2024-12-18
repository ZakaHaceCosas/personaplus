import React, { ReactElement } from "react";
import BetterText from "@/components/text/better_text";
import { useTranslation } from "react-i18next";
import FontSizes from "@/constants/font_sizes";
import { TFunction } from "i18next";
import { SafelyGoBack } from "@/toolkit/routing";

type TranslateFunction = ReturnType<typeof useTranslation>["t"];

/**
 * BackButtonProps interface
 *
 * @interface BackButtonProps
 */
interface BackButtonProps {
    /**
     * Pass here the translate function, please.
     *
     * @type {TranslateFunction}
     */
    t: TranslateFunction;
}

/**
 * A **< Go back** button for the top of the UI in certain pages.
 *
 * @param {{ t: TFunction; }} p
 * @param {TranslateFunction} p.t Pass here the translate function, please.
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
        onTap={() => SafelyGoBack()}
    >
        {`< ${t("globals.interaction.goBackNoSad")}`}
    </BetterText>
);

const BackButton = React.memo(BackButtonComponent);

BackButton.displayName = "BackButton";

export default BackButton;
