import { PublicKey } from "@solana/web3.js";
import { AccountMetaBuilder } from "../../utils";

describe("Account metas test", () => {

    const testKey = new PublicKey("5swt9oXbzr57dmPMZniWFoETYotCpbT7bpYbYViFGuoN");

    test("creating signer writable account meta", () => {
        const expected = {
            pubkey: testKey,
            isSigner: true,
            isWritable: true
        };
        const actual = AccountMetaBuilder.writable(testKey, true);
        expect(actual).toEqual(expected);
    });

    test("creating non signer writable account meta", () => {
        const expected = {
            pubkey: testKey,
            isSigner: false,
            isWritable: true
        };
        const actual = AccountMetaBuilder.writable(testKey, false);
        expect(actual).toEqual(expected);
    });

    test("creating signer readonly account meta", () => {
        const expected = {
            pubkey: testKey,
            isSigner: true,
            isWritable: false
        };
        const actual = AccountMetaBuilder.readonly(testKey, true);
        expect(actual).toEqual(expected);
    });

    test("creating non signer readonly account meta", () => {
        const expected = {
            pubkey: testKey,
            isSigner: false,
            isWritable: false
        };
        const actual = AccountMetaBuilder.readonly(testKey, false);
        expect(actual).toEqual(expected);
    });
});
