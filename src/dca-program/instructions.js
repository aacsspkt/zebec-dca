import { Keypair, PublicKey, SystemProgram, TransactionInstruction } from "@solana/web3.js";
import { DCA_PROGRAM_ID, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, SYSVAR_RENT_PUBKEY } from "./constants"
import { DepositTokenData } from "./instructionData";
import { convertToLamports } from "./utils/helper";


/** Derive wallet address owned by DCA Program */
export async function deriveDcaAddress(seed) {
    return await PublicKey.findProgramAddress(seed, DCA_PROGRAM_ID)
}

/** Derive associated token address */
export async function deriveAssociatedTokenAddress(walletAddress, tokenMintAddress) {
    return await PublicKey.findProgramAddress([
        walletAddress.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        tokenMintAddress.toBuffer()
    ],
        ASSOCIATED_TOKEN_PROGRAM_ID
    );
}

export class DcaProgram {

    static async depositToken({ fromAddress, mintAddress, amountInSol }) {
        try {
            if (!fromAddress instanceof PublicKey && !mintAddress instanceof PublicKey) {
                throw new TypeError("Not a public key.")
            }
            const dcaDataAddress = Keypair.generate();
            const [vaultAddress,] = await deriveZebecAddress([fromAddress.toBuffer(), dcaDataAddress.publicKey.toBuffer()]);
            const [senderAta,] = await deriveAssociatedTokenAddress(fromAddress, mintAddress);
            const [vaultAta,] = await deriveAssociatedTokenAddress(vaultAddress, mintAddress);

            const data = new DepositTokenData({ amount: convertToLamports(amountInSol) }).encode();

            return new TransactionInstruction({
                keys: [
                    {
                        pubkey: fromAddress,
                        isSigner: true,
                        isWritable: true
                    },
                    {
                        pubkey: vaultAddress,
                        isSigner: false,
                        isWritable: true
                    },
                    {
                        pubkey: TOKEN_PROGRAM_ID,
                        isSigner: false,
                        isWritable: false
                    },
                    {
                        pubkey: mintAddress,
                        isSigner: false,
                        isWritable: false
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
                        pubkey: senderAta,
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
                        pubkey: dcaDataAddress,
                        isSigner: true,
                        isWritable: true
                    },
                ],
                programId: DCA_PROGRAM_ID,
                data: data
            });
        } catch (e) {
            throw e;
        }
    }

    static async depositSol() { }

    static async initialize() { }

    static async withdrawToken() { }

    static async withdrawSol() { }

    static async fundToken() { }

    static async fundSol() { }

    static async swapFromSol() { }

    static async swapToSol() { }
} 