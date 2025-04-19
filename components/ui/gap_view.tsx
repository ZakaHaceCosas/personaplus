/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2023-2025 The "Give It A Plus" organization and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this repository for more details.
 * <=============================================================================>
 *
 * You are in: @/components/ui/gap_view.tsx
 * Basically: A vertical and horizontal spacer, to avoid flex-gap. Performance wise.
 *
 * <=============================================================================>
 */

import React, { NamedExoticComponent, ReactElement } from "react";
import { StyleSheet, View } from "react-native";

// TypeScript, supongo
/**
 * GapViewProps interface
 *
 * @interface GapViewProps
 */
interface GapViewProps {
    /**
     * The height of the GapView
     *
     * @type {?number}
     */
    height?: number; // Tamaño vertical.
    /**
     * The width of the GapView
     *
     * @type {?number}
     */
    width?: number; // Tamaño horizontal.
}

/**
 * Homemade custom gap component. Think of it as an invisible box that creates empty space. It renders an empty `<View>` component with custom width and/or height, replicating gap to space items.
 *
 * @export
 * @param {GapViewProps} p
 * @param {number} p.height
 * @param {number} p.width
 * @returns {ReactElement}
 */
const GapView: NamedExoticComponent<GapViewProps> = React.memo(
    function GapView({ height, width }: GapViewProps): ReactElement {
        const styles: {
            view: { height: number | undefined; width: number | undefined };
        } = StyleSheet.create({
            view: { height, width },
        });

        return <View style={styles.view} />;
    },
);

export default GapView;
