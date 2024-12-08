// Loading.tsx
// Página de carga

import React, { ReactElement } from "react";
import BetterText from "@/components/text/better_text";
import { useTranslation } from "react-i18next";
import Colors from "@/constants/colors";
import FontSizes from "@/constants/font_sizes";

/**
 * Homemade simple loading page.
 *
 * @export
 * @returns {ReactElement} The loading page
 */
export default function Loading(): ReactElement {
    const { t } = useTranslation();

    return (
        <BetterText
            fontWeight="Regular"
            fontSize={FontSizes.REGULAR}
            textAlign="center"
            textColor={Colors.LABELS.SDD}
        >
            {t("globals.loading")}
        </BetterText>
    );
}
