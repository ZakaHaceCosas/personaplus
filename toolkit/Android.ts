import { Platform, ToastAndroid } from "react-native";

/**
 * Shows a ToastAndroid message, removing the need for `if (Platform.OS === "android")` boilerplate or always passing the `ToastAndroid.LONG` 2nd argument.
 *
 * @export
 * @param {string} text Just pass the text you want to show :)
 */
export function ShowToast(text: string): void {
    if (Platform.OS === "android") {
        ToastAndroid.show(text, ToastAndroid.LONG);
    }
}
