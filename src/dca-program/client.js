import { clusterApiUrl, Connection, PublicKey, Transaction } from "@solana/web3.js";
import { DcaProgram } from "./instructions";

export const getProvider = async () => {
    const isPhantomInstalled = (await window.solana) && window.solana.isPhantom;
    if (isPhantomInstalled) {
        window.solana.connect();
    } else {
        window.open("https://phantom.app/", "_blank");
    }
};


export async function depositToken({ connection, senderAddress, mintAddress, amountInSol }) {
    try {

        let txn = new Transaction()
            .add(DcaProgram.depositSol({
                fromAddress: new PublicKey(senderAddress),
                mintAddress: new PublicKey(mintAddress),
                amountInSol: amountInSol
            }));
        txn.feePayer = window.solana.publicKey;
        txn.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        const signature = window.solana.signAndSendTransaction(txn);
        await connection.confirmTransaction(signature, "confirmed");

        return {
            status: "success",
            data: {
                signature: signature
            }
        }
    } catch (e) {
        throw e;
    }
}


export async function initialize(args) {
    throw new Error("Not Implemented");
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
