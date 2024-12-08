import React, { useState, useEffect, useCallback } from "react";
import * as Location from "expo-location";
import { StyleSheet, View } from "react-native";
import {
    BetterTextNormalText,
    BetterTextSmallText,
} from "@/components/text/better_text_presets";
import GapView from "@/components/ui/gap_view";
import Ionicons from "@expo/vector-icons/MaterialIcons";
import { logToConsole } from "@/toolkit/debug/console";
import BetterButton from "@/components/interaction/better_button";
import TopBar from "@/components/navigation/top_bar";

// settings for this thingy
const SETTINGS = {
    DIST_INTERVAL_METERS: 1,
    TIME_INTERVAL_MS: 1900,
    MIN_BUMP_DISTANCE: 0.15,
    MAX_BUMP_DISTANCE: 30,
};

const styles = StyleSheet.create({
    buttonContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
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
    const R = 6371e3; // earth radius in meters
    // NO FUCKING CLUE WHAT THIS IS BUT IT WORKS (I THINK)
    // NI PUTA IDEA DE QUE ES ESTO PERO FUNCIONA (CREO)
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export default function PersonaPlusRunningTracker() {
    const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
    const [distance, setDistance] = useState(0);
    const [isTracking, setIsTracking] = useState(false);
    const [locationSubscription, setLocationSubscription] = useState<any>(null);

    // startTracking and stopTracking were for whatever reason considered "dependencies" of the useEffect below (eslint)
    // so i wrapped them into a useCallback to memo them and avoid re-renders
    // so i'm not worried about having a function as a dependency of something
    const startTracking = useCallback(async () => {
        // permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            logToConsole("Location permission not granted", "error", {
                location: "@/objectives/exp_tracker.tsx",
                function: "startTracking",
                isHandler: false,
            });
            return;
        }

        // watch location
        const subscription = await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.BestForNavigation,
                distanceInterval: SETTINGS.DIST_INTERVAL_METERS,
                timeInterval: SETTINGS.TIME_INTERVAL_MS,
                mayShowUserSettingsDialog: true,
            },
            (position) => {
                const { latitude, longitude } = position.coords;

                // calc distance
                if (location.latitude !== 0 || location.longitude !== 0) {
                    const dist = CalculateDistanceBetweenInterval(
                        location.latitude,
                        location.longitude,
                        latitude,
                        longitude,
                    );
                    // min & max are to ignore stupid values that can mess up the stats
                    if (
                        dist > SETTINGS.MIN_BUMP_DISTANCE &&
                        dist < SETTINGS.MAX_BUMP_DISTANCE
                    ) {
                        setDistance((prevDistance) => prevDistance + dist);
                    }
                }

                // update distance
                setLocation({ latitude, longitude });
            },
        );

        setLocationSubscription(subscription);
    }, [location]);
    const stopTracking = useCallback(() => {
        // Clear and delete subscription when component unmounts to save resources
        if (locationSubscription) {
            locationSubscription.remove();
            setLocationSubscription(null);
        }
    }, [locationSubscription]);

    useEffect(() => {
        if (isTracking) {
            startTracking();
        } else {
            stopTracking();
        }

        return () => {
            // cleanup on unmount
            stopTracking();
        };
    }, [isTracking, startTracking, stopTracking]);

    return (
        <>
            <TopBar
                includeBackButton={true}
                header="Running tracker"
                subHeader="Experimental feature!"
            />
            <View style={styles.buttonContainer}>
                <Ionicons name="run-circle" size={25} color="#FFF" />
                <BetterTextNormalText>
                    Total distance: {distance.toFixed(2)} m
                </BetterTextNormalText>
            </View>
            <View style={styles.buttonContainer}>
                <Ionicons name="pin-drop" size={25} color="#FFF" />
                <BetterTextNormalText>
                    LAT {location.latitude.toFixed(3)}, LON{" "}
                    {location.longitude.toFixed(3)}
                </BetterTextNormalText>
            </View>
            <GapView height={10} />
            <View style={styles.buttonContainer}>
                <BetterButton
                    buttonText={isTracking ? "Stop tracking" : "Start tracking"}
                    action={() => setIsTracking((prev) => !prev)}
                    buttonHint={
                        isTracking
                            ? "Stops tracking movement"
                            : "Start tracking movement"
                    }
                    style={isTracking ? "ACE" : "GOD"}
                />
                <BetterButton
                    buttonText="Reset distance"
                    action={() => setDistance(0)}
                    buttonHint="Restarts the total distance counter"
                    style="DEFAULT"
                />
            </View>
            <GapView height={10} />
            <BetterTextSmallText>
                PARAMS (this is just for app developers):{"\n\n"}
                DISTANCE INTERVAL (METERS): {SETTINGS.DIST_INTERVAL_METERS}
                {"\n"}TIME INTERVAL (MILLISECONDS): {SETTINGS.TIME_INTERVAL_MS}
                {"\n"}
                MIN DISTANCE FOR BUMP (METERS): {SETTINGS.MIN_BUMP_DISTANCE}
                {"\n"}
                MAX DISTANCE FOR BUMP (METERS): {SETTINGS.MAX_BUMP_DISTANCE}
            </BetterTextSmallText>
        </>
    );
}
