import {
    PublicKey,
    SystemProgram,
    TransactionInstruction,
} from "@solana/web3.js";
import {
    DcaProgramId,
    TokenProgramId,
    AssociatedTokenProgramId,
    SysvarRent,
    DevnetLiquidityProgramIdV4,
    DevnetSerumProgramIdV3,
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
     * @param {PublicKey} mintAddress The address of base token mint      
     * @param {PublicKey} nativeMintAddress The address of quote native mint     
     * @param {PublicKey} ownerTokenAddress The associated token address of owner
     * @param {PublicKey} vaultTokenAddress The assosciated token address of vault
     * @param {PublicKey} vaultNativeMintAddress The assosciated native mint address of vault
     * @param {PublicKey} dcaDataAddress The address to store the dca data state
     * @param {BN} amount The amount of token to deposit
     */
    static depositToken(
        ownerAddress,
        vaultAddress,
        mintAddress,
        nativeMintAddress,
        ownerTokenAddress,
        vaultTokenAddress,
        vaultNativeMintAddress,
        dcaDataAddress,
        amount
    ) {
        try {
            if (!(ownerAddress instanceof PublicKey) &&
                !(vaultAddress instanceof PublicKey) &&
                !(mintAddress instanceof PublicKey) &&
                !(nativeMintAddress instanceof PublicKey) &&
                !(ownerTokenAddress instanceof PublicKey) &&
                !(vaultTokenAddress instanceof PublicKey) &&
                !(vaultNativeMintAddress instanceof PublicKey) &&
                !(dcaDataAddress instanceof PublicKey) &&
                !(amount instanceof BN)) {
                throw new TypeError("Invalid argument type.")
            }

            const data = new DepositTokenData(amount).encode();

            return new TransactionInstruction({
                keys: [
                    AccountMetaBuilder.writable(ownerAddress, true),
                    AccountMetaBuilder.writable(vaultAddress, false),
                    AccountMetaBuilder.readonly(TokenProgramId, false),
                    AccountMetaBuilder.writable(mintAddress, false),
                    AccountMetaBuilder.writable(nativeMintAddress, false),
                    AccountMetaBuilder.readonly(SystemProgram.programId, false),
                    AccountMetaBuilder.readonly(SysvarRent, false),
                    AccountMetaBuilder.writable(ownerTokenAddress, false),
                    AccountMetaBuilder.writable(vaultTokenAddress, false),
                    AccountMetaBuilder.writable(vaultNativeMintAddress, false),
                    AccountMetaBuilder.readonly(AssociatedTokenProgramId, false),
                    AccountMetaBuilder.writable(dcaDataAddress, true),
                ],
                programId: DcaProgramId,
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
     * @param {PublicKey} mintAddress The address of quote token mint     
     * @param {PublicKey} nativeMintAddress The address of base native mint     
     * @param {PublicKey} ownerTokenAddress The associated token address of owner
     * @param {PublicKey} vaultNativeMintAddress The assosciated native mint address of vault
     * @param {PublicKey} vaultTokenAddress The assosciated token address of vault
     * @param {PublicKey} dcaDataAddress The address to store the dca data state
     * @param {BN} amount The amount of sol to deposit
     */
    static depositSol(
        ownerAddress,
        vaultAddress,
        mintAddress,
        nativeMintAddress,
        ownerTokenAddress,
        vaultNativeMintAddress,
        vaultTokenAddress,
        dcaDataAddress,
        amount
    ) {
        try {
            if (!(ownerAddress instanceof PublicKey) &&
                !(vaultAddress instanceof PublicKey) &&
                !(mintAddress instanceof PublicKey) &&
                !(nativeMintAddress instanceof PublicKey) &&
                !(ownerTokenAddress instanceof PublicKey) &&
                !(vaultNativeMintAddress instanceof PublicKey) &&
                !(vaultTokenAddress instanceof PublicKey) &&
                !(dcaDataAddress instanceof PublicKey) &&
                !(amount instanceof BN)
            ) {
                throw new TypeError("Invalid argument type.")
            }

            const data = new DepositSolData(amount).encode();

            return new TransactionInstruction({
                keys: [
                    AccountMetaBuilder.writable(ownerAddress, true),
                    AccountMetaBuilder.writable(vaultAddress, false),
                    AccountMetaBuilder.readonly(TokenProgramId, false),
                    AccountMetaBuilder.writable(mintAddress, false),
                    AccountMetaBuilder.writable(nativeMintAddress, false),
                    AccountMetaBuilder.readonly(SystemProgram.programId, false),
                    AccountMetaBuilder.readonly(SysvarRent, false),
                    AccountMetaBuilder.writable(ownerTokenAddress, false),
                    AccountMetaBuilder.writable(vaultNativeMintAddress, false),
                    AccountMetaBuilder.writable(vaultTokenAddress, false),
                    AccountMetaBuilder.readonly(AssociatedTokenProgramId, false),
                    AccountMetaBuilder.writable(dcaDataAddress, true),
                ],
                programId: DcaProgramId,
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
                programId: DcaProgramId,
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
     * @param {PublicKey} mintAddress The address of quote token mint
     * @param {PublicKey} ownerTokenAddress The associated token address of owner
     * @param {PublicKey} vaultTokenAddress The assosciated token address of vault
     * @param {PublicKey} dcaDataAddress The address to store the dca data state
     * @param {BN} transferAmount The amount to withdraw
     */
    static withdrawToken(ownerAddress, vaultAddress, mintAddress, ownerTokenAddress, vaultTokenAddress, dcaDataAddress, transferAmount) {
        try {
            if (!(ownerAddress instanceof PublicKey) &&
                !(vaultAddress instanceof PublicKey) &&
                !(mintAddress instanceof PublicKey) &&
                !(ownerTokenAddress instanceof PublicKey) &&
                !(vaultTokenAddress instanceof PublicKey) &&
                !(dcaDataAddress instanceof PublicKey) &&
                !isBN(transferAmount)) {
                throw new TypeError("Invalid argument type.")
            }

            const data = new WithdrawTokenData(transferAmount).encode();

            return new TransactionInstruction({
                keys: [
                    AccountMetaBuilder.writable(ownerAddress, true),
                    AccountMetaBuilder.writable(vaultAddress, false),
                    AccountMetaBuilder.readonly(TokenProgramId, false),
                    AccountMetaBuilder.writable(mintAddress, false),
                    AccountMetaBuilder.readonly(SystemProgram.programId, false),
                    AccountMetaBuilder.readonly(SysvarRent, false),
                    AccountMetaBuilder.writable(ownerTokenAddress, false),
                    AccountMetaBuilder.writable(vaultTokenAddress, false),
                    AccountMetaBuilder.readonly(AssociatedTokenProgramId, false),
                    AccountMetaBuilder.writable(dcaDataAddress, true),
                ],
                programId: DcaProgramId,
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
     * @param {PublicKey} mintAddress The address of base token mint
     * @param {PublicKey} ownerTokenAddress The associated token address of owner
     * @param {PublicKey} vaultTokenAddress The assosciated token address of vault
     * @param {PublicKey} dcaDataAddress The address to store the dca data state
     * @param {PublicKey} nativeMintAddress The address of base token mint
     * @param {PublicKey} vaultNativeMintAddress The assosciated native mint address of vault
     * @param {PublicKey} ownerNativeMintAddress The assosciated native mint address of owner
     * @param {BN} transferAmount The amount to withdraw
     */
    static withdrawSol(
        ownerAddress,
        vaultAddress,
        mintAddress,
        ownerTokenAddress,
        vaultTokenAddress,
        dcaDataAddress,
        nativeMintAddress,
        vaultNativeMintAddress,
        ownerNativeMintAddress,
        transferAmount
    ) {
        try {
            if (!(ownerAddress instanceof PublicKey) &&
                !(vaultAddress instanceof PublicKey) &&
                !(mintAddress instanceof PublicKey) &&
                !(ownerTokenAddress instanceof PublicKey) &&
                !(vaultTokenAddress instanceof PublicKey) &&
                !(dcaDataAddress instanceof PublicKey) &&
                !(nativeMintAddress instanceof PublicKey) &&
                !(vaultNativeMintAddress instanceof PublicKey) &&
                !(ownerNativeMintAddress instanceof PublicKey) &&
                !isBN(transferAmount)
            ) {
                throw new TypeError("Invalid argument type.")
            }

            const data = new WithdrawSolData(transferAmount).encode();

            return new TransactionInstruction({
                keys: [
                    AccountMetaBuilder.writable(ownerAddress, true),
                    AccountMetaBuilder.writable(vaultAddress, false),
                    AccountMetaBuilder.readonly(TokenProgramId, false),
                    AccountMetaBuilder.writable(mintAddress, false),
                    AccountMetaBuilder.readonly(SystemProgram.programId, false),
                    AccountMetaBuilder.readonly(SysvarRent, false),
                    AccountMetaBuilder.writable(ownerTokenAddress, false),
                    AccountMetaBuilder.writable(vaultTokenAddress, false),
                    AccountMetaBuilder.readonly(AssociatedTokenProgramId, false),
                    AccountMetaBuilder.writable(dcaDataAddress, true),
                    AccountMetaBuilder.writable(nativeMintAddress, true),
                    AccountMetaBuilder.writable(vaultNativeMintAddress, true),
                    AccountMetaBuilder.writable(ownerNativeMintAddress, true),
                ],
                programId: DcaProgramId,
                data: data
            })
        } catch (e) {
            throw e;
        }
    }


    /**
     * Generate transaction instruction that fund token in initialized dca address
     * @param {PublicKey} ownerAddress The address of owner who withdraws token
     * @param {PublicKey} vaultAddress The program derived address from seed of ownerAddress key bytes and dcaDataAddress key bytes
     * @param {PublicKey} mintAddress The address of base token mint
     * @param {PublicKey} ownerTokenAddress The associated token address of owner
     * @param {PublicKey} vaultTokenAddress The assosciated token address of vault
     * @param {PublicKey} dcaDataAddress The address to store the dca data state
     * @param {BN} transferAmount The amount of token to fund
     */
    static fundToken(ownerAddress, vaultAddress, mintAddress, ownerTokenAddress, vaultTokenAddress, dcaDataAddress, transferAmount) {
        try {
            if (!(ownerAddress instanceof PublicKey) &&
                !(vaultAddress instanceof PublicKey) &&
                !(mintAddress instanceof PublicKey) &&
                !(ownerTokenAddress instanceof PublicKey) &&
                !(vaultTokenAddress instanceof PublicKey) &&
                !(dcaDataAddress instanceof PublicKey) &&
                !isBN(transferAmount)) {
                throw new TypeError("Invalid argument type.")
            }

            const data = new FundTokenData(transferAmount).encode();

            return new TransactionInstruction({
                keys: [
                    AccountMetaBuilder.writable(ownerAddress, true),
                    AccountMetaBuilder.writable(vaultAddress, false),
                    AccountMetaBuilder.readonly(TokenProgramId, false),
                    AccountMetaBuilder.writable(mintAddress, false),
                    AccountMetaBuilder.readonly(SystemProgram.programId, false),
                    AccountMetaBuilder.readonly(SysvarRent, false),
                    AccountMetaBuilder.writable(ownerTokenAddress, false),
                    AccountMetaBuilder.writable(vaultTokenAddress, false),
                    AccountMetaBuilder.readonly(AssociatedTokenProgramId, false),
                    AccountMetaBuilder.writable(dcaDataAddress, false),
                ],
                programId: DcaProgramId,
                data: data
            })
        } catch (e) {
            throw e;
        }
    }

    /**
     * Generate transaction instruction that sol to intialized dca process
     * @param {PublicKey} ownerAddress The address of owner who withdraws token
     * @param {PublicKey} vaultAddress The program derived address from seed of ownerAddress key bytes and dcaDataAddress key bytes
     * @param {PublicKey} mintAddress The address of quote token mint
     * @param {PublicKey} nativeMintAddress The address of base native mint
     * @param {PublicKey} ownerTokenAddress The associated token address of owner
     * @param {PublicKey} vaultNativeMintAddress The associated token address of owner
     * @param {PublicKey} vaultTokenAddress The assosciated token address of vault
     * @param {PublicKey} dcaDataAddress The address to store the dca data state
     * @param {BN} transferAmount The amount sol to fund
     */
    static fundSol(
        ownerAddress,
        vaultAddress,
        mintAddress,
        nativeMintAddress,
        ownerTokenAddress,
        vaultNativeMintAddress,
        vaultTokenAddress,
        dcaDataAddress,
        transferAmount
    ) {
        try {
            if (!(ownerAddress instanceof PublicKey) &&
                !(vaultAddress instanceof PublicKey) &&
                !(mintAddress instanceof PublicKey) &&
                !(nativeMintAddress instanceof PublicKey) &&
                !(ownerTokenAddress instanceof PublicKey) &&
                !(vaultNativeMintAddress instanceof PublicKey) &&
                !(vaultTokenAddress instanceof PublicKey) &&
                !(dcaDataAddress instanceof PublicKey) &&
                !isBN(transferAmount)) {
                throw new TypeError("Invalid argument type.")
            }

            const data = new FundSolData(transferAmount).encode();

            return new TransactionInstruction({
                keys: [
                    AccountMetaBuilder.writable(ownerAddress, true),
                    AccountMetaBuilder.writable(vaultAddress, false),
                    AccountMetaBuilder.readonly(TokenProgramId, false),
                    AccountMetaBuilder.writable(mintAddress, false),
                    AccountMetaBuilder.writable(nativeMintAddress, false),
                    AccountMetaBuilder.readonly(SystemProgram.programId, false),
                    AccountMetaBuilder.readonly(SysvarRent, false),
                    AccountMetaBuilder.writable(ownerTokenAddress, false),
                    AccountMetaBuilder.writable(vaultNativeMintAddress, false),
                    AccountMetaBuilder.writable(vaultTokenAddress, false),
                    AccountMetaBuilder.readonly(AssociatedTokenProgramId, false),
                    AccountMetaBuilder.writable(dcaDataAddress, false),
                ],
                programId: DcaProgramId,
                data: data
            })
        } catch (e) {
            throw e;
        }
    }

    /**
     * Generate transaction instruction that swap token from sol
     * @param {PublicKey} liquidityProgramId
     * @param {PublicKey} ammAddress
     * @param {PublicKey} ammAuthorityAddress
     * @param {PublicKey} ammOpenOrderAddress
     * @param {PublicKey} ammTargetOrderAddress
     * @param {PublicKey} poolCoinTokenAddress
     * @param {PublicKey} poolPcTokenAddress
     * @param {PublicKey} serumMarketProgramId
     * @param {PublicKey} serumMarketAddress
     * @param {PublicKey} serumBidsAddress
     * @param {PublicKey} serumAskAddress
     * @param {PublicKey} serumEventQueueAddress
     * @param {PublicKey} serumCoinVaultAddress
     * @param {PublicKey} serumPcVaultAddress
     * @param {PublicKey} serumVaultSigner
     * @param {PublicKey} vaultAddress
     * @param {PublicKey} vaultNativeAddress
     * @param {PublicKey} vaultTokenAddress
     * @param {PublicKey} mintAddress
     * @param {PublicKey} ownerAddress
     * @param {PublicKey} dcaDataAddress
     */
    static swapFromSol(
        liquidityProgramId,
        ammAddress,
        ammAuthorityAddress,
        ammOpenOrderAddress,
        ammTargetOrderAddress,
        poolCoinTokenAddress,
        poolPcTokenAddress,
        serumMarketProgramId,
        serumMarketAddress,
        serumBidsAddress,
        serumAskAddress,
        serumEventQueueAddress,
        serumCoinVaultAddress,
        serumPcVaultAddress,
        serumVaultSigner,
        vaultAddress,
        vaultNativeMintAddress,
        vaultTokenAddress,
        mintAddress,
        ownerAddress,
        dcaDataAddress,
        nativeMintAddress
    ) {
        if (
            !(liquidityProgramId instanceof PublicKey) &&
            !(ammAddress instanceof PublicKey) &&
            !(ammAuthorityAddress instanceof PublicKey) &&
            !(ammOpenOrderAddress instanceof PublicKey) &&
            !(ammTargetOrderAddress instanceof PublicKey) &&
            !(poolCoinTokenAddress instanceof PublicKey) &&
            !(poolPcTokenAddress instanceof PublicKey) &&
            !(serumMarketProgramId instanceof PublicKey) &&
            !(serumMarketAddress instanceof PublicKey) &&
            !(serumBidsAddress instanceof PublicKey) &&
            !(serumAskAddress instanceof PublicKey) &&
            !(serumEventQueueAddress instanceof PublicKey) &&
            !(serumCoinVaultAddress instanceof PublicKey) &&
            !(serumPcVaultAddress instanceof PublicKey) &&
            !(serumVaultSigner instanceof PublicKey) &&
            !(vaultAddress instanceof PublicKey) &&
            !(vaultNativeMintAddress instanceof PublicKey) &&
            !(vaultTokenAddress instanceof PublicKey) &&
            !(mintAddress instanceof PublicKey) &&
            !(ownerAddress instanceof PublicKey) &&
            !(dcaDataAddress instanceof PublicKey) &&
            !(nativeMintAddress instanceof PublicKey)
        ) {
            throw new TypeError("Invalid argument type.")
        }

        console.log("liquidityProgramId: ", liquidityProgramId.toString())
        console.log("ammAddress ", ammAddress.toString())
        console.log("ammAuthorityAddress: ", ammAuthorityAddress.toString())
        console.log("ammOpenOrderAddress: ", ammOpenOrderAddress.toString())
        console.log("ammTargetOrderAddress: ", ammTargetOrderAddress.toString())
        console.log("poolCoinTokenAddress: ", poolCoinTokenAddress.toString())
        console.log("poolPcTokenAddress: ", poolPcTokenAddress.toString())

        console.log("serumMarketProgramId: ", serumMarketProgramId.toString())
        console.log("serumMarketAddress: ", serumMarketAddress.toString())
        console.log("serumBidsAddress: ", serumBidsAddress.toString())
        console.log("serumAskAddress: ", serumAskAddress.toString())
        console.log("serumEventQueueAddress: ", serumEventQueueAddress.toString())
        console.log("serumCoinVaultAddress: ", serumCoinVaultAddress.toString())
        console.log("serumPcVaultAddress: ", serumPcVaultAddress.toString())
        console.log("serumVaultSigner: ", serumVaultSigner.toString())

        console.log("vaultAddress: ", vaultAddress.toString())
        console.log("vaultNativeMintAddress: ", vaultNativeMintAddress.toString())
        console.log("vaultTokenAddress: ", vaultTokenAddress.toString())
        console.log("mintAddress: ", mintAddress.toString())
        console.log("ownerAddress: ", ownerAddress.toString())
        console.log("dcaDataAddress: ", dcaDataAddress.toString())
        console.log("nativeMintAddress: ", nativeMintAddress.toString())
        console.log("TokenProgramId: ", TokenProgramId.toString())

        const data = new SwapFromSolData().encode();

        return new TransactionInstruction({
            keys: [
                // amm liquidity pool (raydium)
                AccountMetaBuilder.readonly(DevnetLiquidityProgramIdV4, false),
                AccountMetaBuilder.writable(ammAddress, false),
                AccountMetaBuilder.readonly(ammAuthorityAddress, false),
                AccountMetaBuilder.writable(ammOpenOrderAddress, false),
                AccountMetaBuilder.writable(ammTargetOrderAddress, false),
                AccountMetaBuilder.writable(poolCoinTokenAddress, false),
                AccountMetaBuilder.writable(poolPcTokenAddress, false),

                // serum market
                AccountMetaBuilder.readonly(DevnetSerumProgramIdV3, false),
                AccountMetaBuilder.writable(serumMarketAddress),
                AccountMetaBuilder.writable(serumBidsAddress, false),
                AccountMetaBuilder.writable(serumAskAddress, false),
                AccountMetaBuilder.writable(serumEventQueueAddress, false),
                AccountMetaBuilder.writable(serumCoinVaultAddress, false),
                AccountMetaBuilder.writable(serumPcVaultAddress, false),
                AccountMetaBuilder.readonly(serumVaultSigner, false),

                // users address (raydium)
                AccountMetaBuilder.writable(vaultAddress, false),
                AccountMetaBuilder.writable(vaultNativeMintAddress, false),
                AccountMetaBuilder.writable(vaultTokenAddress, false),

                // (dca)
                AccountMetaBuilder.writable(mintAddress, false),
                AccountMetaBuilder.writable(ownerAddress, false),
                AccountMetaBuilder.writable(dcaDataAddress, false),
                AccountMetaBuilder.writable(nativeMintAddress, false),
                AccountMetaBuilder.readonly(TokenProgramId, false),
            ],
            programId: DcaProgramId,
            data: data
        });
    }


    /**
     * Generate transaction instruction that swap token to sol
     * @param {PublicKey} liquidityProgramId
     * @param {PublicKey} ammAddress
     * @param {PublicKey} ammAuthorityAddress
     * @param {PublicKey} ammOpenOrderAddress
     * @param {PublicKey} ammTargetOrderAddress
     * @param {PublicKey} poolCoinTokenAddress
     * @param {PublicKey} poolPcTokenAddress
     * @param {PublicKey} serumMarketProgramId
     * @param {PublicKey} serumMarketAddress
     * @param {PublicKey} serumBidsAddress
     * @param {PublicKey} serumAskAddress
     * @param {PublicKey} serumEventQueueAddress
     * @param {PublicKey} serumCoinVaultAddress
     * @param {PublicKey} serumPcVaultAddress
     * @param {PublicKey} serumVaultSigner
     * @param {PublicKey} vaultAddress
     * @param {PublicKey} vaultNativeAddress
     * @param {PublicKey} vaultTokenAddress
     * @param {PublicKey} mintAddress
     * @param {PublicKey} ownerAddress
     * @param {PublicKey} dcaDataAddress
     */
    static swapToSol(
        liquidityProgramId,
        ammAddress,
        ammAuthorityAddress,
        ammOpenOrderAddress,
        ammTargetOrderAddress,
        poolCoinTokenAddress,
        poolPcTokenAddress,
        serumMarketProgramId,
        serumMarketAddress,
        serumBidsAddress,
        serumAskAddress,
        serumEventQueueAddress,
        serumCoinVaultAddress,
        serumPcVaultAddress,
        serumVaultSigner,
        vaultAddress,
        vaultNativeMintAddress,
        vaultTokenAddress,
        mintAddress,
        ownerAddress,
        dcaDataAddress,
        nativeMintAddress
    ) {
        if (
            !(liquidityProgramId instanceof PublicKey) &&
            !(ammAddress instanceof PublicKey) &&
            !(ammAuthorityAddress instanceof PublicKey) &&
            !(ammOpenOrderAddress instanceof PublicKey) &&
            !(ammTargetOrderAddress instanceof PublicKey) &&
            !(poolCoinTokenAddress instanceof PublicKey) &&
            !(poolPcTokenAddress instanceof PublicKey) &&
            !(serumMarketProgramId instanceof PublicKey) &&
            !(serumMarketAddress instanceof PublicKey) &&
            !(serumBidsAddress instanceof PublicKey) &&
            !(serumAskAddress instanceof PublicKey) &&
            !(serumEventQueueAddress instanceof PublicKey) &&
            !(serumCoinVaultAddress instanceof PublicKey) &&
            !(serumPcVaultAddress instanceof PublicKey) &&
            !(serumVaultSigner instanceof PublicKey) &&
            !(vaultAddress instanceof PublicKey) &&
            !(vaultNativeMintAddress instanceof PublicKey) &&
            !(vaultTokenAddress instanceof PublicKey) &&
            !(mintAddress instanceof PublicKey) &&
            !(ownerAddress instanceof PublicKey) &&
            !(dcaDataAddress instanceof PublicKey) &&
            !(nativeMintAddress instanceof PublicKey)
        ) {
            throw new TypeError("Invalid argument type.")
        }

        const data = new SwapToSolData().encode();

        return new TransactionInstruction({
            keys: [
                // amm liquidity pool (raydium)
                AccountMetaBuilder.readonly(DevnetLiquidityProgramIdV4, false),
                AccountMetaBuilder.writable(ammAddress, false),
                AccountMetaBuilder.readonly(ammAuthorityAddress, false),
                AccountMetaBuilder.writable(ammOpenOrderAddress, false),
                AccountMetaBuilder.writable(ammTargetOrderAddress, false),
                AccountMetaBuilder.writable(poolCoinTokenAddress, false),
                AccountMetaBuilder.writable(poolPcTokenAddress, false),

                // serum market
                AccountMetaBuilder.readonly(DevnetSerumProgramIdV3, false),
                AccountMetaBuilder.writable(serumMarketAddress),
                AccountMetaBuilder.writable(serumBidsAddress, false),
                AccountMetaBuilder.writable(serumAskAddress, false),
                AccountMetaBuilder.writable(serumEventQueueAddress, false),
                AccountMetaBuilder.writable(serumCoinVaultAddress, false),
                AccountMetaBuilder.writable(serumPcVaultAddress, false),
                AccountMetaBuilder.readonly(serumVaultSigner, false),

                // users address (raydium)
                AccountMetaBuilder.writable(vaultAddress, false),
                AccountMetaBuilder.writable(vaultNativeMintAddress, false),
                AccountMetaBuilder.writable(vaultTokenAddress, false),

                // (dca)
                AccountMetaBuilder.writable(mintAddress, false),
                AccountMetaBuilder.writable(ownerAddress, false),
                AccountMetaBuilder.writable(dcaDataAddress, false),
                AccountMetaBuilder.writable(nativeMintAddress, false),
                AccountMetaBuilder.readonly(TokenProgramId, false),
            ],
            programId: DcaProgramId,
            data: data
        });
    }
} 