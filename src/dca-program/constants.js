import { PublicKey, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import {
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
} from "@solana/spl-token";

/** The public key DCA Program. */
const DCA_PROGRAM_ID = new PublicKey("89U3HCacYnqJYUX33EupQRyKLBAqA9vb6tzAATRp19c7");

/** The  public key of Token Program. */
const TOKEN_PROGRAM_ID = TOKEN_PROGRAM_ID;

/** The  public key Associated Token Program. */
const ASSOCIATED_TOKEN_PROGRAM_ID = ASSOCIATED_TOKEN_PROGRAM_ID;

/** The public key of System Variable Rent */
const RENT_PUBKEY = SYSVAR_RENT_PUBKEY;

