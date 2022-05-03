import { PublicKey, Connection, clusterApiUrl } from "@solana/web3.js";

export {
    /** The  public key of Token Program. */
    TOKEN_PROGRAM_ID,

    /** The  public key of Associated Token Program. */
    ASSOCIATED_TOKEN_PROGRAM_ID
} from "@solana/spl-token";

export {
    /** The public key of System Variable Rent */
    SYSVAR_RENT_PUBKEY
} from "@solana/web3.js"

/** The public key DCA Program. */
export const DCA_PROGRAM_ID = new PublicKey("89U3HCacYnqJYUX33EupQRyKLBAqA9vb6tzAATRp19c7");

/** Json RPC client to communicate with Solana blockchain */
export const connection = new Connection(clusterApiUrl("devnet"));

