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
