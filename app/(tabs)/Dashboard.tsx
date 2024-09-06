import BetterButton from "@/components/interaction/BetterButton";
import {
    BetterTextHeader,
    BetterTextLicenseHeader,
    BetterTextSubHeader,
} from "@/components/text/BetterTextPresets";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

export default function HomeScreen() {
    const { t } = useTranslation();

    return (
        <>
            <BetterTextHeader>crear objetivos (epico)</BetterTextHeader>
            <BetterTextSubHeader>
                {t("page_home.header.sublabel")}
            </BetterTextSubHeader>
            <BetterButton
                buttonText={"CREATE UR OBJECTIVE HERE !1!"}
                style="GOD"
                action={() => router.push("objectives/Create")}
            />
            <BetterTextLicenseHeader>
                (funciona a medias)
            </BetterTextLicenseHeader>
        </>
    );
}
