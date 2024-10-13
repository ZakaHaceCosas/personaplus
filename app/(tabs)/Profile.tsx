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
import { OrchestrateUserData, updateBrm5 } from "@/toolkit/User";
import { router } from "expo-router";
import { logToConsole } from "@/toolkit/debug/Console";
import StoredItemNames from "@/constants/StoredItemNames";
import ROUTES from "@/constants/Routes";
import { useEffect, useState } from "react";

export default function HomeScreen() {
    const [userData, setUserData] = useState<FullProfile | null>(null);

    const { t } = useTranslation();

    useEffect(() => {
        async function handler() {
            try {
                const profile = await OrchestrateUserData();
                if (!profile) throw new Error("Why is userData null?");
                setUserData(profile);
            } catch (e) {
                logToConsole("Error orchestrating user data: " + e, "error");
            }
        }

        handler();
    }, []);

    async function changeLanguage(): Promise<void> {
        try {
            if (!userData) throw new Error("Why is userData (still) null?");
            userData.language = "es";
            await AsyncStorage.setItem(
                StoredItemNames.userData,
                JSON.stringify(userData),
            );
        } catch (e) {
            logToConsole("Error changing language:" + e, "error");
        }
    }

    return (
        <>
            <BetterTextHeader>{t("pages.profile.header")}</BetterTextHeader>
            <BetterTextSubHeader>
                {t("pages.profile.subheader", { username: userData?.username })}
            </BetterTextSubHeader>
            <BetterText
                fontSize={FontSizes.LARGER}
                isLink={true}
                fontWeight="Regular"
                onTap={changeLanguage}
            >
                SET LANGUAGE TO SPANISH HERE (dev purposes)
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
                action={() => router.navigate(ROUTES.DEV_INTERFACE.HOME)}
            />
        </>
    );
}
