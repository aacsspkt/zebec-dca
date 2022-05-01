import { Keypair, PublicKey, SystemProgram, TransactionInstruction } from "@solana/web3.js";
import { DCA_PROGRAM_ID, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, SYSVAR_RENT_PUBKEY } from "./constants"
import { DepositTokenData } from "./instructionData";
import { convertToLamports } from "./utils/helper";


/** derive wallet address owned by DCA Program */
export async function deriveZebecAddress(seed) {
    return PublicKey.findProgramAddress(seed, DCA_PROGRAM_ID)
}

export async function deriveAssociatedTokenAddress(walletAddress, tokenMintAddress) {
    return PublicKey.findProgramAddress([
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
            const senderAddress = new PublicKey(fromAddress);
            const dcaDataAddress = Keypair.generate();
            const tokenMintAddress = new PublicKey(mintAddress);
            const [vaultAddress, bump] = await deriveZebecAddress([senderAddress.toBuffer(), dcaDataAddress.publicKey.toBuffer()]);
            const [senderAta, bump1] = await deriveAssociatedTokenAddress(senderAddress, tokenMintAddress);
            const [vaultAta, bump2] = await deriveAssociatedTokenAddress(vaultAddress, tokenMintAddress);

            const data = new DepositTokenData({ amount: convertToLamports(amountInSol) }).encode();

            return new TransactionInstruction({
                keys: [
                    {
                        pubkey: senderAddress,
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
                        pubkey: tokenMintAddress,
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

    fundToken() { }

    fundSol() { }

    swapFromSol() { }

    swapToSol() { }
} 