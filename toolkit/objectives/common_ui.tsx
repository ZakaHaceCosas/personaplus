import Division from "@/components/ui/sections/division";
import { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { PendingReturn } from "./common";

// extracted this one because it's used twice from the same DisplayObjectives function
// so no need to duplicate code
function NoObjectivesExist(): ReactElement {
    const { t } = useTranslation();

    return <Division header={t("objectives.common.noObjectives.noneExists")} />;
}

export function HandlePendingReturn({
    renderer,
}: {
    renderer: PendingReturn;
}): ReactElement {
    const { t } = useTranslation();

    if (!renderer || renderer === "noneExists") return <NoObjectivesExist />;

    if (renderer === "noneDueToday")
        return (
            <Division header={t("objectives.common.noObjectives.todayFree")} />
        );
    if (renderer === "allDone")
        return (
            <Division header={t("objectives.common.noObjectives.allDone")} />
        );

    return <></>;
}
