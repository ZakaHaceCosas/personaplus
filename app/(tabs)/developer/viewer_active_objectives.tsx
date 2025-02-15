import TopBar from "@/components/navigation/top_bar";
import Loading from "@/components/static/loading";
import PageEnd from "@/components/static/page_end";
import {
    BetterTextSmallHeader,
    BetterTextSmallText,
} from "@/components/text/better_text_presets";
import BetterTable, { BetterTableItem } from "@/components/ui/better_table";
import GapView from "@/components/ui/gap_view";
import { logToConsole } from "@/toolkit/console";
import { GetAllObjectives } from "@/toolkit/objectives/common";
import { ActiveObjective, WeekTuple } from "@/types/active_objectives";
import { PassiveObjective } from "@/types/passive_objectives";
import React, { ReactElement, useEffect, useState } from "react";

export default function ViewerActiveObjectives(): ReactElement {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeObjectives, setActiveObjectives] = useState<ActiveObjective[]>(
        [],
    );
    const [passiveObjectives, setPassiveObjectives] = useState<
        PassiveObjective[]
    >([]);

    function representDataAsBetterTable(
        data: ActiveObjective["info"] | ActiveObjective["specificData"],
    ): BetterTableItem[] {
        return Object.entries(data).map(
            ([key, value]: [string, number | WeekTuple]): {
                name: string;
                value: string;
            } => ({
                name: key,
                value:
                    typeof value === "object"
                        ? JSON.stringify(value)
                        : String(value),
            }),
        );
    }

    useEffect((): void => {
        async function handler(): Promise<void> {
            try {
                // objectives
                const objectives: ActiveObjective[] | null =
                    await GetAllObjectives("active");

                if (objectives) {
                    setActiveObjectives(objectives);
                }

                const passiveObjectives: PassiveObjective[] | null =
                    await GetAllObjectives("passive");

                if (passiveObjectives) {
                    setPassiveObjectives(passiveObjectives);
                }
            } catch (e) {
                const err = `Error fetching data at DevInterface: ${e}`;
                logToConsole(err, "error");
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        handler();
    }, []);

    if (loading) return <Loading />;

    return (
        <>
            <TopBar
                includeBackButton={true}
                header="Objectives"
                subHeader="View all your active & passive objectives and their internal data."
            />
            {passiveObjectives.length > 0 ? (
                <>
                    <BetterTextSmallText>
                        All your passive objectives. The ID is just used by the
                        app, to differentiate objectives.
                    </BetterTextSmallText>
                    <GapView height={5} />
                    {error ? (
                        <BetterTextSmallText>{error}</BetterTextSmallText>
                    ) : (
                        <BetterTable
                            headers={["Goal", "ID"]}
                            items={passiveObjectives.map(
                                (obj: PassiveObjective): BetterTableItem => {
                                    return {
                                        name: obj.goal,
                                        value: obj.identifier.toString(),
                                    };
                                },
                            )}
                        />
                    )}
                </>
            ) : (
                <BetterTextSmallText>No objectives!</BetterTextSmallText>
            )}
            {activeObjectives.length > 0 ? (
                <>
                    <BetterTextSmallText>
                        All your active objectives. The ID is just used by the
                        app, to differentiate objectives.
                    </BetterTextSmallText>
                    <GapView height={5} />
                    {error ? (
                        <BetterTextSmallText>{error}</BetterTextSmallText>
                    ) : (
                        <BetterTable
                            headers={["Objective", "ID"]}
                            items={activeObjectives.map(
                                (obj: ActiveObjective): BetterTableItem => {
                                    return {
                                        name: obj.exercise,
                                        value: obj.identifier.toString(),
                                    };
                                },
                            )}
                        />
                    )}
                </>
            ) : (
                <BetterTextSmallText>No objectives!</BetterTextSmallText>
            )}
            <GapView height={10} />
            {activeObjectives.map(
                (obj: ActiveObjective, index: number): ReactElement => (
                    <>
                        <BetterTextSmallHeader>
                            {obj.identifier} - {obj.exercise}
                        </BetterTextSmallHeader>
                        <GapView height={5} />
                        <BetterTable
                            key={`TABLE_${index}`}
                            headers={["Key", "Value"]}
                            items={Object.entries(obj).map(
                                ([key, value]: [string, unknown]): {
                                    name: string;
                                    value: string;
                                } => ({
                                    name: key,
                                    value: String(value),
                                }),
                            )}
                        />
                        <GapView height={5} />
                        <BetterTextSmallText>Generic info</BetterTextSmallText>
                        <GapView height={5} />
                        <BetterTable
                            key={`TABLE_${index}_INFO`}
                            headers={["Key", "Value"]}
                            items={representDataAsBetterTable(obj.info)}
                        />
                        <GapView height={5} />
                        <BetterTextSmallText>Specific data</BetterTextSmallText>
                        <GapView height={5} />
                        <BetterTable
                            key={`TABLE_${index}_SPECIFIC_DATA`}
                            headers={["Key", "Value"]}
                            items={representDataAsBetterTable(obj.specificData)}
                        />
                    </>
                ),
            )}
            <PageEnd includeText={false} size="tiny" />
        </>
    );
}
