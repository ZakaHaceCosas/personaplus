export type SansFontWeights =
    | "Light"
    | "LightItalic"
    | "ExtraLight"
    | "ExtraLightItalic"
    | "Regular"
    | "Italic"
    | "Medium"
    | "MediumItalic"
    | "SemiBold"
    | "SemiBoldItalic"
    | "Bold"
    | "BoldItalic";

export type BrandFontWeights =
    | "Light"
    | "ExtraLight"
    | "Regular"
    | "Medium"
    | "SemiBold"
    | "Bold"
    | "LightItalic"
    | "ExtraLightItalic"
    | "Italic"
    | "MediumItalic"
    | "SemiBoldItalic"
    | "BoldItalic";

export type FontFamily = "BeVietnamPro" | "JetBrainsMono";

export type FontWeight<T extends FontFamily> = T extends "BeVietnamPro"
    ? SansFontWeights
    : T extends "JetBrainsMono"
      ? BrandFontWeights
      : never;
