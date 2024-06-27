import * as React from "react";
import * as Native from "react-native";
import OpenHealth from "@/core/openhealth";
import { termLog } from "./DeveloperInterface";
import BetterText from "@/components/BetterText";
import GapView from "@/components/GapView";
import BottomNav from "@/components/BottomNav";

export default function openhealthtest() {
    const bmi = OpenHealth.phisicalHealth.BodyMassIndex.calculate(
        21,
        "male",
        85,
        190,
        true,
        true
    );
    termLog(JSON.stringify(bmi), "log");
    const basalloquesea =
        OpenHealth.phisicalHealth.BasalMetabolicRate.calculate(
            14,
            "male",
            45,
            170,
            "light",
            true,
            true
        );

    const performance =
        OpenHealth.performance.RunningOrWalkingPerformance.calculate(
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
            <BottomNav currentLocation="/openhealthtest" />
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
            <GapView height={20} />
            <Native.View
                style={{
                    padding: 20,
                    backgroundColor: "#FFF",
                    borderTopColor: "#F00",
                    borderTopWidth: 10,
                }}
            >
                {basalloquesea.subject && (
                    <BetterText
                        fontSize={25}
                        textAlign="normal"
                        fontWeight="Regular"
                        textColor="#000"
                    >
                        basal metabolic rate: {basalloquesea.result}
                        {"\n"}edad {basalloquesea.subject.age}
                        {"\n"}sexo {basalloquesea.subject.gender}
                        {"\n"}peso en kg {basalloquesea.subject.weight}
                        {"\n"}alto en cm {basalloquesea.subject.height}
                        {"\n"}que tan activo es:{" "}
                        {basalloquesea.subject.activness}
                        {"\n"}resultado: {basalloquesea.context}
                    </BetterText>
                )}
                <BetterText
                    fontSize={20}
                    textAlign="normal"
                    fontWeight="Regular"
                    textColor="#000"
                >
                    {"\n"}explicacion: {basalloquesea.explanation}
                </BetterText>
                <BetterText
                    fontSize={20}
                    textAlign="normal"
                    fontWeight="Regular"
                    textColor="#000"
                >
                    {"\n"}fuente:{" "}
                    {OpenHealth.phisicalHealth.BodyMassIndex.getSource()}
                </BetterText>
            </Native.View>
        </Native.View>
    );
}
