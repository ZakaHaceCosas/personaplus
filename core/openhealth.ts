// IMPORT MODULES

// PHISICAL HEALTH

import calculateBodyMassIndex from './phisicalHealth/bodymassindex';
import calculateBodyFatPercentage from './phisicalHealth/bodyfatpercentage';
import calculateIdealBodyWeight from './phisicalHealth/idealbodyweight';

// PERFORMANCE

import { calculateRunningOrWalkingPerformance } from './performance/runningPerformance';

// OPENHEALTH DATA
import getSource from './docs';

const OpenHealth = {
    phisicalHealth: {
        calculateBodyMassIndex: calculateBodyMassIndex,
        calculateBodyFatPercentage: calculateBodyFatPercentage,
        calculateIdealBodyWeight: calculateIdealBodyWeight
    },
    performance: {
        calculateRunningOrWalkingPerformance: calculateRunningOrWalkingPerformance
    },
    openinfo: {
        getSource: getSource
    }
};

export default OpenHealth;
