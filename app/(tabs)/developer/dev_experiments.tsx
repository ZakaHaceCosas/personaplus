/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2023-2025 The "Give It A Plus" organization and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this repository for more details.
 * <=============================================================================>
 *
 * You are in: @/app/(tabs)/developer/DevExperiments.tsx
 * Basically: A page from where the user can access experimental features.
 *
 * <=============================================================================>
 */

import React, { ReactElement } from "react";
import BetterButton from "@/components/interaction/better_button";
import PageEnd from "@/components/static/page_end";
import {
    BetterTextHeader,
    BetterTextSmallerText,
} from "@/components/text/better_text_presets";
import BetterAlert from "@/components/ui/better_alert";
import GapView from "@/components/ui/gap_view";
import Division from "@/components/ui/sections/division";
import Section from "@/components/ui/sections/section";
import TopBar from "@/components/navigation/top_bar";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { Routes } from "@/constants/routes";

// i gave myself the freedom to write in an informal way on this page.
export default function EpicExperiments(): ReactElement {
    const { t } = useTranslation();

    function ExperimentDivision({
        id,
        page,
    }: {
        id: string;
        page: string;
    }): ReactElement {
        return (
            <Division
                key={id}
                header={id}
                subHeader={t(`pages.experiments.${id}`)}
                direction="vertical"
            >
                <BetterButton
                    style={"HMM"}
                    buttonText={t("pages.experiments.test")}
                    buttonHint={t("pages.experiments.toggle.hint")}
                    action={(): void => {
                        router.push(page);
                    }}
                />
            </Division>
        );
    }

    const experiments = [
        {
            id: "exp_tracker",
            page: Routes.EXPERIMENTS.TRACKER,
        },
    ];

    return (
        <>
            <TopBar
                includeBackButton={true}
                header={t("pages.experiments.header")}
                subHeader={t("pages.experiments.subheader")}
            />
            <BetterAlert
                style="WOR"
                title={t("pages.experiments.header")}
                bodyText={t("pages.experiments.disclaimer")}
                layout="alert"
            />
            <GapView height={10} />
            <BetterTextHeader>
                {t("pages.experiments.realHeader")}
            </BetterTextHeader>
            <BetterTextSmallerText>
                {t("pages.experiments.realSubheader")}
            </BetterTextSmallerText>
            <GapView height={10} />
            <Section kind="Experiments">
                {experiments &&
                    experiments.map(
                        (e: { id: string; page: string }): ReactElement => (
                            <ExperimentDivision
                                key={e.id}
                                id={e.id}
                                page={e.page}
                            />
                        ),
                    )}
            </Section>
            <PageEnd includeText={true} size={"tiny"} />
        </>
    );
}
