import assert from "assert";
import BN from "bn.js";
import { convertToLamports } from "../../utils";

describe("convert to lamport test", () => {

    test("should pass", () => {
        const amount = 0.5;
        const reality = convertToLamports(amount);
        const actual = new BN("500000000")
        expect(reality).toEqual(actual);
    })


    // test("should failed", done => {
    //     const amount = 100000000000000;
    //     try {
    //         const lamport = convertToLamports(amount);
    //         done();
    //     } catch (e) {
    //         done(e);
    //     }
    // })
});