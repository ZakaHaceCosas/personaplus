/**
 * The name of each route / path, so you don't mess up.
 */
const ROUTES = {
    MAIN: {
        HOME: "/",
        PROFILE: "/profile",
        DASHBOARD: "/dashboard",
        WELCOME_SCREEN: "/welcome",
        SETTINGS: {
            UPDATE_PROFILE: "/update_profile",
            SETTINGS_PAGE: "/settings",
        },
    },
    DEV_INTERFACE: {
        HOME: "/dev_interface",
        LOG_VIEW: "/log_view",
        ERROR_LOG_VIEW: "/log_view_error",
        EXPERIMENTS: "/dev_experiments",
    },
    ACTIVE_OBJECTIVES: {
        CREATE: "/objectives/create",
        SESSION: "/objectives/sessions",
        RESULTS: "/objectives/results",
    },
    ABOUT: {
        LICENSE: "/about/license",
        ABOUT_PAGE: "/about/about",
        CREDITS: "/about/credits",
    },
    /**
     * Experimental features should live in separate pages, listed here.
     */
    EXPERIMENTS: {
        TRACKER: "/objectives/tracker",
        REPORT: "/report",
    },
};

export default ROUTES;
