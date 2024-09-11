import { useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logToConsole } from '@/toolkit/debug/Console';

export function useTheme() {
    const systemTheme = useColorScheme();
    const [theme, setTheme] = useState<"light" | "dark">("dark");

    useEffect(() => {
        async function fetchTheme() {
            try {
                const savedTheme = await AsyncStorage.getItem("colorTheme");
                setTheme(savedTheme ? (savedTheme as "light" | "dark") : systemTheme ?? "dark");
            } catch (e) {
                logToConsole('Error fetching theme:' + e, "error");
                setTheme(systemTheme ?? "dark");
            }
        }

        fetchTheme();
    }, [systemTheme]);

    return theme;
}
