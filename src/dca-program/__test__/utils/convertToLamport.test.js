import assert from "assert";
import BN from "bn.js";
import { convertToLamports } from "../../utils";

describe("convert to lamport test", () => {

    test("should pass", () => {
        const amount = 0.5;
        const expectation = new BN("500000000");
        const reality = convertToLamports(amount);
        expect(reality).toEqual(expectation);
    });

    test("should pass", () => {
        const amount = 1;
        const expectation = new BN("1000000");
        const reality = convertToLamports(amount, 6);
        expect(reality).toEqual(expectation);
    })
});