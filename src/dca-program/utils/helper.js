import { LAMPORTS_PER_SOL } from "@solana/web3.js";


export const convertToLamports = (amount) => {
    if (typeof amount !== "number") {
        throw new TypeError("not a valid number");
    }
    if (amount <= 0) {
        throw new RangeError("amount must be greater than 0");
    }
    amount = BigInt(amount);
    const lamports = amount * BigInt(LAMPORTS_PER_SOL);
    if (lamports > ((2n ** 64n) - 1n)) {
        throw new RangeError("lamports of given amount doesn\'t fit in unsigned 64-bit integer.");
    }
    return lamports
}