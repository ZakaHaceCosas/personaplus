/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2023-2025 The "Give It A Plus" organization and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this repository for more details.
 * <=============================================================================>
 *
 * You are in: @/app/(tabs)/about/license.tsx
 * Basically: The GPL license. A bit strict, but it is what it is.
 *
 * <=============================================================================>
 */

import React, { ReactElement } from "react";
import GapView from "@/components/ui/gap_view";
import BetterText from "@/components/text/better_text";
import { SafelyOpenUrl } from "@/toolkit/routing";
import URLs from "@/constants/urls";
import PageEnd from "../../../components/static/page_end";
import TopBar from "@/components/navigation/top_bar";
import BetterButton from "@/components/interaction/better_button";

export default function License(): ReactElement {
    // in previous versions this had the whole GPL manually formatted
    return (
        <>
            <TopBar
                includeBackButton={true}
                header="License"
                subHeader="GPL-3.0-only"
            />
            <BetterText fontSize={10} fontWeight="Regular">
                Copyright (C) 2025 ZakaHaceCosas
            </BetterText>
            <GapView height={10} />
            <BetterText fontSize={15} fontWeight="Regular">
                This program is free software: you can redistribute it and/or
                modify it under the terms of the GNU General Public License as
                published by the Free Software Foundation, either version 3 of
                the License, or (at your option) any later version. This program
                is distributed in the hope that it will be useful, but WITHOUT
                ANY WARRANTY; without even the implied warranty of
                MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
                General Public License for more details. You should have
                received a copy of the GNU General Public License along with
                this program. If not, see{" "}
                <BetterText
                    fontSize={15}
                    fontWeight="Regular"
                    isLink={true}
                    onTap={async (): Promise<void> => {
                        await SafelyOpenUrl(URLs.license);
                    }}
                >
                    https://www.gnu.org/licenses/
                </BetterText>
                .
            </BetterText>
            <GapView height={15} />
            <BetterButton
                action={async (): Promise<void> => {
                    await SafelyOpenUrl(URLs.license);
                }}
                style="ACE"
                buttonText="Full license"
                buttonHint="Open the full license in your web browser"
            />
            <PageEnd size="normal" includeText={false} />
        </>
    );
}
