// index.tsx
// Welcome to PersonaPlus. Give yourself a plus!

import * as React from "react";
import * as Native from "react-native";
import BetterText from "@/components/BetterText";
import Section from "@/components/section/Section";
import * as Router from "expo-router";
import Division from "@/components/section/division/Division";
import Button from "@/components/Buttons";
import GapView from "@/components/GapView";

// Creamos los estilos
const styles = Native.StyleSheet.create({
    containerview: {
        width: "100vw" as Native.DimensionValue,
        height: "100vh" as Native.DimensionValue,
    },
    mainview: {
        padding: 20,
        paddingTop: 50,
        display: "flex",
        flexDirection: "column",
        width: "100vw" as Native.DimensionValue,
        height: "100vh" as Native.DimensionValue,
        overflow: "scroll",
    },
});

// Creamos la función
export default function Home() {
    // const currentpage: string = Router.usePathname();

    return (
        <Native.View style={styles.containerview}>
            <Native.ScrollView style={styles.mainview}>
                <BetterText
                    fontSize={25}
                    fontWeight="Light"
                    onTap={() => Router.router.navigate("/Profile")}
                >
                    {"<"} Go back
                </BetterText>
                <GapView height={20} />
                <BetterText textAlign="normal" fontWeight="Bold" fontSize={40}>
                    About PersonaPlus
                </BetterText>
                <GapView height={20} />
                <Section kind="About">
                    <Division
                        preheader="About the project"
                        header="What is PersonaPlus?"
                    >
                        <BetterText fontWeight="Regular" fontSize={15}>
                            It&apos;s clear what it is. An app designed to help
                            you be better. Currently it&apos;s on a very early
                            stage of development, so I can&apos;t say (yet)
                            it&apos;s a revolution. But it is, indeed, a piece
                            of hard work designed to make your life better.
                        </BetterText>
                    </Division>
                </Section>
                <GapView height={20} />
                <Section kind="About">
                    <Division
                        preheader="About the creator"
                        header="Who is PersonaPlus?"
                    >
                        <BetterText fontWeight="Regular" fontSize={15}>
                            I&apos;m Zaka and I Do Stuff. I&apos;ve been since
                            2023 working on this as my first ever React project.
                            Yep, this is my first time coding with the
                            technology that powers the app! I didn&apos;t want
                            to start with a test project that would end on the
                            garbage, I wanted to make something useful, and here
                            I am!
                            {"\n"}
                            Also, at the moment there aren&apos;t any
                            contributors yet, but remember this is a fully open
                            source app! You can help it grow at any time, and
                            get credited here - as deserved!
                        </BetterText>
                    </Division>
                </Section>
                <GapView height={40} />
                <BetterText
                    textAlign="center"
                    fontWeight="Bold"
                    fontSize={40}
                    textColor="#32FF80"
                >
                    Give yourself a plus!
                </BetterText>
                <GapView height={40} />
                <Button
                    buttonText="License"
                    style="GOD"
                    action={() => Router.router.navigate("/License")}
                />
                <GapView height={15} />
                <Button
                    buttonText="OSS used"
                    style="ACE"
                    action={() => Router.router.navigate("/OpenSourceCredits")}
                />
                <GapView height={15} />
                <Button
                    buttonText="Privacy policy (external link)"
                    style="ACE"
                    action={() =>
                        Native.Linking.openURL(
                            "https://github.com/ZakaHaceCosas/personaplus/blob/main/PRIVACY.md"
                        )
                    }
                />
            </Native.ScrollView>
        </Native.View>
    );
}
