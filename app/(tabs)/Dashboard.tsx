import BetterButton from "@/components/interaction/BetterButton";
import {
    BetterTextHeader,
    BetterTextSubHeader,
} from "@/components/text/BetterTextPresets";
import Routes from "@/constants/Routes";
import { router } from "expo-router";

export default function HomeScreen() {
    return (
        <>
            <BetterTextHeader>Dashboard</BetterTextHeader>
            <BetterTextSubHeader>
                Setup your path to success here
            </BetterTextSubHeader>
            <BetterButton
                buttonText="Create active objective"
                buttonHint="Redirects the user to a page where he can create an active objective"
                style="GOD"
                action={() => router.push(Routes.Objectives.Create)}
            />
        </>
    );
}
