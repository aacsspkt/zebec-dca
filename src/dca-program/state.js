import { deserialize, deserializeUnchecked } from "borsh";

export class DcaAccount {
    constructor({
        totalAmount,
        senderAddress,
        mintAddress,
        startTime,
        dcaAmount,
        dcaTime,
        state,
        flag,
        minimumAmountOut
    }) {
        this.totalAmount = totalAmount;
        this.senderAddress = senderAddress;
        this.mintAddress = mintAddress;
        this.startTime = startTime;
        this.dcaAmount = dcaAmount;
        this.dcaTime = dcaTime;
        this.state = state;
        this.flag = flag;
        this.minimumAmountOut = minimumAmountOut;
    }

    /**
     * Decode buffer data to DcaAccount Object
     * @param { Buffer } data 
     * @returns Object instance of DcaAccount  
     */
    static decode(data) {
        if (!data instanceof Buffer) {
            throw new TypeError("Not a buffer!")
        }
        return deserialize(dcaAccountSchema, this, data);
    }

    /**
     * 
     * @param { Buffer } data 
     * @returns 
     */
    static decodeUnchecked(data) {
        if (!data instanceof Buffer) {
            throw new TypeError("Not a buffer!")
        }
        return deserializeUnchecked(dcaAccountSchema, this, data);
    }
}


const dcaAccountSchema = new Map([
    [
        DcaAccount,
        {
            kind: "struct",
            field: [
                ["totalAmount", "u64"],
                ["senderAddress", ["u8", 32]],
                ["mintAddress", ["u8", 32]],
                ["startTime", "u64"],
                ["dcaAmount", "u64"],
                ["dcaTime", "u64"],
                ["state", "u8"],
                ["flag", "u8"],
                ["minimumAmountOut", "u64"]
            ]
        }
    ]
]);


