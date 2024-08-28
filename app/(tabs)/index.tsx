import Swap from "@/components/interaction/Swap";
import {
    BetterTextExtraHeader,
    BetterTextHeader,
    BetterTextSubHeader,
} from "@/components/text/BetterTextPresets";
import GapView from "@/components/ui/GapView";
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
            {/* BEGIN DELETE ME */}
            <GapView height={40} />
            <BetterTextExtraHeader>tests:</BetterTextExtraHeader>
            <Swap
                value="a"
                order="horizontal"
                onValueChange={() => {}}
                options={[
                    {
                        value: "a",
                        label: "hola",
                        default: false,
                    },
                    {
                        value: "c",
                        label: "adios",
                        default: false,
                    },
                ]}
            />
        </>
    );
}
