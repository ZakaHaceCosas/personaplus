import SafelyGoBack from "@/toolkit/routing_re";

describe("SafelyGoBack", () => {
    test("safely goes back without issues", () => {
        expect(SafelyGoBack()).toHaveReturned();
    });
});
