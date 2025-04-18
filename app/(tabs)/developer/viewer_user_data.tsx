import TopBar from "@/components/navigation/top_bar";
import Loading from "@/components/static/loading";
import PageEnd from "@/components/static/page_end";
import { BetterTextSmallText } from "@/components/text/better_text_presets";
import BetterTable, { BetterTableItem } from "@/components/ui/better_table";
import GapView from "@/components/ui/gap_view";
import { OrchestrateUserData } from "@/toolkit/user";
import { FullProfile } from "@/types/user";
import React, { ReactElement, useEffect, useState } from "react";

export default function ViewerUserData(): ReactElement {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [userData, setUserData] = useState<BetterTableItem[]>([]);

    useEffect((): void => {
        async function handler(): Promise<void> {
            try {
                // user data
                const userData: FullProfile = await OrchestrateUserData();
                const mappedArray: BetterTableItem[] = Object.entries(
                    userData,
                ).map(
                    ([key, value]: [string, string]): BetterTableItem =>
                        ({
                            name: key,
                            value: JSON.stringify(value),
                        }) as BetterTableItem,
                );
                setUserData(mappedArray);
            } catch (e) {
                setError(`Error fetching data at DevInterface: ${e}`);
            } finally {
                setLoading(false);
            }
        }

        handler();
    }, []);

    if (loading) return <Loading />;

    return (
        <>
            <TopBar
                includeBackButton={true}
                header="Your data"
                subHeader="Everything we know about you. It's all stored privately on your device."
            />
            {userData.length > 0 && (
                <>
                    <BetterTextSmallText>
                        Some of this data is only used internally and nowhere
                        else shown to you.
                    </BetterTextSmallText>
                    <GapView height={5} />
                    {error ? (
                        <BetterTextSmallText>{error}</BetterTextSmallText>
                    ) : (
                        <BetterTable
                            headers={["Key", "Value"]}
                            items={userData}
                        />
                    )}
                </>
            )}
            <PageEnd includeText={true} size="tiny" />
        </>
    );
}
