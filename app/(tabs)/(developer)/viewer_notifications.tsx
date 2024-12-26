import TopBar from "@/components/navigation/top_bar";
import Loading from "@/components/static/loading";
import PageEnd from "@/components/static/page_end";
import {
    BetterTextSmallHeader,
    BetterTextSmallText,
} from "@/components/text/better_text_presets";
import GapView from "@/components/ui/gap_view";
import { logToConsole } from "@/toolkit/debug/console";
import {
    getAllScheduledNotificationsAsync,
    NotificationRequest,
} from "expo-notifications";
import React, { useEffect, useState } from "react";

export default function ViewerUserData() {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [notifications, setNotifications] = useState<NotificationRequest[]>();

    useEffect(() => {
        async function handler() {
            try {
                // user data
                const allNotifications: NotificationRequest[] =
                    await getAllScheduledNotificationsAsync();
                setNotifications(allNotifications);
            } catch (e) {
                const err = `Error fetching data at DevInterface: ${e}`;
                logToConsole(err, "error");
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        handler();
    }, []);

    if (loading) return <Loading />;

    return (
        <>
            <TopBar
                includeBackButton={true}
                header="Notifications"
                subHeader="These reminders to ensure you keep up."
            />
            {notifications &&
            Array.isArray(notifications) &&
            notifications.length > 0 ? (
                <>
                    {error ? (
                        <BetterTextSmallText>{error}</BetterTextSmallText>
                    ) : (
                        notifications.map(
                            (notification: NotificationRequest) => {
                                const { title, body, sound } =
                                    notification.content;

                                return (
                                    <React.Fragment
                                        key={notification.identifier}
                                    >
                                        <BetterTextSmallHeader>
                                            Reminder
                                            {/* if we add more types of notifications, do here an if (title === t("whatever")) return "x" */}
                                        </BetterTextSmallHeader>
                                        <BetterTextSmallText>
                                            {`BODY:\n${body}\nID:\n${notification.identifier}\nTITLE:\n${title}\nSOUND: ${sound}`}
                                        </BetterTextSmallText>
                                        <GapView height={5} />
                                    </React.Fragment>
                                );
                            },
                        )
                    )}
                </>
            ) : (
                <BetterTextSmallText>No notifications</BetterTextSmallText>
            )}
            <PageEnd includeText={false} size="tiny" />
        </>
    );
}
