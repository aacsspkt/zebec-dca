import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import BN from "bn.js";
import { DcaInstruction } from "./instructions";
import { findAssociatedTokenAddress, convertToLamports, findDcaDerivedAddress, fetchPoolKeys } from "./utils";
import { NATIVE_MINT } from "./constants"

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
        const [ownerAta,] = await findAssociatedTokenAddress(ownerAddress, mintAddress);
        const [vaultAta,] = await findAssociatedTokenAddress(vaultAddress, mintAddress);
        const _amount = convertToLamports(amount);

        let txn = new Transaction()
            .add(DcaInstruction.depositToken(
                ownerAddress,
                vaultAddress,
                mintAddress,
                ownerAta,
                vaultAta,
                dcaDataAccount.publicKey,
                _amount
            ));

        txn.feePayer = ownerAddress;
        txn.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        txn.partialSign(dcaDataAccount);

        const signedTxn = await window.solana.signTransaction(txn);
        const signature = await connection.sendRawTransaction(signedTxn.serialize());
        await connection.confirmTransaction(signature, "confirmed");

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
export async function initialize(connection, owner, dcaData, startTime, dcaAmount, dcaTime, minimumAmountOut) {
    try {
        if (!connection && !owner && !dcaData && !startTime && !dcaAmount && dcaTime && !minimumAmountOut) {
            throw new ReferenceError("Missing arguments.");
        }

        if (!(connection instanceof Connection) &&
            typeof owner != "string" &&
            typeof dcaData != "string" &&
            typeof startTime != "number" &&
            typeof dcaAmount != "number" &&
            typeof dcaTime != "number" &&
            typeof minimumAmountOut != "number"
        ) {
            throw new TypeError("Invalid argument types.");
        }

        const ownerAddress = new PublicKey(owner);
        const dcaDataAddress = new PublicKey(dcaData);
        const vaultAddress = findDcaDerivedAddress([ownerAddress.toBuffer(), dcaDataAddress.toBuffer()])
        const _startTime = new BN(startTime);
        const _dcaAmount = convertToLamports(dcaAmount);
        const _dcaTime = new BN(dcaTime);
        const _minimumAmountOut = convertToLamports(minimumAmountOut);

        let txn = new Transaction()
            .add(DcaInstruction.initialize(
                ownerAddress,
                vaultAddress,
                dcaDataAddress,
                _startTime,
                _dcaAmount,
                _dcaTime,
                _minimumAmountOut
            ));

        txn.feePayer = ownerAddress;
        txn.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        const signedTxn = await window.solana.signTransaction(txn);
        const signature = await connection.sendRawTransaction(signedTxn.serialize());
        await connection.confirmTransaction(signature, "confirmed");

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
        const [ownerAta,] = await findAssociatedTokenAddress(ownerAddress, mintAddress);
        const [vaultAta,] = await findAssociatedTokenAddress(vaultAddress, mintAddress);
        const _amount = convertToLamports(amount);

        console.log(dcaDataAccount.publicKey.toBase58())
        console.log(ownerAddress.toBase58());
        console.log(mintAddress.toBase58());
        console.log(vaultAddress.toBase58());
        console.log(ownerAta.toBase58());
        console.log(vaultAta.toBase58())
        console.log(_amount.toString(10));

        let txn = new Transaction()
            .add(DcaInstruction.depositSol(
                ownerAddress,
                vaultAddress,
                mintAddress,
                ownerAta,
                vaultAta,
                dcaDataAccount.publicKey,
                _amount
            ));
        txn.feePayer = ownerAddress;
        txn.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        txn.partialSign(dcaDataAccount);
        console.log(txn);
        const signedTxn = await window.solana.signTransaction(txn);
        console.log(signedTxn);
        const signature = await connection.sendRawTransaction(signedTxn.serialize());
        await connection.confirmTransaction(signature, "confirmed");

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
        const [ownerAta,] = await findAssociatedTokenAddress(ownerAddress, mintAddress);
        const [vaultAta,] = await findAssociatedTokenAddress(vaultAddress, mintAddress);
        const transferAmount = convertToLamports(amount);



        let txn = new Transaction()
            .add(DcaInstruction.withdrawToken(
                ownerAddress,
                vaultAddress,
                mintAddress,
                ownerAta,
                vaultAta,
                dcaDataAddress,
                transferAmount
            ));
        txn.feePayer = ownerAddress;
        txn.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        const signedTxn = await window.solana.signTransaction(txn);
        const signature = await connection.sendRawTransaction(signedTxn.serialize());
        await connection.confirmTransaction(signature, "confirmed");

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
        const [ownerAta,] = await findAssociatedTokenAddress(ownerAddress, mintAddress);
        const [vaultAta,] = await findAssociatedTokenAddress(vaultAddress, mintAddress);
        const transferAmount = convertToLamports(amount);

        let txn = new Transaction()
            .add(DcaInstruction.withdrawSol(
                ownerAddress,
                vaultAddress,
                mintAddress,
                ownerAta,
                vaultAta,
                dcaDataAddress,
                transferAmount
            ));
        txn.feePayer = ownerAddress;
        txn.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        const signedTxn = await window.solana.signTransaction(txn);
        const signature = await connection.sendRawTransaction(signedTxn.serialize());
        await connection.confirmTransaction(signature, "confirmed");

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
export async function swapFromSol(connection, owner, mint, dcaData, poolId) {
    try {
        if (!connection && !owner && !mint && !dcaData && !poolId) {
            throw new ReferenceError("Missing arguments.");
        }

        if (!(connection instanceof Connection) &&
            typeof owner != "string" &&
            typeof mint != "string" &&
            typeof dcaData != "string" &&
            typeof poolId != "string"
        ) {
            throw new TypeError("Invalid argument type.");
        }

        const poolIdKey = new PublicKey(poolId);

        const poolKeys = await fetchPoolKeys(
            connection,
            poolIdKey
        );

        const ownerAddress = new PublicKey(owner);
        const mintAddress = new PublicKey(mint);
        const dcaDataAddress = new PublicKey(dcaData);
        const [vaultAddress,] = await findAssociatedTokenAddress(ownerAddress, dcaDataAddress);
        // please review this:    |
        //                        V
        const [destinationTokenAddress,] = await findDcaDerivedAddress([ownerAddress.toBuffer(), NATIVE_MINT])

        let txn = new Transaction()
            .add(DcaInstruction.swapFromSol(
                poolKeys.id,                //ammAddress
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
                vaultAddress,               // sourceTokenAddress
                destinationTokenAddress,         // destinationTokenAddress
                mintAddress,                // mintAddress
                ownerAddress,               // ownerAddress
                dcaDataAddress              // dcaDataAddress
            ));
        txn.feePayer = ownerAddress;
        txn.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        const signedTxn = await window.solana.signTransaction(txn);
        const signature = await connection.sendRawTransaction(signedTxn.serialize());
        await connection.confirmTransaction(signature, "confirmed");

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
export async function swapToSol(connection, owner, mint, dcaData, poolId) {
    if (!connection && !owner && !mint && !dcaData && !poolId) {
        throw new ReferenceError("Missing arguments.");
    }

    if (!(connection instanceof Connection) &&
        typeof owner != "string" &&
        typeof mint != "string" &&
        typeof dcaData != "string" &&
        typeof poolId != "string"
    ) {
        throw new TypeError("Invalid argument type.");
    }

    const poolIdKey = new PublicKey(poolId);

    const poolKeys = await fetchPoolKeys(
        connection,
        poolIdKey
    );

    const ownerAddress = new PublicKey(owner);
    const mintAddress = new PublicKey(mint);
    const dcaDataAddress = new PublicKey(dcaData);
    const [vaultAddress,] = await findAssociatedTokenAddress(ownerAddress, dcaDataAddress);

    // please review this:    |
    //                        V
    const [sourceTokenAddress,] = await findAssociatedTokenAddress(ownerAddress.toBuffer(), NATIVE_MINT.toBuffer())

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
            sourceTokenAddress,         // sourceTokenAddress
            vaultAddress,               // destinationTokenAddress
            mintAddress,                // mintAddress
            ownerAddress,               // ownerAddress
            dcaDataAddress              // dcaDataAddress
        ));
    txn.feePayer = ownerAddress;
    txn.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    const signedTxn = await window.solana.signTransaction(txn);
    const signature = await connection.sendRawTransaction(signedTxn.serialize());
    await connection.confirmTransaction(signature, "confirmed");

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
        const [ownerAta,] = await findAssociatedTokenAddress(ownerAddress, mintAddress);
        const [vaultAta,] = await findAssociatedTokenAddress(vaultAddress, mintAddress);
        const transferAmount = convertToLamports(amount);

        let txn = new Transaction()
            .add(DcaInstruction.fundToken(
                ownerAddress,
                vaultAddress,
                mintAddress,
                ownerAta,
                vaultAta,
                dcaDataAddress,
                transferAmount
            ));
        txn.feePayer = ownerAddress;
        txn.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        const signedTxn = await window.solana.signTransaction(txn);
        const signature = await connection.sendRawTransaction(signedTxn.serialize());
        await connection.confirmTransaction(signature, "confirmed");

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
        const [ownerAta,] = await findAssociatedTokenAddress(ownerAddress, mintAddress);
        const [vaultAta,] = await findAssociatedTokenAddress(vaultAddress, mintAddress);
        const transferAmount = convertToLamports(amount);

        let txn = new Transaction()
            .add(DcaInstruction.fundSol(
                ownerAddress,
                vaultAddress,
                mintAddress,
                ownerAta,
                vaultAta,
                dcaDataAddress,
                transferAmount
            ));
        txn.feePayer = ownerAddress;
        txn.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        const signedTxn = await window.solana.signTransaction(txn);
        const signature = await connection.sendRawTransaction(signedTxn.serialize());
        await connection.confirmTransaction(signature, "confirmed");

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
