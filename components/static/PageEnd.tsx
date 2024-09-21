import { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import BetterText from "@/components/text/BetterText";
import FontSizes from "@/constants/FontSizes";
import Colors from "@/constants/Colors";
import getCommonScreenSize from "@/constants/Screen";

interface PageEndProps {
    includeText: boolean;
}

const styles = StyleSheet.create({
    pageEnd: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        width: getCommonScreenSize("width"),
    },
});

export default function PageEnd({ includeText }: PageEndProps): ReactElement {
    const { t } = useTranslation();

    return (
        <View
            style={[
                styles.pageEnd,
                {
                    height: includeText ? 180 : 160,
                    marginTop: includeText ? 20 : 0,
                },
            ]}
        >
            {includeText && (
                <BetterText
                    textAlign="center"
                    fontWeight="Regular"
                    fontSize={FontSizes.REGULAR}
                    textColor={Colors.LABELS.SDD}
                >
                    {t("globals.pageEnd")}
                </BetterText>
            )}
        </View>
    );
}
