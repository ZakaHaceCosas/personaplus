// THIS IS THE MAIN FILE, CONTAINS NOTHING BUT ALL THE IMPORT MODULES SO THAT THEY CAN BE ACCESSED VIA import OpenHealth from '<path>'.
// This file is expect to grow a lot in height...

// IMPORT MODULES

// PHISICAL HEALTH

import * as calculateBodyMassIndex from '@/core/physicalHealth/bodymassindex';
import * as calculateBodyFatPercentage from '@/core/physicalHealth/bodyfatpercentage';
import * as calculateIdealBodyWeight from '@/core/physicalHealth/idealbodyweight';
import * as calculateBasalMetabolicRate from '@/core/physicalHealth/basalMetabolicRate';
import * as getMetabolicEquivalentOfTask from '@/core/physicalHealth/getMetabolicEquivalentOfTask';
import * as oneRepetitionMax from '@/core/physicalHealth/oneRepMax';

// PERFORMANCE

import * as calculateRunningOrWalkingPerformance from '@/core/performance/runningPerformance';
import * as calculateLiftingPerformance from '@/core/performance/liftingPerformance';
import * as calculatePushingUpPerformance from "@/core/performance/pushingupPerformance";

// DEFINITION

/**
 * @type {OpenHealth}
 * @description Main library where everything comes from.
*/

const OpenHealth = {
    physicalHealth: {
        BodyMassIndex: {
            calculate: calculateBodyMassIndex.default,
            getSource: calculateBodyMassIndex.getSource,
            getLastUpdate: calculateBodyMassIndex.getLastUpdate
        },
        BodyFatPercentage: {
            calculate: calculateBodyFatPercentage.default,
            getSource: calculateBodyFatPercentage.getSource,
            getLastUpdate: calculateBodyFatPercentage.getLastUpdate
        },
        IdealBodyWeight: {
            calculate: calculateIdealBodyWeight.default,
            getSource: calculateIdealBodyWeight.getSource,
            getLastUpdate: calculateIdealBodyWeight.getLastUpdate
        },
        BasalMetabolicRate: {
            calculate: calculateBasalMetabolicRate.default,
            getSource: calculateBasalMetabolicRate.getSource,
            getLastUpdate: calculateBasalMetabolicRate.getLastUpdate
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
    openinfo: {
        // This will be done later. It is related to /docs.
    }
};

export default OpenHealth;
