/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2024 ZakaHaceCosas and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this for more details.
 * <=============================================================================>
 *
 * You are in: @/app/(tabs)/_layout.tsx
 * Basically: The main _layout of each tab of the app.
 *
 * <=============================================================================>
 */

import NavigationBar from "@/components/navigation/navigation_bar";
import Colors from "@/constants/colors";
import { Routes } from "@/constants/routes";
import { Slot, usePathname } from "expo-router";
import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

const styles = StyleSheet.create({
    mainScrollView: {
        padding: 20,
        paddingTop: 45,
        display: "flex",
        flexDirection: "column",
        backgroundColor: Colors.MAIN.APP,
        overflow: "visible",
    },
});

interface LayoutContainerProps {
    children: ReactNode;
}

export function LayoutContainer({
    children,
}: LayoutContainerProps): ReactElement {
    return (
        <ScrollView
            style={styles.mainScrollView}
            contentContainerStyle={{
                alignItems: "flex-start",
                justifyContent: "flex-start",
            }}
            horizontal={false}
        >
            {children}
        </ScrollView>
    );
}
export default function Layout(): ReactElement {
    // Get the current route (directly in the top-level function so it updates on each redraw)
    const currentRoute: string = usePathname();
    // Save it as a stateful value
    const [currentLocation, setCurrentLocation] =
        useState<string>(currentRoute);

    // on redraw, update the state so the NavigationBar has the currentLocation up to date
    useEffect((): void => {
        setCurrentLocation(currentRoute);
    }, [currentRoute]);

    const noNavigationRoutes: string[] = [
        Routes.MAIN.WELCOME_SCREEN,
        Routes.MAIN.SETTINGS.UPDATE_PROFILE,
        Routes.MAIN.SETTINGS.SETTINGS_PAGE,
        Routes.EXPERIMENTS.TRACKER,
        ...Object.values(Routes.ACTIVE_OBJECTIVES),
        ...Object.values(Routes.DEV_INTERFACE),
        ...Object.values(Routes.ABOUT),
    ];

    return (
        <>
            <LayoutContainer>
                <Slot />
            </LayoutContainer>
            {!noNavigationRoutes.includes(currentLocation) && (
                <NavigationBar currentLocation={currentLocation} />
            )}
        </>
    );
}
