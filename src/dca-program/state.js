import { PublicKey } from "@solana/web3.js";
import { deserialize, deserializeUnchecked } from "borsh";

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
        this.flag = state;
        this.state = flag;
        this.minimumAmountOut = minimumAmountOut;
    }

    /**
     * Decode buffer data to DcaAccount Object
     * @param { Buffer } data 
     * @returns 
     */
    static decodeUnchecked(data) {
        return deserializeUnchecked(dcaAccountSchema, DcaAccount, data);
    }
}


export const dcaAccountSchema = new Map([
    [
        DcaAccount,
        {
            kind: "struct",
            fields: [
                ["totalAmount", "u64"],
                ["senderAccount", ["u8", 32]],
                ["mintAddress", ["u8", 32]],
                ["startTime", "u64"],
                ["dcaAmount", "u64"],
                ["dcaTime", "u64"],
                ["flag", "u8"],
                ["state", "u8"],
                ["minimumAmountOut", "u64"],
            ]
        }
    ]
]);
