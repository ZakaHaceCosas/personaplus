import React, { ReactElement } from "react";
import Loading from "@/components/static/loading";
import PageEnd from "@/components/static/page_end";
import Section from "@/components/ui/sections/section";
import { Routes } from "@/constants/routes";
import { OrchestrateUserData, ValidateUserData } from "@/toolkit/user";
import {
    GetActiveObjective,
    GetPendingActiveObjectives,
    LaunchActiveObjective,
} from "@/toolkit/objectives/active_objectives";
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
import { FailGenericObjectivesNotDoneYesterday } from "@/toolkit/objectives/common";
import GapView from "@/components/ui/gap_view";
import {
    GetPassiveObjective,
    GetPassiveObjectiveStreak,
    GetPendingPassiveObjectives,
    SavePassiveObjectiveToDailyLog,
} from "@/toolkit/objectives/passive_objectives";
import { PassiveObjective } from "@/types/passive_objectives";
import BetterButton from "@/components/interaction/better_button";
import Division from "@/components/ui/sections/division";
import { ActiveObjective } from "@/types/active_objectives";
import { ObjectiveDescriptiveIcons } from "@/toolkit/objectives/active_objectives_ui";
import {
    AllObjectivesPendingReturn,
    IsActiveObjective,
} from "@/types/common_objectives";
import { HandlePendingReturn } from "@/toolkit/objectives/common_ui";
import { ShowToast } from "@/toolkit/android";

setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export default function HomeScreen(): ReactElement {
    const { t } = useTranslation();
    const [userData, setUserData] = useState<FullProfile>();
    const [loading, setLoading] = useState<boolean>(true);
    const [activeObjectiveIdentifiers, setActiveObjectiveIdentifiers] =
        useState<AllObjectivesPendingReturn>("noneExists");
    const [passiveObjectiveIdentifiers, setPassiveObjectiveIdentifiers] =
        useState<AllObjectivesPendingReturn>("noneExists");
    const [activeObjectivesToRender, setActiveObjectivesToRender] = useState<
        ActiveObjective[]
    >([]);
    const [passiveObjectivesToRender, setPassiveObjectivesToRender] = useState<
        { obj: PassiveObjective; streak: number }[]
    >([]);
    const [identifiersLoaded, setIdentifiersLoaded] = useState<boolean>(false);
    const [notificationsHandled, setNotificationsHandled] =
        useState<boolean>(false);

    useEffect((): void => {
        async function handler(): Promise<void> {
            // handle stuff not done yesterday
            await FailGenericObjectivesNotDoneYesterday("active");
            await FailGenericObjectivesNotDoneYesterday("passive");
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
                const pendingActive: AllObjectivesPendingReturn =
                    await GetPendingActiveObjectives();
                setActiveObjectiveIdentifiers(pendingActive);

                const pendingPassive: AllObjectivesPendingReturn =
                    await GetPendingPassiveObjectives();
                setPassiveObjectiveIdentifiers(pendingPassive);

                if (Array.isArray(pendingActive)) {
                    const arr = await Promise.all(
                        pendingActive.map(GetActiveObjective),
                    );
                    setActiveObjectivesToRender(arr.filter((o) => o !== null));
                }
                if (Array.isArray(pendingPassive)) {
                    const arr = (
                        await Promise.all(
                            pendingPassive.map(GetPassiveObjective),
                        )
                    ).filter((o) => o !== null);
                    const objectivesWithStreak = await Promise.all(
                        arr.map(async (o) => ({
                            obj: o,
                            streak: await GetPassiveObjectiveStreak(
                                o.identifier,
                            ),
                        })),
                    );

                    setPassiveObjectivesToRender(objectivesWithStreak);
                }
            } catch (e) {
                ShowToast(e as string);
                console.error(`Error fetching data: ${e}`);
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
                    Array.isArray(activeObjectiveIdentifiers) &&
                    activeObjectiveIdentifiers.length > 0 &&
                    Array.isArray(passiveObjectiveIdentifiers) &&
                    passiveObjectiveIdentifiers.length > 0
                ) {
                    await scheduleRandomNotifications(t);
                }
            } catch (e) {
                console.error(`Error handling notifications: ${e}`);
            } finally {
                setNotificationsHandled(true);
            }
        }

        handle();
    }, [
        userData,
        activeObjectiveIdentifiers,
        passiveObjectiveIdentifiers,
        identifiersLoaded,
        notificationsHandled,
        t,
    ]);

    // render stuff
    if (loading || !userData || !identifiersLoaded) return <Loading />;

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
                {activeObjectivesToRender.length === 0 && (
                    <HandlePendingReturn
                        renderer={
                            Array.isArray(activeObjectiveIdentifiers)
                                ? "allDone"
                                : activeObjectiveIdentifiers
                        }
                    />
                )}
                {activeObjectivesToRender.map(
                    (obj: ActiveObjective): ReactElement => (
                        <Division
                            key={obj.identifier}
                            header={t(
                                `globals.supportedActiveObjectives.${obj.exercise}.name`,
                            )}
                            preHeader={t(`objectives.active.allCapsSingular`)}
                            direction="vertical"
                        >
                            <ObjectiveDescriptiveIcons obj={obj} />
                            <BetterButton
                                buttonText={t(
                                    IsActiveObjective(obj)
                                        ? "globals.interaction.goAheadGood"
                                        : "objectives.passive.log.text",
                                )}
                                buttonHint={t(
                                    `objectives.${IsActiveObjective(obj) ? "active.start.hint" : "passive.log.hint"}`,
                                )}
                                style="ACE"
                                action={async (): Promise<void> =>
                                    await LaunchActiveObjective(obj.identifier)
                                }
                            />
                        </Division>
                    ),
                )}
            </Section>
            <GapView height={20} />
            <Section width="total" kind="PassiveObjectives">
                {passiveObjectivesToRender.length === 0 && (
                    <HandlePendingReturn
                        renderer={
                            Array.isArray(passiveObjectiveIdentifiers)
                                ? "allDone"
                                : passiveObjectiveIdentifiers
                        }
                    />
                )}
                {passiveObjectivesToRender.map(
                    (o: {
                        obj: PassiveObjective;
                        streak: number;
                    }): ReactElement => (
                        <Division
                            key={o.obj.identifier}
                            header={`${o.obj.goal} · ${o.streak}`}
                            preHeader={t(`objectives.passive.allCapsSingular`)}
                            direction="vertical"
                        >
                            <BetterButton
                                buttonText={t("objectives.passive.log.text")}
                                buttonHint={t(`objectives.passive.log.hint`)}
                                style="ACE"
                                action={async (): Promise<void> => {
                                    await SavePassiveObjectiveToDailyLog(
                                        o.obj.identifier,
                                        true,
                                    );
                                    setPassiveObjectivesToRender(
                                        passiveObjectivesToRender.filter(
                                            (ob) =>
                                                ob.obj.identifier !==
                                                o.obj.identifier,
                                        ),
                                    );
                                }}
                            />
                        </Division>
                    ),
                )}
            </Section>
            <PageEnd includeText={true} />
        </>
    );
}
