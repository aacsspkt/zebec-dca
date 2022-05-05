import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { BigNumber } from "bignumber.js";


/** 
 * Convert solana token amounts to lamports
 * @param {Number} amount
 * @returns amount of lamports in "string" type
 */
export function convertToLamports(amount) {
    if (typeof amount !== "number") {
        throw new TypeError("not a valid number");
    }
    if (amount <= 0) {
        throw new RangeError("amount must be greater than 0");
    }
    const amt = new BigNumber(amount);
    const lamports = amt.multipliedBy(new BigNumber(LAMPORTS_PER_SOL));
    if (lamports.isGreaterThan(new BigNumber("18446744073709551615"))) {
        throw new RangeError("lamports of given amount doesn't fit in unsigned 64-bit integer.");
    }
    return lamports.toString();
}