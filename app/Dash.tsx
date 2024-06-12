// Dash.tsx
// Dashboard, where you setup your path to success.

import * as React from "react";
import * as Native from "react-native";
import BeText from "@/components/Text";
import Foot from "@/components/Foot";
import * as Router from "expo-router";
import Section from "@/components/section/Section";
import Division from "@/components/section/division/Division";
import GapView from "@/components/GapView";
import Nomore from "@/components/Nomore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Btn from "@/components/Btns";

// TypeScript, supongo
interface Objective {
    exercise: string;
    days: boolean[];
    duration: number;
    repetitions: number;
    rests: number;
    restDuration: number;
    id: number;
}

// Creamos los estilos
const styles = Native.StyleSheet.create({
    containerview: {
        width: "100vw" as Native.DimensionValue,
        height: "100vh" as Native.DimensionValue,
    },
    mainview: {
        padding: 20,
        display: "flex",
        flexDirection: "column",
    },
    notiview: {
        display: "flex",
        flexDirection: "column",
    },
});

// Creamos la función
export default function Dash() {
    const [objs, setObjs] = React.useState<{ [key: string]: Objective } | null>(
        null
    );
    const [notiProps, setNotiProps] = React.useState<{
        kind: string;
        title: string;
        text: string;
        post: string | null;
    } | null>(null);

    const showNotification = (
        kind: string,
        titl: string,
        text: any,
        post: string | null
    ) => {
        setNotiProps({
            kind: kind,
            title: titl,
            text: String(text),
            post: post,
        });

        // Para que la notificación dure 7.5 segundos
        setTimeout(() => {
            setNotiProps(null);
        }, 7500);
    };

    React.useEffect(() => {
        const fetchObjectives = async () => {
            try {
                const storedObjs = await AsyncStorage.getItem("objs");
                if (storedObjs) {
                    setObjs(JSON.parse(storedObjs));
                    console.log("OBJS fetched");
                } else {
                    await AsyncStorage.setItem("objs", JSON.stringify({}));
                    console.error("Could not get OBJS fetched");
                    setObjs({});
                }
            } catch (e) {
                console.error("Could not get OBJS fetched: " + e);
            }
        };

        fetchObjectives();
    }, []);

    const createObj = (): void => {
        Router.router.navigate("Crea");
    };

    const editObj = (id: number): void => {
        console.log(id);
    };

    const deleteObj = async (id: number): Promise<void> => {
        try {
            // Confirmar la eliminación
            Native.Alert.alert(
                "Eliminar objeto",
                "¿Estás seguro de que deseas eliminar este objeto?",
                [
                    {
                        text: "Cancelar",
                        onPress: () => console.log("Cancelado"),
                        style: "cancel",
                    },
                    {
                        text: "Sí",
                        onPress: async () => {
                            try {
                                // Obtener los objetos del AsyncStorage
                                const jsonObjs =
                                    (await AsyncStorage.getItem("objs")) ??
                                    "[]";
                                const objs: Objective[] = JSON.parse(jsonObjs);

                                // Filtrar los objetos para eliminar el que coincida con el ID dado
                                const updatedObjs = objs.filter(
                                    (obj) => obj.id !== id
                                );

                                // Guardar los objetos actualizados en AsyncStorage
                                await AsyncStorage.setItem(
                                    "objs",
                                    JSON.stringify(updatedObjs)
                                );
                                console.log("Objeto eliminado correctamente.");
                            } catch (error) {
                                console.error(
                                    "Error al eliminar el objeto:",
                                    error
                                );
                            }
                        },
                    },
                ]
            );
        } catch (error) {
            console.error("Error al confirmar la eliminación:", error);
        }
    };

    let currentpage: string;
    currentpage = Router.usePathname();

    return (
        <Native.View style={styles.containerview}>
            <Native.ScrollView style={styles.mainview}>
                <BeText align="normal" weight="Bold" size={40}>
                    Dashboard
                </BeText>
                <BeText align="normal" weight="Regular" size={20}>
                    Lets set up your path to success
                </BeText>
                <GapView height={20} /> {/* oye, ¿por qué no?*/}
                <Section kind="OBJS">
                    {objs && Object.keys(objs).length > 0 ? (
                        Object.keys(objs).map((key) => {
                            const obj = objs[key];
                            if (!obj) {
                                console.error(
                                    // @ts-ignore
                                    `Data is undefined for objective with id: ${obj.id}`
                                );
                                return null;
                            }

                            let desc: string =
                                "Rests: " +
                                String(obj.rests) +
                                ", Repeats: " +
                                String(obj.repetitions) +
                                ", Rest duration: " +
                                String(obj.restDuration) +
                                " minutes.";
                            return (
                                <Native.View>
                                    <Division
                                        key={obj.id}
                                        status="REGULAR"
                                        preheader="ACTIVE OBJECTIVE"
                                        header={obj.exercise}
                                        subheader={desc}
                                    >
                                        <Btn
                                            kind="ACE"
                                            onclick={() => editObj(obj.id)}
                                            text="Edit"
                                        />
                                        <Btn
                                            kind="WOR"
                                            onclick={() => deleteObj(obj.id)}
                                            text="Remove"
                                        />
                                    </Division>
                                    <Native.View
                                        style={{
                                            paddingLeft: 20,
                                            paddingRight: 20,
                                            paddingBottom: 20,
                                        }}
                                    >
                                        <Btn
                                            width="fill"
                                            kind="GOD"
                                            text="Create active objective"
                                            onclick={createObj}
                                        />
                                    </Native.View>
                                </Native.View>
                            );
                        })
                    ) : (
                        <Native.View
                            style={{
                                padding: 20,
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <BeText
                                align="cent"
                                size={30}
                                color="#FFF"
                                weight="Bold"
                            >
                                You don't have any objective. Create one now!
                            </BeText>
                            <GapView height={15} />
                            <Btn
                                width="fill"
                                kind="ACE"
                                text="Let's go!"
                                onclick={createObj}
                            />
                        </Native.View>
                    )}
                </Section>
                <Nomore />
            </Native.ScrollView>
            <Foot page={currentpage}></Foot>
        </Native.View>
    );
}
