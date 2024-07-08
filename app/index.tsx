// index.tsx
// Welcome to PersonaPlus. Give yourself a plus!

import * as React from "react";
import * as Native from "react-native";
import BetterText from "@/components/BetterText";
import Section from "@/components/section/Section";
import BottomNav from "@/components/BottomNav";
import * as Router from "expo-router";
import Division from "@/components/section/division/Division";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "@/components/Buttons";
import GapView from "@/components/GapView";
import Footer from "@/components/Footer";
import { termLog } from "@/app/DeveloperInterface";
// import useNotification from "@/components/hooks/useNotification";
import * as Notification from "expo-notifications";

// TypeScript, supongo
interface Objective {
    exercise: string;
    days: boolean[];
    duration: number;
    repetitions: number;
    rests: number;
    restDuration: number;
    id: number;
    wasDone: boolean;
}

// Creamos los estilos
const styles = Native.StyleSheet.create({
    containerview: {
        width: "100vw" as Native.DimensionValue,
        height: "100vh" as Native.DimensionValue,
    },
    mainview: {
        padding: 20,
        display: "flex",
        flexDirection: "column",
        width: "100vw" as Native.DimensionValue,
        height: "100vh" as Native.DimensionValue,
        overflow: "scroll",
    },
});

interface NotificationIdentifier {
    identifier: string;
}

const scheduledNotifications: NotificationIdentifier[] = [];

const scheduleRandomNotifications = async () => {
    const notificationMessages = [
        "You know you got stuff to do!",
        "Daily objective means DAILY objective - go and do it!",
        "Time to give yourself a plus!",
        "You said you wanted to give yourself a plus - get up!",
        "The only difference between us and a regular task list? We're way more fun to check!",
        "I'm like your mom: I won't stop till' you make it.",
        "Give yourself a plus before, mute your phone after.",
        "The only notification that doesn't make you waste time.",
        "No, not another TikTok notification this time. Move your body!",
        "They're called 'objectives' for a reason: you have to accomplish them!",
        "No, I won't stop sending notifications until you stop ignoring your path to success",
        "Trust me, you'll feel better later.",
        "Just one more session pls, love u <3",
        "You downloaded this app for a reason. Don't give it up.",
        "It's that time again!",
    ];

    const randomDelay = () => Math.floor(Math.random() * 30) * 1000; // 0 to 0.5 minutes between each notification - FOR TESTING PURPOSES, MUST BE CHANGED TO SOMETHING REASONABLE (like one hour)

    for (let i = 0; i < 2; i++) {
        const randomMessage =
            notificationMessages[
                Math.floor(Math.random() * notificationMessages.length)
            ];
        const trigger = {
            hour: Math.floor(Math.random() * 6) + 15,
            minute: Math.floor(Math.random() * 60),
            repeats: true,
        };

        const identifier = await Notification.scheduleNotificationAsync({
            content: {
                title: "Pending PersonaPlus objectives!",
                body: randomMessage,
            },
            trigger,
        });

        // Store the notification identifier
        scheduledNotifications.push({ identifier });

        await new Promise(resolve => setTimeout(resolve, randomDelay()));
    }
};

// Function to cancel scheduled notifications
const cancelScheduledNotifications = async () => {
    for (const { identifier } of scheduledNotifications) {
        await Notification.cancelScheduledNotificationAsync(identifier);
    }
    // Clear the list of scheduled notifications
    scheduledNotifications.length = 0;
};

// Creamos la función
export default function Home() {
    // Usuario "Unknown" por defecto
    // Default "Unknown" username
    const [username, setUsername] = React.useState<string>("Unknown");
    // Variable principal para acceder a los objetivos activos (o simplemente objetivos)
    // Main variable to access active objectives (or just objectives)
    const [objectives, setObjectives] = React.useState<{
        [key: string]: Objective;
    } | null>(null);
    // Notifications
    // const expoPushToken = useNotification();

    // Programa notificaciones random
    // The idea is that if you still have undone objectives for today, you get one of these notifications randomly. The app keeps going until you do it all.
    // Took the freedom to write a lot, lol.
    /*
    const scheduleRandomNotifications = async () => {
        const notificationMessages = [
            "You know you got stuff to do!",
            "Daily objective means DAILY objective - go and do it!",
            "Time to give yourself a plus!",
            "You said you wanted to give yourself a plus - get up!",
            "The only difference between us and a regular task list? We're way more fun to check!",
            "I'm like your mom: I won't stop till' you make it.",
            "Give yourself a plus before, mute your phone after.",
            "The only notification that doesn't make you waste time.",
            "No, not another TikTok notification this time. Move your body!", // i love this one ngl
            "They're called 'objectives' for a reason: you have to accomplish them!",
            "No, I won't stop sending notifications until you stop ignoring your path to success", // (because this code is supposed to send many notifications daily)
            "Trust me, you'll feel better later.",
            "just one more session pls, love u <3",
            "You downloaded this app for a reason. Don't give it up.",
            "It's that time again!",
        ];

        const randomDelay = () => Math.floor(Math.random() * 30) * 1000; // 0 to 0.5 minutes between each notification - FOR TESTING PURPOSES, MUST BE CHANGED TO SOMETHING REASONABLE (like one hour)

        for (let i = 0; i < 2; i++) {
            const randomMessage =
                notificationMessages[
                    Math.floor(Math.random() * notificationMessages.length)
                ];
            const trigger = {
                hour: Math.floor(Math.random() * 6) + 15,
                minute: Math.floor(Math.random() * 60),
                repeats: true,
            };

            await Notification.scheduleNotificationAsync({
                content: {
                    title: "Pending PersonaPlus objectives!",
                    body: randomMessage,
                },
                trigger,
            });

            await new Promise(resolve => setTimeout(resolve, randomDelay()));
        }
    };
    */
    // This function is defined here, but used later

    React.useEffect(() => {
        const fetchUsername = async () => {
            const username: string | null =
                await AsyncStorage.getItem("username");
            if (username) {
                setUsername(username);
                termLog("Username fetched!", "success");
            } else {
                termLog("Username error!", "error");
            }
        };

        fetchUsername();
    }, []);

    React.useEffect(() => {
        const fetchObjectives = async () => {
            try {
                const existingObjectives = await AsyncStorage.getItem("objs");
                if (existingObjectives) {
                    setObjectives(JSON.parse(existingObjectives));
                    // console logs keep reminding you it's called "OBJS" even tho im chaning it to objectives for better readability. just in case.
                    termLog("Objectives (OBJS) fetched and parsed!", "success");
                } else {
                    await AsyncStorage.setItem("objs", JSON.stringify({}));
                    setObjectives({});
                    termLog(
                        "Could not get objectives (OBJS) fetched! Setting them to an empty array ( {} )",
                        "warn"
                    );
                }
            } catch (e) {
                const log =
                    "Could not get objectives (OBJS) fetched due to error: " +
                    e;
                termLog(log, "error");
            }
        };

        fetchObjectives();
    }, []);

    const currentpage: string = Router.usePathname();

    const createNewActiveObjective = (): void => {
        Router.router.navigate("/CreateObjective");
    };

    const startSessionFromObjective = (id: number): void => {
        Router.router.navigate("/Sessions?id=" + id);
    };

    const markObjectiveAsDone = (id: number): void => {
        const updateObj = async (id: number) => {
            try {
                const storedObjs = await AsyncStorage.getItem("objs");
                if (storedObjs) {
                    const parsedObjs = JSON.parse(storedObjs);
                    const updatedObjs = parsedObjs.map((obj: Objective) => {
                        if (obj.id === id) {
                            return { ...obj, wasDone: true };
                        }
                        return obj;
                    });
                    await AsyncStorage.setItem(
                        "objs",
                        JSON.stringify(updatedObjs)
                    );
                    termLog(
                        "Objectives (OBJS) updated and saved successfully!",
                        "success"
                    );
                    Router.router.replace("/");
                } else {
                    termLog(
                        "Could not get objectives (OBJS) fetched!",
                        "error"
                    );
                }
            } catch (e) {
                const log =
                    "Could not get objectives (OBJS) fetched due to error: " +
                    e;
                termLog(log, "error");
            }
        };

        updateObj(id);
    };

    const [isFirstLaunch, setIsFirstLaunch] = React.useState<boolean | null>(
        null
    );

    // Comprobación para ver si es la primera vez que abre la app - si lo es, redirige a /WelcomeScreen
    React.useEffect(() => {
        const checkFirstLaunch = async () => {
            try {
                const value = await AsyncStorage.getItem("hasLaunched");
                if (value === null || !value) {
                    await AsyncStorage.setItem("hasLaunched", "true");
                    setIsFirstLaunch(true);
                } else {
                    setIsFirstLaunch(false);
                }
            } catch (e) {
                const log =
                    "Got an error checking if app launched before: " + e;
                termLog(log, "error");
            }
        };
        checkFirstLaunch();
    }, []);

    if (isFirstLaunch === null) {
        return null;
    }

    if (isFirstLaunch) {
        Router.router.push("/WelcomeScreen");
    }

    // i got creative :]
    // commits / PRs that add more stuff will of course be taken into account
    const allDoneMessages = [
        "Feel proud of yourself, don't you?",
        "That is right, you have completed ALL of your objectives for today.",
        "Now plan something else and make this day even more productive!",
        '"Giving yourself a PLUS" seems to be worth it, right?',
        "Take a moment to celebrate your accomplishments!",
        "All tasks checked off! Well done, keep up the momentum.",
        "Another productive day in the books. Great job!",
        "Mission accomplished! What's next on your list?",
        "mission passed, + respect",
        "Seriously. You did it.",
        "Not enough? You can go to your dashboard and add something else.",
        "Who could tell a phone app could help you get so much done?",
        "while (motivated) do\nGiveYourselfAPlus()",
        "You're defo on ur prime",
        "add objective -> acomplish it -> feel good -> repeat",
        "bro finally got out his cave", // lmao
        "Enough for today. More tomorrow!",
        "For today; objectives due tomorrow aren't shown ;)",
    ];

    const randomMessageIndex = Math.floor(
        Math.random() * allDoneMessages.length
    );
    const randomMessageForAllDone = allDoneMessages[randomMessageIndex];

    // Today's date (since React for some reasons thinks it's funny to start weeks on Sunday, this needs to be done)
    const today = new Date().getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
    // Adjust today index to match week start (Monday as 0)
    const adjustedToday = today === 0 ? 6 : today - 1; // Adjust Sunday to index 6, otherwise shift back by one

    if (objectives && Object.keys(objectives).length > 0) {
        const allObjectivesHandled = Object.keys(objectives).every(key => {
            const objective = objectives[key];
            return (
                objective.wasDone ||
                !objective.days ||
                !objective.days[adjustedToday]
            );
        });

        if (!allObjectivesHandled) {
            scheduleRandomNotifications();
        } else {
            cancelScheduledNotifications();
        }
    }

    return (
        <Native.View style={styles.containerview}>
            <BottomNav currentLocation={currentpage} />
            <Native.ScrollView style={styles.mainview}>
                <BetterText textAlign="normal" fontWeight="Bold" fontSize={40}>
                    Hello, {username}!
                </BetterText>
                <BetterText
                    textAlign="normal"
                    fontWeight="Regular"
                    fontSize={20}
                >
                    This is your summary for today
                </BetterText>
                <GapView height={20} />
                <Section kind="Objectives">
                    {objectives && Object.keys(objectives).length > 0 ? (
                        Object.keys(objectives).every(
                            key =>
                                objectives[key].wasDone ||
                                !objectives[key].days ||
                                !objectives[key].days[adjustedToday]
                        ) ? (
                            <Native.View
                                style={{
                                    padding: 20,
                                    flex: 1,
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <BetterText
                                    textAlign="center"
                                    fontSize={30}
                                    textColor="#FFF"
                                    fontWeight="Bold"
                                >
                                    You&apos;ve done everything!
                                </BetterText>
                                <GapView height={10} />
                                <BetterText
                                    textAlign="center"
                                    fontSize={15}
                                    textColor="#FFF"
                                    fontWeight="Regular"
                                >
                                    {randomMessageForAllDone}
                                </BetterText>
                            </Native.View>
                        ) : (
                            Object.keys(objectives).map(key => {
                                const obj = objectives[key];
                                termLog(
                                    `OBJ ${obj.id}, days[${adjustedToday}]: ${obj.days[adjustedToday]}`,
                                    "log"
                                );

                                if (
                                    obj &&
                                    !obj.wasDone &&
                                    obj.days[adjustedToday]
                                ) {
                                    return (
                                        <Division
                                            key={obj.id}
                                            status="REGULAR"
                                            preheader="ACTIVE OBJECTIVE"
                                            header={obj.exercise}
                                        >
                                            <Button
                                                style="ACE"
                                                action={() =>
                                                    startSessionFromObjective(
                                                        obj.id
                                                    )
                                                }
                                                buttonText="Let's go!"
                                            />
                                            <Button
                                                style="GOD"
                                                action={() =>
                                                    markObjectiveAsDone(obj.id)
                                                }
                                                buttonText="Already done it"
                                            />
                                        </Division>
                                    );
                                }
                                return null;
                            })
                        )
                    ) : (
                        <Native.View
                            style={{
                                padding: 20,
                                flex: 1,
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <BetterText
                                textAlign="center"
                                fontSize={30}
                                textColor="#FFF"
                                fontWeight="Bold"
                            >
                                You don&apos;t have any objectives. Create one
                                now!
                            </BetterText>
                            <GapView height={15} />
                            <Button
                                width="fill"
                                style="ACE"
                                buttonText="Let's go!"
                                action={createNewActiveObjective}
                            />
                        </Native.View>
                    )}
                </Section>
                <Footer />
            </Native.ScrollView>
        </Native.View>
    );
}
