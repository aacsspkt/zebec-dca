import {
    PublicKey,
    SystemProgram,
    TransactionInstruction,
} from "@solana/web3.js";
import {
    DCA_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    SYSVAR_RENT_PUBKEY,
    SERUM_PROGRAM_ID_V3,
    LIQUIDITY_PROGRAM_ID_V4
} from "./constants"
import {
    DepositSolData,
    DepositTokenData,
    FundSolData,
    FundTokenData,
    InitializeData,
    SwapFromSolData,
    SwapToSolData,
    WithdrawSolData,
    WithdrawTokenData
} from "./instructionData";
import BN, { isBN } from "bn.js";
import { AccountMetaBuilder } from "./utils";





/** 
 * The class to interact with DCA program
 */
export class DcaInstruction {

    /** 
     * Generate Transaction Instruction that deposit non native token to DCA vault
     * @param {PublicKey} ownerAddress The address of owner who deposits token
     * @param {PublicKey} vaultAddress The program derived address from seed of ownerAddress key bytes and dcaDataAddress key bytes
     * @param {PublicKey} mintAddress The address of token mint which is used in dca process     
     * @param {PublicKey} ownerAta The associated token address of ownerAddress
     * @param {PublicKey} vaultAta The assosciated token address of vaultAddress
     * @param {PublicKey} dcaDataAddress The address to store the dca data state
     * @param {BN} amount The amount of token to deposit
     */
    static depositToken(ownerAddress, vaultAddress, mintAddress, ownerAta, vaultAta, dcaDataAddress, amount) {
        try {
            if (!(ownerAddress instanceof PublicKey) &&
                !(vaultAddress instanceof PublicKey) &&
                !(mintAddress instanceof PublicKey) &&
                !(ownerAta instanceof PublicKey) &&
                !(vaultAta instanceof PublicKey) &&
                !(dcaDataAddress instanceof PublicKey) &&
                !(amount instanceof BN)) {
                throw new TypeError("Invalid argument type.")
            }

            const data = new DepositTokenData(amount).encode();

            return new TransactionInstruction({
                keys: [
                    AccountMetaBuilder.writable(ownerAddress, true),
                    AccountMetaBuilder.writable(vaultAddress, false),
                    AccountMetaBuilder.readonly(TOKEN_PROGRAM_ID, false),
                    AccountMetaBuilder.writable(mintAddress, false),
                    AccountMetaBuilder.readonly(SystemProgram.programId, false),
                    AccountMetaBuilder.readonly(SYSVAR_RENT_PUBKEY, false),
                    AccountMetaBuilder.writable(ownerAta, false),
                    AccountMetaBuilder.writable(vaultAta, false),
                    AccountMetaBuilder.readonly(ASSOCIATED_TOKEN_PROGRAM_ID, false),
                    AccountMetaBuilder.writable(dcaDataAddress, true),
                ],
                programId: DCA_PROGRAM_ID,
                data: data
            });
        } catch (e) {
            throw e;
        }
    }


    /**
     * Generate Transaction Instruction that deposit native token to DCA vault
     * @param {PublicKey} ownerAddress The address of owner who deposits token
     * @param {PublicKey} vaultAddress The program derived address from seed of ownerAddress key bytes and dcaDataAddress key bytes
     * @param {PublicKey} mintAddress The address of expected token mint after dca process
     * @param {PublicKey} ownerAta The associated token address of ownerAddress
     * @param {PublicKey} vaultAta The assosciated token address of vaultAddress
     * @param {PublicKey} dcaDataAddress The address to store the dca data state
     * @param {BN} amount The amount of sol to deposit
     */
    static depositSol(ownerAddress, vaultAddress, mintAddress, ownerAta, vaultAta, dcaDataAddress, amount) {
        try {
            if (!(ownerAddress instanceof PublicKey) &&
                !(vaultAddress instanceof PublicKey) &&
                !(mintAddress instanceof PublicKey) &&
                !(ownerAta instanceof PublicKey) &&
                !(vaultAta instanceof PublicKey) &&
                !(dcaDataAddress instanceof PublicKey) &&
                !isBN(amount)
            ) {
                throw new TypeError("Invalid argument type.")
            }

            const data = new DepositSolData(amount).encode();

            return new TransactionInstruction({
                keys: [
                    AccountMetaBuilder.writable(ownerAddress, true),
                    AccountMetaBuilder.writable(vaultAddress, false),
                    AccountMetaBuilder.readonly(TOKEN_PROGRAM_ID, false),
                    AccountMetaBuilder.writable(mintAddress, false),
                    AccountMetaBuilder.readonly(SystemProgram.programId, false),
                    AccountMetaBuilder.readonly(SYSVAR_RENT_PUBKEY, false),
                    AccountMetaBuilder.writable(ownerAta, false),
                    AccountMetaBuilder.writable(vaultAta, false),
                    AccountMetaBuilder.readonly(ASSOCIATED_TOKEN_PROGRAM_ID, false),
                    AccountMetaBuilder.writable(dcaDataAddress, true),
                ],
                programId: DCA_PROGRAM_ID,
                data: data
            });

        } catch (e) {
            throw e;
        }

    }

    /**
     * Generate Transaction Instruction that initialize DCA
     * @param {PublicKey} ownerAddress The address of owner who initialize dca
     * @param {PublicKey} vaultAddress The program derived address from seed of ownerAddress key bytes and dcaDataAddress key bytes
     * @param {PublicKey} dcaDataAddress The address to store the dca data state
     * @param {BN} startTime The unix timestamp from which the dca start
     * @param {BN} dcaAmount The amount for which dca is intialized
     * @param {BN} dcaTime // todo
     * @param {BN} minimumAmountOut // todo
     * @returns TransactionInstruction
     */
    static initialize(ownerAddress, vaultAddress, dcaDataAddress, startTime, dcaAmount, dcaTime, minimumAmountOut) {
        try {
            if (!(ownerAddress instanceof PublicKey) &&
                !(vaultAddress instanceof PublicKey) &&
                !(dcaDataAddress instanceof PublicKey) &&
                !isBN(startTime) &&
                !isBN(dcaAmount) &&
                !isBN(dcaTime) &&
                !isBN(minimumAmountOut)
            ) {
                throw new TypeError("Invalid argument type.")
            }

            const data = new InitializeData(
                startTime,
                dcaAmount,
                dcaTime,
                minimumAmountOut
            ).encode();

            return new TransactionInstruction({
                keys: [
                    AccountMetaBuilder.writable(ownerAddress, true),
                    AccountMetaBuilder.writable(vaultAddress, false),
                    AccountMetaBuilder.writable(dcaDataAddress, false),
                ],
                programId: DCA_PROGRAM_ID,
                data: data
            })
        } catch (e) {
            throw e;
        }
    }

    /**
     * Generate Transaction Instruction that withdraws non-native token from DCA vault
     * @param {PublicKey} ownerAddress The address of owner who withdraws token
     * @param {PublicKey} vaultAddress The program derived address from seed of ownerAddress key bytes and dcaDataAddress key bytes
     * @param {PublicKey} mintAddress The address of token mint
     * @param {PublicKey} ownerAta The associated token address of ownerAddress
     * @param {PublicKey} vaultAta The assosciated token address of vaultAddress
     * @param {PublicKey} dcaDataAddress The address to store the dca data state
     * @param {BN} transferAmount The amount to withdraw
     */
    static withdrawToken(ownerAddress, vaultAddress, mintAddress, ownerAta, vaultAta, dcaDataAddress, transferAmount) {
        try {
            if (!(ownerAddress instanceof PublicKey) &&
                !(vaultAddress instanceof PublicKey) &&
                !(mintAddress instanceof PublicKey) &&
                !(ownerAta instanceof PublicKey) &&
                !(vaultAta instanceof PublicKey) &&
                !(dcaDataAddress instanceof PublicKey) &&
                !isBN(transferAmount)) {
                throw new TypeError("Invalid argument type.")
            }

            const data = new WithdrawTokenData(transferAmount).encode();

            return new TransactionInstruction({
                keys: [
                    AccountMetaBuilder.writable(ownerAddress, true),
                    AccountMetaBuilder.writable(vaultAddress, false),
                    AccountMetaBuilder.readonly(TOKEN_PROGRAM_ID, false),
                    AccountMetaBuilder.writable(mintAddress, false),
                    AccountMetaBuilder.readonly(SystemProgram.programId, false),
                    AccountMetaBuilder.readonly(SYSVAR_RENT_PUBKEY, false),
                    AccountMetaBuilder.writable(ownerAta, false),
                    AccountMetaBuilder.writable(vaultAta, false),
                    AccountMetaBuilder.readonly(ASSOCIATED_TOKEN_PROGRAM_ID, false),
                    AccountMetaBuilder.writable(dcaDataAddress, true),
                ],
                programId: DCA_PROGRAM_ID,
                data: data
            })
        } catch (e) {
            throw e;
        }
    }

    /**
     * Generate Transaction Instruction that withdraws native token from DCA vault
     * @param {PublicKey} ownerAddress The address of owner who withdraws token
     * @param {PublicKey} vaultAddress The program derived address from seed of ownerAddress key bytes and dcaDataAddress key bytes
     * @param {PublicKey} mintAddress The address of token mint
     * @param {PublicKey} ownerAta The associated token address of ownerAddress
     * @param {PublicKey} vaultAta The assosciated token address of vaultAddress
     * @param {PublicKey} dcaDataAddress The address to store the dca data state
     * @param {BN} transferAmount The amount to withdraw
     */
    static withdrawSol(ownerAddress, vaultAddress, mintAddress, ownerAta, vaultAta, dcaDataAddress, transferAmount) {
        try {
            if (!(ownerAddress instanceof PublicKey) &&
                !(vaultAddress instanceof PublicKey) &&
                !(mintAddress instanceof PublicKey) &&
                !(ownerAta instanceof PublicKey) &&
                !(vaultAta instanceof PublicKey) &&
                !(dcaDataAddress instanceof PublicKey) &&
                !isBN(transferAmount)
            ) {
                throw new TypeError("Invalid argument type.")
            }

            const data = new WithdrawSolData(transferAmount).encode();

            return new TransactionInstruction({
                keys: [
                    AccountMetaBuilder.writable(ownerAddress, true),
                    AccountMetaBuilder.writable(vaultAddress, false),
                    AccountMetaBuilder.readonly(TOKEN_PROGRAM_ID, false),
                    AccountMetaBuilder.writable(mintAddress, false),
                    AccountMetaBuilder.readonly(SystemProgram.programId, false),
                    AccountMetaBuilder.readonly(SYSVAR_RENT_PUBKEY, false),
                    AccountMetaBuilder.writable(ownerAta, false),
                    AccountMetaBuilder.writable(vaultAta, false),
                    AccountMetaBuilder.readonly(ASSOCIATED_TOKEN_PROGRAM_ID, false),
                    AccountMetaBuilder.writable(dcaDataAddress, true),
                ],
                programId: DCA_PROGRAM_ID,
                data: data
            })
        } catch (e) {
            throw e;
        }
    }


    /**
     * Generate Transaction Instruction that // todo
     * @param {PublicKey} ownerAddress The address of owner who withdraws token
     * @param {PublicKey} vaultAddress The program derived address from seed of ownerAddress key bytes and dcaDataAddress key bytes
     * @param {PublicKey} mintAddress The address of token mint
     * @param {PublicKey} ownerAta The associated token address of ownerAddress
     * @param {PublicKey} vaultAta The assosciated token address of vaultAddress
     * @param {PublicKey} dcaDataAddress The address to store the dca data state
     * @param {BN} transferAmount The amount to withdraw
     */
    static fundToken(ownerAddress, vaultAddress, mintAddress, ownerAta, vaultAta, dcaDataAddress, transferAmount) {
        try {
            if (!(ownerAddress instanceof PublicKey) &&
                !(vaultAddress instanceof PublicKey) &&
                !(mintAddress instanceof PublicKey) &&
                !(ownerAta instanceof PublicKey) &&
                !(vaultAta instanceof PublicKey) &&
                !(dcaDataAddress instanceof PublicKey) &&
                !isBN(transferAmount)) {
                throw new TypeError("Invalid argument type.")
            }

            const data = new FundTokenData(transferAmount).encode();

            return new TransactionInstruction({
                keys: [
                    AccountMetaBuilder.writable(ownerAddress, true),
                    AccountMetaBuilder.writable(vaultAddress, false),
                    AccountMetaBuilder.readonly(TOKEN_PROGRAM_ID, false),
                    AccountMetaBuilder.writable(mintAddress, false),
                    AccountMetaBuilder.readonly(SystemProgram.programId, false),
                    AccountMetaBuilder.readonly(SYSVAR_RENT_PUBKEY, false),
                    AccountMetaBuilder.writable(ownerAta, false),
                    AccountMetaBuilder.writable(vaultAta, false),
                    AccountMetaBuilder.readonly(ASSOCIATED_TOKEN_PROGRAM_ID, false),
                    AccountMetaBuilder.writable(dcaDataAddress, false),
                ],
                programId: DCA_PROGRAM_ID,
                data: data
            })
        } catch (e) {
            throw e;
        }
    }

    /**
     * Generate Transaction Instruction that // todo
     * @param {PublicKey} ownerAddress The address of owner who withdraws token
     * @param {PublicKey} vaultAddress The program derived address from seed of ownerAddress key bytes and dcaDataAddress key bytes
     * @param {PublicKey} mintAddress The address of token mint
     * @param {PublicKey} ownerAta The associated token address of ownerAddress
     * @param {PublicKey} vaultAta The assosciated token address of vaultAddress
     * @param {PublicKey} dcaDataAddress The address to store the dca data state
     * @param {BN} transferAmount The amount to withdraw
     */
    static fundSol(ownerAddress, vaultAddress, mintAddress, ownerAta, vaultAta, dcaDataAddress, transferAmount) {
        try {
            if (!(ownerAddress instanceof PublicKey) &&
                !(vaultAddress instanceof PublicKey) &&
                !(mintAddress instanceof PublicKey) &&
                !(ownerAta instanceof PublicKey) &&
                !(vaultAta instanceof PublicKey) &&
                !(dcaDataAddress instanceof PublicKey) &&
                !isBN(transferAmount)) {
                throw new TypeError("Invalid argument type.")
            }

            const data = new FundSolData(transferAmount).encode();

            return new TransactionInstruction({
                keys: [
                    AccountMetaBuilder.writable(ownerAddress, true),
                    AccountMetaBuilder.writable(vaultAddress, false),
                    AccountMetaBuilder.readonly(TOKEN_PROGRAM_ID, false),
                    AccountMetaBuilder.writable(mintAddress, false),
                    AccountMetaBuilder.readonly(SystemProgram.programId, false),
                    AccountMetaBuilder.readonly(SYSVAR_RENT_PUBKEY, false),
                    AccountMetaBuilder.writable(ownerAta, false),
                    AccountMetaBuilder.writable(vaultAta, false),
                    AccountMetaBuilder.readonly(ASSOCIATED_TOKEN_PROGRAM_ID, false),
                    AccountMetaBuilder.writable(dcaDataAddress, false),
                ],
                programId: DCA_PROGRAM_ID,
                data: data
            })
        } catch (e) {
            throw e;
        }
    }

    /**
     * Generate Transaction Instruction that swap token from sol
     * @param {PublicKey} ammAddress
     * @param {PublicKey} ammAuthorityAddress
     * @param {PublicKey} ammOpenOrderAddress
     * @param {PublicKey} ammTargetOrderAddress
     * @param {PublicKey} poolCoinTokenAddress
     * @param {PublicKey} poolPcTokenAddress
     * @param {PublicKey} serumMarketAddress
     * @param {PublicKey} serumBidsAddress
     * @param {PublicKey} serumAskAddress
     * @param {PublicKey} serumEventQueueAddress
     * @param {PublicKey} serumCoinVaultAddress
     * @param {PublicKey} serumPcVaultAddress
     * @param {PublicKey} serumVaultSigner
     * @param {PublicKey} vaultAddress
     * @param {PublicKey} destinationTokenAddress
     * @param {PublicKey} mintAddress
     * @param {PublicKey} ownerAddress
     * @param {PublicKey} dcaDataAddress
     */
    static swapFromSol(
        ammAddress,
        ammAuthorityAddress,
        ammOpenOrderAddress,
        ammTargetOrderAddress,
        poolCoinTokenAddress,
        poolPcTokenAddress,
        serumMarketAddress,
        serumBidsAddress,
        serumAskAddress,
        serumEventQueueAddress,
        serumCoinVaultAddress,
        serumPcVaultAddress,
        serumVaultSigner,
        vaultAddress,
        destinationTokenAddress,
        mintAddress,
        ownerAddress,
        dcaDataAddress
    ) {
        if (
            !(ammAddress instanceof PublicKey) &&
            !(ammAuthorityAddress instanceof PublicKey) &&
            !(ammOpenOrderAddress instanceof PublicKey) &&
            !(ammTargetOrderAddress instanceof PublicKey) &&
            !(poolCoinTokenAddress instanceof PublicKey) &&
            !(poolPcTokenAddress instanceof PublicKey) &&
            !(serumMarketAddress instanceof PublicKey) &&
            !(serumBidsAddress instanceof PublicKey) &&
            !(serumAskAddress instanceof PublicKey) &&
            !(serumEventQueueAddress instanceof PublicKey) &&
            !(serumCoinVaultAddress instanceof PublicKey) &&
            !(serumPcVaultAddress instanceof PublicKey) &&
            !(serumVaultSigner instanceof PublicKey) &&
            !(vaultAddress instanceof PublicKey) &&
            !(destinationTokenAddress instanceof PublicKey) &&
            !(mintAddress instanceof PublicKey) &&
            !(ownerAddress instanceof PublicKey) &&
            !(dcaDataAddress instanceof PublicKey)
        ) {
            throw new TypeError("Invalid argument type.")
        }

        const data = new SwapFromSolData().encode();

        return new TransactionInstruction({
            keys: [
                AccountMetaBuilder.readonly(LIQUIDITY_PROGRAM_ID_V4, false),
                AccountMetaBuilder.writable(ammAddress, false),
                AccountMetaBuilder.readonly(ammAuthorityAddress, false),
                AccountMetaBuilder.writable(ammOpenOrderAddress, false),
                AccountMetaBuilder.writable(ammTargetOrderAddress, false),
                AccountMetaBuilder.writable(poolCoinTokenAddress, false),
                AccountMetaBuilder.writable(poolPcTokenAddress, false),
                AccountMetaBuilder.readonly(SERUM_PROGRAM_ID_V3, false),
                AccountMetaBuilder.writable(serumMarketAddress, false),
                AccountMetaBuilder.writable(serumBidsAddress, false),
                AccountMetaBuilder.writable(serumAskAddress, false),
                AccountMetaBuilder.writable(serumEventQueueAddress, false),
                AccountMetaBuilder.writable(serumCoinVaultAddress, false),
                AccountMetaBuilder.writable(serumPcVaultAddress, false),
                AccountMetaBuilder.readonly(serumVaultSigner, false),
                AccountMetaBuilder.writable(vaultAddress, false),
                AccountMetaBuilder.writable(destinationTokenAddress, false),
                AccountMetaBuilder.readonly(mintAddress, false),
                AccountMetaBuilder.writable(ownerAddress, false),
                AccountMetaBuilder.writable(dcaDataAddress, false),
            ],
            programId: DCA_PROGRAM_ID,
            data: data
        });
    }


    /**
     * Generate Transaction Instruction that swap token to sol
     * @param {PublicKey} ammAddress
     * @param {PublicKey} ammAuthorityAddress
     * @param {PublicKey} ammOpenOrderAddress
     * @param {PublicKey} ammTargetOrderAddress
     * @param {PublicKey} poolCoinTokenAddress
     * @param {PublicKey} poolPcTokenAddress
     * @param {PublicKey} serumMarketAddress
     * @param {PublicKey} serumBidsAddress
     * @param {PublicKey} serumAskAddress
     * @param {PublicKey} serumEventQueueAddress
     * @param {PublicKey} serumCoinVaultAddress
     * @param {PublicKey} serumPcVaultAddress
     * @param {PublicKey} serumVaultSigner
     * @param {PublicKey} sourceTokenAddress
     * @param {PublicKey} vaultAddress
     * @param {PublicKey} mintAddress
     * @param {PublicKey} ownerAddress
     * @param {PublicKey} dcaDataAddress
     */
    static swapToSol(
        ammAddress,
        ammAuthorityAddress,
        ammOpenOrderAddress,
        ammTargetOrderAddress,
        poolCoinTokenAddress,
        poolPcTokenAddress,
        serumMarketAddress,
        serumBidsAddress,
        serumAskAddress,
        serumEventQueueAddress,
        serumCoinVaultAddress,
        serumPcVaultAddress,
        serumVaultSigner,
        sourceTokenAddress,
        vaultAddress,
        mintAddress,
        ownerAddress,
        dcaDataAddress,
    ) {
        if (
            !(ammAddress instanceof PublicKey) &&
            !(ammAuthorityAddress instanceof PublicKey) &&
            !(ammOpenOrderAddress instanceof PublicKey) &&
            !(ammTargetOrderAddress instanceof PublicKey) &&
            !(poolCoinTokenAddress instanceof PublicKey) &&
            !(poolPcTokenAddress instanceof PublicKey) &&
            !(serumMarketAddress instanceof PublicKey) &&
            !(serumBidsAddress instanceof PublicKey) &&
            !(serumAskAddress instanceof PublicKey) &&
            !(serumEventQueueAddress instanceof PublicKey) &&
            !(serumCoinVaultAddress instanceof PublicKey) &&
            !(serumPcVaultAddress instanceof PublicKey) &&
            !(serumVaultSigner instanceof PublicKey) &&
            !(sourceTokenAddress instanceof PublicKey) &&
            !(vaultAddress instanceof PublicKey) &&
            !(mintAddress instanceof PublicKey) &&
            !(ownerAddress instanceof PublicKey) &&
            !(dcaDataAddress instanceof PublicKey)
        ) {
            throw new TypeError("Invalid argument type.")
        }

        const data = new SwapToSolData().encode();

        return new TransactionInstruction({
            keys: [
                AccountMetaBuilder.readonly(LIQUIDITY_PROGRAM_ID_V4, false),
                AccountMetaBuilder.writable(ammAddress, false),
                AccountMetaBuilder.readonly(ammAuthorityAddress, false),
                AccountMetaBuilder.writable(ammOpenOrderAddress, false),
                AccountMetaBuilder.writable(ammTargetOrderAddress, false),
                AccountMetaBuilder.writable(poolCoinTokenAddress, false),
                AccountMetaBuilder.writable(poolPcTokenAddress, false),
                AccountMetaBuilder.readonly(SERUM_PROGRAM_ID_V3, false),
                AccountMetaBuilder.writable(serumMarketAddress, false),
                AccountMetaBuilder.writable(serumBidsAddress, false),
                AccountMetaBuilder.writable(serumAskAddress, false),
                AccountMetaBuilder.writable(serumEventQueueAddress, false),
                AccountMetaBuilder.writable(serumCoinVaultAddress, false),
                AccountMetaBuilder.writable(serumPcVaultAddress, false),
                AccountMetaBuilder.readonly(serumVaultSigner, false),
                AccountMetaBuilder.writable(sourceTokenAddress, false),
                AccountMetaBuilder.writable(vaultAddress, false),
                AccountMetaBuilder.readonly(mintAddress, false),
                AccountMetaBuilder.writable(ownerAddress, false),
                AccountMetaBuilder.writable(dcaDataAddress, false),
            ],
            programId: DCA_PROGRAM_ID,
            data: data
        });
    }
} 