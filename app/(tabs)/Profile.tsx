import BetterText from "@/components/text/BetterText";
import {
    BetterTextHeader,
    BetterTextSubHeader,
} from "@/components/text/BetterTextPresets";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { FullProfile } from "@/types/User";
import FontSizes from "@/constants/FontSizes";
import BetterButton from "@/components/interaction/BetterButton";
import { updateBrm5 } from "@/toolkit/User";
import { router } from "expo-router";
import { logToConsole } from "@/toolkit/debug/Console";

export default function HomeScreen() {
    const { t } = useTranslation();
    async function changeLanguage() {
        try {
            const userData = await AsyncStorage.getItem("userData");
            if (userData) {
                const profile: FullProfile = JSON.parse(userData);
                profile.language = "es";
                await AsyncStorage.setItem("userData", JSON.stringify(profile));
            }
        } catch (e) {
            logToConsole("Error changing language:" + e, "error");
        }
    }

    return (
        <>
            <BetterTextHeader>
                {t("page_home.header.label")}, {"username"}!
            </BetterTextHeader>
            <BetterTextSubHeader>
                {t("page_home.header.sublabel")}
            </BetterTextSubHeader>
            <BetterText
                fontSize={FontSizes.LARGER}
                isLink={true}
                fontWeight="Regular"
                onTap={changeLanguage}
            >
                hola
            </BetterText>
            <BetterButton
                buttonText="DO NOT PRESS OR YOU WILL BE FIRED"
                style="WOR"
                action={() => updateBrm5(true)}
            />
            <BetterButton
                buttonText="dev interface"
                style="HMM"
                action={() => router.navigate("/DevInterface")}
            />
        </>
    );
}
