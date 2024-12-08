import { SafelyGoBack } from "@/toolkit/routing";

describe("SafelyGoBack", () => {
    test("safely goes back without issues", () => {
        expect(SafelyGoBack()).toHaveReturned();
    });
});
