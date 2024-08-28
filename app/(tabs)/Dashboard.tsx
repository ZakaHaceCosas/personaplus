import Button from "@/components/interaction/Button";
import {
    BetterTextHeader,
    BetterTextSubHeader,
} from "@/components/text/BetterTextPresets";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

export default function HomeScreen() {
    const { t } = useTranslation();

    return (
        <>
            <BetterTextHeader>objetivos creacion epic</BetterTextHeader>
            <BetterTextSubHeader>
                {t("page_home.header.sublabel")}
            </BetterTextSubHeader>
            <Button style="GOD" action={() => router.push("objectives/Create")}>
                crear objetivo
            </Button>
        </>
    );
}
