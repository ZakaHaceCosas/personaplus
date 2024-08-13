import React from "react";
import BetterText from "./BetterText";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import FontSizes from "./toolkit/design/fontSizes";

type TranslateFunction = ReturnType<typeof useTranslation>["t"];

interface BackButtonProps {
    t: TranslateFunction;
}

// Memoized back button component
const BackButtonComponent: React.FC<BackButtonProps> = ({ t }) => (
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
