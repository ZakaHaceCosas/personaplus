// THIS IS THE MAIN FILE, CONTAINS NOTHING BUT ALL THE IMPORT MODULES SO THAT THEY CAN BE ACCESSED VIA import OpenHealth from '<path>'.
// This file is expect to grow a lot in height...

// IMPORT MODULES

// PHISICAL HEALTH

import * as BodyMassIndex from '@/core/physicalHealth/BodyMassIndex';
import * as BodyFatPercentage from '@/core/physicalHealth/BodyFatPercentage';
import * as IdealBodyWeight from '@/core/physicalHealth/IdealBodyWeight';
import * as BasalMetabolicRate from "@/core/physicalHealth/BasalMetabolicRate";
import * as getMetabolicEquivalentOfTask from '@/core/physicalHealth/MetabolicEquivalentOfTask';
import * as oneRepetitionMax from '@/core/physicalHealth/OneRepMax';

// PERFORMANCE

import * as calculateRunningOrWalkingPerformance from '@/core/performance/RunningPerformance';
import * as calculateLiftingPerformance from '@/core/performance/LiftingPerformance';
import * as calculatePushingUpPerformance from "@/core/performance/PushingUpPerformance";

// DEFINITION

/**
 * @type {OpenHealth}
 * @description Main library where everything comes from.
*/

const OpenHealth = {
    physicalHealth: {
        BodyMassIndex: {
            calculate: BodyMassIndex.default,
            getSource: BodyMassIndex.getSource,
            getLastUpdate: BodyMassIndex.getLastUpdate
        },
        BodyFatPercentage: {
            calculate: BodyFatPercentage.default,
            getSource: BodyFatPercentage.getSource,
            getLastUpdate: BodyFatPercentage.getLastUpdate
        },
        IdealBodyWeight: {
            calculate: IdealBodyWeight.default,
            getSource: IdealBodyWeight.getSource,
            getLastUpdate: IdealBodyWeight.getLastUpdate
        },
        BasalMetabolicRate: {
            calculate: BasalMetabolicRate.default,
            getSource: BasalMetabolicRate.getSource,
            getLastUpdate: BasalMetabolicRate.getLastUpdate
        },
        getMetabolicEquivalentOfTask: {
            calculate: getMetabolicEquivalentOfTask.default,
            getSource: getMetabolicEquivalentOfTask.getSource,
            getLastUpdate: getMetabolicEquivalentOfTask.getLastUpdate
        },
        OneRepetitionMax: {
            calculate: oneRepetitionMax.default,
            getSource: oneRepetitionMax.getSource,
            getLastUpdated: oneRepetitionMax.getLastUpdate
        }
    },
    performance: {
        RunningOrWalkingPerformance: {
            calculate: calculateRunningOrWalkingPerformance.default,
            getSource: calculateRunningOrWalkingPerformance.getSource,
            getLastUpdate: calculateRunningOrWalkingPerformance.getLastUpdate
        },
        LiftingPerformance: {
            calculate: calculateLiftingPerformance.default,
            getSource: calculateLiftingPerformance.getSource,
            getLastUpdate: calculateLiftingPerformance.getLastUpdate
        },
        PushingUpPerformance: {
            calculate: calculatePushingUpPerformance.default,
            getSource: calculatePushingUpPerformance.getSource,
            getLastUpdate: calculatePushingUpPerformance.getLastUpdate
        }
    },
};

export default OpenHealth;
