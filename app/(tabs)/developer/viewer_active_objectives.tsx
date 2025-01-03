import TopBar from "@/components/navigation/top_bar";
import Loading from "@/components/static/loading";
import PageEnd from "@/components/static/page_end";
import {
    BetterTextSmallHeader,
    BetterTextSmallText,
} from "@/components/text/better_text_presets";
import BetterTable, { BetterTableItem } from "@/components/ui/better_table";
import GapView from "@/components/ui/gap_view";
import { logToConsole } from "@/toolkit/debug/console";
import { GetAllObjectives } from "@/toolkit/objectives/active_objectives";
import { ActiveObjective } from "@/types/active_objectives";
import React, { useEffect, useState } from "react";

export default function ViewerActiveObjectives() {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [objectivesForTable, setObjectivesForTable] = useState<
        BetterTableItem[]
    >([]);
    const [detailedObjectives, setDetailedObjectives] = useState<
        ActiveObjective[]
    >([]);

    useEffect(() => {
        async function handler() {
            try {
                // objectives
                const objectives: ActiveObjective[] | null =
                    await GetAllObjectives();

                if (objectives) {
                    setObjectivesForTable(
                        objectives.map((obj: ActiveObjective) => ({
                            name: obj.exercise,
                            value: String(obj.identifier),
                        })),
                    );

                    setDetailedObjectives(objectives);
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
    }, [objectivesForTable]);

    if (loading) return <Loading />;

    return (
        <>
            <TopBar
                includeBackButton={true}
                header="Active Objectives"
                subHeader="View all your active objectives and their internal data."
            />
            {objectivesForTable.length > 0 ? (
                <>
                    <BetterTextSmallText>
                        All your objectives. The ID is just used by the app, to
                        differentiate objectives.
                    </BetterTextSmallText>
                    <GapView height={5} />
                    {error ? (
                        <BetterTextSmallText>{error}</BetterTextSmallText>
                    ) : (
                        <BetterTable
                            headers={["Objective", "ID"]}
                            items={objectivesForTable}
                        />
                    )}
                </>
            ) : (
                <BetterTextSmallText>No objectives!</BetterTextSmallText>
            )}
            <GapView height={10} />
            {detailedObjectives.map((obj, index) => (
                <>
                    <BetterTextSmallHeader>
                        {obj.identifier} - {obj.exercise}
                    </BetterTextSmallHeader>
                    <GapView height={5} />
                    <BetterTable
                        key={`TABLE_${index}`}
                        headers={["Key", "Value"]}
                        items={Object.entries(obj)
                            .filter(([_, value]) => typeof value !== "object")
                            .map(([key, value]) => ({
                                name: key,
                                value:
                                    typeof value === "object"
                                        ? JSON.stringify(value)
                                        : String(value),
                            }))}
                    />
                    <GapView height={5} />
                    <BetterTextSmallText>Generic info</BetterTextSmallText>
                    <GapView height={5} />
                    <BetterTable
                        key={`TABLE_${index}_INFO`}
                        headers={["Key", "Value"]}
                        items={Object.entries(obj.info).map(([key, value]) => ({
                            name: key,
                            value: String(value),
                        }))}
                    />
                    <GapView height={5} />
                    <BetterTextSmallText>Specific data</BetterTextSmallText>
                    <GapView height={5} />
                    <BetterTable
                        key={`TABLE_${index}_SPECIFIC_DATA`}
                        headers={["Key", "Value"]}
                        items={Object.entries(obj.specificData).map(
                            ([key, value]) => ({
                                name: key,
                                value: String(value),
                            }),
                        )}
                    />
                </>
            ))}
            <PageEnd includeText={false} size="tiny" />
        </>
    );
}
