import { ReactElement, ReactNode } from "react";
import BetterText from "@/components/text/better_text";
import FontSizes from "@/constants/font_sizes";
import Colors from "@/constants/colors";

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
 * @returns {ReactElement} The rendered smaller text component.
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
            textColor={Colors.LABELS.SDD}
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
 * @returns {ReactElement} The rendered small text component.
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
            fontSize={FontSizes.ALMOST_REGULAR}
            textColor={Colors.LABELS.SDD}
        >
            {children}
        </BetterText>
    );
}

/**
 * A pre-made **normal text**, based on `<BetterText>` and with default styles for design consistency.
 *
 * @export
 * @param {{ children: ReactNode }} props - The props object.
 * @param {ReactNode} props.children - The text you want to display. You can also pass other `<BetterText>` components to act as "spans" with separate styles, similar to `<span>` in HTML5.
 * @returns {ReactElement} The rendered normal text component.
 */
export function BetterTextNormalText({
    children,
}: {
    children: ReactNode;
}): ReactElement {
    return (
        <BetterText
            fontFamily="BeVietnamPro"
            textAlign="normal"
            fontWeight="Regular"
            fontSize={FontSizes.REGULAR}
        >
            {children}
        </BetterText>
    );
}
