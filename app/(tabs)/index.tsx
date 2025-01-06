import React from "react";
import BetterButton from "@/components/interaction/better_button";
import Loading from "@/components/static/loading";
import PageEnd from "@/components/static/page_end";
import BetterTable, { BetterTableItem } from "@/components/ui/better_table";
import GapView from "@/components/ui/gap_view";
import Division from "@/components/ui/sections/division";
import Section from "@/components/ui/sections/section";
import { Routes } from "@/constants/routes";
import { OrchestrateUserData, ValidateUserData } from "@/toolkit/user";
import { logToConsole } from "@/toolkit/console";
import {
    CheckForAnActiveObjectiveDailyStatus,
    FailObjectivesNotDoneYesterday,
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
    const [identifiersLoaded, setIdentifiersLoaded] = useState<boolean>(false);
    const [notificationsHandled, setNotificationsHandled] =
        useState<boolean>(false);

    useEffect(() => {
        async function fetchData(): Promise<void> {
            try {
                // fetch user
                const userData: FullProfile = await OrchestrateUserData();
                if (!ValidateUserData(userData, "Full")) {
                    router.replace(Routes.MAIN.WELCOME_SCREEN);
                    return;
                }
                setUserData(userData);

                // fetch IDs
                await FailObjectivesNotDoneYesterday();
                const pending: number[] | 0 | false | null =
                    await GetAllPendingObjectives();
                setIdentifiers(pending);

                // handle objectives
                // PS. if you wonder why i didn't instead do
                // if (!array.isArray(pending)) { setStuff([]) }
                // to save an indent level, it's because type error happens
                // if i do that :/
                if (Array.isArray(pending)) {
                    const objectives: (ActiveObjective | null)[] =
                        await Promise.all(
                            pending.map(
                                (id: number): Promise<ActiveObjective | null> =>
                                    GetActiveObjective(id),
                            ),
                        );
                    const filteredObjectives: ActiveObjective[] =
                        objectives.filter(
                            (
                                obj: ActiveObjective | null,
                            ): obj is ActiveObjective => obj !== null,
                        );
                    setRenderedObjectives(filteredObjectives);

                    if (filteredObjectives.length > 0) {
                        const objectivesForTable: BetterTableItem[] =
                            await Promise.all(
                                filteredObjectives.map(
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
                    } else {
                        setAllObjectivesForTable([]);
                    }
                } else {
                    setRenderedObjectives([]);
                    setAllObjectivesForTable([]);
                }
            } catch (e) {
                logToConsole(`Error fetching data: ${e}`, "error");
                router.replace(Routes.MAIN.WELCOME_SCREEN);
            } finally {
                setIdentifiersLoaded(true);
                setLoading(false);
            }
        }

        fetchData();
    }, [t]);

    // handle notifications (most issues came from here bruh)
    useEffect(() => {
        async function handle(): Promise<void> {
            if (notificationsHandled || !userData || !identifiersLoaded) return;

            try {
                const isRegistered: boolean =
                    await areNotificationsScheduledForToday();
                if (userData.wantsNotifications === false && isRegistered) {
                    await cancelScheduledNotifications(t, false);
                } else if (
                    userData &&
                    userData.wantsNotifications !== false &&
                    !isRegistered &&
                    Array.isArray(identifiers) &&
                    identifiers.length > 0
                ) {
                    await scheduleRandomNotifications(3, t);
                }
            } catch (e) {
                logToConsole(`Error handling notifications: ${e}`, "error");
            } finally {
                setNotificationsHandled(true);
            }
        }

        handle();
    }, [userData, identifiers, identifiersLoaded, notificationsHandled, t]);

    // render stuff
    if (loading) return <Loading />;
    if (!userData || !renderedObjectives || !allObjectivesForTable) {
        return <Loading />;
    }

    return (
        <>
            <TopBar
                includeBackButton={false}
                header={t("pages.home.header", {
                    username: userData.username,
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
                                    router.push(Routes.ACTIVE_OBJECTIVES.CREATE)
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
