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


const depositSolSchema = new Map([
    [
        DepositSolData,
        {
            kind: "struct",
            fields: [
                ["instruction", "u8"],
                ["amount", "u64"],
            ],
        }
    ]
]);


const swapToSol = new Map(); // todo


const swapFromSol = new Map() // todo


const withdrawTokenSchema = new Map([
    [
        WithdrawTokenData,
        {
            kind: "struct",
            fields: [
                ["instruction", "u8"],
                ["transferAmount", "u64"],
            ],
        }
    ]
]);


const withdrawSolSchema = new Map([
    [
        WithdrawSolData,
        {
            kind: "struct",
            fields: [
                ["instruction", "u8"],
                ["transferAmount", "u64"],
            ],
        }
    ]
]);


const fundTokenSchema = new Map([
    [
        FundTokenData,
        {
            kind: "struct",
            fields: [
                ["instruction", "u8"],
                ["transferAmount", "u64"],
            ],
        }
    ]
]);


const fundSolSchema = new Map([
    [
        FundSolData,
        {
            kind: "struct",
            fields: [
                ["instruction", "u8"],
                ["transferAmount", "u64"],
            ],
        }
    ]
]);


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


/**
 *  Data for "InstructionTypes.ProcessDepositSol"
 */
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

/**
 * Data for "InstructionTypes.ProcessSwapToSol"
 */
export class SwapToSolData {
    constructor(args) {
        throw new Error("Not Implemented");
    }
}

/**
 * Data for "IntructionTypes.ProcessSwapFromSol"
 */
export class SwapFromSolData {
    constructor(args) {
        throw new Error("Not Implemented");
    }
}

/**
 * Data for "InstructionTypes.ProcessWithdrawToken"
 */
export class WithdrawTokenData {
    constructor({ transferAmount }) {
        this.instruction = InstructionTypes.ProcessWithdrawToken;
        // todo: validate
        this.transferAmount = transferAmount;
    }

    /**
     * Serialize the object to binary
     * @returns Buffer | UInt8Array  of this object
     */
    encode() {
        return Buffer.from(serialize(withdrawTokenSchema, this))
    }
}

/**
 * Data for "InstructionTypes.ProcessWithdrawSol"
 */
export class WithdrawSolData {
    constructor({ transferAmount }) {
        this.instruction = InstructionTypes.ProcessWithdrawSol;
        // todo: validate
        this.transferAmount = transferAmount;
    }

    /**
     * Serialize the object to binary
     * @returns Buffer | UInt8Array  of this object
     */
    encode() {
        return Buffer.from(serialize(withdrawSolSchema, this))
    }
}

/**
 * Data for "InstructionTypes.ProcessFundToken"
 */
export class FundTokenData {
    constructor({ transferAmount }) {
        this.instruction = InstructionTypes.ProcessFundToken;
        // todo: validate
        this.transferAmount = transferAmount;
    }

    /**
     * Serialize the object to binary
     * @returns Buffer | UInt8Array  of this object
     */
    encode() {
        return Buffer.from(serialize(fundTokenSchema, this))
    }
}

/**
 * Data for "InstructionTypes.ProcessFundSol"
 */
export class FundSolData {
    constructor({ transferAmount }) {
        this.instruction = InstructionTypes.ProcessFundSol;
        // todo: validate
        this.transferAmount = transferAmount;
    }

    /**
     * Serialize the object to binary
     * @returns Buffer | UInt8Array  of this object
     */
    encode() {
        return Buffer.from(serialize(fundSolSchema, this))
    }
}
