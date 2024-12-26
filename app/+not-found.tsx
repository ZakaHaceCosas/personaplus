import React from "react";
import BetterButton from "@/components/interaction/better_button";
import { BetterTextSmallText } from "@/components/text/better_text_presets";
import * as Router from "expo-router";
import { LayoutContainer } from "@/app/(tabs)/_layout";
import GapView from "@/components/ui/gap_view";
import { Routes } from "@/constants/routes";
import TopBar from "@/components/navigation/top_bar";
import { useTranslation } from "react-i18next";

export default function NotFoundScreen() {
    const requestedPath: string = Router.usePathname();
    const { t } = useTranslation();

    return (
        <>
            <LayoutContainer>
                <TopBar
                    includeBackButton={true}
                    header={t("pages.404.header")}
                    subHeader={t("pages.404.subheader")}
                />
                <BetterButton
                    style="DEFAULT"
                    buttonText={t("pages.404.goHome.text")}
                    buttonHint={t("pages.404.goHome.hint")}
                    action={() => Router.router.replace(Routes.MAIN.HOME)}
                />
                <GapView height={20} />
                <BetterTextSmallText>
                    {t("pages.404.requestedPath", {
                        requestedPath: requestedPath,
                    })}
                </BetterTextSmallText>
            </LayoutContainer>
        </>
    );
}
