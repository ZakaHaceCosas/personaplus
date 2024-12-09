import { useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "expo-sqlite/kv-store";
import { logToConsole } from "@/toolkit/debug/console";
import StoredItemNames from "@/constants/stored_item_names";

export function useTheme(): "light" | "dark" {
    const systemTheme = useColorScheme();
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
                logToConsole(`Error fetching theme: ${e}`, "error");
                setTheme(systemTheme ?? "dark");
            }
        }

        fetchTheme();
    }, [systemTheme]);

    return theme;
}
