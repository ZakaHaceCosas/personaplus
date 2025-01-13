import { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import BetterText from "@/components/text/better_text";
import FontSizes from "@/constants/font_sizes";
import Colors from "@/constants/colors";
import { GetCommonScreenSize } from "@/constants/screen";

interface PageEndProps {
    includeText: boolean;
    size?: "normal" | "tiny";
}

const styles = StyleSheet.create({
    pageEnd: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        width: GetCommonScreenSize("width"),
    },
});

export default function PageEnd({
    includeText,
    size = "normal",
}: PageEndProps): ReactElement {
    const { t } = useTranslation();

    return (
        <View
            style={[
                styles.pageEnd,
                {
                    height: includeText
                        ? size === "normal"
                            ? 180
                            : 80
                        : size === "normal"
                          ? 160
                          : 60,
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
