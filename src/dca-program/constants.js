import { PublicKey, Connection, clusterApiUrl } from "@solana/web3.js";

export {
    /** The  id of Token Program. */
    TOKEN_PROGRAM_ID,

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

/** The id of raydium program liquidity pool amm */
export const RAYDIUM_PROGRAM_ID = new PublicKey("9rpQHSyFVM1dkkHFQ2TtTzPEW7DVmEyPmN8wVniqJtuC"); // liquidity pool amm


export const SERUM_PROGRAM_ID = new PublicKey("");
