import { Keypair } from "@solana/web3.js";
import { AccountMetaBuilder } from "../../utils";

describe("Account metas test", () => {

    test("creating signer writable account meta", () => {
        const keypair = Keypair.generate();
        const expected = {
            pubkey: keypair.publicKey,
            isSigner: true,
            isWritable: true
        };
        const actual = AccountMetaBuilder.writable(keypair.publicKey, true);
        expect(actual).toEqual(expected);
    });

    test("creating non signer writable account meta", () => {
        const keypair = Keypair.generate();
        const expected = {
            pubkey: keypair.publicKey,
            isSigner: false,
            isWritable: true
        };
        const actual = AccountMetaBuilder.writable(keypair.publicKey, false);
        expect(actual).toEqual(expected);
    });

    test("creating signer readonly account meta", () => {
        const keypair = Keypair.generate();
        const expected = {
            pubkey: keypair.publicKey,
            isSigner: true,
            isWritable: true
        };
        const actual = AccountMetaBuilder.readonly(keypair.publicKey, true);
        expect(actual).toEqual(expected);
    });

    test("creating non signer readonly account meta", () => {
        const keypair = Keypair.generate();
        const expected = {
            pubkey: keypair.publicKey,
            isSigner: false,
            isWritable: false
        };
        const actual = AccountMetaBuilder.readonly(keypair.publicKey, false);
        expect(actual).toEqual(expected);
    });
});
