// FIXME:  this is broken
import Loading from "@/components/static/Loading";
import { logToConsole } from "@/toolkit/debug/Console";
import {
    GetAllPendingObjectives,
    GetActiveObjective,
    SaveActiveObjectiveToDailyLog,
} from "@/toolkit/objectives/ActiveObjectives";
import { ReactNode, useCallback, useEffect, useState } from "react";
import Division from "@/components/ui/sections/Division";
import {
    ActiveObjective,
    SupportedActiveObjectives,
} from "@/types/ActiveObjectives";
import { useTranslation } from "react-i18next";
import BetterButton from "@/components/interaction/BetterButton";
import GapView from "../../GapView";

export function RenderActiveObjectives(): ReactNode {
    const [identifiers, setIdentifiers] = useState<number[] | false | 0 | null>(
        null,
    );
    const [loading, setLoading] = useState(true);
    const [renderedObjectives, setRenderedObjectives] = useState<
        ActiveObjective[] | null
    >(null);

    const { t } = useTranslation();

    async function handler(): Promise<void> {
        try {
            const pending: number[] | 0 | false | null =
                await GetAllPendingObjectives();
            setIdentifiers(pending);
        } catch (e) {
            logToConsole(
                "Error with RenderActiveObjective 1st handler(), " + e,
                "error",
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handler();
    }, []);

    // handles rendering objectives (to get an active objective we use async functions so yeah)
    const renderActiveObjectives: () => Promise<void> =
        useCallback(async (): Promise<void> => {
            try {
                if (!identifiers) {
                    logToConsole(
                        "No identifiers.",
                        "warn",
                        {
                            location:
                                "@/components/ui/sections/interface/Home.tsx",
                            isHandler: true,
                            handlerName:
                                "renderObjectives() @ if (!identifiers)",
                            function: "RenderActiveObjectives()",
                        },
                        false,
                    );
                    return;
                }
                const objectivePromises: Promise<ActiveObjective | null>[] =
                    identifiers.map(
                        async (
                            identifier: number,
                        ): Promise<ActiveObjective | null> => {
                            return await GetActiveObjective(identifier);
                        },
                    );

                const objectives: (ActiveObjective | null)[] =
                    await Promise.all(objectivePromises);

                // filter null results to update the state
                // (i didn't write this but uhh it seems to work just fine)
                const filteredObjectives: ActiveObjective[] = objectives.filter(
                    (obj: ActiveObjective | null): obj is ActiveObjective =>
                        obj !== null,
                );

                // update state once
                setRenderedObjectives(filteredObjectives);
            } catch (e) {
                logToConsole(
                    "Error rendering objectives: " + e,
                    "error",
                    {
                        location: "@/components/ui/sections/interface/Home.tsx",
                        isHandler: true,
                        handlerName: "renderObjectives() @ try-catch #1",
                        function: "RenderActiveObjectives()",
                    },
                    false,
                );
            } finally {
                setLoading(false);
            }
        }, [identifiers]);

    useEffect(() => {
        renderActiveObjectives();
    }, [renderActiveObjectives]);

    function generateDescriptionOfObjective(obj: ActiveObjective): string {
        const exercise: SupportedActiveObjectives = obj.exercise;
        if (exercise === "Lifting") {
            return t(
                obj.specificData.reps +
                    " lifts of " +
                    (obj.specificData.scaleWeight * 2 +
                        obj.specificData.barWeight) +
                    " kg each.",
            );
        } else if (exercise === "Push Ups") {
            return t(
                obj.specificData.amountOfPushUps +
                    " push ups with " +
                    obj.specificData.amountOfHands +
                    " hands.",
            );
            // TODO: finish these
        } else {
            return "(There was an error reading this objective's data)";
        }
    }

    async function handleMarkingObjectiveAsDone(identifier: number) {
        await SaveActiveObjectiveToDailyLog(identifier, true, undefined);
        await handler();
        await renderActiveObjectives();
    }

    if (loading) {
        return (
            <>
                <Loading />
                <GapView height={10} />
            </>
        );
    }

    if (identifiers === 0) {
        return <Division header="Guess you've done everything!" />;
    }

    if (identifiers === null) {
        return (
            <Division header="You don't have any objectives... Let's create one!" />
        );
    }

    if (identifiers === false) {
        return <Division header="No objectives for today. Have a good rest!" />;
    }

    return (
        <>
            {renderedObjectives?.map((obj: ActiveObjective) => {
                return (
                    <Division
                        key={obj.identifier}
                        header={obj.exercise}
                        preHeader="ACTIVE OBJECTIVE"
                        subHeader={generateDescriptionOfObjective(obj)}
                    >
                        <BetterButton
                            buttonText="Let's go!"
                            style="ACE"
                            action={() => {}}
                        />
                        <BetterButton
                            buttonText="Already done it!"
                            style="GOD"
                            action={() =>
                                handleMarkingObjectiveAsDone(obj.identifier)
                            }
                        />
                    </Division>
                );
            })}
        </>
    );
}
