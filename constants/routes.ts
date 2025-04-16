/**
 * The name of each route / path, so you don't mess up.
 */
export const Routes = {
    MAIN: {
        HOME: "/",
        PROFILE: "/profile",
        DASHBOARD: "/dashboard",
        TOOLKIT: "/toolkit",
        REPORT: "/report",
        WELCOME_SCREEN: "/welcome",
        SETTINGS: {
            UPDATE_PROFILE: "/update_profile",
            SETTINGS_PAGE: "/settings",
        },
    },
    DEV_INTERFACE: {
        HOME: "/developer/dev_interface",
        VIEWER_USER_DATA: "/developer/viewer_user_data",
        VIEWER_OBJECTIVES: "/developer/viewer_objectives",
        VIEWER_NOTIFICATIONS: "/developer/viewer_notifications",
        VIEWER_DAILY_LOG: "/developer/viewer_daily_log",
        EXPERIMENTS: "/developer/dev_experiments",
    },
    OBJECTIVES: {
        CREATE_ACTIVE: "/objectives/create",
        CREATE_PASSIVE: "/objectives/create_passive",
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
    },
};
