import { Alert, ToastAndroid } from 'react-native';
import { termLog } from '@/src/toolkit/debug/console';
import checkForUpdates from '@/src/toolkit/updater';
import { TFunction } from 'i18next';

// mocks
jest.mock('react-native', () => ({
    Alert: {
        alert: jest.fn(),
    },
    Platform: {
        OS: 'android',
    },
    ToastAndroid: {
        show: jest.fn(),
    },
    Linking: {
        openURL: jest.fn(),
    },
}));

jest.mock('@/src/toolkit/debug/console', () => ({
    termLog: jest.fn(),
}));

const mockFetch = jest.fn();
global.fetch = mockFetch as typeof fetch;

// mock translates, somehow
const mockT = jest.fn((key: string) => key) as unknown as TFunction;

describe('checkForUpdates', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // checks if the prompt appears for new updates
    it('should show an update alert if a new version is available', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [
                {
                    tag_name: "0.0.1-R5-b2410", // we'll never go beyond that bVersion, so this works
                    prerelease: false,
                    assets: [{ browser_download_url: 'http://personaplus.com/personaplus.apk', name: 'update.apk' }],
                    html_url: 'http://personaplus.com/changelog',
                },
            ],
        });

        await checkForUpdates(mockT);

        expect(Alert.alert).toHaveBeenCalledWith(
            'page_profile.updates.update_flow.update_available',
            'page_profile.updates.update_flow.update_available_text',
            expect.any(Array)
        );
    });

    // if you're on the latest, just expect a toast to tell you
    it('should show a toast message if no new version is available', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [
                {
                    tag_name: "0.0.1-R5-b19", // 1st github release btw :D
                    prerelease: false,
                    assets: [{ browser_download_url: 'http://personaplus.com/personaplus.apk', name: 'update.apk' }],
                    html_url: 'http://personaplus.com/changelog',
                },
            ],
        });

        await checkForUpdates(mockT);

        expect(ToastAndroid.show).toHaveBeenCalledWith(
            "page_profile.updates.update_flow.youre_up_to_date",
            ToastAndroid.SHORT
        );
    });

    // handle failure
    it('should handle fetch errors correctly', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
        });

        await checkForUpdates(mockT);

        expect(termLog).toHaveBeenCalledWith(
            'Failed to fetch releases (status 500)',
            'error'
        );
        expect(ToastAndroid.show).toHaveBeenCalledWith(
            'page_profile.updates.update_flow.failed_to_check',
            ToastAndroid.SHORT
        );
    });
});
