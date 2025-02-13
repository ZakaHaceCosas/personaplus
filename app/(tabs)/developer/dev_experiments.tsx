/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2025 ZakaHaceCosas and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this for more details.
 * <=============================================================================>
 *
 * You are in: @/app/(tabs)/developer/DevExperiments.tsx
 * Basically: A page from where the user can enable experimental features.
 *
 * <=============================================================================>
 */

import React, { ReactElement, useEffect, useState } from "react";
import BetterButton from "@/components/interaction/better_button";
import Loading from "@/components/static/loading";
import PageEnd from "@/components/static/page_end";
import {
    BetterTextHeader,
    BetterTextNormalText,
    BetterTextSmallerText,
} from "@/components/text/better_text_presets";
import BetterAlert from "@/components/ui/better_alert";
import GapView from "@/components/ui/gap_view";
import Division from "@/components/ui/sections/division";
import Section from "@/components/ui/sections/section";
import { GetExperiments, ToggleExperiment } from "@/toolkit/experiments";
import { SafelyGoBack } from "@/toolkit/routing";
import { logToConsole } from "@/toolkit/console";
import { Experiment, Experiments } from "@/types/user";
import { Alert } from "react-native";
import TopBar from "@/components/navigation/top_bar";
import { ShowToast } from "@/toolkit/android";
import { useTranslation } from "react-i18next";

// i gave myself the freedom to write in an informal way on this page.
export default function EpicExperiments(): ReactElement {
    const { t } = useTranslation();

    function ExperimentDivision({
        id,
        isEnabled,
    }: {
        id: Experiment;
        isEnabled: boolean;
    }): ReactElement {
        return (
            <Division
                key={id}
                header={id}
                subHeader={t(`pages.experiments.${id}`)}
                direction="vertical"
            >
                <BetterTextNormalText>
                    {isEnabled
                        ? t("pages.experiments.status.enabled")
                        : t("pages.experiments.status.disabled")}
                </BetterTextNormalText>
                <BetterButton
                    style={isEnabled ? "HMM" : "DEFAULT"}
                    buttonText={
                        isEnabled
                            ? t("pages.experiments.toggle.disable")
                            : t("pages.experiments.toggle.enable")
                    }
                    buttonHint={t("pages.experiments.toggle.hint")}
                    action={(): void => {
                        HandleExperiment(id, !isEnabled);
                    }}
                />
            </Division>
        );
    }

    const [loading, setLoading] = useState<boolean>(true);
    const [experiments, setExperiments] = useState<Experiments>();

    useEffect((): void => {
        async function handler(): Promise<void> {
            try {
                const theExperiments: Experiments = await GetExperiments();
                setExperiments(theExperiments);
            } catch (e) {
                logToConsole(`Error getting experiments: ${e}`, "error");
            } finally {
                setLoading(false);
            }
        }
        handler();
    }, []);

    function HandleExperiment(experiment: Experiment, value: boolean): void {
        if (value === true) {
            Alert.alert(
                t("globals.interaction.areYouSure"),
                t("pages.experiments.toggle.warning"),
                [
                    {
                        text: t("globals.interaction.goAheadBad"),
                        onPress: () => {
                            ToggleExperiment(experiment, value);
                            ShowToast(
                                t("pages.experiments.toggle.enabledFeedback", {
                                    exp: experiment,
                                }),
                            );
                            // router.reload();
                            SafelyGoBack();
                        },
                    },
                    {
                        text: t("globals.interaction.nevermind"),
                        onPress: (): void => {},
                    },
                ],
            );
        } else {
            ToggleExperiment(experiment, value);
            ShowToast(
                t("pages.experiments.toggle.disabledFeedback", {
                    exp: experiment,
                }),
            );
            // router.reload();
            SafelyGoBack();
        }
    }

    if (loading) return <Loading />;

    return (
        <>
            <TopBar
                includeBackButton={true}
                header={t("pages.experiments.header")}
                subHeader={t("pages.experiments.subheader")}
            />
            <BetterAlert
                style="WOR"
                title={t("pages.experiments.header")}
                bodyText={t("pages.experiments.disclaimer")}
                layout="alert"
            />
            <GapView height={10} />
            <BetterTextHeader>
                {t("pages.experiments.realHeader")}
            </BetterTextHeader>
            <BetterTextSmallerText>
                {t("pages.experiments.realSubheader")}
            </BetterTextSmallerText>
            <GapView height={10} />
            <Section kind="Experiments">
                {experiments &&
                    Object.entries(experiments).map(
                        ([id, isEnabled]: [string, boolean]): ReactElement => (
                            <ExperimentDivision
                                key={id}
                                id={id as Experiment}
                                isEnabled={isEnabled}
                            />
                        ),
                    )}
            </Section>
            <PageEnd includeText={true} size={"tiny"} />
        </>
    );
}
