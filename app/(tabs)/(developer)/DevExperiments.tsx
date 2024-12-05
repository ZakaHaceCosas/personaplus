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

// i gave myself the freedom to write in an informal way on this page.
export default function EpicExperiments() {
    const [loading, setLoading] = useState<boolean>(true);
    const [experiments, setExperiments] = useState<Experiments | null>(null);

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
                "Are you sure?",
                "Again, experiments are usually cool, but are also unstable. Proceed at your own risk!",
                [
                    {
                        text: "Go ahead",
                        onPress: () => {
                            ToggleExperiment(experiment, value);
                            ShowToast("Enabled " + experiment + ". Have fun!");
                            SafelyGoBack();
                        },
                    },
                    {
                        text: "Nevermind",
                        onPress: () => {},
                    },
                ],
            );
        } else {
            ToggleExperiment(experiment, value);
            ShowToast("Disabled " + experiment);
            SafelyGoBack();
        }
    }

    if (loading) return <Loading />;

    return (
        <>
            <TopBar
                includeBackButton={true}
                header="READ THIS OR YOU WILL EXPLODE!!"
                subHeader="i mean you won't actually explode but pls read"
            />
            <BetterAlert
                style="WOR"
                title="READ THIS OR YOU WILL EXPLODE!!"
                bodyText="TL;DR: experiments are cool features I'm working on that aren't done yet. You get to try them early!! But they might have bugs, so I can't promise they won't cause issues.\n\nIf you find any problems (or have feedback), let me know—your help the app better!"
                layout="alert"
            />
            <GapView height={10} />
            <BetterTextHeader>Experiments</BetterTextHeader>
            <BetterTextSmallerText>
                PersonaPlus experimental features
            </BetterTextSmallerText>
            <GapView height={10} />
            <Section kind="Experiments">
                <Division
                    header="exp_tracker"
                    subHeader="In it's early days PersonaPlus asked you to 'estimate your running speed' and used that fixed number to calculate burnt calories (stupid idea). This experiment enables an experimental tracker that makes the app actually track your movement and get your speed (similar to what apps like Adidas Running do)."
                    direction="vertical"
                >
                    <BetterTextNormalText>
                        Value:{" "}
                        {experiments?.exp_tracker ? "enabled" : "disabled"}
                    </BetterTextNormalText>
                    <BetterButton
                        style={experiments?.exp_tracker ? "HMM" : "DEFAULT"}
                        buttonText={
                            experiments?.exp_tracker ? "Disable" : "Enable"
                        }
                        buttonHint="Toggles the state of this experiment, if it's enabled, disables it, and viceversa."
                        action={() => {
                            HandleExperiment(
                                "exp_tracker",
                                !experiments?.exp_tracker,
                            );
                        }}
                    />
                </Division>
                <Division
                    header="exp_report"
                    subHeader="Enables the Report tab."
                    direction="vertical"
                >
                    <BetterTextNormalText>
                        Value:{" "}
                        {experiments?.exp_report ? "enabled" : "disabled"}
                    </BetterTextNormalText>
                    <BetterButton
                        style={experiments?.exp_report ? "HMM" : "DEFAULT"}
                        buttonText={
                            experiments?.exp_report ? "Disable" : "Enable"
                        }
                        buttonHint="Toggles the state of this experiment, if it's enabled, disables it, and viceversa."
                        action={() => {
                            HandleExperiment(
                                "exp_report",
                                !experiments?.exp_report,
                            );
                        }}
                    />
                </Division>
            </Section>
            <PageEnd includeText={true} size={"tiny"} />
        </>
    );
}
