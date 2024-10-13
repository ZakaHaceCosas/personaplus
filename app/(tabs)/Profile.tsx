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
import StoredItemNames from "@/constants/StoredItemNames";
import Routes from "@/constants/Routes";

export default function HomeScreen() {
    const { t } = useTranslation();
    async function changeLanguage() {
        try {
            const userData: string | null = await AsyncStorage.getItem(
                StoredItemNames.userData,
            );
            if (!userData) {
                throw new Error("Why is userData null?");
            }
            const profile: FullProfile = JSON.parse(userData);
            profile.language = "es";
            await AsyncStorage.setItem(
                StoredItemNames.userData,
                JSON.stringify(profile),
            );
        } catch (e) {
            logToConsole("Error changing language:" + e, "error");
        }
    }

    return (
        <>
            <BetterTextHeader>
                {t("pages.profile.label")}, {"username"}!
            </BetterTextHeader>
            <BetterTextSubHeader>
                {t("pages.profile.subheader")}
            </BetterTextSubHeader>
            <BetterText
                fontSize={FontSizes.LARGER}
                isLink={true}
                fontWeight="Regular"
                onTap={changeLanguage}
            >
                Profile
            </BetterText>
            <BetterButton
                buttonText="DO NOT PRESS OR YOU WILL BE FIRED"
                buttonHint="makes your account go boom"
                style="WOR"
                action={() => updateBrm5(true)}
            />
            <BetterButton
                buttonText="Dev Interface"
                buttonHint="Launches Dev Interface (doxxes you)"
                style="HMM"
                action={() => router.navigate(Routes.Developer.Home)}
            />
        </>
    );
}
