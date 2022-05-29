import { PublicKey } from '@solana/web3.js';
import { deserializeUnchecked } from 'borsh';
import './App.css';

import {
  connection,
  getProvider,
  depositToken,
  depositSol,
  withdrawSol,
  withdrawToken,
  fundSol,
  fundToken,
  initialize,
  swapFromSol,
  swapToSol,
  DcaAccount,
  dcaAccountSchema,
} from "./dca-program";


function App() {
  const onDepositTokenClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const mint = "6XSp58Mz6LAi91XKenjQfj9D1MxPEGYtgBkggzYvE8jY";
      const amount = 1;

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


  const onDepositSolClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const mint = "8FRFC6MoGGkMFQwngccyu69VnYbzykGeez7ignHVAFSN";
      const amount = 2;

      const { status, data } = await depositSol(
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

  const onInitializeClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const dcaData = "AA5juxiDCffHf6fzJ92sGAJNGRUb3nBub4yDDNZZmq7m";
      const startTime = Math.floor(Date.now() / 1000) + (1 * 60); // add 1 min
      const dcaAmount = 1;
      const dcaTime = 3 * 60  // 3 min
      const minimumAmountOut = 1.5;

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
      console.log(data.signature);

    } catch (e) {
      console.log(e);
    }
  }


  const onWithdrawTokenClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const dcaData = "AA5juxiDCffHf6fzJ92sGAJNGRUb3nBub4yDDNZZmq7m";
      const mint = "8FRFC6MoGGkMFQwngccyu69VnYbzykGeez7ignHVAFSN";
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
      const dcaData = "F99pPHPQomSVma88y6TqpiuaPraYqW8idsJUgpbi1hbY";
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
      const dcaData = "AA5juxiDCffHf6fzJ92sGAJNGRUb3nBub4yDDNZZmq7m";
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
      const owner = window.solana.publicKey.toBase58();
      const mint = "8FRFC6MoGGkMFQwngccyu69VnYbzykGeez7ignHVAFSN";
      const dcaData = "AA5juxiDCffHf6fzJ92sGAJNGRUb3nBub4yDDNZZmq7m";
      const { status, data } = await swapFromSol(
        connection,
        owner,
        mint,
        dcaData
      );
      console.log(status);
      console.log(data.signature);
    } catch (e) {
      console.log(e);
    }
  }

  const onSwapToSolClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const mint = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";
      const dcaData = "46uSokKg1KWFrEC9HMp1BjrhtiA4BMuMybHBiaeyPPuJ";
      const { status, data } = await swapToSol(
        connection,
        owner,
        mint,
        dcaData
      );
      console.log(status);
      console.log(data.signature);
    } catch (e) {
      console.log(e);
    }
  }

  const onDcaDataClick = async () => {
    try {
      const address = "JC64t54rtCjf7txa2MJorteh1NXyU36YSddxjU2JmLN8";
      let dcaAccount = await connection.getAccountInfo(new PublicKey(address), "confirmed");
      console.log(dcaAccount.data);
      let dcaData = deserializeUnchecked(dcaAccountSchema, DcaAccount, dcaAccount.data)
      console.log("Dca Account Data", dcaData);
    } catch (e) {
      console.log("error: ", e);
    }
  }


  return (
    <div className="App">
      <button className='btn' onClick={getProvider}>Connect</button>
      <button className='btn' onClick={onDepositTokenClick}>Deposit Token</button>
      <button className='btn' onClick={onDepositSolClick}>Deposit Sol</button>
      <button className='btn' onClick={onInitializeClick}>Initialize</button>
      <button className='btn' onClick={onWithdrawTokenClick}>Withdraw Token</button>
      <button className='btn' onClick={onWithdrawSolClick}>Withdraw Sol</button>
      <button className='btn' onClick={onFundTokenClick}>Fund Token</button>
      <button className='btn' onClick={onFundSolClick}>Fund Sol</button>
      <button className='btn' onClick={onSwapFromSolClick}>Swap From Sol</button>
      <button className='btn' onClick={onSwapToSolClick}>Swap To Sol</button>
      <button className='btn' onClick={onDcaDataClick}>Get Dca Account Data</button>
    </div>
  );
}


export default App;
