import { clusterApiUrl, Connection, Transaction } from "@solana/web3.js";
import { DcaProgram } from "./instructions";

export class DcaProgramClient {
    constructor({ wallet, url = null, cluster = null }) {
        if (!wallet) {
            throw new Error("Wallet is not provided.");
        }
        this.wallet = wallet;
        url ?
            this.connection = new Connection(url) :
            cluster ?
                this.connection = new Connection(clusterApiUrl(cluster)) :
                this.connection = new Connection(clusterApiUrl(cluster));
    }



    async depositToken({ senderAddress, mintAddress, amountInSol }) {
        try {

            let tx = new Transaction()
                .add(DcaProgram.depositSol({
                    fromAddress: senderAddress,
                    mintAddress: mintAddress,
                    amountInSol: amountInSol
                }));
            tx.feePayer = window.solana.publicKey;
            tx.recentBlockhash = (await this.connection.getLatestBlockhash()).blockhash;

            const signature = this.wallet.signAndSendTransaction() // todo
            await this.connection.confirmTransaction(signature, "confirmed");

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


    async initialize(args) {
        throw new Error("Not Implemented");
    }


    async depositSol(args) {
        throw new Error("Not Implemented");
    }


    async withdrawToken(args) {
        throw new Error("Not Implemented");
    }


    async withdrawSol(args) {
        throw new Error("Not Implemented");
    }


    async swapFromSol(args) {
        throw new Error("Not Implemented");
    }


    async swapToSol(args) {
        throw new Error("Not Implemented");
    }


    async fundToken(args) {
        throw new Error("Not Implemented");
    }


    async fundSol(args) {
        throw new Error("Not Implemented");
    }
}