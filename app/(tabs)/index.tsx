import React, { ReactElement } from "react";
import BetterButton from "@/components/interaction/better_button";
import Loading from "@/components/static/loading";
import PageEnd from "@/components/static/page_end";
import Division from "@/components/ui/sections/division";
import Section from "@/components/ui/sections/section";
import { Routes } from "@/constants/routes";
import { OrchestrateUserData, ValidateUserData } from "@/toolkit/user";
import { logToConsole } from "@/toolkit/console";
import {
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

export default function HomeScreen(): ReactElement {
    const { t } = useTranslation();
    const [userData, setUserData] = useState<FullProfile>();
    const [loading, setLoading] = useState<boolean>(true);
    const [renderedObjectives, setRenderedObjectives] = useState<
        ActiveObjective[] | null
    >(null);
    const [identifiers, setIdentifiers] = useState<number[] | false | 0 | null>(
        null,
    );
    const [identifiersLoaded, setIdentifiersLoaded] = useState<boolean>(false);
    const [notificationsHandled, setNotificationsHandled] =
        useState<boolean>(false);

    useEffect((): void => {
        async function handler(): Promise<void> {
            // handle stuff not done yesterday
            await FailObjectivesNotDoneYesterday();
        }
        handler();
    }, []);

    useEffect((): void => {
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
                const pending: number[] | 0 | false | null =
                    await GetAllPendingObjectives();
                setIdentifiers(pending);

                // handle objectives
                if (!Array.isArray(pending)) {
                    setRenderedObjectives([]);
                    return;
                }
                const objectives: (ActiveObjective | null)[] =
                    await Promise.all(
                        pending.map(
                            (id: number): Promise<ActiveObjective | null> =>
                                GetActiveObjective(id),
                        ),
                    );
                const filteredObjectives: ActiveObjective[] = objectives.filter(
                    (obj: ActiveObjective | null): obj is ActiveObjective =>
                        obj !== null,
                );
                setRenderedObjectives(filteredObjectives);
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
    useEffect((): void => {
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
                    await scheduleRandomNotifications(t);
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
    if (loading || !userData || !renderedObjectives) {
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
                        renderedObjectives.map(
                            (obj: ActiveObjective): ReactElement => (
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
                            ),
                        )
                    )}
                </>
            </Section>
            <PageEnd includeText={true} />
        </>
    );
}
