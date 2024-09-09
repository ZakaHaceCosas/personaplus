import Loading from "@/components/static/Loading";
import { logToConsole } from "@/toolkit/debug/Console";
import { GetAllPendingObjectives } from "@/toolkit/objectives/ActiveObjectives";
import { ActiveObjective } from "@/types/ActiveObjectives";
import { ReactNode, useEffect, useState } from "react";
import Division from "../Division";

export function RenderActiveObjectives(): ReactNode {
    const [objectives, setObjectives] = useState<ActiveObjective[] | 0 | null>(
        null,
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function handler(): Promise<void> {
            try {
                const pending: ActiveObjective[] | 0 | null =
                    await GetAllPendingObjectives();
                logToConsole(JSON.stringify(pending), "log");
                setObjectives(pending);
            } catch (e) {
                logToConsole(
                    "Error with RenderActiveObjective 1st handler(), " + e,
                    "error",
                );
            } finally {
                setLoading(false);
            }
        }

        handler();
    }, []);

    if (loading) {
        return <Loading />;
    }

    if (objectives === 0) {
        return <Division header="Guess you've done everything!" />;
    }

    if (objectives === null) {
        return (
            <Division header="You don't have any objectives... Let's create one!" />
        );
    }

    return <></>;
}
