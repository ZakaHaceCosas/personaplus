// THIS IS THE MAIN FILE, CONTAINS NOTHING BUT ALL THE IMPORT MODULES SO THAT THEY CAN BE ACCESSED VIA import CoreLibrary from '<path>'.
// This file is expected to grow a lot in height long term...

// IMPORT MODULES

// PHYSICAL HEALTH

import * as BodyMassIndex from './physicalHealth/BodyMassIndex.js';
import * as BodyFatPercentage from './physicalHealth/BodyFatPercentage.js';
import * as IdealBodyWeight from './physicalHealth/IdealBodyWeight.js';
import * as BasalMetabolicRate from "./physicalHealth/BasalMetabolicRate.js";
import * as MetabolicEquivalentOfTask from './physicalHealth/MetabolicEquivalentOfTask.js';
import * as OneRepMax from './physicalHealth/OneRepMax.js';

// PERFORMANCE

import * as RunningPerformance from './performance/RunningPerformance.js';
import * as LiftingPerformance from './performance/LiftingPerformance.js';
import * as PushingUpPerformance from "./performance/PushingUpPerformance.js";

// Interface for all CoreLibraryModules
interface CoreLibraryModule<T = unknown> {
    default: T; // unknown, as it can be any thing
    getSource: () => string;
    getLastUpdate: () => string;
}

// Helper function to create each module
const CreateModule: <T>(module: CoreLibraryModule<T>) => { calculate: T; getSource: () => string; getLastUpdate: () => string } = <T>(module: CoreLibraryModule<T>): { calculate: T; getSource: () => string; getLastUpdate: () => string } => ({
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
