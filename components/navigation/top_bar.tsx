import React, { ReactElement } from "react";
import {
    BetterTextHeader,
    BetterTextSubHeader,
} from "@/components/text/better_text_presets";
import GapView from "@/components/ui/gap_view";
import BackButton from "@/components/navigation/back_button";
import { useTranslation } from "react-i18next";

/**
 * TopBarProps
 *
 * @interface TopBarProps
 */
interface TopBarProps {
    /**
     * If true, the "< Go back" button will be included.
     *
     * @type {boolean}
     */
    includeBackButton: boolean;
    /**
     * Main header of the page.
     *
     * @type {string}
     */
    header: string;
    /**
     * Description / sub header of the page. Set to null if a description is not needed.
     *
     * @type {string | null}
     */
    subHeader: string | null;
}

/**
 * The default top bar for most app pages. Don't add a `<GapView />` below it, it comes with the component itself.
 *
 * @export
 * @param {TopBarProps} p
 * @param {boolean} p.includeBackButton
 * @param {string} p.header
 * @param {string | null} p.subHeader
 * @returns {ReactElement}
 */
export default function TopBar({
    includeBackButton,
    header,
    subHeader,
}: TopBarProps): ReactElement {
    const { t } = useTranslation();

    return (
        <>
            {includeBackButton && <BackButton t={t} />}
            <BetterTextHeader>{header}</BetterTextHeader>
            {subHeader !== null && (
                <BetterTextSubHeader>{subHeader}</BetterTextSubHeader>
            )}
            <GapView height={10} />
        </>
    );
}
