import { serialize, } from "borsh";

/** 
 * Data for "InstructionTypes.ProcessDepositToken"
 */
export class DepositTokenData {
    constructor(amount) {
        this.instruction = 0;
        this.amount = amount;
    }


    /**
     * Serialize the object to binary
     * @returns Buffer | UInt8Array  of this object
     */
    encode() {
        return Buffer.from(serialize(depositTokenSchema, this));
    }
}

/**
 *  Data for "InstructionTypes.ProcessDepositSol"
 */
export class DepositSolData {
    constructor(amount) {
        this.instruction = 1;
        this.amount = amount;
    }

    /**
     * Serialize the object to binary
     * @returns Buffer | UInt8Array  of this object
     */
    encode() {
        return Buffer.from(serialize(depositSolSchema, this));
    }
}

/**
 * Data for "InstructionTypes.ProcessInitialize"
 */
export class InitializeData {
    constructor(startTime, dcaAmount, dcaTime, minimumAmountOut) {
        this.instruction = 2;
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
 * Data for "InstructionTypes.ProcessSwapToSol"
 */
export class SwapToSolData {
    constructor() {
        this.instruction = 3;
    }

    /**
     * Serialize the object to binary
     * @returns Buffer | UInt8Array  of this object
     */
    encode() {
        return Buffer.from(serialize(swapToSolSchema, this))
    }
}

/**
 * Data for "IntructionTypes.ProcessSwapFromSol"
 */
export class SwapFromSolData {
    constructor() {
        this.instruction = 4;
    }

    /**
     * Serialize the object to binary
     * @returns Buffer | UInt8Array  of this object
     */
    encode() {
        return Buffer.from(serialize(swapFromSolSchema, this))
    }
}

/**
 * Data for "InstructionTypes.ProcessWithdrawToken"
 */
export class WithdrawTokenData {
    constructor(transferAmount) {
        this.instruction = 5;
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
    constructor(transferAmount) {
        this.instruction = 6;
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
    constructor(transferAmount) {
        this.instruction = 7;
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
    constructor(transferAmount) {
        this.instruction = 8;
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


export const initializeSchema = new Map([
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


export const depositSolSchema = new Map([
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


export const swapToSolSchema = new Map([
    [
        SwapToSolData,
        {
            kind: "struct",
            fields: [
                ["instruction", "u8"]
            ]
        }
    ]
]);


export const swapFromSolSchema = new Map([
    [
        SwapFromSolData,
        {
            kind: "struct",
            fields: [
                ["instruction", "u8"]
            ]
        }
    ]
]);


export const withdrawTokenSchema = new Map([
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


export const withdrawSolSchema = new Map([
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


export const fundTokenSchema = new Map([
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


export const fundSolSchema = new Map([
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