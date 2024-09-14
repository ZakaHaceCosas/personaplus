import {
    BetterTextHeader,
    BetterTextSubHeader,
} from "@/components/text/BetterTextPresets";
import GapView from "@/components/ui/GapView";
import Section from "@/components/ui/sections/Section";
import { RenderActiveObjectives } from "@/components/ui/sections/interface/Home";
import { orchestrateUserData } from "@/toolkit/User";
import { logToConsole } from "@/toolkit/debug/Console";
import { FullProfile } from "@/types/User";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function HomeScreen() {
    const { t } = useTranslation();
    const [userData, setUserData] = useState<FullProfile | null>(null);

    useEffect(() => {
        async function handler() {
            try {
                const response = await orchestrateUserData();
                setUserData(response);
            } catch (e) {
                logToConsole("Error accessing user data! " + e, "error");
            }
        }

        handler();
    }, []);

    return (
        <>
            <BetterTextHeader>
                {t("pages.home.header", { username: userData?.username })}
            </BetterTextHeader>
            <BetterTextSubHeader>
                {t("pages.home.subheader")}
            </BetterTextSubHeader>
            <GapView height={20} />
            <Section width="total" kind="Objectives">
                {RenderActiveObjectives()}
            </Section>
        </>
    );
}
