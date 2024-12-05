import React from "react";
import BetterButton from "@/components/interaction/BetterButton";
import Loading from "@/components/static/Loading";
import PageEnd from "@/components/static/PageEnd";
import { BetterTextNormalText } from "@/components/text/BetterTextPresets";
import BetterTable, { BetterTableItem } from "@/components/ui/BetterTable";
import GapView from "@/components/ui/GapView";
import Division from "@/components/ui/sections/Division";
import Section from "@/components/ui/sections/Section";
import ROUTES from "@/constants/Routes";

import { OrchestrateUserData } from "@/toolkit/User";
import { logToConsole } from "@/toolkit/debug/Console";
import {
    CheckForAnActiveObjectiveDailyStatus,
    GetActiveObjective,
    GetAllObjectives,
    GetAllPendingObjectives,
    LaunchActiveObjective,
} from "@/toolkit/objectives/ActiveObjectives";
import { ObjectiveDescriptiveIcons } from "@/toolkit/objectives/ActiveObjectivesUi";
import { ActiveObjective } from "@/types/ActiveObjectives";
import { FullProfile } from "@/types/User";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TopBar from "@/components/navigation/TopBar";

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

    useEffect((): void => {
        async function fetchData(): Promise<void> {
            try {
                // user data
                const userData: FullProfile = await OrchestrateUserData();
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

                    const filteredObjectives: ActiveObjective[] =
                        objectives.filter(
                            (
                                obj: ActiveObjective | null,
                            ): obj is ActiveObjective => obj !== null,
                        );
                    setRenderedObjectives(filteredObjectives);
                }

                // objectives for table
                const allObjectives: ActiveObjective[] | null =
                    await GetAllObjectives();
                if (allObjectives) {
                    const objectivesForTable: BetterTableItem[] =
                        await Promise.all(
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
                }
            } catch (e) {
                if (String(e).includes("null")) {
                    router.replace(ROUTES.MAIN.WELCOME_SCREEN);
                    return;
                }
                logToConsole("Error fetching data: " + e, "error");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [t]);

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
                {(identifiers &&
                    Array.isArray(identifiers) &&
                    identifiers.length >= 1) ||
                identifiers === 0 ? (
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
                    <Division header="Today">
                        <BetterTextNormalText>
                            {t("activeObjectives.today.noContent")}
                        </BetterTextNormalText>
                    </Division>
                )}
            </Section>
            <PageEnd includeText={true} />
        </>
    );
}
