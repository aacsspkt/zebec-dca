
import { useState } from 'react';
import './App.css';
// import { extendBorsh } from "./dca-program/utils/borshExtension";


import {
  connection,
  getProvider,
  // depositToken,
  depositSol,
  withdrawSol,
  withdrawToken,
  fundSol,
  fundToken,
  initialize,
  depositToken
  // swapFromSol,
  // swapToSol
} from "./dca-program";



function App() {


  const [dcaAddress, setDcaAddress] = useState("");

  const onDepositTokenClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const mint = "6XSp58Mz6LAi91XKenjQfj9D1MxPEGYtgBkggzYvE8jY";
      const amount = 0.5;

      const { status, data } = await depositToken(connection, owner, mint, amount);
      console.log(status);
      console.log(data.signature);
      console.log(data.dcaDataAddress);
      setDcaAddress(data.dcaDataAddress);
    } catch (e) {
      console.log(e);
    }
  }


  const onDepositSolClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const mint = "6XSp58Mz6LAi91XKenjQfj9D1MxPEGYtgBkggzYvE8jY";
      const amount = 0.5;

      const { status, data } = await depositSol(connection, owner, mint, amount);
      console.log(status);
      console.log(data.signature);
      console.log(data.dcaDataAddress);
      setDcaAddress(data.dcaDataAddress);

    } catch (e) {
      console.log(e);
    }
  }




  const onWithdrawTokenClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const mint = "6XSp58Mz6LAi91XKenjQfj9D1MxPEGYtgBkggzYvE8jY";
      const amount = 0.5;
      const { status, data } = await withdrawToken(connection, owner, dcaAddress, mint, amount);
      console.log(status);
      console.log(data.signature);
    } catch (e) {
      console.log(e);
    }
  }

  const onInitializeClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const startTime = Math.floor(Date.now() + 10);
      const dcaAmount = 0.5;
      const dcaTime = Math.floor(Date.now())
      const minimumAmountOut = 0.1;
      const { status, data } = initialize(
        connection,
        owner,
        dcaAddress,
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

  const onWithdrawSolClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const mint = "6XSp58Mz6LAi91XKenjQfj9D1MxPEGYtgBkggzYvE8jY";
      const transferAmount = 0.5;
      const { status, data } = await withdrawSol(connection, owner, mint, dcaAddress, transferAmount);
      console.log(status);
      console.log(data.signature);

    } catch (e) {
      console.log(e);
    }
  }

  const onFundTokenClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const mint = "6XSp58Mz6LAi91XKenjQfj9D1MxPEGYtgBkggzYvE8jY";
      const transferAmount = 0.5;
      const { status, data } = await fundToken(connection, owner, mint, dcaAddress, transferAmount);
      console.log(status);
      console.log(data.signature);

    } catch (e) {
      console.log(e);
    }
  }

  const onFundSolClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const mint = "6XSp58Mz6LAi91XKenjQfj9D1MxPEGYtgBkggzYvE8jY";
      const transferAmount = 0.5;
      const { status, data } = await fundSol(connection, owner, mint, dcaAddress, transferAmount);
      console.log(status);
      console.log(data.signature);

    } catch (e) {
      console.log(e);
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
    </div>
  );
}


export default App;
