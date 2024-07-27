import React from "react";
import { View } from "react-native";
import OpenHealth from "@/core/openhealth";
import { termLog } from "@/src/toolkit/debug/console";
import BetterText from "@/src/BetterText";
import GapView from "@/src/GapView";
import BottomNav from "@/src/BottomNav";
import colors from "@/src/toolkit/design/colors";

export default function openhealthtest() {
    const bmi = OpenHealth.physicalHealth.BodyMassIndex.calculate(
        21,
        "male",
        85,
        190,
        true,
        true
    );
    termLog(JSON.stringify(bmi), "log");
    const basalloquesea =
        OpenHealth.physicalHealth.BasalMetabolicRate.calculate(
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
        <View>
            <BottomNav currentLocation="/openhealthtest" />
            <View
                style={{
                    padding: 20,
                    backgroundColor: colors.BASIC.WHITE,
                    borderTopColor: colors.PRIMARIES.WOR.WOR,
                    borderTopWidth: 10,
                }}
            >
                {bmi.subject && (
                    <BetterText
                        fontSize={25}
                        textAlign="normal"
                        fontWeight="Regular"
                        textColor={colors.BASIC.BLACK}
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
                    textColor={colors.BASIC.BLACK}
                >
                    {"\n"}explicacion: {bmi.explanation}
                </BetterText>
            </View>
            <GapView height={20} />
            <View
                style={{
                    padding: 20,
                    backgroundColor: colors.BASIC.WHITE,
                    borderTopColor: colors.PRIMARIES.WOR.WOR,
                    borderTopWidth: 10,
                }}
            >
                {performance.subject && (
                    <BetterText
                        fontSize={25}
                        textAlign="normal"
                        fontWeight="Regular"
                        textColor={colors.BASIC.BLACK}
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
                    textColor={colors.BASIC.BLACK}
                >
                    {"\n"}explicacion: {performance.explanation}
                </BetterText>
            </View>
            <GapView height={20} />
            <View
                style={{
                    padding: 20,
                    backgroundColor: colors.BASIC.WHITE,
                    borderTopColor: colors.PRIMARIES.WOR.WOR,
                    borderTopWidth: 10,
                }}
            >
                {basalloquesea.subject && (
                    <BetterText
                        fontSize={25}
                        textAlign="normal"
                        fontWeight="Regular"
                        textColor={colors.BASIC.BLACK}
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
                    textColor={colors.BASIC.BLACK}
                >
                    {"\n"}explicacion: {basalloquesea.explanation}
                </BetterText>
                <BetterText
                    fontSize={20}
                    textAlign="normal"
                    fontWeight="Regular"
                    textColor={colors.BASIC.BLACK}
                >
                    {"\n"}fuente:{" "}
                    {OpenHealth.physicalHealth.BodyMassIndex.getSource()}
                </BetterText>
            </View>
        </View>
    );
}
