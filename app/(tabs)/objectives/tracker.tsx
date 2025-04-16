// TODO - figure this thing out
import React, { ReactElement, useCallback, useEffect, useState } from "react";
import * as Location from "expo-location";
import { StyleSheet, View } from "react-native";
import { BetterTextNormalText } from "@/components/text/better_text_presets";
import GapView from "@/components/ui/gap_view";
import Ionicons from "@expo/vector-icons/MaterialIcons";
import BetterButton from "@/components/interaction/better_button";
import TopBar from "@/components/navigation/top_bar";
import { ActiveObjective } from "@/types/active_objectives";
import { useGlobalSearchParams } from "expo-router/build/hooks";
import { UnknownOutputParams } from "expo-router";
import { GetActiveObjective } from "@/toolkit/objectives/active_objectives";
import { TopView } from "@/components/ui/pages/sessions";

/** Settings for this thingy */
const SETTINGS = {
    /** Interval (in meters) for the location to update. */
    DIST_INTERVAL_METERS: 0.45,
    /** Min amount of time (in milliseconds) for the location to update. */
    TIME_INTERVAL_MS: 1000,
    /** Min distance in meters required for the distance to update. */
    MIN_BUMP_DISTANCE: 0.1,
    /** Max distance in meters required for the distance to update. */
    MAX_BUMP_DISTANCE: 20,
    /** Min user speed for location for the distance to update. */
    MIN_BELIEVABLE_SPEED: 0,
    /** Max user speed for location for the distance to update. */
    MAX_BELIEVABLE_SPEED: 15,
};

const styles = StyleSheet.create({
    buttonContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    labelWrapper: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
    },
});

/**
 * Calculates the distance between two positions.
 *
 * @param {number} lat1 Latitude of position 1.
 * @param {number} lon1 Longitude of position 1.
 * @param {number} lat2 Latitude of position 1.
 * @param {number} lon2 Longitude of position 2.
 * @returns {number}
 */
function CalculateDistanceBetweenInterval(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
): number {
    const earthRadius = 6371e3; // earth radius in meters
    // NO FUCKING CLUE WHAT THIS IS BUT IT WORKS (I THINK)
    // NI PUTA IDEA DE QUE ES ESTO PERO FUNCIONA (CREO)
    const lat1Radians: number = (lat1 * Math.PI) / 180;
    const lat2Radians: number = (lat2 * Math.PI) / 180;
    const deltaLat: number = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLon: number = ((lon2 - lon1) * Math.PI) / 180;

    const a: number =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1Radians) *
            Math.cos(lat2Radians) *
            Math.sin(deltaLon / 2) *
            Math.sin(deltaLon / 2);
    const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadius * c;
}

export default function PersonaPlusRunningTracker(): ReactElement {
    const params: UnknownOutputParams = useGlobalSearchParams();
    const id: number | null =
        params.id && typeof params.id === "string" ? Number(params.id) : null;
    const [objective, setObjective] = useState<ActiveObjective>();
    useEffect((): void => {
        async function handler(): Promise<void> {
            try {
                if (!id) throw new Error("no id!");
                const objective: ActiveObjective | null =
                    await GetActiveObjective(id);
                if (!objective) throw new Error("no objective!");
                setObjective(objective);
            } catch (e) {
                console.error(e);
            }
        }
        handler();
    }, [id]);
    const [location, setLocation] = useState({
        latitude: 0,
        longitude: 0,
    });
    const [distance, setDistance] = useState(0);
    const [isTracking, setIsTracking] = useState(false);
    const [locationSubscription, setLocationSubscription] =
        useState<Location.LocationSubscription | null>(null);

    // startTracking and stopTracking were for whatever reason considered "dependencies" of the useEffect below (eslint)
    // so i wrapped them into a useCallback to memo them and avoid re-renders
    // so i'm not worried about having a function as a dependency of something
    const startTracking: () => Promise<void> =
        useCallback(async (): Promise<void> => {
            // permissions
            const { status } =
                await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.error("Location permission not granted", {
                    location: "@/objectives/exp_tracker.tsx",
                    function: "startTracking",
                    isHandler: false,
                });
                return;
            }

            // watch location
            const subscription: Location.LocationSubscription =
                await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.High,
                        distanceInterval: SETTINGS.DIST_INTERVAL_METERS,
                        timeInterval: SETTINGS.TIME_INTERVAL_MS,
                        mayShowUserSettingsDialog: true,
                    },
                    (position: Location.LocationObject): void => {
                        const { latitude, longitude } = position.coords;

                        // calc distance
                        if (
                            location.latitude !== 0 ||
                            location.longitude !== 0
                        ) {
                            const dist: number =
                                CalculateDistanceBetweenInterval(
                                    location.latitude,
                                    location.longitude,
                                    latitude,
                                    longitude,
                                );

                            const speed: number =
                                dist / (SETTINGS.TIME_INTERVAL_MS / 1000); // m/s
                            // min & max are to ignore stupid values that can mess up the stats
                            if (
                                dist > SETTINGS.MIN_BUMP_DISTANCE &&
                                dist < SETTINGS.MAX_BUMP_DISTANCE &&
                                speed > SETTINGS.MIN_BELIEVABLE_SPEED &&
                                speed < SETTINGS.MAX_BELIEVABLE_SPEED
                            ) {
                                setDistance(
                                    (prevDistance: number): number =>
                                        prevDistance + dist,
                                );
                            }
                        }

                        // update distance
                        setLocation({ latitude, longitude });
                    },
                );

            setLocationSubscription(subscription);
        }, [location]);
    const stopTracking: () => void = useCallback((): void => {
        // Clear and delete subscription when component unmounts to save resources
        if (locationSubscription) {
            locationSubscription.remove();
            setLocationSubscription(null);
        }
    }, [locationSubscription]);

    useEffect((): (() => void) => {
        if (isTracking) {
            startTracking();
        } else {
            stopTracking();
        }

        return (): void => {
            if (locationSubscription) {
                locationSubscription.remove();
            }
        };
    }, [isTracking, startTracking, stopTracking, locationSubscription]);

    if (!objective) {
        return (
            <>
                <BetterTextNormalText>bruh</BetterTextNormalText>
            </>
        );
    }

    return (
        <>
            <TopBar
                includeBackButton={true}
                header="Running tracker"
                subHeader="Experimental feature!"
            />
            <TopView
                objective={objective}
                verbalName={isTracking ? "Running" : "(PAUSED)"}
            />
            <GapView height={10} />
            <View style={styles.buttonContainer}>
                <BetterButton
                    buttonText={isTracking ? "Stop tracking" : "Start tracking"}
                    action={(): void =>
                        setIsTracking((prev: boolean): boolean => !prev)
                    }
                    buttonHint={
                        isTracking
                            ? "Stops tracking movement"
                            : "Start tracking movement"
                    }
                    style={isTracking ? "ACE" : "DEFAULT"}
                />
                <BetterButton
                    buttonText="Reset distance"
                    action={(): void => setDistance(0)}
                    buttonHint="Restarts the total distance counter"
                    style="DEFAULT"
                />
            </View>
            <GapView height={10} />
            <View style={styles.labelWrapper}>
                <View style={styles.buttonContainer}>
                    <Ionicons name="run-circle" size={25} color="#FFF" />
                    <BetterTextNormalText>
                        DIST {distance.toFixed(2)} m
                    </BetterTextNormalText>
                </View>
                <View style={styles.buttonContainer}>
                    <Ionicons name="pin-drop" size={25} color="#FFF" />
                    <BetterTextNormalText>
                        LAT {location.latitude.toFixed(2)}
                    </BetterTextNormalText>
                </View>
                <View style={styles.buttonContainer}>
                    <Ionicons name="pin-drop" size={25} color="#FFF" />
                    <BetterTextNormalText>
                        LON {location.longitude.toFixed(2)}
                    </BetterTextNormalText>
                </View>
            </View>
        </>
    );
}
