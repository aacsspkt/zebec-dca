import { Connection, PublicKey, Commitment } from "@solana/web3.js";
import { deserializeUnchecked } from "borsh";
import { DcaProgramId } from "./constants";

export class DcaAccount {
    constructor({
        totalAmount,
        senderAccount,
        mintAddress,
        startTime,
        dcaAmount,
        dcaTime,
        state,
        flag,
        minimumAmountOut
    }) {
        this.totalAmount = totalAmount;
        this.senderAccount = senderAccount;
        this.mintAddress = mintAddress;
        this.startTime = startTime;
        this.dcaAmount = dcaAmount;
        this.dcaTime = dcaTime;
        this.state = flag;
        this.flag = state;
        this.minimumAmountOut = minimumAmountOut;
    }

    /**
     * Decode buffer data to DcaAccount Object
     * @param { Buffer } data 
     * @returns {DcaAccount
     */
    static decodeUnchecked(data) {
        return deserializeUnchecked(dcaAccountSchema, DcaAccount, data);
    }

    /**
     * 
     * @param {Connection} connection 
     * @param {PublicKey} address 
     * @param {Commitment} commitment 
     * @param {PublicKey} programId 
     * @returns 
     */
    static async getDcaAccountInfo(connection, address, commitment, programId = DcaProgramId) {
        const info = await connection.getAccountInfo(address, commitment);
        if (!info) throw new Error("Dca Account not found.");
        if (!info.owner.equals(programId)) throw new Error("Account is not owned by Dca Program.");

        const dcaAcount = this.decodeUnchecked(info.data);

        return dcaAcount;
    }
}

export const dcaAccountSchema = new Map([
    [
        DcaAccount,
        {
            kind: "struct",
            fields: [
                ["totalAmount", "u64"],
                ["senderAccount", [32]],
                ["mintAddress", [32]],
                ["startTime", "u64"],
                ["dcaAmount", "u64"],
                ["dcaTime", "u64"],
                ["state", "u8"],
                ["flag", "u8"],
                ["minimumAmountOut", "u64"],
            ]
        }
    ]
]);


