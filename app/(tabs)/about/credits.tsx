// OpenSourceCredits.tsx
// Credits to the amazing software that has saved me from my laziness to learn how to make a timer in React

import React, { ReactElement } from "react";
import { View } from "react-native";
import TopBar from "@/components/navigation/top_bar";
import BetterText from "@/components/text/better_text";
import Colors from "@/constants/colors";
import GapView from "@/components/ui/gap_view";
import { SafelyOpenUrl } from "@/toolkit/routing";
import {
    BetterTextExtraHeader,
    BetterTextSmallHeader,
    BetterTextSmallText,
} from "@/components/text/better_text_presets";
import PageEnd from "@/components/static/page_end";
import { useTranslation } from "react-i18next";
import FontSizes from "@/constants/font_sizes";

/**
 * OpenSourceLibrary
 *
 * @interface OpenSourceLibrary
 */
interface OpenSourceLibrary {
    /**
     * Name of the library / package / whatever (bare username if no name found)
     *
     * @type {string}
     */
    name: string;
    /**
     * Author name, gathered from their GitHub profile, or the license file, or wherever a clear author can be found
     *
     * @type {string}
     */
    author: string;
    /**
     * License used
     *
     * @type {string}
     */
    license: string;
    /**
     * Description provided by the author
     *
     * @type {string}
     */
    description: string;
    /**
     * URL to GitHub or https://nmpjs.com (unless there's a significant URL to provide, like react.dev)
     *
     * @type {string}
     */
    url: string;
}

/**
 * All OSS libraries used by PersonaPlus. Don't add all the libraries, e.g. the 23193211-whatever Expo libraries can be put together into "Expo". Don't add libraries that aren't actually used by us but by another dep (e.g. React Native SVG (used by Vasil's timer) or React Navigation (used by expo-router)).
 *
 * @type {OpenSourceLibrary[]}
 */
const libraries: OpenSourceLibrary[] = [
    {
        name: "React",
        author: "Facebook",
        license: "MIT License",
        description: "The library for web and native user interfaces.",
        url: "https://react.dev/",
    },
    {
        name: "React Native",
        license: "MIT License",
        author: "Facebook",
        description:
            "A framework for building native applications using React.",
        url: "https://reactnative.dev/",
    },
    {
        name: "Expo",
        author: "the Expo team",
        license: "MIT License",
        description:
            "An open-source framework for making universal native apps with React. Expo runs on Android, iOS, and the web.",
        url: "https://expo.dev/",
    },
    {
        name: "React Native Countdown Circle Timer*",
        author: "Vasil Dimitrov",
        license: "MIT License",
        description:
            "Lightweight React/React Native countdown timer component with color and progress animation based on SVG.",
        url: "https://github.com/vydimitrov/react-countdown-circle-timer/",
    },
    {
        name: "React Native Animated Stopwatch Timer",
        author: "Raúl Gómez Acuña",
        license: "MIT License",
        description:
            "Stopwatch & Timer component that smoothly animate the digits change, with all layout animations running on the UI thread.",
        url: "https://github.com/rgommezz/react-native-animated-stopwatch-timer/",
    },
    {
        name: "i18next",
        author: "i18next contributors",
        license: "MIT License",
        description: " i18next: learn once - translate everywhere.",
        url: "https://github.com/i18next/i18next",
    },
];

/**
 * A cool contributor.
 *
 * @interface Contributor
 */
interface Contributor {
    /**
     * Their real name. Of course, optional.
     *
     * @type {?string}
     */
    name?: string;
    /**
     * Their username.
     *
     * @type {string}
     */
    username: string;
    /**
     * Why they are a cool contributor. Use the translation key, e.g. `alvaro` for `pages.credits.contributions.alvaro`.
     *
     * @type {string}
     */
    contribution: string;
    /**
     * A relevant link, like their GitHub profile, personal website, or whatever.
     *
     * @type {string}
     */
    url: string;
}

/** Cool contributors! I manually add them. Once added, they're free to make as many changes as they want. I add them without all optional fields, they're up to them. */
const contributors: Contributor[] = [
    {
        name: "Álvaro",
        username: "Alvaro842DEV",
        contribution: "alvaro",
        // ^used to be "Committing ideas like constant sizing and scaling values, memos & callbacks, and other coding features now used by the app." but that's too fu- long, so from now on i'll just use "code" / "design" / "security fix" / whatever
        url: "https://github.com/Alvaro842DEV",
    },
    // there's one person missing, who I don't know how to credit yet
];

export default function OpenSourceCredits(): ReactElement {
    const { t } = useTranslation();

    return (
        <>
            <TopBar
                includeBackButton={true}
                header={t("pages.credits.header")}
                subHeader={t("pages.credits.subheader")}
            />
            <BetterTextExtraHeader>
                {t("pages.credits.contributors")}
            </BetterTextExtraHeader>
            <BetterTextSmallText>
                {t("pages.credits.contributorsNote")}
            </BetterTextSmallText>
            <GapView height={20} />
            {contributors.map(
                (contributor: Contributor, index: number): ReactElement => (
                    <View key={index}>
                        {contributor.name ? (
                            <>
                                <BetterTextSmallHeader>
                                    {contributor.name}
                                </BetterTextSmallHeader>
                                <BetterText
                                    textColor={Colors.LABELS.SHL}
                                    fontWeight="Regular"
                                    fontSize={14}
                                >
                                    @{contributor.username}
                                </BetterText>
                            </>
                        ) : (
                            <BetterText
                                textColor={Colors.LABELS.SHL}
                                fontWeight="Italic"
                                fontSize={FontSizes.LARGE}
                            >
                                @{contributor.username}
                            </BetterText>
                        )}
                        <GapView height={5} />
                        <BetterText fontWeight="Light" fontSize={15}>
                            {t(
                                `pages.credits.contributions.${contributor.contribution}`,
                            )}
                        </BetterText>
                        <GapView height={5} />
                        <BetterText
                            fontWeight="Light"
                            fontSize={15}
                            isLink={true}
                            onTap={async (): Promise<void> => {
                                await SafelyOpenUrl(contributor.url);
                            }}
                        >
                            {contributor.url}
                        </BetterText>
                        <GapView height={20} />
                    </View>
                ),
            )}
            <BetterTextExtraHeader>
                {t("pages.credits.libraries")}
            </BetterTextExtraHeader>
            <GapView height={20} />
            {libraries.map(
                (library: OpenSourceLibrary, index: number): ReactElement => (
                    <View key={index}>
                        <BetterTextSmallHeader>
                            {library.name}
                        </BetterTextSmallHeader>
                        <BetterText
                            textColor={Colors.LABELS.SHL}
                            fontWeight="Regular"
                            fontSize={14}
                        >
                            {library.license}
                        </BetterText>
                        <BetterText
                            textColor={Colors.LABELS.SDD}
                            fontWeight="Light"
                            fontSize={14}
                        >
                            Made by{" "}
                            <BetterText
                                textColor={Colors.LABELS.SDD}
                                fontWeight="SemiBold"
                                fontSize={14}
                            >
                                {library.author}
                            </BetterText>
                        </BetterText>
                        <GapView height={5} />
                        <BetterText fontWeight="Light" fontSize={15}>
                            <BetterText
                                fontWeight="Light"
                                fontSize={16}
                                textColor={Colors.MAIN.DEFAULT_ITEM.TEXT}
                            >
                                "
                            </BetterText>
                            {library.description}
                            <BetterText
                                fontWeight="Light"
                                fontSize={16}
                                textColor={Colors.MAIN.DEFAULT_ITEM.TEXT}
                            >
                                "
                            </BetterText>
                        </BetterText>
                        <GapView height={5} />
                        <BetterText
                            fontWeight="Light"
                            fontSize={15}
                            isLink={true}
                            onTap={async (): Promise<void> => {
                                await SafelyOpenUrl(library.url);
                            }}
                        >
                            {library.url}
                        </BetterText>
                        <GapView height={20} />
                    </View>
                ),
            )}
            <BetterTextSmallText>
                {t("pages.credits.librariesNoteOne")}
            </BetterTextSmallText>
            <PageEnd includeText={false} size="tiny" />
        </>
    );
}
