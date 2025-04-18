import { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import { BetterTextSmallText } from "@/components/text/better_text_presets";
import Colors from "@/constants/colors";

/**
 * BetterTableItem
 *
 * @export
 * @interface BetterTableItem
 */
export interface BetterTableItem {
    /**
     * The name of the item
     *
     * @type {string}
     */
    name: string;
    /**
     * The value of the item
     *
     * @type {string}
     */
    value: string;
}

/**
 * BetterTableProps
 *
 * @interface BetterTableProps
 */
interface BetterTableProps {
    /**
     * The header rows for the table.
     *
     * @type {string[]}
     */
    headers: string[];
    /**
     * The items of the table. An array of `BetterTableItem`s.
     *
     * @type {BetterTableItem[]}
     */
    items: BetterTableItem[];
}

const styles = StyleSheet.create({
    table: {
        width: "100%",
        height: "auto",
        borderRadius: 10,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: Colors.MAIN.DEFAULT_ITEM.STROKE,
    },
    header: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.MAIN.DEFAULT_ITEM.BACKGROUND,
        padding: 10,
        height: 40,
    },
    item: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    row: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        height: "auto",
        minHeight: 45,
        borderTopWidth: 1,
        borderTopColor: Colors.MAIN.DEFAULT_ITEM.STROKE,
    },
    cell: {
        flex: 1,
        textAlign: "center",
    },
});

/**
 * A simple table. Note it relies on good usage - you _should_ have only two headers as it only supports two columns per row (`item` and `value`).
 * @export
 * @param {BetterTableProps} p
 * @param {string[]} p.headers
 * @param {BetterTableItem[]} p.items
 * @returns {ReactElement}
 */
export default function BetterTable({
    headers,
    items,
}: BetterTableProps): ReactElement {
    return (
        <View style={styles.table}>
            <View style={styles.header}>
                {headers.map(
                    (header: string): ReactElement => (
                        <View key={header} style={styles.item}>
                            <BetterTextSmallText>{header}</BetterTextSmallText>
                        </View>
                    ),
                )}
            </View>
            {items.map(
                (item: BetterTableItem): ReactElement => (
                    <View key={item.name} style={styles.row}>
                        <View style={styles.item}>
                            <BetterTextSmallText>
                                {item.name}
                            </BetterTextSmallText>
                        </View>
                        <View style={styles.item}>
                            <BetterTextSmallText>
                                {item.value}
                            </BetterTextSmallText>
                        </View>
                    </View>
                ),
            )}
        </View>
    );
}
