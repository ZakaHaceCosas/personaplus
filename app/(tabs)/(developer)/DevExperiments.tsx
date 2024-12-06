/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2024 ZakaHaceCosas and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this for more details.
 * <=============================================================================>
 *
 * You are in: @/app/(tabs)/(developer)/DevExperiments.tsx
 * Basically: A page from where the user can enable experimental features.
 *
 * <=============================================================================>
 */

import React, { useEffect, useState } from "react";
import BetterButton from "@/components/interaction/BetterButton";
import Loading from "@/components/static/Loading";
import PageEnd from "@/components/static/PageEnd";
import {
    BetterTextHeader,
    BetterTextNormalText,
    BetterTextSmallerText,
} from "@/components/text/BetterTextPresets";
import BetterAlert from "@/components/ui/BetterAlert";
import GapView from "@/components/ui/GapView";
import Division from "@/components/ui/sections/Division";
import Section from "@/components/ui/sections/Section";
import { GetExperiments, ToggleExperiment } from "@/toolkit/Experiments";
import { SafelyGoBack } from "@/toolkit/Routing";
import { logToConsole } from "@/toolkit/debug/Console";
import { Experiment, Experiments } from "@/types/User";
import { Alert } from "react-native";
import TopBar from "@/components/navigation/TopBar";
import { ShowToast } from "@/toolkit/Android";
import { useTranslation } from "react-i18next";
// import { router } from "expo-router";

// i gave myself the freedom to write in an informal way on this page.
export default function EpicExperiments() {
    const { t } = useTranslation();

    function ExperimentDivision({
        id,
        isEnabled,
    }: {
        id: Experiment;
        isEnabled: boolean;
    }) {
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
                    action={() => {
                        HandleExperiment(id, !isEnabled);
                    }}
                />
            </Division>
        );
    }

    const [loading, setLoading] = useState<boolean>(true);
    const [experiments, setExperiments] = useState<Experiments>();

    useEffect(() => {
        async function handler() {
            try {
                const theExperiments = await GetExperiments();
                setExperiments(theExperiments);
            } catch (e) {
                logToConsole("Error getting experiments: " + e, "error");
            } finally {
                setLoading(false);
            }
        }
        handler();
    }, []);

    function HandleExperiment(experiment: Experiment, value: boolean) {
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
                        onPress: () => {},
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
                bodyText={t(
                    "pages.experiments.disclaimer",
                )} /* "TL;DR: experiments are cool features I'm working on that aren't done yet. You get to try them early!! But they might have bugs, so I can't promise they won't cause issues.\n\nIf you find any problems (or have feedback), let me know—your help the app better!" */
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
                {Object.entries(experiments!).map(([id, isEnabled]) => (
                    <ExperimentDivision
                        key={id}
                        id={id as Experiment}
                        isEnabled={isEnabled}
                    />
                ))}
            </Section>
            <PageEnd includeText={true} size={"tiny"} />
        </>
    );
}
