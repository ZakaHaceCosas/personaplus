import { SelectOption } from "@/components/interaction/Select";
import { SwapOption } from "@/components/interaction/Swap";
import { CoreLibraryType_Activeness } from "@/core/types/MiscTypes";
import { useTranslation } from "react-i18next";

export default function GetStuffForUserDataQuestion(
    query: "activeness" | "sleepTime" | "focus" | "gender",
): SelectOption[] | SwapOption[] {
    const { t } = useTranslation();

    // options
    const genderOptions: SwapOption[] = [
        {
            value: "male",
            label: t("globals.userData.gender.male"),
            default: false,
        },
        {
            value: "female",
            label: t("globals.userData.gender.female"),
            default: false,
        },
    ];
    const focusOptions: SwapOption[] = [
        {
            value: null,
            label: t("globals.interaction.chooseAnOption"),
            default: true,
        },
        {
            value: "exercising",
            label: t("pages.welcome.questions.focus.options.exercising"),
            default: false,
        },
        {
            value: "diet",
            label: t("pages.welcome.questions.focus.options.eating"),
            default: false,
        },
        {
            value: "wellbeing",
            label: t("pages.welcome.questions.focus.options.wellbeing"),
            default: false,
        },
        // both options below equal no priority
        // then why create two options?
        // if user says he doesn't know, no focus will be used and he'll see the assistant feature (when it gets developed lol)
        // if user says he has everything as a priority, no focus will be used and he'll be free to do whatever by himself
        {
            value: "noPriority",
            label: t("pages.welcome.questions.focus.options.noPriority"),
            default: false,
        },
        {
            value: "assistMePls",
            label: t("pages.welcome.questions.focus.options.assistMePls"),
            default: false,
        },
    ];
    const sleepTimeOptions: [string, number][] = [
        [t("pages.welcome.questions.sleepTime.options.threeOrLess"), 3],
        [t("pages.welcome.questions.sleepTime.options.four"), 4],
        [t("pages.welcome.questions.sleepTime.options.five"), 5],
        [t("pages.welcome.questions.sleepTime.options.six"), 6],
        [t("pages.welcome.questions.sleepTime.options.seven"), 7],
        [t("pages.welcome.questions.sleepTime.options.eight"), 8],
        [t("pages.welcome.questions.sleepTime.options.nine"), 9],
        [t("pages.welcome.questions.sleepTime.options.ten"), 10],
        [t("pages.welcome.questions.sleepTime.options.moreThanTen"), 11],
    ];
    const sleepTimeSelectOptions: SelectOption[] = sleepTimeOptions.map(
        (option) => ({
            label: option[0],
            value: option[1],
            enabled: true,
        }),
    );
    const activenessOptions: [string, CoreLibraryType_Activeness][] = [
        [t("pages.welcome.questions.activeness.options.poor"), "poor"],
        [t("pages.welcome.questions.activeness.options.small"), "light"],
        [t("pages.welcome.questions.activeness.options.normal"), "moderate"],
        [t("pages.welcome.questions.activeness.options.intense"), "intense"],
        [t("pages.welcome.questions.activeness.options.super"), "super"],
    ];
    const activenessSelectOptions: SelectOption[] = activenessOptions.map(
        (option) => ({
            label: option[0],
            value: option[1],
            enabled: true,
        }),
    );

    switch (query) {
        case "activeness":
            return activenessSelectOptions;
        case "sleepTime":
            return sleepTimeSelectOptions;
        case "focus":
            return focusOptions;
        case "gender":
            return genderOptions;
    }
}
