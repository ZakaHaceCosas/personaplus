export type SansFontWeights =
    | "Light"
    | "LightItalic"
    | "ExtraLight"
    | "ExtraLightItalic"
    | "Thin"
    | "ThinItalic"
    | "Regular"
    | "Italic"
    | "Medium"
    | "MediumItalic"
    | "SemiBold"
    | "SemiBoldItalic"
    | "Bold"
    | "BoldItalic"
    | "ExtraBold"
    | "ExtraBoldItalic"
    | "Black"
    | "BlackItalic";

export type SerifFontWeights =
    | "Light"
    | "ExtraLight"
    | "Regular"
    | "Medium"
    | "SemiBold"
    | "Bold"
    | "ExtraBold"
    | "Black"
    | "Thin"
    | "ExtraCondensedLight"
    | "ExtraCondensedExtraLight"
    | "ExtraCondensedRegular"
    | "ExtraCondensedMedium"
    | "ExtraCondensedMediumItalic"
    | "ExtraCondensedBold"
    | "ExtraCondensedBoldItalic"
    | "ExtraCondensedSemiBold"
    | "ExtraCondensedSemiBoldItalic"
    | "ExtraCondensedThin"
    | "ExtraCondensedThinItalic"
    | "ExtraExpandedLight"
    | "ExtraExpandedRegular"
    | "ExtraExpandedMedium"
    | "ExtraExpandedSemiBold"
    | "ExtraExpandedBold"
    | "ExtraExpandedLightItalic"
    | "ExtraExpandedItalic"
    | "ExtraExpandedExtraBold"
    | "ExtraExpandedBlack"
    | "ExtraExpandedExtraBoldItalic"
    | "ExtraExpandedBlackItalic"
    | "ExtraExpandedThin"
    | "ExtraExpandedThinItalic"
    | "SemiCondensedLight"
    | "SemiCondensedRegular"
    | "SemiCondensedMedium"
    | "SemiCondensedMediumItalic"
    | "SemiCondensedBold"
    | "SemiCondensedBoldItalic"
    | "SemiCondensedExtraLight"
    | "SemiCondensedExtraLightItalic"
    | "SemiCondensedExtraBold"
    | "SemiCondensedExtraBoldItalic"
    | "SemiCondensedThin"
    | "SemiCondensedThinItalic"
    | "ExpandedLight"
    | "ExpandedRegular"
    | "ExpandedMedium"
    | "ExpandedSemiBold"
    | "ExpandedBold"
    | "ExpandedLightItalic"
    | "ExpandedItalic"
    | "ExpandedExtraBold"
    | "ExpandedBlack"
    | "ExpandedExtraBoldItalic"
    | "ExpandedThin"
    | "ExpandedThinItalic"
    | "UltraCondensedLight"
    | "UltraCondensedExtraLight"
    | "UltraCondensedRegular"
    | "UltraCondensedMedium"
    | "UltraCondensedMediumItalic"
    | "UltraCondensedBold"
    | "UltraCondensedBoldItalic"
    | "UltraCondensedExtraBold"
    | "UltraCondensedExtraBoldItalic"
    | "UltraCondensedBlack"
    | "UltraCondensedBlackItalic"
    | "UltraCondensedThin"
    | "UltraCondensedThinItalic"
    | "UltraCondensedItalic"
    | "UltraCondensedExtraLightItalic"
    | "UltraCondensedSemiBold"
    | "UltraCondensedSemiBoldItalic";

export type BrandFontWeights =
    | "Light"
    | "ExtraLight"
    | "Regular"
    | "Medium"
    | "SemiBold"
    | "Bold"
    | "ExtraBold"
    | "Thin"
    | "ThinItalic"
    | "LightItalic"
    | "ExtraLightItalic"
    | "Italic"
    | "MediumItalic"
    | "SemiBoldItalic"
    | "BoldItalic"
    | "ExtraBoldItalic";

export type FontFamily = "BeVietnamPro" | "RobotoSerif" | "JetBrainsMono";

export type FontWeight<T extends FontFamily> = T extends "BeVietnamPro"
    ? SansFontWeights
    : T extends "RobotoSerif"
    ? SerifFontWeights
    : T extends "JetBrainsMono"
    ? BrandFontWeights
    : never;

// TODO: use this in BetterText so you dont have to duplicate the font names
// TODO: move this to constants
/* const JetBrainsMono = {
    Light: "JetBrainsMono-Light",
    ExtraLight: "JetBrainsMono-ExtraLight",
    Regular: "JetBrainsMono-Regular",
    Medium: "JetBrainsMono-Medium",
    SemiBold: "JetBrainsMono-SemiBold",
    Bold: "JetBrainsMono-Bold",
    ExtraBold: "JetBrainsMono-ExtraBold",

    LightItalic: "JetBrainsMono-LightItalic",
    ExtraLightItalic: "JetBrainsMono-ExtraLightItalic",
    Italic: "JetBrainsMono-Italic",
    MediumItalic: "JetBrainsMono-MediumItalic",
    SemiBoldItalic: "JetBrainsMono-SemiBoldItalic",
    BoldItalic: "JetBrainsMono-BoldItalic",
    ExtraBoldItalic: "JetBrainsMono-ExtraBoldItalic",
    Thin: "JetBrainsMono-Thin",
    ThinItalic: "JetBrainsMono-ThinItalic",
};
const RobotoSerif = {
    Light: "RobotoSerif-Light",
    ExtraLight: "RobotoSerif-ExtraLight",
    Regular: "RobotoSerif-Regular",
    Medium: "RobotoSerif-Medium",
    SemiBold: "RobotoSerif-SemiBold",
    Bold: "RobotoSerif-Bold",
    ExtraBold: "RobotoSerif-ExtraBold",
    Black: "RobotoSerif-Black",

    LightItalic: "RobotoSerif-LightItalic",
    ExtraLightItalic: "RobotoSerif-ExtraLightItalic",
    Italic: "RobotoSerif-Italic",
    MediumItalic: "RobotoSerif-MediumItalic",
    SemiBoldItalic: "RobotoSerif-SemiBoldItalic",
    BoldItalic: "RobotoSerif-BoldItalic",
    ExtraBoldItalic: "RobotoSerif-ExtraBoldItalic",
    BlackItalic: "RobotoSerif-BlackItalic",

    ExtraCondensedLight: "RobotoSerif_ExtraCondensed-Light",
    ExtraCondensedExtraLight: "RobotoSerif_ExtraCondensed-ExtraLight",
    ExtraCondensedRegular: "RobotoSerif_ExtraCondensed-Regular",
    ExtraCondensedMedium: "RobotoSerif_ExtraCondensed-Medium",
    ExtraCondensedMediumItalic: "RobotoSerif_ExtraCondensed-MediumItalic",
    ExtraCondensedBold: "RobotoSerif_ExtraCondensed-Bold",
    ExtraCondensedBoldItalic: "RobotoSerif_ExtraCondensed-BoldItalic",
    ExtraCondensedSemiBold: "RobotoSerif_ExtraCondensed-SemiBold",
    ExtraCondensedSemiBoldItalic: "RobotoSerif_ExtraCondensed-SemiBoldItalic",
    ExtraCondensedThin: "RobotoSerif_ExtraCondensed-Thin",
    ExtraCondensedThinItalic: "RobotoSerif_ExtraCondensed-ThinItalic",

    ExtraExpandedLight: "RobotoSerif_ExtraExpanded-Light",
    ExtraExpandedRegular: "RobotoSerif_ExtraExpanded-Regular",
    ExtraExpandedMedium: "RobotoSerif_ExtraExpanded-Medium",
    ExtraExpandedSemiBold: "RobotoSerif_ExtraExpanded-SemiBold",
    ExtraExpandedBold: "RobotoSerif_ExtraExpanded-Bold",
    ExtraExpandedLightItalic: "RobotoSerif_ExtraExpanded-LightItalic",
    ExtraExpandedItalic: "RobotoSerif_ExtraExpanded-Italic",
    ExtraExpandedExtraBold: "RobotoSerif_ExtraExpanded-ExtraBold",
    ExtraExpandedBlack: "RobotoSerif_ExtraExpanded-Black",
    ExtraExpandedExtraBoldItalic: "RobotoSerif_ExtraExpanded-ExtraBoldItalic",
    ExtraExpandedBlackItalic: "RobotoSerif_ExtraExpanded-BlackItalic",
    ExtraExpandedThin: "RobotoSerif_ExtraExpanded-Thin",
    ExtraExpandedThinItalic: "RobotoSerif_ExtraExpanded-ThinItalic",

    SemiCondensedLight: "RobotoSerif_SemiCondensed-Light",
    SemiCondensedRegular: "RobotoSerif_SemiCondensed-Regular",
    SemiCondensedMedium: "RobotoSerif_SemiCondensed-Medium",
    SemiCondensedMediumItalic: "RobotoSerif_SemiCondensed-MediumItalic",
    SemiCondensedBold: "RobotoSerif_SemiCondensed-Bold",
    SemiCondensedBoldItalic: "RobotoSerif_SemiCondensed-BoldItalic",
    SemiCondensedExtraLight: "RobotoSerif_SemiCondensed-ExtraLight",
    SemiCondensedExtraLightItalic: "RobotoSerif_SemiCondensed-ExtraLightItalic",
    SemiCondensedExtraBold: "RobotoSerif_SemiCondensed-ExtraBold",
    SemiCondensedExtraBoldItalic: "RobotoSerif_SemiCondensed-ExtraBoldItalic",
    SemiCondensedThin: "RobotoSerif_SemiCondensed-Thin",
    SemiCondensedThinItalic: "RobotoSerif_SemiCondensed-ThinItalic",

    ExpandedLight: "RobotoSerif_Expanded-Light",
    ExpandedRegular: "RobotoSerif_Expanded-Regular",
    ExpandedMedium: "RobotoSerif_Expanded-Medium",
    ExpandedSemiBold: "RobotoSerif_Expanded-SemiBold",
    ExpandedBold: "RobotoSerif_Expanded-Bold",
    ExpandedLightItalic: "RobotoSerif_Expanded-LightItalic",
    ExpandedItalic: "RobotoSerif_Expanded-Italic",
    ExpandedExtraBold: "RobotoSerif_Expanded-ExtraBold",
    ExpandedBlack: "RobotoSerif_Expanded-Black",
    ExpandedExtraBoldItalic: "RobotoSerif_Expanded-ExtraBoldItalic",
    ExpandedThin: "RobotoSerif_Expanded-Thin",
    ExpandedThinItalic: "RobotoSerif_Expanded-ThinItalic",

    UltraCondensedLight: "RobotoSerif_UltraCondensed-Light",
    UltraCondensedExtraLight: "RobotoSerif_UltraCondensed-ExtraLight",
    UltraCondensedRegular: "RobotoSerif_UltraCondensed-Regular",
    UltraCondensedMedium: "RobotoSerif_UltraCondensed-Medium",
    UltraCondensedMediumItalic: "RobotoSerif_UltraCondensed-MediumItalic",
    UltraCondensedBold: "RobotoSerif_UltraCondensed-Bold",
    UltraCondensedBoldItalic: "RobotoSerif_UltraCondensed-BoldItalic",
    UltraCondensedExtraBold: "RobotoSerif_UltraCondensed-ExtraBold",
    UltraCondensedExtraBoldItalic: "RobotoSerif_UltraCondensed-ExtraBoldItalic",
    UltraCondensedBlack: "RobotoSerif_UltraCondensed-Black",
    UltraCondensedBlackItalic: "RobotoSerif_UltraCondensed-BlackItalic",
    UltraCondensedThin: "RobotoSerif_UltraCondensed-Thin",
    UltraCondensedThinItalic: "RobotoSerif_UltraCondensed-ThinItalic",
    UltraCondensedItalic: "RobotoSerif_UltraCondensed-Italic",
    UltraCondensedExtraLightItalic: "RobotoSerif_UltraCondensed-ExtraLightItalic",
    UltraCondensedSemiBold: "RobotoSerif_UltraCondensed-SemiBold",
    UltraCondensedSemiBoldItalic: "RobotoSerif_UltraCondensed-SemiBoldItalic",
};

const BeVietnam = {
    Thin: "BeVietnam-Thin",
    ExtraLight: "BeVietnam-ExtraLight",
    Light: "BeVietnam-Light",
    Regular: "BeVietnam-Regular",
    Medium: "BeVietnam-Medium",
    SemiBold: "BeVietnam-SemiBold",
    Bold: "BeVietnam-Bold",
    ExtraBold: "BeVietnam-ExtraBold",
    Black: "BeVietnam-Black",

    ThinItalic: "BeVietnam-ThinItalic",
    ExtraLightItalic: "BeVietnam-ExtraLightItalic",
    LightItalic: "BeVietnam-LightItalic",
    Italic: "BeVietnam-Italic",
    MediumItalic: "BeVietnam-MediumItalic",
    SemiBoldItalic: "BeVietnam-SemiBoldItalic",
    BoldItalic: "BeVietnam-BoldItalic",
    ExtraBoldItalic: "BeVietnam-ExtraBoldItalic",
    BlackItalic: "BeVietnam-BlackItalic",
}; */
