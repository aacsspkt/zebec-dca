import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

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