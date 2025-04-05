import React, { ReactElement } from "react";
import Loading from "@/components/static/loading";
import PageEnd from "@/components/static/page_end";
import Section from "@/components/ui/sections/section";
import { Routes } from "@/constants/routes";
import { OrchestrateUserData, ValidateUserData } from "@/toolkit/user";
import {
    FailObjectivesNotDoneYesterday,
    GetPendingActiveObjectives,
} from "@/toolkit/objectives/active_objectives";
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
import { GetObjective, PendingReturn } from "@/toolkit/objectives/common";
import { DisplayObjectives } from "@/toolkit/objectives/common_ui";
import GapView from "@/components/ui/gap_view";
import {
    GetAllPassiveObjectives,
    GetPendingPassiveObjectives,
} from "@/toolkit/objectives/passive_objectives";
import { PassiveObjective } from "@/types/passive_objectives";

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
    const [activeObjectives, setActiveObjectives] = useState<
        ActiveObjective[] | null
    >(null);
    const [passiveObjectives, setPassiveObjectives] = useState<
        PassiveObjective[]
    >([]);
    const [activeObjectiveIdentifiers, setActiveObjectiveIdentifiers] =
        useState<PendingReturn>("noneExists");
    const [passiveObjectiveIdentifiers, setPassiveObjectiveIdentifiers] =
        useState<PendingReturn>("noneExists");
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
                const pendingActive: PendingReturn =
                    await GetPendingActiveObjectives();
                setActiveObjectiveIdentifiers(pendingActive);
                const pendingPassive: PendingReturn =
                    await GetPendingPassiveObjectives();
                setPassiveObjectiveIdentifiers(pendingPassive);

                // handle passive objectives (first because active objectives have early returns)
                setPassiveObjectives((await GetAllPassiveObjectives()) ?? []);

                // handle active objectives
                if (!Array.isArray(pendingActive)) {
                    setActiveObjectives([]);
                    return;
                }
                const objectives: (ActiveObjective | null)[] =
                    await Promise.all(
                        pendingActive.map(
                            (id: number): Promise<ActiveObjective | null> =>
                                GetObjective(id, "active"),
                        ),
                    );
                const filteredObjectives: ActiveObjective[] = objectives.filter(
                    (obj: ActiveObjective | null): obj is ActiveObjective =>
                        obj !== null,
                );
                setActiveObjectives(filteredObjectives);
            } catch (e) {
                console.error(`Error fetching data: ${e}`);
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
                    Array.isArray(activeObjectiveIdentifiers) &&
                    activeObjectiveIdentifiers.length > 0
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
        identifiersLoaded,
        notificationsHandled,
        t,
    ]);

    // render stuff
    if (loading || !userData || !activeObjectives || !passiveObjectives) {
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
                <DisplayObjectives
                    objectives={activeObjectives}
                    identifiers={activeObjectiveIdentifiers}
                />
            </Section>
            <GapView height={20} />
            <Section width="total" kind="PassiveObjectives">
                <DisplayObjectives
                    objectives={passiveObjectives}
                    identifiers={passiveObjectiveIdentifiers}
                />
            </Section>
            <PageEnd includeText={true} />
        </>
    );
}
