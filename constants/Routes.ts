/**
 * The name of each route / path, so you don't mess up.
 */
const ROUTES = {
    MAIN: {
        HOME: "/",
        PROFILE: "/Profile",
        DASHBOARD: "/Dashboard",
        WELCOME_SCREEN: "/Welcome",
        REPORT: "/Report",
        SETTINGS: {
            UPDATE_PROFILE: "/UpdateProfile",
        },
    },
    DEV_INTERFACE: {
        HOME: "/DevInterface",
        LOG_VIEW: "/LogView",
        ERROR_LOG_VIEW: "/ErrorLogger",
        EXPERIMENTS: "/DevExperiments",
    },
    ACTIVE_OBJECTIVES: {
        CREATE: "/objectives/Create",
        SESSION: "/objectives/Sessions",
        RESULTS: "/objectives/Results",
    },
    /**
     * Experimental features should live in separate pages, listed here.
     */
    EXPERIMENTS: {
        TRACKER: "/objectives/exp_tracker",
    },
};

export default ROUTES;
