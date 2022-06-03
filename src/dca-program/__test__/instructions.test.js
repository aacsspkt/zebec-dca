import { PublicKey, SystemProgram } from "@solana/web3.js"
import BN from "bn.js";
import { DcaProgramId, AssociatedTokenProgramId, TokenProgramId, NativeMint, SysvarRent, connection, DevnetLiquidityProgramIdV4, DevnetSerumProgramIdV3 } from "../constants";
import { DepositSolData, DepositTokenData, FundSolData, FundTokenData, InitializeData, SwapFromSolData, SwapToSolData, WithdrawSolData, WithdrawTokenData } from "../instructionData";
import { DcaInstruction } from "../instructions";
import { AccountMetaBuilder, fetchPoolKeysDevnet, findAssociatedTokenAddress, findDcaDerivedAddress } from "../utils";


describe("intruction test", () => {

    const owner = new PublicKey("DS2tt4BX7YwCw7yrDNwbAdnYrxjeCPeGJbHmZEYC8RTb");
    const dcaData = new PublicKey("9cf445gfnu7ZnKQXMRrddkBN8xvozFk5n8dDVusr4xoK");
    const mint = new PublicKey("5swt9oXbzr57dmPMZniWFoETYotCpbT7bpYbYViFGuoN");

    test("depositSol instruction test", async () => {

        const [vault,] = await findDcaDerivedAddress([owner.toBuffer(), dcaData.toBuffer()]);
        const [ownerAta,] = await findAssociatedTokenAddress(owner, mint);
        const [vaultAnma,] = await findAssociatedTokenAddress(vault, NativeMint);
        const [vaultAta,] = await findAssociatedTokenAddress(vault, mint);
        const amount = new BN("500000000");

        const actual = DcaInstruction.depositSol(
            owner,
            vault,
            mint,
            NativeMint,
            ownerAta,
            vaultAnma,
            vaultAta,
            dcaData,
            amount
        );

        const data = new DepositSolData(amount).encode();

        const keys = [
            AccountMetaBuilder.writable(owner, true),
            AccountMetaBuilder.writable(vault, false),
            AccountMetaBuilder.readonly(TokenProgramId, false),
            AccountMetaBuilder.writable(mint, false),
            AccountMetaBuilder.writable(NativeMint, false),
            AccountMetaBuilder.readonly(SystemProgram.programId, false),
            AccountMetaBuilder.readonly(SysvarRent, false),
            AccountMetaBuilder.writable(ownerAta, false),
            AccountMetaBuilder.writable(vaultAnma, false),
            AccountMetaBuilder.writable(vaultAta, false),
            AccountMetaBuilder.readonly(AssociatedTokenProgramId, false),
            AccountMetaBuilder.writable(dcaData, true),
        ];

        expect(actual.keys).toEqual(keys);
        expect(actual.data).toEqual(data);
        expect(actual.programId).toEqual(new PublicKey(DcaProgramId));
    });

    test("depositToken instruction test", async () => {
        const [vault,] = await findDcaDerivedAddress([owner.toBuffer(), dcaData.toBuffer()]);
        const [ownerAta,] = await findAssociatedTokenAddress(owner, mint);
        const [vaultAnma,] = await findAssociatedTokenAddress(vault, NativeMint);
        const [vaultAta,] = await findAssociatedTokenAddress(vault, mint);
        const amount = new BN("500000000");

        const actual = DcaInstruction.depositToken(
            owner,
            vault,
            mint,
            NativeMint,
            ownerAta,
            vaultAta,
            vaultAnma,
            dcaData,
            amount
        );

        const data = new DepositTokenData(amount).encode();

        const keys = [
            AccountMetaBuilder.writable(owner, true),
            AccountMetaBuilder.writable(vault, false),
            AccountMetaBuilder.readonly(TokenProgramId, false),
            AccountMetaBuilder.writable(mint, false),
            AccountMetaBuilder.writable(NativeMint, false),
            AccountMetaBuilder.readonly(SystemProgram.programId, false),
            AccountMetaBuilder.readonly(SysvarRent, false),
            AccountMetaBuilder.writable(ownerAta, false),
            AccountMetaBuilder.writable(vaultAta, false),
            AccountMetaBuilder.writable(vaultAnma, false),
            AccountMetaBuilder.readonly(AssociatedTokenProgramId, false),
            AccountMetaBuilder.writable(dcaData, true),
        ];

        expect(actual.keys).toEqual(keys);
        expect(actual.data).toEqual(data);
        expect(actual.programId).toEqual(new PublicKey(DcaProgramId));
    });


    test("initialize intruction test", async () => {
        const [vault,] = await findDcaDerivedAddress([owner.toBuffer(), dcaData.toBuffer()]);
        const startTime = new BN("1243452342")
        const dcaAmount = new BN("1234123512")
        const dcaTime = new BN("3000")
        const minAmountOut = new BN("1234123512")

        const actual = DcaInstruction.initialize(owner, vault, dcaData, startTime, dcaAmount, dcaTime, minAmountOut);

        const keys = [
            AccountMetaBuilder.writable(owner, true),
            AccountMetaBuilder.writable(vault, false),
            AccountMetaBuilder.writable(dcaData, false),
        ];

        const data = new InitializeData(startTime, dcaAmount, dcaTime, minAmountOut).encode();

        expect(actual.data).toEqual(data);
        expect(actual.keys).toEqual(keys);
        expect(actual.programId).toEqual(DcaProgramId);
    })

    test("swapFromSol instruction test", async () => {
        const [vault,] = await findDcaDerivedAddress([owner.toBuffer(), dcaData.toBuffer()]);
        const [vaultAnma,] = await findAssociatedTokenAddress(vault, NativeMint);
        const [vaultAta,] = await findAssociatedTokenAddress(vault, mint);
        const poolId = new PublicKey("384zMi9MbUKVUfkUdrnuMfWBwJR9gadSxYimuXeJ9DaJ");
        const poolKeys = await fetchPoolKeysDevnet(connection, poolId);
        const amount = new BN("100000000");
        const actual = DcaInstruction.swapFromSol(
            poolKeys.programId,
            poolKeys.id,
            poolKeys.authority,
            poolKeys.openOrders,
            poolKeys.targetOrders,
            poolKeys.baseVault,
            poolKeys.quoteVault,
            poolKeys.marketProgramId,
            poolKeys.marketId,
            poolKeys.marketBids,
            poolKeys.marketAsks,
            poolKeys.marketEventQueue,
            poolKeys.marketBaseVault,
            poolKeys.marketQuoteVault,
            poolKeys.marketAuthority,
            vault,
            vaultAnma,
            vaultAta,
            mint,
            owner,
            dcaData,
            NativeMint,
            amount
        );

        const data = new SwapFromSolData(amount).encode();

        const keys = [
            AccountMetaBuilder.readonly(poolKeys.programId, false),
            AccountMetaBuilder.writable(poolKeys.id, false),
            AccountMetaBuilder.readonly(poolKeys.authority, false),
            AccountMetaBuilder.writable(poolKeys.openOrders, false),
            AccountMetaBuilder.writable(poolKeys.targetOrders, false),
            AccountMetaBuilder.writable(poolKeys.baseVault, false),
            AccountMetaBuilder.writable(poolKeys.quoteVault, false),
            AccountMetaBuilder.readonly(poolKeys.marketProgramId, false),
            AccountMetaBuilder.writable(poolKeys.marketId, false),
            AccountMetaBuilder.writable(poolKeys.marketBids, false),
            AccountMetaBuilder.writable(poolKeys.marketAsks, false),
            AccountMetaBuilder.writable(poolKeys.marketEventQueue, false),
            AccountMetaBuilder.writable(poolKeys.marketBaseVault, false),
            AccountMetaBuilder.writable(poolKeys.marketQuoteVault, false),
            AccountMetaBuilder.readonly(poolKeys.marketAuthority, false),
            AccountMetaBuilder.writable(vault, false),
            AccountMetaBuilder.writable(vaultAnma, false),
            AccountMetaBuilder.writable(vaultAta, false),
            AccountMetaBuilder.writable(mint, false),
            AccountMetaBuilder.writable(owner, false),
            AccountMetaBuilder.writable(dcaData, false),
            AccountMetaBuilder.writable(NativeMint, false),
            AccountMetaBuilder.readonly(TokenProgramId, false),
        ];

        expect(actual.data).toEqual(data);
        expect(actual.keys).toEqual(keys);
        expect(actual.programId).toEqual(DcaProgramId);
    });

    test("swapToSol instruction test", async () => {
        const [vault,] = await findDcaDerivedAddress([owner.toBuffer(), dcaData.toBuffer()]);
        const [vaultAnma,] = await findAssociatedTokenAddress(vault, NativeMint);
        const [vaultAta,] = await findAssociatedTokenAddress(vault, mint);
        const poolId = new PublicKey("384zMi9MbUKVUfkUdrnuMfWBwJR9gadSxYimuXeJ9DaJ");
        const poolKeys = await fetchPoolKeysDevnet(connection, poolId);
        const amount = new BN("100000000")
        const actual = DcaInstruction.swapToSol(
            poolKeys.programId,
            poolKeys.id,
            poolKeys.authority,
            poolKeys.openOrders,
            poolKeys.targetOrders,
            poolKeys.baseVault,
            poolKeys.quoteVault,
            poolKeys.marketProgramId,
            poolKeys.marketId,
            poolKeys.marketBids,
            poolKeys.marketAsks,
            poolKeys.marketEventQueue,
            poolKeys.marketBaseVault,
            poolKeys.marketQuoteVault,
            poolKeys.marketAuthority,
            vault,
            vaultAnma,
            vaultAta,
            mint,
            owner,
            dcaData,
            NativeMint,
            amount
        );

        const data = new SwapToSolData(amount).encode();
        const keys = [
            AccountMetaBuilder.readonly(poolKeys.programId, false),
            AccountMetaBuilder.writable(poolKeys.id, false),
            AccountMetaBuilder.readonly(poolKeys.authority, false),
            AccountMetaBuilder.writable(poolKeys.openOrders, false),
            AccountMetaBuilder.writable(poolKeys.targetOrders, false),
            AccountMetaBuilder.writable(poolKeys.baseVault, false),
            AccountMetaBuilder.writable(poolKeys.quoteVault, false),
            AccountMetaBuilder.readonly(poolKeys.marketProgramId, false),
            AccountMetaBuilder.writable(poolKeys.marketId, false),
            AccountMetaBuilder.writable(poolKeys.marketBids, false),
            AccountMetaBuilder.writable(poolKeys.marketAsks, false),
            AccountMetaBuilder.writable(poolKeys.marketEventQueue, false),
            AccountMetaBuilder.writable(poolKeys.marketBaseVault, false),
            AccountMetaBuilder.writable(poolKeys.marketQuoteVault, false),
            AccountMetaBuilder.readonly(poolKeys.marketAuthority, false),
            AccountMetaBuilder.writable(vault, false),
            AccountMetaBuilder.writable(vaultAnma, false),
            AccountMetaBuilder.writable(vaultAta, false),
            AccountMetaBuilder.writable(mint, false),
            AccountMetaBuilder.writable(owner, false),
            AccountMetaBuilder.writable(dcaData, false),
            AccountMetaBuilder.writable(NativeMint, false),
            AccountMetaBuilder.readonly(TokenProgramId, false),
        ];

        expect(actual.data).toEqual(data);
        expect(actual.keys).toEqual(keys);
        expect(actual.programId).toEqual(DcaProgramId);
    });

    test("withdrawToken instruction test", async () => {
        const [vault,] = await findDcaDerivedAddress([owner.toBuffer(), dcaData.toBuffer()]);
        const [ownerAta,] = await findAssociatedTokenAddress(owner, mint);
        const [vaultAta,] = await findAssociatedTokenAddress(vault, mint);
        const amount = new BN("3000000");

        const actual = DcaInstruction.withdrawToken(
            owner,
            vault,
            mint,
            ownerAta,
            vaultAta,
            dcaData,
            amount
        );
        const keys = [
            AccountMetaBuilder.writable(owner, true),
            AccountMetaBuilder.writable(vault, false),
            AccountMetaBuilder.readonly(TokenProgramId, false),
            AccountMetaBuilder.writable(mint, false),
            AccountMetaBuilder.readonly(SystemProgram.programId, false),
            AccountMetaBuilder.readonly(SysvarRent, false),
            AccountMetaBuilder.writable(ownerAta, false),
            AccountMetaBuilder.writable(vaultAta, false),
            AccountMetaBuilder.readonly(AssociatedTokenProgramId, false),
            AccountMetaBuilder.writable(dcaData, false),
        ];
        const data = new WithdrawTokenData(amount).encode();

        expect(actual.data).toEqual(data);
        expect(actual.keys).toEqual(keys);
        expect(actual.programId).toEqual(DcaProgramId);
    });

    test("withdrawSol instruction", async () => {
        const [vault,] = await findDcaDerivedAddress([owner.toBuffer(), dcaData.toBuffer()]);
        const [ownerAta,] = await findAssociatedTokenAddress(owner, mint);
        const [ownerAnma,] = await findAssociatedTokenAddress(owner, NativeMint);
        const [vaultAta,] = await findAssociatedTokenAddress(vault, mint);
        const [vaultAnma,] = await findAssociatedTokenAddress(vault, NativeMint);
        const amount = new BN("3000000");

        const actual = DcaInstruction.withdrawSol(
            owner,
            vault,
            mint,
            ownerAta,
            vaultAta,
            dcaData,
            NativeMint,
            vaultAnma,
            ownerAnma,
            amount
        );

        const data = new WithdrawSolData(amount).encode();
        const keys = [
            AccountMetaBuilder.writable(owner, true),
            AccountMetaBuilder.writable(vault, false),
            AccountMetaBuilder.readonly(TokenProgramId, false),
            AccountMetaBuilder.writable(mint, false),
            AccountMetaBuilder.readonly(SystemProgram.programId, false),
            AccountMetaBuilder.readonly(SysvarRent, false),
            AccountMetaBuilder.writable(ownerAta, false),
            AccountMetaBuilder.writable(vaultAta, false),
            AccountMetaBuilder.readonly(AssociatedTokenProgramId, false),
            AccountMetaBuilder.writable(dcaData, true),
            AccountMetaBuilder.writable(NativeMint, true),
            AccountMetaBuilder.writable(vaultAnma, true),
            AccountMetaBuilder.writable(ownerAnma, false),
        ];

        expect(actual.data).toEqual(data);
        expect(actual.keys).toEqual(keys);
        expect(actual.programId).toEqual(DcaProgramId);
    });

    test("fundToken instruction test", async () => {
        const [vault,] = await findDcaDerivedAddress([owner.toBuffer(), dcaData.toBuffer()]);
        const [ownerAta,] = await findAssociatedTokenAddress(owner, mint);
        const [vaultAta,] = await findAssociatedTokenAddress(vault, mint);
        const amount = new BN("5000000000");

        const actual = DcaInstruction.fundToken(
            owner,
            vault,
            mint,
            ownerAta,
            vaultAta,
            dcaData,
            amount
        );

        const data = new FundTokenData(amount).encode();

        const keys = [
            AccountMetaBuilder.writable(owner, true),
            AccountMetaBuilder.writable(vault, false),
            AccountMetaBuilder.readonly(TokenProgramId, false),
            AccountMetaBuilder.writable(mint, false),
            AccountMetaBuilder.readonly(SystemProgram.programId, false),
            AccountMetaBuilder.readonly(SysvarRent, false),
            AccountMetaBuilder.writable(ownerAta, false),
            AccountMetaBuilder.writable(vaultAta, false),
            AccountMetaBuilder.readonly(AssociatedTokenProgramId, false),
            AccountMetaBuilder.writable(dcaData, false),
        ];

        expect(actual.data).toEqual(data);
        expect(actual.keys).toEqual(keys);
        expect(actual.programId).toEqual(DcaProgramId);
    });

    test("fundSol intruction test", async () => {
        const [vault,] = await findDcaDerivedAddress([owner.toBuffer(), dcaData.toBuffer()]);
        const [ownerAta,] = await findAssociatedTokenAddress(owner, mint);
        const [vaultAta,] = await findAssociatedTokenAddress(vault, mint);
        const [vaultAnma,] = await findAssociatedTokenAddress(vault, NativeMint);

        const amount = new BN("5000000000");

        const actual = DcaInstruction.fundSol(
            owner,
            vault,
            mint,
            NativeMint,
            ownerAta,
            vaultAnma,
            vaultAta,
            dcaData,
            amount
        );

        const data = new FundSolData(amount).encode();

        const keys = [
            AccountMetaBuilder.writable(owner, true),
            AccountMetaBuilder.writable(vault, false),
            AccountMetaBuilder.readonly(TokenProgramId, false),
            AccountMetaBuilder.writable(mint, false),
            AccountMetaBuilder.writable(NativeMint, false),
            AccountMetaBuilder.readonly(SystemProgram.programId, false),
            AccountMetaBuilder.readonly(SysvarRent, false),
            AccountMetaBuilder.writable(ownerAta, false),
            AccountMetaBuilder.writable(vaultAnma, false),
            AccountMetaBuilder.writable(vaultAta, false),
            AccountMetaBuilder.readonly(AssociatedTokenProgramId, false),
            AccountMetaBuilder.writable(dcaData, false),
        ];

        expect(actual.data).toEqual(data);
        expect(actual.keys).toEqual(keys);
        expect(actual.programId).toEqual(DcaProgramId);
    });
});




