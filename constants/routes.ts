/**
 * The name of each route / path, so you don't mess up.
 */
export const Routes = {
    MAIN: {
        HOME: "/",
        PROFILE: "/profile",
        DASHBOARD: "/dashboard",
        WELCOME_SCREEN: "/welcome",
        REPORT: "/report",
        SETTINGS: {
            UPDATE_PROFILE: "/update_profile",
            SETTINGS_PAGE: "/settings",
        },
    },
    DEV_INTERFACE: {
        HOME: "/developer/dev_interface",
        VIEWER_LOGS: "/developer/log_view",
        VIEWER_ERROR_LOGS: "/developer/log_view_error",
        VIEWER_USER_DATA: "/developer/viewer_user_data",
        VIEWER_ACTIVE_OBJECTIVES: "/developer/viewer_active_objectives",
        VIEWER_NOTIFICATIONS: "/developer/viewer_notifications",
        EXPERIMENTS: "/developer/dev_experiments",
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
    },
};
