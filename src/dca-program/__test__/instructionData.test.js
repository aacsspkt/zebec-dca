import BN from "bn.js";
import { DepositSolData } from "../instructionData";



describe("deposit sol data test", () => {

    test('should match', () => {

        const amount = new BN("500000000");
        const expected = {
            instruction: 2,
            amount: amount
        };

        const depositSolData = new DepositSolData(amount);

        expect(depositSolData).toEqual(expected);
    });

    test("should match", () => {
        const actual = Buffer.from([2, 0, 101, 205, 29, 0, 0, 0, 0]);

        const reality = new DepositSolData(new BN("500000000")).encode();

        expect(reality).toEqual(actual);
    });
});