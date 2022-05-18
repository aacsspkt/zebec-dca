import { PublicKey, Connection, clusterApiUrl } from "@solana/web3.js";

export {
    /** The id of Token Program. */
    TOKEN_PROGRAM_ID,

    /** The public key of wrapped SOL */
    NATIVE_MINT,

    /** The id of Associated Token Program. */
    ASSOCIATED_TOKEN_PROGRAM_ID
} from "@solana/spl-token";

export {
    /** The id of System Variable Rent */
    SYSVAR_RENT_PUBKEY
} from "@solana/web3.js"

/** The id of DCA Program. */
export const DCA_PROGRAM_ID = new PublicKey("89U3HCacYnqJYUX33EupQRyKLBAqA9vb6tzAATRp19c7");

/** Json RPC client to communicate with Solana blockchain */
export const connection = new Connection(clusterApiUrl("devnet"));


export {
    /** The id of raydium program liquidity pool id */
    LIQUIDITY_PROGRAM_ID_V4
} from "@raydium-io/raydium-sdk"
/** Devnet raydium program liquidity pool id */
export const DEVNET_RAYDIUM_PROGRAM_ID_V4 = new PublicKey("9rpQHSyFVM1dkkHFQ2TtTzPEW7DVmEyPmN8wVniqJtuC");

export {
    /** Mainnet serum program id */
    SERUM_PROGRAM_ID_V3
} from "@raydium-io/raydium-sdk"
/** Devnet serum program id */
export const DEVNET_SERUM_PROGRAM_ID_V3 = new PublicKey("9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin");
