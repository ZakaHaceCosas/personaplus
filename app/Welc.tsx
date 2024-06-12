// Welc.tsx
// Welcome page

import * as React from "react";
import * as Native from "react-native";
import * as Router from "expo-router";
import BeSwap from "@/components/Swap";
import Btn from "@/components/Btns";
import GapView from "@/components/GapView";
import BeText from "@/components/Text";

// Definimos los estilos
const styles = Native.StyleSheet.create({
    defview: {
        width: "100vw" as Native.DimensionValue, // Ignora el error, funciona correctamente. Cosas de TypeScript.
        height: "100vh" as Native.DimensionValue, // Ignora el error, funciona correctamente. Cosas de TypeScript.
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: 40,
    },
    flexbtns: {
        display: "flex",
        flexDirection: "row",
        gap: 15,
        width: "calc(100% - 5px)" as Native.DimensionValue,
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
        { value: "trans", label: "Transformer", default: false },
        { value: "female", label: "Non-existant being", default: false },
    ];
    const inputRefs = React.useRef<Native.TextInput[]>([]);
    const easteregg: number = Math.floor(Math.random() * 69000) + 1;

    const focusNextField = (index: number): void => {
        if (inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    const gonext = () => {
        if (currentTab > 0 && currentTab < 3) {
            // Update number whenever you add a new tab.
            setTab((prevPage) => prevPage + 1);
        } else {
            Router.router.replace("/");
        }
    };
    const goback = () => {
        setTab((prevPage) => prevPage - 1);
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
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
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
                        We're proud to see you want to give yourself a plus.
                    </BeText>
                    <GapView height={20} />
                    <Native.View style={styles.flexbtns}>
                        <Btn
                            kind="ACE"
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
                        Tell us a bit about yourself
                    </BeText>
                    <GapView height={10} />
                    <BeText align="normal" weight="Regular" size={20}>
                        We only ask for the data we do need for the app to
                        function. No data is sent outside of this device, ever.{" "}
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
                                // @ts-ignore
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
                        onChangeText={(text) => handleChange("username", text)}
                        onSubmitEditing={() => focusNextField(0)}
                        ref={(ref) => ref && (inputRefs.current[0] = ref)}
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
                                // @ts-ignore
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
                        onChangeText={(text) => handleChange("height", text)}
                        onSubmitEditing={() => focusNextField(1)}
                        ref={(ref) => ref && (inputRefs.current[1] = ref)}
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
                                // @ts-ignore
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
                        onChangeText={(text) => handleChange("weight", text)}
                        onSubmitEditing={() => focusNextField(2)}
                        ref={(ref) => ref && (inputRefs.current[2] = ref)}
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
                                // @ts-ignore
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
                        onChangeText={(text) => handleChange("age", text)}
                        onSubmitEditing={gonext}
                        ref={(ref) => ref && (inputRefs.current[3] = ref)}
                    />
                    <GapView height={15} />
                    {easteregg !== 1 && (
                        <BeSwap
                            id="genderswap"
                            key="genderswap"
                            options={genderoptions}
                            value={genderValue}
                            onValueChange={handleGenderChange}
                        />
                    )}
                    {easteregg === 1 && (
                        <BeSwap
                            id="genderswap"
                            key="genderswap"
                            options={progenderoptions}
                            value={genderValue}
                            onValueChange={handleGenderChange}
                        />
                    )}
                    <GapView height={15} />
                    <Native.View style={styles.flexbtns}>
                        <Btn
                            kind="UNKNOWN"
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
                // TO DO !!!!!!!!!
                // zaka no seas vago, trabaja XD
                <React.Fragment>
                    <BeText align="normal" weight="Bold" size={40}>
                        What is your main objective?
                    </BeText>
                    <GapView height={10} />
                    <BeText align="normal" weight="Regular" size={20}>
                        We know you want to improve yourself, but, what is your
                        key focus point?
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
                                // @ts-ignore
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
                        onChangeText={(text) => handleChange("username", text)}
                        onSubmitEditing={() => focusNextField(0)}
                        ref={(ref) => ref && (inputRefs.current[0] = ref)}
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
                                // @ts-ignore
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
                        onChangeText={(text) => handleChange("height", text)}
                        onSubmitEditing={() => focusNextField(1)}
                        ref={(ref) => ref && (inputRefs.current[1] = ref)}
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
                                // @ts-ignore
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
                        onChangeText={(text) => handleChange("weight", text)}
                        onSubmitEditing={() => focusNextField(2)}
                        ref={(ref) => ref && (inputRefs.current[2] = ref)}
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
                                // @ts-ignore
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
                        onChangeText={(text) => handleChange("age", text)}
                        onSubmitEditing={gonext}
                        ref={(ref) => ref && (inputRefs.current[3] = ref)}
                    />
                    <GapView height={15} />
                    {easteregg !== 1 && (
                        <BeSwap
                            id="genderswap"
                            key="genderswap"
                            options={genderoptions}
                            value={genderValue}
                            onValueChange={handleGenderChange}
                        />
                    )}
                    {easteregg === 1 && (
                        <BeSwap
                            id="genderswap"
                            key="genderswap"
                            options={progenderoptions}
                            value={genderValue}
                            onValueChange={handleGenderChange}
                        />
                    )}
                    <GapView height={15} />
                    <Native.View style={styles.flexbtns}>
                        <Btn
                            kind="UNKNOWN"
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
    );
}
