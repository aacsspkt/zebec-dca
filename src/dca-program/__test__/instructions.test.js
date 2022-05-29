import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js"
import BN from "bn.js";
import { DCA_PROGRAM_ID } from "../constants";
import { DepositSolData } from "../instructionData";
import { DcaInstruction } from "../instructions";
import { findAssociatedTokenAddress, findDcaDerivedAddress } from "../utils";


describe("deposit sol intruction test", () => {

    const owner = new PublicKey("DS2tt4BX7YwCw7yrDNwbAdnYrxjeCPeGJbHmZEYC8RTb");
    const dcaData = new PublicKey("9cf445gfnu7ZnKQXMRrddkBN8xvozFk5n8dDVusr4xoK");
    const mint = new PublicKey("5swt9oXbzr57dmPMZniWFoETYotCpbT7bpYbYViFGuoN");


    test("instruction should match", async () => {

        const [vault,] = await findDcaDerivedAddress([owner.toBuffer(), dcaData.toBuffer()]);
        const [ownerAta,] = await findAssociatedTokenAddress(owner, mint);
        const [vaultAta,] = await findAssociatedTokenAddress(vault, mint);
        const amount = new BN("500000000");
        const data = new DepositSolData(amount).encode();
        const keys = [
            {
                pubkey: owner,
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
                pubkey: mint,
                isSigner: false,
                isWritable: true
            },
            {
                pubkey: SystemProgram.programId,
                isSigner: false,
                isWritable: false
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
                pubkey: dcaData,
                isSigner: true,
                isWritable: true
            },
        ];

        const actual = DcaInstruction.depositSol(owner, vault, mint, ownerAta, vaultAta, dcaData, amount);

        expect(actual.keys).toEqual(keys);
        expect(actual.data).toEqual(data);
        expect(actual.programId).toEqual(new PublicKey(DCA_PROGRAM_ID));
    });
});