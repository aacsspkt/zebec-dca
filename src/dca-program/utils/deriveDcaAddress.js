import { PublicKey } from "@solana/web3.js";
import { DCA_PROGRAM_ID } from "../constants";

/** 
 * Derive wallet address owned by DCA Program 
 */
export async function deriveDcaAddress(seed) {
    return await PublicKey.findProgramAddress(seed, DCA_PROGRAM_ID)
}