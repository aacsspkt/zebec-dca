import { PublicKey, SystemProgram, TransactionInstruction } from "@solana/web3.js";
import { DCA_PROGRAM_ID, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, SYSVAR_RENT_PUBKEY } from "./constants"
import { DepositSolData, DepositTokenData, FundSolData, FundTokenData, InitializeData, WithdrawSolData, WithdrawTokenData } from "./instructionData";
import { convertToLamports } from "../utils/convertToLamports";


/** 
 * Derive wallet address owned by DCA Program 
 */
export async function deriveDcaAddress(seed) {
    return await PublicKey.findProgramAddress(seed, DCA_PROGRAM_ID)
}

/** 
 * Derive associated token address
 */
export async function deriveAssociatedTokenAddress(walletAddress, tokenMintAddress) {
    return await PublicKey.findProgramAddress([
        walletAddress.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        tokenMintAddress.toBuffer()
    ],
        ASSOCIATED_TOKEN_PROGRAM_ID
    );
}


/** 
 * The class to interact with DCA program
 */
export class DcaProgram {

    /** 
     * Create Transaction Instruction that deposit non native token to DCA vault
     * @return 
     * Transaction Instruction
     */
    static async depositToken({ fromAddress, mintAddress, dcaDataAddress, amount }) {
        try {
            if (!(fromAddress instanceof PublicKey) &&
                !(mintAddress instanceof PublicKey) &&
                !(dcaDataAddress instanceof PublicKey)) {
                throw new TypeError("Not a public key.")
            }
            const [vaultAddress,] = await deriveDcaAddress([fromAddress.toBuffer(), dcaDataAddress.toBuffer()]);
            const [senderAta,] = await deriveAssociatedTokenAddress(fromAddress, mintAddress);
            const [vaultAta,] = await deriveAssociatedTokenAddress(vaultAddress, mintAddress);

            const data = new DepositTokenData({ amount: convertToLamports(amount) }).encode();

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


    /**
     * Create Transaction Instruction that deposit native token to DCA vault
     * @returns
     * TransactionInstruction 
     */
    static async depositSol({ fromAddress, mintAddress, dcaDataAddress, amount }) {
        try {
            if (!(fromAddress instanceof PublicKey) &&
                !(mintAddress instanceof PublicKey) &&
                !(dcaDataAddress instanceof PublicKey)) {
                throw new TypeError("Not a public key.")
            }

            const [vaultAddress,] = await deriveDcaAddress([fromAddress.toBuffer(), dcaDataAddress.toBuffer()]);
            const [senderAta,] = await deriveAssociatedTokenAddress(fromAddress, mintAddress);
            const [vaultAta,] = await deriveAssociatedTokenAddress(vaultAddress, mintAddress);

            const data = new DepositSolData({ amount: convertToLamports(amount) }).encode();

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

    /**
     * Create Transaction Instruction that initialize DCA
     * @returns TransactionInstruction
     */
    static async initialize({ fromAddress, dcaDataAddress, startTime, dcaAmount, dcaTime, minimumAmountOut }) {
        try {
            if (!(fromAddress instanceof PublicKey) &&
                !(dcaDataAddress instanceof PublicKey)) {
                throw new TypeError("Not a public key.")
            }

            if (typeof startTime != "number" &&
                typeof dcaTime != "number"
            ) {
                throw new TypeError("Not a number.")
            }
            const [vaultAddress,] = await deriveDcaAddress([fromAddress.toBuffer(), dcaDataAddress.toBuffer()]);

            const data = new InitializeData({
                startTime: startTime,
                dcaAmount: convertToLamports(dcaAmount),
                dcaTime: dcaTime,
                minimumAmountOut: convertToLamports(minimumAmountOut)
            }).encode();

            return new TransactionInstruction({
                keys: [
                    {
                        pubkey: fromAddress,
                        isSigner: true,
                        isWritable: true,
                    },
                    {
                        pubkey: vaultAddress,
                        isSigner: false,
                        isWritable: true
                    },
                    {
                        pubkey: dcaDataAddress,
                        isSigner: true,
                        isWritable: true
                    }
                ],
                programId: DCA_PROGRAM_ID,
                data: data
            })
        } catch (e) {

        }
    }

    /**
     * Create Transaction Instruction that withdraws token from DCA vault
     * @returns TransactionInstruction
     */
    static async withdrawToken({ fromAddress, mintAddress, dcaDataAddress, transferAmount }) {
        try {
            if (!(fromAddress instanceof PublicKey) &&
                !(mintAddress instanceof PublicKey) &&
                !(dcaDataAddress instanceof PublicKey)) {
                throw new TypeError("Not a public key.")
            }

            const [vaultAddress,] = await deriveDcaAddress([fromAddress.toBuffer(), dcaDataAddress.toBuffer()]);
            const [senderAta,] = await deriveAssociatedTokenAddress(fromAddress, mintAddress);
            const [vaultAta,] = await deriveAssociatedTokenAddress(vaultAddress, mintAddress);

            const data = new WithdrawTokenData({ transferAmount: convertToLamports(transferAmount) }).encode();

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
                    }
                ],
                programId: DCA_PROGRAM_ID,
                data: data
            })
        } catch (e) {
            throw e;
        }
    }

    /**
     * Create Transaction Instruction that withdraws token from DCA vault
     * @returns TransactionInstruction
     */
    static async withdrawSol({ fromAddress, mintAddress, dcaDataAddress, transferAmount }) {
        try {
            if (!(fromAddress instanceof PublicKey) &&
                !(mintAddress instanceof PublicKey) &&
                !(dcaDataAddress instanceof PublicKey)) {
                throw new TypeError("Not a public key.")
            }

            const [vaultAddress,] = await deriveDcaAddress([fromAddress.toBuffer(), dcaDataAddress.toBuffer()]);
            const [senderAta,] = await deriveAssociatedTokenAddress(fromAddress, mintAddress);
            const [vaultAta,] = await deriveAssociatedTokenAddress(vaultAddress, mintAddress);

            const data = new WithdrawSolData({ transferAmount: convertToLamports(transferAmount) }).encode();

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
                    }
                ],
                programId: DCA_PROGRAM_ID,
                data: data
            })
        } catch (e) {
            throw e;
        }
    }


    /**
     * Create Transaction Instruction that // todo
     * @returns TransactionInstruction
     */
    static async fundToken({ fromAddress, mintAddress, dcaDataAddress, transferAmount }) {
        try {
            if (!(fromAddress instanceof PublicKey) &&
                !(mintAddress instanceof PublicKey) &&
                !(dcaDataAddress instanceof PublicKey)) {
                throw new TypeError("Not a public key.")
            }

            const [vaultAddress,] = await deriveDcaAddress([fromAddress.toBuffer(), dcaDataAddress.toBuffer()]);
            const [senderAta,] = await deriveAssociatedTokenAddress(fromAddress, mintAddress);
            const [vaultAta,] = await deriveAssociatedTokenAddress(vaultAddress, mintAddress);

            const data = new FundTokenData({ transferAmount: convertToLamports(transferAmount) }).encode();

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
                    }
                ],
                programId: DCA_PROGRAM_ID,
                data: data
            })
        } catch (e) {
            throw e;
        }
    }

    /**
     * Create Transaction Instruction that // todo
     * @returns TransactionInstruction
     */
    static async fundSol({ fromAddress, mintAddress, dcaDataAddress, transferAmount }) {
        try {
            if (!(fromAddress instanceof PublicKey) &&
                !(mintAddress instanceof PublicKey) &&
                !(dcaDataAddress instanceof PublicKey)) {
                throw new TypeError("Not a public key.")
            }

            const [vaultAddress,] = await deriveDcaAddress([fromAddress.toBuffer(), dcaDataAddress.toBuffer()]);
            const [senderAta,] = await deriveAssociatedTokenAddress(fromAddress, mintAddress);
            const [vaultAta,] = await deriveAssociatedTokenAddress(vaultAddress, mintAddress);

            const data = new FundSolData({ transferAmount: convertToLamports(transferAmount) }).encode();

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
                    }
                ],
                programId: DCA_PROGRAM_ID,
                data: data
            })
        } catch (e) {
            throw e;
        }
    }

    /**
     * Create Transaction Instruction that // todo
     * @returns TransactionInstruction
     */
    static async swapFromSol() {
        throw new Error("Not Implemented");
    }


    /**
     * Create Transaction Instruction that // todo
     * @returns TransactionInstruction
     */
    static async swapToSol() {
        throw new Error("Not Implemented");
    }
} 