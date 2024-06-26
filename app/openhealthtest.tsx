import * as React from "react";
import * as Native from "react-native";
import OpenHealth from "@/core/openhealth";
import { termLog } from "./DeveloperInterface";
import BetterText from "@/components/BetterText";
import GapView from "@/components/GapView";

export default function openhealthtest() {
    const bmi = OpenHealth.phisicalHealth.calculateBodyMassIndex(
        21,
        "male",
        85,
        190,
        true,
        true
    );
    termLog(JSON.stringify(bmi), "log");

    const performance =
        OpenHealth.performance.calculateRunningOrWalkingPerformance(
            25,
            "male",
            55,
            175,
            4,
            0.2,
            true,
            true
        );
    termLog(JSON.stringify(performance), "log");

    return (
        <Native.View>
            <Native.View
                style={{
                    padding: 20,
                    backgroundColor: "#FFF",
                    borderTopColor: "#F00",
                    borderTopWidth: 10,
                }}
            >
                {bmi.subject && (
                    <BetterText
                        fontSize={25}
                        textAlign="normal"
                        fontWeight="Regular"
                        textColor="#000"
                    >
                        calculo indice de masa corporal: {bmi.result}
                        {"\n"}edad {bmi.subject.age}
                        {"\n"}sexo {bmi.subject.gender}
                        {"\n"}peso en kg {bmi.subject.weight}
                        {"\n"}alto en cm {bmi.subject.height}
                        {"\n"}resultado: {bmi.context}
                    </BetterText>
                )}
                <BetterText
                    fontSize={20}
                    textAlign="normal"
                    fontWeight="Regular"
                    textColor="#000"
                >
                    {"\n"}explicacion: {bmi.explanation}
                </BetterText>
            </Native.View>
            <GapView height={20} />
            <Native.View
                style={{
                    padding: 20,
                    backgroundColor: "#FFF",
                    borderTopColor: "#F00",
                    borderTopWidth: 10,
                }}
            >
                {performance.subject && (
                    <BetterText
                        fontSize={25}
                        textAlign="normal"
                        fontWeight="Regular"
                        textColor="#000"
                    >
                        calculo de calorias quemadas: {performance.result}
                        {"\n"}edad {performance.subject.age}
                        {"\n"}sexo {performance.subject.gender}
                        {"\n"}peso en kg {performance.subject.weight}
                        {"\n"}alto en cm {performance.subject.height}
                        {"\n"}duracion {performance.subject.time}
                        {"\n"}velocidad {performance.subject.speed}
                        {"\n"}resultado: {performance.context}
                    </BetterText>
                )}
                <BetterText
                    fontSize={20}
                    textAlign="normal"
                    fontWeight="Regular"
                    textColor="#000"
                >
                    {"\n"}explicacion: {performance.explanation}
                </BetterText>
            </Native.View>
        </Native.View>
    );
}
