import React from "react";
import BetterButton from "@/components/interaction/BetterButton";
import { BetterTextSmallText } from "@/components/text/BetterTextPresets";
import * as Router from "expo-router";
import { LayoutContainer } from "@/app/(tabs)/_layout";
import GapView from "@/components/ui/GapView";
import ROUTES from "@/constants/Routes";
import TopBar from "@/components/navigation/TopBar";

export default function NotFoundScreen() {
    const currentRoute: string = Router.usePathname();

    return (
        <>
            <LayoutContainer>
                <TopBar
                    includeBackButton={true}
                    header="Got a map?"
                    subHeader="You've got a 404 error - this means, PersonaPlus cannot find the route you're looking for. Sorry!"
                />
                <BetterButton
                    style="DEFAULT"
                    buttonText="Go home"
                    buttonHint="Directly redirects the user to the home page"
                    action={() => Router.router.replace(ROUTES.MAIN.HOME)}
                />
                <GapView height={20} />
                <BetterTextSmallText>
                    The requested path was:{"\n"}
                    {currentRoute}
                    {"\n\n"}If you think this route is correct and you should
                    not be lost, we kindly ask you to submit a GitHub issue so
                    we can fix this. Thank you!
                </BetterTextSmallText>
            </LayoutContainer>
        </>
    );
}
