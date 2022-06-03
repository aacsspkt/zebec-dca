import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmRawTransaction, Transaction } from "@solana/web3.js";
import BN from "bn.js";
import { NativeMint } from "./constants";
import { DcaInstruction } from "./instructions";
import { findAssociatedTokenAddress, convertToLamports, findDcaDerivedAddress, fetchPoolKeys, fetchAllPoolKeys, fetchPoolKeysDevnet, getMintInfo } from "./utils";
import { Liquidity, Percent, Token, TokenAmount } from "@raydium-io/raydium-sdk";
import { DcaAccount } from "./state";
import BigNumber from "bignumber.js";

export const getProvider = async () => {
    const isPhantomInstalled = (await window.solana) && window.solana.isPhantom;
    if (isPhantomInstalled) {
        window.solana.connect();
    } else {
        window.open("https://phantom.app/", "_blank");
    }
};


/**
 * Deposit non-native token in dca program vault
 * @param {Connection} connection The Connection of solana json rpc network
 * @param {string} owner The address of the owner who deposit the token
 * @param {string} mint The address token mint
 * @param {number} amount The amount to deposit
 */
export async function depositToken(connection, owner, mint, amount) {
    try {
        if (!connection && !owner && !mint && !amount) {
            throw new ReferenceError("Missing arguments.");
        }
        if (!(connection instanceof Connection) &&
            typeof owner != "string" && // assumed to be base58
            typeof mint != "string" &&
            typeof amount != "number"
        ) {
            throw new TypeError("Invalid argument types.");
        }

        let dcaDataAccount = Keypair.generate();
        const ownerAddress = new PublicKey(owner);
        const mintAddress = new PublicKey(mint);
        const [vaultAddress,] = await findDcaDerivedAddress([ownerAddress.toBuffer(), dcaDataAccount.publicKey.toBuffer()]);
        const [ownerTokenAddress,] = await findAssociatedTokenAddress(ownerAddress, mintAddress);
        const [vaultTokenAddress,] = await findAssociatedTokenAddress(vaultAddress, mintAddress);
        const [vaultNativeMintAddress,] = await findAssociatedTokenAddress(vaultAddress, NativeMint);

        const mintInfo = await getMintInfo(connection, mintAddress);
        const _amount = convertToLamports(amount, mintInfo.decimals);

        let txn = new Transaction()
            .add(DcaInstruction.depositToken(
                ownerAddress,
                vaultAddress,
                mintAddress,
                NativeMint,
                ownerTokenAddress,
                vaultTokenAddress,
                vaultNativeMintAddress,
                dcaDataAccount.publicKey,
                _amount
            ));

        txn.feePayer = ownerAddress;
        txn.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        txn.partialSign(dcaDataAccount);

        const signedTxn = await window.solana.signTransaction(txn);
        const signature = await sendAndConfirmRawTransaction(
            connection,
            signedTxn.serialize()
        );

        return {
            status: "success",
            data: {
                signature: signature,
                dcaDataAddress: dcaDataAccount.publicKey.toBase58()
            }
        }
    } catch (e) {
        throw e;
    }
}

/**
 * Intialize dca process
 * @param {Connection} connection The connection The Connection of solana json rpc network
 * @param {string} owner The address of the owner who initialize dca
 * @param {string} dcaData The address of the account which store dca state
 * @param {string} mint The address of the token mint
 * @param {number} startTime The unix timestamp from which dca process starts
 * @param {number} dcaAmount The amount to be utilize for dca
 * @param {number} dcaTime The timespan of dca
 * @param {number} minimumAmountOut // todo
 */
export async function initialize(connection, owner, dcaData, startTime, dcaAmount, dcaTime) {
    try {
        if (!connection && !owner && !dcaData && !startTime && !dcaAmount && dcaTime) {
            throw new ReferenceError("Missing arguments.");
        }

        if (!(connection instanceof Connection) &&
            typeof owner != "string" &&
            typeof dcaData != "string" &&
            typeof startTime != "number" &&
            typeof dcaAmount != "number" &&
            typeof dcaTime != "number"
        ) {
            throw new TypeError("Invalid argument types.");
        }


        const ownerAddress = new PublicKey(owner);
        const dcaDataAddress = new PublicKey(dcaData);
        const [vaultAddress,] = await findDcaDerivedAddress([ownerAddress.toBuffer(), dcaDataAddress.toBuffer()])
        const _startTime = new BN(startTime);
        const _dcaTime = new BN(dcaTime);

        const POOL_ID = "384zMi9MbUKVUfkUdrnuMfWBwJR9gadSxYimuXeJ9DaJ"; // use fetchAllPools later in mainnet
        const poolKeys = await fetchPoolKeysDevnet(
            connection,
            new PublicKey(POOL_ID)
        );
        const poolInfo = await Liquidity.fetchInfo({ connection, poolKeys });
        const amountIn = new TokenAmount(new Token(poolKeys.baseMint, poolInfo.baseDecimals), dcaAmount, false)
        const currencyOut = new Token(poolKeys.quoteMint, poolInfo.quoteDecimals);

        const slippage = new Percent(5, 100);
        const { amountOut, minAmountOut, currentPrice, executionPrice, priceImpact, fee }
            = Liquidity.computeAmountOut({ poolKeys, poolInfo, amountIn, currencyOut, slippage, })

        const _dcaAmount = new BN(amountIn.raw);
        const minimumAmountOut = new BN(minAmountOut.raw);

        let txn = new Transaction()
            .add(DcaInstruction.initialize(
                ownerAddress,
                vaultAddress,
                dcaDataAddress,
                _startTime,
                _dcaAmount,
                _dcaTime,
                minimumAmountOut
            ));

        txn.feePayer = ownerAddress;
        txn.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        const signedTxn = await window.solana.signTransaction(txn);

        const signature = await sendAndConfirmRawTransaction(
            connection,
            signedTxn.serialize()
        );

        return {
            status: "success",
            data: {
                signature: signature,
            }
        }
    } catch (e) {
        throw e;
    }
}

/**
 * Deposit sol in dca vault
 * @param {Connection} connection The Connection of solana json rpc network
 * @param {string} owner The address of the owner who initialize dca
 * @param {string} mint The address of native mint
 * @param {number} amount The amount to deposit
 */
export async function depositSol(connection, owner, mint, amount) {
    try {
        if (!connection && !owner && !mint && !amount) {
            throw new ReferenceError("Missing arguments.");
        }

        if (!(connection instanceof Connection) &&
            !(owner instanceof PublicKey)
        ) {
            throw new TypeError("Not a Rpc enpoint.");
        }

        let dcaDataAccount = Keypair.generate();
        const ownerAddress = new PublicKey(owner);
        const mintAddress = new PublicKey(mint);
        const [vaultAddress,] = await findDcaDerivedAddress([ownerAddress.toBuffer(), dcaDataAccount.publicKey.toBuffer()]);
        const [ownerTokenAddress,] = await findAssociatedTokenAddress(ownerAddress, mintAddress);
        const [vaultTokenAddress,] = await findAssociatedTokenAddress(vaultAddress, mintAddress);
        const [vaultNativeMintAddress,] = await findAssociatedTokenAddress(vaultAddress, NativeMint);

        const _amount = convertToLamports(amount);

        let txn = new Transaction()
            .add(DcaInstruction.depositSol(
                ownerAddress,
                vaultAddress,
                mintAddress,
                NativeMint,
                ownerTokenAddress,
                vaultNativeMintAddress,
                vaultTokenAddress,
                dcaDataAccount.publicKey,
                _amount
            ));
        txn.feePayer = ownerAddress;
        txn.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        txn.partialSign(dcaDataAccount);
        const signedTxn = await window.solana.signTransaction(txn);

        const signature = await sendAndConfirmRawTransaction(
            connection,
            signedTxn.serialize()
        );

        return {
            status: "success",
            data: {
                signature: signature,
                dcaDataAddress: dcaDataAccount.publicKey.toBase58()
            }
        }
    } catch (e) {
        throw e;
    }
}

/**
 * Withdraw non-native token from vault
 * @param {Connection} connection The connection The Connection of solana json rpc network
 * @param {string} owner The address of the owner who initialize dca
 * @param {string} dcaData The address of account which store dca state
 * @param {string} mint The address of token mint
 * @param {number} transferAmount The amount to withdraw
 */
export async function withdrawToken(connection, owner, mint, dcaData, amount) {
    try {
        if (!connection && !owner && !mint && !dcaData && !amount) {
            throw new ReferenceError("Missing arguments.");
        }

        if (!(connection instanceof Connection) &&
            typeof owner != "string" &&
            typeof dcaData != "string" &&
            typeof mint != "string" &&
            typeof amount != "number"
        ) {
            throw new TypeError("Invalid argument types.");
        }

        const ownerAddress = new PublicKey(owner);
        const mintAddress = new PublicKey(mint);
        const dcaDataAddress = new PublicKey(dcaData);
        const [vaultAddress,] = await findDcaDerivedAddress([ownerAddress.toBuffer(), dcaDataAddress.toBuffer()]);
        const [ownerTokenAddress,] = await findAssociatedTokenAddress(ownerAddress, mintAddress);
        const [vaultTokenAddress,] = await findAssociatedTokenAddress(vaultAddress, mintAddress);
        const mintInfo = await getMintInfo(connection, mintAddress);
        console.log(mintInfo.decimals);
        const transferAmount = convertToLamports(amount, mintInfo.decimals);

        let txn = new Transaction()
            .add(DcaInstruction.withdrawToken(
                ownerAddress,
                vaultAddress,
                mintAddress,
                ownerTokenAddress,
                vaultTokenAddress,
                dcaDataAddress,
                transferAmount
            ));
        txn.feePayer = ownerAddress;
        txn.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        const signedTxn = await window.solana.signTransaction(txn);


        const signature = await sendAndConfirmRawTransaction(
            connection,
            signedTxn.serialize(),
        );

        return {
            status: "success",
            data: {
                signature: signature,
            }
        }
    } catch (e) {
        throw e;
    }
}

/**
 * Withdraw native token from vault
 * @param {Connection} connection The connection The Connection of solana json rpc network
 * @param {string} owner The address of the owner who initialize dca
 * @param {string} dcaData The address of the account which store dca state
 * @param {string} mint The address of token mint
 * @param {number} transferAmount The amount to withdraw
 */
export async function withdrawSol(connection, owner, mint, dcaData, amount) {
    try {
        if (!connection && !owner && !mint && !dcaData && !amount) {
            throw new ReferenceError("Missing arguments.");
        }

        if (!(connection instanceof Connection) &&
            typeof owner != "string" &&
            typeof mint != "string" &&
            typeof dcaData != "string" &&
            typeof amount != "number"
        ) {
            throw new TypeError("Invalid argument types.");
        }

        const ownerAddress = new PublicKey(owner);
        const mintAddress = new PublicKey(mint);
        const dcaDataAddress = new PublicKey(dcaData);
        const [vaultAddress,] = await findDcaDerivedAddress([ownerAddress.toBuffer(), dcaDataAddress.toBuffer()]);
        const [ownerTokenAddress,] = await findAssociatedTokenAddress(ownerAddress, mintAddress);
        const [ownerNativeMintAddress,] = await findAssociatedTokenAddress(ownerAddress, NativeMint);
        const [vaultTokenAddress,] = await findAssociatedTokenAddress(vaultAddress, mintAddress);
        const [vaultNativeMintAddress,] = await findAssociatedTokenAddress(vaultAddress, NativeMint);
        const transferAmount = convertToLamports(amount);

        let txn = new Transaction()
            .add(DcaInstruction.withdrawSol(
                ownerAddress,
                vaultAddress,
                mintAddress,
                ownerTokenAddress,
                vaultTokenAddress,
                dcaDataAddress,
                NativeMint,
                vaultNativeMintAddress,
                ownerNativeMintAddress,
                transferAmount
            ));
        txn.feePayer = ownerAddress;
        txn.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        const signedTxn = await window.solana.signTransaction(txn);

        const signature = await sendAndConfirmRawTransaction(
            connection,
            signedTxn.serialize(),
        );
        return {
            status: "success",
            data: {
                signature: signature,
            }
        }
    } catch (e) {

    }
}

/**
 * Swap token from sol
 * @param {Connection} connection The connection The Connection of solana json rpc network
 * @param {string} owner The address of the owner who initialize dca
 * @param {string} mint The address of token mint
 * @param {string} dcaData The address of the account which store dca state
 * @param {string} poolId The address of the amm liquidity pool account
 */
export async function swapFromSol(connection, owner, mint, dcaData) {
    try {
        if (!connection && !owner && !mint && !dcaData) {
            throw new ReferenceError("Missing arguments.");
        }

        if (!(connection instanceof Connection) &&
            typeof owner != "string" &&
            typeof mint != "string" &&
            typeof dcaData != "string"
        ) {
            throw new TypeError("Invalid argument type.");
        }

        const ownerAddress = new PublicKey(owner);
        const mintAddress = new PublicKey(mint);
        const dcaDataAddress = new PublicKey(dcaData);
        const [vaultAddress,] = await findDcaDerivedAddress([ownerAddress.toBuffer(), dcaDataAddress.toBuffer()]);
        const [vaultNativeMintAddress,] = await findAssociatedTokenAddress(vaultAddress, NativeMint)
        const [vaultTokenAddress,] = await findAssociatedTokenAddress(vaultAddress, mintAddress)

        // const poolKeysList = await fetchAllPoolKeys();
        // if (poolKeysList.length === 0) throw new Error("Error in retreiving liquidity pool keys");

        // const keys = poolKeysList.find(el => el.quoteMint.includes(mint) &&
        //     el.baseMint.includes(NativeMint.toBase58()));
        // if (!keys) throw new Error("No liquidity pool found.")

        // SOL_USDT
        const POOL_ID = "384zMi9MbUKVUfkUdrnuMfWBwJR9gadSxYimuXeJ9DaJ";

        const poolKeys = await fetchPoolKeysDevnet(
            connection,
            new PublicKey(POOL_ID)
        );

        const poolInfo = await Liquidity.fetchInfo({ connection, poolKeys });
        const dcaInfo = await DcaAccount.getDcaAccountInfo(connection, dcaDataAddress);
        const amountIn = new TokenAmount(
            new Token(
                poolKeys.baseMint,
                poolInfo.baseDecimals
            ),
            new BN(dcaInfo.dcaAmount).toString(),
            false
        )
        const currencyOut = new Token(poolKeys.quoteMint, poolInfo.quoteDecimals);
        const slippage = new Percent(5, 100);
        const { amountOut, minAmountOut, currentPrice, executionPrice, priceImpact, fee }
            = Liquidity.computeAmountOut({ poolKeys, poolInfo, amountIn, currencyOut, slippage, })
        let txn = new Transaction()
            .add(DcaInstruction.swapFromSol(
                poolKeys.programId,         // liquidityProgramId
                poolKeys.id,                // ammAddress
                poolKeys.authority,         // ammAuthorityAddress
                poolKeys.openOrders,        // ammOpenOrderAddress
                poolKeys.targetOrders,      // ammTargetOrderAddress
                poolKeys.baseVault,         // poolCoinTokenAddress
                poolKeys.quoteVault,        // poolPcTokenAddress
                poolKeys.marketProgramId,   // serumMarketProgramId
                poolKeys.marketId,          // serumMarketAddress
                poolKeys.marketBids,        // serumBidsAddress
                poolKeys.marketAsks,        // serumAskAddress
                poolKeys.marketEventQueue,  // serumEventQueueAddress
                poolKeys.marketBaseVault,   // serumCoinVaultAddress
                poolKeys.marketQuoteVault,  // serumVaultAddress
                poolKeys.marketAuthority,   // serumVaultSigner
                vaultAddress,
                vaultNativeMintAddress,
                vaultTokenAddress,
                mintAddress,
                ownerAddress,
                dcaDataAddress,
                NativeMint,
            ));
        txn.feePayer = ownerAddress;
        txn.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        const signedTxn = await window.solana.signTransaction(txn);
        console.log(signedTxn);

        const signature = await sendAndConfirmRawTransaction(
            connection,
            signedTxn.serialize(),
        );

        return {
            status: "success",
            data: {
                signature: signature,
            }
        }
    } catch (e) {
        throw e;
    }
}

/**
 * Swap Token to Sol
 * @param {Connection} connection The connection The Connection of solana json rpc network
 * @param {string} owner The address of the owner who initialize dca
 * @param {string} mint The address of token mint
 * @param {string} dcaData The address of the account which store dca state
 * @param {string} poolId The address of the amm liquidity pool account
 */
export async function swapToSol(connection, owner, mint, dcaData) {
    if (!connection && !owner && !mint && !dcaData) {
        throw new ReferenceError("Missing arguments.");
    }

    if (!(connection instanceof Connection) &&
        typeof owner != "string" &&
        typeof mint != "string" &&
        typeof dcaData != "string"
    ) {
        throw new TypeError("Invalid argument type.");
    }

    const ownerAddress = new PublicKey(owner);
    const mintAddress = new PublicKey(mint);
    const dcaDataAddress = new PublicKey(dcaData);
    const [vaultAddress,] = await findDcaDerivedAddress([ownerAddress.toBuffer(), dcaDataAddress.toBuffer()]);
    const [vaultTokenAddress,] = await findAssociatedTokenAddress(vaultAddress, mintAddress);
    const [vaultNativeMintAddress,] = await findAssociatedTokenAddress(vaultAddress, NativeMint);

    // const poolKeysList = await fetchAllPoolKeys();
    // if (poolKeysList.length === 0) throw new Error("Error in retreiving liquidity pool keys");

    // const keys = poolKeysList.find(el => el.quoteMint.includes(NativeMint) &&
    //     el.baseMint.includes(mintAddress));
    // if (!keys) throw new Error("No liquidity pool found.")

    // FIDA_SOL
    const POOL_ID = new PublicKey("ER3u3p9TGyA4Sc9VCJrkLq4hR73GFW8QAzYkkz8rSwsk");

    const poolKeys = await fetchPoolKeys(
        connection,
        POOL_ID
    );

    console.log(`
            poolKeys: ,
            "id": ${poolKeys.id},
            "authority": ${poolKeys.authority},
            "openOrders": ${poolKeys.openOrders},
            "targetOrders": ${poolKeys.targetOrders},
            "baseVault": ${poolKeys.baseVault},
            "quoteVault": ${poolKeys.quoteVault},
            "marketId": ${poolKeys.marketId},
            "marketBids": ${poolKeys.marketBids},
            "marketAsks": ${poolKeys.marketAsks},
            "marketEventQueue": ${poolKeys.marketEventQueue},
            "marketBaseVault": ${poolKeys.marketBaseVault},
            "marketQuoteVault": ${poolKeys.marketQuoteVault},
            "marketAuthority": ${poolKeys.marketAuthority},`
    );

    let txn = new Transaction()
        .add(DcaInstruction.swapToSol(
            poolKeys.id,                // ammAddress
            poolKeys.authority,         // ammAuthorityAddress
            poolKeys.openOrders,        // ammOpenOrderAddress
            poolKeys.targetOrders,      // ammTargetOrderAddress
            poolKeys.baseVault,         // poolCoinTokenAddress
            poolKeys.quoteVault,        // poolPcTokenAddress
            poolKeys.marketId,          // serumMarketAddress
            poolKeys.marketBids,        // serumBidsAddress
            poolKeys.marketAsks,        // serumAskAddress
            poolKeys.marketEventQueue,  // serumEventQueueAddress
            poolKeys.marketBaseVault,   // serumCoinVaultAddress
            poolKeys.marketQuoteVault,  // serumVaultAddress
            poolKeys.marketAuthority,   // serumVaultSigner
            vaultTokenAddress,
            vaultAddress,
            vaultNativeMintAddress,
            mintAddress,
            ownerAddress,
            dcaDataAddress,
            NativeMint,
        ));
    txn.feePayer = ownerAddress;
    txn.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    const signedTxn = await window.solana.signTransaction(txn);

    const signature = await sendAndConfirmRawTransaction(
        connection,
        signedTxn.serialize(),
    );

    return {
        status: "success",
        data: {
            signature: signature,
        }
    }
}

/**
 * Fund non-native token to existing vault
 * @param {Connection} connection The connection The Connection of solana json rpc network
 * @param {string} owner The address of the owner who initialize dca
 * @param {string} mint The address of token mint
 * @param {string} dcaData The address of the account which store dca state
 * @param {string} transferAmount The amount to fund
 */
export async function fundToken(connection, owner, mint, dcaData, amount) {
    try {
        if (!connection && !owner && !mint && !dcaData && !amount) {
            throw new ReferenceError("Missing arguments.");
        }

        if (!(connection instanceof Connection) &&
            typeof owner != "string" &&
            typeof mint != "string" &&
            typeof dcaData != "string" &&
            typeof amount != "string"
        ) {
            throw new TypeError("Invalid argument type.");
        }

        const ownerAddress = new PublicKey(owner);
        const mintAddress = new PublicKey(mint);
        const dcaDataAddress = new PublicKey(dcaData);
        const [vaultAddress,] = await findDcaDerivedAddress([ownerAddress.toBuffer(), dcaDataAddress.toBuffer()]);
        const [ownerTokenAddress,] = await findAssociatedTokenAddress(ownerAddress, mintAddress);
        const [vaultTokenAddress,] = await findAssociatedTokenAddress(vaultAddress, mintAddress);
        const transferAmount = convertToLamports(amount);

        let txn = new Transaction()
            .add(DcaInstruction.fundToken(
                ownerAddress,
                vaultAddress,
                mintAddress,
                ownerTokenAddress,
                vaultTokenAddress,
                dcaDataAddress,
                transferAmount
            ));
        txn.feePayer = ownerAddress;
        txn.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        const signedTxn = await window.solana.signTransaction(txn);

        const signature = await sendAndConfirmRawTransaction(
            connection,
            signedTxn.serialize(),
        );

        return {
            status: "success",
            data: {
                signature: signature,
            }
        }
    } catch (e) {
        throw e;
    }
}

/**
 * Fund native token to existing vault
 * @param {Connection} connection The connection The Connection of solana json rpc network
 * @param {string} owner The address of the owner who initialize dca
 * @param {string} mint The address of token mint
 * @param {string} dcaData The address of the account which store dca state
 * @param {string} transferAmount The amount to fund
 */
export async function fundSol(connection, owner, mint, dcaData, amount) {
    try {
        if (!connection && !owner && !mint && !dcaData && !amount) {
            throw new ReferenceError("Missing arguments.");
        }

        if (!(connection instanceof Connection) &&
            typeof owner != "string" &&
            typeof mint != "string" &&
            typeof dcaData != "string" &&
            typeof amount != "string"
        ) {
            throw new TypeError("Invalid argument types.");
        }

        const ownerAddress = new PublicKey(owner);
        const mintAddress = new PublicKey(mint);
        const dcaDataAddress = new PublicKey(dcaData);
        const [vaultAddress,] = await findDcaDerivedAddress([ownerAddress.toBuffer(), dcaDataAddress.toBuffer()]);
        const [ownerTokenAddress,] = await findAssociatedTokenAddress(ownerAddress, mintAddress);
        const [vaultTokenAddress,] = await findAssociatedTokenAddress(vaultAddress, mintAddress);
        const [vaultNativeMintAddress,] = await findAssociatedTokenAddress(vaultAddress, NativeMint);
        const transferAmount = convertToLamports(amount);

        let txn = new Transaction()
            .add(DcaInstruction.fundSol(
                ownerAddress,
                vaultAddress,
                mintAddress,
                NativeMint,
                ownerTokenAddress,
                vaultNativeMintAddress,
                vaultTokenAddress,
                dcaDataAddress,
                transferAmount
            ));
        txn.feePayer = ownerAddress;
        txn.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        const signedTxn = await window.solana.signTransaction(txn);

        const signature = await sendAndConfirmRawTransaction(
            connection,
            signedTxn.serialize()
        );

        return {
            status: "success",
            data: {
                signature: signature,
            }
        }
    } catch (e) {
        throw e;
    }
}
