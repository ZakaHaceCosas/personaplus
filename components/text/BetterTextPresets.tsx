import { ReactNode, ReactElement } from "react";
import BetterText from "@/components/text/BetterText";
import FontSizes from "@/constants/FontSizes";
import Colors from "@/constants/Colors";

/**
 * A pre-made **header**, based on `<BetterText>` and with default styles for design consistency.
 *
 * @export
 * @param {{ children: ReactNode }} props - The props object.
 * @param {ReactNode} props.children - The text you want to display. You can also pass other `<BetterText>` components to act as "spans" with separate styles, similar to `<span>` in HTML5.
 * @returns {ReactElement} The rendered header component.
 */
export function BetterTextHeader({
    children,
}: {
    children: ReactNode;
}): ReactElement {
    return (
        <BetterText
            textAlign="normal"
            fontWeight="Bold"
            fontSize={FontSizes.EXTRA_LARGE}
        >
            {children}
        </BetterText>
    );
}

/**
 * A pre-made **subheader**, based on `<BetterText>` and with default styles for design consistency.
 *
 * @export
 * @param {{ children: ReactNode }} props - The props object.
 * @param {ReactNode} props.children - The text you want to display. You can also pass other `<BetterText>` components to act as "spans" with separate styles, similar to `<span>` in HTML5.
 * @returns {ReactElement} The rendered subheader component.
 */
export function BetterTextSubHeader({
    children,
}: {
    children: ReactNode;
}): ReactElement {
    return (
        <BetterText
            textAlign="normal"
            fontWeight="Medium"
            fontSize={FontSizes.LARGE}
        >
            {children}
        </BetterText>
    );
}

/**
 * A pre-made **extra** (larger than `SubHeader` but smaller than `Header`), based on `<BetterText>` and with default styles for design consistency.
 *
 * @export
 * @param {{ children: ReactNode }} props - The props object.
 * @param {ReactNode} props.children - The text you want to display. You can also pass other `<BetterText>` components to act as "spans" with separate styles, similar to `<span>` in HTML5.
 * @returns {ReactElement} The rendered `ExtraHeader` component.
 */
export function BetterTextExtraHeader({
    children,
}: {
    children: ReactNode;
}): ReactElement {
    return (
        <BetterText
            textAlign="normal"
            fontWeight="Medium"
            fontSize={FontSizes.LARGER}
        >
            {children}
        </BetterText>
    );
}

/**
 * A pre-made **small header**, based on `<BetterText>` and with default styles for design consistency.
 *
 * @export
 * @param {{ children: ReactNode }} props - The props object.
 * @param {ReactNode} props.children - The text you want to display. You can also pass other `<BetterText>` components to act as "spans" with separate styles, similar to `<span>` in HTML5.
 * @returns {ReactElement} The rendered `ExtraHeader` component.
 */
export function BetterTextSmallHeader({
    children,
}: {
    children: ReactNode;
}): ReactElement {
    return (
        <BetterText
            textAlign="normal"
            fontWeight="Medium"
            fontSize={FontSizes.LARGE}
        >
            {children}
        </BetterText>
    );
}

/**
 * A pre-made **smaller text** (or **smaller header**), based on `<BetterText>` and with default styles for design consistency.
 *
 * @export
 * @param {{ children: ReactNode }} props - The props object.
 * @param {ReactNode} props.children - The text you want to display. You can also pass other `<BetterText>` components to act as "spans" with separate styles, similar to `<span>` in HTML5.
 * @returns {ReactElement} The rendered subheader component.
 */
export function BetterTextSmallerText({
    children,
}: {
    children: ReactNode;
}): ReactElement {
    return (
        <BetterText
            textAlign="normal"
            fontWeight="Regular"
            fontSize={FontSizes.SMALL}
            textColor={Colors.LBLS.SDD}
        >
            {children}
        </BetterText>
    );
}

/**
 * A pre-made **small text** (or **small header**), based on `<BetterText>` and with default styles for design consistency.
 *
 * @export
 * @param {{ children: ReactNode }} props - The props object.
 * @param {ReactNode} props.children - The text you want to display. You can also pass other `<BetterText>` components to act as "spans" with separate styles, similar to `<span>` in HTML5.
 * @returns {ReactElement} The rendered subheader component.
 */
export function BetterTextSmallText({
    children,
}: {
    children: ReactNode;
}): ReactElement {
    return (
        <BetterText
            textAlign="normal"
            fontWeight="Regular"
            fontSize={FontSizes.REGULAR}
            textColor={Colors.LBLS.SDD}
        >
            {children}
        </BetterText>
    );
}

/**
 * A pre-made **text** (for the **license page ONLY**), based on `<BetterText>` and with default styles for design consistency.
 *
 * @export
 * @param {{ children: ReactNode }} props - The props object.
 * @param {ReactNode} props.children - The text you want to display. You can also pass other `<BetterText>` components to act as "spans" with separate styles, similar to `<span>` in HTML5.
 * @returns {ReactElement} The rendered subheader component.
 */
export function BetterTextLicenseText({
    children,
}: {
    children: ReactNode;
}): ReactElement {
    return (
        <BetterText
            fontFamily="RobotoSerif"
            textAlign="normal"
            fontWeight="Regular"
            fontSize={FontSizes.MEDIUM}
        >
            {children}
        </BetterText>
    );
}

/**
 * A pre-made **header** (for the **license page ONLY**), based on `<BetterText>` and with default styles for design consistency.
 *
 * @export
 * @param {{ children: ReactNode }} props - The props object.
 * @param {ReactNode} props.children - The text you want to display. You can also pass other `<BetterText>` components to act as "spans" with separate styles, similar to `<span>` in HTML5.
 * @returns {ReactElement} The rendered subheader component.
 */
export function BetterTextLicenseHeader({
    children,
}: {
    children: ReactNode;
}): ReactElement {
    return (
        <BetterText
            fontFamily="RobotoSerif"
            textAlign="normal"
            fontWeight="Regular"
            fontSize={FontSizes.REGULAR}
        >
            {children}
        </BetterText>
    );
}