import BetterButton from "@/components/interaction/BetterButton";
import {
    BetterTextHeader,
    BetterTextSmallText,
    BetterTextSubHeader,
} from "@/components/text/BetterTextPresets";
import SafelyGoBack from "@/toolkit/Routing";
import * as Router from "expo-router";
import { LayoutContainer } from "@/app/(tabs)/_layout";
import GapView from "@/components/ui/GapView";
import ROUTES from "@/constants/Routes";

export default function NotFoundScreen() {
    const currentRoute: string = Router.usePathname();

    return (
        <>
            <LayoutContainer>
                <BetterTextHeader>Got a map?</BetterTextHeader>
                <BetterTextSubHeader>
                    You've got a 404 error - this means, PersonaPlus cannot find
                    the route you're looking for. We're sorry!
                </BetterTextSubHeader>
                <GapView height={20} />
                <BetterButton
                    style="ACE"
                    buttonText="Go back"
                    buttonHint="Redirects the user to the previous page (if possible). If not possible, it will redirect to the home page."
                    action={(): void => SafelyGoBack()}
                />
                <GapView height={10} />
                <BetterButton
                    style="DEFAULT"
                    buttonText="Go home directly"
                    buttonHint="Directly redirects the user to the home page"
                    action={() => Router.router.replace(ROUTES.MAIN.HOME)}
                />
                <GapView height={20} />
                <BetterTextSmallText>
                    The requested path was:{"\n"}
                    {currentRoute}.{"\n\n"}If you think this route is correct
                    and you should not be lost, we kindly ask you to submit a
                    GitHub issue so we can fix this. Thank you!
                </BetterTextSmallText>
            </LayoutContainer>
        </>
    );
}
