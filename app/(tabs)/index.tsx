import BetterButton from "@/components/interaction/BetterButton";
import Loading from "@/components/static/Loading";
import PageEnd from "@/components/static/PageEnd";
import {
    BetterTextHeader,
    BetterTextSubHeader,
} from "@/components/text/BetterTextPresets";
import BetterTable, { BetterTableItem } from "@/components/ui/BetterTable";
import GapView from "@/components/ui/GapView";
import Division from "@/components/ui/sections/Division";
import Section from "@/components/ui/sections/Section";
import ROUTES from "@/constants/Routes";

import { OrchestrateUserData } from "@/toolkit/User";
import { logToConsole } from "@/toolkit/debug/Console";
import {
    CheckForAnActiveObjectiveDailyStatus,
    GenerateDescriptionOfObjective,
    GetActiveObjective,
    GetAllObjectives,
    GetAllPendingObjectives,
} from "@/toolkit/objectives/ActiveObjectives";
import { ActiveObjective } from "@/types/ActiveObjectives";
import { FullProfile } from "@/types/User";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function HomeScreen() {
    const { t } = useTranslation();
    const [userData, setUserData] = useState<FullProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [allObjectivesForTable, setAllObjectivesForTable] = useState<
        BetterTableItem[]
    >([]);
    const [renderedObjectives, setRenderedObjectives] = useState<
        ActiveObjective[] | null
    >(null);
    const [identifiers, setIdentifiers] = useState<number[] | false | 0 | null>(
        null,
    );

    async function fetchData(): Promise<void> {
        try {
            // user data
            const userData: FullProfile | null = await OrchestrateUserData();
            setUserData(userData);

            // objectives for UI
            const pending: number[] | 0 | false | null =
                await GetAllPendingObjectives();
            setIdentifiers(pending);

            if (Array.isArray(pending)) {
                const objectives: (ActiveObjective | null)[] =
                    await Promise.all(
                        pending.map(
                            (
                                identifier: number,
                            ): Promise<ActiveObjective | null> =>
                                GetActiveObjective(identifier),
                        ),
                    );

                const filteredObjectives: ActiveObjective[] = objectives.filter(
                    (obj: ActiveObjective | null): obj is ActiveObjective =>
                        obj !== null,
                );
                setRenderedObjectives(filteredObjectives);
            }

            // objectives for table
            const allObjectives: ActiveObjective[] | null =
                await GetAllObjectives();
            if (allObjectives) {
                const objectivesForTable: BetterTableItem[] = await Promise.all(
                    allObjectives.map(
                        async (
                            obj: ActiveObjective,
                        ): Promise<BetterTableItem> => ({
                            name: obj.exercise,
                            value: (await CheckForAnActiveObjectiveDailyStatus(
                                obj.identifier,
                            ))
                                ? "Done"
                                : "Pending",
                        }),
                    ),
                );
                setAllObjectivesForTable(objectivesForTable);
            }
        } catch (e) {
            logToConsole("Error fetching data: " + e, "error");
        } finally {
            setLoading(false);
        }
    }

    useEffect((): void => {
        setLoading(true);
        Promise.all([fetchData()]);
    }, []);

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
                    {identifiers === 0 ? (
                        <Division header="Guess you've done everything!" />
                    ) : identifiers === null ? (
                        <Division header="You don't have any objectives... Let's create one!">
                            <BetterButton
                                style="GOD"
                                action={(): void =>
                                    router.push(ROUTES.ACTIVE_OBJECTIVES.CREATE)
                                }
                                buttonText="Create active objective"
                                buttonHint="Redirects the user to a page where he can create an active objective"
                            />
                        </Division>
                    ) : identifiers === false ? (
                        <Division header="No objectives for today. Have a good rest!" />
                    ) : (
                        renderedObjectives &&
                        renderedObjectives.map((obj: ActiveObjective) => {
                            return (
                                <Division
                                    key={obj.identifier}
                                    header={obj.exercise}
                                    preHeader="ACTIVE OBJECTIVE"
                                    subHeader={GenerateDescriptionOfObjective(
                                        obj,
                                        t,
                                    )}
                                >
                                    <BetterButton
                                        buttonText="Let's go!"
                                        buttonHint="Starts a session for the given objective"
                                        style="ACE"
                                        action={(): void =>
                                            handleLaunchObjective(
                                                obj.identifier,
                                            )
                                        }
                                    />
                                </Division>
                            );
                        })
                    )}
                </>
            </Section>
            <GapView height={20} />
            <Section kind="HowYouAreDoing">
                <Division
                    header="Today"
                    subHeader="This table is temporary, as the app is a WIP. It will be overhauled and moved to the Dashboard."
                >
                    <BetterTable
                        headers={["Objective", "Status"]}
                        items={allObjectivesForTable}
                    />
                    <GapView height={5} />
                </Division>
            </Section>
            <PageEnd includeText={true} />
        </>
    );
}
