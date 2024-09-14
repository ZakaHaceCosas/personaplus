/**
 * The name of each AsyncStorage entry, so you don't mess up.
 *
 * @type {{ userData: string; objectives: string; dailyLog: string; consoleLogs: string; }}
 */
const StoredItemNames = {
    userData: "userData",
    objectives: "objectives",
    dailyLog: "activeObjectiveDailyLog",
    consoleLogs: "globalLogs",
    colorTheme: "colorTheme"
}

export default StoredItemNames
