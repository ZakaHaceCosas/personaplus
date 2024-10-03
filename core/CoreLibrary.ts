// THIS IS THE MAIN FILE, CONTAINS NOTHING BUT ALL THE IMPORT MODULES SO THAT THEY CAN BE ACCESSED VIA import CoreLibrary from '<path>'.
// This file is expected to grow a lot in height long term...

// IMPORT MODULES

// PHYSICAL HEALTH

import * as BodyMassIndex from './physicalHealth/BodyMassIndex';
import * as BodyFatPercentage from './physicalHealth/BodyFatPercentage';
import * as IdealBodyWeight from './physicalHealth/IdealBodyWeight';
import * as BasalMetabolicRate from "./physicalHealth/BasalMetabolicRate";
import * as MetabolicEquivalentOfTask from './physicalHealth/MetabolicEquivalentOfTask';
import * as OneRepMax from './physicalHealth/OneRepMax';

// PERFORMANCE

import * as RunningPerformance from './performance/RunningPerformance';
import * as LiftingPerformance from './performance/LiftingPerformance';
import * as PushingUpPerformance from "./performance/PushingUpPerformance";

// Interface for all CoreLibraryModules
interface CoreLibraryModule<T = unknown> {
    default: T; // unknown, as it can be anything
    getSource: () => string;
    getLastUpdate: () => string;
}

// Alias for the return type of the CreateModule function
type ModuleReturn<T> = {
    calculate: T;
    getSource: () => string;
    getLastUpdate: () => string;
};

// Helper function to create each module
const CreateModule: <T>(module: CoreLibraryModule<T>) => ModuleReturn<T> = <T>(module: CoreLibraryModule<T>): ModuleReturn<T> => ({
    calculate: module.default,
    getSource: module.getSource,
    getLastUpdate: module.getLastUpdate
});

// DEFINITION
const CoreLibrary = {
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

export default CoreLibrary;
