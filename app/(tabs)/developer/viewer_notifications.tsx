import TopBar from "@/components/navigation/top_bar";
import Loading from "@/components/static/loading";
import PageEnd from "@/components/static/page_end";
import {
    BetterTextSmallHeader,
    BetterTextSmallText,
} from "@/components/text/better_text_presets";
import GapView from "@/components/ui/gap_view";
import {
    getAllScheduledNotificationsAsync,
    NotificationRequest,
} from "expo-notifications";
import React, { ReactElement, useEffect, useState } from "react";

export default function ViewerNotifications(): ReactElement {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [notifications, setNotifications] = useState<NotificationRequest[]>();

    useEffect((): void => {
        async function handler(): Promise<void> {
            try {
                // user data
                const allNotifications: NotificationRequest[] =
                    await getAllScheduledNotificationsAsync();
                setNotifications(allNotifications);
            } catch (e) {
                setError(`Error fetching data at DevInterface: ${e}`);
            } finally {
                setLoading(false);
            }
        }

        handler();
    }, []);

    return (
        <>
            <TopBar
                includeBackButton={true}
                header="Notifications"
                subHeader="These reminders to ensure you keep up."
            />
            {loading ? (
                <Loading />
            ) : notifications &&
              Array.isArray(notifications) &&
              notifications.length > 0 ? (
                <>
                    {error ? (
                        <BetterTextSmallText>{error}</BetterTextSmallText>
                    ) : (
                        notifications.map(
                            (
                                notification: NotificationRequest,
                            ): ReactElement => {
                                const { title, body, data } =
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
                                            {[
                                                `BODY: ${body}`,
                                                `ID: ${notification.identifier}`,
                                                `TITLE: ${title}`,
                                                `DATA: ${JSON.stringify(data)}`,
                                                `TRIGGER: ${JSON.stringify(notification.trigger)}`,
                                            ].join("\n")}
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
