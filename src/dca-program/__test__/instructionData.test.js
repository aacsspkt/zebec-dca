
import BN from "bn.js";
import {
    DepositSolData,
    DepositTokenData,
    FundSolData,
    FundTokenData,
    InitializeData,
    SwapFromSolData,
    SwapToSolData,
    WithdrawSolData,
    WithdrawTokenData
} from "../instructionData";

describe("instruction data test", () => {

    test("deposit token data buffer should match", () => {
        const amount = new BN("500000000");
        const expected = Buffer.from([0, 0, 101, 205, 29, 0, 0, 0, 0]);
        const actual = new DepositTokenData(amount).encode();
        expect(actual).toEqual(expected);
    });


    test("intialize data buffer should match", () => {
        const expected = Buffer.from([2, 20, 86, 134, 234, 128, 1, 0, 0, 0, 101, 205, 29, 0, 0, 0, 0, 0, 202, 154, 59, 0, 0, 0, 0, 0, 101, 205, 29, 0, 0, 0, 0]);
        const startTime = new BN("1653202114068");
        const dcaAmount = new BN("500000000");
        const dcaTime = new BN("1000000000");
        const minimumAmountOut = new BN("500000000");
        const actual = new InitializeData(startTime, dcaAmount, dcaTime, minimumAmountOut).encode();
        expect(actual).toEqual(expected);
    });


    test("deposit sol data buffer should match", () => {
        const amount = new BN("500000000");
        const expected = Buffer.from([1, 0, 101, 205, 29, 0, 0, 0, 0]);
        const actual = new DepositSolData(amount).encode();
        expect(actual).toEqual(expected);
    });


    test("swap to sol data buffer should match", () => {
        const expected = Buffer.from([3]);
        const actual = new SwapToSolData().encode();
        expect(actual).toEqual(expected);
    });


    test("swap from sol data buffer should match", () => {
        const expected = Buffer.from([4]);
        const actual = new SwapFromSolData().encode();
        expect(actual).toEqual(expected);
    });


    test("withdraw token data buffer should match", () => {
        const amount = new BN("500000000");
        const expected = Buffer.from([5, 0, 101, 205, 29, 0, 0, 0, 0]);
        const actual = new WithdrawTokenData(amount).encode();
        expect(actual).toEqual(expected);
    });


    test("withdraw sol data buffer should match", () => {
        const amount = new BN("500000000");
        const expected = Buffer.from([6, 0, 101, 205, 29, 0, 0, 0, 0]);
        const actual = new WithdrawSolData(amount).encode();
        expect(actual).toEqual(expected);
    });


    test("fund token data buffer should match", () => {
        const expected = Buffer.from([7, 0, 101, 205, 29, 0, 0, 0, 0]);
        const amount = new BN("500000000");
        const actual = new FundTokenData(amount).encode();
        expect(actual).toEqual(expected);
    });


    test("fund sol data buffer should match", () => {
        const expected = Buffer.from([8, 0, 101, 205, 29, 0, 0, 0, 0]);
        const amount = new BN("500000000");
        const actual = new FundSolData(amount).encode();
        expect(actual).toEqual(expected);
    });
});
