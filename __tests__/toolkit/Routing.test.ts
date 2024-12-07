import SafelyGoBack from "@/toolkit/Routing";

describe("SafelyGoBack", () => {
    test("safely goes back without issues", () => {
        expect(SafelyGoBack()).toHaveReturned();
    });
});
