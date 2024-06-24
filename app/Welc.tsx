// Welc.tsx
// Welcome page

import * as React from "react";
import * as Native from "react-native";
import * as Router from "expo-router";
import BeSwap from "@/components/Swap";
import Btn from "@/components/Btns";
import GapView from "@/components/GapView";
import BeText from "@/components/Text";
import { Picker as Select } from "@react-native-picker/picker";

// Definimos los estilos
const styles = Native.StyleSheet.create({
    flexview: {
        width: "100vw" as Native.DimensionValue,
        height: "100vh" as Native.DimensionValue,
        flex: 1,
    },
    defview: {
        width: "100vw" as Native.DimensionValue,
        height: "100vh" as Native.DimensionValue,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: 40,
        flex: 1,
    },
    flexbtns: {
        display: "flex",
        flexDirection: "row",
        gap: 15,
        width: "calc(100% - 5px)" as Native.DimensionValue,
    },
    picker: {
        padding: 12,
        width: "100%",
        backgroundColor: "#2A2D32",
        borderColor: "#3E4146",
        borderWidth: 2,
        borderRadius: 10,
        color: "#FFF",
    },
});

// Definimos la función
export default function WelcomePage() {
    const [currentTab, setTab] = React.useState(1);
    const [formData, setFormData] = React.useState({
        username: "",
        height: "",
        weight: "",
        age: "",
    });
    const [genderValue, setGenderValue] = React.useState<string | null>(null);
    const handleGenderChange = (value: string) => {
        setGenderValue(value);
    };
    const genderoptions = [
        { value: "male", label: "Male", default: true },
        { value: "female", label: "Female", default: false },
    ];
    const progenderoptions = [
        { value: "male", label: "Gigachad", default: true },
        { value: "female", label: "Transformer", default: false }, // lol.
        { value: "female", label: "Non-existant being", default: false },
    ];
    const inputRefs = React.useRef<Native.TextInput[]>([]);
    const easteregg: number = Math.floor(Math.random() * 69000) + 1;
    const [focuspointValue, setFocuspointValue] = React.useState<string | null>(
        null
    );
    const handleFocuspointChange = (value: string) => {
        setFocuspointValue(value);
    };
    const focuspointoptions = [
        {
            value: "exercising",
            label: "My focus is exercising, I need to start moving my body ASAP!",
            default: true,
        },
        {
            value: "eating",
            label: "My focus is my diet, I need to take control over what I eat.",
            default: false,
        },
        {
            value: "wellbeing",
            label: "My focus is my digital welfare & mental health.",
            // That addiction to my phone has to stop, somehow.  --- text too large, but i want to somehow get it in there...
            default: false,
        },
        // both options here equal no priority
        // then why create two options?
        // if user says he doesnt know, no focus will be used and he'll see the assistant feature (when it gets developed lol)
        // if user says he has everything as a priority, no focus will be used and he'll be free to do whatever by himself
        {
            value: "noprior",
            label: "Everything is a top priority for me!",
            default: false,
        },
        {
            value: "nopriorwithassist",
            label: "Don't know / Can't decide on one",
            default: false,
        },
    ];
    const [sleep, setSleep] = React.useState("");
    const sleeps = [
        "3 hours or less",
        "4 hours",
        "5 hours",
        "6 hours",
        "7 hours",
        "8 hours",
        "9 hours",
        "10 hours",
        "More than 10 hours",
    ];
    const focusNextField = (index: number): void => {
        if (inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    const gonext = () => {
        if (currentTab > 0 && currentTab < 4) {
            // Update number whenever you add a new tab.
            setTab(prevPage => prevPage + 1);
        } else {
            Router.router.replace("/");
        }
    };
    const goback = () => {
        setTab(prevPage => prevPage - 1);
    };

    const learnMore = async () => {
        const url =
            "https://github.com/ZakaHaceCosas/personaplus/blob/main/PRIVACY.md";
        const sup = await Native.Linking.canOpenURL(url);

        if (sup) {
            await Native.Linking.openURL(url);
        } else {
            // Error notification.
        }
    };

    const handleChange = (name: string, value: string) => {
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <Native.View style={styles.flexview}>
            <Native.View style={styles.defview}>
                {currentTab === 1 && (
                    <React.Fragment>
                        <BeText align="normal" weight="Bold" size={40}>
                            Welcome to{" "}
                            <BeText
                                align="normal"
                                weight="ExtraBold"
                                size={40}
                                color="#32FF80"
                            >
                                PersonaPlus
                            </BeText>
                            !
                        </BeText>
                        <GapView height={10} />
                        <BeText align="normal" weight="Regular" size={20}>
                            Were proud to see you want to give yourself a plus.
                        </BeText>
                        <GapView height={20} />
                        <Native.View style={styles.flexbtns}>
                            <Btn
                                kind="GOD"
                                onclick={gonext}
                                text="Let's get started!"
                                width="fill"
                                height={500}
                            />
                        </Native.View>
                    </React.Fragment>
                )}

                {currentTab === 2 && (
                    <React.Fragment>
                        <BeText align="normal" weight="Bold" size={40}>
                            Tell us about yourself
                        </BeText>
                        <GapView height={10} />
                        <BeText align="normal" weight="Regular" size={20}>
                            We only ask for the data we need for the app to
                            work. No data is sent outside of this device, ever.{" "}
                            <BeText
                                url={true}
                                align="normal"
                                weight="Regular"
                                size={20}
                                color="#3280FF"
                                onTap={learnMore}
                            >
                                Learn more
                            </BeText>
                            .
                        </BeText>
                        <GapView height={20} />
                        <Native.TextInput
                            placeholder="Username (doesn't have to be your real name)"
                            value={formData.username}
                            readOnly={false}
                            placeholderTextColor="#949698"
                            style={[
                                {
                                    backgroundColor: "#2A2D32",
                                    borderRadius: 10,
                                    padding: 15,
                                    borderWidth: 4,
                                    borderColor: "#3E4146",
                                    width: "100%",
                                    color: "white",
                                    // @ts-expect-error: For some reason appears as "non supported property", but it does work properly.
                                    outline: "none",
                                    fontFamily: "BeVietnamPro-Regular",
                                },
                            ]}
                            autoCorrect={false}
                            multiline={false}
                            maxLength={40}
                            textAlign="left"
                            fontFamily="BeVietnamPro-Regular"
                            textContentType="username"
                            key="usernameinput"
                            enterKeyHint="next"
                            onChangeText={text =>
                                handleChange("username", text)
                            }
                            onSubmitEditing={() => focusNextField(0)}
                            ref={ref => ref && (inputRefs.current[0] = ref)}
                        />
                        <GapView height={15} />
                        <Native.TextInput
                            placeholder="Height (cm)"
                            value={formData.height}
                            readOnly={false}
                            placeholderTextColor="#949698"
                            style={[
                                {
                                    backgroundColor: "#2A2D32",
                                    borderRadius: 10,
                                    padding: 15,
                                    borderWidth: 4,
                                    borderColor: "#3E4146",
                                    width: "100%",
                                    color: "white",
                                    // @ts-expect-error: For some reason appears as "non supported property", but it does work properly.
                                    outline: "none",
                                    fontFamily: "BeVietnamPro-Regular",
                                },
                            ]}
                            autoCorrect={false}
                            multiline={false}
                            maxLength={6}
                            textAlign="left"
                            fontFamily="BeVietnamPro-Regular"
                            textContentType="none"
                            inputMode="numeric"
                            key="heightinput"
                            enterKeyHint="next"
                            onChangeText={text => handleChange("height", text)}
                            onSubmitEditing={() => focusNextField(1)}
                            ref={ref => ref && (inputRefs.current[1] = ref)}
                        />
                        <GapView height={15} />
                        <Native.TextInput
                            placeholder="Weight (kg)"
                            value={formData.weight}
                            readOnly={false}
                            placeholderTextColor="#949698"
                            style={[
                                {
                                    backgroundColor: "#2A2D32",
                                    borderRadius: 10,
                                    padding: 15,
                                    borderWidth: 4,
                                    borderColor: "#3E4146",
                                    width: "100%",
                                    color: "white",
                                    // @ts-expect-error: For some reason appears as "non supported property", but it does work properly.
                                    outline: "none",
                                    fontFamily: "BeVietnamPro-Regular",
                                },
                            ]}
                            autoCorrect={false}
                            multiline={false}
                            maxLength={6}
                            textAlign="left"
                            fontFamily="BeVietnamPro-Regular"
                            textContentType="none"
                            inputMode="numeric"
                            key="weightinput"
                            enterKeyHint="next"
                            onChangeText={text => handleChange("weight", text)}
                            onSubmitEditing={() => focusNextField(2)}
                            ref={ref => ref && (inputRefs.current[2] = ref)}
                        />
                        <GapView height={15} />
                        <Native.TextInput
                            placeholder="Age (years)"
                            value={formData.age}
                            readOnly={false}
                            placeholderTextColor="#949698"
                            style={[
                                {
                                    backgroundColor: "#2A2D32",
                                    borderRadius: 10,
                                    padding: 15,
                                    borderWidth: 4,
                                    borderColor: "#3E4146",
                                    width: "100%",
                                    color: "white",
                                    // @ts-expect-error: For some reason appears as "non supported property", but it does work properly.
                                    outline: "none",
                                    fontFamily: "BeVietnamPro-Regular",
                                },
                            ]}
                            autoCorrect={false}
                            multiline={false}
                            maxLength={3}
                            textAlign="left"
                            fontFamily="BeVietnamPro-Regular"
                            textContentType="none"
                            inputMode="numeric"
                            key="ageinput"
                            enterKeyHint="done"
                            onChangeText={text => handleChange("age", text)}
                            onSubmitEditing={gonext}
                            ref={ref => ref && (inputRefs.current[3] = ref)}
                        />
                        <GapView height={15} />
                        {easteregg !== 1 && (
                            <BeSwap
                                id="genderswap"
                                key="genderswap"
                                options={genderoptions}
                                value={genderValue}
                                onValueChange={handleGenderChange}
                                order="horizontal"
                            />
                        )}
                        {easteregg === 1 && (
                            <BeSwap
                                id="genderswap"
                                key="genderswap"
                                options={progenderoptions}
                                value={genderValue}
                                onValueChange={handleGenderChange}
                                order="horizontal"
                            />
                        )}
                        <GapView height={15} />
                        <Native.View style={styles.flexbtns}>
                            <Btn
                                kind="DEFAULT"
                                onclick={goback}
                                text="Go back"
                                width="fill"
                            />
                            <Btn
                                kind="ACE"
                                onclick={gonext}
                                text="Continue"
                                width="fill"
                            />
                        </Native.View>
                    </React.Fragment>
                )}

                {currentTab === 3 && (
                    <React.Fragment>
                        <BeText align="normal" weight="Bold" size={40}>
                            What is your main objective?
                        </BeText>
                        <GapView height={10} />
                        <BeText align="normal" weight="Regular" size={20}>
                            We know you want to improve yourself, but, what is
                            your key focus point?
                        </BeText>
                        <GapView height={10} />
                        <BeText
                            align="normal"
                            weight="Regular"
                            size={10}
                            color="#C8C8C8"
                        >
                            Choose only one option. You can change it any time.
                        </BeText>
                        <GapView height={20} />
                        <BeSwap
                            id="focuspointswap"
                            key="focuspointswap"
                            options={focuspointoptions}
                            value={focuspointValue}
                            order="horizontal"
                            onValueChange={handleFocuspointChange}
                        />
                        <GapView height={15} />
                        <Native.View style={styles.flexbtns}>
                            <Btn
                                kind="DEFAULT"
                                onclick={goback}
                                text="Go back"
                                width="fill"
                            />
                            <Btn
                                kind="ACE"
                                onclick={gonext}
                                text="Continue"
                                width="fill"
                            />
                        </Native.View>
                    </React.Fragment>
                )}

                {currentTab === 4 && (
                    <React.Fragment>
                        <BeText align="normal" weight="Bold" size={40}>
                            Tell us about your habits
                        </BeText>
                        <GapView height={10} />
                        <BeText align="normal" weight="Regular" size={20}>
                            Understanding your life will help us help you
                            improve it.
                        </BeText>
                        <GapView height={20} />
                        <Select
                            selectedValue={sleep}
                            onValueChange={itemValue => setSleep(itemValue)}
                            style={styles.picker}
                            mode="dropdown"
                        >
                            {sleeps.map(sleep => (
                                <Select.Item
                                    key={sleep}
                                    label={sleep}
                                    value={sleep}
                                />
                            ))}
                        </Select>
                        <GapView height={15} />
                        <Native.View style={styles.flexbtns}>
                            <Btn
                                kind="DEFAULT"
                                onclick={goback}
                                text="Go back"
                                width="fill"
                            />
                            <Btn
                                kind="ACE"
                                onclick={gonext}
                                text="Continue"
                                width="fill"
                            />
                        </Native.View>
                    </React.Fragment>
                )}
            </Native.View>
        </Native.View>
    );
}
