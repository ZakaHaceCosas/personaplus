// THIS IS THE MAIN FILE, CONTAINS NOTHING BUT ALL THE IMPORT MODULES SO THAT THEY CAN BE ACCESSED VIA import CoreLibrary from '<path>'.
// This file is expected to grow a lot in height long term...

// IMPORT MODULES

// PHYSICAL HEALTH
import * as BodyMassIndex from "@/core/physical_health/bmi";
import * as BodyFatPercentage from "@/core/physical_health/bfp";
import * as IdealBodyWeight from "@/core/physical_health/ibw";
import * as BasalMetabolicRate from "@/core/physical_health/bmr";
import * as MetabolicEquivalentOfTask from "@/core/physical_health/met";
import * as OneRepMax from "@/core/physical_health/one_rep_max";
import * as USNavyBodyFatPercentage from "@/core/physical_health/us-bfp";

// PERFORMANCE
import * as RunningPerformance from "@/core/performance/running";
import * as LiftingPerformance from "@/core/performance/lifting";
import * as PushingUpPerformance from "@/core/performance/pushing_up";
import * as TotalDailyEnergyExpenditure from "./physical_health/tdee";

// Interface for all CoreLibraryModules
interface CoreLibraryModule<T = unknown> {
    default: T; // unknown, as it can be anything
    getSources: () => string[];
    getLastUpdate: () => string;
}

// Alias for the return type of the CreateModule function
type ModuleReturn<T> = {
    calculate: T;
    getSources: () => string[];
    getLastUpdate: () => string;
};

// Helper function to create each module
const CreateModule: <T>(module: CoreLibraryModule<T>) => ModuleReturn<T> = <T>(
    module: CoreLibraryModule<T>,
): ModuleReturn<T> => ({
    calculate: module.default,
    getSources: module.getSources,
    getLastUpdate: module.getLastUpdate,
});

// DEFINITION
const CoreLibrary = {
    physicalHealth: {
        BodyMassIndex: CreateModule(BodyMassIndex),
        BodyFatPercentage: CreateModule(BodyFatPercentage),
        IdealBodyWeight: CreateModule(IdealBodyWeight),
        BasalMetabolicRate: CreateModule(BasalMetabolicRate),
        TotalDailyEnergyExpenditure: CreateModule(TotalDailyEnergyExpenditure),
        getMetabolicEquivalentOfTask: CreateModule(MetabolicEquivalentOfTask),
        OneRepetitionMax: CreateModule(OneRepMax),
        USNavyBodyFatPercentage: CreateModule(USNavyBodyFatPercentage),
    },
    performance: {
        RunningPerformance: CreateModule(RunningPerformance),
        LiftingPerformance: CreateModule(LiftingPerformance),
        PushingUpPerformance: CreateModule(PushingUpPerformance),
    },
};

export default CoreLibrary;
