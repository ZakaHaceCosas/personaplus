/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2024 ZakaHaceCosas and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this for more details.
 * <=============================================================================>
 *
 * You are in: @/constants/Urls.ts
 * Basically: An export of all URLs relative to the project.
 *
 * <=============================================================================>
 */

/**
 * All URLs to the web that are related to the project.
 */
const URLs = {
    website: "https://personaplus.vercel.app/",
    privacy:
        "https://github.com/ZakaHaceCosas/personaplus/blob/main/PRIVACY.md",
    license: "https://www.gnu.org/licenses/gpl-3.0.html#license-text",
    discord: "https://discord.gg/wwzddK4Zpc",
    repo: "https://github.com/ZakaHaceCosas/personaplus",
    releasesApi:
        "https://api.github.com/repos/ZakaHaceCosas/personaplus/releases",
    latestChangelog:
        "https://github.com/ZakaHaceCosas/personaplus/releases/latest",
    instagram: "https://www.instagram.com/giveitaplus/",
} as const;

/** TS type for functions that only take app URLs. */
export type URLValues = (typeof URLs)[keyof typeof URLs];

export default URLs;
