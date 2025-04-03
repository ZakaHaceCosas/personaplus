import { useEffect, useState } from "react";
import { ColorSchemeName, useColorScheme } from "react-native";
import AsyncStorage from "expo-sqlite/kv-store";
import StoredItemNames from "@/constants/stored_item_names";

export function useTheme(): "light" | "dark" {
    const systemTheme: ColorSchemeName = useColorScheme();
    const [theme, setTheme] = useState<"light" | "dark">("dark");

    useEffect((): void => {
        async function fetchTheme(): Promise<void> {
            try {
                const savedTheme: string | null = await AsyncStorage.getItem(
                    StoredItemNames.colorTheme,
                );
                setTheme(
                    savedTheme
                        ? (savedTheme as "light" | "dark")
                        : (systemTheme ?? "dark"),
                );
            } catch (e) {
                console.error(`Error fetching theme: ${e}`);
                setTheme(systemTheme ?? "dark");
            }
        }

        fetchTheme();
    }, [systemTheme]);

    return theme;
}
