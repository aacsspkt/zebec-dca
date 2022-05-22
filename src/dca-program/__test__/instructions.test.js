import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Keypair, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, TransactionInstruction } from "@solana/web3.js"
import BN from "bn.js";
import { serialize } from "borsh";
import { DCA_PROGRAM_ID } from "../constants";
import { DcaInstruction } from "../instructions";
import { findAssociatedTokenAddress, findDcaDerivedAddress } from "../utils";




describe("deposit sol intruction test", () => {
    class DataClass {
        constructor(amount) {
            this.instruction = 2;
            this.amount = amount;
        }
    }

    test("instruction should match", async () => {
        const owner = Keypair.generate();
        const dcaData = Keypair.generate();
        const mint = Keypair.generate();
        const [vault,] = await findDcaDerivedAddress([owner.publicKey.toBuffer(), dcaData.publicKey.toBuffer()]);
        const [ownerAta,] = await findAssociatedTokenAddress(owner.publicKey, mint.publicKey);
        const [vaultAta,] = await findAssociatedTokenAddress(vault, mint.publicKey);
        const amount = new BN("500000000");



        const schema = new Map([
            [
                DataClass,
                {
                    kind: "struct",
                    fields: [
                        ["instruction", "u8"],
                        ["amount", "u64"]
                    ]
                }
            ]
        ]);

        const data = serialize(schema, new DataClass(amount));

        const instr = new TransactionInstruction({
            programId: new PublicKey(DCA_PROGRAM_ID),
            data: data,
            keys: [
                {
                    pubkey: owner.publicKey,
                    isSigner: true,
                    isWritable: true
                },
                {
                    pubkey: vault,
                    isSigner: false,
                    isWritable: true
                },
                {
                    pubkey: TOKEN_PROGRAM_ID,
                    isSigner: false,
                    isWritable: false
                },
                {
                    pubkey: mint.publicKey,
                    isSigner: false,
                    isWritable: true
                },
                {
                    pubkey: SystemProgram.programId,
                    isSigner: false,
                    isWritable: true
                },
                {
                    pubkey: SYSVAR_RENT_PUBKEY,
                    isSigner: false,
                    isWritable: false
                },
                {
                    pubkey: ownerAta,
                    isSigner: false,
                    isWritable: true
                },
                {
                    pubkey: vaultAta,
                    isSigner: false,
                    isWritable: true
                },
                {
                    pubkey: ASSOCIATED_TOKEN_PROGRAM_ID,
                    isSigner: false,
                    isWritable: false
                },
                {
                    pubkey: dcaData.publicKey,
                    isSigner: true,
                    isWritable: true
                },
            ]
        });

        const actual = DcaInstruction.depositSol(owner.publicKey, vault, mint.publicKey, ownerAta, vaultAta, dcaData.publicKey, amount);

        expect(actual).not.toBeNull();
        expect(actual).toEqual(instr);
    });
});