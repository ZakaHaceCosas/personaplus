import React from "react";
import BetterButton from "@/components/interaction/better_button";
import Loading from "@/components/static/loading";
import PageEnd from "@/components/static/page_end";
import BetterTable, { BetterTableItem } from "@/components/ui/better_table";
import GapView from "@/components/ui/gap_view";
import Division from "@/components/ui/sections/division";
import Section from "@/components/ui/sections/section";
import ROUTES from "@/constants/routes";
import { OrchestrateUserData } from "@/toolkit/user";
import { logToConsole } from "@/toolkit/debug/console";
import {
    CheckForAnActiveObjectiveDailyStatus,
    GetActiveObjective,
    GetAllPendingObjectives,
    LaunchActiveObjective,
} from "@/toolkit/objectives/active_objectives";
import { ObjectiveDescriptiveIcons } from "@/toolkit/objectives/active_objectives_ui";
import { ActiveObjective } from "@/types/active_objectives";
import { FullProfile } from "@/types/user";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TopBar from "@/components/navigation/top_bar";
import { setNotificationHandler } from "expo-notifications";
import {
    areNotificationsScheduledForToday,
    cancelScheduledNotifications,
    scheduleRandomNotifications,
} from "@/hooks/use_notification";

setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export default function HomeScreen() {
    const { t } = useTranslation();
    const [userData, setUserData] = useState<FullProfile>();
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

    useEffect(() => {
        async function fetchUserData(): Promise<void> {
            try {
                // user data
                const userData: FullProfile = await OrchestrateUserData();
                // since OrchestrateUserData() never throws an error, we gotta identify values that are only possible if an ErrorUserData was returned, AKA a setup is needed
                if (userData.username === "Error" && userData.age === 0) {
                    router.replace(ROUTES.MAIN.WELCOME_SCREEN);
                    return;
                }
                setUserData(userData);
            } catch {
                router.replace(ROUTES.MAIN.WELCOME_SCREEN);
            }
        }
        fetchUserData();
    }, []);

    useEffect((): void => {
        async function fetchData(): Promise<void> {
            try {
                // TODO - if i move this to its own useEffect (identifiers), it fixes notifications useEffect re-running a lot of times but messes up the "Loading..." state.
                // objectives for UI
                const pending: number[] | 0 | false | null =
                    await GetAllPendingObjectives();
                setIdentifiers(pending);

                if (!Array.isArray(pending)) {
                    setAllObjectivesForTable([]);
                    setLoading(false);
                    return;
                }
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

                const allObjectives: ActiveObjective[] = [];
                for (const id of pending) {
                    const obj = await GetActiveObjective(id);
                    if (!obj) continue;
                    allObjectives.push(obj);
                }
                if (allObjectives.length === 0) {
                    setAllObjectivesForTable([]);
                    setLoading(false);
                    return;
                }
                const objectivesForTable: BetterTableItem[] = await Promise.all(
                    allObjectives.map(
                        async (
                            obj: ActiveObjective,
                        ): Promise<BetterTableItem> => ({
                            name: t(
                                `globals.supportedActiveObjectives.${obj.exercise}.name`,
                            ),
                            value: (await CheckForAnActiveObjectiveDailyStatus(
                                obj.identifier,
                            ))
                                ? t(
                                      "activeObjectives.today.content.headers.statusOptions.yes",
                                  )
                                : t(
                                      "activeObjectives.today.content.headers.statusOptions.no",
                                  ),
                        }),
                    ),
                );
                setAllObjectivesForTable(objectivesForTable);
                setLoading(false);
            } catch (e) {
                logToConsole("Error fetching data: " + e, "error");
            }
        }
        fetchData();
    }, [identifiers, t]);

    // notifications
    useEffect(() => {
        async function handle(): Promise<void> {
            const isRegistered: boolean =
                await areNotificationsScheduledForToday();
            // regular log instead of logToConsole because this is kinda broken and spam-logs this a thousand times
            // TODO - fix
            console.log("isRegistered status: " + isRegistered, "log");
            if (userData?.wantsNotifications === false && isRegistered) {
                await cancelScheduledNotifications(t, false);
                return;
            }
            if (
                userData?.wantsNotifications !== false &&
                !isRegistered &&
                Array.isArray(identifiers) &&
                identifiers.length > 0
            ) {
                await scheduleRandomNotifications(3, t);
            }
        }
        if (userData && identifiers !== null) {
            handle();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userData, identifiers]);

    if (loading) return <Loading />;

    return (
        <>
            <TopBar
                includeBackButton={false}
                header={t("pages.home.header", {
                    username: userData?.username,
                })}
                subHeader={t("pages.home.subheader")}
            />
            <Section width="total" kind="ActiveObjectives">
                <>
                    {identifiers === 0 ? (
                        <Division
                            header={t("activeObjectives.noObjectives.allDone")}
                        />
                    ) : identifiers === null ? (
                        <Division
                            header={t(
                                "activeObjectives.noObjectives.noObjectives",
                            )}
                        >
                            <BetterButton
                                style="GOD"
                                action={(): void =>
                                    router.push(ROUTES.ACTIVE_OBJECTIVES.CREATE)
                                }
                                buttonText={t(
                                    "activeObjectives.createObjective.text",
                                )}
                                buttonHint={t(
                                    "activeObjectives.createObjective.hint",
                                )}
                            />
                        </Division>
                    ) : identifiers === false ? (
                        <Division
                            header={t(
                                "activeObjectives.noObjectives.todayFree",
                            )}
                        />
                    ) : (
                        renderedObjectives &&
                        renderedObjectives.map((obj: ActiveObjective) => {
                            return (
                                <Division
                                    key={obj.identifier}
                                    header={t(
                                        `globals.supportedActiveObjectives.${obj.exercise}.name`,
                                    )}
                                    preHeader={t(
                                        "activeObjectives.allCapsSingular",
                                    )}
                                    direction="vertical"
                                >
                                    <ObjectiveDescriptiveIcons obj={obj} />
                                    <BetterButton
                                        buttonText={t(
                                            "globals.interaction.goAheadGood",
                                        )}
                                        buttonHint={t(
                                            "activeObjectives.start.hint",
                                        )}
                                        style="ACE"
                                        action={async (): Promise<void> =>
                                            await LaunchActiveObjective(
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
                {identifiers &&
                Array.isArray(identifiers) &&
                identifiers.length > 0 ? (
                    <Division
                        header={t("activeObjectives.today.content.header")}
                        subHeader={t(
                            "activeObjectives.today.content.subheader",
                        )}
                    >
                        <BetterTable
                            headers={[
                                t(
                                    "activeObjectives.today.content.headers.objective",
                                ),
                                t(
                                    "activeObjectives.today.content.headers.status",
                                ),
                            ]}
                            items={allObjectivesForTable}
                        />
                        <GapView height={5} />
                    </Division>
                ) : (
                    <Division
                        header={t("activeObjectives.today.content.header")}
                        subHeader={t("activeObjectives.today.noContent")}
                    />
                )}
            </Section>
            <PageEnd includeText={true} />
        </>
    );
}
