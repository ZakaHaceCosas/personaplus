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

import NavigationBar from "@/components/navigation/NavigationBar";
import Colors from "@/constants/Colors";
import * as Router from "expo-router";
import React, { ReactNode, useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

const styles = StyleSheet.create({
    mainScrollView: {
        padding: 20,
        paddingTop: 40,
        display: "flex",
        flexDirection: "column",
        backgroundColor: Colors.MAIN.APP,
    },
});

interface LayoutContainerProps {
    children: ReactNode;
}

export function LayoutContainer({ children }: LayoutContainerProps) {
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
export default function Layout() {
    // Get the current route (directly in the top-level function so it updates on each redraw)
    const currentRoute = Router.usePathname();
    // Save it as a stateful value
    const [currentLocation, setCurrentLocation] =
        useState<string>(currentRoute);

    // on redraw, update the state so the NavigationBar has the currentLocation up to date
    useEffect(() => {
        setCurrentLocation(currentRoute);
    }, [currentRoute]);

    const noNavigationRoutes = [
        "/Welcome",
        "/objectives/Create",
        "/LogView",
        "/objectives/Sessions",
    ];

    return (
        <>
            <LayoutContainer>
                <Router.Slot />
            </LayoutContainer>
            {!noNavigationRoutes.includes(currentLocation) && (
                <NavigationBar currentLocation={currentLocation} />
            )}
        </>
    );
}
