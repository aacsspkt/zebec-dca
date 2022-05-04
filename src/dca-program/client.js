import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { DcaProgram } from "./instructions";

export const getProvider = async () => {
    const isPhantomInstalled = (await window.solana) && window.solana.isPhantom;
    if (isPhantomInstalled) {
        window.solana.connect();
    } else {
        window.open("https://phantom.app/", "_blank");
    }
};

/**
 * 
 * @returns Response object
 */
export async function depositToken({ connection, fromAddress, mintAddress, amount }) {
    try {
        if (!connection && !fromAddress && !mintAddress && !amount) {
            throw new ReferenceError("Missing arguments.");
        }

        if (!(connection instanceof Connection)) {
            throw new TypeError("Not a Rpc endpoint.");
        }

        let dcaDataAccount = Keypair.generate();

        let txn = new Transaction()
            .add(await DcaProgram.depositToken({
                fromAddress: new PublicKey(fromAddress),
                mintAddress: new PublicKey(mintAddress),
                dcaDataAddress: dcaDataAccount.publicKey,
                amount: amount
            }));
        txn.feePayer = new PublicKey(fromAddress);
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


export async function initialize({ connection, fromAddress, dcaDataAddress, startTime, dcaAmount, dcaTime, minimumAmountOut }) {
    try {
        if (!connection && !fromAddress && !dcaDataAddress && !startTime && !dcaAmount && dcaTime && !minimumAmountOut) {
            throw new ReferenceError("Missing arguments.");
        }

        if (!(connection instanceof Connection)) {
            throw new TypeError("Not a Rpc enpoint.");
        }

        let txn = new Transaction()
            .add(await DcaProgram.initialize({
                fromAddress: new PublicKey(fromAddress),
                dcaDataAddress: new PublicKey(dcaDataAddress),
                startTime: startTime,
                dcaAmount: dcaAmount,
                dcaTime: dcaTime,
                minimumAmountOut: minimumAmountOut
            }));
        txn.feePayer = new PublicKey(fromAddress);
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


export async function depositSol(connection, fromAddress, mintAddress, amount) {
    try {
        if (!connection && !fromAddress && !mintAddress && !amount) {
            throw new ReferenceError("Missing arguments.");
        }

        if (!(connection instanceof Connection)) {
            throw new TypeError("Not a Rpc enpoint.");
        }

        let dcaDataAccount = Keypair.generate();

        let txn = new Transaction()
            .add(await DcaProgram.depositSol({
                fromAddress: new PublicKey(fromAddress),
                mintAddress: new PublicKey(mintAddress),
                dcaDataAddress: dcaDataAccount.publicKey,
                amount: amount,
            }));
        txn.feePayer = new PublicKey(fromAddress);
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


export async function withdrawToken({ connection, fromAddress, dcaDataAddress, mintAddress, transferAmount }) {
    try {
        if (!connection && !fromAddress && !mintAddress && !dcaDataAddress && !transferAmount) {
            throw new ReferenceError("Missing arguments.");
        }

        if (!(connection instanceof Connection)) {
            throw new TypeError("Not a Rpc enpoint.");
        }

        let txn = new Transaction()
            .add(await DcaProgram.withdrawToken({
                fromAddress: new PublicKey(fromAddress),
                mintAddress: new PublicKey(mintAddress),
                dcaDataAddress: new PublicKey(dcaDataAddress),
                transferAmount: transferAmount,
            }));
        txn.feePayer = new PublicKey(fromAddress);
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


export async function withdrawSol({ connection, fromAddress, mintAddress, dcaDataAddress, transferAmount }) {
    try {
        if (!connection && !fromAddress && !mintAddress && !dcaDataAddress && !transferAmount) {
            throw new ReferenceError("Missing arguments.");
        }

        if (!(connection instanceof Connection)) {
            throw new TypeError("Not a Rpc enpoint.");
        }

        let txn = new Transaction()
            .add(await DcaProgram.withdrawSol({
                fromAddress: new PublicKey(fromAddress),
                mintAddress: new PublicKey(mintAddress),
                dcaDataAddress: new PublicKey(dcaDataAddress),
                transferAmount: transferAmount
            }));
        txn.feePayer = new PublicKey(fromAddress);
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


export async function swapFromSol(args) {
    throw new Error("Not Implemented");
}


export async function swapToSol(args) {
    throw new Error("Not Implemented");
}


export async function fundToken({ connection, fromAddress, mintAddress, dcaDataAddress, transferAmount }) {
    try {
        if (!connection && !fromAddress && !mintAddress && !dcaDataAddress && !transferAmount) {
            throw new ReferenceError("Missing arguments.");
        }

        if (!(connection instanceof Connection)) {
            throw new TypeError("Not a Rpc endpoint.");
        }

        let txn = new Transaction()
            .add(await DcaProgram.fundToken({
                fromAddress: new PublicKey(fromAddress),
                mintAddress: new PublicKey(mintAddress),
                dcaDataAddress: new PublicKey(dcaDataAddress),
                transferAmount: transferAmount
            }));
        txn.feePayer = new PublicKey(fromAddress);
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


export async function fundSol({ connection, fromAddress, mintAddress, dcaDataAddress, transferAmount }) {
    try {
        if (!connection && !fromAddress && !mintAddress && !dcaDataAddress && !transferAmount) {
            throw new ReferenceError("Missing arguments.");
        }

        if (!(connection instanceof Connection)) {
            throw new TypeError("Not a Rpc endpoint.");
        }

        let txn = new Transaction()
            .add(await DcaProgram.fundSol({
                fromAddress: new PublicKey(fromAddress),
                mintAddress: new PublicKey(mintAddress),
                dcaDataAddress: new PublicKey(dcaDataAddress),
                transferAmount: transferAmount
            }));
        txn.feePayer = new PublicKey(fromAddress);
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
