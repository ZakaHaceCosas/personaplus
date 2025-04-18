import React, { ReactElement } from "react";
import BetterButton from "@/components/interaction/better_button";
import PageEnd from "@/components/static/page_end";
import { BetterTextSubHeader } from "@/components/text/better_text_presets";
import BetterAlert from "@/components/ui/better_alert";
import GapView from "@/components/ui/gap_view";
import { Routes } from "@/constants/routes";
import * as Device from "expo-device";
import { router } from "expo-router";
import TopBar from "@/components/navigation/top_bar";

export default function DevInterface(): ReactElement {
    return (
        <>
            <TopBar
                includeBackButton={true}
                header="Dev Interface"
                subHeader="Advanced toggles and stuff. English only."
            />
            <BetterAlert
                style="DEFAULT"
                preTitle="Generic info from your device"
                title="Client details"
                bodyText={[
                    `Manufacturer: ${Device.manufacturer}`,
                    `Brand: ${Device.brand}`,
                    `Codename: ${Device.designName}`,
                    `Device name: ${Device.deviceName}`,
                    `Year: ${Device.deviceYearClass}`,
                    `Model name: ${Device.modelName}`,
                    `OS BUILD ID: ${Device.osBuildId}`,
                    `OS NAME + VERSION: ${Device.osName} ${Device.osVersion}`,
                    `ANDROID API LEVEL: ${Device.platformApiLevel}`,
                    `Product name: ${Device.productName}`,
                    `Total memory: ${(Device.totalMemory! / 1048576).toFixed(2)} MB`,
                ].join("\n")}
                layout="alert"
            />
            <GapView height={20} />
            <BetterTextSubHeader>All objectives</BetterTextSubHeader>
            <GapView height={10} />
            <BetterButton
                buttonText="View all Active & Passive Objectives"
                buttonHint="Opens up a dedicated page for viewing all your active and passive objectives."
                style="ACE"
                action={(): void =>
                    router.push(Routes.DEV_INTERFACE.VIEWER_OBJECTIVES)
                }
            />
            <GapView height={20} />
            <BetterTextSubHeader>User data</BetterTextSubHeader>
            <GapView height={10} />
            <BetterButton
                buttonText="See all user data"
                buttonHint="Opens up a dedicated page for viewing all of your data."
                style="ACE"
                action={(): void =>
                    router.push(Routes.DEV_INTERFACE.VIEWER_USER_DATA)
                }
            />
            <GapView height={20} />
            <BetterTextSubHeader>Notifications</BetterTextSubHeader>
            <GapView height={10} />
            <BetterButton
                buttonText="See all scheduled notifications"
                buttonHint="Opens up a dedicated page for viewing all of your scheduled notification reminders."
                style="ACE"
                action={(): void =>
                    router.push(Routes.DEV_INTERFACE.VIEWER_NOTIFICATIONS)
                }
            />
            <GapView height={20} />
            <BetterTextSubHeader>Daily log</BetterTextSubHeader>
            <GapView height={10} />
            <BetterButton
                buttonText="See daily log"
                buttonHint="Opens up a dedicated page for viewing the raw daily log."
                style="ACE"
                action={(): void =>
                    router.push(Routes.DEV_INTERFACE.VIEWER_DAILY_LOG)
                }
            />
            <PageEnd includeText={true} size="tiny" />
        </>
    );
}
