import { SafelyGoBack } from "@/toolkit/routing";

jest.mock("@/toolkit/routing", () => ({
    SafelyGoBack: jest.fn(),
}));

describe("SafelyGoBack", () => {
    test("safely goes back without issues", () => {
        SafelyGoBack();

        expect(SafelyGoBack).toHaveBeenCalled();
    });
});
