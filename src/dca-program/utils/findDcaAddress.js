import { PublicKey } from "@solana/web3.js";
import { DCA_PROGRAM_ID } from "../constants";

/** 
 * Find dca program derived address
 * @param {Array<Buffer>} seeds Array of buffer seed
 */
export async function findDcaDerivedAddress(seeds) {
    return await PublicKey.findProgramAddress(seeds, DCA_PROGRAM_ID)
}