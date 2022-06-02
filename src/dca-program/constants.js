import { PublicKey, Connection, clusterApiUrl, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import {
    TOKEN_PROGRAM_ID,
    NATIVE_MINT,
    ASSOCIATED_TOKEN_PROGRAM_ID
} from "@solana/spl-token";
import { LIQUIDITY_PROGRAM_ID_V4 } from "@raydium-io/raydium-sdk"
import { SERUM_PROGRAM_ID_V3 } from "@raydium-io/raydium-sdk"

/** System variable rent public key */
export const SysvarRent = SYSVAR_RENT_PUBKEY;

/** Native mint address */
export const NativeMint = NATIVE_MINT;

/** The token program id. */
export const TokenProgramId = TOKEN_PROGRAM_ID;

/** The associated token program id.  */
export const AssociatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID;

/** The dca program id. */
export const DcaProgramId = new PublicKey("89U3HCacYnqJYUX33EupQRyKLBAqA9vb6tzAATRp19c7");

/** Json RPC client to communicate with Solana blockchain. */
export const connection = new Connection(clusterApiUrl("devnet"));

/** The raydium liquidity pool program v4 id. */
export const LiquidityProgramIdV4 = LIQUIDITY_PROGRAM_ID_V4;

/** The devnet raydium liquidity pool program v4 id. */
export const DevnetLiquidityProgramIdV4 = new PublicKey("9rpQHSyFVM1dkkHFQ2TtTzPEW7DVmEyPmN8wVniqJtuC");

/** The serum market program id. */
export const SerumProgramIdV3 = SERUM_PROGRAM_ID_V3;

/** The devnet serum market program id. */
export const DevnetSerumProgramIdV3 = new PublicKey("DESVgJVGajEgKGXhb6XmqDHGz3VjdgP7rEVESBgxmroY");
