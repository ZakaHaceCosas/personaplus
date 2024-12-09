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
    const [identifiersLoaded, setIdentifiersLoaded] = useState<boolean>(false);
    const [notificationsHandled, setNotificationsHandled] =
        useState<boolean>(false);

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

    useEffect(() => {
        async function fetchIdentifiers(): Promise<void> {
            try {
                const pending: number[] | 0 | false | null =
                    await GetAllPendingObjectives();
                setIdentifiers(pending);
            } catch (e) {
                logToConsole(`Error fetching identifiers: ${e}`, "error");
            } finally {
                setIdentifiersLoaded(true);
            }
        }
        fetchIdentifiers();
    }, []);

    useEffect((): void => {
        async function fetchData(): Promise<void> {
            try {
                if (!identifiersLoaded) return;

                if (!Array.isArray(identifiers)) {
                    setAllObjectivesForTable([]);
                    return;
                }
                const objectives: (ActiveObjective | null)[] =
                    await Promise.all(
                        identifiers.map(
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
                for (const id of identifiers) {
                    const obj = await GetActiveObjective(id);
                    if (!obj) continue;
                    allObjectives.push(obj);
                }
                if (allObjectives.length === 0) {
                    setAllObjectivesForTable([]);
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
            } catch (e) {
                logToConsole(`Error fetching data: ${e}`, "error");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [identifiersLoaded, identifiers, t]);

    // notifications
    useEffect(() => {
        async function handle(): Promise<void> {
            try {
                if (notificationsHandled === true) return;
                const isRegistered: boolean =
                    await areNotificationsScheduledForToday();
                console.log("isRegistered status:", isRegistered);
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
            } catch (e) {
                logToConsole(`Error handling notifications: ${e}`, "error");
            } finally {
                setNotificationsHandled(true);
            }
        }
        if (
            userData &&
            identifiersLoaded &&
            !notificationsHandled &&
            (identifiers !== null || identifiers === false || identifiers === 0)
        ) {
            handle();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userData, identifiers, identifiersLoaded, notificationsHandled]);

    if (loading || !identifiersLoaded || !userData || !notificationsHandled)
        return <Loading />;

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
