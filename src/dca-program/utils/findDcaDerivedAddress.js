import { PublicKey } from "@solana/web3.js";
import { DcaProgramId } from "../constants";

/** 
 * Find dca program derived address
 * @param {Array<Buffer>} seeds Array of buffer seed
 */
export async function findDcaDerivedAddress(seeds) {
    return await PublicKey.findProgramAddress(seeds, DcaProgramId)
}