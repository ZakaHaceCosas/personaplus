import BetterButton from "@/components/interaction/BetterButton";
import Loading from "@/components/static/Loading";
import PageEnd from "@/components/static/PageEnd";
import {
    BetterTextHeader,
    BetterTextSubHeader,
} from "@/components/text/BetterTextPresets";
import GapView from "@/components/ui/GapView";
import Division from "@/components/ui/sections/Division";
import Section from "@/components/ui/sections/Section";
import ROUTES from "@/constants/Routes";

import { OrchestrateUserData } from "@/toolkit/User";
import { logToConsole } from "@/toolkit/debug/Console";
import {
    GetActiveObjective,
    GetAllPendingObjectives,
} from "@/toolkit/objectives/ActiveObjectives";
import {
    ActiveObjective,
    SupportedActiveObjectives,
} from "@/types/ActiveObjectives";
import { FullProfile } from "@/types/User";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function HomeScreen() {
    const { t } = useTranslation();
    const [userData, setUserData] = useState<FullProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [renderedObjectives, setRenderedObjectives] = useState<
        ActiveObjective[] | null
    >(null);
    const [identifiers, setIdentifiers] = useState<number[] | false | 0 | null>(
        null,
    );

    async function fetchObjectives(): Promise<void> {
        try {
            const pending: number[] | 0 | false | null =
                await GetAllPendingObjectives();
            setIdentifiers(pending);

            if (!Array.isArray(pending)) {
                if (!pending || pending === 0 || pending === false) return;
            }

            const objectives = await Promise.all(
                pending.map((identifier) => GetActiveObjective(identifier)),
            );

            const filteredObjectives = objectives.filter(
                (obj): obj is ActiveObjective => obj !== null,
            );
            setRenderedObjectives(filteredObjectives);
        } catch (e) {
            logToConsole(
                "Error rendering objectives: " + e,
                "error",
                {
                    location: "@/components/ui/sections/interface/Home.tsx",
                    isHandler: true,
                    handlerName: "renderObjectives() @ try-catch #1",
                    function: "RenderActiveObjectives()",
                },
                false,
            );
        }
    }

    async function fetchUserData(): Promise<void> {
        try {
            const response = await OrchestrateUserData();
            setUserData(response);
        } catch (e) {
            logToConsole("Error accessing user data! " + e, "error", {
                location: "@/app/(tabs)/index.tsx",
                function: "fetchUserData()",
                isHandler: false,
            });
        }
    }

    async function handler() {
        try {
            await fetchUserData();
            await fetchObjectives();
        } catch (e) {
            throw e;
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // load both user data and objectives at the same time
        setLoading(true);
        Promise.all([handler()]);
        // eslint-disable-next-line
    }, []);

    function generateDescriptionOfObjective(obj: ActiveObjective): string {
        const exercise: SupportedActiveObjectives = obj.exercise;
        if (exercise === "Lifting") {
            return t(
                obj.specificData.reps +
                    " lifts of " +
                    obj.specificData.dumbbellWeight *
                        obj.specificData.amountOfHands +
                    " kg each.",
            );
        } else if (exercise === "Push Ups") {
            return t(
                obj.specificData.amountOfPushUps +
                    " push ups with " +
                    obj.specificData.amountOfHands +
                    " hands.",
            );
            // TODO: finish these
        } else {
            return "(There was an error reading this objective's data)";
        }
    }

    function handleLaunchObjective(identifier: number): void {
        try {
            router.replace({
                pathname: ROUTES.ACTIVE_OBJECTIVES.SESSION,
                params: { id: identifier },
            });
        } catch (e) {
            logToConsole("Error starting session: " + e, "error");
        }
    }

    if (loading) return <Loading />;

    return (
        <>
            <BetterTextHeader>
                {t("pages.home.header", { username: userData?.username })}
            </BetterTextHeader>
            <BetterTextSubHeader>
                {t("pages.home.subheader")}
            </BetterTextSubHeader>
            <GapView height={20} />
            <Section width="total" kind="ActiveObjectives">
                <>
                    {identifiers === 0 && (
                        <Division header="Guess you've done everything!" />
                    )}

                    {identifiers === null && (
                        <Division header="You don't have any objectives... Let's create one!">
                            <BetterButton
                                style="GOD"
                                action={() =>
                                    router.push(ROUTES.ACTIVE_OBJECTIVES.CREATE)
                                }
                                buttonText="Create active objective"
                                buttonHint="Redirects the user to a page where he can create an active objective"
                            />
                        </Division>
                    )}

                    {identifiers === false && (
                        <Division header="No objectives for today. Have a good rest!" />
                    )}

                    {renderedObjectives &&
                        renderedObjectives.map((obj: ActiveObjective) => {
                            return (
                                <Division
                                    key={obj.identifier}
                                    header={obj.exercise}
                                    preHeader="ACTIVE OBJECTIVE"
                                    subHeader={generateDescriptionOfObjective(
                                        obj,
                                    )}
                                >
                                    <BetterButton
                                        buttonText="Let's go!"
                                        buttonHint="Starts a session for the given objective"
                                        style="ACE"
                                        action={() =>
                                            handleLaunchObjective(
                                                obj.identifier,
                                            )
                                        }
                                    />
                                </Division>
                            );
                        })}
                </>
            </Section>
            <PageEnd includeText={true} />
        </>
    );
}
