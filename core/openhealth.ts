// THIS IS THE MAIN FILE, CONTAINS NOTHING BUT ALL THE IMPORT MODULES SO THAT THEY CAN BE ACCESSED VIA import OpenHealth from '<path>'.
// This file is expect to grow a lot in height...

// IMPORT MODULES

// PHISICAL HEALTH

import * as BodyMassIndex from '@/core/physicalHealth/BodyMassIndex';
import * as BodyFatPercentage from '@/core/physicalHealth/BodyFatPercentage';
import * as IdealBodyWeight from '@/core/physicalHealth/IdealBodyWeight';
import * as BasalMetabolicRate from "@/core/physicalHealth/BasalMetabolicRate";
import * as MetabolicEquivalentOfTask from '@/core/physicalHealth/MetabolicEquivalentOfTask';
import * as OneRepMax from '@/core/physicalHealth/OneRepMax';

// PERFORMANCE

import * as RunningPerformance from '@/core/performance/RunningPerformance';
import * as LiftingPerformance from '@/core/performance/LiftingPerformance';
import * as PushingUpPerformance from "@/core/performance/PushingUpPerformance";

// Interface for all OpenHealthModules
interface OpenHealthModule<T = unknown> {
    default: T; // Define el tipo de retorno real si lo sabes
    getSource: () => string; // Define el tipo de retorno real si lo sabes
    getLastUpdate: () => string; // Define el tipo de retorno real si lo sabes
}

// Helper function to create each module
const CreateModule = <T>(module: OpenHealthModule<T>) => ({
    calculate: module.default,
    getSource: module.getSource,
    getLastUpdate: module.getLastUpdate
});

// DEFINITION
const OpenHealth = {
    physicalHealth: {
        BodyMassIndex: CreateModule(BodyMassIndex),
        BodyFatPercentage: CreateModule(BodyFatPercentage),
        IdealBodyWeight: CreateModule(IdealBodyWeight),
        BasalMetabolicRate: CreateModule(BasalMetabolicRate),
        getMetabolicEquivalentOfTask: CreateModule(MetabolicEquivalentOfTask),
        OneRepetitionMax: CreateModule(OneRepMax),
    },
    performance: {
        RunningOrWalkingPerformance: CreateModule(RunningPerformance),
        LiftingPerformance: CreateModule(LiftingPerformance),
        PushingUpPerformance: CreateModule(PushingUpPerformance),
    },
};

export default OpenHealth;
