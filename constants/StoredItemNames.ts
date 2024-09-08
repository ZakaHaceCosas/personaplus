/**
 * The name of each AsyncStorage entry, so you don't mess up.
 *
 * @type {{ userData: string; objectives: string; dailyLog: string; consoleLogs: string; lang: string; }}
 */
const StoredItemNames = {
    userData: "userData",
    objectives: "objectives",
    dailyLog: "activeObjectiveDailyLog",
    consoleLogs: "globalLogs",
    lang: "language"
}

export default StoredItemNames
