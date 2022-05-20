import { Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';
import { serialize } from 'borsh';
import './App.css';

import {
  connection,
  getProvider,
  depositToken,
  // depositSol,
  withdrawSol,
  withdrawToken,
  fundSol,
  fundToken,
  initialize,
  swapFromSol,
  swapToSol,
  fetchAllPoolKeys,
  extendBorsh,
  findDcaDerivedAddress,
  findAssociatedTokenAddress,
  convertToLamports,
  DCA_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  SYSVAR_RENT_PUBKEY,
  TOKEN_PROGRAM_ID
} from "./dca-program";

extendBorsh();

function App() {

  const onDepositTokenClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const mint = "6XSp58Mz6LAi91XKenjQfj9D1MxPEGYtgBkggzYvE8jY";
      const amount = 0.5;

      const { status, data } = await depositToken(
        connection,
        owner,
        mint,
        amount
      );

      console.log(status);
      console.log(data.signature);
      console.log(data.dcaDataAddress);
    } catch (e) {
      console.log(e);
    }
  }


  // const onDepositSolClick = async () => {
  //   try {
  //     const owner = window.solana.publicKey.toBase58();
  //     const mint = "6XSp58Mz6LAi91XKenjQfj9D1MxPEGYtgBkggzYvE8jY";
  //     const amount = 0.5;

  //     const { status, data } = await depositSol(
  //       connection,
  //       owner,
  //       mint,
  //       amount
  //     );

  //     console.log(status);
  //     console.log(data.signature);
  //     console.log(data.dcaDataAddress);

  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  class DepositSolData {
    constructor(amount) {
      this.instruction = 2;
      this.amount = amount;
    }
  }

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

  const onRegularStyleDepositSolClick = async () => {
    try {
      let dcaDataAccount = Keypair.generate();
      const ownerAddress = window.solana.publicKey;
      const mintAddress = new PublicKey("6XSp58Mz6LAi91XKenjQfj9D1MxPEGYtgBkggzYvE8jY");
      const [vaultAddress,] = await findDcaDerivedAddress([ownerAddress.toBuffer(), dcaDataAccount.publicKey.toBuffer()]);
      const [ownerAta,] = await findAssociatedTokenAddress(ownerAddress, mintAddress);
      const [vaultAta,] = await findAssociatedTokenAddress(vaultAddress, mintAddress);
      const amount = convertToLamports(0.5);

      const data = serialize(depositSolSchema, new DepositSolData(amount));

      let txn = new Transaction()
        .add(new TransactionInstruction({
          keys: [
            {
              pubkey: ownerAddress,
              isSigner: true,
              isWritable: true
            },
            {
              pubkey: vaultAddress,
              isSigner: false,
              isWritable: true
            },
            {
              pubkey: TOKEN_PROGRAM_ID,
              isSigner: false,
              isWritable: false
            },
            {
              pubkey: mintAddress,
              isSigner: false,
              isWritable: true
            },
            {
              pubkey: SystemProgram.programId,
              isSigner: false,
              isWritable: false
            },
            {
              pubkey: SYSVAR_RENT_PUBKEY,
              isSigner: false,
              isWritable: false
            },
            {
              pubkey: ownerAta,
              isSigner: false,
              isWritable: true
            },
            {
              pubkey: vaultAta,
              isSigner: false,
              isWritable: true
            },
            {
              pubkey: ASSOCIATED_TOKEN_PROGRAM_ID,
              isSigner: false,
              isWritable: false
            },
            {
              pubkey: dcaDataAccount.publicKey,
              isSigner: true,
              isWritable: true
            },
          ],
          programId: DCA_PROGRAM_ID,
          data: data
        }));

      txn.feePayer = ownerAddress;
      txn.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      txn.partialSign(dcaDataAccount);
      console.log(txn);

      const signedTxn = await window.solana.signTransaction(txn);
      console.log(signedTxn);
      const signature = await connection.sendRawTransaction(signedTxn.serialize());
      await connection.confirmTransaction(signature, "confirmed");

      console.log(signature);

    } catch (e) {
      console.log(e);
    }
  }

  const onInitializeClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const dcaData = "46uSokKg1KWFrEC9HMp1BjrhtiA4BMuMybHBiaeyPPuJ";
      const startTime = Math.floor(Date.now() + 10);
      const dcaAmount = 0.3;
      const dcaTime = Math.floor(Date.now())
      const minimumAmountOut = 0.01;

      const { status, data } = await initialize(
        connection,
        owner,
        dcaData,
        startTime,
        dcaAmount,
        dcaTime,
        minimumAmountOut
      );

      console.log(status);
      console.log(data);

    } catch (e) {
      console.log(e);
    }
  }


  const onWithdrawTokenClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const dcaData = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";
      const mint = "6XSp58Mz6LAi91XKenjQfj9D1MxPEGYtgBkggzYvE8jY";
      const amount = 0.5;

      const { status, data } = await withdrawToken(
        connection,
        owner,
        dcaData,
        mint,
        amount
      );

      console.log(status);
      console.log(data.signature);

    } catch (e) {
      console.log(e);
    }
  }


  const onWithdrawSolClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const dcaData = "46uSokKg1KWFrEC9HMp1BjrhtiA4BMuMybHBiaeyPPuJ";
      const mint = "6XSp58Mz6LAi91XKenjQfj9D1MxPEGYtgBkggzYvE8jY";
      const transferAmount = 0.5;

      const { status, data } = await withdrawSol(
        connection,
        owner,
        mint,
        dcaData,
        transferAmount
      );

      console.log(status);
      console.log(data.signature);

    } catch (e) {
      console.log(e);
    }
  }

  const onFundTokenClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const dcaData = "3v3pd5DiajA111RfZ8RMcMzqxC3kFd3jRodNeLFPpokP";
      const mint = "6XSp58Mz6LAi91XKenjQfj9D1MxPEGYtgBkggzYvE8jY";
      const transferAmount = 0.5;

      const { status, data } = await fundToken(
        connection,
        owner,
        mint,
        dcaData,
        transferAmount
      );

      console.log(status);
      console.log(data.signature);

    } catch (e) {
      console.log(e);
    }
  }

  const onFundSolClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const dcaData = "3v3pd5DiajA111RfZ8RMcMzqxC3kFd3jRodNeLFPpokP";
      const mint = "6XSp58Mz6LAi91XKenjQfj9D1MxPEGYtgBkggzYvE8jY";
      const transferAmount = 0.5;

      const { status, data } = await fundSol(
        connection,
        owner,
        mint,
        dcaData,
        transferAmount
      );

      console.log(status);
      console.log(data.signature);

    } catch (e) {
      console.log(e);
    }
  }

  const onSwapFromSolClick = async () => {
    try {

      // const poolKeysList = Liquidity.fetchAllPoolKeys(); // not working right now
      const poolKeysList = await fetchAllPoolKeys();
      if (!poolKeysList) {
        throw Error("Some error occured in fetching pool keys.")
      }
      const [poolKeys,] = poolKeysList.filter(el => el.quoteMint === "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB" &&
        el.baseMint === "So11111111111111111111111111111111111111112");

      const owner = window.solana.publicKey.toBase58();
      const mint = "6XSp58Mz6LAi91XKenjQfj9D1MxPEGYtgBkggzYvE8jY";

      const accounts = await swapFromSol(
        connection,
        owner,
        mint,
        poolKeys.id
      );
      console.log(accounts);
    } catch (e) {
      console.log(e);
    }
  }

  const onSwapToSolClick = async () => {
    try {
      const poolKeysList = await fetchAllPoolKeys();
      if (!poolKeysList) {
        throw Error("Some error occured in fetching pool keys.")
      }
      const [poolKeys,] = poolKeysList.filter(el => el.quoteMint === "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB" &&
        el.baseMint === "So11111111111111111111111111111111111111112");

      const owner = window.solana.publicKey.toBase58();
      const mint = "6XSp58Mz6LAi91XKenjQfj9D1MxPEGYtgBkggzYvE8jY";

      const accounts = await swapToSol(
        connection,
        owner,
        mint,
        poolKeys.id
      );
      console.log(accounts);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="App">
      <button className='btn' onClick={getProvider}>Connect</button>
      <button className='btn' onClick={onDepositTokenClick}>Deposit Token</button>
      <button className='btn' onClick={onRegularStyleDepositSolClick}>Deposit Sol</button>
      <button className='btn' onClick={onInitializeClick}>Initialize</button>
      <button className='btn' onClick={onWithdrawTokenClick}>Withdraw Token</button>
      <button className='btn' onClick={onWithdrawSolClick}>Withdraw Sol</button>
      <button className='btn' onClick={onFundTokenClick}>Fund Token</button>
      <button className='btn' onClick={onFundSolClick}>Fund Sol</button>
      <button className='btn' onClick={onSwapFromSolClick}>Swap From Sol</button>
      <button className='btn' onClick={onSwapToSolClick}>Swap To Sol</button>
    </div>
  );
}


export default App;
