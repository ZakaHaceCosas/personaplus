// THIS IS THE MAIN FILE, CONTAINS NOTHING BUT ALL THE IMPORT MODULES SO THAT THEY CAN BE ACCESSED VIA import OpenHealth from '<path>'.
// This file is expect to grow a lot in height...

// IMPORT MODULES

// PHISICAL HEALTH

import * as calculateBodyMassIndex from './phisicalHealth/bodymassindex';
import * as calculateBodyFatPercentage from './phisicalHealth/bodyfatpercentage';
import * as calculateIdealBodyWeight from './phisicalHealth/idealbodyweight';
import * as calculateBasalMetabolicRate from './phisicalHealth/basalMetabolicRate';
import * as getMetabolicEquivalentOfTask from './phisicalHealth/getMetabolicEquivalentOfTask';

// PERFORMANCE

import * as calculateRunningOrWalkingPerformance from './performance/runningPerformance';
import * as calculateLiftingPerformance from './performance/liftingPerformance'

// OPENHEALTH DATA
// import getSource from './docs';

// DEFINITION

/**
 * @type {OpenHealth}
 * @description Main library where everything comes from.
*/

const OpenHealth = {
    phisicalHealth: {
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
        }
    },
    openinfo: {
        // This will be done later. It is related to /docs.
    }
};

export default OpenHealth;
