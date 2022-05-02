import { clusterApiUrl, Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
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
 * @returns Object
 */
export async function depositToken({ connection, fromAddress, mintAddress, amount }) {
    try {
        if (!connection && !fromAddress && !mintAddress && !amount) {
            throw new ReferenceError("Missing arguments");
        }

        if (!(connection instanceof Connection)) {
            throw new TypeError("Not a solana connection.");
        }

        let dcaDataAccount = Keypair.generate();

        let txn = new Transaction()
            .add(DcaProgram.depositToken({
                fromAddress: new PublicKey(fromAddress),
                mintAddress: new PublicKey(mintAddress),
                dcaDataAddress: dcaDataAccount.publicKey,
                amount: amount
            }));
        txn.feePayer = new PublicKey(fromAddress);
        txn.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        const signedTxn = window.solana.signTransaction(txn.serialize());
        const signature = connection.sendRawTransaction(signedTxn)
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
            throw new ReferenceError("Missing arguments");
        }

        if (!(connection instanceof Connection)) {
            throw new TypeError("Not a solana connection.");
        }

        let txn = new Transaction()
            .add(DcaProgram.initialize({
                fromAddress: fromAddress,
                dcaDataAddress: dcaDataAddress,
                startTime: startTime,
                dcaAmount: dcaAmount,
                dcaTime: dcaTime,
                minimumAmountOut: minimumAmountOut
            }));
        txn.feePayer = new PublicKey(fromAddress);
        txn.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        const signedTxn = window.solana.signTransaction(txn.serialize());
        const signature = connection.sendRawTransaction(signedTxn)
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


export async function depositSol(args) {
    throw new Error("Not Implemented");
}


export async function withdrawToken(args) {
    throw new Error("Not Implemented");
}


export async function withdrawSol(args) {
    throw new Error("Not Implemented");
}


export async function swapFromSol(args) {
    throw new Error("Not Implemented");
}


export async function swapToSol(args) {
    throw new Error("Not Implemented");
}


export async function fundToken(args) {
    throw new Error("Not Implemented");
}


export async function fundSol(args) {
    throw new Error("Not Implemented");
}
