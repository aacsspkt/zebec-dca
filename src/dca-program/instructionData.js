// import { serialize, deserialize, deserializeUnchecked } from 'borsh';

import { serialize } from "borsh";


/** Instruction Types of DCA Program */
export const InstructionTypes = Object.freeze({
    ProcessDepositToken: 0,
    ProcessInitialize: 1,
    ProcessDepositSol: 2,
    ProcessSwapToSol: 3,
    ProcessSwapFromSol: 4,
    ProcessWithdrawToken: 5,
    ProcessWithdrawSol: 6,
    ProcessFundToken: 7,
    ProcessFundSol: 8
});


const depositTokenSchema = new Map([
    [
        DepositTokenData,
        {
            kind: "struct",
            fields: [
                ["instruction", "u8"],
                ["amount", "u64"],
            ],
        }
    ]
]);


const initializeSchema = new Map([
    [
        InitializeData,
        {
            kind: "struct",
            fields: [
                ["instruction", "u8"],
                ["startTime", "u64"],
                ["dcaAmount", "u64"],
                ["dcaTime", "u64"],
                ["minimumAmountOut", "u64"]
            ]
        }
    ]
])


const depositSolSchema = new Map(); // todo


const swapToSol = new Map(); // todo


const swapFromSol = new Map() // todo


const withdrawTokenSchema = new Map(); // todo


const withdrawSolSchema = new Map(); // todo


const fundTokenSchema = new Map(); // todo


const fundSolSchema = new Map(); // todo


/** 
 * Data for "InstructionTypes.ProcessDepositToken"
 */
export class DepositTokenData {
    constructor({ amount }) {
        this.instruction = InstructionTypes.ProcessDepositToken;
        // todo: validate
        this.amount = amount;
    }


    /**
     * Serialize the object to binary
     * @returns Buffer | UInt8Array  of this object
     */
    encode() {
        return Buffer.from(serialize(depositTokenSchema, this))
    }
}


/**
 * Data for "InstructionTypes.ProcessInitialize"
 */
export class InitializeData {
    constructor({ startTime, dcaAmount, dcaTime, minimumAmountOut }) {
        this.instruction = InstructionTypes.ProcessInitialize;
        // todo: validate
        this.startTime = startTime;
        this.dcaAmount = dcaAmount;
        this.dcaTime = dcaTime;
        this.minimumAmountOut = minimumAmountOut;
    }

    /**
     * Serialize the object to binary
     * @returns Buffer | UInt8Array  of this object
     */
    encode() {
        return Buffer.from(serialize(initializeSchema, this))
    }
}


/** Schema for deposit sol data */
export class DepositSolData {
    constructor({ amount }) {
        this.instruction = InstructionTypes.ProcessDepositSol;
        // todo: validate
        this.amount = amount;
    }

    /**
     * Serialize the object to binary
     * @returns Buffer | UInt8Array  of this object
     */
    encode() {
        return Buffer.from(serialize(depositSolSchema, this))
    }
}


export class SwapToSolData {
    constructor(args) {
        throw new Error("Not Implemented");
    }
}


export class SwapFromSolData {
    constructor(args) {
        throw new Error("Not Implemented");
    }
}


export class WithdrawTokenData {
    constructor(args) {
        throw new Error("Not Implemented");
    }
}


export class WithdrawSolData {
    constructor(args) {
        throw new Error("Not Implemented");
    }
}


export class FundTokenData {
    constructor(args) {
        throw new Error("Not Implemented");
    }
}


export class FundSolData {
    constructor(args) {
        throw new Error("Not Implemented");
    }
}
