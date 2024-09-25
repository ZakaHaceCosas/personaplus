import BetterButton from "@/components/interaction/BetterButton";
import {
    BetterTextHeader,
    BetterTextSubHeader,
} from "@/components/text/BetterTextPresets";
import { router } from "expo-router";

export default function HomeScreen() {
    return (
        <>
            <BetterTextHeader>Dashboard</BetterTextHeader>
            <BetterTextSubHeader>
                Setup your path to success here
            </BetterTextSubHeader>
            <BetterButton
                buttonText={"Create active objective"}
                style="GOD"
                action={() => router.push("objectives/Create")}
            />
        </>
    );
}
