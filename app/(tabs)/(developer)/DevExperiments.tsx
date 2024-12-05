import React, { useEffect, useState } from "react";
import BetterButton from "@/components/interaction/BetterButton";
import BackButton from "@/components/navigation/GoBack";
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
import { useTranslation } from "react-i18next";
import { Alert, Platform, ToastAndroid } from "react-native";

// i gave myself the freedom to write in an informal way on this page.
export default function EpicExperiments() {
    const { t } = useTranslation();
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
                            SafelyGoBack();
                            if (Platform.OS === "android") {
                                ToastAndroid.show(
                                    "Enabled " + experiment + ". Have fun!",
                                    ToastAndroid.LONG,
                                );
                                SafelyGoBack();
                            }
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
            if (Platform.OS === "android") {
                ToastAndroid.show("Disabled " + experiment, ToastAndroid.LONG);
                SafelyGoBack();
            }
        }
    }

    if (loading) return <Loading />;

    return (
        <>
            <BackButton t={t} />
            <GapView height={10} />
            <BetterTextHeader>READ THIS OR YOU WILL EXPLODE!!</BetterTextHeader>
            <BetterTextSmallerText>
                i mean you wont actually explode but pls read it
            </BetterTextSmallerText>
            <GapView height={10} />
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
                    header="exp_think"
                    subHeader="Enable The Daily Check, formerly called 'The Think Hour'."
                    direction="vertical"
                >
                    <BetterTextNormalText>
                        Value: {experiments?.exp_think ? "enabled" : "disabled"}
                    </BetterTextNormalText>
                    <BetterTextSmallerText>
                        This experiment isn't implemented (yet). You can keep it
                        enabled and it'll auto enable in the 1st update to the
                        app that implements it.
                    </BetterTextSmallerText>
                    <BetterButton
                        style={experiments?.exp_think ? "HMM" : "DEFAULT"}
                        buttonText={
                            experiments?.exp_think ? "Disable" : "Enable"
                        }
                        buttonHint="Toggles the state of this experiment, if it's enabled, disables it, and viceversa."
                        action={() => {
                            HandleExperiment(
                                "exp_think",
                                !experiments?.exp_think,
                            );
                        }}
                    />
                </Division>
            </Section>
            <PageEnd includeText={true} size={"tiny"} />
        </>
    );
}
