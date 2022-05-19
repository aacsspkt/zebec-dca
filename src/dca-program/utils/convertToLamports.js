import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import BN from "bn.js";


/** 
 * Convert solana token amounts to lamports
 * @param {Number} amount
 * @returns Amount in lamports
 */
export function convertToLamports(amount) {
    if (typeof amount !== "number") {
        throw new TypeError("not a valid number");
    }
    if (amount <= 0) {
        throw new RangeError("amount must be greater than 0");
    }
    const lmpPerSol = new BigNumber(LAMPORTS_PER_SOL);
    const tempAmount = lmpPerSol.multipliedBy(new BigNumber(amount));
    const _amount = new BN(tempAmount.toFixed())
    if (_amount.gt(new BN("18446744073709551615"))) {
        throw new RangeError("lamports of given amount doesn't fit in unsigned 64-bit integer.");
    }
    return _amount;
}