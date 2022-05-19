import { PublicKey, Connection, clusterApiUrl } from "@solana/web3.js";

export {
    TOKEN_PROGRAM_ID,
    NATIVE_MINT,
    ASSOCIATED_TOKEN_PROGRAM_ID
} from "@solana/spl-token";

export {
    SYSVAR_RENT_PUBKEY
} from "@solana/web3.js"

/** The id of DCA Program. */
export const DCA_PROGRAM_ID = new PublicKey("89U3HCacYnqJYUX33EupQRyKLBAqA9vb6tzAATRp19c7");

/** Json RPC client to communicate with Solana blockchain */
export const connection = new Connection(clusterApiUrl("devnet"));

export { LIQUIDITY_PROGRAM_ID_V4 } from "@raydium-io/raydium-sdk"
export const DEVNET_RAYDIUM_PROGRAM_ID_V4 = new PublicKey("9rpQHSyFVM1dkkHFQ2TtTzPEW7DVmEyPmN8wVniqJtuC");

export { SERUM_PROGRAM_ID_V3 } from "@raydium-io/raydium-sdk"
export const DEVNET_SERUM_PROGRAM_ID_V3 = new PublicKey("9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin");
