import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "../constants";
import { PublicKey } from "@solana/web3.js";

/** 
 * Find the address of the associated token account for a given mint and owner with bump
 * @param {PublicKey} owner Owner of the new account
 * @param {PublicKey} mint  Token mint account
 */
export async function findAssociatedTokenAddress(owner, mint) {
    return await PublicKey.findProgramAddress([
        owner.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        mint.toBuffer()
    ],
        ASSOCIATED_TOKEN_PROGRAM_ID
    );
}