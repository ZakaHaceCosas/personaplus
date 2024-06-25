// IMPORT MODULES

// PHISICAL HEALTH

import { calculateBodyMassIndex } from './phisicalHealth/bodymassindex';
import calculateBodyFatPercentage from './phisicalHealth/bodyfatpercentage';
import calculateIdealBodyWeight from './phisicalHealth/idealbodyweight';

const OpenHealth = {
    phisicalHealth: {
        calculateBodyMassIndex: calculateBodyMassIndex,
        calculateBodyFatPercentage: calculateBodyFatPercentage,
        calculateIdealBodyWeight: calculateIdealBodyWeight
    }
};

export default OpenHealth;
